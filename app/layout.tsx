import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { content } from "@/lib/content";
import CustomCursor from "@/components/layout/CustomCursor";
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

export const metadata: Metadata = {
  title: `${content.name} — ${content.role}`,
  description: content.bio,
  openGraph: {
    title: `${content.name} — ${content.role}`,
    description: content.bio,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} font-[family-name:var(--font-body)] bg-bg-primary text-text-primary antialiased`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
