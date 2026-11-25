import { type Locale, t } from '@/i18n'
import { getFaq } from '@/lib/faqI18n'

interface FAQSectionProps { locale?: Locale }

// 首页 FAQ 只有 18 组，完整问答（含规格、交期、海运细节）在独立 /faq 页，给 AI 一个可摘取的单一入口
const allFaqLabel: Record<string, string> = {
  en: 'See all fastener questions and answers →',
  zh: '查看全部紧固件问答 →',
  es: 'Ver todas las preguntas y respuestas →',
  fr: 'Voir toutes les questions et réponses →',
  ar: 'اطّلع على جميع الأسئلة والأجوبة →',
  pt: 'Ver todas as perguntas e respostas →',
  ru: 'Все вопросы и ответы →',
  ja: 'すべての質問と回答を見る →',
  de: 'Alle Fragen und Antworten ansehen →',
  hi: 'सभी प्रश्न और उत्तर देखें →',
}

export default function FAQSection({ locale = 'en' }: FAQSectionProps) {
  const title = t(locale, 'faq.title')
  const subtitle = t(locale, 'faq.subtitle')

  return (
    <section id="faq" className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">{title}</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm md:text-base">{subtitle}</p>
        
        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {getFaq(locale).map((faq, i) => (
            <details key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 group">
              <summary className="px-4 md:px-6 py-3 md:py-4 cursor-pointer font-semibold text-gray-800 hover:text-primary-600 flex justify-between items-center text-sm md:text-base">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2 flex-shrink-0">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-3 md:pb-4 text-gray-600 text-xs md:text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="text-center mt-6">
          <a href={`/${locale}/faq/`} className="text-sm md:text-base text-primary-700 hover:underline font-medium">
            {allFaqLabel[locale] || allFaqLabel.en}
          </a>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{t(locale, 'faq.contact')}</p>
          <a href={`/${locale}/#inquiry`} className="inline-flex items-center gap-2 bg-primary-700 text-white px-5 md:px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-800 transition-colors text-sm md:text-base">
            {t(locale, 'faq.contactCta')}
          </a>
        </div>
      </div>
    </section>
  )
}
