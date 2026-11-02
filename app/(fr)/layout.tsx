import { RootDocument } from "@/components/RootDocument";
import { buildMetadata } from "@/lib/seo";

export { viewport } from "@/components/RootDocument";
export const metadata = buildMetadata("fr");

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="fr">{children}</RootDocument>;
}
