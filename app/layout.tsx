import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BewerbungRO — Aplică profesionist în Germania",
  description: "Creează în română un CV și o scrisoare de intenție profesionistă în germană.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="antialiased">{children}</body>
    </html>
  );
}
