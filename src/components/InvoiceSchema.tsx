'use client'

interface InvoiceSchemaProps {
  orderNumber: string
  orderDate: string
  customerName: string
  totalAmount: number
  currency?: string
  paymentStatus?: 'Paid' | 'Pending' | 'Unpaid'
  fulfillmentStatus?: 'Fulfilled' | 'Processing' | 'Unfulfilled'
  url?: string
}

export default function InvoiceSchema({
  orderNumber,
  orderDate,
  customerName,
  totalAmount,
  currency = 'USD',
  paymentStatus = 'Pending',
  fulfillmentStatus = 'Processing',
  url,
}: InvoiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Invoice',
    '@id': url ? `https://tradego-fasteners.com${url}#invoice` : undefined,
    invoiceNumber: orderNumber,
    dateIssued: orderDate,
    customer: {
      '@type': 'Person',
      name: customerName,
    },
    broker: {
      '@type': 'Organization',
      '@id': 'https://tradego-fasteners.com/#organization',
      name: 'TradeGo Fasteners',
    },
    totalAmountDue: {
      '@type': 'MonetaryAmount',
      amount: totalAmount.toFixed(2),
      currency: currency,
    },
    paymentStatus: `https://schema.org/${paymentStatus}`,
    fulfillmentStatus: `https://schema.org/${fulfillmentStatus}`,
    url: url ? `https://tradego-fasteners.com${url}` : undefined,
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}
