import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { content } from "@/lib/content";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import AmbientBackground from "@/components/layout/AmbientBackground";
import CursorSpotlight from "@/components/layout/CursorSpotlight";
import CommandPalette from "@/components/layout/CommandPalette";
import Preloader from "@/components/layout/Preloader";
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

export const metadata: Metadata = {
  // Needed for the og:image URL to resolve to an absolute path once deployed. Set
  // NEXT_PUBLIC_SITE_URL to the real domain when you deploy — falls back to localhost
  // for local dev.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
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
        <AmbientBackground />
        <CursorSpotlight />
        <ScrollProgress />
        <CustomCursor />
        <CommandPalette />
        <Preloader />
        {children}
      </body>
    </html>
  );
}
