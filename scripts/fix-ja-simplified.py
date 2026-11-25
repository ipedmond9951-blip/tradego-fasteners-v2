#!/usr/bin/env python3
"""日语正文字形归一：把混进 ja 字段里的简体汉字改成对应的日文汉字。

背景：本地化管线拿中文原文机翻成日文时，字被原样带过去（设/确/标/对/场/时/质/应…），
日文读者一眼能看出不对。这些简体字与日文汉字基本是一对一的同义映射，所以按字表替换是安全的。

默认只报告，--apply 才落盘。映射表刻意只收「无歧义」的字，模棱两可的（干/只/划/系/台/叶/松/面）不收。
"""
import argparse
import glob
import json

MAP = {
    "对": "対", "设": "設", "确": "確", "规": "規", "标": "標", "须": "須", "择": "択",
    "说": "説", "见": "見", "认": "認", "质": "質", "议": "議", "场": "場", "时": "時",
    "术": "術", "剂": "剤", "类": "類", "让": "譲", "应": "応", "级": "級", "观": "観",
    "问": "問", "值": "値", "专": "専", "门": "門", "钱": "銭", "财": "財", "单": "単",
    "备": "備", "达": "達", "边": "辺", "压": "圧", "击": "撃", "权": "権", "势": "勢",
    "环": "環", "济": "済", "义": "義", "处": "処", "费": "費", "责": "責", "购": "購",
    "资": "資", "货": "貨", "运": "運", "输": "輸", "华": "華", "页": "頁", "题": "題",
    "图": "図", "电": "電", "线": "線", "网": "網", "络": "絡", "关": "関", "开": "開",
    "发": "発", "现": "現", "实": "実", "际": "際", "检": "検", "测": "測", "试": "試",
    "验": "験", "证": "証", "许": "許", "诺": "諾", "额": "額", "币": "幣", "汇": "匯",
    "库": "庫", "张": "張", "层": "層", "显": "顕", "优": "優", "产": "産", "业": "業",
    "员": "員", "团": "団", "队": "隊", "长": "長", "间": "間", "阳": "陽", "阴": "陰",
    "无": "無", "为": "為", "东": "東", "车": "車", "动": "動", "变": "変", "带": "帯",
    "头": "頭", "买": "買", "卖": "売", "贵": "貴", "铁": "鉄", "钢": "鋼", "铜": "銅",
}

SKIP_FILES = set()


def norm(text):
    hits = {}
    out = []
    for ch in text:
        rep = MAP.get(ch)
        if rep:
            hits[ch] = hits.get(ch, 0) + 1
            out.append(rep)
        else:
            out.append(ch)
    return "".join(out), hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--show", type=int, default=0, help="打印前 N 条改动前后片段")
    args = ap.parse_args()

    total_fields = 0
    total_chars = 0
    char_stat = {}
    touched_files = []
    samples = []
    for path in sorted(glob.glob("content/articles/*.json")):
        art = json.load(open(path))
        slug = art.get("slug") or path.split("/")[-1][:-5]
        if slug in SKIP_FILES:
            continue
        changed = False
        for s in art.get("sections", []):
            for key in ("heading", "body"):
                val = s.get(key)
                if not isinstance(val, dict) or not val.get("ja"):
                    continue
                new, hits = norm(val["ja"])
                if not hits:
                    continue
                total_fields += 1
                total_chars += sum(hits.values())
                for k, v in hits.items():
                    char_stat[k] = char_stat.get(k, 0) + v
                if len(samples) < args.show:
                    for ch in hits:
                        i = val["ja"].find(ch)
                        samples.append((slug, key, val["ja"][max(0, i - 30):i + 30].replace("\n", " "),
                                        new[max(0, i - 30):i + 30].replace("\n", " ")))
                        break
                val["ja"] = new
                changed = True
            # faq 里的问答也可能带简体字
            for q in s.get("faqItems", []) or []:
                for fld in ("q", "a"):
                    if isinstance(q.get(fld), dict) and q[fld].get("ja"):
                        new, hits = norm(q[fld]["ja"])
                        if hits:
                            total_fields += 1
                            total_chars += sum(hits.values())
                            for k, v in hits.items():
                                char_stat[k] = char_stat.get(k, 0) + v
                            q[fld]["ja"] = new
                            changed = True
        if changed:
            touched_files.append(path)
            if args.apply:
                open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")

    print("字段数 %d，替换字数 %d，涉及文章 %d 篇" % (total_fields, total_chars, len(touched_files)))
    print("高频字：", ", ".join("%s→%s×%d" % (k, MAP[k], v) for k, v in sorted(char_stat.items(), key=lambda x: -x[1])[:20]))
    for s in samples:
        print("---", s[0], s[1])
        print("  旧:", s[2])
        print("  新:", s[3])
    if not args.apply:
        print("（只报告，加 --apply 落盘）")


if __name__ == "__main__":
    main()
