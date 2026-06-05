import { requestUrl } from "obsidian";
import { LLMMessage, ChatStreamChunk } from "./types";
import { LLMProvider, ProviderConfig, ProviderType, ToolDefinition } from "./providerTypes";
import { fetchWithFallback } from "../utils/pathUtils";
import { CircuitBreaker } from "../services/CircuitBreaker";

const TAG = "[Gemini]";

/**
 * Gemini provider — Google Gemini API.
 * Uses x-goog-api-key header and gemini-specific endpoints.
 * Converts OpenAI-compatible message format to Gemini format.
 */
export class GeminiProvider implements LLMProvider {
  readonly providerType: ProviderType = "gemini";
  config: ProviderConfig;
  circuitBreaker: CircuitBreaker;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.circuitBreaker = new CircuitBreaker();
  }

  updateConfig(config: ProviderConfig) {
    this.config = config;
  }

  private formatMessages(messages: LLMMessage[]): {
    contents: Array<{ role: string; parts: Array<{ text: string }> }>;
    systemInstruction?: { parts: Array<{ text: string }> };
  } {
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    let systemText = "";

    for (const m of messages) {
      if (m.role === "system") {
        systemText += (systemText ? "\n" : "") + m.content;
      } else {
        contents.push({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        });
      }
    }

    return {
      contents,
      ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {}),
    };
  }

  async chat(messages: LLMMessage[], tools?: ToolDefinition[]): Promise<string> {
    const { contents, systemInstruction } = this.formatMessages(messages);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        maxOutputTokens: this.config.maxTokens,
        temperature: this.config.temperature,
        topP: this.config.topP,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = systemInstruction;
    }

    // Gemini native tool calling — uses functionDeclarations format
    if (tools && tools.length > 0) {
      body.tools = [{
        functionDeclarations: tools.map(t => ({
          name: t.function.name,
          description: t.function.description,
          parametersJsonSchema: t.function.parameters,
        })),
      }];
    }

    try {
      const modelPath = this.config.chatModel.includes("/") ? "" : "models/";
      const response = await requestUrl({
        url: `${this.normalizeUrl()}/${modelPath}${this.config.chatModel}:generateContent`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.config.apiKey,
        },
        body: JSON.stringify(body),
      });

      const data = response.json;
      if (data.error) {
        throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
      }

      // Handle functionCall response
      const parts = data.candidates?.[0]?.content?.parts || [];
      const functionCalls = parts.filter((p: any) => p.functionCall);
      if (functionCalls.length > 0) {
        const toolCalls = functionCalls.map((p: any) => ({
          id: `call_${p.functionCall.name}`,
          type: "function",
          function: {
            name: p.functionCall.name,
            arguments: JSON.stringify(p.functionCall.args || {}),
          },
        }));
        return JSON.stringify({ tool_calls: toolCalls });
      }

      this.circuitBreaker.onSuccess();
      return parts.map((p: any) => p.text || "").join("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.circuitBreaker.onFailure(msg);
      console.error(`${TAG} chat() failed:`, msg);
      throw new Error(`Gemini chat failed: ${msg}`);
    }
  }

  async *chatStream(messages: LLMMessage[]): AsyncGenerator<ChatStreamChunk> {
    const waitMs = this.circuitBreaker.beforeCall();
    if (waitMs > 0) {
      yield { content: `[Gemini unavailable — retry in ${Math.ceil(waitMs/1000)}s]`, done: true };
      return;
    }

    const { contents, systemInstruction } = this.formatMessages(messages);
    const body: Record<string, unknown> = {
      contents,
      ...(systemInstruction ? { systemInstruction } : {}),
      generationConfig: {
        maxOutputTokens: this.config.maxTokens,
        temperature: this.config.temperature,
        topP: this.config.topP,
      },
    };

    let response: Response;
    try {
      response = await fetchWithFallback(
        `${this.normalizeUrl()}/models/${this.config.chatModel}:streamGenerateContent?alt=sse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.config.apiKey,
          },
          body: JSON.stringify(body),
        }
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
          if (data === "[DONE]") { yield { content: "", done: true }; return; }
          try {
            const parsed = JSON.parse(data);
            const parts = parsed.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
              if (part.functionCall) {
                yield { content: `🔧 Calling ${part.functionCall.name}...`, done: false };
              }
              if (part.text) {
                yield { content: part.text, done: false };
              }
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

  async embed(texts: string[]): Promise<number[][]> {
    try {
      const model = this.config.embeddingModel || "text-embedding-004";
      const requests = texts.map(text => ({
        model: `models/${model}`,
        content: { parts: [{ text }] },
      }));

      // Gemini batch embedding
      const response = await requestUrl({
        url: `${this.normalizeUrl()}/models/${model}:batchEmbedText`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.config.apiKey,
        },
        body: JSON.stringify({ requests }),
      });

      const data = response.json;
      if (data.error) {
        throw new Error(`Embedding API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      return (data.embeddings || []).map((e: any) => e.values ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${TAG} embed() failed:`, msg);
      throw new Error(`Gemini embed failed: ${msg}`);
    }
  }

  async embedSingle(text: string): Promise<number[]> {
    const results = await this.embed([text]);
    return results[0] ?? [];
  }

  /** Uses Google's API URL regardless of user config — Gemini has a fixed endpoint. */
  private normalizeUrl(): string {
    let url = this.config.apiUrl.replace(/\/+$/, "");
    if (!url.includes("generativelanguage.googleapis.com")) {
      url = "https://generativelanguage.googleapis.com/v1beta";
    }
    return url;
  }
}
