"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  Terminal,
  Copy,
  Check,
  Clock,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Code2,
  Database,
  Cloud,
  Bot,
  Filter,
  X,
  ChevronRight,
  ShieldCheck,
  Search,
  Layers,
  Cpu,
  Workflow,
  Sparkles,
} from "lucide-react";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PROJECTS,
  SKILL_GROUPS,
  TOOL_CATEGORIES,
  type Ownership,
  type Status,
  type Project,
} from "@/lib/content";
import type { TranslationKey } from "@/lib/i18n";
import { ContactForm } from "./ContactForm";
import { ExperienceCounter } from "./ExperienceCounter";
import { T, useLanguage } from "./LanguageProvider";

const CONTACT_EMAIL = "rijaniainatendry@gmail.com";

function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: TranslationKey;
  title: TranslationKey;
  intro: TranslationKey;
}) {
  return (
    <div className="section-head reveal">
      <div>
        <T k={eyebrow} as="div" className="eyebrow" />
        <T k={title} as="h2" />
      </div>
      <T k={intro} as="p" className="section-intro" />
    </div>
  );
}

// Live Antananarivo Local Clock (UTC+3)
function LocalClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      // Antananarivo is UTC+3 (Indian/Antananarivo)
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Indian/Antananarivo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTime(formatted);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="live-clock font-mono tabular-nums">
      {time || "--:--:--"} EAT
    </span>
  );
}

export function Hero() {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking for parallax over the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Subtle differential parallax offsets (transform & opacity only)
  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 36]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.95, 0.78]);
  const terminalY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 60]);
  const profileY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 80]);
  const profileRotate = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -1.8]);
  const haloY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 42]);
  const haloScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1, 1.12]);
  const pillY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 14]);

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section ref={heroRef} className="container hero">
      <motion.div
        className="hero-content reveal"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="hero-kicker-wrap">
          <T k="hero.eyebrow" as="div" className="eyebrow hero-kicker" />
          <motion.div className="location-pill" style={{ y: pillY }}>
            <MapPin className="w-3.5 h-3.5 text-accent-ink" aria-hidden="true" />
            <span>Madagascar</span>
            <span className="pill-dot">·</span>
            <Clock className="w-3.5 h-3.5 text-accent-ink" aria-hidden="true" />
            <LocalClock />
          </motion.div>
        </div>

        <T k="hero.title" as="h1" className="hero-heading" />
        <T k="hero.copy" as="p" className="hero-copy" />

        <div className="hero-actions">
          <a className="btn btn-primary" href="#work">
            <T k="hero.cta" /> <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="btn btn-secondary copy-email-btn"
            onClick={copyEmail}
            aria-label={lang === "fr" ? "Copier l'adresse email" : "Copy email address"}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700 font-medium">
                  {lang === "fr" ? "Email copié !" : "Email copied!"}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" aria-hidden="true" />
                <span>{CONTACT_EMAIL}</span>
              </>
            )}
          </button>
          <a className="btn btn-ghost" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            <T k="hero.linkedin" />
          </a>
        </div>

        {/* Interactive Terminal status with differential parallax */}
        <motion.div className="terminal-status-card" style={{ y: terminalY }}>
          <div className="terminal-header">
            <div className="terminal-dots" aria-hidden="true">
              <span className="t-dot t-red" />
              <span className="t-dot t-yellow" />
              <span className="t-dot t-green" />
            </div>
            <span className="terminal-title">tendry@dev-station: ~/engineering</span>
            <span className="terminal-tag">ACTIVE WORKSPACE</span>
          </div>
          <div className="terminal-body font-mono">
            <div className="terminal-row">
              <span className="prompt">~/stack $</span>
              <span className="cmd">status --current-focus</span>
            </div>
            <div className="terminal-output">
              <span className="highlight-tag">● Go &amp; Node.js APIs</span>
              <span className="highlight-tag">● Temporal &amp; Kafka Workflows</span>
              <span className="highlight-tag">● Claude Code AI Orchestration</span>
            </div>
            <div className="terminal-row status-line">
              <span className="prompt">&gt;</span>
              <T k="hero.status" />
              <span className="cursor" aria-hidden="true" />
            </div>
          </div>
        </motion.div>

        <a href="#about" className="scroll-hint-wrap" aria-label="Scroll to content">
          <T k="hero.scroll" as="span" className="scroll-hint-text" />
          <div className="scroll-mouse" aria-hidden="true">
            <span className="scroll-wheel" />
          </div>
        </a>
      </motion.div>

      <motion.aside
        className="profile-visual reveal"
        aria-label="Portrait of Rijaniaina Tendry"
        style={{ y: profileY, rotate: profileRotate }}
      >
        <motion.div
          className="profile-halo"
          aria-hidden="true"
          style={{ y: haloY, scale: haloScale }}
        />
        <div className="profile-card">
          <div className="profile-frame">
            <Image
              src="/assets/profile.webp"
              alt="Portrait of Rijaniaina Tendry"
              width={340}
              height={340}
              priority
              className="profile-img"
            />
          </div>
          <div className="profile-info-bar">
            <div className="profile-name-row">
              <span className="profile-beacon" aria-hidden="true" />
              <div>
                <strong className="profile-name">Rijaniaina Tendry</strong>
                <span className="profile-role">Senior Full-Stack Developer</span>
              </div>
            </div>
            <div className="profile-specs">
              <span className="profile-spec">8+ yrs tech &amp; ops</span>
              <span className="profile-spec">Remote / Global</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </section>
  );
}

export function Metrics() {
  return (
    <section className="container metrics-wrapper reveal" aria-label="Professional metrics overview">
      <div className="metrics-grid">
        <div className="metric-box live-experience-box">
          <div className="metric-head">
            <Clock className="w-4 h-4 text-accent-ink" aria-hidden="true" />
            <span className="metric-label">Software Dev Journey</span>
          </div>
          <ExperienceCounter />
        </div>

        <div className="metric-box">
          <div className="metric-head">
            <Code2 className="w-4 h-4 text-accent-ink" aria-hidden="true" />
            <span className="metric-label">Full-Stack Scope</span>
          </div>
          <strong className="metric-value">Frontend → Backend</strong>
          <T k="metric.fullstack" as="p" className="metric-sub" />
        </div>

        <div className="metric-box">
          <div className="metric-head">
            <Cloud className="w-4 h-4 text-accent-ink" aria-hidden="true" />
            <span className="metric-label">Delivery &amp; Ops</span>
          </div>
          <strong className="metric-value">Docker &amp; K8s</strong>
          <T k="metric.cloud" as="p" className="metric-sub" />
        </div>

        <div className="metric-box">
          <div className="metric-head">
            <Bot className="w-4 h-4 text-accent-ink" aria-hidden="true" />
            <span className="metric-label">AI Engineering</span>
          </div>
          <strong className="metric-value">Claude Code</strong>
          <T k="metric.ai" as="p" className="metric-sub" />
        </div>
      </div>
    </section>
  );
}

export function About() {
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const skillGroupsFiltered =
    activeGroup === "all"
      ? SKILL_GROUPS
      : SKILL_GROUPS.filter((g) => g.key.toLowerCase().includes(activeGroup));

  return (
    <section className="container section" id="about">
      <SectionHead eyebrow="about.eyebrow" title="about.title" intro="about.intro" />
      <div className="about-grid reveal">
        <div className="about-editorial-lead">
          <T k="about.lead" as="div" className="about-lead-text" />
          <div className="about-philosophy-quote">
            <span className="quote-mark">“</span>
            <p>
              Having worked first in operations and training before software engineering
              gives me a direct understanding of real-world operational friction. I build
              systems that are maintainable, testable, and reliable for teams.
            </p>
          </div>
        </div>
        <div className="about-editorial-body">
          <T k="about.body" as="div" className="about-body-text" />
        </div>
      </div>

      {/* Skill matrix with interactive category filter */}
      <div className="skills-matrix-wrap reveal">
        <div className="skills-filter-bar">
          <span className="skills-filter-label">Tech Competencies</span>
          <div className="skills-filter-tabs">
            <button
              type="button"
              className={`filter-btn ${activeGroup === "all" ? "is-active" : ""}`}
              onClick={() => setActiveGroup("all")}
            >
              All Domains
            </button>
            <button
              type="button"
              className={`filter-btn ${activeGroup === "frontend" ? "is-active" : ""}`}
              onClick={() => setActiveGroup("frontend")}
            >
              Frontend
            </button>
            <button
              type="button"
              className={`filter-btn ${activeGroup === "backend" ? "is-active" : ""}`}
              onClick={() => setActiveGroup("backend")}
            >
              Backend
            </button>
            <button
              type="button"
              className={`filter-btn ${activeGroup === "data" ? "is-active" : ""}`}
              onClick={() => setActiveGroup("data")}
            >
              Data
            </button>
            <button
              type="button"
              className={`filter-btn ${activeGroup === "infra" ? "is-active" : ""}`}
              onClick={() => setActiveGroup("infra")}
            >
              Infra &amp; AI
            </button>
          </div>
        </div>

        <div className="skill-groups-grid">
          {skillGroupsFiltered.map((group) => (
            <div className="skill-group-card" key={group.key}>
              <div className="skill-group-header">
                {group.key.includes("frontend") && <Code2 className="w-4 h-4 text-accent-ink" />}
                {group.key.includes("backend") && <Cpu className="w-4 h-4 text-accent-ink" />}
                {group.key.includes("data") && <Database className="w-4 h-4 text-accent-ink" />}
                {group.key.includes("infra") && <Cloud className="w-4 h-4 text-accent-ink" />}
                <T k={group.key} as="h3" className="skill-group-title" />
              </div>
              <div className="skill-tags">
                {group.tags.map((tag) => (
                  <span className="skill-tag-item" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const OWNERSHIP_KEY: Record<Ownership, TranslationKey> = {
  personal: "project.personal",
  company: "project.company",
};
const STATUS_KEY: Record<Status, TranslationKey> = {
  idea: "project.idea",
  progress: "project.progress",
  done: "project.done",
};

interface ProjectArchitectureData {
  title: string;
  diagram: string[];
  patterns: string[];
  impact: string;
}

const PROJECT_ARCH_DETAILS: Record<string, ProjectArchitectureData> = {
  "All-Intranet": {
    title: "All-Intranet Architecture Blueprint",
    diagram: [
      "Core Microkernel (Go / NestJS)",
      "Service Discovery & IAM (Keycloak / OAuth2)",
      "Dynamic Plugin Host (WebAssembly / Sandboxed Containers)",
      "Decoupled React / Next.js Micro-Frontend Shell",
    ],
    patterns: [
      "Decoupled Core / Plugin microkernel architecture",
      "Dynamic module registration with schema validation",
      "Strict role-based access control (RBAC)",
      "Event-driven inter-service bus for zero downtime extensions",
    ],
    impact:
      "Eliminates monolithic bloat by letting business units build and deploy independent internal tooling widgets without redeploying the core platform.",
  },
  "Claude Colabs": {
    title: "Claude Colabs Orchestration Blueprint",
    diagram: [
      "Human Developer + AI Agent Workspace Layer",
      "Git Worktree & Branch Synchronization Manager",
      "Task Orchestration Engine with Audit Log",
      "Security Sandbox with Permission Gates & RBAC",
    ],
    patterns: [
      "Shared Git worktree management for parallel human/AI pairs",
      "Granular capability boundaries with strict file write verification",
      "Structured task handoff protocols with machine-readable checkpoints",
      "Reproducible dev environments via Docker & DevContainers",
    ],
    impact:
      "Transforms generative AI tools like Claude Code from single-user CLI chat into an auditable, collaborative multi-agent workflow integrated with standard GitHub PR reviews.",
  },
};

export function Projects() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [selectedArch, setSelectedArch] = useState<ProjectArchitectureData | null>(null);

  const filteredProjects = PROJECTS.filter((p) => {
    if (filter === "all") return true;
    if (filter === "platform") return p.typeKey.includes("platform");
    if (filter === "ai") return p.typeKey.includes("ai");
    return true;
  });

  return (
    <section className="projects section" id="work">
      <div className="container">
        <SectionHead eyebrow="work.eyebrow" title="work.title" intro="work.intro" />

        {/* Project category filter */}
        <div className="project-filter-controls reveal">
          <div className="filter-pill-bar">
            <button
              type="button"
              className={`filter-btn ${filter === "all" ? "is-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              {lang === "fr" ? "Tous les projets" : "All Projects"}
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === "platform" ? "is-active" : ""}`}
              onClick={() => setFilter("platform")}
            >
              {lang === "fr" ? "Architecture de plateforme" : "Platform Architecture"}
            </button>
            <button
              type="button"
              className={`filter-btn ${filter === "ai" ? "is-active" : ""}`}
              onClick={() => setFilter("ai")}
            >
              {lang === "fr" ? "IA & Collaboration" : "AI & Collaboration"}
            </button>
          </div>
          <span className="project-count-badge font-mono">
            {filteredProjects.length} {lang === "fr" ? "projets affichés" : "projects"}
          </span>
        </div>

        <div className="project-grid">
          {filteredProjects.map((project, i) => {
            const arch = PROJECT_ARCH_DETAILS[project.title];
            return (
              <article className="project-card reveal" key={project.title}>
                <div className="project-card-header">
                  <div className="project-type-row">
                    <T k={project.typeKey} className="project-type-text" />
                    <span className="project-index font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="project-status-row">
                    <span className={`status-badge status-${project.status}`}>
                      <span className="status-dot" aria-hidden="true" />
                      <T k={STATUS_KEY[project.status]} />
                    </span>
                    <span className="ownership-text">
                      <T k={OWNERSHIP_KEY[project.ownership]} />
                    </span>
                  </div>
                </div>

                <div className="project-card-body">
                  <h3 className="project-title">{project.title}</h3>
                  <T k={project.descKey} as="p" className="project-description" />

                  {/* Architecture blueprint preview block */}
                  {arch && (
                    <div className="project-blueprint-preview">
                      <div className="blueprint-header">
                        <Workflow className="w-3.5 h-3.5 text-accent-ink" aria-hidden="true" />
                        <span>System Architecture Highlights</span>
                      </div>
                      <ul className="blueprint-list">
                        {arch.patterns.slice(0, 2).map((pattern) => (
                          <li key={pattern} className="blueprint-item">
                            <span className="blueprint-arrow">→</span> {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span className="project-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="project-card-footer">
                  {arch && (
                    <button
                      type="button"
                      className="btn-inspect-arch"
                      onClick={() => setSelectedArch(arch)}
                    >
                      <span>{lang === "fr" ? "Voir l'architecture système" : "Inspect system architecture"}</span>
                      <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <T k="work.note" as="p" className="projects-confidentiality-note" />
      </div>

      {/* Architecture Deep Dive Modal */}
      {selectedArch && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedArch(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="arch-modal-title"
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-kicker">Architecture Specification</span>
                <h3 id="arch-modal-title" className="modal-title">
                  {selectedArch.title}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedArch(null)}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4 className="modal-section-title">
                  <Layers className="w-4 h-4 mr-1.5 inline" /> Core System Layers
                </h4>
                <div className="arch-layers-diagram font-mono">
                  {selectedArch.diagram.map((layer, index) => (
                    <div className="arch-layer-node" key={layer}>
                      <span className="layer-step">{index + 1}</span>
                      <span className="layer-text">{layer}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">
                  <ShieldCheck className="w-4 h-4 mr-1.5 inline" /> Engineering Principles &amp; Patterns
                </h4>
                <ul className="modal-patterns-list">
                  {selectedArch.patterns.map((p) => (
                    <li key={p}>
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 inline mr-2" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">
                  <Sparkles className="w-4 h-4 mr-1.5 inline" /> Practical Engineering Impact
                </h4>
                <p className="modal-impact-text">{selectedArch.impact}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedArch(null)}
              >
                {lang === "fr" ? "Fermer" : "Close overview"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Tools() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    tools: cat.tools.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  })).filter((cat) => cat.tools.length > 0);

  return (
    <section className="container section tools-section" id="tools">
      <SectionHead eyebrow="tools.eyebrow" title="tools.title" intro="tools.intro" />

      {/* Tool search box */}
      <div className="tool-search-wrap reveal">
        <div className="tool-search-input-box">
          <Search className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            className="tool-search-input"
            placeholder="Filter tools (e.g. Docker, Notion, Claude, Kubernetes, Git)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="tools-grid">
        {filteredCategories.map((category) => (
          <article className="tool-category-card reveal" key={category.key}>
            <T k={category.key} as="h3" className="tool-category-title" />
            <div className="tool-pill-list">
              {category.tools.map((tool) => (
                <div className="tool-chip" key={tool.name}>
                  <span className="tool-avatar font-mono">{tool.icon}</span>
                  <span className="tool-label">{tool.name}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <T k="tools.note" as="p" className="tools-note" />
    </section>
  );
}

const EXPERIENCE = [
  {
    date: "experience.date",
    role: "experience.role",
    desc: "experience.desc",
    company: true,
    highlights: [
      "Full-stack architecture: React, Next.js, TypeScript, Go, NestJS, and .NET",
      "Data & workflow automation: PostgreSQL, document processing engines, Temporal",
      "DevOps deployment: Containerization with Docker & Kubernetes clusters",
    ],
  },
  {
    date: "experience.focus",
    role: "experience.focusTitle",
    desc: "experience.focusDesc",
    company: false,
    highlights: [
      "AI-driven coding workflows with Claude Code in professional production environments",
      "Human-in-the-loop verification, RBAC security gates, and auditable Git PR reviews",
    ],
  },
  {
    date: "experience.trainer.date",
    role: "experience.trainer.role",
    desc: "experience.trainer.desc",
    company: true,
    highlights: [
      "Trained and onboarded dozens of operators and technicians on core business systems",
      "Authored operational manuals, quality standards, and technical onboarding tracks",
    ],
  },
  {
    date: "experience.ops.date",
    role: "experience.ops.role",
    desc: "experience.ops.desc",
    company: true,
    highlights: [
      "Hands-on execution of data entry, case handling, and critical business workflows",
      "Direct exposure to user pain points, driving deep empathy for ergonomic UX",
    ],
  },
] as const satisfies readonly {
  date: TranslationKey;
  role: TranslationKey;
  desc: TranslationKey;
  company: boolean;
  highlights: string[];
}[];

export function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className="container section" id="experience">
      <SectionHead eyebrow="experience.eyebrow" title="experience.title" intro="experience.intro" />
      <div className="timeline-container reveal">
        <ol className="timeline-list">
          {EXPERIENCE.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <li className={`timeline-entry ${isExpanded ? "is-expanded" : ""}`} key={item.role}>
                <div className="timeline-marker" aria-hidden="true">
                  <span className="timeline-node" />
                  <span className="timeline-line" />
                </div>
                <div className="timeline-content-card">
                  <div className="timeline-meta-row">
                    <T k={item.date} as="div" className="timeline-date font-mono" />
                    {item.company && (
                      <span className="timeline-company-tag">
                        <T k="experience.company" />
                      </span>
                    )}
                  </div>

                  <T k={item.role} as="h3" className="timeline-role-title" />
                  <T k={item.desc} as="p" className="timeline-desc" />

                  {/* Highlights expandable */}
                  <div className="timeline-highlights">
                    <button
                      type="button"
                      className="timeline-toggle-btn"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    >
                      <span>{isExpanded ? "Hide key achievements" : "View key responsibilities & stack"}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 ml-1 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {isExpanded && (
                      <ul className="timeline-highlights-list">
                        {item.highlights.map((h) => (
                          <li key={h} className="timeline-highlight-point">
                            <span className="highlight-bullet">▸</span> {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const APPROACH = [
  {
    title: "approach.oneTitle",
    body: "approach.one",
    icon: Search,
    detail: "Clarifying business constraints, user journeys and edge cases before writing code.",
  },
  {
    title: "approach.twoTitle",
    body: "approach.two",
    icon: Cpu,
    detail: "Clean boundaries, strong typing, decoupled services, and maintainable schemas.",
  },
  {
    title: "approach.threeTitle",
    body: "approach.three",
    icon: ShieldCheck,
    detail: "Responsible AI acceleration, rigorous automated testing, and operational observability.",
  },
] as const satisfies readonly {
  title: TranslationKey;
  body: TranslationKey;
  icon: typeof Search;
  detail: string;
}[];

export function Approach() {
  return (
    <section className="approach section">
      <div className="container">
        <SectionHead eyebrow="approach.eyebrow" title="approach.title" intro="approach.intro" />
        <div className="approach-grid reveal">
          {APPROACH.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div className="approach-card" key={item.title}>
                <div className="approach-card-header">
                  <div className="approach-step-num font-mono">0{idx + 1}</div>
                  <div className="approach-icon-wrap">
                    <Icon className="w-5 h-5 text-accent-ink" aria-hidden="true" />
                  </div>
                </div>
                <T k={item.title} as="strong" className="approach-card-title" />
                <T k={item.body} as="p" className="approach-card-body" />
                <p className="approach-card-detail">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const { lang } = useLanguage();

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="container contact" id="contact">
      <div className="contact-panel reveal">
        <div className="contact-intro">
          <T k="contact.eyebrow" as="div" className="eyebrow" />
          <T k="contact.title" as="h2" className="contact-panel-title" />
          <T k="contact.copy" as="p" className="contact-panel-copy" />

          <div className="contact-highlights-card">
            <div className="contact-highlight-row">
              <Clock className="w-4 h-4 text-accent-ink shrink-0" />
              <span>{lang === "fr" ? "Réponse sous 24h ouvrées" : "Response within 24 business hours"}</span>
            </div>
            <div className="contact-highlight-row">
              <MapPin className="w-4 h-4 text-accent-ink shrink-0" />
              <span>Antananarivo, Madagascar (UTC+3)</span>
            </div>
          </div>

          <div className="contact-direct-actions">
            <button
              type="button"
              className="btn btn-secondary contact-email-btn"
              onClick={copyEmail}
              aria-label="Copy email"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">
                    {lang === "fr" ? "Email copié !" : "Email copied!"}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>{CONTACT_EMAIL}</span>
                </>
              )}
            </button>

            <div className="contact-social-links">
              <a className="btn btn-ghost social-link-btn" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                <span>LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
              <a className="btn btn-ghost social-link-btn" href={GITHUB_URL} target="_blank" rel="noreferrer">
                <span>GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Form integrated with Next.js /api/contact */}
        <div className="contact-form-container">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-wrap">
      <div className="container footer-content">
        <div className="footer-brand-side">
          <span className="footer-brand">Rijaniaina Tendry</span>
          <span className="footer-tagline">
            Senior Full-Stack Developer · Systems, platform architecture &amp; practical AI.
          </span>
        </div>

        <div className="footer-links-side">
          <div className="footer-links">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="footer-link">
              GitHub ↗
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="footer-link">
              LinkedIn ↗
            </a>
            <T k="footer.privacy" as="span" className="footer-link" />
            <T k="footer.location" as="span" className="footer-location" />
          </div>

          <button type="button" className="footer-back-to-top" onClick={scrollToTop}>
            <span>Top</span> ↑
          </button>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Rijaniaina Tendry. All rights reserved.</p>
      </div>
    </footer>
  );
}
