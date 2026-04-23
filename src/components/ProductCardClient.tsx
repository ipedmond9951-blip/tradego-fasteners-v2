'use client'

import Image from 'next/image'
import { type Locale, t } from '@/i18n'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ButtonLink } from './Button'
import { Badge } from './Badge'

interface ProductCardClientProps {
  product: {
    slug: string
    image: string
    pricePerPiece: number
    nameKey: string
    specs: {
      size: string
      standard: string
      material: string
      finish: string
    }
    features: string[]
    applications: string[]
  }
  locale: Locale
  name: string
}

export default function ProductCardClient({ product, locale, name }: ProductCardClientProps) {
  const { formatPrice } = useCurrency()

  const specLabels: Record<string, Record<string, string>> = {
    en: { size: 'Size', standard: 'Standard', material: 'Material', finish: 'Finish' },
    zh: { size: '规格', standard: '标准', material: '材质', finish: '表面处理' },
    es: { size: 'Tamaño', standard: 'Estándar', material: 'Material', finish: 'Acabado' },
    ar: { size: 'الحجم', standard: 'المعيار', material: 'المادة', finish: 'المعالجة' },
    fr: { size: 'Taille', standard: 'Standard', material: 'Matériau', finish: 'Finition' },
    pt: { size: 'Tamanho', standard: 'Padrão', material: 'Material', finish: 'Acabamento' },
    ru: { size: 'Размер', standard: 'Стандарт', material: 'Материал', finish: 'Покрытие' },
    ja: { size: 'サイズ', standard: '規格', material: '材質', finish: '表面処理' },
    de: { size: 'Größe', standard: 'Standard', material: 'Material', finish: 'Oberfläche' },
    hi: { size: 'आकार', standard: 'मानक', material: 'सामग्री', finish: 'परिशोधन' },
  }

  const labels = specLabels[locale] || specLabels.en

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group flex flex-col">
      {/* Image */}
      <div className="relative h-44 md:h-52 bg-gray-100 overflow-hidden">
        <Image 
          src={product.image} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" 
        />
        {/* Price Badge */}
        <Badge 
          variant="premium" 
          className="absolute top-3 right-3"
        >
          ${product.pricePerPiece.toFixed(3)}/pc
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-primary-900 text-lg mb-2">{name}</h3>
        
        {/* Specs table */}
        <div className="space-y-1.5 text-sm mb-4 mt-auto">
          {Object.entries(product.specs).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-500 capitalize">{labels[key] || key}:</span>
              <span className="font-medium text-right ml-2 truncate">{val}</span>
            </div>
          ))}
        </div>
        
        {/* Features tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.features.map((f) => (
            <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f}</span>
          ))}
        </div>
        
        {/* Applications */}
        <div className="mb-4">
          <span className="text-xs text-gray-500 block mb-1.5">Applications:</span>
          <div className="flex flex-wrap gap-1.5">
            {product.applications.map((app) => (
              <span key={app} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-medium">{app}</span>
            ))}
          </div>
        </div>

        {/* Inquiry Button - Using new Button component */}
        <ButtonLink 
          href={`/${locale}#inquiry`}
          variant="primary"
          size="sm"
          className="w-full mt-auto"
        >
          {t(locale, 'products.inquiry')}
        </ButtonLink>
      </div>
    </div>
  )
}
