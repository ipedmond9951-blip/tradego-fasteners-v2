import { type Locale } from '@/i18n'
import { navLabels, pick } from '@/lib/uiCopy'

interface BreadcrumbSchemaProps {
  locale: Locale
  /** 已本地化的页面名（调用方传入本语种名称） */
  pageName: string
  /** 相对路径，如 /industry 或 /industry/category/anchors，自动补尾斜杠 */
  pageUrl: string
  /** 可选的中间层级（如 行业指南 → 品类页） */
  parentName?: string
  parentUrl?: string
}

const SITE = 'https://www.tradego-fasteners.com'

export default function BreadcrumbSchema({ locale, pageName, pageUrl, parentName, parentUrl }: BreadcrumbSchemaProps) {
  const withParent = Boolean(parentName && parentUrl)
  const parentPath = parentUrl ? (parentUrl.endsWith('/') ? parentUrl : `${parentUrl}/`) : ''
  const path = pageUrl.endsWith('/') ? pageUrl : `${pageUrl}/`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: locale === 'zh' ? 'zh-CN' : locale,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: pick(navLabels.home, locale), item: `${SITE}/${locale}/` },
      ...(withParent
        ? [{ '@type': 'ListItem', position: 2, name: parentName!, item: `${SITE}/${locale}${parentPath}` }]
        : []),
      { '@type': 'ListItem', position: withParent ? 3 : 2, name: pageName, item: `${SITE}/${locale}${path}` },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
