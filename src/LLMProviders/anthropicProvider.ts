import { requestUrl } from "obsidian";
import { LLMMessage, ChatStreamChunk } from "./types";
import { LLMProvider, ProviderConfig, ProviderType, ToolDefinition } from "./providerTypes";
import { withTimeout, normalizeApiUrl, fetchWithFallback } from "../utils/pathUtils";
import { CircuitBreaker } from "../services/CircuitBreaker";
import { t } from "../i18n";

interface AnthropicContentBlock {
  type: string;
  text?: string;
  name?: string;
  id?: string;
  input?: Record<string, unknown>;
}

interface AnthropicResponse {
  error?: { message: string };
  content?: AnthropicContentBlock[];
}

interface AnthropicStreamChunk {
  type?: string;
  delta?: { text?: string };
  content_block?: { type?: string; name?: string };
}

const TAG = "[Anthropic]";

/**
 * Anthropic Claude provider using the Messages API.
 * Note: Anthropic does not provide embeddings natively; embed methods
 * return empty arrays so callers can handle gracefully rather than crashing.
 */
export class AnthropicProvider implements LLMProvider {
  readonly providerType: ProviderType = "anthropic";
  config: ProviderConfig;
  circuitBreaker: CircuitBreaker;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.circuitBreaker = new CircuitBreaker();
  }

  updateConfig(config: ProviderConfig) {
    this.config = config;
  }

  async chat(messages: LLMMessage[], tools?: ToolDefinition[]): Promise<string> {
    const { systemMessages, conversationMessages } = this.splitMessages(messages);

    const body: Record<string, unknown> = {
      model: this.config.chatModel,
      max_tokens: this.config.maxTokens,
      messages: conversationMessages,
      stream: false,
    };

    if (systemMessages) {
      body.system = systemMessages;
    }
    if (this.config.temperature !== undefined) {
      body.temperature = this.config.temperature;
    }

    // Native tool calling — Anthropic-specific format
    if (tools && tools.length > 0) {
      body.tools = tools.map(t => ({
        name: t.function.name,
        description: t.function.description,
        input_schema: t.function.parameters,
      }));
    }

    try {
      const response = await requestUrl({
        url: `${this.normalizeUrl()}/messages`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.config.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      const data = response.json as AnthropicResponse;
      if (data.error) {
        throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
      }

      // Handle Anthropic tool_use response
      const toolUses = data.content?.filter((c: AnthropicContentBlock) => c.type === "tool_use") || [];
      if (toolUses.length > 0) {
        const toolCalls = toolUses.map((tu: AnthropicContentBlock) => ({
          id: tu.id || `call_${tu.name}`,
          type: "function" as const,
          function: {
            name: tu.name,
            arguments: JSON.stringify(tu.input || {}),
          },
        }));
        return JSON.stringify({ tool_calls: toolCalls });
      }

      this.circuitBreaker.onSuccess();
      return data.content?.[0]?.text ?? "";
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.circuitBreaker.onFailure(msg);
      console.error(`${TAG} chat() failed:`, msg);
      throw new Error(`Anthropic chat failed: ${msg}`);
    }
  }

  async *chatStream(messages: LLMMessage[]): AsyncGenerator<ChatStreamChunk> {
    const waitMs = this.circuitBreaker.beforeCall();
    if (waitMs > 0) {
      yield { content: `[Anthropic unavailable — retry in ${Math.ceil(waitMs/1000)}s]`, done: true };
      return;
    }

    const { systemMessages, conversationMessages } = this.splitMessages(messages);

    const body: Record<string, unknown> = {
      model: this.config.chatModel,
      max_tokens: this.config.maxTokens,
      messages: conversationMessages,
      stream: true,
    };

    if (systemMessages) {
      body.system = systemMessages;
    }
    if (this.config.temperature !== undefined) {
      body.temperature = this.config.temperature;
    }

    let response: Response;
    try {
      response = await withTimeout(
        fetchWithFallback(`${this.normalizeUrl()}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.config.apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify(body),
        }),
        120000,
        `${TAG} stream`
      );

      if (!response.ok) {
        this.circuitBreaker.onFailure(`HTTP ${response.status}`);
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.substring(0, 200)}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.circuitBreaker.onFailure(msg);
      console.error(`${TAG} chatStream() failed:`, msg);
      yield { content: `Error: ${msg}`, done: true };
      return;
    }

    this.circuitBreaker.onSuccess();

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          try {
            const parsed = JSON.parse(data) as AnthropicStreamChunk;
            if (parsed.type === "message_stop") {
              yield { content: "", done: true };
              return;
            }
            if (parsed.type === "content_block_delta") {
              const text = parsed.delta?.text ?? "";
              if (text) yield { content: text, done: false };
            }
            if (parsed.type === "content_block_start" && parsed.content_block?.type === "tool_use") {
              yield { content: `🔧 Calling ${parsed.content_block.name}...`, done: false };
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    yield { content: "", done: true };
  }

  async embed(_texts: string[]): Promise<number[][]> {
    throw new Error(t("provider.anthropicNoEmbeddings"));
  }

  async embedSingle(_text: string): Promise<number[]> {
    throw new Error(t("provider.anthropicNoEmbeddingsShort"));
  }

  private splitMessages(messages: LLMMessage[]): {
    systemMessages: string | null;
    conversationMessages: Array<{ role: string; content: string }>;
  } {
    const systemMsgs = messages
      .filter((m) => m.role === "system")
      .map((m) => m.content);

    const systemMessages = systemMsgs.length > 0 ? systemMsgs.join("\n") : null;

    const conversationMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    return { systemMessages, conversationMessages };
  }

  private normalizeUrl(): string {
    return normalizeApiUrl(this.config.apiUrl);
  }
}
