#!/usr/bin/env python3
"""日语正文第二轮：残留中文虚词/词序修正 + 一段整句中文改写。

第一轮（fix-ja-chinese-words.py）清掉的是中文名词（港口/价格/成本）。
这一轮清的是：中文虚词与搭配（这些/有什么区别/请求/过程中/可靠性）、
以及某个 ja 字段里**整句中文**（赞比亚案例 §5 的公司介绍段）。
"""
import json

ZAMBIA_CN = ("我们的服务包括全面的技術支持、規格確認、品質控制和合規性文档准備。我们理解矿業作業的严格要求，"
             "可能提供适合极端環境和重负荷応用的専用紧固件解决方案。無论您是在規划新的采矿プロジェクト还是需要"
             "為現有運营提供持续的紧固件供応，我们的団隊都可能帮助您優化采購策略、控制コスト并確保按時納品。")
ZAMBIA_JA = ("当社のサービスは、総合的な技術サポート、規格確認、品質管理、適合書類の準備をカバーしています。"
             "当社は鉱業作業の厳しい要件を理解しており、過酷な環境や高荷重用途に適した専用ファスナーソリューションを提供できます。"
             "新規の鉱山プロジェクトを計画している場合でも、既存の操業に継続的なファスナー供給が必要な場合でも、"
             "当社のチームは調達戦略の最適化、コスト管理、納期どおりの納品を支援します。")

# 精确片段替换（全文生效，命中即换）
EXACT = [
    ("这些赤信号", "これらの赤信号"),
    ("这些問題", "これらの問題"),
    ("有什么区别", "違いは何ですか"),
    ("请求し", "要請し"),
    ("请求へ", "要請へ"),
    ("获取过程中的", "取得過程での"),
    ("可靠性", "信頼性"),
    ("船舱の", "船腹の"),
    ("単个", "単一"),
    ("个コンテナ", "個コンテナ"),
]

# 单字替换（安全：这些字在日文里只作部件，不作独立用字）
CHARS = {"给": "給", "个": "個"}


def main():
    import glob
    hits = 0
    files = set()
    for path in sorted(glob.glob("content/articles/*.json")):
        art = json.load(open(path))
        dirty = False
        fields = []
        for s in art.get("sections", []):
            for key in ("heading", "body"):
                if isinstance(s.get(key), dict) and s[key].get("ja"):
                    fields.append(s[key])
            for q in s.get("faqItems", []) or []:
                for fld in ("q", "a"):
                    if isinstance(q.get(fld), dict) and q[fld].get("ja"):
                        fields.append(q[fld])
        for d in fields:
            t = d["ja"]
            if ZAMBIA_CN in t:
                t = t.replace(ZAMBIA_CN, ZAMBIA_JA)
                hits += 1
                dirty = True
            for bad, good in EXACT:
                if bad in t:
                    hits += t.count(bad)
                    t = t.replace(bad, good)
                    dirty = True
            for bad, good in CHARS.items():
                if bad in t:
                    hits += t.count(bad)
                    t = t.replace(bad, good)
                    dirty = True
            d["ja"] = t
        if dirty:
            files.add(path)
            open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
    print("修正 %d 处 / %d 篇" % (hits, len(files)))


if __name__ == "__main__":
    main()
