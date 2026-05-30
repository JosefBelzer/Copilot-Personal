import { ProviderConfig, ProviderType } from "./providerTypes";
import { BaseOpenAIProvider } from "./baseOpenAIProvider";

/**
 * OpenAI-compatible provider — used by OpenAI, Groq, Mistral, Perplexity, xAI, etc.
 * Supports typeOverride for flexible provider routing.
 */
export class OpenAIProvider extends BaseOpenAIProvider {
  constructor(config: ProviderConfig, typeOverride?: ProviderType) {
    super(config, typeOverride ?? "openai", `[${typeOverride ?? "OpenAI"}]`);
  }

  /** Re-initialize with new config and type (used by ProviderManager for runtime switching) */
  init(config: ProviderConfig, typeOverride?: ProviderType) {
    this.config = config;
    (this as any).providerType = typeOverride ?? this.providerType;
    this.tag = `[${typeOverride ?? this.providerType}]`;
  }
}
