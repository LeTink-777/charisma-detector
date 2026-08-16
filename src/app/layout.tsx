import type { Metadata, Viewport } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/content';

const display = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Детектор харизмы — узнай свой тип притяжения бесплатно',
  description:
    'Пройди тест из 10 вопросов и узнай свой тип харизмы. Магнит, Провокатор, Загадка, Лидер или Муза — и как его активировать.',
  keywords: [
    'тип харизмы',
    'детектор харизмы',
    'тест на харизму',
    'типы притяжения',
    'харизма тест онлайн',
    'как развить харизму',
    'притяжение психология тест',
    'тип обаяния',
  ],
  authors: [{ name: 'Евдокимов Даниил Владимирович' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: SITE.name,
    title: 'Детектор харизмы — твой тип притяжения',
    description: '10 вопросов. Магнит, Провокатор, Загадка, Лидер или Муза.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Детектор харизмы — твой тип притяжения',
    description: '10 вопросов. Магнит, Провокатор, Загадка, Лидер или Муза.',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-32x32.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08050F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
