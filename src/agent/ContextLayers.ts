import { LLMMessage } from "../LLMProviders/types";
import { LLMProvider } from "../LLMProviders/providerTypes";
import {
  LAYERS_PROMOTION_INTERVAL,
  LAYERS_RECENT_MSGS,
  LAYERS_MIN_PROMPT_CHARS,
  LAYERS_MAX_PROMOTE_CHARS,
  LAYERS_MAX_FACT_CHARS,
  LAYERS_MAX_FACTS,
  LAYERS_MAX_L2_CHARS,
} from "../constants";

/**
 * ContextLayers — L1-L5 layered context system with auto-promotion.
 *
 * L1_SYSTEM:   System prompt (always present, cache-friendly)
 * L2_PREVIOUS: Stable info from prior turns (promoted from L3 every 3-5 turns)
 * L3_TURN:     Current turn context (user query + tool results)
 * L4_STRIP:    Chat history (stripped of tool results)
 * L5_USER:     Raw user message
 *
 * L2 is the "memory layer" — facts and context that don't change between turns.
 * L3 is the "working layer" — what's happening right now.
 */
export class ContextLayers {
  private l2Content: string = "";
  private turnCount: number = 0;
  private promotionInterval: number = LAYERS_PROMOTION_INTERVAL; // promote L3→L2 every N turns

  /**
   * Build a context array from the five layers.
   */
  buildContext(userMessage: string, messages: LLMMessage[]): LLMMessage[] {
    const result: LLMMessage[] = [];

    // L1: System prompt (provided externally, merged into the first message)
    // L2: Stable previous-turn context (if any)
    if (this.l2Content) {
      result.push({ role: "system", content: `[Persistent context from previous interactions]:\n${this.l2Content}` });
    }

    // L4: Chat history (last N messages, stripped)
    const recentMessages = messages.slice(-LAYERS_RECENT_MSGS);
    for (const msg of recentMessages) {
      if (msg.role === "user" || msg.role === "assistant") {
        result.push(msg);
      }
    }

    // L5: Raw user message
    result.push({ role: "user", content: userMessage });

    return result;
  }

  /**
   * After the agent finishes a turn, feed the assistant response back
   * and potentially promote L3 context to L2.
   */
  afterTurn(assistantResponse: string, toolResults: string[]): void {
    this.turnCount++;

    // Every N turns, extract key facts from this turn's context
    // and merge them into L2.
    if (this.turnCount % this.promotionInterval === 0) {
      const newL2 = this.extractKeyFacts(assistantResponse, toolResults);
      if (newL2) {
        this.l2Content = this.mergeFacts(this.l2Content, newL2);
      }
    }
  }

  /**
   * Promote a specific turn's context to L2 manually.
   */
  async promoteToL2(provider: LLMProvider, messages: LLMMessage[]): Promise<void> {
    const combinedText = messages
      .filter((m) => m.role === "assistant" || m.role === "user")
      .map((m) => m.content)
      .join("\n\n");

    if (combinedText.length < LAYERS_MIN_PROMPT_CHARS) return;

    try {
      const summary = await provider.chat([
        {
          role: "system",
          content: "Extract 3-5 key facts, decisions, and user preferences from this conversation. Output only the facts as bullet points. Be concise.",
        },
        { role: "user", content: combinedText.substring(0, LAYERS_MAX_PROMOTE_CHARS) },
      ]);

      if (summary) {
        this.l2Content = this.mergeFacts(this.l2Content, summary);
      }
    } catch {
      // Silently fail; L2 just doesn't update
    }
  }

  /**
   * Clear all layered context (e.g., on "New Chat").
   */
  clear(): void {
    this.l2Content = "";
    this.turnCount = 0;
  }

  /**
   * Extract key facts from the assistant's response and tool results.
   */
  private extractKeyFacts(assistantResponse: string, toolResults: string[]): string {
    const facts: string[] = [];

    // Extract structured data from assistant response
    const lines = assistantResponse.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      // Capture bullet points, numbered items, and key-value patterns
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\./.test(trimmed)) {
        facts.push(trimmed.substring(0, LAYERS_MAX_FACT_CHARS));
      }
    }

    // Add tool result summaries
    for (const result of toolResults) {
      if (result.length > 10) {
        facts.push(`[Tool result]: ${result.substring(0, LAYERS_MAX_FACT_CHARS)}`);
      }
    }

    return facts.slice(0, LAYERS_MAX_FACTS).join("\n");
  }

  /**
   * Merge new facts with existing L2 content, keeping it manageable.
   */
  private mergeFacts(existing: string, newFacts: string): string {
    const combined = existing + "\n" + newFacts;
    // Keep L2 under configured max
    if (combined.length > LAYERS_MAX_L2_CHARS) {
      return combined.substring(combined.length - LAYERS_MAX_L2_CHARS);
    }
    return combined;
  }

  /**
   * Get current L2 content for serialization/persistence.
   */
  getL2Content(): string {
    return this.l2Content;
  }

  /**
   * Set L2 content (e.g., when loading from saved memory).
   */
  setL2Content(content: string): void {
    this.l2Content = content;
  }
}
