// 非英语首页的本语种内容块（2026-11-24 新增）
// 原首页有一大段硬编码英文技术长文（约 1000 词），在 /es /ar /ja 等页面造成整段英文泄漏。
// 英文站保留原文；其余语种改用“同主题文章卡片”，标题与摘要直接取该语种已本地化的文章数据，
// 保证首页语言纯净、同时保留内链与信息深度。
import Link from 'next/link'
import { getArticleBySlug } from '@/lib/articles'

const copy: Record<string, { appsTitle: string; appsIntro: string; guideTitle: string; guideIntro: string; more: string }> = {
  en: { appsTitle: 'Fastener Applications & Industries', appsIntro: '', guideTitle: 'Complete Fastener Technical Guide', guideIntro: '', more: 'Read the guide' },
  zh: { appsTitle: '紧固件应用与行业', appsIntro: '非洲建筑与工业项目的常用紧固件选型入口：按应用场景与标准要求进入对应指南。', guideTitle: '紧固件技术指南', guideIntro: '标准对比、锚固选型、螺纹等级与不锈钢选材，全部为本语种正文。', more: '阅读全文' },
  es: { appsTitle: 'Aplicaciones y sectores', appsIntro: 'Accesos rápidos a las guías de fijaciones para obra e industria en África, ordenadas por escenario de uso y norma aplicable.', guideTitle: 'Guías técnicas de fijaciones', guideIntro: 'Comparación de normas, selección de anclajes, grados de tornillo y acero inoxidable, con contenido íntegro en español.', more: 'Leer la guía' },
  fr: { appsTitle: 'Applications et secteurs', appsIntro: 'Accès direct aux guides de fixations pour le bâtiment et l’industrie en Afrique, classés par usage et par norme applicable.', guideTitle: 'Guides techniques de fixations', guideIntro: 'Comparaison des normes, choix des ancrages, classes de vis et acier inoxydable, entièrement rédigés en français.', more: 'Lire le guide' },
  pt: { appsTitle: 'Aplicações e setores', appsIntro: 'Acesso rápido aos guias de fixações para construção e indústria em África, organizados por aplicação e norma aplicável.', guideTitle: 'Guias técnicos de fixações', guideIntro: 'Comparação de normas, seleção de chumbadores, classes de parafuso e aço inoxidável, com conteúdo integral em português.', more: 'Ler o guia' },
  ar: { appsTitle: 'التطبيقات والقطاعات', appsIntro: 'روابط سريعة إلى أدلة المثبتات لمشاريع البناء والصناعة في أفريقيا، مرتبة حسب الاستخدام والمعيار المعمول به.', guideTitle: 'الأدلة التقنية للمثبتات', guideIntro: 'مقارنة المعايير، واختيار المراسي، ودرجات البراغي، والفولاذ المقاوم للصدأ، بمحتوى كامل بالعربية.', more: 'اقرأ الدليل' },
  ru: { appsTitle: 'Применение и отрасли', appsIntro: 'Быстрый переход к руководствам по крепежу для строительства и промышленности в Африке — по области применения и действующему стандарту.', guideTitle: 'Технические руководства по крепежу', guideIntro: 'Сравнение стандартов, выбор анкеров, классы прочности болтов и нержавеющая сталь — полные тексты на русском.', more: 'Читать руководство' },
  ja: { appsTitle: '用途と業界', appsIntro: 'アフリカの建設・産業プロジェクト向け締結具ガイドへの入口。用途と適用規格から該当ガイドへ移動できます。', guideTitle: '締結具の技術ガイド', guideIntro: '規格比較、アンカー選定、ボルトの強度区分、ステンレス選材を日本語の全文で解説しています。', more: 'ガイドを読む' },
  de: { appsTitle: 'Anwendungen und Branchen', appsIntro: 'Direkter Zugang zu Befestigungs-Ratgebern für Bau und Industrie in Afrika – geordnet nach Anwendung und geltender Norm.', guideTitle: 'Technische Ratgeber zur Befestigung', guideIntro: 'Normenvergleich, Ankerauswahl, Festigkeitsklassen und Edelstahl – vollständige Texte auf Deutsch.', more: 'Ratgeber lesen' },
  hi: { appsTitle: 'अनुप्रयोग और उद्योग', appsIntro: 'अफ़्रीका के निर्माण और औद्योगिक परियोजनाओं के लिए फास्टनर गाइड तक सीधी पहुँच, उपयोग और लागू मानक के अनुसार।', guideTitle: 'फास्टनर तकनीकी गाइड', guideIntro: 'मानक तुलना, एंकर चयन, बोल्ट ग्रेड और स्टेनलेस स्टील — पूरा पाठ हिंदी में।', more: 'गाइड पढ़ें' },
}

const appSlugs = [
  'timber-construction-fasteners-africa',
  'ibr-roofing-nails-installation-guide',
  'high-tensile-structural-bolts-guide',
]

const guideSlugs = [
  'construction-fastener-standards-comparison',
  'anchor-bolts-selection-guide',
  'bolt-grade-markings-guide',
  'stainless-steel-bolts-africa-guide',
]

function card(slug: string, locale: string, more: string) {
  const a = getArticleBySlug(slug)
  if (!a) return null
  const title = (a.title as Record<string, string>)[locale] || a.title.en
  const desc = ((a.description as Record<string, string>)[locale] || a.description?.en || '').slice(0, 120)
  return (
    <Link
      key={slug}
      href={`/${locale}/industry/${slug}/`}
      prefetch={false}
      className="block bg-white border rounded-xl p-5 hover:border-primary-500 hover:shadow-md transition-all"
    >
      <h3 className="font-semibold text-primary-900 mb-2 leading-snug">{title}</h3>
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{desc}…</p>
      <span className="text-sm text-primary-600">{more} →</span>
    </Link>
  )
}

export default function HomeLocalizedGuides({ locale }: { locale: string }) {
  const c = copy[locale] || copy.en
  return (
    <>
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{c.appsTitle}</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 text-sm md:text-base">{c.appsIntro}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {appSlugs.map(s => card(s, locale, c.more))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{c.guideTitle}</h2>
          <p className="text-gray-600 text-center mb-10 text-sm md:text-base">{c.guideIntro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guideSlugs.map(s => card(s, locale, c.more))}
          </div>
        </div>
      </section>
    </>
  )
}
