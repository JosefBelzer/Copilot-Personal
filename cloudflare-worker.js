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

  // --- Device limit (anti-sharing) ---
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

    console.log(`[License] Created ${licenseKey} → ${email} (order: ${orderId})`);
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
        console.log(`[License] Cancelled ${licenseKey} (order: ${orderId})`);
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

  // Also accept the old path for backwards compatibility
  if (request.method === "POST" && url.pathname === "/v1/webhooks/lemonsqueezy") {
    return handleLemonSqueezyWebhook(request, env);
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
