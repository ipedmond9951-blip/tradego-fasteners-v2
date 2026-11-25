import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TradeGo Fasteners | Fastener Manufacturer & Exporter for Africa',
  description: 'Fastener manufacturer & exporter working to SABS 1195 / DIN / ISO dimensions: drywall screws, self-drilling screws, bolts, nuts, IBR nails. Mill-level prices, sea freight to Africa.',
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
