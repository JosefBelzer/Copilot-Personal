import { requestUrl } from "obsidian";
import { LLMMessage, ChatStreamChunk } from "./types";
import { LLMProvider, ProviderConfig, ProviderType, ToolDefinition } from "./providerTypes";
import { withTimeout, normalizeApiUrl, fetchWithFallback } from "../utils/pathUtils";
import { CircuitBreaker } from "../services/CircuitBreaker";

/**
 * Base class for OpenAI-compatible providers (DeepSeek, OpenAI, Groq, Mistral, etc.)
 * DeepSeekProvider and OpenAIProvider are now thin wrappers around this.
 * Eliminates ~350 lines of duplicated code.
 */
export class BaseOpenAIProvider implements LLMProvider {
  readonly providerType: ProviderType;
  config: ProviderConfig;
  protected tag: string;
  circuitBreaker: CircuitBreaker;

  constructor(config: ProviderConfig, typeOverride?: ProviderType, tag?: string) {
    this.config = config;
    this.providerType = typeOverride ?? "openai";
    this.tag = tag ?? `[${this.providerType}]`;
    this.circuitBreaker = new CircuitBreaker();
  }

  updateConfig(config: ProviderConfig) {
    this.config = config;
  }

  async chat(messages: LLMMessage[], tools?: ToolDefinition[]): Promise<string> {
    // Circuit breaker check
    const waitMs = this.circuitBreaker.beforeCall();
    if (waitMs > 0) {
      const status = this.circuitBreaker.getStatus();
      throw new Error(`${this.tag} ${status.message}`);
    }

    const body = this.buildBody(messages, false);
    if (tools && tools.length > 0) {
      body.tools = tools;
      body.tool_choice = "auto";
    }

    try {
      const response = await withTimeout(
        requestUrl({
          url: `${this.normalizeUrl()}/chat/completions`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify(body),
        }),
        60000,
        `${this.tag} chat`
      );
      const data = response.json;
      if (data.error) {
        throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      const choice = data.choices?.[0];
      this.circuitBreaker.onSuccess();
      if (choice?.message?.tool_calls?.length) {
        return JSON.stringify({ tool_calls: choice.message.tool_calls });
      }
      return choice?.message?.content ?? "";
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const cb = this.circuitBreaker.onFailure(msg);
      console.error(`${this.tag} chat() failed:`, msg);
      throw new Error(`${this.tag} ${cb.message}`);
    }
  }

  async *chatStream(messages: LLMMessage[]): AsyncGenerator<ChatStreamChunk> {
    // Circuit breaker check
    const waitMs = this.circuitBreaker.beforeCall();
    if (waitMs > 0) {
      yield { content: `[${this.tag} unavailable — retry in ${Math.ceil(waitMs/1000)}s]`, done: true };
      return;
    }

    let response: Response;
    try {
      response = await withTimeout(
        fetchWithFallback(`${this.normalizeUrl()}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify(this.buildBody(messages, true)),
        }),
        120000,
        `${this.tag} stream`
      );

      if (!response.ok) {
        this.circuitBreaker.onFailure(`HTTP ${response.status}`);
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.substring(0, 200)}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.circuitBreaker.onFailure(msg);
      console.error(`${this.tag} chatStream() failed:`, msg);
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
          if (data === "[DONE]") { yield { content: "", done: true }; return; }
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              console.error(`${this.tag} Stream error:`, parsed.error);
              continue;
            }
            const delta = parsed.choices?.[0]?.delta;
            // Tool call delta (streaming tool calls)
            if (delta?.tool_calls?.length) {
              for (const tc of delta.tool_calls) {
                if (tc.function?.name) {
                  yield { content: `🔧 Calling ${tc.function.name}...`, done: false };
                }
              }
            }
            const content = delta?.content ?? "";
            if (content) yield { content, done: false };
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

  async embed(texts: string[]): Promise<number[][]> {
    try {
      const response = await withTimeout(
        requestUrl({
          url: `${this.normalizeUrl()}/embeddings`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({ model: this.config.embeddingModel, input: texts }),
        }),
        30000,
        `${this.tag} embed`
      );
      const data = response.json;
      if (data.error) {
        throw new Error(`Embedding API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      const result = data.data?.map((item: { embedding: number[] }) => item.embedding) ?? [];
      if (result.length === 0) {
        throw new Error(`Empty embedding response. Check model "${this.config.embeddingModel}".`);
      }
      if (result[0]?.every((n: number) => n === 0)) {
        throw new Error(`Embedding returned zero-vector. Model "${this.config.embeddingModel}" may not be loaded.`);
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${this.tag} embed() failed:`, msg);
      throw new Error(`${this.tag} embed failed: ${msg}`);
    }
  }

  async embedSingle(text: string): Promise<number[]> {
    const results = await this.embed([text]);
    return results[0] ?? [];
  }

  /**
   * Build request body shared between chat and chatStream.
   * DeepSeek-specific params only added for DeepSeek provider.
   */
  protected buildBody(messages: LLMMessage[], stream: boolean): Record<string, unknown> {
    const body: Record<string, unknown> = {
      model: this.config.chatModel,
      messages,
      max_tokens: this.config.maxTokens,
      stream,
    };

    if (this.providerType === "deepseek") {
      // DeepSeek-specific: thinking mode + sampling params
      body["thinking"] = { type: this.config.enableThinking ? "enabled" : "disabled" };
      if (this.config.enableThinking) {
        body.reasoning_effort = this.config.reasoningEffort;
      } else {
        body.temperature = this.config.temperature;
        body.top_p = this.config.topP;
        body.presence_penalty = this.config.presencePenalty;
      }
      if (this.config.topK > 0) body.top_k = this.config.topK;
      body.repetition_penalty = 1.0;
      body.min_p = 0.0;
      body.chat_template_kwargs = { enable_thinking: this.config.enableThinking };
    } else {
      // Standard OpenAI-compatible params
      body.temperature = this.config.temperature;
      body.top_p = this.config.topP;
      // presence_penalty not supported by Groq, Perplexity
      if (this.providerType !== "groq" && this.providerType !== "perplexity") {
        body.presence_penalty = this.config.presencePenalty;
      }
      if (this.config.topK > 0) body.top_k = this.config.topK;
    }

    return body;
  }

  protected normalizeUrl(): string {
    return normalizeApiUrl(this.config.apiUrl);
  }
}
