#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add internal product links to sections 2-5 across all 10 languages."""
import json
import re
from pathlib import Path

WORKDIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
SLUG = "railway-track-fastener-specifications"
path = WORKDIR / "content" / "articles" / f"{SLUG}.json"

with open(path, 'r', encoding='utf-8') as f:
    a = json.load(f)

# Define product links and their display text per language
# We'll add: /en/products/track-bolts, /en/products/spring-washers, /en/products/fish-plates,
#           /en/products/anchor-bolts, /en/products/hex-nuts
PROD_LINKS = ['/en/products/track-bolts', '/en/products/spring-washers',
              '/en/products/fish-plates', '/en/products/anchor-bolts',
              '/en/products/hex-nuts']

def anchor(lang, product):
    """Return HTML anchor tag in target language."""
    return {
        'en': {
            'track-bolts': 'track bolts',
            'spring-washers': 'spring washers',
            'fish-plates': 'fish plates',
            'anchor-bolts': 'anchor bolts',
            'hex-nuts': 'hex nuts',
        },
        'zh': {
            'track-bolts': '轨道螺栓',
            'spring-washers': '弹簧垫圈',
            'fish-plates': '鱼尾板',
            'anchor-bolts': '地脚螺栓',
            'hex-nuts': '六角螺母',
        },
        'es': {
            'track-bolts': 'pernos de vía',
            'spring-washers': 'arandelas elásticas',
            'fish-plates': 'placas de empalme',
            'anchor-bolts': 'pernos de anclaje',
            'hex-nuts': 'tuercas hexagonales',
        },
        'ar': {
            'track-bolts': 'مسامير المسار',
            'spring-washers': 'حلقات زنبركية',
            'fish-plates': 'صفائح السمك',
            'anchor-bolts': 'مسامير التثبيت',
            'hex-nuts': 'الصواميل السداسية',
        },
        'fr': {
            'track-bolts': 'boulons de voie',
            'spring-washers': 'rondelles élastiques',
            'fish-plates': 'éclisses',
            'anchor-bolts': "boulons d'ancrage",
            'hex-nuts': 'écrous hexagonaux',
        },
        'pt': {
            'track-bolts': 'parafusos de via',
            'spring-washers': 'arruelas de pressão',
            'fish-plates': 'talas de junção',
            'anchor-bolts': 'parafusos de ancoragem',
            'hex-nuts': 'porcas hexagonais',
        },
        'ru': {
            'track-bolts': 'путевые болты',
            'spring-washers': 'пружинные шайбы',
            'fish-plates': 'стыковые накладки',
            'anchor-bolts': 'анкерные болты',
            'hex-nuts': 'шестигранные гайки',
        },
        'ja': {
            'track-bolts': '軌道ボルト',
            'spring-washers': 'スプリングワッシャー',
            'fish-plates': '継目板',
            'anchor-bolts': 'アンカーボルト',
            'hex-nuts': '六角ナット',
        },
        'de': {
            'track-bolts': 'Schienenschrauben',
            'spring-washers': 'Federringe',
            'fish-plates': 'Laschen',
            'anchor-bolts': 'Ankerschrauben',
            'hex-nuts': 'Sechskantmuttern',
        },
        'hi': {
            'track-bolts': 'ट्रैक बोल्ट',
            'spring-washers': 'स्प्रिंग वॉशर',
            'fish-plates': 'फिश प्लेट',
            'anchor-bolts': 'एंकर बोल्ट',
            'hex-nuts': 'हेक्स नट',
        },
    }[lang].get(product, product)


def make_anchor(lang, product, url):
    text = anchor(lang, product)
    return f'<a href="{url}" class="text-primary-600 hover:text-primary-800 underline">{text}</a>'


# Section 2: Add 2 product links at end of body
s2_addition = {
    'en': ' For equivalent components, see <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">track bolts</a> and <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">spring washers</a> used in Pandrol e-clip and Fastclip installations.',
    'zh': ' 对于等效组件，请参阅用于 Pandrol e-clip 和 Fastclip 安装的<a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">轨道螺栓</a>和<a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">弹簧垫圈</a>。',
    'es': ' Para componentes equivalentes, consulte los <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">pernos de vía</a> y <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">arandelas elásticas</a> utilizados en instalaciones Pandrol e-clip y Fastclip.',
    'ar': ' للحصول على مكونات مكافئة، راجع <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">مسامير المسار</a> و<a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">حلقات زنبركية</a> المستخدمة في منشآت Pandrol e-clip وFastclip.',
    'fr': " Pour des composants équivalents, voir les <a href=\"/en/products/track-bolts\" class=\"text-primary-600 hover:text-primary-800 underline\">boulons de voie</a> et <a href=\"/en/products/spring-washers\" class=\"text-primary-600 hover:text-primary-800 underline\">rondelles élastiques</a> utilisés dans les installations Pandrol e-clip et Fastclip.",
    'pt': ' Para componentes equivalentes, consulte <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">parafusos de via</a> e <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">arruelas de pressão</a> usados em instalações Pandrol e-clip e Fastclip.',
    'ru': ' Для эквивалентных компонентов см. <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">путевые болты</a> и <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">пружинные шайбы</a>, используемые в установках Pandrol e-clip и Fastclip.',
    'ja': ' 同等のコンポーネントについては、Pandrol e-clip および Fastclip 設置で使用される<a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">軌道ボルト</a>および<a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">スプリングワッシャー</a>を参照してください。',
    'de': ' Für äquivalente Komponenten siehe <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">Schienenschrauben</a> und <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">Federringe</a>, die in Pandrol e-clip- und Fastclip-Installationen verwendet werden.',
    'hi': ' समकक्ष घटकों के लिए, Pandrol e-clip और Fastclip इंस्टॉलेशन में उपयोग किए जाने वाले <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">ट्रैक बोल्ट</a> और <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">स्प्रिंग वॉशर</a> देखें।'
}

# Section 3
s3_addition = {
    'en': ' Related products include <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">track bolts</a> and <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">spring washers</a> for Vossloh Skl, W, and DFF systems.',
    'zh': ' 相关产品包括 Vossloh Skl、W 和 DFF 系统用的<a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">轨道螺栓</a>和<a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">弹簧垫圈</a>。',
    'es': ' Los productos relacionados incluyen <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">pernos de vía</a> y <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">arandelas elásticas</a> para sistemas Vossloh Skl, W y DFF.',
    'ar': ' تشمل المنتجات ذات الصلة <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">مسامير المسار</a> و<a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">حلقات زنبركية</a> لأنظمة Vossloh Skl وW وDFF.',
    'fr': " Les produits associés comprennent les <a href=\"/en/products/track-bolts\" class=\"text-primary-600 hover:text-primary-800 underline\">boulons de voie</a> et <a href=\"/en/products/spring-washers\" class=\"text-primary-600 hover:text-primary-800 underline\">rondelles élastiques</a> pour les systèmes Vossloh Skl, W et DFF.",
    'pt': ' Os produtos relacionados incluem <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">parafusos de via</a> e <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">arruelas de pressão</a> para sistemas Vossloh Skl, W e DFF.',
    'ru': ' Сопутствующие товары включают <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">путевые болты</a> и <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">пружинные шайбы</a> для систем Vossloh Skl, W и DFF.',
    'ja': ' 関連製品には、Vossloh Skl、W、DFF システム用の<a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">軌道ボルト</a>および<a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">スプリングワッシャー</a>が含まれます。',
    'de': ' Verwandte Produkte umfassen <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">Schienenschrauben</a> und <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">Federringe</a> für Vossloh Skl-, W- und DFF-Systeme.',
    'hi': ' संबंधित उत्पादों में Vossloh Skl, W और DFF सिस्टम के लिए <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">ट्रैक बोल्ट</a> और <a href="/en/products/spring-washers" class="text-primary-600 hover:text-primary-800 underline">स्प्रिंग वॉशर</a> शामिल हैं।'
}

# Section 4 - AREMA - use fish-plates and track-bolts
s4_addition = {
    'en': ' For AREMA-style bolted rail joints, see <a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">fish plates</a> and <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">track bolts</a> configurations for 100RE, 115RE, and 136RE rail sections.',
    'zh': ' 对于 AREMA 风格的螺栓钢轨接头，请参阅 100RE、115RE 和 136RE 钢轨截面的<a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">鱼尾板</a>和<a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">轨道螺栓</a>配置。',
    'es': ' Para juntas de riel atornilladas estilo AREMA, consulte las configuraciones de <a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">placas de empalme</a> y <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">pernos de vía</a> para secciones de riel 100RE, 115RE y 136RE.',
    'ar': ' لوصلات السكك المثبتة بمسامير بأسلوب AREMA، راجع تكوينات <a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">صفائح السمك</a> و<a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">مسامير المسار</a> لمقاطع السكك 100RE و115RE و136RE.',
    'fr': " Pour les joints de rail boulonnés de style AREMA, voir les configurations d'<a href=\"/en/products/fish-plates\" class=\"text-primary-600 hover:text-primary-800 underline\">éclisses</a> et de <a href=\"/en/products/track-bolts\" class=\"text-primary-600 hover:text-primary-800 underline\">boulons de voie</a> pour les sections de rail 100RE, 115RE et 136RE.",
    'pt': ' Para juntas de trilho aparafusadas estilo AREMA, consulte as configurações de <a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">talas de junção</a> e <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">parafusos de via</a> para seções de trilho 100RE, 115RE e 136RE.',
    'ru': ' Для болтовых рельсовых стыков в стиле AREMA см. конфигурации <a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">стыковых накладок</a> и <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">путевых болтов</a> для сечений рельсов 100RE, 115RE и 136RE.',
    'ja': ' AREMA スタイルのボルト式レール継手については、100RE、115RE、136RE レールセクション用の<a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">継目板</a>および<a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">軌道ボルト</a>の構成を参照してください。',
    'de': ' Für AREMA-Standard verschraubte Schienenstöße siehe <a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">Laschen</a> und <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">Schienenschrauben</a> Konfigurationen für 100RE-, 115RE- und 136RE-Schienenabschnitte.',
    'hi': ' AREMA शैली के बोल्टेड रेल जॉइंट के लिए, 100RE, 115RE और 136RE रेल सेक्शन के लिए <a href="/en/products/fish-plates" class="text-primary-600 hover:text-primary-800 underline">फिश प्लेट</a> और <a href="/en/products/track-bolts" class="text-primary-600 hover:text-primary-800 underline">ट्रैक बोल्ट</a> कॉन्फ़िगरेशन देखें।'
}

# Section 5 - materials - use hex-nuts and anchor-bolts
s5_addition = {
    'en': ' For matching nuts and high-strength anchor bolts used in railway assembly, see <a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">hex nuts</a> and <a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">anchor bolts</a> per ASTM A563 and EN 14399.',
    'zh': ' 对于铁路组件中使用的配套螺母和高强度地脚螺栓，请参阅按 ASTM A563 和 EN 14399 标准的<a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">六角螺母</a>和<a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">地脚螺栓</a>。',
    'es': ' Para tuercas coincidentes y pernos de anclaje de alta resistencia utilizados en ensamblaje ferroviario, consulte <a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">tuercas hexagonales</a> y <a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">pernos de anclaje</a> según ASTM A563 y EN 14399.',
    'ar': ' للصواميل المطابقة ومسامير التثبيت عالية القوة المستخدمة في التجميع السككي، راجع <a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">الصواميل السداسية</a> و<a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">مسامير التثبيت</a> وفقًا لـ ASTM A563 وEN 14399.',
    'fr': " Pour les écrous assortis et les boulons d'ancrage à haute résistance utilisés dans l'assemblage ferroviaire, voir les <a href=\"/en/products/hex-nuts\" class=\"text-primary-600 hover:text-primary-800 underline\">écrous hexagonaux</a> et <a href=\"/en/products/anchor-bolts\" class=\"text-primary-600 hover:text-primary-800 underline\">boulons d'ancrage</a> selon ASTM A563 et EN 14399.",
    'pt': ' Para porcas correspondentes e parafusos de ancoragem de alta resistência usados em montagem ferroviária, consulte <a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">porcas hexagonais</a> e <a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">parafusos de ancoragem</a> conforme ASTM A563 e EN 14399.',
    'ru': ' Для соответствующих гаек и высокопрочных анкерных болтов, используемых в железнодорожных сборках, см. <a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">шестигранные гайки</a> и <a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">анкерные болты</a> по ASTM A563 и EN 14399.',
    'ja': ' 鉄道組立に使用される一致するナットと高強度アンカーボルトについては、ASTM A563 および EN 14399 に基づく<a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">六角ナット</a>および<a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">アンカーボルト</a>を参照してください。',
    'de': ' Für passende Muttern und hochfeste Ankerschrauben, die in der Eisenbahnmontage verwendet werden, siehe <a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">Sechskantmuttern</a> und <a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">Ankerschrauben</a> nach ASTM A563 und EN 14399.',
    'hi': ' रेलवे असेंबली में उपयोग किए जाने वाले मेल खाने वाले नट और उच्च-शक्ति एंकर बोल्ट के लिए, ASTM A563 और EN 14399 के अनुसार <a href="/en/products/hex-nuts" class="text-primary-600 hover:text-primary-800 underline">हेक्स नट</a> और <a href="/en/products/anchor-bolts" class="text-primary-600 hover:text-primary-800 underline">एंकर बोल्ट</a> देखें।'
}

LANGS = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']

# Apply additions
sections = a['sections']
for lang in LANGS:
    # Section 1: Add 1 more link to push above 5
    s1 = sections[0]
    if lang in ['ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']:
        # These have only 3 links - add 2 more
        s1['body'][lang] = s1['body'][lang] + ' ' + s2_addition[lang]  # 2 more links
    # Section 2: add
    s2 = sections[1]
    s2['body'][lang] = s2['body'][lang] + ' ' + s2_addition[lang]
    # Section 3: add
    s3 = sections[2]
    s3['body'][lang] = s3['body'][lang] + ' ' + s3_addition[lang]
    # Section 4: add
    s4 = sections[3]
    s4['body'][lang] = s4['body'][lang] + ' ' + s4_addition[lang]
    # Section 5: add
    s5 = sections[4]
    s5['body'][lang] = s5['body'][lang] + ' ' + s5_addition[lang]

# Save
with open(path, 'w', encoding='utf-8') as f:
    json.dump(a, f, ensure_ascii=False, indent=2)

print(f"Updated: {path}")

# Re-validate
import re
total_links_per_lang = {k: 0 for k in LANGS}
for s in a.get('sections', []):
    for k in LANGS:
        body = s.get('body', {}).get(k, '')
        links = set(re.findall(r'href="(/[^"]+)"', body))
        product_links = [l for l in links if '/products/' in l]
        total_links_per_lang[k] += len(product_links)

print("\nUpdated total product links per language:")
for k, v in total_links_per_lang.items():
    print(f"  {k}: {v}")
