import { RootDocument } from "@/components/RootDocument";
import { buildMetadata } from "@/lib/seo";

export { viewport } from "@/components/RootDocument";
export const metadata = buildMetadata("en");

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
