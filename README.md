# TradeGo Fasteners V2 - GEO Optimized Website

🚀 **Next.js 14 website with complete GEO (Generative Engine Optimization) implementation**

![TradeGo Fasteners](https://tradego-fasteners.vercel.app/og-image.jpg)

## 🎯 Features

### GEO Optimization (AI Search Ready)
- ✅ **FAQPage Schema** - Complete FAQ section with structured data
- ✅ **Product Schema** - All products with rich metadata
- ✅ **Organization Schema** - Full company information
- ✅ **Author Credentials** - E-A-T signals for credibility
- ✅ **Semantic HTML** - AI-friendly content structure

### Technical Features
- ⚡ **Next.js 14** - App Router with React Server Components
- 🎨 **Tailwind CSS** - Modern styling with utility classes
- 📱 **Responsive Design** - Mobile-first approach
- 🔍 **SEO Optimized** - Complete meta tags and Open Graph
- 🗺️ **Sitemap & Robots.txt** - Search engine friendly
- 💾 **ISR Ready** - Incremental Static Regeneration support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ipedmond9951-blip/tradego-fasteners-v2.git

# Navigate to project directory
cd tradego-fasteners-v2

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📊 GEO Implementation Details

### Schema.org Structured Data

This website implements comprehensive Schema.org markup:

1. **Organization Schema**
   - Company name, logo, contact information
   - Address and geographic location
   - Social media profiles

2. **FAQPage Schema**
   - 8 frequently asked questions
   - Complete question-answer pairs
   - AI search engine ready

3. **Product Schema**
   - Product descriptions and specifications
   - Material and size information
   - Price ranges and availability

4. **WebPage Schema**
   - Breadcrumb navigation
   - Publication and modification dates
   - Language and content information

### AI Search Engine Optimization

Optimized for:
- ✅ **Perplexity AI** - Structured content, clear answers
- ✅ **ChatGPT** - Conversational format, semantic richness
- ✅ **Google AI Overviews** - Featured snippets ready
- ✅ **Claude AI** - Clear, factual information

## 🏗️ Project Structure

```
tradego-fasteners-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO metadata
│   │   ├── page.tsx            # Homepage with Schema injection
│   │   └── globals.css         # Global styles
│   └── components/
│       ├── HeroSection.tsx     # Hero banner component
│       ├── AboutSection.tsx    # About section with E-A-T
│       ├── ProductGrid.tsx     # Products with Product Schema
│       └── FAQSection.tsx      # FAQ with FAQPage Schema
├── public/
│   ├── robots.txt              # Search engine directives
│   └── sitemap.xml             # Site structure map
└── package.json                # Dependencies
```

## 🎨 Customization

### Adding New Products

Edit `src/components/ProductGrid.tsx`:

```typescript
const products = [
  {
    id: 'your-product-id',
    name: 'Product Name',
    description: 'Product description...',
    material: 'Material type',
    coating: 'Coating types',
    sizeRange: 'Size specifications',
    applications: ['Application 1', 'Application 2'],
    image: '/products/image.jpg',
    priceRange: '$X.XX - $Y.YY per kg'
  },
  // Add more products...
];
```

### Adding FAQ Items

Edit `src/components/FAQSection.tsx`:

```typescript
const faqData = [
  {
    question: "Your question here?",
    answer: "Your detailed answer here..."
  },
  // Add more FAQ items...
];
```

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Core Web Vitals**: All green
- **Page Load**: < 2 seconds
- **Mobile Friendly**: ✅

## 🔧 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📝 Content Strategy

For best GEO results:

1. **Update FAQ regularly** - Add new questions based on customer inquiries
2. **Publish blog content** - Create articles about fastener applications
3. **Add product images** - Include high-quality product photos
4. **Update content dates** - Keep `dateModified` current
5. **Monitor AI mentions** - Track brand visibility in AI search

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by [GEO best practices](https://github.com/KrillinAI/GEO)

---

**Created by TradeGo Engineering Team**  
**Last Updated: 2026-04-09**  
**Version: 2.0.0**