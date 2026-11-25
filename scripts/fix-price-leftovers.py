#!/usr/bin/env python3
"""价格类清理的第二步（收口）：修残留小标题、补漏的中文金额、修正 tek 篇被写坏的开头。
执行顺序：先给 MONEY 加中文/整箱口径，再删「只剩冒号的小标题」，最后替换 4 处写坏的开头。
"""
import json, re

MONEY = re.compile(r'(?:USD\s?[\d,.]+|\$\s?[\d,.]+|€\s?[\d,.]+|[\d,.]+\s?(?:USD|EUR|RMB|CNY|MAD|美元|美金|元)|\d+\s?-\s?\d+\s?美元)')
ORPHAN = re.compile(r'^[^。！？.!?]{0,80}[：:]\s*$')

OPENERS = {
 'es': "No existe una lista de precios publicada para los tornillos TEK; cualquier cifra fija impresa en una página es una foto de una especificación en una semana, y no un precio con el que un comprador pueda cerrar. Lo que sí puede explicarse con precisión es cómo se construye una cotización FOB China, porque esa estructura permanece estable aunque los números se muevan.",
 'pt': "Não existe lista de preços publicada para parafusos TEK; qualquer número fixo impresso em uma página é uma foto de uma especificação em uma semana, e não um preço com o qual o comprador possa fechar. O que se pode explicar com precisão é como uma cotação FOB China é construída, porque essa estrutura permanece estável mesmo quando os números se movem.",
 'ru': "Опубликованного прайс-листа на самонарезающие винты TEK не существует; любая фиксированная цифра на странице — снимок одной спецификации за одну неделю, а не цена, по которой покупатель может закрыть сделку. Точно объяснить можно другое: как строится предложение FOB Китай, потому что эта структура устойчива, даже когда цифры меняются.",
 'hi': "TEK स्क्रू के लिए कोई प्रकाशित मूल्य-सूची नहीं है; पेज पर छपा कोई भी स्थिर आंकड़ा एक सप्ताह की एक स्पेसिफिकेशन की तस्वीर है, न कि ऐसा मूल्य जिस पर खरीदार सौदा कर सके। जिसे ठीक-ठीक समझाया जा सकता है वह यह है कि FOB चीन कोटेशन कैसे बनता है, क्योंकि संख्याएँ बदलने पर भी यह संरचना स्थिर रहती है।",
}
STRUCT_START = {
 'es': 'La cotización de este product',
 'pt': 'A cotação deste produto',
 'ru': 'Предложение по этому товару',
 'hi': 'इस उत्पाद का कोटेशन',
}


def drop_orphans(text):
    lines = text.split('\n')
    out = []
    n = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped and ORPHAN.match(stripped) and ('USD' in stripped or '美元' in stripped or 'ドル' in stripped
                                                    or 'Š' in stripped or '米ドル' in stripped or stripped.startswith('#')):
            n += 1
            continue
        if stripped and ORPHAN.match(stripped) and re.match(r'#\d', stripped):
            n += 1
            continue
        out.append(line)
    return '\n'.join(out), n


def main():
    total = 0
    # 1) drywall / china-fastener / tek：中文“美元/K盒”这类金额
    for slug in ('drywall-screws-bulk-price-africa-procurement',
                 'china-fastener-supplier-price-list-guide'):
        path = 'content/articles/%s.json' % slug
        a = json.load(open(path))
        for s in a['sections']:
            if not isinstance(s.get('body'), dict):
                continue
            for lang, v in list(s['body'].items()):
                if not isinstance(v, str):
                    continue
                new = v
                # 删掉「- 100盒（100颗/盒）：18-22美元/K盒」这类整条报价行
                lines = []
                removed = 0
                for line in new.split('\n'):
                    if MONEY.search(line) or re.search(r'\d+\s?-\s?\d+\s?(美元|美金)', line):
                        if MONEY.search(line) or '\u7f8e\u5143' in line:
                            removed += 1
                            continue
                    lines.append(line)
                if removed:
                    new = '\n'.join(lines)
                    if MONEY.search(new) or '\u7f8e\u5143' in new:
                        continue
                    s['body'][lang] = new
                    total += removed
                    print('删报价行', slug, s.get('id'), lang, removed)
        # 2) 小标题清理
        for s in a['sections']:
            if not isinstance(s.get('body'), dict):
                continue
            for lang, v in list(s['body'].items()):
                if not isinstance(v, str) or not v.strip():
                    continue
                new, n = drop_orphans(v)
                if n:
                    s['body'][lang] = new
                    total += n
        json.dump(a, open(path, 'w'), ensure_ascii=False, indent=2)
        open(path, 'a').write('\n')

    # 3) tek：4 个语种被写坏的开头
    path = 'content/articles/self-drilling-tek-screws-price-list.json'
    a = json.load(open(path))
    for s in a['sections']:
        if s.get('id') != 'pricing' or not isinstance(s.get('body'), dict):
            continue
        for lang, start in STRUCT_START.items():
            v = s['body'].get(lang)
            if not isinstance(v, str):
                continue
            idx = v.find(start)
            if idx <= 0:
                print('⚠️ tek', lang, '未找到结构段起点，跳过')
                continue
            s['body'][lang] = OPENERS[lang] + '\n\n' + v[idx:]
            total += 1
            print('重写开头', 'tek', lang, len(s['body'][lang]))
    json.dump(a, open(path, 'w'), ensure_ascii=False, indent=2)
    open(path, 'a').write('\n')
    print('共 %d 处' % total)


if __name__ == '__main__':
    main()
