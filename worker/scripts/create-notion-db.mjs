// Creates the « Portfolio leads » database expected by the Worker.
//
// Usage (PowerShell):
//   $env:NOTION_TOKEN="secret_..."; $env:NOTION_PARENT_PAGE_ID="<page id>"; npm run create-db
//
// The parent page must be shared with your Notion integration (••• → Connections).
// Prints the new database ID to store with `npx wrangler secret put NOTION_DATABASE_ID`.

const token = process.env.NOTION_TOKEN;
const parent = process.env.NOTION_PARENT_PAGE_ID;
if (!token || !parent) {
  console.error("Set NOTION_TOKEN and NOTION_PARENT_PAGE_ID first.");
  process.exit(1);
}

const select = (names, color = "default") => ({
  select: { options: names.map((name) => ({ name, color })) },
});

const body = {
  parent: { type: "page_id", page_id: parent.replace(/-/g, "") },
  title: [{ type: "text", text: { content: "Portfolio leads" } }],
  is_inline: false,
  properties: {
    Name: { title: {} },
    Email: { email: {} },
    Company: { rich_text: {} },
    Website: { url: {} },
    "Project type": select([
      "Web application",
      "Backend / API",
      "Automation & workflows",
      "AI integration",
      "Freelance mission",
      "Full-time / remote role",
      "Other",
    ], "blue"),
    Budget: select(["< 1 000 €", "1 000 – 5 000 €", "5 000 – 15 000 €", "> 15 000 €", "To be defined"], "green"),
    Timeline: select(["As soon as possible", "Within 1 month", "1 – 3 months", "Flexible"], "orange"),
    Message: { rich_text: {} },
    Language: select(["EN", "FR"], "gray"),
    Status: {
      select: {
        options: [
          { name: "New", color: "red" },
          { name: "Contacted", color: "yellow" },
          { name: "In discussion", color: "blue" },
          { name: "Won", color: "green" },
          { name: "Closed", color: "gray" },
        ],
      },
    },
    Received: { created_time: {} },
  },
};

const res = await fetch("https://api.notion.com/v1/databases", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
const data = await res.json();
if (!res.ok) {
  console.error("Notion error:", res.status, data.message ?? data);
  process.exit(1);
}
console.log("Database created:", data.url);
console.log("NOTION_DATABASE_ID =", data.id);
