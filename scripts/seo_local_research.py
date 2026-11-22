#!/usr/bin/env python3
"""采集目标市场的本地信息与行业热点，供 SEO 流水线选题/写文使用。

来源（全部公开 RSS，失败即跳过，不阻塞流水线）：
- Google News RSS：按 国家 + 行业词 搜索近 7 天新闻
- Google Trends RSS：目标国家的当日热搜
- 行业媒体 RSS：紧固件/建筑/矿业类站点

输出：content/trends/<YYYY-MM-DD>.json
{
  "date": "...",
  "items": [{"geo","country","source","title","url","published","query","lang"}],
  "trends": [{"geo","title","url"}],
  "keywords": [{"term","score"}]
}
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import datetime, timezone

UA = "Mozilla/5.0 (compatible; TradeGoResearchBot/1.0)"
TIMEOUT = 25

# 目标市场：站点的 10 种语言 + 主要出口区域
MARKETS = [
    ("ZA", "South Africa", "en-ZA", "ZA:en"),
    ("NG", "Nigeria", "en-NG", "NG:en"),
    ("KE", "Kenya", "en-KE", "KE:en"),
    ("EG", "Egypt", "en-EG", "EG:en"),
    ("AE", "United Arab Emirates", "en-AE", "AE:en"),
    ("SA", "Saudi Arabia", "en-SA", "SA:en"),
    ("BR", "Brazil", "pt-BR", "BR:pt"),
    ("MX", "Mexico", "es-419", "MX:es-419"),
    ("IN", "India", "en-IN", "IN:en"),
    ("US", "United States", "en-US", "US:en"),
]

QUERIES = [
    "fastener OR fasteners OR bolts OR screws",
    "steel construction OR infrastructure project",
    "import tariff OR customs duty steel",
    "mining OR solar OR port construction",
]

COUNTRY_HINTS = {
    "South Africa": ["south africa", "johannesburg", "cape town", "durban", "pretoria", "sadc", "eskom", "transnet"],
    "Nigeria": ["nigeria", "lagos", "abuja", "nigerian"],
    "Kenya": ["kenya", "nairobi", "mombasa", "kenyan"],
    "Egypt": ["egypt", "cairo", "alexandria", "suez", "egyptian"],
    "United Arab Emirates": ["uae", "emirates", "dubai", "abu dhabi", "sharjah"],
    "Saudi Arabia": ["saudi", "riyadh", "jeddah", "neom", "aramco"],
    "Brazil": ["brazil", "brasil", "são paulo", "sao paulo", "brasília"],
    "Mexico": ["mexico", "méxico", "monterrey", "ciudad de mexico"],
    "India": ["india", "mumbai", "delhi", "chennai", "gujarat", "indian"],
    "United States": ["united states", "u.s.", " america", "texas", "california"],
}

# 消费电子/无关语境：标题含这些词且无工程/建筑语境的丢弃
OFFTOPIC = ("apple", "iphone", "ipad", "laptop", "teardown", "homeview", "smartphone", "gaming", "console", "headphone",
            "mountain lion", "wildlife", "zoo", "escaped animal", "tokenization", "crypto", "bitcoin", "election", "football", "celebrity")

TRENDS_RSS = "https://trends.google.com/trending/rss?geo={geo}"

INDUSTRY_FEEDS = [
    ("Fastener + Fixing Magazine", "https://www.fastenerandfixing.com/feed/"),
    ("Construction Review Online", "https://constructionreviewonline.com/feed/"),
    ("Engineering News ZA", "https://www.engineeringnews.co.za/rss"),
    ("Reuters Africa", "https://www.reutersagency.com/feed/?best-topics=africa&post_type=best"),
]

LEXICON = [
    "fastener", "fasteners", "bolt", "bolts", "screw", "screws", "nut", "nuts",
    "washer", "washers", "anchor", "anchors", "stud", "studs", "thread",
    "steel", "stainless", "galvanized", "galvanised", "corrosion", "coating",
    "zinc", "hdg", "roofing", "cladding", "construction", "infrastructure",
    "mining", "solar", "wind", "rail", "railway", "port", "pipeline", "bridge",
    "tariff", "duty", "import", "customs", "standard", "astm", "iso", "sabs",
    "en", "grade", "torque", "tension", "procurement", "supplier", "wholesale",
]

STOPWORDS = {
    "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "at", "by",
    "with", "from", "as", "is", "are", "be", "was", "were", "this", "that",
    "its", "it", "after", "before", "over", "under", "new", "says", "say",
    "amid", "into", "up", "down", "out", "how", "why", "what", "when", "where",
    "will", "can", "may", "not", "no", "more", "less", "than", "about",
}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.read()


def parse_rss(xml_bytes, limit=20):
    out = []
    try:
        root = ET.fromstring(xml_bytes)
    except Exception:
        return out
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub = (item.findtext("pubDate") or "").strip()
        src = (item.findtext("source") or "").strip()
        if not title or not link:
            continue
        out.append({"title": title, "url": link, "published": pub, "source": src})
        if len(out) >= limit:
            break
    return out


def news_url(query, hl, ceid, country=""):
    q = urllib.parse.quote(f"{query} {country}".strip())
    return f"https://news.google.com/rss/search?q={q}+when:7d&hl={hl}&gl={hl.split('-')[-1]}&ceid={ceid}"


def collect():
    items, trends, errors = [], [], []

    for geo, country, hl, ceid in MARKETS:
        for q in QUERIES:
            if len(items) >= 120:
                break
            url = news_url(q, hl, ceid, country)
            try:
                for row in parse_rss(fetch(url), limit=6):
                    row.update({"geo": geo, "country": country, "query": q, "lang": hl})
                    items.append(row)
            except Exception as e:  # noqa: BLE001
                errors.append(f"news {geo} {q[:20]}: {e}")
            time.sleep(0.4)

    for geo, country, hl, ceid in MARKETS[:6]:
        try:
            for row in parse_rss(fetch(TRENDS_RSS.format(geo=geo)), limit=12):
                row.update({"geo": geo, "country": country})
                trends.append(row)
        except Exception as e:  # noqa: BLE001
            errors.append(f"trends {geo}: {e}")

    for name, url in INDUSTRY_FEEDS:
        try:
            for row in parse_rss(fetch(url), limit=12):
                row.update({"geo": "GL", "country": "Global", "query": "industry", "lang": "en", "source": name})
                items.append(row)
        except Exception as e:  # noqa: BLE001
            errors.append(f"feed {name}: {e}")

    # 相关性过滤：标题里行业词命中 <2 且不含强行业词的，视为噪声（如 "turns the screws on" 这类比喻）
    strong = ("fastener", "bolt", "anchor", "steel", "galvaniz", "galvanis", "roofing", "torque")
    idiom = ("turns the screws", "tightening the screws", "tighten screws", "tightens screws", "screws on", "screw over")
    engineering = ("construction", "infrastructure", "project", "plant", "port", "mine", "mining", "solar", "rail", "bridge", "steel", "factory", "building", "energy", "water", "housing")
    def relevant(title):
        t = title.lower()
        if any(x in t for x in idiom):
            return False
        if any(x in t for x in OFFTOPIC):
            return False
        hits = sum(1 for lx in LEXICON if lx in t)
        if hits >= 2:
            return True
        # 单个强行业词必须同时带工程语境，排除 "mountain lion bolts" 这类同名误命中
        if any(x in t for x in strong):
            return any(x in t for x in engineering)
        return False

    items = [r for r in items if relevant(r["title"])]

    # 本地性过滤：国家栏目标签必须能在标题/摘要里找到本地线索，否则说明是 Google News 的全球串稿
    engineering = ("construction", "infrastructure", "project", "plant", "port", "mine", "mining", "solar", "rail", "bridge", "steel", "factory")
    def is_local(row):
        if row.get("country") == "Global":
            return True
        text = (row["title"] + " " + row.get("summary", "")).lower()
        hints = COUNTRY_HINTS.get(row["country"], [])
        if not any(h in text for h in hints):
            return False
        if any(x in text for x in OFFTOPIC) and not any(x in text for x in engineering):
            return False
        return True

    # 找不到本地线索的不丢，改为 Global 行业素材，避免误标国家
    for r in items:
        if not is_local(r):
            r["country_original"] = r.get("country")
            r["country"] = "Global"
            r["geo"] = "GL"

    # Google Trends 是全国泛热榜（体育/娱乐噪声多），只保留与本行业相关的
    trends = [t for t in trends if relevant(t["title"])]

    word_re = re.compile(r"[A-Za-z][A-Za-z\-]{2,}")
    counter = Counter()
    for row in items + trends:
        for w in word_re.findall(row["title"]):
            wl = w.lower().strip("-")
            if wl in STOPWORDS or len(wl) < 3:
                continue
            if any(lx in wl for lx in LEXICON):
                counter[wl] += 1
    keywords = [{"term": t, "score": c} for t, c in counter.most_common(25)]

    return {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "items": items,
        "trends": trends,
        "keywords": keywords,
        "relabeled_global": sum(1 for r in items if r.get("country_original")),
        "errors": errors[:10],
    }


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else "content/trends/%s.json" % datetime.now().strftime("%Y-%m-%d")
    data = collect()
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(json.dumps({
        "path": out_path,
        "items": len(data["items"]),
        "trends": len(data["trends"]),
        "keywords": data["keywords"][:10],
        "errors": data["errors"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
