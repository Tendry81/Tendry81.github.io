import type { Metadata } from "next";
import { GITHUB_URL, LINKEDIN_URL } from "./content";
import type { Language } from "./i18n";

export const SITE_URL = "https://tendry81.github.io";
export const SITE_NAME = "Rijaniaina Tendry";

/** Path of each language version (English is the default at the root). */
export const LANG_PATH: Record<Language, string> = { en: "/", fr: "/fr/" };

const META: Record<Language, { title: string; description: string; locale: string }> = {
  en: {
    title: "Rijaniaina Tendry — Senior Full-Stack Developer (React, Go, .NET)",
    description:
      "Senior Full-Stack Developer in Antananarivo, Madagascar. Business applications, backend platforms and data workflows with React, TypeScript, Node.js, Go, .NET, PostgreSQL, Kafka and Kubernetes. Open to remote roles and freelance missions.",
    locale: "en_US",
  },
  fr: {
    title: "Rijaniaina Tendry — Développeur Senior Full-Stack (React, Go, .NET)",
    description:
      "Développeur Senior Full-Stack à Antananarivo, Madagascar. Applications métier, plateformes backend et workflows de données avec React, TypeScript, Node.js, Go, .NET, PostgreSQL, Kafka et Kubernetes. Ouvert aux missions à distance et au freelance.",
    locale: "fr_FR",
  },
};

export function buildMetadata(lang: Language): Metadata {
  const m = META[lang];
  const other: Language = lang === "en" ? "fr" : "en";
  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    keywords: [
      "Rijaniaina Tendry",
      "Senior Full-Stack Developer",
      "Développeur Full-Stack",
      "Madagascar",
      "Antananarivo",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "NestJS",
      "Go",
      ".NET",
      "PostgreSQL",
      "Kafka",
      "Kubernetes",
      "Remote developer",
      "Freelance",
    ],
    alternates: {
      canonical: LANG_PATH[lang],
      languages: { en: LANG_PATH.en, fr: LANG_PATH.fr, "x-default": LANG_PATH.en },
    },
    openGraph: {
      type: "profile",
      url: LANG_PATH[lang],
      siteName: SITE_NAME,
      title: m.title,
      description: m.description,
      locale: m.locale,
      alternateLocale: [META[other].locale],
      firstName: "Rijaniaina Tendry",
      lastName: "Randrianalifetra",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: m.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

/** schema.org Person + WebSite structured data. */
export function jsonLd(lang: Language) {
  const url = SITE_URL + LANG_PATH[lang];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Rijaniaina Tendry Randrianalifetra",
        alternateName: "Rijaniaina Tendry",
        url: SITE_URL + "/",
        image: `${SITE_URL}/assets/profile.webp`,
        jobTitle: lang === "fr" ? "Développeur Senior Full-Stack" : "Senior Full-Stack Developer",
        worksFor: { "@type": "Organization", name: "Be ys Outsourcing Services Madagascar" },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Antananarivo",
          addressCountry: "MG",
        },
        knowsLanguage: ["mg", "fr", "en"],
        knowsAbout: [
          "Full-stack development",
          "React",
          "TypeScript",
          "Node.js",
          "Go",
          ".NET",
          "PostgreSQL",
          "Kafka",
          "Kubernetes",
          "Workflow automation",
          "Document processing",
          "AI-assisted software engineering",
          "LLM integration (OpenAI, Google GenAI, Vercel AI SDK, CrewAI)",
          "AI agent customization (plugins, tools, MCP, skills, commands)",
        ],
        sameAs: [LINKEDIN_URL, GITHUB_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url,
        name: SITE_NAME,
        inLanguage: lang,
        about: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}
