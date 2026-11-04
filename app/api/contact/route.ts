import { NextRequest, NextResponse } from "next/server";

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  website?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
  lang: "en" | "fr";
}

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 1200; // anti-bot threshold

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function richText(text: string) {
  const chunks = text.match(/[\s\S]{1,2000}/g) ?? [];
  return chunks.map((content) => ({ type: "text", text: { content } }));
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "json" }, { status: 400 });
  }

  // Honeypot field (hidden from humans)
  if (str(body.fax, 200)) {
    return NextResponse.json({ ok: true, spam: true });
  }

  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true, spam: true });
  }

  const data: ContactSubmission = {
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

  // Field validations
  if (data.name.length < 2) {
    return NextResponse.json({ ok: false, error: "name" }, { status: 422 });
  }
  if (!EMAIL_RE.test(data.email)) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 422 });
  }
  if (!data.projectType || !(data.projectType in PROJECT_TYPES)) {
    return NextResponse.json({ ok: false, error: "projectType" }, { status: 422 });
  }
  if (data.budget && !(data.budget in BUDGETS)) {
    return NextResponse.json({ ok: false, error: "budget" }, { status: 422 });
  }
  if (data.timeline && !(data.timeline in TIMELINES)) {
    return NextResponse.json({ ok: false, error: "timeline" }, { status: 422 });
  }
  if (data.message.length < 10) {
    return NextResponse.json({ ok: false, error: "message" }, { status: 422 });
  }
  if (data.website) {
    const url = /^https?:\/\//i.test(data.website) ? data.website : `https://${data.website}`;
    try {
      data.website = new URL(url).toString();
    } catch {
      return NextResponse.json({ ok: false, error: "website" }, { status: 422 });
    }
  }

  // Forward to Notion if credentials are provided in server environment
  const notionToken = process.env.NOTION_TOKEN;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (notionToken && notionDatabaseId) {
    try {
      const properties: Record<string, unknown> = {
        Name: { title: richText(data.name) },
        Email: { email: data.email },
        "Project type": { select: { name: PROJECT_TYPES[data.projectType] || data.projectType } },
        Message: { rich_text: richText(data.message) },
        Language: { select: { name: data.lang.toUpperCase() } },
        Status: { select: { name: "New" } },
      };
      if (data.company) properties.Company = { rich_text: richText(data.company) };
      if (data.website) properties.Website = { url: data.website };
      if (data.budget && BUDGETS[data.budget]) properties.Budget = { select: { name: BUDGETS[data.budget] } };
      if (data.timeline && TIMELINES[data.timeline]) properties.Timeline = { select: { name: TIMELINES[data.timeline] } };

      const res = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notionToken}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent: { database_id: notionDatabaseId },
          properties,
          children: [{ object: "block", type: "paragraph", paragraph: { rich_text: richText(data.message) } }],
        }),
      });

      if (!res.ok) {
        console.error("Notion API call returned status:", res.status);
        return NextResponse.json({ ok: false, error: "notion" }, { status: 502 });
      }
    } catch (err) {
      console.error("Failed to forward lead to Notion:", err);
      return NextResponse.json({ ok: false, error: "notion" }, { status: 502 });
    }
  } else {
    // Nothing is stored without Notion: don't tell the visitor it was sent.
    console.error("Contact form: NOTION_TOKEN / NOTION_DATABASE_ID not configured");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    name: data.name,
  });
}
