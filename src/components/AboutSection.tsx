import Image from 'next/image';
import { type Locale } from '@/i18n';

interface AboutSectionProps {
  locale: Locale;
  messages?: Record<string, unknown>;
}

const aboutText: Record<Locale, Record<string, string>> = {
  en: {
    title: 'Why Choose TradeGo Fasteners?',
    experience: '20+ Years Experience',
    experienceDesc: 'Manufacturing excellence since 2004',
    certification: 'ISO 9001:2015 Certified',
    certificationDesc: 'Certified quality management',
    global: '50+ Countries',
    globalDesc: 'Products exported worldwide',
    moq: 'Low MOQ',
    moqDesc: 'Flexible minimum orders',
  },
  zh: {
    title: '为什么选择TradeGo Fasteners？',
    experience: '20年经验',
    experienceDesc: '自2004年以来的制造卓越',
    certification: 'ISO 9001:2015认证',
    certificationDesc: '认证质量管理体系',
    global: '50+国家',
    globalDesc: '产品销往全球',
    moq: '低起订量',
    moqDesc: '灵活的最小订单',
  },
};

export default function AboutSection({ locale, messages }: AboutSectionProps) {
  const t = aboutText[locale] || aboutText.en;

  return (
    <section id="about-section" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            {t.title}
          </h2>
          
          {/* Scene images */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              <Image
                src="/images/scenarios/factory-environment.jpg"
                alt={locale === 'zh' ? '现代制造设施' : 'Modern manufacturing facility'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold">{locale === 'zh' ? '现代制造' : 'Modern Manufacturing'}</p>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              <Image
                src="/images/scenarios/quality-control.jpg"
                alt={locale === 'zh' ? '质量控制检测' : 'Quality control inspection'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold">{locale === 'zh' ? '质量控制' : 'Quality Control'}</p>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              <Image
                src="/images/scenarios/warehouse-management.jpg"
                alt={locale === 'zh' ? '仓库存储设施' : 'Warehouse storage facility'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold">{locale === 'zh' ? '全球仓库' : 'Global Warehouse'}</p>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.experience}</h3>
              <p className="text-gray-600">{t.experienceDesc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.certification}</h3>
              <p className="text-gray-600">{t.certificationDesc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03 3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.global}</h3>
              <p className="text-gray-600">{t.globalDesc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.moq}</h3>
              <p className="text-gray-600">{t.moqDesc}</p>
            </div>
          </div>
          
          {/* Expert profile */}
          <div className="bg-white rounded-lg shadow-lg p-8" itemScope itemType="https://schema.org/Organization">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-yellow-400">TG</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" itemProp="name">TradeGo Engineering Team</h3>
                <p className="text-gray-600 mb-3" itemProp="description">
                  {locale === 'zh' 
                    ? '专业紧固件专家，深耕建筑材料和工业应用领域'
                    : 'Expert fastener specialists with deep knowledge in construction materials and industrial applications'}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span itemProp="foundingDate">{locale === 'zh' ? '成立：2004年' : 'Founded: 2004'}</span>
                  <span>•</span>
                  <span>ISO 9001:2015 {locale === 'zh' ? '认证' : 'Certified'}</span>
                  <span>•</span>
                  <span itemProp="numberOfEmployees">150+ {locale === 'zh' ? '员工' : 'Employees'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
