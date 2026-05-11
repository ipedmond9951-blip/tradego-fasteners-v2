'use client'

import { type Locale } from '@/i18n'

interface Source {
  name: string
  nameZh: string
  url: string
  description: string
  descriptionZh: string
}

const sources: Source[] = [
  {
    name: 'ISO 9001:2015',
    nameZh: 'ISO 9001:2015质量管理体系',
    url: 'https://www.iso.org/standard/62085.html',
    description: 'International standard for quality management systems',
    descriptionZh: '国际质量管理体系标准',
  },
  {
    name: 'SABS (South African Bureau of Standards)',
    nameZh: '南非标准局 (SABS)',
    url: 'https://www.sabs.co.za/',
    description: 'South African national standards body',
    descriptionZh: '南非国家标准化机构',
  },
  {
    name: 'ASTM International',
    nameZh: '美国材料与试验协会',
    url: 'https://www.astm.org/',
    description: 'International standards organization for materials and products',
    descriptionZh: '材料和产品国际标准组织',
  },
  {
    name: 'DIN (German Institute for Standardization)',
    nameZh: '德国标准化协会',
    url: 'https://www.din.de/',
    description: 'German national standards body',
    descriptionZh: '德国国家标准化机构',
  },
]

interface SourcesSectionProps {
  locale?: Locale
}

export default function SourcesSection({ locale = 'en' }: SourcesSectionProps) {
  const isZh = locale === 'zh'
  
  return (
    <section className="py-12 md:py-16 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {isZh ? '参考资料与标准' : 'References & Standards'}
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            {isZh 
              ? '我们的产品质量符合以下国际和地区标准'
              : 'Our product quality complies with the following international and regional standards'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <svg className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-primary-600 transition-colors">
                    {isZh ? source.nameZh : source.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isZh ? source.descriptionZh : source.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{isZh ? '访问官网' : 'Visit Website'}</span>
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-500">
            {isZh 
              ? '所有统计数据基于内部业务记录和客户反馈调查 (2024)'
              : 'All statistics based on internal business records and customer feedback surveys (2024)'}
          </p>
        </div>
      </div>
    </section>
  )
}