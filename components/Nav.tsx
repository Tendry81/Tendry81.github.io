"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_SECTIONS } from "@/lib/content";
import { T, useLanguage } from "./LanguageProvider";

export function Nav() {
  const { lang, t, toggle } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close on outside click, Escape, and when going back to desktop width.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 761px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best: string | null = null;
        let bestRatio = 0;
        ratios.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        });
        setActiveId(bestRatio > 0 ? best : null);
      },
      { threshold: [0, 0.2, 0.4, 0.6], rootMargin: "-20% 0px -45% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const fr = lang === "fr";
  const menuLabel = open
    ? fr ? "Fermer le menu" : "Close menu"
    : fr ? "Ouvrir le menu" : "Open menu";

  return (
    <header ref={navRef} className={`container nav${open ? " is-open" : ""}`} id="site-nav">
      <a className="brand" href="#top" aria-label="Rijaniaina Tendry home">
        <span className="brand-mark">RT</span>
        <span>Rijaniaina Tendry</span>
      </a>
      <nav className="nav-links" id="nav-links" aria-label={t("nav.label")}>
        {NAV_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={activeId === s.id ? "is-active" : undefined}
            onClick={() => setOpen(false)}
          >
            {t(s.key)}
          </a>
        ))}
      </nav>
      <div className="availability">
        <span className="dot" />
        <T k="nav.availability" />
      </div>
      <button
        className="language-toggle"
        type="button"
        onClick={toggle}
        aria-label={fr ? "Switch to English" : "Passer en français"}
      >
        {fr ? "EN" : "FR"}
      </button>
      <button
        className="nav-toggle"
        type="button"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <span className="nav-toggle-bars" aria-hidden="true" />
      </button>
    </header>
  );
}
