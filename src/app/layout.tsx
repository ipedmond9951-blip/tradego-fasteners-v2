import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'TradeGo Fasteners | Leading Fastener Manufacturer',
    template: '%s | TradeGo Fasteners',
  },
  description: 'TradeGo Fasteners is a leading manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified, global delivery.',
  keywords: ['fastener manufacturer', 'drywall screws', 'self-drilling screws', 'bolts', 'nuts', 'IBR nails', 'wholesale fasteners'],
  metadataBase: new URL('https://tradego-fasteners.vercel.app'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-touch.png" />
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
