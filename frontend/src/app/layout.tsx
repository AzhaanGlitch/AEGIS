import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "AEGIS - Autonomous Enterprise Growth Intelligence System",
  description:
    "AI-powered enterprise operating system combining 8 specialist AI agents, Hybrid RAG, Knowledge Graphs, and real-time BI into one unified platform.",
  icons: {
    icon: "/aegis_logo_without_bg.png",
    shortcut: "/aegis_logo_without_bg.png",
    apple: "/aegis_logo_without_bg.png",
  },
  openGraph: {
    title: "AEGIS - Autonomous Enterprise Growth Intelligence System",
    description: "8 specialist AI agents that understand your business.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body style={{ minHeight: "100vh", background: "#060608", color: "#f0f0f8" }}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
