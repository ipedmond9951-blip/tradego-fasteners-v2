import type { Metadata } from 'next'
import { locales, type Locale, t } from '@/i18n'
import SearchResults from '@/components/SearchResults'

const SITE_URL = 'https://www.tradego-fasteners.com'

interface SearchPageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// 搜索结果页是过滤型薄页面，不进索引：index:false, follow:true。
// canonical 指向自身（不继承 layout 的首页 canonical），避免被当成首页重复内容。
export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  return {
    title: t(locale, 'search.title'),
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${SITE_URL}/${locale}/search/`,
    },
  }
}

// 静态壳：页面不读 searchParams（否则整条路由退化为 on-demand SSR）。
// q 由客户端组件在浏览器端从 window.location.search 读取。
export default async function SearchPage({ params }: SearchPageProps) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  return <SearchResults locale={locale} />
}
