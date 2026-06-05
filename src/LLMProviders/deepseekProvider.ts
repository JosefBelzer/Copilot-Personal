import { ProviderConfig } from "./providerTypes";
import { BaseOpenAIProvider } from "./baseOpenAIProvider";

/**
 * DeepSeek provider — thin wrapper around BaseOpenAIProvider.
 * DeepSeek's API is fully OpenAI-compatible with added thinking/reasoning support.
 */
export class DeepSeekProvider extends BaseOpenAIProvider {
  constructor(config: ProviderConfig) {
    super(config, "deepseek", "[DeepSeek]");
  }
}
