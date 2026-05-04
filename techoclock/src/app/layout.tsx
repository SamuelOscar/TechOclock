import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech O'clock — AI & Tech News for African Businesses",
  description: "Educating businesses and professionals on AI and emerging technologies. Africa-focused, globally relevant. Daily updates on AI tools, startups, funding and more.",
  keywords: ["AI news Africa", "tech news Rwanda", "African AI startups", "emerging technology Africa", "AI tools for business"],
  openGraph: {
    title: "Tech O'clock",
    description: "AI & Tech news for African businesses and professionals.",
    url: "https://tech-oclock.vercel.app",
    siteName: "Tech O'clock",
    images: [{ url: "https://tech-oclock.vercel.app/logo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech O'clock",
    description: "AI & Tech news for African businesses and professionals.",
    images: ["https://tech-oclock.vercel.app/logo.png"],
    creator: "@TechOclockOff",
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}