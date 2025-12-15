import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Thatcord',
  description: 'no one will be alone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark"> 
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
         
        <main className="flex min-h-screen items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
}