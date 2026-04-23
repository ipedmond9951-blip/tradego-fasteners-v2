import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TradeGo Fasteners | Leading Fastener Manufacturer',
  description: 'TradeGo Fasteners is a leading manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails.',
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
