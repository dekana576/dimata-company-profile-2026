"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore, type ReactNode } from "react";

type Locale = "id" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import idLocales from "@/locales/id.json";
import enLocales from "@/locales/en.json";

const translations: Record<Locale, Record<string, string>> = {
  id: idLocales,
  en: enLocales,
};

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "id";
  try {
    const saved = localStorage.getItem("dimata-locale") as Locale | null;
    if (saved === "en" || saved === "id") return saved;
  } catch {}
  return "id";
}

function subscribeLocale(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getSnapshot(): Locale {
  return getInitialLocale();
}

function getServerSnapshot(): Locale {
  return "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, getSnapshot, getServerSnapshot);
  const [localeState, setLocaleState] = useState<Locale>(locale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("dimata-locale", newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback((key: string): string => {
    return translations[localeState]?.[key] || key;
  }, [localeState]);

  return (
    <LanguageContext.Provider value={{ locale: localeState, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
