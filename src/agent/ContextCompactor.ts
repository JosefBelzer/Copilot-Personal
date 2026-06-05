import { LLMProvider } from "../LLMProviders/providerTypes";
import { LLMMessage } from "../LLMProviders/types";
import {
  CONTEXT_COMPACT_THRESHOLD,
  COMPACTOR_PRESERVE_LAST,
  COMPACTOR_MAX_BLOCKS,
  COMPACTOR_ASSISTANT_MIN_CHARS,
  COMPACTOR_SUMMARIZE_MAX_CHARS,
  CONTEXT_SUMMARIZE_MAX_TOKENS,
} from "../constants";

interface ApiMessage {
  role: string;
  content: string | null;
}

/**
 * ContextCompactor — Map-Reduce summarization for long conversations.
 * When the context exceeds a token threshold, compresses old tool results
 * and assistant responses into concise summaries instead of deleting them.
 * 
 * Three phases:
 *   PARSE  — identify large blocks worth compressing
 *   MAP    — summarize each block with a quick LLM call
 *   REDUCE — replace originals with summaries
 */
export class ContextCompactor {
  private provider: LLMProvider;

  constructor(provider: LLMProvider) {
    this.provider = provider;
  }

  /**
   * Main entry point. Returns a compacted conversation or null if
   * compaction wasn't needed or failed.
   */
  async compact(
    conversation: ApiMessage[],
    thresholdTokens: number = CONTEXT_COMPACT_THRESHOLD
  ): Promise<ApiMessage[] | null> {
    const estimated = this.estimateTokens(conversation);
    if (estimated < thresholdTokens) return null; // no compaction needed

    // PARSE: collect blocks to summarize
    const blocks = this.identifyBlocks(conversation);
    if (blocks.length === 0) return null;

    // MAP: summarize each block
    let failures = 0;
    const summaries = new Map<number, string>();
    const maxBlocks = COMPACTOR_MAX_BLOCKS;

    for (let i = 0; i < Math.min(blocks.length, maxBlocks); i++) {
      const block = blocks[i];
      const text = this.extractSummarizableText(block);
      if (!text) continue;

      try {
        const summary = await this.summarizeBlock(text);
        summaries.set(block.conversationIndex, summary);
      } catch (err) {
        failures++;
        console.warn("[ContextCompactor] Block summarization failed:", err);
      }
    }

    // Fail-safe: if >50% of map ops failed, abort entirely
    if (failures > blocks.length * 0.5) return null;

    // REDUCE: build compacted conversation
    return this.reduce(conversation, summaries);
  }

  /**
   * Identify blocks in the conversation that are candidates for summarization.
   * Only targets: long assistant messages (>1000 chars). Tool results are NEVER
   * compacted — losing tool data causes agent hallucination. System messages are
   * always preserved. Preserves the last 8 messages so recent tool interactions
   * remain intact even when the context is long.
   */
  private identifyBlocks(conversation: ApiMessage[]): Array<{
    message: ApiMessage;
    conversationIndex: number;
  }> {
    const blocks: Array<{ message: ApiMessage; conversationIndex: number }> = [];
    const preserveLast = COMPACTOR_PRESERVE_LAST;

    for (let i = 0; i < conversation.length - preserveLast; i++) {
      const msg = conversation[i];
      if (msg.role === "system" || msg.role === "tool") continue; // never compact system or tool results
      const content = msg.content ?? "";
      if (msg.role === "assistant" && content.length > COMPACTOR_ASSISTANT_MIN_CHARS) {
        blocks.push({ message: msg, conversationIndex: i });
      }
    }

    return blocks;
  }

  /**
   * Extract the portion of a message that's worth summarizing.
   * For tool results: full content. For assistant: first 2000 chars.
   */
  private extractSummarizableText(block: {
    message: ApiMessage;
    conversationIndex: number;
  }): string | null {
    const content = block.message.content ?? "";
    if (!content.trim()) return null;

    if (block.message.role === "tool") {
      return content.substring(0, COMPACTOR_SUMMARIZE_MAX_CHARS);
    }
    if (block.message.role === "assistant") {
      return content.substring(0, COMPACTOR_SUMMARIZE_MAX_CHARS);
    }
    return null;
  }

  /**
   * Quick LLM call to summarize a block into 1-2 sentences.
   */
  private async summarizeBlock(text: string): Promise<string> {
    const messages: LLMMessage[] = [
      {
        role: "system",
        content: "Summarize the following content in 1-2 concise sentences. Keep key facts, names, and numbers. Output only the summary, no preamble.",
      },
      { role: "user", content: text },
    ];

    // Temporarily cap max tokens for fast summarization
    const config = this.provider.config;
    const savedTokens = config.maxTokens;
    config.maxTokens = CONTEXT_SUMMARIZE_MAX_TOKENS;

    const summary = await this.provider.chat(messages);

    config.maxTokens = savedTokens;
    return summary.trim();
  }

  /**
   * Build compacted conversation: replace summarized blocks with
   * short user messages containing the summary.
   */
  private reduce(
    conversation: ApiMessage[],
    summaries: Map<number, string>
  ): ApiMessage[] {
    const result: ApiMessage[] = [];
    let summaryQueue: string[] = [];

    for (let i = 0; i < conversation.length; i++) {
      if (summaries.has(i)) {
        summaryQueue.push(summaries.get(i)!);
      } else if (summaryQueue.length > 0 && conversation[i].role === "user") {
        // Flush pending summaries before a user message
        result.push({
          role: "system",
          content: `[Context from earlier conversation]:\n${summaryQueue.join("\n")}`,
        });
        summaryQueue = [];
        result.push(conversation[i]);
      } else {
        result.push(conversation[i]);
      }
    }

    // Flush remaining summaries
    if (summaryQueue.length > 0) {
      result.push({
        role: "system",
        content: `[Context from earlier conversation]:\n${summaryQueue.join("\n")}`,
      });
    }

    return result;
  }

  estimateTokens(conversation: ApiMessage[]): number {
    let total = 0;
    for (const msg of conversation) {
      total += (msg.content ?? "").length + 50;
    }
    return Math.ceil(total / 4);
  }
}
