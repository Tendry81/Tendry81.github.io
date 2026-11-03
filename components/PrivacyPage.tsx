import type { Language } from "@/lib/i18n";
import { LanguageProvider } from "./LanguageProvider";
import { Footer } from "./Sections";

const CONTENT = {
  en: {
    home: "← Back to the portfolio",
    homeHref: "/",
    title: "Privacy & legal notice",
    sections: [
      {
        h: "Publisher",
        p: "This personal portfolio is published by Rijaniaina Tendry, Antananarivo, Madagascar. Contact: via the LinkedIn profile linked on the site.",
      },
      {
        h: "Contact form",
        p: "If you use the « Discuss your project » form, the data you enter (name, email, company, website, project type, budget, timeline and message) is sent to a private Notion workspace. It is used only to answer your request, never sold or shared, and kept no longer than needed for that purpose. You can ask me to access or delete it at any time.",
      },
      {
        h: "Cookies & analytics",
        p: "This site does not set cookies and does not use advertising or tracking tools. Fonts are loaded from Google Fonts at build time.",
      },
      {
        h: "Content & trademarks",
        p: "The source code of this site is released under the MIT License (see the GitHub repository). Unless stated otherwise, its texts, photo and personal content are © Rijaniaina Tendry, all rights reserved. Product and technology names (Kubernetes, GitLab, Jira, Claude Code, etc.) belong to their respective owners and are mentioned only to describe tools I use; no affiliation or endorsement is implied. Work done for employers or clients is not published on this site.",
      },
    ],
  },
  fr: {
    home: "← Retour au portfolio",
    homeHref: "/fr/",
    title: "Confidentialité & mentions légales",
    sections: [
      {
        h: "Éditeur",
        p: "Ce portfolio personnel est publié par Rijaniaina Tendry, Antananarivo, Madagascar. Contact : via le profil LinkedIn indiqué sur le site.",
      },
      {
        h: "Formulaire de contact",
        p: "Si vous utilisez le formulaire « Discuter de votre projet », les données saisies (nom, email, entreprise, site web, type de projet, budget, délai et message) sont transmises à un espace Notion privé. Elles servent uniquement à répondre à votre demande, ne sont ni vendues ni partagées, et ne sont pas conservées plus longtemps que nécessaire. Vous pouvez demander à tout moment leur accès ou leur suppression.",
      },
      {
        h: "Cookies & mesure d’audience",
        p: "Ce site ne dépose aucun cookie et n’utilise ni publicité ni outil de suivi. Les polices sont chargées depuis Google Fonts lors de la construction du site.",
      },
      {
        h: "Contenu & marques",
        p: "Le code source de ce site est publié sous licence MIT (voir le dépôt GitHub). Sauf mention contraire, ses textes, sa photo et ses contenus personnels sont © Rijaniaina Tendry, tous droits réservés. Les noms de produits et technologies (Kubernetes, GitLab, Jira, Claude Code, etc.) appartiennent à leurs propriétaires et ne sont cités que pour décrire les outils que j’utilise ; aucune affiliation ni approbation n’est sous-entendue. Les travaux réalisés pour un employeur ou un client ne sont pas publiés sur ce site.",
      },
    ],
  },
} as const;

export function PrivacyPage({ lang }: { lang: Language }) {
  const c = CONTENT[lang];
  return (
    <LanguageProvider lang={lang}>
      <main className="container section" id="top">
        <p>
          <a href={c.homeHref}>{c.home}</a>
        </p>
        <h1>{c.title}</h1>
        {c.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
      </main>
      <Footer />
    </LanguageProvider>
  );
}
