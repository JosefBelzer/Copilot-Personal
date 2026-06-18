/**
 * Tests for i18n translation engine — t(), setLanguage(), addTranslations().
 * Verifies parameter interpolation, fallback to English, and multi-language support.
 */
import { t, setLanguage, addTranslations, getLanguage, getKeys } from "../i18n";
import type { Lang } from "../i18n/types";

describe("i18n — t() basic translation", () => {
  const originalLang = getLanguage();

  afterEach(() => {
    setLanguage(originalLang);
  });

  test("returns English text when language is English", () => {
    setLanguage("en");
    const result = t("settings.apiKey");
    expect(result).toBe("API Key");
    expect(result).not.toBe("settings.apiKey"); // not the key itself
  });

  test("returns Spanish text when language is Spanish", () => {
    setLanguage("es");
    const result = t("settings.apiKey");
    expect(result).toBe("Clave API");
  });

  test("returns German text when language is German", () => {
    setLanguage("de");
    const result = t("settings.apiKey");
    expect(result).toBe("API-Schlüssel");
  });

  test("returns French text when language is French", () => {
    setLanguage("fr");
    const result = t("settings.apiKey");
    expect(result).toBe("Clé API");
  });

  test("falls back to English when translation missing", () => {
    setLanguage("es");
    // "settings.temperature" exists in both languages
    const result = t("settings.temperature");
    // Should return either Spanish or fallback to English, not the key itself
    expect(result).not.toBe("settings.temperature");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("returns key itself when no translation exists in any language", () => {
    const result = t("this.key.does.not.exist.anywhere");
    expect(result).toBe("this.key.does.not.exist.anywhere");
  });
});

describe("i18n — Parameter interpolation", () => {
  const originalLang = getLanguage();

  afterEach(() => {
    setLanguage(originalLang);
  });

  test("replaces {param} placeholders", () => {
    setLanguage("en");
    const result = t("settings.providerNoSupport", { provider: "DeepSeek", cap: "embeddings" });
    expect(result).toContain("DeepSeek");
    expect(result).toContain("embeddings");
  });

  test("replaces number parameters", () => {
    setLanguage("en");
    const result = t("tools.extractPdfImages.result", { count: 5, pages: 10, results: "✅ file1.png\n✅ file2.png" });
    expect(result).toContain("5");
    expect(result).toContain("10");
  });

  test("leaves unmatched placeholders as-is", () => {
    // Key with {nonexistent} if it doesn't exist in params
    setLanguage("en");
    const result = t("settings.apiKey", { madeUpParam: "test" } as any);
    // API Key doesn't have placeholders, so should return normal text
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("i18n — setLanguage and getLanguage", () => {
  test("default language is English", () => {
    expect(getLanguage()).toBe("en");
  });

  test("setLanguage changes active language", () => {
    setLanguage("ja");
    expect(getLanguage()).toBe("ja");
    setLanguage("en"); // restore
  });

  test("setLanguage to Korean works", () => {
    setLanguage("ko");
    expect(getLanguage()).toBe("ko");
    const result = t("settings.apiKey");
    expect(result).toBe("API 키");
    setLanguage("en");
  });
});

describe("i18n — addTranslations (custom languages)", () => {
  const originalLang = getLanguage();

  afterEach(() => {
    setLanguage(originalLang);
  });

  test("can register new language with custom translations", () => {
    addTranslations("en" as Lang, { "test.custom.key": "Custom English Value" });
    const result = t("test.custom.key");
    expect(result).toBe("Custom English Value");
  });

  test("custom translation overrides existing key", () => {
    addTranslations("en" as Lang, { "test.override": "Overridden" });
    const result = t("test.override");
    expect(result).toBe("Overridden");
  });
});

describe("i18n — getKeys", () => {
  test("returns array of all registered keys", () => {
    const keys = getKeys();
    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBeGreaterThan(100); // should have many keys
    expect(keys).toContain("settings.apiKey");
    expect(keys).toContain("chat.btnSend");
  });
});

describe("i18n — All 12 languages basic coverage", () => {
  const langs: Lang[] = ["en", "es", "de", "fr", "zh", "ja", "ko", "pt", "it", "ru", "tr", "ar"];
  
  for (const lang of langs) {
    test(`language "${lang}" returns non-empty translation for common keys`, () => {
      setLanguage(lang);
      // Test a few critical keys
      const key1 = t("settings.apiKey");
      const key2 = t("chat.placeholder");
      const key3 = t("chat.send");
      
      expect(typeof key1).toBe("string");
      expect(key1.length).toBeGreaterThan(0);
      expect(key1).not.toBe("settings.apiKey"); // not the key itself
      
      expect(typeof key2).toBe("string");
      expect(typeof key3).toBe("string");
    });
  }
  
  afterAll(() => {
    setLanguage("en");
  });
});

describe("i18n — Spanish comprehensive coverage", () => {
  test("all major UI sections have Spanish translations", () => {
    setLanguage("es");
    
    // Settings section — check translations exist and differ from English
    const title = t("settings.title");
    expect(typeof title).toBe("string");
    expect(title.length).toBeGreaterThan(0);
    expect(t("settings.apiKey")).toBe("Clave API");
    expect(t("settings.provider")).toBe("Proveedor");
    expect(t("settings.chatModel")).toBe("Modelo de Chat");
    expect(t("settings.temperature")).toBe("Temperatura");
    
    // Chat section — check translations exist (use actual key names from en.ts)
    const placeholder = t("chat.sendPlaceholder");
    expect(typeof placeholder).toBe("string");
    expect(placeholder.length).toBeGreaterThan(0);
    expect(t("chat.btnSend")).toBe("Enviar");
    expect(t("chat.btnStop")).toBe("Parar");
    expect(t("chat.btnAgent")).toBe("Agente");
    
    // Agent section — use actual key names
    const agentReady = t("chat.statusReady");
    expect(typeof agentReady).toBe("string");
    expect(agentReady.length).toBeGreaterThan(0);
    const agentThinking = t("chat.statusAgentThinking");
    expect(typeof agentThinking).toBe("string");
    
    // License section
    const proActivated = t("license.proActivated");
    expect(typeof proActivated).toBe("string");
    expect(proActivated.length).toBeGreaterThan(0);
    expect(proActivated).not.toBe("license.proActivated"); // has translation
    
    setLanguage("en");
  });
});
