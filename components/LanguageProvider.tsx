"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { translations, type Language, type TranslationKey } from "@/lib/i18n";

const STORAGE_KEY = "portfolio-language";

interface LanguageContextValue {
  lang: Language;
  t: (key: TranslationKey) => string;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const switching = useRef(false);

  // Restore the saved language after hydration (the static HTML is English).
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "fr") setLang("fr");
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "fr"
        ? "Rijaniaina Tendry — Développeur Full-Stack"
        : "Rijaniaina Tendry — Full-Stack Developer";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  const t = useCallback((key: TranslationKey) => translations[lang][key], [lang]);

  // Fade out → swap text → fade in, to hide the reflow (same timing as the original).
  const toggle = useCallback(() => {
    if (switching.current) return;
    const next: Language = lang === "en" ? "fr" : "en";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLang(next);
      return;
    }
    switching.current = true;
    document.body.classList.add("lang-switching");
    window.setTimeout(() => {
      setLang(next);
      requestAnimationFrame(() => {
        window.setTimeout(() => {
          document.body.classList.remove("lang-switching");
          window.setTimeout(() => {
            switching.current = false;
          }, 220);
        }, 40);
      });
    }, 200);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>{children}</LanguageContext.Provider>
  );
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
