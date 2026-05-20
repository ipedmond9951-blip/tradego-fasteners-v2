#!/usr/bin/env python3
"""Update 5 articles with new unique images and FAQ sections."""

import json
import os

BASE = "content/articles"

def load_article(slug):
    path = f"{BASE}/{slug}.json"
    with open(path) as f:
        return json.load(f), path

def save_article(data, path):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def add_faq_section(data, faq_items, heading="Frequently Asked Questions"):
    """Add FAQ section to article sections if not already present."""
    has_faq = any(s.get('faqItems') for s in data.get('sections', []))
    if has_faq:
        print(f"  FAQ section already exists, skipping")
        return data
    
    faq_section = {
        "id": "faq",
        "heading": {"en": heading},
        "faqItems": faq_items
    }
    data['sections'].append(faq_section)
    print(f"  Added FAQ section with {len(faq_items)} items")
    return data

# Article updates
updates = {
    "agrifastener-water-infrastructure": {
        "new_image": "/images/articles/agrifastener-water-infrastructure.jpg",
        "new_alt": "Water Infrastructure Fasteners for African Irrigation Projects - TradeGo",
        "add_faq": False,  # Already has FAQ
    },
    "fastener-negotiation-supplier-china": {
        "new_image": "/images/articles/fastener-negotiation-supplier-china.jpg",
        "new_alt": "Fastener Supplier Negotiation Guide China Trade Expert Tips - TradeGo",
        "add_faq": True,
        "faq_items": [
            {
                "q": {"en": "What is the best payment term for first-time fastener orders from China?"},
                "a": {"en": "For first-time orders, use T/T 30% deposit + 70% against copy of BL (Bill of Lading). This protects the buyer — you only pay the balance when the goods are shipped and you receive proof. Avoid 100% T/T in advance for orders over $5,000. For established suppliers with a track record, you can negotiate T/T 30 days after B/L date."}
            },
            {
                "q": {"en": "How much discount can I expect when ordering fasteners in full containers?"},
                "a": {"en": "Full container orders (20ft) typically get 15-25% lower pricing compared to less-than-container-load (LCL) orders. The discount increases with volume commitment — ordering 2-4 containers per order can achieve 20-30% savings. Annual volume commitments (100+ containers/year) can reach 25-40% discount from Chinese factories."}
            },
            {
                "q": {"en": "What quality certifications should I request from Chinese fastener suppliers?"},
                "a": {"en": "Request: (1) Certificate of Origin (COO) for tariff verification; (2) Mill Test Reports (MTR) / Material Certificates showing steel grade and chemical composition; (3) ISO 9001:2015 certificate of the factory; (4) SGS or similar third-party inspection report for quality verification; (5) For specific standards (DIN, ISO, ASTM), request compliance documentation."}
            }
        ]
    },
    "zimbabwe-fastener-market-case-study": {
        "new_image": "/images/articles/zimbabwe-fastener-market-case-study.jpg",
        "new_alt": "Zimbabwe Fastener Market Case Study Bindura Nickel Mining Project - TradeGo",
        "add_faq": True,
        "faq_items": [
            {
                "q": {"en": "What is the typical lead time for fasteners to Zimbabwe?"},
                "a": {"en": "From China to Zimbabwe via Beira port (Mozambique): 25-35 days sea freight. Durban (South Africa): 30-40 days. Air freight is available for urgent orders (5-7 days) but costs 5-8x more. For construction projects, order 60-90 days before needed date to account for production (15-25 days) and shipping."}
            },
            {
                "q": {"en": "What import duties apply to fasteners entering Zimbabwe?"},
                "a": {"en": "Fasteners typically fall under HS Code 7318 (Screws, bolts, nuts, coach screws, etc.). Import duty is approximately 40% + 15% VAT on CIF value. Surcharges may apply. Zimbabwe also requires a Valid Import Declaration Number (IDN) from the Zimbabwe Revenue Authority (ZIMRA). Working with an experienced customs broker is essential."}
            },
            {
                "q": {"en": "Which Zimbabwe industries have the highest demand for fasteners?"},
                "a": {"en": "Mining is the largest fastener consumer in Zimbabwe, particularly platinum, gold, and nickel mining operations. Construction (commercial and residential), agriculture (irrigation systems), and water infrastructure projects also drive significant demand. The energy sector (Hwange thermal power station upgrades) and telecommunications tower expansion are emerging growth areas."}
            }
        ]
    },
    "bulk-fastener-ordering-strategies": {
        "new_image": "/images/articles/bulk-fastener-ordering-strategies.jpg",
        "new_alt": "Bulk Fastener Ordering Cost Reduction Strategies Africa - TradeGo",
        "add_faq": True,
        "faq_items": [
            {
                "q": {"en": "What is the minimum order quantity for bulk fastener pricing?"},
                "a": {"en": "Most Chinese factories have MOQs of 1,000-5,000 pieces per SKU for best pricing. A 20ft container typically holds 15-25 tons of mixed fasteners. For significant discounts (15-25%), target full container orders. For Africa distribution, ordering 2-4 containers quarterly with a mix of best-sellers and seasonal items optimizes both cost and cash flow."}
            },
            {
                "q": {"en": "How should I optimize container loading for mixed fastener shipments?"},
                "a": {"en": "Optimize container fill by mixing products: heavy items (bolts, anchors) on bottom, lighter items (screws, nuts in cartons) on top. Use wooden pallets for easy loading. Typically achieve 85-95% container utilization with proper planning. Calculate CBM (cubic meters) per SKU to maximize value per container."}
            },
            {
                "q": {"en": "What packaging is recommended for Africa-bound fastener shipments?"},
                "a": {"en": "Use sea-worthy packaging: moisture-resistant kraft paper interior lining, double-wall corrugated cartons, wooden pallets (ISPM 15 certified heat-treated). For coastal African ports (high humidity), add silica gel desiccants. Label cartons with SKU, quantity, country of origin. For retail packaging, polybags with header cards protect fasteners during inland transport."}
            }
        ]
    },
    "payment-terms-international-fastener-trade": {
        "new_image": "/images/articles/payment-terms-international-fastener-trade.jpg",
        "new_alt": "Payment Terms International Fastener Trade Letter of Credit - TradeGo",
        "add_faq": False,  # Check if FAQ exists
    }
}

for slug, update in updates.items():
    print(f"\nUpdating: {slug}")
    try:
        data, path = load_article(slug)
    except FileNotFoundError:
        print(f"  File not found: {path}")
        continue
    
    # Check if FAQ exists
    has_faq = any(s.get('faqItems') for s in data.get('sections', []))
    
    # Update image
    old_image = data.get('image', '')
    data['image'] = update['new_image']
    print(f"  Image: {old_image} -> {update['new_image']}")
    
    # Update alt text
    if 'new_alt' in update:
        data['imageAlt'] = update['new_alt']
        print(f"  Alt: {update['new_alt']}")
    
    # Update date
    from datetime import date
    data['updated'] = str(date.today())
    print(f"  Updated date to: {data['updated']}")
    
    # Add FAQ if needed
    if update.get('add_faq') and not has_faq:
        data = add_faq_section(data, update['faq_items'])
    elif has_faq:
        print(f"  FAQ already exists, skipping")
    
    save_article(data, path)
    print(f"  Saved: {path}")

print("\n✅ All 5 articles updated!")
