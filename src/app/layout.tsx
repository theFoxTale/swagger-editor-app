import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ReactNode } from 'react';

import { Footer, Header, ThemeProvider } from '@/components';

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
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <div className="rootLayout">
            <Header />
            <main className="main">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
