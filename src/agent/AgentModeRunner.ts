import { ToolRegistry, ToolDefinition } from "./ToolRegistry";
import { LLMProvider } from "../LLMProviders/providerTypes";
import { LLMMessage } from "../LLMProviders/types";
import { ContextCompactor } from "./ContextCompactor";
import { ContextLayers } from "./ContextLayers";
import { PlanTracker } from "./PlanTracker";
import { ToolRouter } from "./ToolRouter";

export interface AgentEvent {
  type: "tool-start" | "tool-end";
  toolName: string;
  data?: string;
}

type AgentEventListener = (event: AgentEvent) => void;

const MAX_ITERATIONS = 10;
const BASE_SYSTEM_PROMPT = `You are a tool-using agent inside Obsidian. Your ONLY job: read sources → verify facts → write notes.

## RESPONSE FORMAT — BINARY CHOICE
(A) I need data → {"tool_call": {"name": "tool_name", "arguments": {...}}}
(B) I'm done → final answer (use <!--save:path.md--> for long content)

NEVER output anything else. No plans, no descriptions, no markdown unless it's the final answer.

## MANDATORY CHECKLIST BEFORE ANSWERING
Before choosing (B), confirm ALL of these are true:
1. If the user mentioned a PDF → I called read_pdf and READ the exact pages.
2. If I wrote wiki-links → I verified they exist with find_files AND used [[double brackets]].
3. If I'm populating a note → I used <!--save:path.md--> or update_note.
If any is false → choose (A).

## OBSIDIAN WIKI-LINKS — CRITICAL
Obsidian uses [[Note Name]] for internal links. NEVER use Markdown links like [text](url) for vault notes. The correct format is [[folder/Note Name]] or [[Note Name]]. Example: [[01_03_Nichtqualitaet_als_Unternehmensrisiko]] NOT [01_03...](app://...)

## RULES
- Follow the PLAN above. Execute the → step. Do NOT skip ahead or repeat done steps.
- PDFs: ONLY read if the PLAN says so. Use pagesOnly for specific pages.
- Links: find_files to verify. Always use [[double brackets]].
- Paths: NEVER guess. Use find_files first.
- Write content: start with <!--save:folder/NoteName.md--> on its own line.`;

// Model-specific adapter prompts — each model family has different failure modes.
// Based on obsidian-copilot-master's model adapter pattern.
const MODEL_ADAPTERS: Record<string, string> = {
  deepseek: `\n## DEEPSEEK-SPECIFIC RULES
- You tend to be overly verbose. Be CONCISE. Short sentences. No repetition.
- You often output "planning text" like "Voy a..." instead of tool calls. NEVER do this. If you need to act, output ONLY the JSON.
- After tool results, do NOT describe what you found — either call another tool or give the final answer.
- You have a strong tendency to write full responses instead of tool calls. RESIST THIS. Make the tool call.
- STOP after tool calls. The system will provide results. Do NOT write anything else.`,

  lmstudio: `\n## LOCAL-MODEL RULES (LM Studio / Ollama)
- You are running locally. Be fast and direct.
- DO NOT produce thinking/reasoning tokens. Go straight to action.
- If unsure about a tool, call it anyway — you'll get an error if it fails.
- Small models may hallucinate. ONLY write facts you got from tool results, never from training data.
- If you don't know a note name, call find_files. NEVER guess.`,

  openai: `\n## OPENAI RULES
- Use tools aggressively. OpenAI models are good at tool selection.
- At most 2 tool calls per response.
- Be concise in final answers.`,

  generic: `\n## CRITICAL REMINDERS
- After a tool result, you MUST either call another tool or give a final answer. Nothing in between.
- If you write "Voy a...", "I'll now...", "Let me..." — you are WRONG. Output the tool_call JSON instead.
- Shortcut: if you need to read a note, call read_note NOW. Don't describe it.
- Shortcut: if you need to read a PDF, call read_pdf NOW. Don't describe it.`,
};

function buildSystemPrompt(providerType: string): string {
  const adapter = MODEL_ADAPTERS[providerType] || MODEL_ADAPTERS.generic;
  return BASE_SYSTEM_PROMPT + adapter;
}

interface ApiToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

interface ApiMessage {
  role: string;
  content: string | null;
  tool_calls?: ApiToolCall[];
  tool_call_id?: string;
  name?: string;
}

export class AgentModeRunner {
  private listeners: AgentEventListener[] = [];
  private provider: LLMProvider;
  private compactor: ContextCompactor;
  private currentTaskQuery: string = "";
  private planTracker: PlanTracker;
  contextLayers: ContextLayers;

  constructor(provider: LLMProvider) {
    this.provider = provider;
    this.compactor = new ContextCompactor(provider);
    this.planTracker = new PlanTracker();
    this.contextLayers = new ContextLayers();
  }

  on(listener: AgentEventListener) {
    this.listeners.push(listener);
  }

  off(listener: AgentEventListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private emit(event: AgentEvent) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        // ignore listener errors
      }
    }
  }

  async run(
    messages: LLMMessage[],
    toolRegistry: ToolRegistry,
    maxIterations: number = MAX_ITERATIONS,
    userQuery?: string,
    expectedNotes: number = 0
  ): Promise<string> {
    // Collect tool-specific custom instructions for the system prompt
    const customToolInstructions = toolRegistry
      .getAllTools()
      .filter(t => t.customPromptInstructions)
      .map(t => t.customPromptInstructions)
      .join("\n");

    // Build conversation: preserve original system messages merged with tool instructions
    const originalSystem = messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");

    // Use the explicit userQuery if provided (from handleAgentChat), otherwise
    // extract the last user message from history. The explicit parameter ensures
    // the CURRENT query is always correct even when buildContext skips the last
    // user message to avoid duplication in multi-turn chats.
    this.currentTaskQuery = userQuery?.substring(0, 500) ?? "";
    if (!this.currentTaskQuery) {
      const userMsgs = messages.filter((m) => m.role === "user");
      this.currentTaskQuery = (userMsgs[userMsgs.length - 1]?.content ?? "")
        .substring(0, 500);
    }

    const taskReminder = this.currentTaskQuery
      ? `\n\nCURRENT TASK (do NOT lose focus): ${this.currentTaskQuery}`
      : "";

    // Route tools based on query classification (LLM-driven, not regex)
    const router = new ToolRouter(this.provider, (toolRegistry as any).tools);
    const routed = await router.route(this.currentTaskQuery);
    const routedToolDefs = routed.tools;

    // Auto-scale maxIterations based on estimated task size
    const effectiveMaxIter = this.estimateIterations(
      this.currentTaskQuery,
      routed.categories,
      maxIterations
    );

    this.planTracker.setGoal(this.currentTaskQuery);

    const wikiCount = this.estimateTaskItems(this.currentTaskQuery);
    const batchNote = effectiveMaxIter > maxIterations || wikiCount >= 3
      ? `\nBATCH MODE: ${wikiCount} items. Do NOT stop until ALL are done. Use create_note or update_note for each.`
      : "";

    const planState = this.planTracker.getStateText();

    const systemPrompt = buildSystemPrompt(this.provider.providerType);
    const customInstructions = customToolInstructions
      ? `\n\n## TOOL-SPECIFIC RULES\n${customToolInstructions}`
      : "";
    const categoryNote = routed.categories.length > 0
      ? `\n\nACTIVE TOOL CATEGORIES: ${routed.categories.join(", ")} (${routedToolDefs.length} tools). ONLY use these tools.${batchNote}`
      : "";
    const mergedSystem = originalSystem
      ? `${systemPrompt}${customInstructions}${categoryNote}${planState}\n\nAdditional context:\n${originalSystem}${taskReminder}`
      : `${systemPrompt}${customInstructions}${categoryNote}${planState}${taskReminder}`;

    // Build conversation with turn separation — previous assistant responses
    // are wrapped with markers so the model knows they're historical context,
    // not part of the current task it should be executing.
    const historyMsgs = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role,
        content: m.role === "assistant" && m.content.length > 500
          ? `[PREVIOUS TURN RESPONSE — for context only, do NOT re-execute]:\n${m.content.substring(0, 2000)}${m.content.length > 2000 ? `\n[...truncated...]` : ""}`
          : m.content,
      }));

    const conversation: ApiMessage[] = [
      { role: "system", content: mergedSystem },
      ...historyMsgs,
    ];

    let iterations = 0;
    let planningCorrections = 0;
    let alreadyReadCount = 0;
    let lastPlanningText = "";
    const maxIter = effectiveMaxIter;
    const readSet = new Set<string>();
    let planCompleteWarned = false;
    let writeCount = 0;

    while (iterations < maxIter) {
      iterations++;

      // If plan is complete, force final answer
      if (this.planTracker.isComplete() && !planCompleteWarned) {
        planCompleteWarned = true;
        conversation.push({
          role: "user",
          content: `All planned steps are complete. Provide your final answer now.`,
        });
      }

      // Auto-compact context if extremely large (20K+ tokens).
      // Only compacts old assistant messages, never tool results.
      // Raised from 12K to 20K to prevent losing freshly-extracted tool data.
      // Skip compaction entirely for the first 2 iterations (tools need full data).
      if (iterations > 2 && this.compactor.estimateTokens(conversation) > 20000) {
        try {
          const compacted = await this.compactor.compact(conversation, 18000);
          if (compacted) {
            conversation.length = 0;
            conversation.push(...compacted);
          }
        } catch {
          // Fallback: remove old tool results if compaction fails
          this.cleanContext(conversation);
        }
      }

      // Call the LLM with tools
      const responseStr = await this.callLLMWithTools(conversation, routedToolDefs);

      // Parse the response to check for tool calls
      const parsed = this.parseResponse(responseStr);

      if (!parsed.toolCalls || parsed.toolCalls.length === 0) {
        // No tool calls detected. Check if this is planning-only text (model describing
        // what it WILL do instead of actually doing it via tool_call).
        const text = (parsed.content || responseStr || "").trim();
        const hasPlanningIntent = iterations < maxIter - 1 && looksLikePlanning(text);

        if (hasPlanningIntent) {
          planningCorrections++;
          // Detect repetition: if the model outputs the same planning text twice,
          // it's stuck in a loop. Force it to conclude.
          const isRepeat = text === lastPlanningText;
          lastPlanningText = text;

      if (planningCorrections > 2 || isRepeat || iterations > maxIter - 2) {
        // Stuck — force synthesis WITHOUT tools.
        conversation.push({
          role: "user",
          content: `ALL tools are now DISABLED. You have enough information. Based ONLY on what's already in this conversation, provide your final answer NOW using <!--save:path.md--> to save. Use [[wiki-links]]. Do NOT call tools.`,
        });
        const forcedResponse = await this.callLLMWithTools(conversation, []);
        const forcedParsed = this.parseResponse(forcedResponse);
        const forcedText = (forcedParsed.content || forcedResponse || "").trim();
        if (forcedText) return forcedText;
        continue;
      }

          // Model is describing a plan instead of executing it.
          // Inject a correction prompt and loop back so it makes the actual tool call.
          conversation.push({
            role: "user",
            content: `You described what you plan to do next but did NOT make a tool call. Do NOT describe your plan or repeat what you already said — output ONLY a JSON tool_call now:\n{"tool_call": {"name": "tool_name", "arguments": {...}}}\n\nExecute the action NOW. Do NOT write any other text.`,
          });
          continue;
        }

        // No tool calls and no planning intent — this is the final response
        if (!text) {
          return "I completed the analysis but couldn't generate a final response. The vault may not contain enough information on this topic. Try indexing the vault first, or ask a more specific question.";
        }
        // Check if the model claims completion but didn't write all notes
        if (expectedNotes >= 2 && writeCount < expectedNotes && /\b(todas|todos|all|complet|listo|done|finished|9 de 9|8 de 8)\b/i.test(text)) {
          conversation.push({
            role: "user",
            content: `You claimed completion but only wrote ${writeCount} of ${expectedNotes} notes. Use create_note or update_note to write the remaining ${expectedNotes - writeCount} notes NOW.`,
          });
          continue;
        }
        // Strip hallucinated tags from final answer
        return text
          .replace(/<environment_details>[\s\S]*?<\/environment_details>/gi, "")
          .replace(/<environment_details>[\s\S]*/gi, "")
          .trim();
      }

      // Auto-promote L3→L2 every N turns
      const toolResults = conversation
        .filter((m) => m.role === "tool")
        .map((m) => m.content ?? "");
      this.contextLayers.afterTurn(
        parsed.content || responseStr || "",
        toolResults
      );

      // Process each tool call
      for (const tc of parsed.toolCalls) {
        const toolName = tc.function?.name;
        if (!toolName) continue;

        this.emit({ type: "tool-start", toolName });

        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(tc.function?.arguments || "{}");
        } catch (err) {
          console.error("[AgentModeRunner] Failed to parse tool arguments, skipping:", tc.function?.arguments, err);
          continue;
        }

        let result = await toolRegistry.executeTool(toolName, args);

        // Detect duplicate reads/renders — prevent the model from wasting iterations
        const filePath = (args.path as string) || (args.title as string) || "";
        const isReadTool = toolName === "read_note" || toolName === "read_pdf";
        const isRenderTool = toolName === "render_pdf_pages" || toolName === "extract_pdf_images";
        const pageRange = (args.pages || args.pagesOnly || "") as string;
        const dedupeKey = isRenderTool && pageRange ? `${filePath}::${pageRange}` : filePath;

        if ((isReadTool || isRenderTool) && dedupeKey && !result.startsWith("Error")) {
          if (readSet.has(dedupeKey)) {
            alreadyReadCount++;
            const hint = toolName === "read_pdf" && !pageRange ? " Use pagesOnly for specific pages." : "";
            const forceWrite = alreadyReadCount >= 3 ? " You already have all needed data. STOP reading and START writing notes NOW." : "";
            result = `[ALREADY DONE — ${toolName} already executed.${hint}${forceWrite} Do NOT call ${toolName} again.]\n${result}`;
          }
          readSet.add(dedupeKey);
        }

        // If model has been re-reading 3+ times, FORCE a correction prompt
        // instead of executing yet another [ALREADY DONE] tool call.
        if (alreadyReadCount >= 3 && (isReadTool || isRenderTool) && filePath && readSet.has(dedupeKey)) {
          conversation.push({
            role: "user",
            content: `STOP calling ${toolName}. You ALREADY have this data. IMMEDIATELY write the notes using create_note or update_note. Do NOT read anything else.`,
          });
          continue;
        }

        this.emit({ type: "tool-end", toolName, data: result });

        // Advance the execution plan
        this.planTracker.advanceStep(toolName, args, result);

        // Track write operations for completion verification
        if (toolName === "create_note" || toolName === "update_note") {
          writeCount++;
        }

        // Detect deviation from plan
        if (this.planTracker.isDeviation(toolName, args)) {
          conversation.push({
            role: "user",
            content: `⚠️ You are deviating from the plan. Check the PLAN above — execute the → step.`,
          });
        }

        // Add assistant tool_call message + tool result to conversation
        conversation.push({
          role: "assistant",
          content: null,
          tool_calls: [tc],
        });

        conversation.push({
          role: "tool",
          content: result,
          tool_call_id: tc.id || `call_${toolName}_${Date.now()}`,
          name: toolName,
        });
      }
    }

    // If we exceeded max iterations, ask the LLM for a final response
      conversation.push({
        role: "user",
        content: "You have reached the maximum number of actions. Based on ALL tool results received so far, provide a complete final answer NOW. Summarize what you found. Do NOT ask for more information or describe what you would do next — this is your FINAL response.",
      });

    const finalResponse = await this.callLLMWithTools(conversation, []);
    const parsedFinal = this.parseResponse(finalResponse);
    let result = (parsedFinal.content || finalResponse || "").trim();
    // Strip hallucinated XML tags from the final response too (belt-and-suspenders)
    result = result
      .replace(/<environment_details>[\s\S]*?<\/environment_details>/gi, "")
      .replace(/<environment_details>[\s\S]*/gi, "")
      .replace(/<tool_code>[\s\S]*?<\/tool_code>/gi, "")
      .replace(/<tool_call>[\s\S]*?<\/tool_call>/gi, "")
      .trim();
    return result || "I reached the maximum number of tool calls. Based on what I found, the vault may not have enough information. Try being more specific or indexing additional notes.";
  }

  private async callLLMWithTools(
    messages: ApiMessage[],
    tools: ToolDefinition[]
  ): Promise<string> {
    // Convert to LLMMessage format. Tool messages are injected as user
    // messages since raw tool roles aren't supported by all providers via requestUrl.
    // Assistant messages that only contain tool_calls (no content) are skipped.
    const llmMessages: LLMMessage[] = [];

    for (const m of messages) {
      if (m.role === "tool") {
        // Inject tool result as a new user message so the model
        // understands it's external data, not its own output.
        // Force a binary decision to prevent planning-fluff responses.
        const taskLine = this.currentTaskQuery ? `\nTASK: ${this.currentTaskQuery.substring(0, 300)}` : "";
        const itemCount = (this.currentTaskQuery.match(/\[\[([^\]]+)\]\]/g)?.length ?? 0);
        const countCheck = itemCount >= 2 ? ` ALL ${itemCount} notes saved? ☐` : " Content saved? ☐";
        const decisionPrompt = `\n\n⚠️ DECIDE NOW:\n(A) Still need data? → {"tool_call": {...}}\n(B) ALL sources read AND links verified AND${countCheck} → final answer`;
        const toolResult = `[Tool result from '${m.name ?? "unknown"}':]\n${m.content ?? "(no output)"}${taskLine}${decisionPrompt}`;
        llmMessages.push({ role: "user", content: toolResult });
      } else if (m.role === "system" || m.role === "user") {
        llmMessages.push({
          role: m.role,
          content: m.content ?? "",
        });
      } else if (m.role === "assistant") {
        // Skip empty assistant messages (they only carried tool_calls)
        if (m.content) {
          llmMessages.push({ role: "assistant", content: m.content });
        }
        // tool_call-only messages are silently skipped
      }
    }

    // We inject tool info into the system prompt since not all providers
    // support native tool calling via requestUrl
    if (tools.length > 0) {
      const systemIdx = llmMessages.findIndex((m) => m.role === "system");
      const toolDescriptions = tools
        .map(
          (t) =>
            `- ${t.function.name}: ${t.function.description}. Parameters: ${JSON.stringify(t.function.parameters)}`
        )
        .join("\n");

      const toolPrompt = `\n\nAVAILABLE TOOLS:\n${toolDescriptions}\n\nTO USE A TOOL: output ONLY {"tool_call": {"name": "...", "arguments": {...}}} with no other text.`;

      if (systemIdx >= 0) {
        llmMessages[systemIdx].content += toolPrompt;
      } else {
        llmMessages.unshift({ role: "system", content: toolPrompt });
      }
    }

    // Pass tools natively when available (provider-native function calling).
    // When tools=[], no tools are passed (final answer / anti-stuck mode).
    const nativeTools = tools.length > 0
      ? tools.map(t => ({ type: "function" as const, function: { name: t.function.name, description: t.function.description, parameters: t.function.parameters } }))
      : undefined;

    const response = await this.provider.chat(llmMessages, nativeTools);

    // If the provider returned native tool calls, wrap them in our JSON format
    if (nativeTools && response.startsWith('{"tool_calls":')) {
      return response; // Already in our format
    }
    // Strip hallucinated XML tags at the source — before parseResponse or any
    // other code path ever sees the raw response.
    return response
      .replace(/<environment_details>[\s\S]*?<\/environment_details>/gi, "")
      .replace(/<environment_details>[\s\S]*/gi, "")
      .replace(/<tool_code>[\s\S]*?<\/tool_code>/gi, "")
      .replace(/<tool_call>[\s\S]*?<\/tool_call>/gi, "")
      .trim();
  }

  private estimateTokens(conversation: ApiMessage[]): number {
    let total = 0;
    for (const msg of conversation) {
      total += (msg.content ?? "").length + 50; // rough estimate: ~4 chars per token + overhead
    }
    return Math.ceil(total / 4);
  }

  /**
   * Remove old tool results to keep context focused.
   * Keeps system message, last 2 user messages, last assistant response,
   * and at most 3 recent tool interactions.
   */
  /**
   * Estimate the number of task items from the user's query.
   * Works with: [[wiki-links]], bullet lists (- item), numbered lists (1. item),
   * comma-separated items, and newline-separated items.
   */
  private estimateTaskItems(query: string): number {
    // [[wiki-links]]
    const wikiCount = (query.match(/\[\[([^\]]+)\]\]/g)?.length ?? 0);
    if (wikiCount >= 2) return wikiCount;

    // Bullet or numbered list items
    const listItems = (query.match(/^[\s]*[-*•]\s+.+$/gm)?.length ?? 0) ||
                      (query.match(/^[\s]*\d+[\.\)]\s+.+$/gm)?.length ?? 0);
    if (listItems >= 2) return listItems;

    // Comma-separated items (but not in natural sentences)
    const commaItems = query.split(/,\s*(?=\w)/g).filter(s => s.trim().length > 10).length;
    if (commaItems >= 3) return commaItems;

    // Multiple newline-separated lines that look like items
    const lines = query.split("\n").filter(l => l.trim().length > 5);
    if (lines.length >= 4) return lines.length;

    return 1; // single task
  }

  /**
   * Estimate the number of agent iterations needed based on task type and size.
   * Base iterations + extra per item, capped to prevent runaway loops.
   */
  private estimateIterations(
    query: string,
    categories: string[],
    defaultMax: number
  ): number {
    const items = this.estimateTaskItems(query);
    const hasPDF = /\bpdf\b|\.pdf/i.test(query);

    // Per-category iteration cost per item
    let iterPerItem = 1; // default: 1 iteration per item

    if (categories.includes("write")) iterPerItem = 1; // create_note = 1 call
    if (categories.includes("read") && hasPDF) iterPerItem = 2; // read_note + read_pdf
    if (categories.includes("search") && hasPDF) iterPerItem = 3; // find_files + read + write
    if (categories.includes("media")) iterPerItem += 1; // render + analyze

    const estimated = Math.ceil(items * iterPerItem) + 3; // +3 for overhead
    const max = 40; // hard cap to prevent runaway

    return Math.max(defaultMax, Math.min(max, estimated));
  }

  private cleanContext(conversation: ApiMessage[]) {
    if (conversation.length <= 5) return;

    const systemMsg = conversation.find(m => m.role === "system");
    const userMsgs = conversation.filter(m => m.role === "user");
    const assistantMsgs = conversation.filter(m => m.role === "assistant" && m.content);
    const toolMsgs = conversation.filter(m => m.role === "tool");

    // Keep: system + last 2 user + last assistant response + last 3 tool results
    const keep: ApiMessage[] = [];
    if (systemMsg) keep.push(systemMsg);
    if (userMsgs.length > 0) keep.push(userMsgs[userMsgs.length - 1]); // last user query
    if (assistantMsgs.length > 0) keep.push(assistantMsgs[assistantMsgs.length - 1]); // last assistant response
    if (toolMsgs.length > 0) {
      keep.push({ role: "user", content: `[Earlier tool results summarized: ${toolMsgs.length} operations completed]` });
    }

    conversation.length = 0;
    conversation.push(...keep);
  }
  private parseResponse(response: string): {
    content: string | null;
    toolCalls: ApiToolCall[] | null;
  } {
    // Strip hallucinated XML tags BEFORE any parsing — this is the last-resort
    // defense. callLLMWithTools also strips, but parseResponse must be self-contained.
    let clean = response
      .replace(/<environment_details>[\s\S]*?<\/environment_details>/gi, "")
      .replace(/<environment_details>[\s\S]*/gi, "")
      .replace(/<tool_code>[\s\S]*?<\/tool_code>/gi, "")
      .replace(/<tool_call>[\s\S]*?<\/tool_call>/gi, "")
      .trim();

    // Strip "(A) I need data →" planning prefix that models output as text
    clean = clean.replace(/^\(A\).*?→\s*/i, "").trim();

    // Strategy 0: Native tool call response from provider
    const nativeMatch = clean.match(/^\{"tool_calls":\s*(\[[\s\S]*\])\}$/);
    if (nativeMatch) {
      try {
        const toolCalls = JSON.parse(nativeMatch[1]);
        return { content: null, toolCalls };
      } catch { /* fall through */ }
    }

    // Strategy 1: Extract ALL tool calls from the response (supports multiple)
    const allCalls = this.extractAllToolCalls(clean);
    if (allCalls.length > 0) {
      return { content: null, toolCalls: allCalls };
    }

    // Strategy 2: Strip markdown code fences
    const codeBlockMatch = clean.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      const inner = this.extractAllToolCalls(codeBlockMatch[1]);
      if (inner.length > 0) {
        return { content: null, toolCalls: inner };
      }
    }

    // Strategy 3: Handle XML-like tool_call blocks (<tool_call>name: ...</tool_call>)
    const xmlMatch = clean.match(/<tool_call>\s*\{?\s*"name"\s*:\s*"([^"]+)"\s*,\s*"arguments"\s*:\s*(\{[^}]+\})\s*\}?\s*<\/tool_call>/);
    if (xmlMatch) {
      try {
        const args = JSON.parse(xmlMatch[2]);
        return {
          content: null,
          toolCalls: [{
            id: `call_${xmlMatch[1]}_${Date.now()}`,
            type: "function",
            function: { name: xmlMatch[1], arguments: JSON.stringify(args) },
          }],
        };
      } catch (err) {
        console.warn("[AgentModeRunner] XML tool_call parsing failed:", err);
      }
    }

    return { content: clean, toolCalls: null };
  }

  /**
   * Extract all tool_call JSON objects from a response string.
   * Handles multiple concatenated JSON objects like: {...}\n{...}
   */
  private extractAllToolCalls(text: string): ApiToolCall[] {
    const results: ApiToolCall[] = [];
    // Find each JSON object containing tool_call
    const regex = /\{\s*"tool_?call"\s*:\s*\{/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const startIdx = match.index;
      const extracted = this.extractBalancedJson(text, startIdx);
      const jsonStr = extracted ?? text.slice(startIdx);

      // Try to parse directly
      let parsed: any = null;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        // Try balancing
        const balanced = this.tryBalanceJson(jsonStr);
        if (balanced) {
          try { parsed = JSON.parse(balanced); } catch { /* balanced parse also failed */ }
        }
        // Last resort: try regex extraction of name + arguments
        if (!parsed) {
          const nameMatch = jsonStr.match(/"name"\s*:\s*"([^"]+)"/);
          const argsMatch = jsonStr.match(/"arguments"\s*:\s*(\{[^}]*\})/);
          if (nameMatch && argsMatch) {
            try {
              const args = JSON.parse(argsMatch[1]);
              parsed = { tool_call: { name: nameMatch[1], arguments: args } };
            } catch { /* regex extraction parse failed */ }
          }
        }
        if (!parsed) {
          console.warn("[AgentModeRunner] All JSON extraction strategies failed for:", jsonStr.substring(0, 120));
        }
      }

      if (parsed?.tool_call?.name) {
        results.push({
          id: `call_${parsed.tool_call.name}_${Date.now()}_${results.length}`,
          type: "function",
          function: {
            name: parsed.tool_call.name,
            arguments: JSON.stringify(parsed.tool_call.arguments || {}),
          },
        });
      }
    }

    return results;
  }

  /**
   * Starting from a position that contains `{"tool_call":`, extract
   * the full JSON object by counting braces until balanced.
   */
  private extractBalancedJson(text: string, startIdx: number): string | null {
    let depth = 0;
    let inString = false;
    let escape = false;
    let i = startIdx;

    for (; i < text.length; i++) {
      const ch = text[i];
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"' && !inString) { inString = true; continue; }
      if (ch === '"' && inString) { inString = false; continue; }
      if (inString) continue;
      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0) {
          return text.slice(startIdx, i + 1);
        }
      }
    }

    // If we hit end of string with depth > 0, the JSON may be truncated.
    // Return whatever we have so tryBalanceJson can fix it.
    if (depth > 0 && depth <= 3) {
      return text.slice(startIdx);
    }

    return null; // truly unbalanced
  }

  /**
   * Try to parse a single tool call from a JSON string (legacy, for simple cases).
   */
  private tryExtractToolCall(jsonStr: string): { content: null; toolCalls: ApiToolCall[] } | null {
    const calls = this.extractAllToolCalls(jsonStr);
    if (calls.length > 0) {
      return { content: null, toolCalls: calls };
    }
    return null;
  }

  /**
   * Try to fix truncated JSON by adding missing closing braces.
   */
  private tryBalanceJson(json: string): string | null {
    let open = 0;
    let close = 0;
    for (const ch of json) {
      if (ch === "{") open++;
      if (ch === "}") close++;
    }
    const missing = open - close;
    if (missing > 0 && missing <= 5) {
      return json + "}".repeat(missing);
    }
    if (missing === 0) return json;
    return null;
  }
}

/**
 * Safety net: detects planning-fluff responses that slip past the DECIDE NOW prompt.
 * The primary defense is now the structured binary-decision injection after each
 * tool result. This function catches any remaining cases where the model outputs
 * descriptive text instead of a tool_call or final answer.
 */
function looksLikePlanning(text: string): boolean {
  if (!text) return false;

  // Quick rejects: genuine deliverables
  if (/<!--save:/.test(text)) return false;
  if (/^\s*\{/.test(text) && text.length < 1000) return false;

  const lower = text.toLowerCase();

  // Planning-verb detection with explicit verb lists
  const spanishVerbs = "leer|extraer|buscar|actualizar|crear|modificar|revisar|comparar|verificar|analizar|comprobar|corregir|cambiar|arreglar|eliminar|reemplazar|escribir|guardar";
  const englishVerbs = "read|extract|search|find|update|create|modify|check|verify|compare|analyze|look|fetch|get|pull|fix|change|correct|replace|write|save|delete";
  const hasPlanningVerb =
    new RegExp(`\\bvoy\\s+a\\s+(?:${spanishVerbs})\\b`, "i").test(text) ||
    /\bahora\s+(voy|necesito|debo|tengo|procedo)\b/i.test(text) ||
    /\bhe\s+le[íi]do\b/i.test(text) ||
    new RegExp(`\\bpara\\s+poder\\s+(?:${spanishVerbs})\\b`, "i").test(text) ||
    new RegExp(`\\bnecesito\\s+(?:${spanishVerbs})\\b`, "i").test(text) ||
    new RegExp(`\\blet\\s+me\\s+(?:${englishVerbs})\\b`, "i").test(text) ||
    new RegExp(`\\bi(?:'ll|\\s+will)\\s+(?:${englishVerbs})\\b`, "i").test(text) ||
    new RegExp(`\\bi\\s+need\\s+to\\s+(?:${englishVerbs})\\b`, "i").test(text) ||
    new RegExp(`\\bi\\s+should\\s+(?:${englishVerbs})\\b`, "i").test(text);

  if (!hasPlanningVerb) return false;

  // Don't flag if the response has substantial content (tables, lists, headings)
  const hasContent =
    /\|.+\|/.test(text) ||
    (text.match(/^[-*]\s*.{30,}/gm)?.length ?? 0) >= 2 ||
    (text.match(/^\d+[\.\)]\s*.{20,}/gm)?.length ?? 0) >= 2;

  return !hasContent;
}
