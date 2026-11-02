/**
 * Contact form → Notion.
 *
 * Receives the portfolio's « Discuss your project » form as JSON, validates it,
 * and creates a page (row) in a Notion database. The Notion token stays here,
 * never in the static site.
 */

export interface Env {
  NOTION_TOKEN: string;
  NOTION_DATABASE_ID: string;
  ALLOWED_ORIGINS: string;
}

const NOTION_VERSION = "2022-06-28";

// Stable keys sent by the site → option names stored in Notion.
const PROJECT_TYPES: Record<string, string> = {
  webapp: "Web application",
  backend: "Backend / API",
  automation: "Automation & workflows",
  ai: "AI integration",
  freelance: "Freelance mission",
  job: "Full-time / remote role",
  other: "Other",
};
const BUDGETS: Record<string, string> = {
  lt1k: "< 1 000 €",
  "1k-5k": "1 000 – 5 000 €",
  "5k-15k": "5 000 – 15 000 €",
  gt15k: "> 15 000 €",
  tbd: "To be defined",
};
const TIMELINES: Record<string, string> = {
  asap: "As soon as possible",
  "1m": "Within 1 month",
  "1-3m": "1 – 3 months",
  flexible: "Flexible",
};

const MIN_FILL_MS = 3000; // bots submit instantly
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Submission {
  name: string;
  email: string;
  company: string;
  website: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  lang: string;
}

type Validation = { ok: true; data: Submission } | { ok: false; error: string };

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validate(body: Record<string, unknown>): Validation | "spam" {
  // Honeypot field, hidden from humans.
  if (str(body.fax, 200)) return "spam";
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) return "spam";

  const data: Submission = {
    name: str(body.name, 120),
    email: str(body.email, 200),
    company: str(body.company, 160),
    website: str(body.website, 300),
    projectType: str(body.projectType, 40),
    budget: str(body.budget, 40),
    timeline: str(body.timeline, 40),
    message: str(body.message, 5000),
    lang: body.lang === "fr" ? "fr" : "en",
  };

  if (data.name.length < 2) return { ok: false, error: "name" };
  if (!EMAIL_RE.test(data.email)) return { ok: false, error: "email" };
  if (data.message.length < 10) return { ok: false, error: "message" };
  if (!(data.projectType in PROJECT_TYPES)) return { ok: false, error: "projectType" };
  if (data.budget && !(data.budget in BUDGETS)) return { ok: false, error: "budget" };
  if (data.timeline && !(data.timeline in TIMELINES)) return { ok: false, error: "timeline" };
  if (data.website) {
    const url = /^https?:\/\//i.test(data.website) ? data.website : `https://${data.website}`;
    try {
      data.website = new URL(url).toString();
    } catch {
      return { ok: false, error: "website" };
    }
  }
  return { ok: true, data };
}

/** Notion rich_text items are limited to 2000 characters each. */
function richText(text: string) {
  const chunks = text.match(/[\s\S]{1,2000}/g) ?? [];
  return chunks.map((content) => ({ type: "text", text: { content } }));
}

function notionPage(env: Env, d: Submission) {
  const properties: Record<string, unknown> = {
    Name: { title: richText(d.name) },
    Email: { email: d.email },
    "Project type": { select: { name: PROJECT_TYPES[d.projectType] } },
    Message: { rich_text: richText(d.message) },
    Language: { select: { name: d.lang.toUpperCase() } },
    Status: { select: { name: "New" } },
  };
  if (d.company) properties.Company = { rich_text: richText(d.company) };
  if (d.website) properties.Website = { url: d.website };
  if (d.budget) properties.Budget = { select: { name: BUDGETS[d.budget] } };
  if (d.timeline) properties.Timeline = { select: { name: TIMELINES[d.timeline] } };

  return {
    parent: { database_id: env.NOTION_DATABASE_ID },
    properties,
    // Full message also in the page body, for comfortable reading in Notion.
    children: [{ object: "block", type: "paragraph", paragraph: { rich_text: richText(d.message) } }],
  };
}

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(status: number, body: unknown, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json(405, { ok: false, error: "method" }, cors);
    if (!cors["Access-Control-Allow-Origin"]) return json(403, { ok: false, error: "origin" }, cors);

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return json(400, { ok: false, error: "json" }, cors);
    }

    const result = validate(body);
    // Pretend success to bots so they don't retry.
    if (result === "spam") return json(200, { ok: true }, cors);
    if (!result.ok) return json(422, { ok: false, error: result.error }, cors);

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.NOTION_TOKEN}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notionPage(env, result.data)),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Notion error", res.status, detail);
      // Expose only Notion's short error code (e.g. "unauthorized", "object_not_found") for diagnosis.
      let code = "unknown";
      try {
        code = String((JSON.parse(detail) as { code?: string }).code ?? "unknown");
      } catch {
        /* non-JSON error body */
      }
      return json(502, { ok: false, error: "notion", notion: code }, cors);
    }
    return json(200, { ok: true }, cors);
  },
} satisfies ExportedHandler<Env>;
