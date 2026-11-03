import type { Metadata } from "next";
import { PrivacyPage } from "@/components/PrivacyPage";

export const metadata: Metadata = {
  title: "Confidentialité & mentions légales — Rijaniaina Tendry",
  alternates: { canonical: "/fr/confidentialite/", languages: { en: "/privacy/" } },
};

export default function Page() {
  return <PrivacyPage lang="fr" />;
}
