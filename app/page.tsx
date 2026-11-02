import { Background } from "@/components/Background";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Nav } from "@/components/Nav";
import { RevealObserver } from "@/components/Reveal";
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
} from "@/components/Sections";

export default function Home() {
  return (
    <LanguageProvider>
      <a className="skip-link" href="#top">
        Skip to content
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
