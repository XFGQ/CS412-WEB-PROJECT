import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitTrack Pro",
  description: "Fitness Tracking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-950 text-slate-50`}>
        {/* NO HEADER/FOOTER SHOULD BE HERE */}
        {children}
      </body>
    </html>
  );
}