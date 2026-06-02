export type ProviderTypeKey = "deepseek" | "openai" | "anthropic" | "openrouter" | "lmstudio" | "gemini" | "mistral" | "groq" | "perplexity" | "xai";

export interface CopilotSettings {
  // Legacy — kept for backward compatibility (used as fallback)
  apiKey: string;
  // Per‑provider API keys
  deepseekApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  openrouterApiKey: string;
  geminiApiKey: string;
  mistralApiKey: string;
  groqApiKey: string;
  perplexityApiKey: string;
  xaiApiKey: string;
  // LM Studio already has its own key (lmStudioApiKey below) — kept for clarity
  apiUrl: string;
  providerType: "auto" | "deepseek" | "openai" | "anthropic" | "openrouter" | "lmstudio" | "gemini" | "mistral" | "groq" | "perplexity" | "xai";
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
  contextTurns: number;
  streamEnabled: boolean;

  // Semantic search
  enableSemanticSearch: boolean;
  maxSourceChunks: number;
  chunkSize: number;
  excludedFolders: string;

  // Web search
  webSearchEnabled: boolean;
  webSearchServerUrl: string;
  webSearchMaxResults: number;
  webSearchToken: string;

  // Vision
  visionEnabled: boolean;
  enableImageDrop: boolean;

  // Chat
  saveChatHistory: boolean;
  chatHistoryFolder: string;

  // Memory
  memoryEnabled: boolean;
  memoryFolder: string;
  maxMemories: number;

  // Agent Mode
  enableAgentMode: boolean;
  agentMaxIterations: number;

  // LM Studio (for vision / image analysis)
  lmStudioUrl: string;
  lmStudioModel: string;
  lmStudioApiKey: string;

  // Detected models (populated by LM Studio model detection)
  detectedModels: string[];
  licenseKey: string;

  // Multi-provider fallback (Pro feature)
  fallbackEmbeddingProvider: string;
  fallbackVisionProvider: string;
  fallbackModelVision: string;
  fallbackModelEmbedding: string;

  // Internal: persisted message count for rate limiting
  _messageCount?: { count: number; day: string };
  _licenseFingerprint?: string | null;
}

export const DEFAULT_SETTINGS: CopilotSettings = {
  apiKey: "",
  deepseekApiKey: "",
  openaiApiKey: "",
  anthropicApiKey: "",
  openrouterApiKey: "",
  geminiApiKey: "",
  mistralApiKey: "",
  groqApiKey: "",
  perplexityApiKey: "",
  xaiApiKey: "",
  apiUrl: "https://api.deepseek.com",
  providerType: "auto",
  chatModel: "deepseek-v4-flash",
  embeddingModel: "deepseek-embedding",
  visionModel: "deepseek-v4-flash",
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.8,
  topK: 20,
  presencePenalty: 1.5,
  enableThinking: false,
  reasoningEffort: "high",
  contextTurns: 5,
  streamEnabled: true,

  enableSemanticSearch: false,
  maxSourceChunks: 5,
  chunkSize: 500,
  excludedFolders: "",

  webSearchEnabled: false,
  webSearchServerUrl: "http://localhost:8000/search",
  webSearchMaxResults: 3,
  webSearchToken: "copilot-default-token-change-me",

  visionEnabled: false,
  enableImageDrop: true,

  saveChatHistory: false,
  chatHistoryFolder: "copilot-chats",

  memoryEnabled: true,
  memoryFolder: "copilot/memory",
  maxMemories: 3,

  enableAgentMode: false,
  agentMaxIterations: 8,

  lmStudioUrl: "http://localhost:1234/v1",
  lmStudioModel: "qwen2.5-vl-27b-instruct",
  lmStudioApiKey: "",

  detectedModels: [],
  licenseKey: "",

  fallbackEmbeddingProvider: "",
  fallbackVisionProvider: "",
  fallbackModelVision: "qwen2.5-vl-27b-instruct",
  fallbackModelEmbedding: "nomic-embed-text",
};

/**
 * Resolve the API key for a given provider type.
 * Uses the per-provider key first, falls back to the legacy apiKey,
 * and handles special cases (LM Studio key, etc.).
 */
export function getApiKeyForProvider(settings: CopilotSettings, provider: string): string {
  // Map provider types to their specific key fields
  const keyMap: Record<string, string> = {
    deepseek: settings.deepseekApiKey,
    openai: settings.openaiApiKey,
    anthropic: settings.anthropicApiKey,
    openrouter: settings.openrouterApiKey,
    gemini: settings.geminiApiKey,
    mistral: settings.mistralApiKey,
    groq: settings.groqApiKey,
    perplexity: settings.perplexityApiKey,
    xai: settings.xaiApiKey,
    lmstudio: settings.lmStudioApiKey,
  };

  // Per-provider key (migration from legacy apiKey happens in main.ts onload)
  if (provider in keyMap) {
    return keyMap[provider] || "";
  }
  // LM Studio uses its own field or "not-needed"
  if (provider === "lmstudio") return settings.lmStudioApiKey || "not-needed";
  // Fallback to legacy apiKey ONLY for unknown providers
  if (settings.apiKey) return settings.apiKey;
  return "";
}

/**
 * Set the API key for a given provider type.
 * Updates the per-provider key field.
 */
export function setApiKeyForProvider(settings: CopilotSettings, provider: string, key: string): void {
  const keyMap: Record<string, keyof CopilotSettings> = {
    deepseek: "deepseekApiKey",
    openai: "openaiApiKey",
    anthropic: "anthropicApiKey",
    openrouter: "openrouterApiKey",
    gemini: "geminiApiKey",
    mistral: "mistralApiKey",
    groq: "groqApiKey",
    perplexity: "perplexityApiKey",
    xai: "xaiApiKey",
    lmstudio: "lmStudioApiKey",
  };

  if (provider in keyMap) {
    (settings as any)[keyMap[provider]] = key;
  }
}
