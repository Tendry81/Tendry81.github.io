"use client";

import { createContext, useContext } from "react";
import { translations, type Language, type TranslationKey } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Language;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** The language comes from the route (/ = English, /fr/ = French), so both are pre-rendered. */
export function LanguageProvider({ lang, children }: { lang: Language; children: React.ReactNode }) {
  const t = (key: TranslationKey) => translations[lang][key];
  return <LanguageContext.Provider value={{ lang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

type TagName = "span" | "div" | "p" | "h1" | "h2" | "h3" | "strong";

/** Renders a translation. Values are trusted static strings that may contain inline HTML. */
export function T({
  k,
  as: Tag = "span",
  className,
}: {
  k: TranslationKey;
  as?: TagName;
  className?: string;
}) {
  const { t } = useLanguage();
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: t(k) }} />;
}
