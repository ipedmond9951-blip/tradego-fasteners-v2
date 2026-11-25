#!/usr/bin/env python3
"""逐条改写：本地语正文里夹的成句中文/日文/韩文（按"起止标记"整段替换，fail-closed）。

不用"整段删除"——那会丢内容、断小节编号（2026-11-25 已在肯尼亚篇踩过）。

用法：python3 scripts/oneoff-stray-cjk-batch.py [--apply]
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content", "articles")

# (slug, section, field, lang, 起始标记, 结束标记(含), 替换文本)
CASES = [
    # 肯尼亚篇阿拉伯语 §4：中文夹句（含仓库信息，必须保留语义）
    ("kenya-infrastructure-fastener-demand", 4, "body", "ar",
     ").，确认供应商的当前库存状况",
     "关键现场需求。",
     "). تحقّق من المخزون الحالي ومدة الإنتاج لدى المورد قبل توقيع عقد التوريد. "
     "تحتفظ TradeGo بأكثر من 800 طن متري من وحدات SKU المطلوبة في كينيا في مستودعي شنتشن ومومباسا، "
     "مع قدرة على الإرسال العاجل لتلبية احتياجات المواقع الحرجة."),
    # 包装篇葡语 §5：中文夹句（进口许可与提前规划）
    ("fastener-packaging-shipping-guide", 5, "body", "pt",
     "Adicionalmente,，某些非洲国家",
     "需要提前规划。",
     "Além disso, alguns países africanos podem exigir licença de importação ou autorização prévia "
     "para produtos específicos, o que afeta o prazo de entrega e exige planejamento antecipado."),
    # 南非案例篇英文 §3：日文整句（出货前检验文件与 SABS 文件）
    ("south-africa-fastener-market-case-study", 3, "body", "en",
     "TradeGo は出荷前に、",
     "取得を手配します。",
     "Before shipment, TradeGo prepares the inspection documents, including tensile test reports and "
     "coating thickness measurements, and arranges SABS approval documents where the project requires them."),
    # 津巴布韦锚栓篇阿拉伯语 §0：俄语词 + 中文夹句
    ("zim-construction-anchor-bolts-supplier-evaluation-corrosion-resistance", 0, "body", "ar",
     "للظروف требовательны في زيمبابوي",
     "المشتريات程序.",
     "للظروف القاسية في زيمبابوي، ويغطي المعايير ومعايير الموردين وأنظمة الطلاء "
     "ومشهد الموردين الإقليمي وإجراءات الشراء خطوة بخطوة."),
    # 津巴布韦锚栓篇阿拉伯语 §4：中文夹句（肯尼亚供应商对内陆交付竞争力）
    ("zim-construction-anchor-bolts-supplier-evaluation-corrosion-resistance", 4, "body", "ar",
     "أسواق شرق أفريقيا，但他们对津巴布韦",
     "竞争力较低.",
     "أسواق شرق أفريقيا، لكن قدرتها التنافسية على التسليم إلى داخل زيمبابوي أقل."),
    # 津巴布韦螺栓篇葡语 §7：中文夹句（第三方审计）
    ("zimbabwe-bolts-screws-b2b-construction-exports-2026", 7, "body", "pt",
     "e委托terceiros机构进行供应商审计",
     "auditoria de fornecedores)",
     "e contratar terceiros para auditoria de fornecedores"),
    # 哈拉雷篇印地语 §5：日文/韩文成本段
    ("harare-fastener-distributor-supplier-guide", 5, "body", "hi",
     "典型的な輸入コスト:",
     "육상 운송 (800-1,500 USD).",
     "विशिष्ट आयात लागत: FOB फैक्टरी मूल्य (700-1,000 USD/टन), समुद्री मालभाड़ा (1,500-3,000 USD), "
     "बीमा (1-2%), सीमा शुल्क (20-40%), बंदरगाह हैंडलिंग (500-1,500 USD), अंतर्देशीय परिवहन (800-1,500 USD)"),
]


def main():
    do_apply = "--apply" in sys.argv
    hits = 0
    for slug, sec, field, lang, start, end, new in CASES:
        f = os.path.join(ART, slug + ".json")
        d = json.load(open(f, encoding="utf-8"))
        txt = d["sections"][sec][field][lang]
        i = txt.find(start)
        if i < 0:
            if new[:30] in txt:
                print(f"  · 已应用 {slug} §{sec} {field}.{lang}")
                hits += 1
                continue
            print(f"❌ 找不到起始标记：{slug} §{sec} {field}.{lang} :: {start[:40]}")
            sys.exit(1)
        j = txt.find(end, i)
        if j < 0:
            print(f"❌ 找不到结束标记：{slug} §{sec} {field}.{lang} :: {end}")
            sys.exit(1)
        j += len(end)
        d["sections"][sec][field][lang] = txt[:i] + new + txt[j:]
        hits += 1
        print(f"✓ {slug} §{sec} {field}.{lang} 替换 {j - i} 字符 → {len(new)}")
        if do_apply:
            open(f, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
    print(f"共 {hits}/{len(CASES)} 条{'（已落盘）' if do_apply else '（报告模式）'}")


if __name__ == "__main__":
    main()
