#!/usr/bin/env python3
"""修正文里"单词级串语"：目标语种段落里零星混入俄语/中文/印地语词。
与整字段错语种不同，这类只需按同义词替换，保留原句结构。"""
import json

FIX = {
 ('uganda-oil-refinery-fastener-requirements','es'): [('завершение','fase de cierre')],
 ('east-africa-construction-fastener-market','ja'): [('產生されています','発生しています')],
 ('solar-panel-mounting-fasteners-africa','ja'): [('可靠性','信頼性')],
 ('washer-types-applications-guide','fr'): [('переменные','variables')],
 ('washer-types-applications-guide','pt'): [('ожидаемой','esperada')],
 ('zambia-copper-mining-fasteners-grade-selection-2026','ja'): [
   ('приложений','用途'),('alternatives','代替案'),('安装 labor','据付工数'),
   ('總所有コスト','総所有コスト'),('產品','製品'),('價格','価格'),('選択された','選ばれた')],
 ('anchor-bolts-suppliers-africa','ja'): [('соединения','接合部')],
 ('anchor-bolts-suppliers-africa','es'): [('Las طولs','Las longitudes'),('diámetroы','diámetros'),('Los diámetroы','Los diámetros')],
 ('bolt-grade-markings-guide','ja'): [('ボルト的头部','ボルトの頭部'),('ナッツ','ナット')],
 ('drc-mining-concession-fastener-logistics','es'): [('cycling térmico','ciclos térmicos'),('de соединение','de la unión')],
 ('africa-informal-construction-fastener-demand','de'): [('mit некоторым Bedarf','mit gewissem Bedarf')],
 ('africa-informal-construction-fastener-demand','ja'): [('セルフトAPPING','セルフタッピング')],
 ('agricultural-machinery-fastener-guide','pt'): [('previne o захламления em detritos','evita o acúmulo de detritos')],
}

total = 0
for (slug, lg), pairs in FIX.items():
    p = f'content/articles/{slug}.json'
    d = json.load(open(p))
    hits = 0
    for s in d['sections']:
        body = s.get('body') or {}
        if lg not in body:
            continue
        t = body[lg]
        for a, b in pairs:
            c = t.count(a)
            if c:
                t = t.replace(a, b); hits += c
        body[lg] = t
    if hits:
        open(p, 'w').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
        total += hits
        print(f'{slug} [{lg}] {hits} 处')
print('合计', total, '处')
