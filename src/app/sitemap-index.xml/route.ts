import { permanentRedirect } from 'next/navigation'

export function GET() {
  permanentRedirect('https://www.tradego-fasteners.com/sitemap.xml')
}
