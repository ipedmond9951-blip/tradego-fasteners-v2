'use client'

interface HowToSchemaProps {
  locale?: string
  title: string
  steps: Array<{ name: string; text: string }>
  description?: string
}

export default function HowToSchema({ locale = 'en', title, steps, description }: HowToSchemaProps) {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: description || `Learn how to ${title.toLowerCase()} with our step-by-step guide.`,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    totalTime: `PT${steps.length * 5}M`, // Estimate 5 min per step
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
    />
  )
}
