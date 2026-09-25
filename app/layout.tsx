import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { content } from "@/lib/content";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
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
        {children}
      </body>
    </html>
  );
}
