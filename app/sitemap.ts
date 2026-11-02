import type { MetadataRoute } from "next";
import { LANG_PATH, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: SITE_URL + LANG_PATH.en, fr: SITE_URL + LANG_PATH.fr };
  return (["en", "fr"] as const).map((lang) => ({
    url: SITE_URL + LANG_PATH[lang],
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: lang === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
