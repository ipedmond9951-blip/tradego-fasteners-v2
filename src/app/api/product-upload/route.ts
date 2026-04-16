import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract all fields
    const productData = {
      nameEn: formData.get('nameEn'),
      nameZh: formData.get('nameZh'),
      category: formData.get('category'),
      descEn: formData.get('descEn'),
      descZh: formData.get('descZh'),
      specs: {
        size: formData.get('spec_size'),
        material: formData.get('spec_material'),
        standard: formData.get('spec_standard'),
        finish: formData.get('spec_finish'),
        grade: formData.get('spec_grade'),
        moq: formData.get('spec_moq'),
      },
      priceUsd: formData.get('priceUsd'),
      moq: formData.get('moq'),
      leadTime: formData.get('leadTime'),
      image: (formData.get('image') as File | null)?.name || null,
      images: formData.getAll('images').map(f => (f as File).name),
      submittedAt: new Date().toISOString(),
    }

    // In production: save to database / file system / Vercel Blob
    // For now, log and return success
    console.log('[Product Upload]', JSON.stringify(productData, null, 2))

    // TODO: Save to data/products.json or send email notification
    // TODO: Handle file upload to /public/images/products/

    return NextResponse.json({
      success: true,
      message: 'Product submitted successfully. Our team will review within 24 hours.',
      data: productData,
    })
  } catch (error) {
    console.error('[Product Upload Error]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit product' },
      { status: 500 }
    )
  }
}
