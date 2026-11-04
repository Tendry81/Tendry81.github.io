"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Menu, X, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { NAV_SECTIONS } from "@/lib/content";
import { LANG_PATH } from "@/lib/seo";
import { T, useLanguage } from "./LanguageProvider";

export function Nav() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });
  const scaleX = shouldReduceMotion ? scrollYProgress : smoothProgress;

  // Initialize theme from system or saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  // Lock body scroll on mobile when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on outside click, Escape, and resize
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
    const mq = window.matchMedia("(min-width: 860px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Highlight the section currently in view
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
      { threshold: [0, 0.2, 0.4, 0.6], rootMargin: "-15% 0px -40% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const fr = lang === "fr";
  const menuLabel = open
    ? fr ? "Fermer le menu" : "Close menu"
    : fr ? "Ouvrir le menu" : "Open menu";

  return (
    <>
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX }}
        aria-hidden="true"
      />
      {/* Backdrop overlay for mobile menu */}
      <div
        className={`mobile-nav-backdrop${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <header ref={navRef} className={`site-header${open ? " is-open" : ""}`} id="site-nav">
      <div className="container nav-container">
        {/* Zone 1: Wordmark */}
        <a className="brand" href="#top" aria-label="Rijaniaina Tendry home">
          <span className="brand-mark">RT</span>
          <span className="brand-text">
            <span className="brand-name">Rijaniaina Tendry</span>
            <span className="brand-role">{fr ? "Développeur Full-Stack" : "Full-Stack Engineer"}</span>
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="nav-links" id="nav-links" aria-label={t("nav.label")}>
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">{fr ? "Navigation" : "Menu"}</span>
            <span className="mobile-drawer-city">Antananarivo · UTC+3</span>
          </div>

          {NAV_SECTIONS.map((s, idx) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`nav-link ${activeId === s.id ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-nav-num">0{idx + 1}</span>
              <span className="mobile-nav-label">{t(s.key)}</span>
              <ArrowUpRight className="mobile-nav-arrow" aria-hidden="true" />
            </a>
          ))}

          <div className="mobile-drawer-footer">
            <div className="mobile-availability-card">
              <span className="dot" aria-hidden="true" />
              <span className="mobile-availability-text">{t("nav.availability")}</span>
            </div>

            <a
              className="btn btn-primary mobile-cta-btn"
              href="#contact"
              onClick={() => setOpen(false)}
            >
              <span>{fr ? "Démarrer un projet" : "Start a project"}</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </a>

            <div className="mobile-drawer-socials">
              <a href="https://github.com/Tendry81" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
                GitHub
              </a>
              <span className="mobile-social-sep">·</span>
              <a href="https://www.linkedin.com/in/rijaniaina-tendry-randrianalifetra-547013243/" target="_blank" rel="noopener noreferrer" className="mobile-social-link">
                LinkedIn
              </a>
              <span className="mobile-social-sep">·</span>
              <a href="mailto:rijaniainatendry@outlook.com" className="mobile-social-link">
                Email
              </a>
            </div>
          </div>
        </nav>

        {/* Zone 3: Actions (Availability + Theme + Language) */}
        <div className="nav-actions">
          <div className="availability desktop-only" title={t("nav.availability")}>
            <span className="dot" aria-hidden="true" />
            <span className="availability-text">{t("nav.availability")}</span>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? (fr ? "Activer mode clair" : "Switch to light mode") : (fr ? "Activer mode sombre" : "Switch to dark mode")}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <a
            className="language-toggle"
            href={LANG_PATH[fr ? "en" : "fr"]}
            hrefLang={fr ? "en" : "fr"}
            lang={fr ? "en" : "fr"}
            aria-label={t("nav.switch")}
          >
            <span>{fr ? "EN" : "FR"}</span>
          </a>

          <a className="btn btn-primary nav-contact-btn desktop-only" href="#contact" onClick={() => setOpen(false)}>
            <span>Contact</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>

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
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
    </>
  );
}
