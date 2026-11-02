import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { Viewport } from "next";
import type { Language } from "@/lib/i18n";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6e9de" },
    { media: "(prefers-color-scheme: dark)", color: "#071018" },
  ],
  colorScheme: "light dark",
};

/** Shared <html>/<body> for each language's root layout. */
export function RootDocument({ lang, children }: { lang: Language; children: React.ReactNode }) {
  return (
    <html
      lang={lang}
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
