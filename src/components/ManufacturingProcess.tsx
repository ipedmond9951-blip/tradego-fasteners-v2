'use client'

import { useState } from 'react'

interface ManufacturingProcessProps {
  locale: string
}

const translations: Record<string, {
  title: string
  subtitle: string
  processes: {
    title: string
    description: string
    icon: string
  }[]
  cta: string
}> = {
  en: {
    title: 'Our Manufacturing Process',
    subtitle: 'From raw material to finished fastener - precision at every stage',
    processes: [
      {
        title: 'Cold Forging',
        description: 'Precision cold heading creates the perfect screw head shape with minimal material waste. Our 12-station automatic cold headers produce up to 200 pieces per minute with dimensional tolerances within ±0.01mm.',
        icon: '🔨'
      },
      {
        title: 'Thread Rolling',
        description: 'High-precision thread rolling machines form threads without cutting, preserving grain structure for stronger, more durable threads. Compatible with DIN, ANSI, and custom specifications.',
        icon: '⚙️'
      },
      {
        title: 'Heat Treatment',
        description: 'Computer-controlled hardening and tempering lines ensure consistent hardness (HRC 32-45) and strength. We meet ISO 898 and ASTM specifications for various grades.',
        icon: '🔥'
      },
      {
        title: 'Surface Treatment',
        description: 'Multiple coating options: zinc plating (5-15μm), hot-dip galvanizing (45-85μm), Dacromet, and more. Our 8 surface treatment lines provide corrosion resistance from 72 to 1000+ hours in salt spray tests.',
        icon: '🎨'
      },
      {
        title: 'Quality Inspection',
        description: 'Every batch undergoes rigorous testing: dimensional verification, torque testing, hardness testing, and salt spray tests. ISO 9001:2015 certified lab with SGS, BV inspection capabilities.',
        icon: '🔬'
      },
      {
        title: 'Packaging & Shipping',
        description: 'Custom packaging available: bulk bags, color boxes, or palletized shipments. We specialize in sea freight to African ports including Durban (25-30 days), Lagos (30-35 days), and Mombasa (28-32 days), plus global air freight and express delivery.',
        icon: '📦'
      }
    ],
    cta: 'Request Factory Tour'
  },
  zh: {
    title: '我们的制造工艺',
    subtitle: '从原材料到成品紧固件 - 每一步都精益求精',
    processes: [
      {
        title: '冷镦成型',
        description: '精密冷镦技术打造完美螺丝头形状，材料浪费最小化。12工位自动冷镦机每分钟可生产200件产品，尺寸公差控制在±0.01mm以内。',
        icon: '🔨'
      },
      {
        title: '滚牙加工',
        description: '高精度滚牙机无需切割即可形成螺纹，保持晶粒结构，螺纹更坚固耐用。兼容DIN、ANSI及定制规格。',
        icon: '⚙️'
      },
      {
        title: '热处理',
        description: '电脑控制的淬火和回火生产线确保一致的硬度（HRC 32-45）和强度。我们符合ISO 898和ASTM各等级规格要求。',
        icon: '🔥'
      },
      {
        title: '表面处理',
        description: '多种涂层选择：镀锌（5-15μm）、热镀锌（45-85μm）、达克罗等。8条表面处理生产线提供72至1000+小时盐雾测试防腐能力。',
        icon: '🎨'
      },
      {
        title: '质量检测',
        description: '每批产品均经过严格测试：尺寸检验、扭矩测试、硬度测试和盐雾测试。ISO 9001:2015认证实验室，具备SGS、BV检测能力。',
        icon: '🔬'
      },
      {
        title: '包装运输',
        description: '可定制包装：吨袋、彩盒或托盘装运。我们专注海运至非洲港口，包括德班（25-30天）、拉各斯（30-35天）、蒙巴萨（28-32天），另提供全球空运和快递服务。',
        icon: '📦'
      }
    ],
    cta: '预约工厂参观'
  }
}

const otherLocales: Record<string, typeof translations.en> = {
  es: { title: 'Nuestro Proceso de Fabricación', subtitle: 'De materia prima a sujetador terminado - precisión en cada etapa', processes: translations.en.processes, cta: translations.en.cta },
  fr: { title: 'Notre Processus de Fabrication', subtitle: 'De la matière première au fixateur fini - précision à chaque étape', processes: translations.en.processes, cta: 'Demander une visite' },
  ar: { title: 'عملية التصنيع الخاصة بنا', subtitle: 'من المادة الخام إلى المثبت النهائي - الدقة في كل مرحلة', processes: translations.en.processes, cta: 'طلب جولة المصنع' },
  pt: { title: 'Nosso Processo de Fabricação', subtitle: 'Da matéria-prima ao fixador acabado - precisão em cada etapa', processes: translations.en.processes, cta: 'Solicitar Visita' },
  ru: { title: 'Наш Производственный Процесс', subtitle: 'От сырья до готового крепежа - точность на каждом этапе', processes: translations.en.processes, cta: 'Запросить экскурсию' },
  ja: { title: '私たちの製造プロセス', subtitle: '原材料から完成品まで - すべての段階で精密さを追求', processes: translations.en.processes, cta: '工場見学会 запросать' },
  de: { title: 'Unser Fertigungsprozess', subtitle: 'Vom Rohmaterial zum fertigen Befestiger - Präzision in jeder Phase', processes: translations.en.processes, cta: 'Werksbesichtigung anfragen' },
  hi: { title: 'हमारी विनिर्माण प्रक्रिया', subtitle: 'कच्चे माल से तैयार फास्टनर तक - हर चरण में सटीकता', processes: translations.en.processes, cta: 'फैक्ट्री टूर का अनुरोध करें' },
}

export default function ManufacturingProcess({ locale }: ManufacturingProcessProps) {
  const [activeTab, setActiveTab] = useState(0)
  
  const content = translations[locale] || otherLocales[locale] || translations.en

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600">
            {content.subtitle}
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {content.processes.map((process, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{process.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {process.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {process.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button 
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            onClick={() => {
              const form = document.getElementById('inquiry-form')
              if (form) form.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {content.cta}
          </button>
        </div>
      </div>
    </section>
  )
}
