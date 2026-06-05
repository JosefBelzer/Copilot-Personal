/**
 * BudgetLLMProvider — wraps BudgetManager to implement the LLMProvider interface.
 * Allows AgentModeRunner to use the budget provider seamlessly.
 * The API key NEVER leaves the Worker — all calls are proxied.
 */

import { LLMProvider, ProviderType, ProviderConfig, ToolDefinition } from "./providerTypes";
import { LLMMessage, ChatStreamChunk } from "./types";
import { BudgetManager } from "../services/BudgetManager";

export class BudgetLLMProvider implements LLMProvider {
  readonly providerType: ProviderType = "budget";
  config: ProviderConfig;
  private budgetManager: BudgetManager;
  private licenseKey: string;

  constructor(budgetManager: BudgetManager, licenseKey: string) {
    this.budgetManager = budgetManager;
    this.licenseKey = licenseKey;
    this.config = {
      apiKey: "budget-managed", apiUrl: "https://openrouter.ai/api/v1",
      chatModel: "mistralai/mistral-nemo", embeddingModel: "", visionModel: "",
      maxTokens: 4096, temperature: 0.3, topP: 0.95, topK: 0, presencePenalty: 0,
      enableThinking: false, reasoningEffort: "high",
    };
  }

  async chat(messages: LLMMessage[], tools?: ToolDefinition[]): Promise<string> {
    const result = await this.budgetManager.chat(
      messages.map(m => ({ role: m.role, content: m.content })),
      this.licenseKey,
      undefined,
      tools,
    );
    // If the model returned native tool_calls, format for AgentModeRunner
    const tc = result.toolCalls;
    if (tc && tc.length > 0) {
      return JSON.stringify({ tool_calls: tc });
    }
    return result.content || "";
  }

  async *chatStream(messages: LLMMessage[]): AsyncGenerator<ChatStreamChunk> {
    const gen = this.budgetManager.chatStream(
      messages.map(m => ({ role: m.role, content: m.content })),
      this.licenseKey,
    );
    for await (const chunk of gen) {
      yield { content: chunk.content, done: false };
    }
  }

  async embed(texts: string[]): Promise<number[][]> {
    // Budget provider doesn't support embeddings
    throw new Error("Embeddings not supported by budget provider");
  }

  async embedSingle(text: string): Promise<number[]> {
    throw new Error("Embeddings not supported by budget provider");
  }

  updateConfig(config: ProviderConfig): void {
    this.config = config;
  }
}
