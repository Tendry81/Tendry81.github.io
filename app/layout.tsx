import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

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

const SITE_URL = "https://tendry81.github.io/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rijaniaina Tendry — Full-Stack Developer",
  description:
    "Portfolio of Rijaniaina Tendry — Full-Stack Developer building reliable software, backend platforms and AI-enabled engineering workflows.",
  authors: [{ name: "Rijaniaina Tendry" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Rijaniaina Tendry — Full-Stack Developer",
    description:
      "Full-Stack Developer based in Antananarivo. Platforms, backend systems, distributed workflows and AI-assisted engineering.",
    images: ["/assets/profile.webp"],
    locale: "en_US",
    alternateLocale: ["fr_FR"],
  },
  twitter: {
    card: "summary",
    title: "Rijaniaina Tendry — Full-Stack Developer",
    description: "Full-Stack Developer · platforms, backends, AI-assisted engineering.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2433",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
