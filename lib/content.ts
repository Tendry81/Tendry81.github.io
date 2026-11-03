import type { TranslationKey } from "./i18n";

export const LINKEDIN_URL =
  "https://www.linkedin.com/in/rijaniaina-tendry-randrianalifetra-547013243/";
export const GITHUB_URL = "https://github.com/Tendry81";

export const NAV_SECTIONS = [
  { id: "about", key: "nav.about" },
  { id: "work", key: "nav.work" },
  { id: "tools", key: "nav.tools" },
  { id: "experience", key: "nav.experience" },
  { id: "contact", key: "nav.contact" },
] as const satisfies readonly { id: string; key: TranslationKey }[];

export const SKILL_GROUPS: { key: TranslationKey; tags: string[] }[] = [
  {
    key: "skills.frontend",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Zustand", "TanStack Query"],
  },
  {
    key: "skills.backend",
    tags: ["Node.js", "Go", "C# / .NET", "Python", "PHP", "REST APIs", "GORM"],
  },
  {
    key: "skills.data",
    tags: ["PostgreSQL", "Redis", "SQL", "NoSQL", "Kafka", "Temporal"],
  },
  {
    key: "skills.infra",
    tags: ["Docker", "Kubernetes", "Linux", "Apache", "Vault", "Keycloak", "Claude Code"],
  },
];

export type Ownership = "personal" | "company";
export type Status = "idea" | "progress" | "done";

export interface Project {
  title: string;
  typeKey: TranslationKey;
  descKey: TranslationKey;
  ownership: Ownership;
  status: Status;
  tags: string[];
}

export const PROJECTS: Project[] = [
  {
    title: "All-Intranet",
    typeKey: "project.type.platform",
    descKey: "project.desc.all",
    ownership: "personal",
    status: "idea",
    tags: ["Platform design", "Plugin arch.", "IAM", "Dynamic UI"],
  },
  {
    title: "Claude Colabs",
    typeKey: "project.type.ai",
    descKey: "project.desc.colabs",
    ownership: "personal",
    status: "progress",
    tags: ["Claude Code", "Git workflows", "RBAC", "Orchestration"],
  },
];

export const TOOL_CATEGORIES: { key: TranslationKey; tools: { icon: string; name: string }[] }[] = [
  {
    key: "tools.pm",
    tools: [
      { icon: "J", name: "Jira" },
      { icon: "L", name: "Linear" },
      { icon: "N", name: "Notion" },
      { icon: "S", name: "Slack" },
    ],
  },
  {
    key: "tools.dev",
    tools: [
      { icon: "GL", name: "GitLab" },
      { icon: "GH", name: "GitHub" },
      { icon: "G", name: "Git" },
      { icon: "D", name: "Docker" },
    ],
  },
  {
    key: "tools.platform",
    tools: [
      { icon: "K8", name: "Kubernetes" },
      { icon: "H", name: "Helm" },
      { icon: "AI", name: "Claude Code" },
    ],
  },
];
