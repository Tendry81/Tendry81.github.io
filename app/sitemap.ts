import type { MetadataRoute } from "next";
import { LANG_PATH, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: SITE_URL + LANG_PATH.en, fr: SITE_URL + LANG_PATH.fr };
  const home: MetadataRoute.Sitemap = (["en", "fr"] as const).map((lang) => ({
    url: SITE_URL + LANG_PATH[lang],
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: lang === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
  const privacy = { en: SITE_URL + "/privacy/", fr: SITE_URL + "/fr/confidentialite/" };
  const legal: MetadataRoute.Sitemap = (["en", "fr"] as const).map((lang) => ({
    url: privacy[lang],
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.2,
    alternates: { languages: privacy },
  }));
  return [...home, ...legal];
}
