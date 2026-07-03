#!/usr/bin/env python3
"""
seo-article-meta-relocalize.py - 修复 metaDescription 统一内容 + 太短问题 (2026-07-03)

适用:
- 各语言用同一内容 (≤3 unique)
- 部分语言 < 100 chars

策略:
- title 提取主关键词 (避免太长)
- 各语言独立模板 (不复制英文)
"""

import os, json, glob, re, sys, argparse
from pathlib import Path

PROJECT_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
ARTICLES_DIR = PROJECT_DIR / "content" / "articles"

LOCALES = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']

COUNTRY_KEYWORDS = {
    'africa': 'Africa', 'kenya': 'Kenya', 'tanzania': 'Tanzania',
    'zambia': 'Zambia', 'mozambique': 'Mozambique', 'south-africa': 'South Africa',
    'nigeria': 'Nigeria', 'ghana': 'Ghana', 'egypt': 'Egypt',
    'algeria': 'Algeria', 'morocco': 'Morocco', 'ethiopia': 'Ethiopia',
    'angola': 'Angola', 'senegal': 'Senegal', 'ivory': 'Ivory Coast',
    'cameroon': 'Cameroon', 'zimbabwe': 'Zimbabwe', 'botswana': 'Botswana',
}

def get_country(slug: str) -> str:
    for k, v in COUNTRY_KEYWORDS.items():
        if k in slug.lower():
            return v
    return ''

# 短 keyword (max 3 词, 防止 title 超长被截断)
def short_keyword(title: str, slug: str) -> str:
    parts = slug.split('-')
    skip = {'fastener', 'fasteners', 'guide', 'china', 'wholesale', 'import',
            'market', 'supply', 'supplier', 'selection', 'grade', 'specifications',
            'standards', 'complete', 'project', 'bolts', 'screws', 'nuts', 'washers',
            'co', 'ivory', 'south', 'north', 'east', 'west', 'top', 'best', '2026',
            'rough', 'in', 'vs', 'for', 'and', 'the'}
    keywords = [p for p in parts if p not in skip and len(p) > 2][:3]
    if not keywords:
        # fallback 到 title 但限制长度
        t = re.sub(r'[:：].*', '', title)  # 去掉冒号后内容
        keywords = t.split()[:3]
    # 限制总长度 (英文 25 chars 足够 3 词)
    result = ' '.join(keywords).title() if keywords else 'fasteners'
    return result[:30]

def gen_meta(locale: str, keyword: str, country: str) -> str:
    """生成各语言独立 145-155 chars meta (CJK 语言需 80-100 char 足够)"""
    if locale == 'en':
        if country:
            return f"Bulk {keyword.lower()} supply for {country} construction projects. ISO 9001 & SABS certified China manufacturer, ASTM compliant, factory-direct pricing. TradeGo B2B export since 2010."
        return f"Bulk {keyword.lower()} supply for global construction projects. ISO 9001 certified China manufacturer, ASTM compliant, factory-direct pricing. TradeGo B2B export since 2010."
    elif locale == 'zh':
        if country:
            return f"中国紧固件厂家直供非洲{country}{keyword}项目。ISO 9001 认证、SABS 标准合规，ASTM 认证，工厂直接出厂价格，海运到港服务，2010 年起专注 B2B 出口。"
        return f"中国紧固件厂家直供{keyword}项目。ISO 9001 认证，ASTM 标准合规，工厂直接出厂价格，海运到港服务，2010 年起专注 B2B 出口，全球客户信赖。"
    elif locale == 'es':
        if country:
            return f"Suministro al por mayor de {keyword.lower()} para proyectos de construcción en {country}. Fabricante chino certificado ISO 9001, cumplimiento ASTM, precio directo de fábrica."
        return f"Suministro al por mayor de {keyword.lower()} para proyectos globales. Fabricante chino certificado ISO 9001, precio directo de fábrica, envío a puerto."
    elif locale == 'ar':
        if country:
            return f"توريد بالجملة من {keyword} لمشاريع البناء في {country}. مصنع صيني معتمد ISO 9001، متوافق مع ASTM، سعر مباشر من المصنع، شحن إلى الميناء."
        return f"توريد بالجملة من {keyword} لمشاريع البناء العالمية. مصنع صيني معتمد ISO 9001، سعر مباشر من المصنع، شحن إلى الميناء."
    elif locale == 'fr':
        if country:
            return f"Fourniture en gros de {keyword.lower()} pour projets de construction en {country}. Fabricant chinois certifié ISO 9001, conforme ASTM, prix direct usine, livraison port."
        return f"Fourniture en gros de {keyword.lower()} pour projets mondiaux. Fabricant chinois certifié ISO 9001, prix direct usine, livraison port."
    elif locale == 'pt':
        if country:
            return f"Fornecimento por atacado de {keyword.lower()} para projetos de construção em {country}. Fabricante chinês certificado ISO 9001, em conformidade ASTM, preço direto fábrica."
        return f"Fornecimento por atacado de {keyword.lower()} para projetos globais. Fabricante chinês certificado ISO 9001, preço direto fábrica, envio porto."
    elif locale == 'ru':
        if country:
            return f"Оптовые поставки {keyword.lower()} для строительных проектов в {country}. Китайский производитель ISO 9001, соответствие ASTM, заводская цена, доставка в порт."
        return f"Оптовые поставки {keyword.lower()} для мировых строительных проектов. Китайский производитель ISO 9001, заводская цена, доставка в порт."
    elif locale == 'ja':
        if country:
            return f"中国{country}建設向け{keyword}専門メーカー直供給。ISO 9001認証、ASTM準拠、工場直接価格、港まで配送、2010年からB2B輸出専門メーカー。"
        return f"中国{keyword}専門メーカー直供給。ISO 9001認証、ASTM準拠、工場直接価格、港まで配送、2010年からB2B輸出専門、グローバル顧客信頼メーカー。"
    elif locale == 'de':
        if country:
            return f"Großhandel {keyword.lower()} für Bauprojekte in {country}. ISO 9001 zertifizierter chinesischer Hersteller, ASTM-konform, Werksdirektpreis, Hafenlieferung."
        return f"Großhandel {keyword.lower()} für globale Bauprojekte. ISO 9001 zertifizierter chinesischer Hersteller, Werksdirektpreis, Hafenlieferung."
    elif locale == 'hi':
        if country:
            return f"{country} निर्माण परियोजनाओं के लिए थोक {keyword} आपूर्ति। ISO 9001 प्रमाणित चीन निर्माता, ASTM अनुपालन, कारखाना सीधी कीमत, बंदरगाह।"
        return f"वैश्विक निर्माण परियोजनाओं के लिए थोक {keyword} आपूर्ति। ISO 9001 प्रमाणित चीन निर्माता, कारखाना सीधी कीमत, बंदरगाह वितरण।"
    return ''

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--fix', action='store_true')
    args = parser.parse_args()

    if not args.dry_run and not args.fix:
        args.dry_run = True

    articles = sorted(ARTICLES_DIR.glob('*.json'))
    print(f"📚 Scanning {len(articles)} articles...")

    unified_count = 0
    short_count = 0
    files_changed = 0

    for f in articles:
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                d = json.load(fp)

            md = d.get('metaDescription', {})
            if not isinstance(md, dict) or len(md) == 0:
                continue

            # 检查是否需要修复 (CJK 阈值 70, Latin 阈值 100)
            unique = set(str(v) for v in md.values())
            short_langs = []
            for l in LOCALES:
                if l in md:
                    val_len = len(md[l])
                    if l in ['zh', 'ja', 'ko']:
                        threshold = 70
                    else:
                        threshold = 100
                    if val_len < threshold:
                        short_langs.append(l)

            is_unified = len(unique) <= 3
            has_short = len(short_langs) > 0

            if not (is_unified or has_short):
                continue

            title = d.get('title', '')
            if isinstance(title, dict):
                title = title.get('en', '')
            slug = d.get('slug', f.stem)

            keyword = short_keyword(title, slug)
            country = get_country(slug)

            # 生成新 dict (只覆盖需要修的)
            new_md = dict(md)
            if is_unified:
                unified_count += 1
                # 全部重写 (用各语言独立模板)
                new_md = {l: gen_meta(l, keyword, country) for l in LOCALES}
            elif has_short:
                short_count += 1
                for l in short_langs:
                    new_md[l] = gen_meta(l, keyword, country)

            files_changed += 1
            if args.fix:
                d['metaDescription'] = new_md
                with open(f, 'w', encoding='utf-8') as fp:
                    json.dump(d, fp, indent=2, ensure_ascii=False)
                reason = "unified" if is_unified else f"short: {short_langs}"
                print(f"  ✅ {f.name[:50]:50} ({reason})")
            else:
                reason = "unified" if is_unified else f"short: {len(short_langs)} langs"
                print(f"  🔍 {f.name[:50]:50} ({reason})")
        except Exception as e:
            print(f"  ❌ {f.name}: {e}")

    print()
    print(f"📊 Summary:")
    print(f"   Unified-content articles: {unified_count}")
    print(f"   Short-lang articles: {short_count}")
    print(f"   Files changed: {files_changed}")
    if args.dry_run:
        print()
        print(f"💡 Run with --fix to apply")

if __name__ == '__main__':
    main()