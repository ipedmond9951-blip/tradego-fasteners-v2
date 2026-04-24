import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TradeGo Fasteners | Africa Fastener Distributor | SABS, ISO 9001 Certified',
  description: 'TradeGo Fasteners is a SABS & ISO 9001 certified fastener distributor specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails for African construction. Factory prices, sea freight to Durban, Lagos, Mombasa.',
  verification: {
    google: 'B8o4b_2zfT64y2bbOMBlBLBpyMsc01wKJKcB8HlUYTg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout is minimal — middleware redirects to /en or /zh
  // The [locale] layout handles the actual HTML rendering
  return children;
}
