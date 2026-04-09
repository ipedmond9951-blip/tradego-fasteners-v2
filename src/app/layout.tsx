import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TradeGo Fasteners | Leading Fastener Manufacturer',
    template: '%s | TradeGo Fasteners',
  },
  description: 'TradeGo Fasteners is a leading manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified, global delivery.',
  keywords: ['fastener manufacturer', 'drywall screws', 'self-drilling screws', 'bolts', 'nuts', 'IBR nails', 'wholesale fasteners'],
  authors: [{ name: 'TradeGo Engineering Team' }],
  creator: 'TradeGo Engineering Team',
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}