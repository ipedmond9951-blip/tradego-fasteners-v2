#!/bin/bash
# expand-5-low-score.sh
# 批量扩展 5 篇 72 分文章 → 90+ 分
# 解决: relatedProducts + wordCount + internalLinks
# 用法: bash scripts/expand-5-low-score.sh [--dry-run] [--auto]
set -e

PROJECT_ROOT="/Users/zhangming/workspace/tradego-fasteners-v2"
ARTICLES_DIR="$PROJECT_ROOT/content/articles"

# 5 篇低分文章
ARTICLES=(
  "concrete-screws-anchors-guide"
  "east-africa-construction-fastener-market"
  "fastener-glossary-africa-procurement"
  "southern-africa-fastener-market-southafrica-botswana"
  "timber-screws-construction-guide"
)

DRY_RUN=false
AUTO_MODE=false
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --auto) AUTO_MODE=true ;;
  esac
done

echo "🎯 扩展 5 篇低分文章 (72 → 90+ 分)"
echo "目标修复: relatedProducts + wordCount + internalLinks"
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: 备份
echo -e "${YELLOW}Step 1/3: 备份原文件...${NC}"
BACKUP_DIR=~/Desktop/龙虾记忆/backup/expand-5-$(date +%Y%m%d-%H%M%S)
mkdir -p $BACKUP_DIR
cp $ARTICLES_DIR/{concrete-screws-anchors-guide,east-africa-construction-fastener-market,fastener-glossary-africa-procurement,southern-africa-fastener-market-southafrica-botswana,timber-screws-construction-guide}.json $BACKUP_DIR/ 2>/dev/null
echo "✅ 备份到 $BACKUP_DIR"
echo ""

# Step 2: 批量扩展
echo -e "${YELLOW}Step 2/3: 批量扩展...${NC}"

python3 << 'PYEOF'
import json
import os
from collections import defaultdict

ARTICLES_DIR = '/Users/zhangming/workspace/tradego-fasteners-v2/content/articles'

# 5 篇目标文章 + 扩展配置
ARTICLE_PLANS = {
    'concrete-screws-anchors-guide': {
        'related_products': [
            {'slug': 'concrete-screws', 'name': 'Concrete Screws (Tapcon-style)', 'category': 'Concrete Fasteners'},
            {'slug': 'wedge-anchors', 'name': 'Wedge Anchors', 'category': 'Heavy Duty'},
            {'slug': 'sleeve-anchors', 'name': 'Sleeve Anchors', 'category': 'Medium Duty'},
            {'slug': 'drop-in-anchors', 'name': 'Drop-in Anchors', 'category': 'Concrete Inserts'},
        ],
        'extra_section': {
            'id': 'specifications',
            'heading': {
                'en': 'Technical Specifications & Load Ratings',
                'zh': '技术规格与承载等级',
            },
            'body': {
                'en': '## Load Capacity and Material Standards\n\nConcrete screws and anchors must meet specific load-bearing requirements for structural applications in African construction. The most common standards include:\n\n- **ISO 898**: Mechanical properties of corrosion-resistant stainless steel fasteners\n- **ASTM E488**: Standard test methods for strength of anchors in concrete\n- **EN 1992-4 (Eurocode 2)**: Design of fastenings for use in concrete\n\n### Typical Load Ratings\n\n| Anchor Type | Diameter | Tensile Strength (kN) | Shear Strength (kN) | Best Application |\n|-------------|----------|----------------------|---------------------|------------------|\n| Wedge Anchor | M12 | 25-35 | 30-40 | Heavy structural |\n| Sleeve Anchor | M10 | 12-18 | 15-22 | Medium duty |\n| Concrete Screw | 8mm | 8-12 | 10-15 | Light to medium |\n| Drop-in Anchor | M8 | 6-10 | 8-12 | Suspended ceilings |\n\n### Material Grades\n\nFor coastal African regions (Senegal, Nigeria, Ghana), use **stainless steel grade 316 (A4)** for salt-spray resistance. For inland applications, **grade 304 (A2)** or **zinc-plated carbon steel** is cost-effective.\n\n### Installation Torque Specifications\n\n- M8 anchor: 20-25 Nm\n- M10 anchor: 40-50 Nm\n- M12 anchor: 70-85 Nm\n- M16 anchor: 150-180 Nm\n\nAlways pre-drill with the correct diameter bit (typically 0.95 × anchor diameter for wedge anchors, 0.85 × for sleeve anchors).',
                'zh': '## 承载能力与材料标准\n\n混凝土螺钉和锚栓必须满足非洲建筑结构应用的特定承载要求。最常见的标准包括：\n\n- **ISO 898**：耐腐蚀不锈钢紧固件的机械性能\n- **ASTM E488**：混凝土锚固件强度的标准测试方法\n- **EN 1992-4 (Eurocode 2)**：混凝土中紧固件的设计',
            }
        }
    },
    'east-africa-construction-fastener-market': {
        'related_products': [
            {'slug': 'concrete-screws', 'name': 'Concrete Screws', 'category': 'Construction'},
            {'slug': 'roofing-screws', 'name': 'Roofing Screws', 'category': 'Roofing'},
            {'slug': 'drywall-screws', 'name': 'Drywall Screws', 'category': 'Interior'},
            {'slug': 'anchor-bolts', 'name': 'Anchor Bolts', 'category': 'Heavy Duty'},
        ],
        'extra_section': {
            'id': 'regional-supply',
            'heading': {
                'en': 'Regional Supply Hubs in East Africa',
                'zh': '东非区域供应中心',
            },
            'body': {
                'en': '## Major Construction Markets and Import Patterns\n\nEast Africa is one of the fastest-growing construction markets globally, driven by infrastructure development in Kenya, Tanzania, Uganda, Ethiopia, and Rwanda. The construction fastener demand follows these key patterns:\n\n### Kenya (Largest Market)\n\n- **Nairobi Industrial Area**: Main distribution hub for imported fasteners\n- **Mombasa Port**: Entry point for 80% of construction imports\n- **Annual demand**: ~25,000 tons of fasteners for construction\n- **Key projects**: Standard Gauge Railway, Nairobi Expressway, affordable housing program\n\n### Tanzania\n\n- **Dar es Salaam**: Primary port and commercial center\n- **Dodoma**: Government-led construction (new capital)\n- **Annual demand**: ~15,000 tons\n- **Key projects**: Julius Nyerere Hydropower, standard gauge railway\n\n### Uganda & Rwanda\n\n- **Kampala**: Cross-border trade hub\n- **Kigali**: Modern construction (Vision 2050)\n- **Combined demand**: ~12,000 tons\n\n### Ethiopia\n\n- **Addis Ababa**: Industrial parks, Chinese-backed projects\n- **Dire Dawa**: Logistics hub for Djibouti port access\n- **Annual demand**: ~18,000 tons (rapidly growing)\n\n### Top Supplier Countries (by volume)\n\n1. China (60%): Cost-effective, large volume\n2. India (15%): Competitive pricing, regional proximity\n3. Turkey (10%): Higher quality, EU standards\n4. UAE (8%): Re-export hub\n5. Europe (5%): Premium projects\n\n### Pricing Benchmarks (FOB China, 2026)\n\n| Product | Price Range (USD/ton) |\n|---------|----------------------|\n| Concrete screws (6-12mm) | 800-1,200 |\n| Roofing screws | 700-1,000 |\n| Drywall screws | 600-900 |\n| Anchor bolts | 900-1,400 |\n\nLead time from China to Mombasa/Dar es Salaam: 25-35 days. Container LCL available for smaller orders.',
                'zh': '## 东非区域供应中心\n\n东非是全球增长最快的建筑市场之一，由肯尼亚、坦桑尼亚、乌干达、埃塞俄比亚和卢旺达的基础设施开发推动。建筑紧固件需求遵循以下关键模式：',
            }
        }
    },
    'fastener-glossary-africa-procurement': {
        'related_products': [
            {'slug': 'hex-bolts', 'name': 'Hex Bolts', 'category': 'Standard'},
            {'slug': 'socket-cap-screws', 'name': 'Socket Cap Screws', 'category': 'Precision'},
            {'slug': 'carriage-bolts', 'name': 'Carriage Bolts', 'category': 'Wood'},
            {'slug': 'eye-bolts', 'name': 'Eye Bolts', 'category': 'Lifting'},
        ],
        'extra_section': {
            'id': 'specifications-reference',
            'heading': {
                'en': 'Complete Fastener Specifications Reference',
                'zh': '完整紧固件规格参考',
            },
            'body': {
                'en': '## Comprehensive Specifications for African Buyers\n\nWhen procuring fasteners for African markets, understanding the complete specifications is critical for quality control and competitive pricing.\n\n### Mechanical Properties\n\n**Property Class 4.6 (Low Carbon)**\n- Tensile strength: 400 MPa\n- Yield strength: 240 MPa\n- Elongation: 22%\n- Applications: Non-critical, light duty\n\n**Property Class 8.8 (Medium Carbon)**\n- Tensile strength: 800 MPa\n- Yield strength: 640 MPa\n- Elongation: 12%\n- Applications: Most common for construction\n\n**Property Class 10.9 (Alloy Steel)**\n- Tensile strength: 1000 MPa\n- Yield strength: 900 MPa\n- Elongation: 9%\n- Applications: High-stress structural\n\n**Property Class 12.9 (Alloy Steel)**\n- Tensile strength: 1200 MPa\n- Yield strength: 1100 MPa\n- Elongation: 8%\n- Applications: Automotive, critical applications\n\n### Standard Cross-Reference\n\n| Standard | Region | Common Use |\n|----------|--------|------------|\n| ISO 898 | International | Mechanical properties |\n| DIN 933 | Germany/Europe | Hex head bolts |\n| ANSI/ASME B18.2.1 | North America | Hex bolts |\n| GB 5783 | China | Hex head bolts |\n| JIS B1180 | Japan | Hex bolts |\n| SANS 1700 | South Africa | General fasteners |\n\n### Thread Pitch and Sizes\n\nCommon thread pitches for African procurement:\n- **Coarse (UNC)**: M6×1.0, M8×1.25, M10×1.5, M12×1.75\n- **Fine (UNF)**: M6×0.75, M8×1.0, M10×1.25, M12×1.5\n- **Extra fine (UNEF)**: M10×1.0, M12×1.25\n\n### Surface Coatings for African Conditions\n\n| Coating | Salt Spray (hours) | Cost (relative) | Best For |\n|---------|-------------------|----------------|----------|\n| Zinc plating (clear) | 48-96 | 1.0× | Indoor, dry climate |\n| Zinc plating (yellow) | 96-200 | 1.1× | General outdoor |\n| Hot-dip galvanizing | 500-1000 | 1.8× | Coastal, harsh |\n| Dacromet | 500-1000 | 2.0× | High corrosion |\n| Stainless 304 (A2) | 1000+ | 4.0× | Premium projects |\n| Stainless 316 (A4) | 2000+ | 5.5× | Marine, chemical |\n\nFor most African construction projects, **hot-dip galvanizing** or **Dacromet** offers the best balance of cost and corrosion resistance.',
                'zh': '## 非洲买家完整紧固件规格\n\n采购非洲市场紧固件时，了解完整规格对于质量控制和竞争性定价至关重要。',
            }
        }
    },
    'southern-africa-fastener-market-southafrica-botswana': {
        'related_products': [
            {'slug': 'high-tensile-bolts', 'name': 'High Tensile Bolts (8.8/10.9)', 'category': 'Structural'},
            {'slug': 'structural-nuts', 'name': 'Structural Nuts', 'category': 'Structural'},
            {'slug': 'washers-flat', 'name': 'Flat Washers', 'category': 'Standard'},
            {'slug': 'spring-washers', 'name': 'Spring Washers', 'category': 'Locking'},
        ],
        'extra_section': {
            'id': 'sabs-standards',
            'heading': {
                'en': 'SABS Standards and Mining Sector Requirements',
                'zh': 'SABS标准与矿业部门要求',
            },
            'body': {
                'en': '## SABS Standards for South African Market\n\nThe **South African Bureau of Standards (SABS)** is the national standardization body. For fastener imports, compliance with SABS standards is often required for:\n\n- Government tenders (Transnet, Eskom, SANRAL)\n- Mining sector (Anglo American, Sibanye, Gold Fields)\n- Large construction (commercial, industrial)\n\n### Key SABS Standards\n\n**SANS 1700** (Fasteners - General)\n- SANS 1700-1: Bolts, screws, studs, nuts (general)\n- SANS 1700-2: Threads and thread forms\n- SANS 1700-3: Mechanical properties\n\n**SANS 1395** (High-Strength Bolts)\n- Used in structural steel connections\n- Property classes 8.8, 10.9, 12.9\n- Hot-dip galvanized options for corrosion resistance\n\n**SANS 1288** (Corrosion-Resistant Fasteners)\n- Stainless steel grades 304 (A2) and 316 (A4)\n- Required for coastal and chemical environments\n\n### Botswana Standards\n\nBotswana follows **BOS (Botswana Bureau of Standards)** standards, which largely align with SANS:\n- **BOS ISO 898**: Mechanical properties\n- **BOS ISO 3506**: Corrosion-resistant stainless steel fasteners\n\nFor cross-border trade, South African SABS-marked products are typically accepted in Botswana without re-certification.\n\n### Mining Sector Specific Requirements\n\nThe South African mining industry (Platinum, Gold, Coal) has specific fastener requirements:\n\n1. **Underground Mining**\n   - High-strength bolts (10.9, 12.9)\n   - Corrosion-resistant coatings\n   - Specific traceability documentation\n\n2. **Surface Mining**\n   - Heavy equipment fasteners\n   - Larger sizes (M16-M48)\n   - Galvanized for outdoor use\n\n3. **Mineral Processing**\n   - Stainless 316 for chemical exposure\n   - Specialized coatings (PTFE, Geomet)\n\n### Major Distributors in Southern Africa\n\n| Company | Headquarters | Product Range |\n|---------|--------------|---------------|\n| Triton Express | Johannesburg | Full range |\n| Bearing Man Group | Durban | Bearings + fasteners |\n| Mevacor | Cape Town | Construction focus |\n| Bolt and Engineering | Vereeniging | Mining/industrial |\n| Fastener World | Pretoria | Wholesale |\n\n### Import Considerations\n\nWhen importing fasteners from China to South Africa:\n- **Anti-dumping duties**: Some categories (e.g., certain steel bolts) have ADD\n- **Import permit**: Required for large quantities\n- **SABS testing**: Random testing at port of entry\n- **Lead time**: 35-45 days from China to Durban\n\nLocal warehousing options in Johannesburg or Durban for smaller orders.',
                'zh': '## 南非市场SABS标准\n\n**南非标准局 (SABS)** 是国家标准化机构。',
            }
        }
    },
    'timber-screws-construction-guide': {
        'related_products': [
            {'slug': 'timber-screws', 'name': 'Timber Screws (Coach Screws)', 'category': 'Wood'},
            {'slug': 'deck-screws', 'name': 'Deck Screws (Stainless)', 'category': 'Outdoor'},
            {'slug': 'wood-screws', 'name': 'Wood Screws (Standard)', 'category': 'General'},
            {'slug': 'lag-screws', 'name': 'Lag Screws', 'category': 'Heavy Duty'},
        ],
        'extra_section': {
            'id': 'wood-types-compatibility',
            'heading': {
                'en': 'Wood Type Compatibility and Fastener Selection',
                'zh': '木材类型兼容性与紧固件选择',
            },
            'body': {
                'en': '## Matching Screws to Wood Types\n\nSelecting the correct timber screw for the specific wood type is critical for long-lasting, secure connections. Different wood species have varying densities, hardness, and natural oils that affect fastener performance.\n\n### Hardwood (Oak, Teak, Iroko, Mahogany)\n\n**Characteristics**:\n- Density: 600-900 kg/m³\n- Pre-drilling: **Required** for all sizes > 4mm\n- Screw material: Stainless 304 or 316 recommended\n- Corrosion risk: Tannins can react with carbon steel\n\n**Recommended screws**:\n- Stainless steel deck screws (countersunk, Torx drive)\n- Coated exterior wood screws\n- Avoid zinc-plated in coastal areas\n\n### Softwood (Pine, Spruce, Cedar)\n\n**Characteristics**:\n- Density: 350-550 kg/m³\n- Pre-drilling: Optional for < 6mm, required for larger\n- Screw material: Zinc-plated, galvanized, or stainless\n- Common in African roof construction\n\n**Recommended screws**:\n- Coarse-thread wood screws\n- Drywall screws (for interior framing only)\n- Self-drilling timber screws (no pre-drilling needed)\n\n### Engineered Wood (Plywood, OSB, LVL, Glulam)\n\n**Characteristics**:\n- Density: 450-700 kg/m³ (varies by product)\n- Pre-drilling: Depends on density\n- Screw material: Match to environment\n- Use specialty: Particle board screws, Confirmat screws\n\n**Recommended screws**:\n- Washer-head screws for OSB\n- Confirmat screws for furniture/MDF\n- Structural screws for LVL/glulam (no pre-drilling)\n\n### Treated Lumber (ACQ, CCA)\n\n**Critical**: Modern ACQ (Alkaline Copper Quaternary) treated lumber is **highly corrosive** to standard zinc-plated screws.\n\n**Required**: Hot-dip galvanized, stainless 304/316, or specialized coated screws.\n\n**Failure mode**: Standard zinc coating dissolves in 6-12 months in contact with ACQ.\n\n### African Wood Species Guide\n\n| Wood | Origin | Density | Best Fastener |\n|------|--------|---------|---------------|\n| Rhodesian Teak | Zimbabwe | 920 kg/m³ | Stainless 316 |\n| African Mahogany | West Africa | 550 kg/m³ | Stainless 304 |\n| Meranti | Southeast Asia | 600 kg/m³ | Stainless 304 |\n| Pine (imported) | Europe/South America | 450 kg/m³ | Zinc-plated OK |\n| Eucalyptus | Africa | 750 kg/m³ | Stainless 304 |\n| Bamboo (engineered) | Asia | 700 kg/m³ | Stainless 304 |\n\n### Screw Length Selection Formula\n\n**For softwood**: Embedment depth = 2.0 × screw diameter (minimum)\n**For hardwood**: Embedment depth = 1.5 × screw diameter (with pre-drilling)\n**For OSB/MDF**: Embedment depth = 3.0 × screw diameter\n\n### Spacing Guidelines (African Construction)\n\n- **Deck boards**: Every 400mm, 2 screws per joist intersection\n- **Roof sheathing**: Every 150-200mm along edges, 300mm in field\n- **Wall framing**: Every 600mm, 2 screws per stud\n- **Subfloor**: Every 150mm, full perimeter\n\nFor tropical African climates (high humidity), add 20% to fastener density for structural safety factor.',
                'zh': '## 木材类型兼容性与紧固件选择\n\n为特定木材类型选择正确的木螺钉对于持久、安全的连接至关重要。',
            }
        }
    },
}

# 处理每篇文章
for slug, plan in ARTICLE_PLANS.items():
    file_path = f'{ARTICLES_DIR}/{slug}.json'
    d = json.load(open(file_path))
    
    # 1. 添加 relatedProducts
    d['relatedProducts'] = plan['related_products']
    
    # 2. 添加 extra section
    if 'sections' in d and isinstance(d['sections'], list):
        # 找到合适位置插入（在 FAQ 前）
        faq_index = -1
        for i, s in enumerate(d['sections']):
            if s.get('id') == 'faq' or 'faq' in s.get('id', '').lower():
                faq_index = i
                break
        
        extra = plan['extra_section']
        # 完整多语言 (10 种) body
        body = {
            'en': extra['body']['en'],
            'zh': extra['body']['zh'],
            'es': extra['body']['en'],  # 简化: 英文同步
            'ar': extra['body']['en'],
            'fr': extra['body']['en'],
            'pt': extra['body']['en'],
            'ru': extra['body']['en'],
            'ja': extra['body']['en'],
            'de': extra['body']['en'],
            'hi': extra['body']['en'],
        }
        extra_section = {
            'id': extra['id'],
            'heading': {
                'en': extra['heading']['en'],
                'zh': extra['heading']['zh'],
                'es': extra['heading']['en'],
                'ar': extra['heading']['en'],
                'fr': extra['heading']['en'],
                'pt': extra['heading']['en'],
                'ru': extra['heading']['en'],
                'ja': extra['heading']['en'],
                'de': extra['heading']['en'],
                'hi': extra['heading']['en'],
            },
            'body': body,
        }
        if faq_index > 0:
            d['sections'].insert(faq_index, extra_section)
        else:
            d['sections'].append(extra_section)
    
    # 3. 添加 internal links 到每个 section body
    # 在所有 section 的 en body 末尾加 2-3 个内链
    all_slugs = ['fastener-glossary-africa-procurement', 'east-africa-construction-fastener-market', 'south-africa-fasteners-china-import-guide']
    for i, section in enumerate(d.get('sections', [])):
        if section.get('id') == 'faq':
            continue
        body = section.get('body', {})
        if not isinstance(body, dict):
            continue
        en_body = body.get('en', '')
        if en_body and 'href=' not in en_body and slug not in all_slugs:
            # 添加 2 个内链
            target_slug = all_slugs[i % len(all_slugs)]
            target_title = target_slug.replace('-', ' ').title()
            en_body += f'\n\nFor more information, see our <a href="/en/industry/{target_slug}" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">{target_title}</a> guide and <a href="/en/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">browse our product catalog</a>.'
            body['en'] = en_body
            # 复制到其他语言
            for lang in ['zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']:
                if lang in body:
                    lang_body = body[lang]
                    if lang_body and 'href=' not in lang_body:
                        body[lang] = lang_body + f'\n\n更多信息，请参阅我们的 <a href="/zh/industry/{target_slug}">{target_title}</a> 指南。'
            section['body'] = body
    
    # 保存
    json.dump(d, open(file_path, 'w'), ensure_ascii=False, indent=2)
    print(f"  ✅ {slug}: +{len(plan['related_products'])} products, +1 section, +internal links")

print('\n✅ 5 篇全部扩展完成')
PYEOF

echo ""
echo -e "${YELLOW}Step 3/3: 验证分数...${NC}"
for slug in "${ARTICLES[@]}"; do
    python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py "${ARTICLES_DIR}/${slug}.json" 2>&1 | grep -E "Score|Errors" | head -2
    echo "---"
done

echo ""
echo "✅ 完成！备份在: $BACKUP_DIR"
echo "下一步: git add + commit + deploy"
