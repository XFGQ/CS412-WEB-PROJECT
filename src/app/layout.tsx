import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitTrack Pro",
  description: "Kapsamlı Fitness Takip Uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased bg-slate-950 text-slate-50`}>
        {/* Sadece çocukları göster, header/footer YOK. 
            Onlar artık (dashboard) klasörünün içinde. */}
        {children}
      </body>
    </html>
  );
}