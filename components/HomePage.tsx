import type { Language } from "@/lib/i18n";
import { jsonLd } from "@/lib/seo";
import { Background } from "./Background";
import { LanguageProvider } from "./LanguageProvider";
import { Nav } from "./Nav";
import { RevealObserver } from "./Reveal";
import {
  About,
  Approach,
  Contact,
  Experience,
  Footer,
  Hero,
  Metrics,
  Projects,
  Tools,
} from "./Sections";

export function HomePage({ lang }: { lang: Language }) {
  return (
    <LanguageProvider lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }}
      />
      <a className="skip-link" href="#top">
        {lang === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <div id="app">
        <Background />
        <Nav />
        <main id="top">
          <Hero />
          <Metrics />
          <About />
          <Projects />
          <Tools />
          <Experience />
          <Approach />
          <Contact />
        </main>
        <Footer />
      </div>
      <RevealObserver />
    </LanguageProvider>
  );
}
