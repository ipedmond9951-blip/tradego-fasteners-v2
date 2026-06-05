import { redirect } from 'next/navigation'

// Root path: redirect to /en. Fastest path: rely on next.config.ts redirects() at edge.
// (server-side redirect below is fallback if config rule is not matched)
export default function RootPage() {
  redirect('/en')
}
