"use client";

import { useLanguage } from "@/contexts/language-context";
import id from "@/locales/id.json";
import en from "@/locales/en.json";

const translations: Record<string, Record<string, string>> = { id, en };

export function useTranslation() {
  const { locale } = useLanguage();

  const t = (key: string): string => {
    return translations[locale][key] ?? key;
  };

  return { t, locale };
}
