import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fitness Tracker",
  description: "AI Destekli Fitness Takip Uygulaması",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        {/* Sayfa içerikleri (page.tsx) buradaki children içine basılır */}
        {children}
      </body>
    </html>
  );
}