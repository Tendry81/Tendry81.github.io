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
| `app/layout.tsx` | Metadata (SEO, Open Graph), fonts via `next/font` |
| `app/page.tsx` | Page composition |
| `app/globals.css` | Design system (tokens, light/dark, sections) |
| `components/Sections.tsx` | Hero, About, Projects, Tools, Experience, Approach, Contact, Footer |
| `components/Nav.tsx` | Sticky nav, mobile menu, active-section highlight, FR/EN toggle |
| `components/LanguageProvider.tsx` | EN/FR context, persisted in `localStorage` |
| `components/Background.tsx` | Neural-network canvas and floating code symbols |
| `components/ExperienceCounter.tsx` | Live experience counter |
| `lib/content.ts` | Projects, skills, tools, links — edit here to update content |
| `lib/i18n.ts` | All EN/FR texts |

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `./out`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
