import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TradeGo Fasteners | ISO 9001 Africa Distributor',
  description: 'SABS + ISO 9001 fastener distributor: drywall screws, self-drilling screws, bolts, nuts, IBR nails. Factory prices, sea freight to Africa.',
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
