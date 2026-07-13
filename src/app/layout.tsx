import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Swagger/OpenAPI UI',
  description: 'OpenAPI editor and API testing interface',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen bg-transparent text-slate-100">
        <div className="flex min-h-screen flex-col">
          <Header />

          <main className="relative z-10 flex-1">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
