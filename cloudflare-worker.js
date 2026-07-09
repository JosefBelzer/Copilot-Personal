/**
 * Copilot Personal Worker — Cloudflare Worker v1.4.1
 *
 * Endpoints:
 *   POST /v1/validate              — License key validation (called by plugin)
 *   POST /webhook/lemon-squeezy    — Lemon Squeezy purchase webhook
 *   GET  /health                    — Health check
 *
 * KV Namespace: LICENSES
 *   license:{key}           → { email, status, devices, createdAt }
 *
 * Secrets (via `wrangler secret put`):
 *   LEMONSQUEEZY_SECRET     — Lemon Squeezy webhook signing secret
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const FREE_FEATURES = ["chat_basic", "read_note", "read_pdf", "find_files"];
const PRO_FEATURES = [
  "chat_unlimited", "agent_mode", "all_tools", "web_search",
  "pdf_images", "rag_semantic", "export_chat", "slash_commands",
  "multi_provider", "priority_support"
];

const MAX_DEVICES_PER_LICENSE = 3;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Signature",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function error(message, status = 400) {
  return json({ valid: false, error: message }, status);
}

function now() {
  return Math.floor(Date.now() / 1000);
}

// ─── KV helpers ──────────────────────────────────────────────────────────────

async function getLicense(env, key) {
  const raw = await env.LICENSES.get(key);
  return raw ? JSON.parse(raw) : null;
}

async function putLicense(env, key, record) {
  await env.LICENSES.put(key, JSON.stringify(record));
}

// ─── Timing-safe string comparison ───────────────────────────────────────────

/**
 * Constant-time comparison to prevent timing attacks on secret tokens.
 * Uses HMAC-SHA256 to ensure comparison takes the same time regardless of input.
 */
async function constantTimeCompare(a, b) {
  if (a.length !== b.length) return false; // Early exit on length mismatch (safe)
  const enc = new TextEncoder();
  const keyBytes = enc.encode(a); // Use first input as HMAC key
  const msgBytes = enc.encode(b); // Sign second input
  try {
    const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sigA = await crypto.subtle.sign("HMAC", key, keyBytes);
    const sigB = await crypto.subtle.sign("HMAC", key, msgBytes);
    return arraysEqual(new Uint8Array(sigA), new Uint8Array(sigB));
  } catch {
    return false;
  }
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

// ─── HMAC Webhook Verification ───────────────────────────────────────────────

async function verifyWebhookSignature(secret, rawBody, signatureHeader) {
  if (!secret || !signatureHeader) return false;

  try {
    const enc = new TextEncoder();
    const keyData = enc.encode(secret);
    const msgData = enc.encode(rawBody);
    const cryptoKey = await crypto.subtle.importKey(
      "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const sigBytes = new Uint8Array(
      signatureHeader.match(/.{1,2}/g).map(b => parseInt(b, 16))
    );
    return await crypto.subtle.verify("HMAC", cryptoKey, sigBytes, msgData);
  } catch {
    return false;
  }
}

// ─── POST /v1/validate ───────────────────────────────────────────────────────

async function handleValidate(request, env) {
  let body;
  try { body = await request.json(); } catch { return error("Invalid JSON body"); }

  const { key, fingerprint, pluginVersion } = body;
  if (!key || !fingerprint) return error("Missing key or fingerprint");

  // --- DEMO key (development only) ---
  if (key === "COPIPRO-DEMO-DEMO-DEMO") {
    return json({
      valid: true,
      tier: "pro",
      expiresAt: now() + 365 * 24 * 3600,
      features: PRO_FEATURES,
      demo: true,
    });
  }

  // --- FREE tier ---
  if (!key || key === "FREE") {
    return json({
      valid: true,
      tier: "free",
      expiresAt: 0,
      features: FREE_FEATURES,
    });
  }

  // --- Look up license in KV (key directly from Lemon Squeezy) ---
  const record = await getLicense(env, key);

  if (!record) {
    return json({
      valid: false,
      tier: "free",
      reason: "not_found",
      error: "La clave de licencia introducida no existe.",
    });
  }

  // --- Status check ---
  if (record.status !== "active") {
    return json({
      valid: false,
      tier: "free",
      reason: "inactive",
      error: "Esta suscripción no está activa o ha caducado.",
    });
  }

  // --- Device limit (anti-sharing) with TOCTOU-safe re-verify ---
  if (!Array.isArray(record.devices)) record.devices = [];

  const isKnownDevice = record.devices.includes(fingerprint);

  if (!isKnownDevice) {
    if (record.devices.length >= MAX_DEVICES_PER_LICENSE) {
      return json({
        valid: false,
        tier: "free",
        reason: "device_limit",
        error: "Has alcanzado el límite máximo de dispositivos para esta licencia.",
        maxDevices: MAX_DEVICES_PER_LICENSE,
      });
    }

    // Register new device
    record.devices.push(fingerprint);
  }

  await putLicense(env, key, record);

  // Re-read and verify to handle concurrent registration race
  const verifyRecord = await getLicense(env, key);
  if (verifyRecord && verifyRecord.devices.length > MAX_DEVICES_PER_LICENSE) {
    // Race condition: another request registered simultaneously. Remove this fingerprint.
    record.devices = record.devices.filter(d => d !== fingerprint);
    await putLicense(env, key, record);
    return json({
      valid: false,
      tier: "free",
      reason: "device_limit",
      error: "Límite de dispositivos alcanzado. Intente de nuevo.",
      maxDevices: MAX_DEVICES_PER_LICENSE,
    });
  }

  if (isKnownDevice) console.log(`[License] Known device for ${key.substring(0, 8)}...`);
  else console.log(`[License] New device registered for ${key.substring(0, 8)}...`);

  return json({
    valid: true,
    tier: "pro",
    expiresAt: now() + 365 * 24 * 3600,
    features: PRO_FEATURES,
    email: record.email,
  });
}

// ─── POST /webhook/lemon-squeezy ─────────────────────────────────────────────

/**
 * Receives purchase notifications from Lemon Squeezy.
 *
 * Uses the license_key generated by Lemon Squeezy natively
 * (Configure this in Lemon Squeezy → Products → Settings → Generate license keys).
 *
 * Events handled:
 *   - license_key_created        → Store new license + order index
 *   - subscription_created       → Same as license_key_created (fallback)
 *   - subscription_cancelled     → Revoke license via order_id index
 *   - subscription_expired       → Same as cancelled
 */
async function handleLemonSqueezyWebhook(request, env) {
  const rawBody = await request.text();

  // Verify Lemon Squeezy webhook signature
  const signature = request.headers.get("X-Signature");
  const secret = env.LEMONSQUEEZY_SECRET;

  if (secret) {
    if (!signature) return error("Missing webhook signature", 401);
    const valid = await verifyWebhookSignature(secret, rawBody, signature);
    if (!valid) return error("Invalid webhook signature", 403);
  }

  let body;
  try { body = JSON.parse(rawBody); } catch { return error("Invalid JSON body"); }

  const eventName = body.meta?.event_name || "unknown";
  console.log(`[Webhook] ${eventName} — order_id: ${body.data?.attributes?.order_id || "(none)"}`);

  // ── CASE 1: License key created ─────────────────────────────────────────

  if (eventName === "license_key_created" || eventName === "subscription_created") {
    const attributes = body.data?.attributes;
    const licenseKey = attributes?.key; // In this event, the key is in 'key'
    const email = attributes?.user_email || "unknown";
    const orderId = attributes?.order_id;

    if (!licenseKey) {
      console.warn("[Webhook] No 'key' field in license_key_created payload.");
      return json({ success: false, error: "No key found in payload" }, 400);
    }

    const licenseData = {
      email,
      status: "active",
      createdAt: new Date().toISOString(),
      orderId,
      devices: [],
    };

    // Store the license using the UUID as the primary key
    await putLicense(env, licenseKey, licenseData);

    // Create secondary index: order_id → license_key (for cancellation)
    if (orderId) {
      await env.LICENSES.put(`order:${orderId}`, licenseKey);
    }

    console.log(`[License] Created ${licenseKey.substring(0, 8)}... → ${email.substring(0, 4)}... (order: ${orderId})`);
    return json({ success: true, message: "License key registered successfully" }, 201);
  }

  // ── CASE 2: Subscription cancelled ──────────────────────────────────────

  if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
    const orderId = body.data?.attributes?.order_id;

    if (!orderId) {
      console.warn("[Webhook] No order_id in cancellation payload");
      return json({ success: false, error: "No order_id found" }, 400);
    }

    // Look up which license key belongs to this order
    const licenseKey = await env.LICENSES.get(`order:${orderId}`);

    if (licenseKey) {
      const licenseData = await getLicense(env, licenseKey);
      if (licenseData) {
        licenseData.status = "cancelled";
        licenseData.cancelledAt = new Date().toISOString();
        await putLicense(env, licenseKey, licenseData);
        console.log(`[License] Cancelled ${licenseKey.substring(0, 8)}... (order: ${orderId})`);
      }
    } else {
      console.log(`[Webhook] No license found for order ${orderId}`);
    }

    return json({ success: true, message: "License revoked" });
  }

  // ── Unhandled events (subscription_created, etc.) ────────────────────────

  console.log(`[Webhook] Unhandled event: ${eventName}`);
  return json({ success: true, message: "Event ignored" });
}

// ─── GET /health ─────────────────────────────────────────────────────────────

async function handleHealth() {
  return json({
    status: "ok",
    version: "1.4.1",
    uptime: Math.floor(performance.now() / 1000),
    timestamp: now(),
  });
}

// ─── POST /admin/insert-license (for testing) ────────────────────────────────

/**
 * Manually insert a license key for testing (no webhook needed).
 * Protected by ADMIN_SECRET set via `wrangler secret put ADMIN_SECRET`.
 *
 * Body: { key: "uuid-from-lemon-squeezy", email: "test@example.com" }
 * Header: Authorization: Bearer <ADMIN_SECRET>
 */
async function handleAdminInsert(request, env) {
  // Admin auth with timing-safe comparison
  const auth = request.headers.get("Authorization") || "";
  const adminSecret = env.ADMIN_SECRET;
  if (!adminSecret) return error("Admin not configured", 500);

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const valid = await constantTimeCompare(token, adminSecret);
  if (!valid) return error("Unauthorized", 403);

  let body;
  try { body = await request.json(); } catch { return error("Invalid JSON body"); }

  const { key, email } = body;
  if (!key || !email) return error("Missing key or email");

  const existing = await getLicense(env, key);
  if (existing) return json({ success: false, error: "Key already exists" }, 409);

  const licenseData = {
    email,
    status: "active",
    createdAt: new Date().toISOString(),
    orderId: "admin-manual",
    devices: [],
  };

  await putLicense(env, key, licenseData);
  console.log(`[Admin] Manually inserted license ${key} → ${email}`);

  return json({ success: true, key, email }, 201);
}

// ─── POST /admin/reset-devices ────────────────────────────────────────────────

/**
 * Clear all registered devices for a license key.
 * Allows the user to re-activate on new devices.
 *
 * Body: { key: "uuid" }
 * Header: Authorization: Bearer <ADMIN_SECRET>
 */
async function handleAdminResetDevices(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const adminSecret = env.ADMIN_SECRET;
  if (!adminSecret) return error("Admin not configured", 500);

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const valid = await constantTimeCompare(token, adminSecret);
  if (!valid) return error("Unauthorized", 403);

  let body;
  try { body = await request.json(); } catch { return error("Invalid JSON body"); }

  const { key } = body;
  if (!key) return error("Missing key");

  const existing = await getLicense(env, key);
  if (!existing) return error("License key not found", 404);

  existing.devices = [];
  await putLicense(env, key, existing);
  console.log(`[Admin] Devices reset for ${key.substring(0, 8)}...`);

  return json({ success: true, message: "Devices reset. License can be activated on new devices." });
}

// ─── Budget state (KV: budget:{licenseKey}) ───────────────────────────

const BUDGET_LIMITS = {
  tokens: 250_000,
  queries: 50,
  costDollars: 0.03,
};

async function getBudgetState(env, licenseKey) {
  const raw = await env.LICENSES.get(`budget:${licenseKey}`);
  if (!raw) return { dailyTokens: 0, dailyQueries: 0, lastReset: getToday() };
  try { return JSON.parse(raw); } catch { return { dailyTokens: 0, dailyQueries: 0, lastReset: getToday() }; }
}

async function saveBudgetState(env, licenseKey, state) {
  await env.LICENSES.put(`budget:${licenseKey}`, JSON.stringify(state));
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

// ─── POST /v1/budget-chat (Pro + Free trial) ────────────────────────

async function handleBudgetChat(request, env) {
  const budgetApiKey = env.BUDGET_API_KEY;
  if (!budgetApiKey) return error("Budget API not configured", 500);

  let body;
  try { body = await request.json(); } catch { return error("Invalid JSON body"); }

  const { messages, licenseKey: rawKey, fingerprint, tools, stream } = body;
  if (!messages) return error("Missing messages");
  // Free trial: empty string, "FREE", or missing Pro license → treat as free trial
  const licenseKey = (!rawKey || rawKey === "FREE") ? "FREE" : rawKey;

  // Determine if this is Pro or Free trial
  const license = await getLicense(env, licenseKey);
  const isPro = license && license.status === "active";
  const isFreeTrial = !isPro && licenseKey === "FREE" && fingerprint;
  let freeTrialUsed = 0;
  let budget = null;
  const today = getToday();

  if (!isPro && !isFreeTrial) {
    return error("Valid Pro license required for budget API", 403);
  }

  if (isFreeTrial) {
    // Free trial: max 5 queries/day per fingerprint
    const freeKey = `free:${fingerprint}:${today}`;
    const freeRaw = await env.LICENSES.get(freeKey);
    freeTrialUsed = parseInt(freeRaw || "0");

    if (freeTrialUsed >= 5) {
      return error("Free trial limit reached (5/day). Upgrade to Pro for unlimited Copilot AI.", 429);
    }
    console.log(`[FreeTrial] ${fingerprint} — ${freeTrialUsed + 1}/5 today`);
  } else {
    // Pro: device tracking
    if (fingerprint) {
      if (!Array.isArray(license.devices)) license.devices = [];
      if (!license.devices.includes(fingerprint)) {
        if (license.devices.length >= 3) {
          return error("Device limit reached (3). Deactivate old devices first.", 429);
        }
        license.devices.push(fingerprint);
        await putLicense(env, licenseKey, license);
      }
      console.log(`[Budget] Devices: ${license.devices.length}/3`);
    }

    // Pro: budget limits
    budget = await getBudgetState(env, licenseKey);
    if (budget.lastReset !== today) {
      budget = { dailyTokens: 0, dailyQueries: 0, lastReset: today };
    }
    if (budget.dailyTokens >= BUDGET_LIMITS.tokens) {
      return error("Daily token limit reached", 429);
    }
    if (budget.dailyQueries >= BUDGET_LIMITS.queries) {
      return error("Daily query limit reached", 429);
    }
  }

  // ── Call OpenRouter ──────────────────────────────────────────────────
  const apiUrl = env.BUDGET_API_URL || "https://openrouter.ai/api/v1/chat/completions";
  const budgetModel = body.model || env.BUDGET_MODEL || "mistralai/mistral-nemo";
  const who = isPro ? `Pro ${licenseKey.substring(0,8)}...` : `Free trial ${fingerprint.substring(0,8)}`;

  console.log(`[Budget] ${who} → ${budgetModel} — ${freeTrialUsed+1}/5 free, or ${budget?.dailyQueries??0}/${BUDGET_LIMITS.queries} queries`);

  try {
    // Retry on 429 (OpenRouter rate limit) with exponential backoff: 5s, 10s, 20s
    let apiResponse = null;
    let lastError = null;
    const delays = [5000, 10000, 20000];
    for (let retry = 0; retry <= delays.length; retry++) {
      if (retry > 0) await new Promise(r => setTimeout(r, delays[retry - 1]));
      apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${budgetApiKey}`,
          "HTTP-Referer": "https://github.com/JosefBelzer/Copilot-Personal",
          "X-Title": "Copilot Personal (Obsidian Plugin)",
        },
        body: JSON.stringify({
          model: budgetModel,
          messages,
          temperature: 0.3,
          max_tokens: 32768,
          ...(stream ? { stream: true } : {}),
          ...(tools ? { tools, tool_choice: "auto" } : {}),
        }),
      });
      if (apiResponse.status === 429) {
        lastError = apiResponse;
        console.log(`[Budget] 429 rate limit, retry ${retry + 1}/${delays.length} after ${delays[retry] || 0}ms`);
        continue;
      }
      lastError = null;
      break;
    }
    if (lastError) {
      console.error(`[Budget] Rate limit exceeded after ${delays.length} retries`);
      return error("Budget API rate limit reached. Try again in 30 seconds.", 429);
    }

    // Helper: increment counter after successful API response
    async function incrementCounter() {
      if (isFreeTrial) {
        const freeKey = `free:${fingerprint}:${today}`;
        const raw = await env.LICENSES.get(freeKey);
        const count = parseInt(raw || "0");
        await env.LICENSES.put(freeKey, String(count + 1), { expirationTtl: 86400 });
      } else if (budget) {
        budget.dailyQueries++;
        await saveBudgetState(env, licenseKey, budget);
      }
    }

    // Streaming mode — relay SSE directly to client
    if (stream) {
      if (!apiResponse.ok) {
        console.error(`[Budget Stream] API error ${apiResponse.status}`);
        return error(`Budget API error (${apiResponse.status})`, 502);
      }
      await incrementCounter();
      console.log(`[Budget Stream] Streaming to client`);
      return new Response(apiResponse.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming — parse JSON and track tokens
    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error(`[Budget] API error ${apiResponse.status}: ${errText.substring(0, 200)}`);
      return error(`Budget API error (${apiResponse.status})`, 502);
    }

    const data = await apiResponse.json();
    const content = data.choices?.[0]?.message?.content || "";
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    const usage = data.usage || { total_tokens: 0 };

    // Empty response without tool calls: don't count query, return error
    if (!content && !toolCalls) {
      console.error("[Budget] Empty response from model");
      return error("Empty response from AI model. Try rephrasing your request.", 422);
    }

    // If model returned tool calls but caller didn't send tools, convert to text
    if (toolCalls && !tools) {
      const names = toolCalls.map(t => t.function?.name || "unknown").join(", ");
      const fallback = `I'd like to use the following tools: ${names}. However, the budget AI is in text-only mode. For complex tasks with tools, switch to Agent Mode or use your own API key in Settings → Provider.`;
      await incrementCounter();
      return json({ content: fallback, usage, model: budgetModel, budget: { dailyTokens: budget?.dailyTokens??0, limitTokens: BUDGET_LIMITS.tokens, dailyQueries: budget?.dailyQueries??0, limitQueries: BUDGET_LIMITS.queries, resetsAt: today + "T23:59:59Z", freeTrial: isFreeTrial ? { used: freeTrialUsed + 1, limit: 5 } : undefined } }, 200);
    }

    // Update counters
    await incrementCounter();
    if (!isFreeTrial && budget) {
      budget.dailyTokens += usage.total_tokens || 0;
      await saveBudgetState(env, licenseKey, budget);
    }
    console.log(`[Budget] OK — ${usage.total_tokens} tokens`);

    return json({
      content,
      usage,
      model: budgetModel,
      ...(toolCalls ? { toolCalls } : {}),
      budget: {
        dailyTokens: budget?.dailyTokens ?? 0,
        limitTokens: BUDGET_LIMITS.tokens,
        dailyQueries: budget?.dailyQueries ?? 0,
        limitQueries: BUDGET_LIMITS.queries,
        resetsAt: today + "T23:59:59Z",
        freeTrial: isFreeTrial ? { used: freeTrialUsed + 1, limit: 5 } : undefined,
      },
    }, 200);
  } catch (err) {
    console.error("[Budget] Fetch failed:", err.message);
    return error("Budget API unreachable", 503);
  }
}

// ─── POST /v1/budget-usage (returns current consumption for UI) ────────

async function handleBudgetUsage(request, env) {
  let body;
  try { body = await request.json(); } catch { return error("Invalid JSON body"); }

  const { licenseKey: rawKey, fingerprint } = body;
  // Free trial: empty string or "FREE" → return free trial data
  const licenseKey = (!rawKey || rawKey === "FREE") ? "FREE" : rawKey;
  if (!licenseKey) return error("Missing licenseKey");

  const license = await getLicense(env, licenseKey);
  const isPro = license && license.status === "active";
  const isFreeTrial = !isPro && licenseKey === "FREE";

  if (!isPro && !isFreeTrial) {
    return error("Valid license required", 403);
  }

  if (isFreeTrial && fingerprint) {
    // Return free trial usage
    const today = getToday();
    const freeKey = `free:${fingerprint}:${today}`;
    const raw = await env.LICENSES.get(freeKey);
    const used = parseInt(raw || "0");
    return json({
      freeTrial: true,
      freeUsed: used,
      freeLimit: 5,
      resetsAt: today + "T23:59:59Z",
    });
  }

  const budget = await getBudgetState(env, licenseKey);
  const today = getToday();
  if (budget.lastReset !== today) Object.assign(budget, { dailyTokens: 0, dailyQueries: 0, lastReset: today });

  return json({
    dailyTokens: budget.dailyTokens,
    limitTokens: BUDGET_LIMITS.tokens,
    dailyQueries: budget.dailyQueries,
    limitQueries: BUDGET_LIMITS.queries,
    resetsAt: today + "T23:59:59Z",
  });
}

// ─── Router ──────────────────────────────────────────────────────────────────

async function handleRequest(request, env) {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Signature",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const url = new URL(request.url);

  // Health check
  if (request.method === "GET" && url.pathname === "/health") {
    return handleHealth();
  }

  // License validation — called by the Obsidian plugin
  if (request.method === "POST" && url.pathname === "/v1/validate") {
    return handleValidate(request, env);
  }

  // Lemon Squeezy webhook — called when a user purchases
  if (request.method === "POST" && url.pathname === "/webhook/lemon-squeezy") {
    return handleLemonSqueezyWebhook(request, env);
  }

  // Admin — manually insert a test license key
  if (request.method === "POST" && url.pathname === "/admin/insert-license") {
    return handleAdminInsert(request, env);
  }

  // Admin — reset devices for a license key
  if (request.method === "POST" && url.pathname === "/admin/reset-devices") {
    return handleAdminResetDevices(request, env);
  }

  // Also accept the old path for backwards compatibility
  if (request.method === "POST" && url.pathname === "/v1/webhooks/lemonsqueezy") {
    return handleLemonSqueezyWebhook(request, env);
  }

  // Budget API — proxied chat (API key never leaves the Worker)
  if (request.method === "POST" && url.pathname === "/v1/budget-chat") {
    return handleBudgetChat(request, env);
  }

  // Budget usage — return current consumption for UI
  if (request.method === "POST" && url.pathname === "/v1/budget-usage") {
    return handleBudgetUsage(request, env);
  }

  return json({ error: "Not found" }, 404);
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env);
    } catch (err) {
      console.error("[Worker] Unhandled error:", err.message || err);
      return json({ valid: false, error: "Internal server error" }, 500);
    }
  },
};
