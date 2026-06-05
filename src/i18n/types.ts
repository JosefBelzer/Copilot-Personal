/**
 * i18n types — language codes and translation map.
 * 12 languages supported. English is always the fallback.
 */

export const LANGS = {
  en: { name: "English", flag: "🇬🇧" },
  es: { name: "Español", flag: "🇪🇸" },
  zh: { name: "中文", flag: "🇨🇳" },
  ja: { name: "日本語", flag: "🇯🇵" },
  ko: { name: "한국어", flag: "🇰🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  fr: { name: "Français", flag: "🇫🇷" },
  ru: { name: "Русский", flag: "🇷🇺" },
  pt: { name: "Português", flag: "🇧🇷" },
  it: { name: "Italiano", flag: "🇮🇹" },
  tr: { name: "Türkçe", flag: "🇹🇷" },
  ar: { name: "العربية", flag: "🇸🇦" },
} as const;

export type Lang = keyof typeof LANGS;

export type Translations = Record<Lang, string>;

export interface LangEntry {
  code: Lang;
  name: string;
  flag: string;
}

/** Get language list for UI dropdowns */
export function getLanguages(): LangEntry[] {
  return Object.entries(LANGS).map(([code, { name, flag }]) => ({
    code: code as Lang,
    name,
    flag,
  }));
}
