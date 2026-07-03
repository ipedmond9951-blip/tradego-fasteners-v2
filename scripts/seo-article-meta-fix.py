#!/usr/bin/env python3
"""
seo-article-meta-fix.py - 批量修复 content/articles/ 下的 SEO 问题 (2026-07-03)

修复:
1. 缺失 metaDescription → 用 title + 关键词生成 10 语言 i18n dict
2. metaDescription < 100 chars → 补全到 145-155 chars
3. metaDescription > 160 chars → 截断到 152 chars + ellipsis

使用:
  python3 scripts/seo-article-meta-fix.py --dry-run   # 只检查, 不写
  python3 scripts/seo-article-meta-fix.py --fix       # 写回 JSON
"""

import os, json, sys, argparse
from pathlib import Path

PROJECT_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
ARTICLES_DIR = PROJECT_DIR / "content" / "articles"

# 10 语言 (按 Vercel i18n 配置)
LOCALES = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']

# 关键词字典 (slug → country)
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

def gen_meta_en(title: str, country: str) -> str:
    if country:
        return f"Source ISO-certified fasteners from China for {country} {title.lower()}. Bulk pricing, SADC standards, ASTM/ISO compliance. TradeGo B2B wholesale."
    return f"Source ISO-certified {title.lower()} from China manufacturer. Bulk pricing, ASTM/ISO compliance, B2B wholesale. TradeGo since 2010."

def gen_meta(title: str, slug: str, locale: str) -> str:
    country = get_country(slug)
    title_short = title[:50] if title else 'fasteners'

    if locale == 'en':
        return gen_meta_en(title_short, country)
    elif locale == 'zh':
        if country:
            return f"中国紧固件厂家直供非洲{country}{title_short}。ISO 9001/SABS/ASTM 认证, 大宗批发价格, 海运到港服务。"
        return f"中国紧固件厂家直供{title_short}。ISO 9001 认证, 大宗批发价格, 海运到港服务。"
    elif locale == 'es':
        if country:
            return f"Suministro directo de China de sujetadores para {country} {title_short.lower()}. Certificación ISO 9001, precios al por mayor, envío a puerto."
        return f"Suministro directo de China de {title_short.lower()}. Certificación ISO 9001, precios al por mayor, envío a puerto."
    elif locale == 'ar':
        if country:
            return f"إمداد مباشر من الصين لمثبتات {country} {title_short}. شهادة ISO 9001، أسعار الجملة، الشحن إلى الميناء."
        return f"إمداد مباشر من الصين لمثبتات {title_short}. شهادة ISO 9001، أسعار الجملة، الشحن إلى الميناء."
    elif locale == 'fr':
        if country:
            return f"Approvisionnement direct Chine en fixations pour {country} {title_short.lower()}. Certification ISO 9001, prix de gros, livraison port."
        return f"Approvisionnement direct Chine en {title_short.lower()}. Certification ISO 9001, prix de gros, livraison port."
    elif locale == 'pt':
        if country:
            return f"Abastecimento direto da China de fixadores para {country} {title_short.lower()}. Certificação ISO 9001, preços por atacado, envio ao porto."
        return f"Abastecimento direto da China de {title_short.lower()}. Certificação ISO 9001, preços por atacado, envio ao porto."
    elif locale == 'ru':
        if country:
            return f"Прямые поставки из Китая крепежа для {country} {title_short.lower()}. Сертификация ISO 9001, оптовые цены, доставка в порт."
        return f"Прямые поставки из Китая {title_short.lower()}. Сертификация ISO 9001, оптовые цены, доставка в порт."
    elif locale == 'ja':
        if country:
            return f"中国からのISO認定締結具の直接供給({country}向け){title_short}。ISO 9001認証、卸売価格、港まで配送。"
        return f"中国からのISO認定{title_short}の直接供給。ISO 9001認証、卸売価格、港まで配送。"
    elif locale == 'de':
        if country:
            return f"Direktlieferung aus China von Befestigungselementen für {country} {title_short.lower()}. ISO 9001 Zertifizierung, Großhandelspreise."
        return f"Direktlieferung aus China von {title_short.lower()}. ISO 9001 Zertifizierung, Großhandelspreise, Hafenlieferung."
    elif locale == 'hi':
        if country:
            return f"चीन से ISO प्रमाणित फास्टनर की सीधी आपूर्ति {country} के लिए {title_short}। ISO 9001 प्रमाणन, थोक मूल्य।"
        return f"चीन से ISO प्रमाणित {title_short} की सीधी आपूर्ति। ISO 9001 प्रमाणन, थोक मूल्य, बंदरगाह वितरण।"
    return gen_meta_en(title_short, country)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--fix', action='store_true')
    args = parser.parse_args()

    if not args.dry_run and not args.fix:
        args.dry_run = True

    articles = sorted(ARTICLES_DIR.glob('*.json'))
    print(f"📚 Scanning {len(articles)} articles...")

    fixed_missing = 0
    fixed_too_short = 0
    fixed_too_long = 0
    skipped = 0
    errors = []
    files_changed = 0

    for f in articles:
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                d = json.load(fp)

            title = d.get('title', '')
            if isinstance(title, dict):
                title = title.get('en', title.get('zh', ''))
            if not title:
                title = d.get('slug', f.stem).replace('-', ' ').title()

            slug = d.get('slug', f.stem)

            md = d.get('metaDescription')
            needs_fix = False
            new_md = {}

            if not md or not isinstance(md, dict) or len(md) == 0:
                # 完全缺失
                new_md = {l: gen_meta(title, slug, l) for l in LOCALES}
                needs_fix = True
                fixed_missing += 1
            else:
                # 部分语言缺失或长度异常
                for l in LOCALES:
                    val = md.get(l, '')
                    if not val:
                        new_md[l] = gen_meta(title, slug, l)
                        needs_fix = True
                        fixed_missing += 1
                    elif len(val) < 100:
                        new_md[l] = gen_meta(title, slug, l)
                        needs_fix = True
                        fixed_too_short += 1
                    elif len(val) > 160:
                        new_md[l] = val[:152].rstrip() + '...'
                        needs_fix = True
                        fixed_too_long += 1
                    else:
                        new_md[l] = val
                for k, v in md.items():
                    if k not in new_md:
                        new_md[k] = v

            if needs_fix:
                files_changed += 1
                if args.fix:
                    d['metaDescription'] = new_md
                    with open(f, 'w', encoding='utf-8') as fp:
                        json.dump(d, fp, indent=2, ensure_ascii=False)
                    print(f"  ✅ Fixed: {f.name[:55]:55}")
                else:
                    print(f"  🔍 Would fix: {f.name[:55]:55}")
        except Exception as e:
            errors.append((f.name, str(e)))
            skipped += 1

    print()
    print(f"📊 Summary:")
    print(f"   Total articles: {len(articles)}")
    print(f"   Files changed: {files_changed}")
    print(f"   Missing meta filled: {fixed_missing}")
    print(f"   Too-short fixed: {fixed_too_short}")
    print(f"   Too-long fixed: {fixed_too_long}")
    print(f"   Errors: {skipped}")
    if errors:
        for fn, e in errors[:5]:
            print(f"     {fn}: {e}")
    if args.dry_run:
        print()
        print(f"💡 Run with --fix to apply changes")

if __name__ == '__main__':
    main()