'use client';

import { useState } from 'react';
import { type Locale } from '@/i18n';
import { useGeo } from '@/contexts/GeoContext';

interface InquiryFormProps {
  locale?: Locale;
  productId?: string;
}

const labels: Record<Locale, Record<string, string>> = {
  en: {
    title: 'Request a Quote',
    name: 'Your Name',
    email: 'Email Address',
    company: 'Company Name',
    phone: 'Phone / WhatsApp',
    products: 'Products Interested',
    quantity: 'Estimated Quantity',
    message: 'Additional Requirements',
    submit: 'Submit Inquiry',
    submitting: 'Submitting...',
    success: 'Thank you! We\'ll contact you within 24 hours.',
    error: 'Something went wrong. Please try again or email us directly.',
    whatsapp: 'Chat on WhatsApp',
  },
  zh: {
    title: '获取报价',
    name: '您的姓名',
    email: '电子邮箱',
    company: '公司名称',
    phone: '电话 / WhatsApp',
    products: '感兴趣的产品',
    quantity: '预计数量',
    message: '其他需求',
    submit: '提交询价',
    submitting: '提交中...',
    success: '感谢您的询价！我们将在24小时内联系您。',
    error: '提交失败，请重试或直接联系我们。',
    whatsapp: 'WhatsApp咨询',
  },
};

export default function InquiryForm({ locale = 'en', productId }: InquiryFormProps) {
  const { country } = useGeo();
  const t = labels[locale] || labels.en;
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    products: productId || '',
    quantity: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, country, locale }),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', company: '', phone: '', products: '', quantity: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      locale === 'zh' 
        ? `您好，我对贵司的紧固件产品感兴趣。\n产品：${form.products}\n数量：${form.quantity}`
        : `Hi, I'm interested in your fastener products.\nProducts: ${form.products}\nQuantity: ${form.quantity}`
    );
    window.open(`https://wa.me/8615963409951?text=${text}`, '_blank');
  };

  return (
    <section id="inquiry" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">{t.title}</h2>
          
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 font-medium">{t.success}</p>
              <p className="text-green-600 text-sm mt-2">aimingtrade@hotmail.com</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.name} *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email} *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.company}</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.products} *</label>
                  <input
                    type="text"
                    name="products"
                    value={form.products}
                    onChange={handleChange}
                    required
                    placeholder={locale === 'zh' ? '例如：干壁钉、螺栓' : 'e.g., Drywall Screws, Bolts'}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.quantity}</label>
                  <input
                    type="text"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder={locale === 'zh' ? '例如：1000公斤' : 'e.g., 1000kg'}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.message}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm">{t.error}</p>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex-1 bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors"
                >
                  {status === 'submitting' ? t.submitting : t.submit}
                </button>
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t.whatsapp}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
