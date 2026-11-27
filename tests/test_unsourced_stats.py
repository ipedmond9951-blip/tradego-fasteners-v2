#!/usr/bin/env python3
"""check-unsourced-stats.py 豁免项与 --json 字段稳定性自测。

跑法：python3 tests/test_unsourced_stats.py
每条用例写明输入文本、命中的豁免档与期望计数；另断言结果字典字段稳定。

豁免档（与 scripts/check-unsourced-stats.py 对齐）：
  CTX       工程参数（MPa / mm / core diameter / property class…），不计入统计数字
  OPS       运作事实（时效天数、TEU、整柜吨位）
  ENGG      工程性能（capacity / strength / lifespan / clamp / engagement…）
  OWN       自有评分权重 / 付款条款（scorecard / weighted / deposit / T/T…）
  STATUTE   章节锚定法规 + 法定费率（Tariff Notice / VAT Act… 下的税率）
  PARA_SRC  同一段内已有来源线索，整段数字视为段落归属
"""
import importlib.util
import os
import sys

_HERE = os.path.dirname(__file__)
_spec = importlib.util.spec_from_file_location(
    "check_unsourced_stats",
    os.path.join(_HERE, "..", "scripts", "check-unsourced-stats.py"))
u = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(u)


def doc(sections, slug="selftest", ds=None):
    return {"slug": slug, "sections": sections, "dataSource": ds or []}


def sec(body, locale="en"):
    return {"body": {locale: body}}


CASES = [
    # (名称, 文章 dict, 期望 unsourced, 期望豁免档计数说明)
    ("CTX 工程参数不计无源",
     doc([sec("Engagement drops 12% when the core diameter is undersized; proof load 310 MPa.")]),
     0, "CTX"),
    ("OPS 航线时效/TEU/吨位另计",
     doc([sec("Transit takes 22-35 days; the vessel carries 360 TEU; payload 24 tonnes net per container.")]),
     0, "OPS"),
    ("ENGG 工程性能比例另计",
     doc([sec("Bolt capacity supports a 25% clamp load increase over the service lifespan.")]),
     0, "ENGG"),
    ("OWN 评分权重/付款条款另计",
     doc([sec("Scorecard weighted metrics: 60% weight on delivery; deposit 30% before shipment, T/T balance.")]),
     0, "OWN"),
    ("STATUTE 法规锚定的法定费率另计",
     doc([sec("The Customs and Excise Tariff Notice sets import duty at 5% and VAT 15% on CIF.")]),
     0, "STATUTE"),
    ("PARA_SRC 段落内单次归属覆盖同段数字",
     doc([sec("<p>According to ISO 898-1, tensile requirements are listed. Material selection follows the same standard. The 12% elongation floor and 90% proof load are cited in the table.</p>")]),
     0, "PARA_SRC"),
    ("正例：无出处市场统计必须报",
     doc([sec("The Africa fastener market will grow 12% by 2030, reaching a $4.2B opportunity.")]),
     1, None),
]


def main():
    fails = []
    for name, d, expect_unsourced, bucket in CASES:
        r = u.audit_document(d, "en")
        ok = r["unsourced"] == expect_unsourced
        extra = ""
        if bucket == "OPS":
            ok = ok and r["ops"] >= 1
            extra = f"ops={r['ops']}"
        elif bucket == "ENGG":
            ok = ok and r["ops"] >= 1
            extra = f"ops={r['ops']}"
        elif bucket == "OWN":
            ok = ok and r["ops"] >= 1
            extra = f"ops={r['ops']}"
        elif bucket == "STATUTE":
            ok = ok and r["statutory"] >= 1
            extra = f"statutory={r['statutory']}"
        elif bucket == "PARA_SRC":
            ok = ok and r["para_sourced"] >= 1
            extra = f"para_sourced={r['para_sourced']}"
        status = "PASS" if ok else "FAIL"
        print(f"  [{status}] {name}  unsourced={r['unsourced']} {extra}")
        if not ok:
            fails.append(name)

    # --json 字段稳定性：顶层与条目字段必须存在且命名不变
    r = u.audit_document(doc([sec("Market grows 8% annually.")]), "en")
    top_keys = {"slug", "stats", "unsourced", "ops", "statutory",
                "para_sourced", "hasDataSource", "items"}
    if set(r.keys()) != top_keys:
        fails.append(f"json 顶层字段漂移: {sorted(r.keys())}")
        print(f"  [FAIL] json 顶层字段: {sorted(r.keys())}")
    else:
        print("  [PASS] --json 顶层字段稳定")
    if r["items"]:
        item_keys = {"section", "stat", "sentence"}
        if set(r["items"][0].keys()) != item_keys:
            fails.append("json 条目字段漂移")
            print(f"  [FAIL] json 条目字段: {sorted(r['items'][0].keys())}")
        else:
            print("  [PASS] --json 条目字段稳定")

    print(f"\n自测：{len(CASES)} 条用例；" + ("全部通过 ✅" if not fails else "失败：" + ", ".join(fails)))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
