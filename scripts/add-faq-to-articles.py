#!/usr/bin/env python3
"""Add FAQ sections to articles and update products."""

import json
from datetime import datetime

# FAQ sections to add to articles
FAQ_SECTIONS = {
    "bolt-tightening-torque-guide": {
        "en": """**What torque should I use for M10 bolt Grade 8.8?**
For M10 Grade 8.8 hex bolts, the recommended torque is 50-60 Nm (37-44 ft-lb). For Grade 10.9, use 70-80 Nm (52-59 ft-lb). Always refer to your specific application requirements.

**What is the difference between preload and torque?**
Torque is the rotational force applied to tighten a bolt. Preload (clamp force) is the tension created in the bolt when tightened. The goal is to achieve correct preload; torque is just the method to reach it.

**Can torque specification bolts be reused after loosening?**
Generally no. Once a bolt has been torqued beyond its yield point and then loosened, it may have been permanently stretched. Replace with new bolts for critical structural applications.

**What is the nut factor (K) in torque calculation?**
The nut factor K accounts for friction in the torque-tension relationship. K = 0.2 is commonly used for plain (unlubricated) bolts. For lubricated bolts, K may be 0.15-0.18. Always check with your specific coating/lubrication condition.

**How do I know if a bolt is properly tightened?**
Use a calibrated torque wrench set to the correct specification. For critical joints, use direct tension indicators (washers with raised bumps) or ultrasonic bolt stretch measurement.

**What is the typical preload requirement for bolted joints?**
For standard applications, target 60-75% of the bolt's proof load as preload. This provides reliable clamping while keeping bolt stress within safe limits."""
    },
    "timber-fasteners-guide": {
        "en": """**What is the difference between coach screws and wood screws?**
Coach screws (lag screws) have a hex head for wrench tightening and are heavy-duty for wood-to-wood connections. Wood screws have slotted or Phillips heads and are lighter duty, designed for assembling wood components.

**What size coach screw do I need for deck joists?**
For deck joist connections, M8 × 80mm or M10 × 100mm coach screws are typically used. The screw should penetrate at least 2.5x the thickness of the second board. Check local building codes for specific requirements.

**Can coach screws be used in pressure-treated timber?**
Yes, hot-dip galvanized (HDG) coach screws are recommended for ACQ (alkaline copper quaternary) pressure-treated timber. Standard zinc-plated screws may corrode. Always check the coating compatibility with your treatment type.

**Do I need to pre-drill pilot holes for coach screws?**
Yes, especially for hardwoods. Pre-drill a pilot hole equal to the screw's root (core) diameter. This prevents splitting and ensures proper thread engagement. For softwoods, you may skip pre-drilling for smaller sizes.

**How far should coach screws penetrate into the second timber?**
For proper holding power, coach screws should penetrate at least 2.5x the screw diameter into the receiving timber. For an M10 screw, that means at least 25mm penetration into the second board.

**Are HDG coach screws suitable for coastal/marine environments?**
HDG provides good corrosion resistance for general outdoor use. For coastal areas with salt spray, use stainless steel 304/316 coach screws for maximum corrosion resistance."""
    },
    "concrete-anchors-selection-guide": {
        "en": """**Which anchor type is best for solid concrete?**
Wedge anchors provide the highest load capacity for solid concrete and are ideal for structural connections. Sleeve anchors offer good general-purpose performance. Both require solid, uncracked concrete for optimal performance.

**What's the difference between wedge anchors and sleeve anchors?**
Wedge anchors feature a full-length expansion mechanism against the concrete borehole wall, delivering maximum load capacity. Sleeve anchors expand at multiple points along the sleeve, making them suitable for solid concrete, hollow masonry, and grout-filled block.

**What is the minimum spacing between concrete anchors?**
Maintain 10x the anchor diameter from edges (e.g., 120mm for M12 anchors) and 12x the diameter between anchors. From cracks, maintain minimum 6x diameter spacing. Proper spacing ensures full load capacity without interference.

**Can concrete anchors be removed and reused?**
Wedge anchors are permanent and cannot be removed. Sleeve anchors can be removed by unscrewing. Strike anchors offer temporary installation. Choose anchor type based on whether permanent or temporary installation is needed.

**What coating should I use for outdoor concrete anchors?**
For exterior applications, use hot-dip galvanized (HDG) or stainless steel 304/316 anchors to prevent corrosion. Zinc-plated anchors are suitable for dry interior applications only.

**How deep should I drill the anchor hole?**
Drill the hole to the anchor's minimum embedment depth plus an additional 1/4 inch (6mm) to accommodate dust and debris. For a 3-inch wedge anchor, drill at least 3-1/4 inches deep. Always blow and brush the hole clean before installation."""
    },
    "buy-construction-fasteners-wholesale-china": {
        "en": """**What is the minimum order quantity (MOQ) for bulk fastener orders from China?**
Typical MOQ ranges from 100-500 kg per size, with total order of 1-5 tons for mixed product orders. Some manufacturers accept smaller MOQ for standard sizes with price premiums. Custom specifications typically require higher MOQ.

**How do I verify fastener quality from Chinese suppliers?**
Request EN 10204 3.1 Mill Test Certificates showing chemical composition and mechanical properties. Order samples before bulk. Use third-party inspection agencies like SGS, Bureau Veritas, or Intertek for container inspection.

**What is the typical lead time for fastener orders from China?**
Production takes 15-30 days depending on order size and complexity. Sea freight to African ports adds 20-35 days depending on destination. Total lead time: 5-10 weeks from order confirmation to port arrival.

**What does FOB price include?**
FOB (Free on Board) price includes the product cost and packaging. It excludes freight charges, insurance, and handling from the port. CIF price includes cost, insurance, and freight to your destination port.

**What payment terms are standard for China fastener orders?**
Common terms: 30% deposit, 70% balance against copy of Bill of Lading (TT). For established relationships, some suppliers offer open account or letter of credit (L/C) terms. New customers typically pay 100% upfront or 30/70.

**How do I calculate the total landed cost to Africa?**
Landed cost = FOB price + sea freight + insurance + port handling + customs duties + import taxes + inland transportation. Use a 1.3-1.5x multiplier on FOB price as a rough estimate for total landed cost to African ports."""
    },
    "fastener-export-china-to-africa-guide": {
        "en": """**What are the major shipping routes from China to Africa?**
Key routes: Shanghai/Ningbo → Durban (20-25 days), → Lagos/Nigeria (28-35 days), → Mombasa/Kenya (18-22 days), → Dar es Salaam/Tanzania (20-25 days), → Djibouti/Ethiopia (18-22 days sea + 2-3 days overland).

**What is the shipping cost per container to Africa?**
20ft container: $1,500-$3,000. 40ft container: $2,500-$5,000. Rates vary by season, fuel surcharges, and destination port. Durban and Mombasa routes are typically more affordable than West African ports.

**How long does sea freight take from China to African ports?**
Transit times: Durban 20-25 days, Lagos 28-35 days (port congestion may add 7-14 days), Mombasa 18-22 days, Dar es Salaam 20-25 days, Djibouti 18-22 days to port.

**What documentation is required for importing fasteners into Africa?**
Required: Commercial Invoice, Packing List, Bill of Lading (B/L), Certificate of Origin (Form E for preferential tariffs), Mill Test Certificates (EN 10204 3.1), Fumigation Certificate (if wood packaging), Import Declaration, SONCAP (Nigeria) or SABS CoC (South Africa).

**How do I calculate landed cost for African imports?**
Landed cost = FOB + Freight + Insurance + Port handling ($200-500/container) + Customs duties (varies by country, typically 10-25% for steel products) + Import VAT (varies) + Inland transport to your location. Budget 1.4-1.8x FOB cost for full landed cost.

**Which African ports receive direct shipping from China?**
Durban (South Africa) - serves South Africa, Zimbabwe, Botswana, Namibia; Lagos/Apapa (Nigeria) - serves Nigeria and West Africa; Mombasa (Kenya) - serves Kenya, Uganda, Rwanda, Burundi; Dar es Salaam (Tanzania) - serves Tanzania, Zambia, Malawi, DRC; Djibouti - serves Ethiopia and Horn of Africa."""
    }
}

# Update the date for all modified articles
def add_faq_to_article(slug):
    filepath = f"/Users/zhangming/workspace/tradego-fasteners-v2/content/articles/{slug}.json"
    try:
        with open(filepath, 'r') as f:
            article = json.load(f)
    except FileNotFoundError:
        print(f"NOT FOUND: {slug}")
        return False
    
    # Check if FAQ section already exists
    sections = article.get('sections', [])
    has_faq = any('faq' in s.get('id', '').lower() or 'question' in s.get('id', '').lower() for s in sections)
    if has_faq:
        print(f"SKIP (has FAQ): {slug}")
        return False
    
    # Add FAQ section
    faq_body = FAQ_SECTIONS.get(slug, {}).get('en', '')
    if not faq_body:
        print(f"NO FAQ CONTENT: {slug}")
        return False
    
    faq_section = {
        "id": "faq",
        "heading": {
            "en": "Frequently Asked Questions",
            "zh": "常见问题",
            "es": "Preguntas Frecuentes",
            "ar": "الأسئلة الشائعة",
            "fr": "Questions Fréquemment Posées",
            "pt": "Perguntas Frequentes",
            "ru": "Часто задаваемые вопросы",
            "ja": "よくある質問",
            "de": "Häufig Gestellte Fragen",
            "hi": "अक्सर पूछे जाने वाले प्रश्न"
        },
        "body": {
            "en": faq_body,
            "zh": f"[FAQ content for {slug} in Chinese]",
            "es": f"[FAQ content for {slug} in Spanish]",
            "ar": f"[FAQ content for {slug} in Arabic]",
            "fr": f"[FAQ content for {slug} in French]",
            "pt": f"[FAQ content for {slug} in Portuguese]",
            "ru": f"[FAQ content for {slug} in Russian]",
            "ja": f"[FAQ content for {slug} in Japanese]",
            "de": f"[FAQ content for {slug} in German]",
            "hi": f"[FAQ content for {slug} in Hindi]"
        }
    }
    
    article['sections'].append(faq_section)
    article['date'] = datetime.now().strftime('%Y-%m-%d')
    
    with open(filepath, 'w') as f:
        json.dump(article, f, indent=2, ensure_ascii=False)
    
    print(f"ADDED FAQ: {slug}")
    return True

# Run for all articles
articles = [
    "bolt-tightening-torque-guide",
    "timber-fasteners-guide", 
    "concrete-anchors-selection-guide",
    "buy-construction-fasteners-wholesale-china",
    "fastener-export-china-to-africa-guide"
]

updated = 0
for slug in articles:
    if add_faq_to_article(slug):
        updated += 1

print(f"\nUpdated {updated} articles with FAQ sections")
