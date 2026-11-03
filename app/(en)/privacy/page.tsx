import type { Metadata } from "next";
import { PrivacyPage } from "@/components/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy & legal notice — Rijaniaina Tendry",
  alternates: { canonical: "/privacy/", languages: { fr: "/fr/confidentialite/" } },
};

export default function Page() {
  return <PrivacyPage lang="en" />;
}
