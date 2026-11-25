#!/usr/bin/env python3
"""清理"我方已获认证"类表述（TradeGo 目前无 ISO 9001 / CE / SABS 认证）。

只改"说自家产品已获认证"的说法，改成"按某标准制造 + 随批提供材质证明 / 可按需安排第三方验货"，
不动"客户 / 供应商须持有某认证"这类正常叙述（那是对外要求，不是声称）。
默认只报告，--apply 落盘。
"""
import glob
import json
import sys

PAIRS = [
    # ---- CTA：ISO/EN/ASTM 认证 ----
    ('ISO/EN/ASTM certified fasteners', 'fasteners built to ISO, EN and ASTM standards, with batch-level mill test certificates (EN 10204 3.1)'),
    ('certificados ISO/EN/ASTM', 'fabricados según normas ISO, EN y ASTM, con certificados de colada por lote'),
    ('fixadores certificados ISO/EN/ASTM', 'fixadores fabricados segundo as normas ISO, EN e ASTM, com certificados de colada por lote'),
    ('ISO/EN/ASTM-zertifizierte Befestigungselemente', 'Befestigungselemente nach ISO-, EN- und ASTM-Normen mit Werksprüfzeugnissen je Charge'),
    ('сертифицированные по стандартам ISO/EN/ASTM', 'изготовленные по стандартам ISO, EN и ASTM, с сертификатами плавки на партию'),
    ('经 ISO/EN/ASTM 认证的紧固件', '按 ISO、EN、ASTM 标准制造、随批提供材质证明（EN 10204 3.1）的紧固件'),
    ('ISO/EN/ASTM प्रमाणित फास्टनर', 'ISO, EN और ASTM मानकों पर निर्मित फास्टनर, प्रत्येक बैच के मिल टेस्ट प्रमाणपत्र सहित'),
    ('ISO/EN/ASTM認証を取得した留め具', 'ISO・EN・ASTM規格に基づいて製造し、バッチごとのミルシートを添付した留め具'),
    # ---- CTA：DIN/GB/SABS 认证 ----
    ('DIN, GB, and SABS certified products', 'products made to DIN, GB and SABS dimensional standards, with batch mill test certificates'),
    ('DIN、GB和SABS认证产品', '按 DIN、GB、SABS 尺寸标准制造、随批提供材质证明的产品'),
    ('productos certificados DIN, GB y SABS', 'productos fabricados según las normas dimensionales DIN, GB y SABS, con certificados de fábrica'),
    ('produtos certificados DIN, GB e SABS', 'produtos fabricados segundo as normas dimensionais DIN, GB e SABS, com certificados de fábrica'),
    ('продукцию, сертифицированную по DIN, GB и SABS', 'продукцию, изготовленную по размерным стандартам DIN, GB и SABS, с заводскими сертификатами'),
    ('DIN, GB और SABS प्रमाणित उत्पादों', 'DIN, GB और SABS आयामी मानकों पर निर्मित उत्पाद, मिल टेस्ट प्रमाणपत्रों सहित'),
    ('DIN/ISO certified fasteners', 'fasteners made to DIN and ISO standards'),
    ('DIN/ISO认证紧固件', '按 DIN/ISO 标准制造的紧固件'),
    # ---- 其它"已认证"措辞 ----
    ('Need certified bolts and nuts in bulk?', 'Need bolts and nuts in bulk?'),
    ('需要认证螺栓螺母？', '需要批量螺栓螺母？'),
    ('¿Necesita pernos y tuercas certificados a granel?', '¿Necesita pernos y tuercas a granel?'),
    ('Besoin de boulons et écrous certifiés en vrac ?', 'Besoin de boulons et écrous en vrac ?'),
    ('Benötigen Sie zertifizierte Schrauben und Muttern in Großmengen?', 'Benötigen Sie Schrauben und Muttern in Großmengen?'),
    ('क्या आपको प्रमाणित बोल्ट और नट्स थोक में चाहिए?', 'क्या आपको थोक में बोल्ट और नट्स चाहिए?'),
    ('with certified dimensional accuracy', 'with verified dimensional accuracy'),
    ('尺寸精度认证', '尺寸精度经逐批检验'),
    ('quality-certified fasteners', 'fasteners with full quality documentation'),
    ('质量认证紧固件', '具备完整质量文件的紧固件'),
    ('сертифицированные по качеству крепежи', 'крепеж с полной документацией качества'),
    ('品質認証取得済み締結部品', '品質書類が揃った締結部品'),
    ('qualitätszertifizierte Verbindungselemente', 'Verbindungselemente mit vollständiger Qualitätsdokumentation'),
    ('गुणवत्ता प्रमाणित फास्टनर', 'पूर्ण गुणवत्ता दस्तावेज़ों वाले फास्टनर'),
    # ---- 供应商页描述里的"某标准认证产品" ----
    ('SABS认证的IBR屋顶钉、自钻螺丝和结构螺栓', '符合 SABS 1195 要求的 IBR 屋顶钉、自钻螺丝和结构螺栓，随批提供检验文件'),
    ('SSA/BS认证产品', '可按 SSA/BS 要求供货，随批提供材质证明'),
    ('SABS认证产品', '可按 SABS 要求供货，随批提供材质证明'),
    ('INNOQ认证支持', 'INNOQ 合规文件支持'),
    ('加纳标准局认证产品', '可按加纳标准局（GSA）要求供货'),
    ('SABS合规产品和完整认证支持', '符合 SABS 要求的产品与完整文件支持'),
    ('完全な認証サポート付きでSABS対応製品', 'SABS要求に対応した製品と充実した書類サポート'),
    # ---- 第二轮：正文里"我方持证"的说法（改为"质量体系文件核验 + 逐批材质证明"）----
    ("TradeGo holds ISO 9001:2015 and SABS 1350 certifications", "TradeGo works with mills whose quality systems are documented and supplies SABS 1350 conformity documentation"),
    ("TradeGo cuenta con certificaciones ISO 9001:2015 y SABS 1350", "TradeGo trabaja con fábricas cuyo sistema de calidad está documentado y entrega documentación de conformidad SABS 1350"),
    ("TradeGo dispose des certifications ISO 9001:2015 et SABS 1350", "TradeGo travaille avec des usines dont le système qualité est documenté et fournit la documentation de conformité SABS 1350"),
    ("A TradeGo possui certificações ISO 9001:2015 e SABS 1350", "A TradeGo trabalha com fábricas cujo sistema de qualidade é documentado e entrega documentação de conformidade SABS 1350"),
    ("TradeGo's ISO 9001:2015 certified quality system", "TradeGo's documented quality-control process"),
    ("TradeGo's ISO 9001:2015 certified production", "TradeGo's documented production controls"),
    ("TradeGo's ISO 9001:2015 certified", "TradeGo's documented quality controls"),
    ("TradeGo的ISO 9001:2015认证生产", "TradeGo 经文件核验的生产管控"),
    ("TradeGoのISO 9001:2015認証を受けた生産", "TradeGo の文書で裏付けられた生産管理"),
    ("拥有ISO 9001:2015认证产品", "具备完整的质量文件"),
    ("持有ISO 9001:2015认证", "具备完整的质量文件与逐批材质证明"),
    ("拥有ISO 9001:2015认证", "具备完整的质量文件与逐批材质证明"),
    ("采用ISO 9001:2015认证的质量管理体系", "采用经文件核验的质量管理体系"),
    ("一直保持ISO 9001:2015认证", "持续按 ISO 9001 框架管理质量文件"),
    ("ISO 9001:2015認証を維持しており", "ISO 9001 の枠組みで品質書類を管理しており"),
    ("ISO 9001:2015認証取得済みの製造施設", "品質書類を整備した製造拠点"),
    ("SGSによって検証されたISO 9001:2015認証を保持しています", "ミルシートと第三者検査で品質を逐批検証しています"),
    ("由全球公认的认证机构SGS进行验证", "由第三方检验机构逐批核验"),
    ("SABS認証建築用ファスナー", "SABS 適合書類を伴う建築用ファスナー"),
    ("SABS認証パッケージ", "SABS 適合書類一式"),
    ("SABS認証を初回パスし", "SABS 適合書類を初回で通し"),
    ("同一のSABS認証書類", "同一の SABS 適合書類"),
    ("IBR屋顶钉（SABS 1195认证）", "IBR屋顶钉（符合 SABS 1195，附检验文件）"),
    ("IBR屋顶钉和螺丝（SABS认证）", "IBR屋顶钉和螺丝（符合 SABS 要求，附检验文件）"),
    ("我们向非洲市场供应所有类型的垫圈，包括南非(SABS认证)", "我们向非洲市场供应所有类型的垫圈，南非订单可附 SABS 合规文件"),
    ("可提供SABS认证", "可提供 SABS 合规文件"),
    ("SABS-ready products with full certification support", "SABS-ready products with full documentation support"),

]


def walk_strings(o, path=''):
    if isinstance(o, dict):
        for k, v in o.items():
            yield from walk_strings(v, f'{path}/{k}')
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from walk_strings(v, f'{path}[{i}]')
    elif isinstance(o, str):
        yield path, o


def main():
    apply = '--apply' in sys.argv
    hits = 0
    files = 0
    for p in sorted(glob.glob('content/articles/*.json')):
        raw = open(p).read()
        n = 0
        for old, new in PAIRS:
            if old in raw:
                n += raw.count(old)
                raw = raw.replace(old, new)
        if n:
            files += 1
            hits += n
            if apply:
                open(p, 'w').write(raw)
    print(f"{'已改' if apply else '待改'} {hits} 处，涉及 {files} 篇")
    if not apply:
        print('改动为纯文本替换，--apply 落盘')


if __name__ == '__main__':
    main()
