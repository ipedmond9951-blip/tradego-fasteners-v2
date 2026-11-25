#!/usr/bin/env python3
"""日语正文里的中文词归一日文词。

字形归一（fix-ja-simplified.py）只解决了「简体字」这一层；这一层是**词**：
汉字都是日文能用的，但组起来是中文词，日文读者一眼看出是机翻残留。

例：港口→港、价格→価格、成本→コスト、以及→および、因此→したがって、
客户→顧客、可以→可能、成本、批次→ロット、验货→検品、清关→通関、
商业送状→商業送り状、快速道路→高速道路、考量事项→検討事項、牵引→牽引。

默认只报告（打印各词出现次数），--apply 才落盘。
"""
import argparse
import glob
import json

WORDS = {
    # 名词类
    "港口": "港",
    "价格": "価格",
    "成本": "コスト",
    "客户": "顧客",
    "项目": "プロジェクト",
    "分销": "流通",
    "零售商": "小売業者",
    "批次": "ロット",
    "报价单": "見積書",
    "报价": "見積",
    "交货期": "納期",
    "交货": "納品",
    "交付": "納品",
    "付款方式": "支払条件",
    "付款": "支払い",
    "技术支持": "技術サポート",
    "售后服务": "アフターサービス",
    "质量问题": "品質上の問題",
    "涂层": "コーティング",
    "优惠": "割引",
    "运费": "運賃",
    "验货": "検品",
    "清关": "通関",
    "报关": "通関申告",
    "商业送状": "商業送り状",
    "快速道路": "高速道路",
    "考量事项": "検討事項",
    "牵引": "牽引",
    "短板": "弱点",
    "缺口": "不足分",
    "落地": "実施",
    "把控": "管理",
    "梳理": "整理",
    "拉通": "整合",
    "对齐": "整合",
    # 连词/副词类
    "以及": "および",
    "因此": "したがって",
    "可以": "可能",
    "但是": "ただし",
    "由于": "〜のために",
    "根据": "〜に基づき",
    # 邻接修正（替换后常见的重复）
    "港港口": "港",
    "価格价格": "価格",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    stat = {}
    total = 0
    files = set()
    for path in sorted(glob.glob("content/articles/*.json")):
        art = json.load(open(path))
        dirty = False
        for s in art.get("sections", []):
            for key in ("heading", "body"):
                d = s.get(key)
                if not isinstance(d, dict) or not d.get("ja"):
                    continue
                t = d["ja"]
                for bad, good in WORDS.items():
                    n = t.count(bad)
                    if not n:
                        continue
                    t = t.replace(bad, good)
                    stat[bad] = stat.get(bad, 0) + n
                    total += n
                    dirty = True
                d["ja"] = t
            for q in s.get("faqItems", []) or []:
                for fld in ("q", "a"):
                    if isinstance(q.get(fld), dict) and q[fld].get("ja"):
                        t = q[fld]["ja"]
                        for bad, good in WORDS.items():
                            n = t.count(bad)
                            if not n:
                                continue
                            t = t.replace(bad, good)
                            stat[bad] = stat.get(bad, 0) + n
                            total += n
                            dirty = True
                        q[fld]["ja"] = t
        if dirty:
            files.add(path)
            if args.apply:
                open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
    print("命中 %d 处 / %d 篇" % (total, len(files)))
    print("明细：", ", ".join("%s×%d" % (k, v) for k, v in sorted(stat.items(), key=lambda x: -x[1])))
    if not args.apply:
        print("（只报告，加 --apply 落盘）")


if __name__ == "__main__":
    main()
