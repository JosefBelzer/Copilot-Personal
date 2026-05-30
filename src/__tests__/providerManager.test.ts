/**
 * Tests for ProviderManager — provider detection and switching.
 */
import { ProviderManager } from "../LLMProviders/providerManager";
import { DEFAULT_SETTINGS, CopilotSettings } from "../settings";

describe("ProviderManager", () => {
  test("auto-detects deepseek from URL", () => {
    const settings = { ...DEFAULT_SETTINGS, apiUrl: "https://api.deepseek.com", providerType: "auto" as const };
    const pm = new ProviderManager(settings);
    const provider = pm.getActiveProvider();
    expect(provider.providerType).toBe("deepseek");
  });

  test("auto-detects anthropic from URL", () => {
    const settings = { ...DEFAULT_SETTINGS, apiUrl: "https://api.anthropic.com", providerType: "auto" as const };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("anthropic");
  });

  test("auto-detects openrouter from URL", () => {
    const settings = { ...DEFAULT_SETTINGS, apiUrl: "https://openrouter.ai/api", providerType: "auto" as const };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("openrouter");
  });

  test("defaults to openai for unknown URLs", () => {
    const settings = { ...DEFAULT_SETTINGS, apiUrl: "https://api.example.com/v1", providerType: "auto" as const };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("openai");
  });

  test("respects explicit providerType over auto-detection", () => {
    // URL says deepseek, but user chose anthropic
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "https://api.deepseek.com",
      providerType: "anthropic" as const,
    };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("anthropic");
  });

  test("respects explicit providerType even with mismatched URL", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "https://custom.internal.api/v1",
      providerType: "openrouter" as const,
    };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("openrouter");
  });

  test("setActiveProvider switches provider at runtime", () => {
    const settings = { ...DEFAULT_SETTINGS, apiUrl: "https://api.deepseek.com", providerType: "auto" as const };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("deepseek");

    pm.setActiveProvider("openai");
    expect(pm.getActiveProvider().providerType).toBe("openai");
  });

  test("updateSettings re-detects and updates all configs", () => {
    const settings = { ...DEFAULT_SETTINGS, apiUrl: "https://api.deepseek.com", providerType: "auto" as const };
    const pm = new ProviderManager(settings);

    const newSettings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "https://api.anthropic.com",
      providerType: "auto" as const,
    };
    pm.updateSettings(newSettings);
    expect(pm.getActiveProvider().providerType).toBe("anthropic");
  });

  test("getProvider returns specific provider by type", () => {
    const settings = { ...DEFAULT_SETTINGS };
    const pm = new ProviderManager(settings);
    const anthropic = pm.getProvider("anthropic");
    expect(anthropic).toBeDefined();
    expect(anthropic!.providerType).toBe("anthropic");

    const openai = pm.getProvider("openai");
    expect(openai).toBeDefined();
    expect(openai!.providerType).toBe("openai");
  });
});
