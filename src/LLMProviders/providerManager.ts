import { CopilotSettings, getApiKeyForProvider } from "../settings";
import { LLMProvider, ProviderConfig, ProviderType, PROVIDER_CAPABILITIES, providerSupports, ProviderTask } from "./providerTypes";
import { DeepSeekProvider } from "./deepseekProvider";
import { OpenAIProvider } from "./openaiProvider";
import { GeminiProvider } from "./geminiProvider";
import { AnthropicProvider } from "./anthropicProvider";

/**
 * ProviderManager v2 — multi-provider routing with automatic fallback.
 * For Pro users, routes embedding/vision/toolCalls to fallback providers
 * when the primary provider doesn't support them.
 */
export class ProviderManager {
  private providers: Map<ProviderType, LLMProvider> = new Map();
  private activeProvider: ProviderType;
  private settings: CopilotSettings;

  constructor(settings: CopilotSettings) {
    this.settings = settings;
    this.activeProvider = this.detectProviderType();
    this.initializeProviders();
  }

  private detectProviderType(): ProviderType {
    if (this.settings.providerType && this.settings.providerType !== "auto") {
      return this.settings.providerType as ProviderType;
    }
    const url = this.settings.apiUrl.toLowerCase();
    if (url.includes("deepseek")) return "deepseek";
    if (url.includes("anthropic") || url.includes("claude")) return "anthropic";
    if (url.includes("openrouter")) return "openrouter";
    if (url.includes("localhost:1234") || url.includes("127.0.0.1:1234") || url.includes("lmstudio") || url.includes("lm-studio")) return "lmstudio";
    if (url.includes("gemini") || url.includes("generativelanguage")) return "gemini";
    if (url.includes("mistral")) return "mistral";
    if (url.includes("groq")) return "groq";
    if (url.includes("perplexity")) return "perplexity";
    if (url.includes("x.ai") || url.includes("grok")) return "xai";
    return "openai";
  }

  private initializeProviders() {
    const config = this.getProviderConfig();
    this.providers.set("deepseek", new DeepSeekProvider(config));
    this.providers.set("openai", new OpenAIProvider(config));
    this.providers.set("anthropic", new AnthropicProvider(config));
    this.providers.set("openrouter", new OpenAIProvider(config, "openrouter"));
    this.providers.set("lmstudio", new OpenAIProvider(config, "lmstudio"));
    this.providers.set("gemini", new GeminiProvider(config));
    this.providers.set("mistral", new OpenAIProvider(config, "mistral"));
    this.providers.set("groq", new OpenAIProvider(config, "groq"));
    this.providers.set("perplexity", new OpenAIProvider(config, "perplexity"));
    this.providers.set("xai", new OpenAIProvider(config, "xai"));
  }

  private getProviderConfig(): ProviderConfig {
    return {
      apiKey: getApiKeyForProvider(this.settings, this.activeProvider),
      apiUrl: this.settings.apiUrl,
      chatModel: this.settings.chatModel,
      embeddingModel: this.settings.embeddingModel,
      visionModel: this.settings.visionModel,
      maxTokens: this.settings.maxTokens,
      temperature: this.settings.temperature,
      topP: this.settings.topP,
      topK: this.settings.topK,
      presencePenalty: this.settings.presencePenalty,
      enableThinking: this.settings.enableThinking,
      reasoningEffort: this.settings.reasoningEffort,
    };
  }

  // ========== Multi-provider fallback routing ==========

  /**
   * Get the best provider for a specific task.
   * Primary → fallback → error.
   */
  getProviderFor(task: ProviderTask): LLMProvider {
    if (providerSupports(this.activeProvider, task)) {
      return this.getActiveProvider();
    }

    const fallbackKey = task === "embeddings" ? "fallbackEmbeddingProvider"
      : task === "vision" ? "fallbackVisionProvider"
      : null;

    if (fallbackKey) {
      const fallbackType = (this.settings as any)[fallbackKey] as string | undefined;
      if (fallbackType) {
        const provider = this.providers.get(fallbackType as ProviderType);
        if (provider && providerSupports(fallbackType as ProviderType, task)) {
          provider.updateConfig(this.getFallbackConfig(task, fallbackType));
          return provider;
        }
      }
    }

    throw new Error(
      `Provider "${this.activeProvider}" does not support ${task}. Configure a fallback provider in Settings (Pro feature) or switch providers.`
    );
  }

  private getFallbackConfig(task: ProviderTask, fallbackType: string): ProviderConfig {
    const base = this.getProviderConfig();
    if (fallbackType === "lmstudio") {
      return {
        ...base,
        apiKey: getApiKeyForProvider(this.settings, "lmstudio") || "not-needed",
        apiUrl: this.settings.lmStudioUrl || "http://localhost:1234/v1",
        chatModel: task === "vision" ? (this.settings.fallbackModelVision || this.settings.lmStudioModel) : (this.settings.fallbackModelEmbedding || "nomic-embed-text"),
        embeddingModel: this.settings.fallbackModelEmbedding || "nomic-embed-text",
        visionModel: this.settings.fallbackModelVision || this.settings.lmStudioModel || "qwen2.5-vl-27b-instruct",
      };
    }
    return base;
  }

  // ========== Existing methods ==========

  getActiveProvider(): LLMProvider {
    return this.providers.get(this.activeProvider)!;
  }

  getProvider(type: ProviderType): LLMProvider | undefined {
    return this.providers.get(type);
  }

  getActiveProviderType(): ProviderType {
    return this.activeProvider;
  }

  updateSettings(settings: CopilotSettings) {
    this.settings = settings;
    const newType = this.detectProviderType();
    const config = this.getProviderConfig();
    for (const [, provider] of this.providers) provider.updateConfig(config);
    if (newType !== this.activeProvider) this.activeProvider = newType;
  }

  setActiveProvider(type: ProviderType) {
    this.activeProvider = type;
  }
}
