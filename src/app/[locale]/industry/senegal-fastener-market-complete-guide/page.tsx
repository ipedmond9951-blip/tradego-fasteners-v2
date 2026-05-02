import { redirect } from 'next/navigation'

// Redirect old article slug to new canonical URL
export default async function OldSlugRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect(`/${locale}/industry/senegal-fastener-market`)
}

// No metadata - this page always redirects
export function generateMetadata() {
  return { robots: { index: false } }
}
