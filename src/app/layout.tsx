import type { Metadata } from 'next';
import { ReactNode } from 'react';

import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';

import { Footer, Header } from '@/components';

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
  description: 'Редактор и просмотрщик OpenAPI спецификаций',
  icons: {
    icon: '/logo-dark.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="rootLayout">
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
