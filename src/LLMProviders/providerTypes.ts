import { LLMMessage, ChatStreamChunk } from "./types";

export type ProviderType = "deepseek" | "openai" | "anthropic" | "openrouter" | "lmstudio" | "gemini" | "mistral" | "groq" | "perplexity" | "xai" | "budget";

/** What each provider supports — used to show/hide settings */
export interface ProviderCapabilities {
  chat: boolean;
  streaming: boolean;
  embeddings: boolean;
  vision: boolean;
  toolCalling: boolean;
  thinking: boolean;       // DeepSeek-specific
  label: string;
}

export const PROVIDER_CAPABILITIES: Record<ProviderType | "auto", ProviderCapabilities> = {
  auto:        { chat: true, streaming: true, embeddings: true, vision: true, toolCalling: true, thinking: true, label: "Auto-detect" },
  deepseek:    { chat: true, streaming: true, embeddings: true, vision: true, toolCalling: true, thinking: true, label: "DeepSeek" },
  openai:      { chat: true, streaming: true, embeddings: true, vision: true, toolCalling: true, thinking: false, label: "OpenAI" },
  anthropic:   { chat: true, streaming: true, embeddings: false, vision: true, toolCalling: true, thinking: false, label: "Anthropic" },
  openrouter:  { chat: true, streaming: true, embeddings: true, vision: true, toolCalling: true, thinking: false, label: "OpenRouter" },
  lmstudio:    { chat: true, streaming: true, embeddings: true, vision: true, toolCalling: true, thinking: false, label: "LM Studio" },
  gemini:      { chat: true, streaming: true, embeddings: true, vision: true, toolCalling: true, thinking: false, label: "Gemini" },
  mistral:     { chat: true, streaming: true, embeddings: true, vision: true,  toolCalling: true, thinking: false, label: "Mistral" },
  groq:        { chat: true, streaming: true, embeddings: false, vision: false, toolCalling: true, thinking: false, label: "Groq" },
  perplexity:  { chat: true, streaming: true, embeddings: false, vision: false, toolCalling: true, thinking: false, label: "Perplexity" },
  xai:         { chat: true, streaming: true, embeddings: false, vision: true,  toolCalling: true, thinking: false, label: "xAI" },
  budget:      { chat: true, streaming: true, embeddings: true, vision: true, toolCalling: true, thinking: false, label: "Copilot AI" },
};

/** Task that a provider can handle */
export type ProviderTask = "chat" | "embeddings" | "vision" | "toolCalling";

/** Check if a provider supports a given task */
export function providerSupports(type: ProviderType | "auto", task: ProviderTask): boolean {
  const caps = PROVIDER_CAPABILITIES[type] ?? PROVIDER_CAPABILITIES.auto;
  return caps[task] === true;
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface LLMProvider {
  readonly providerType: ProviderType;
  config: ProviderConfig;

  /** Non-streaming chat completion. Optionally pass native tool definitions. */
  chat(messages: LLMMessage[], tools?: ToolDefinition[]): Promise<string>;

  /** Streaming chat completion. */
  chatStream(messages: LLMMessage[]): AsyncGenerator<ChatStreamChunk>;

  /** Generate embeddings for multiple texts. */
  embed(texts: string[]): Promise<number[][]>;

  /** Generate embedding for a single text. */
  embedSingle(text: string): Promise<number[]>;

  /** Update provider configuration. */
  updateConfig(config: ProviderConfig): void;
}

export interface ProviderConfig {
  apiKey: string;
  apiUrl: string;
  chatModel: string;
  embeddingModel: string;
  visionModel: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  presencePenalty: number;
  enableThinking: boolean;
  reasoningEffort: "high" | "max";
}
