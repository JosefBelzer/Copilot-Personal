/**
 * i18n — translation engine for 12 languages.
 *
 * Usage:
 *   import { t, setLanguage, addTranslations } from "../i18n";
 *   setLanguage("es");
 *   t("settings.apiKey") → "Clave API"
 *   t("chat.system.crashRecovery") → "📝 Sesión anterior restaurada"
 *
 * Architecture:
 *   _translations: Record<key, Record<lang, string>>
 *   _currentLang: "en" by default
 *   t(): lookup with English fallback, supports {param} interpolation
 */

import { Lang } from "./types";
import { getLanguages } from "./types";
import { en } from "./en";
import { es } from "./es";
import { de } from "./de";
import { fr } from "./fr";
import { zh } from "./zh";
import { ja } from "./ja";
import { ko } from "./ko";
import { pt } from "./pt";
import { it } from "./it";
import { ru } from "./ru";
import { tr } from "./tr";
import { ar } from "./ar";

// Re-export
export { getLanguages };
export type { Lang };

/** All registered translations. English is always loaded first. */
const _translations: Record<string, Partial<Record<Lang, string>>> = {};

/** Current active language. Defaults to English. */
let _currentLang: Lang = "en";

/** Initial load: register English as the base language */
addTranslations("en", en);
addTranslations("es", es);
addTranslations("de", de);
addTranslations("fr", fr);
addTranslations("zh", zh);
addTranslations("ja", ja);
addTranslations("ko", ko);
addTranslations("pt", pt);
addTranslations("it", it);
addTranslations("ru", ru);
addTranslations("tr", tr);
addTranslations("ar", ar);

/**
 * Bulk-register translations for a language.
 * Call this at module load time (one per language file).
 */
export function addTranslations(lang: Lang, map: Record<string, string>): void {
  for (const [key, value] of Object.entries(map)) {
    if (!_translations[key]) {
      _translations[key] = {};
    }
    _translations[key]![lang] = value;
  }
}

/**
 * Get translated string for key in the current language.
 * Falls back to English if the current language doesn't have the key.
 * Supports {param} interpolation via str.replace().
 *
 * @param key  Dotted key, e.g. "settings.apiKey"
 * @param params  Optional replacements, e.g. { provider: "DeepSeek" }
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const entry = _translations[key];
  if (!entry) return key; // missing key → return key itself for visibility

  const text = entry[_currentLang] ?? entry["en"] ?? key;

  if (!params) return text;

  // Simple {param} interpolation
  return text.replace(/\{(\w+)\}/g, (_, name) => {
    const val = params[name];
    return val !== undefined ? String(val) : `{${name}}`;
  });
}

/** Switch the active language (persisted in settings separately). */
export function setLanguage(lang: Lang): void {
  _currentLang = lang;
}

/** Get the current language code. */
export function getLanguage(): Lang {
  return _currentLang;
}

/** Get all registered translation keys (for debugging). */
export function getKeys(): string[] {
  return Object.keys(_translations);
}
