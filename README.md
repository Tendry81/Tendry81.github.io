# Rijaniaina Tendry — Portfolio

Personal portfolio built with **Next.js (App Router) + TypeScript**, statically exported and deployed to GitHub Pages at <https://tendry81.github.io/>.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint     # type-check
```

## Structure

| Path | Content |
| --- | --- |
| `app/(en)/`, `app/(fr)/fr/` | English page at `/`, French page at `/fr/` (each pre-rendered, own `lang`) |
| `lib/seo.ts` | Titles, descriptions, hreflang, Open Graph, JSON-LD (schema.org Person) |
| `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg` | Sitemap, robots.txt, favicon |
| `public/og.png` | 1200×630 social share image |
| `app/globals.css` | Design system (tokens, light/dark, sections) |
| `components/HomePage.tsx` | Page composition shared by both languages |
| `components/Sections.tsx` | Hero, About, Projects, Tools, Experience, Approach, Contact, Footer |
| `components/Nav.tsx` | Sticky nav, mobile menu, active-section highlight, EN/FR link |
| `components/Background.tsx` | Neural-network canvas and floating code symbols |
| `components/ExperienceCounter.tsx` | Live experience counter |
| `lib/content.ts` | Projects, skills, tools, links — edit here to update content |
| `lib/i18n.ts` | All EN/FR texts |

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `./out`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Contact form → Notion

The « Discuss your project » form posts to a Cloudflare Worker (`worker/`), which validates the request
(required fields, honeypot, minimum fill time, allowed origins) and creates a row in a Notion database.
The Notion token only lives in the Worker's secrets.

```
Site form ──POST JSON──▶ Cloudflare Worker (NOTION_TOKEN secret) ──▶ Notion « Portfolio leads »
```

One-time setup:

1. **Notion integration** — <https://www.notion.so/profile/integrations> → *New integration* (internal) → copy the token.
2. **Database** — create an empty Notion page, share it with the integration (••• → *Connections*), copy its ID, then:
   ```powershell
   cd worker; npm install
   $env:NOTION_TOKEN="<token>"; $env:NOTION_PARENT_PAGE_ID="<page id>"; npm run create-db
   ```
   It prints the new `NOTION_DATABASE_ID`.
3. **Worker** —
   ```powershell
   npx wrangler login
   npx wrangler secret put NOTION_TOKEN
   npx wrangler secret put NOTION_DATABASE_ID
   npm run deploy          # prints https://portfolio-contact.<account>.workers.dev
   ```
4. **Site** — set the Worker URL as a repository variable, then redeploy:
   ```powershell
   gh variable set CONTACT_ENDPOINT --body "https://portfolio-contact.<account>.workers.dev"
   gh workflow run "Deploy to GitHub Pages"
   ```

Without `CONTACT_ENDPOINT`, the site shows a short message pointing to LinkedIn instead of the form.
Local test: `cd worker; npx wrangler dev` (secrets in `worker/.dev.vars`, git-ignored).

## License

Source code: [MIT](LICENSE). Texts, photo and personal content remain © Rijaniaina Tendry, all rights reserved.
