import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { content } from "@/lib/content";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import CommandPalette from "@/components/layout/CommandPalette";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const description = `${content.bioLead} ${content.bio}`;

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  // Needed for the og:image URL to resolve to an absolute path once deployed. Set
  // NEXT_PUBLIC_SITE_URL to the real domain when you deploy — falls back to localhost
  // for local dev. `||` (not `??`) deliberately: an env var present but set to an
  // empty string (e.g. a blank line in .env.local) must also fall back, not pass ""
  // straight to `new URL()`, which throws.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: `${content.name} — ${content.role}`,
  description,
  openGraph: {
    title: `${content.name} — ${content.role}`,
    description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} font-[family-name:var(--font-body)] bg-bg-primary text-text-primary antialiased`}
      >
        <ScrollProgress />
        <CustomCursor />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
