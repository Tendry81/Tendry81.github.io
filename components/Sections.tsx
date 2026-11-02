import Image from "next/image";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PROJECTS,
  SKILL_GROUPS,
  TOOL_CATEGORIES,
  type Ownership,
  type Status,
} from "@/lib/content";
import type { TranslationKey } from "@/lib/i18n";
import { ExperienceCounter } from "./ExperienceCounter";
import { T } from "./LanguageProvider";

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

export function Hero() {
  return (
    <section className="container hero">
      <div className="reveal">
        <T k="hero.eyebrow" as="div" className="eyebrow" />
        <T k="hero.title" as="h1" />
        <T k="hero.copy" as="p" className="hero-copy" />
        <div className="actions">
          <a className="btn btn-primary" href="#work">
            <T k="hero.cta" /> <span aria-hidden="true">↗</span>
          </a>
          <a className="btn btn-secondary" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            <T k="hero.linkedin" />
          </a>
        </div>
        <div className="status-line">
          <span className="prompt">~/</span>
          <T k="hero.status" />
          <span className="cursor" aria-hidden="true" />
        </div>
        <T k="hero.scroll" as="div" className="scroll-indicator" />
      </div>

      <aside className="profile-visual reveal" aria-label="Profile portrait">
        <div className="profile-halo" aria-hidden="true" />
        <div className="profile-frame">
          <Image
            src="/assets/profile.webp"
            alt="Portrait of Rijaniaina Tendry"
            width={326}
            height={326}
            priority
          />
        </div>
        <div className="profile-label">
          <span className="profile-label-dot" />
          <span>
            <strong>Rijaniaina Tendry</strong>
            <small>Full-Stack · Madagascar</small>
          </span>
        </div>
        <div className="profile-chip profile-chip-one">Backend &amp; APIs</div>
        <div className="profile-chip profile-chip-two">AI-assisted engineering</div>
      </aside>
    </section>
  );
}

export function Metrics() {
  return (
    <section className="container metrics reveal" aria-label="Professional overview">
      <ExperienceCounter />
      <div className="metric">
        <strong>Full-Stack</strong>
        <T k="metric.fullstack" />
      </div>
      <div className="metric">
        <strong>Cloud &amp; DevOps</strong>
        <T k="metric.cloud" />
      </div>
      <div className="metric">
        <strong>AI-assisted</strong>
        <T k="metric.ai" />
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="container section" id="about">
      <SectionHead eyebrow="about.eyebrow" title="about.title" intro="about.intro" />
      <div className="about-grid reveal">
        <T k="about.lead" as="div" className="about-lead" />
        <T k="about.body" as="div" className="about-body" />
      </div>
      <div className="skill-groups reveal">
        {SKILL_GROUPS.map((group) => (
          <div className="skill-group" key={group.key}>
            <T k={group.key} as="h3" />
            <div className="tags">
              {group.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
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

export function Projects() {
  return (
    <section className="projects section" id="work">
      <div className="container">
        <SectionHead eyebrow="work.eyebrow" title="work.title" intro="work.intro" />
        <div className="project-grid">
          {PROJECTS.map((project, i) => (
            <article className="project reveal" key={project.title}>
              <div className="project-top">
                <T k={project.typeKey} className="project-type" />
                <span className="project-index">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="project-badges">
                <T
                  k={OWNERSHIP_KEY[project.ownership]}
                  className={`ownership-badge ownership-${project.ownership}`}
                />
                <T k={STATUS_KEY[project.status]} className={`progress-badge status-${project.status}`} />
              </div>
              <h3>{project.title}</h3>
              <T k={project.descKey} as="p" />
              <div className="tags">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <T k="work.note" as="p" className="note" />
      </div>
    </section>
  );
}

export function Tools() {
  return (
    <section className="container section tools-section" id="tools">
      <SectionHead eyebrow="tools.eyebrow" title="tools.title" intro="tools.intro" />
      <div className="tools-grid">
        {TOOL_CATEGORIES.map((category) => (
          <article className="tool-category reveal" key={category.key}>
            <T k={category.key} as="h3" />
            <div className="tool-list">
              {category.tools.map((tool) => (
                <span className="tool-pill" key={tool.name}>
                  <span className="tool-icon">{tool.icon}</span>
                  {tool.name}
                </span>
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
  { date: "experience.date", role: "experience.role", desc: "experience.desc", company: true },
  { date: "experience.trainer.date", role: "experience.trainer.role", desc: "experience.trainer.desc", company: true },
  { date: "experience.ops.date", role: "experience.ops.role", desc: "experience.ops.desc", company: true },
  { date: "experience.focus", role: "experience.focusTitle", desc: "experience.focusDesc", company: false },
] as const satisfies readonly {
  date: TranslationKey;
  role: TranslationKey;
  desc: TranslationKey;
  company: boolean;
}[];

export function Experience() {
  return (
    <section className="container section" id="experience">
      <SectionHead eyebrow="experience.eyebrow" title="experience.title" intro="experience.intro" />
      <ol className="experience-list reveal">
        {EXPERIENCE.map((item) => (
          <li className="experience-item" key={item.role}>
            <T k={item.date} as="div" className="experience-date" />
            <div>
              <T k={item.role} as="h3" />
              {item.company && <T k="experience.company" as="p" className="experience-company" />}
              <T k={item.desc} as="p" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const APPROACH = [
  { title: "approach.oneTitle", body: "approach.one" },
  { title: "approach.twoTitle", body: "approach.two" },
  { title: "approach.threeTitle", body: "approach.three" },
] as const satisfies readonly { title: TranslationKey; body: TranslationKey }[];

export function Approach() {
  return (
    <section className="approach section">
      <div className="container">
        <SectionHead eyebrow="approach.eyebrow" title="approach.title" intro="approach.intro" />
        <div className="approach-grid reveal">
          {APPROACH.map((item) => (
            <div className="approach-item" key={item.title}>
              <T k={item.title} as="strong" />
              <T k={item.body} as="p" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="container contact" id="contact">
      <div className="contact-panel reveal">
        <div>
          <T k="contact.eyebrow" as="div" className="eyebrow" />
          <T k="contact.title" as="h2" />
          <T k="contact.copy" as="p" />
        </div>
        <div className="contact-actions">
          <a className="btn btn-primary" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            <T k="contact.cta" />
          </a>
          <a className="btn btn-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <T k="contact.github" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="container footer">
      <span>© {new Date().getFullYear()} Rijaniaina Tendry — engineered with clarity.</span>
      <span>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        &nbsp;·&nbsp;
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        &nbsp;·&nbsp; <T k="footer.location" />
      </span>
    </footer>
  );
}
