import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech O'clock",
  description: "Educating businesses on AI and emerging technologies.",
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