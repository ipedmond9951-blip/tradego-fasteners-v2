#!/bin/bash
# post-deploy-verify.sh - 上线后逐 URL 复核（只读）
# 用法: bash scripts/post-deploy-verify.sh [--site https://www.tradego-fasteners.com] [--json]
# 输出: 每个 URL 一行结论；有 FAIL 时退出码 1，只有 WARN 时退出码 0。
# 检查项: HTTP 状态 / title 长度 / description 长度 / canonical 自指 / hreflang 数量 /
#         robots 含 max-image-preview:large / 无 meta keywords / JSON-LD 顶层类型
set -uo pipefail

SITE="${SITE:-https://www.tradego-fasteners.com}"
JSON=0
while [ $# -gt 0 ]; do
  case "$1" in
    --site) SITE="$2"; shift 2 ;;
    --json) JSON=1; shift ;;
    *) shift ;;
  esac
done

python3 - "$SITE" "$JSON" <<'PY'
import sys, re, json, urllib.request, urllib.error, html

site = sys.argv[1].rstrip('/')
as_json = sys.argv[2] == "1"

PATHS = [
    ("首页 en", "/en/", {"organization", "localbusiness", "videoobject"}),
    ("首页 zh", "/zh/", {"organization", "localbusiness"}),
    ("FAQ", "/en/faq/", set()),
    ("About", "/en/about/", set()),
    ("Documents", "/en/documents/", set()),
    ("联系页", "/en/contact/", {"localbusiness"}),
    ("产品列表", "/en/products/", set()),
    ("产品详情", "/en/products/self-drilling-screws/", set()),
    ("文章列表", "/en/industry/", set()),
    ("文章详情", "/en/industry/roofing-screws-vs-ibr-nails/", {"article"}),
    ("zh 产品列表", "/zh/products/", set()),
]

UA = {"User-Agent": "Mozilla/5.0 TradeGoPostDeployVerify/1.0"}

def get(url, follow=True):
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k): return None
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers=UA)
    try:
        with opener.open(req, timeout=30) as r:
            return r.status, r.geturl(), r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, url, ""
    except Exception as e:
        return 0, url, str(e)

def meta(html_text, name):
    for pat in (rf'<meta[^>]+name="{name}"[^>]+content="([^"]*)"',
                rf'<meta[^>]+content="([^"]*)"[^>]+name="{name}"'):
        m = re.search(pat, html_text, re.I)
        if m: return html.unescape(m.group(1))
    return None

def prop_meta(html_text, prop):
    for pat in (rf'<meta[^>]+property="{prop}"[^>]+content="([^"]*)"',
                rf'<meta[^>]+content="([^"]*)"[^>]+property="{prop}"'):
        m = re.search(pat, html_text, re.I)
        if m: return html.unescape(m.group(1))
    return None

def ld_types(html_text):
    types = set()
    for m in re.finditer(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', html_text, re.S | re.I):
        raw = m.group(1).strip()
        try:
            data = json.loads(raw)
        except Exception:
            types.add("!invalid-json")
            continue
        items = data if isinstance(data, list) else [data]
        for it in items:
            if not isinstance(it, dict): continue
            g = it.get("@graph")
            if isinstance(g, list):
                for node in g:
                    if isinstance(node, dict) and node.get("@type"):
                        t = node["@type"]
                        types.update(t if isinstance(t, list) else [t])
            if it.get("@type"):
                t = it["@type"]
                types.update(t if isinstance(t, list) else [t])
    return {str(t).lower() for t in types}

results = []
for label, path, expect in PATHS:
    url = site + path
    status, final, body = get(url)
    row = {"label": label, "path": path, "status": status, "fails": [], "warns": []}
    if status != 200 or not body:
        row["fails"].append(f"HTTP {status}")
        results.append(row); continue

    title = re.search(r"<title[^>]*>(.*?)</title>", body, re.S | re.I)
    title = html.unescape(title.group(1).strip()) if title else ""
    desc = meta(body, "description") or prop_meta(body, "og:description") or ""
    canon = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', body, re.I)
    canon = canon.group(1) if canon else ""
    hreflangs = re.findall(r'<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"', body, re.I)
    robots = meta(body, "robots") or ""
    keywords = meta(body, "keywords")
    types = ld_types(body)

    row.update(title=title, desc=desc, canonical=canon,
               hreflang=len(hreflangs), robots=robots, types=sorted(types))

    if not title: row["fails"].append("缺 title")
    elif len(title) > 60: row["fails"].append(f"title {len(title)}>60")
    elif len(title) > 58: row["warns"].append(f"title {len(title)} 接近上限")

    if not desc: row["fails"].append("缺 description")
    elif len(desc) > 155: row["fails"].append(f"desc {len(desc)}>155")
    elif len(desc) < 70: row["warns"].append(f"desc {len(desc)}<70 偏短")

    if not canon: row["fails"].append("缺 canonical")
    else:
        norm = lambda u: u.split("?")[0].rstrip("/")
        if norm(canon) != norm(final): row["fails"].append(f"canonical 不自指: {canon}")

    if row["hreflang"] < 10: row["fails"].append(f"hreflang 仅 {row['hreflang']} 条")
    if "max-image-preview:large" not in robots:
        row["fails"].append("robots 缺 max-image-preview:large")
    if keywords: row["fails"].append("出现 meta keywords（应移除）")
    if "!invalid-json" in types: row["fails"].append("JSON-LD 解析失败")

    for t in expect:
        if t not in types: row["fails"].append(f"缺 {t}")
    if expect and any(t not in expect for t in types if t not in {"website", "breadcrumblist", "organization"}):
        pass  # 允许额外类型，仅记录

    results.append(row)

# /industry/<slug>/ 无前缀必须 308 到 /en/industry/<slug>/
s, final, _ = get(site + "/industry/roofing-screws-vs-ibr-nails/", follow=False)
redirect = {"label": "无前缀 308", "status": s, "fails": [], "warns": [], "location": final}
if s != 308: redirect["fails"].append(f"期望 308，实际 {s}")

if as_json:
    print(json.dumps({"site": site, "results": results, "redirect": redirect}, ensure_ascii=False, indent=1))
    sys.exit(1 if any(r["fails"] for r in results) or redirect["fails"] else 0)

fail_n = warn_n = 0
print(f"🔎 上线后复核 {site}")
print(f"{'页面':<12}{'状态':<6}{'title':>6}{'desc':>6}{'hreflang':>9}  结论")
for r in results:
    st = "FAIL" if r["fails"] else ("WARN" if r["warns"] else "OK")
    fail_n += bool(r["fails"]); warn_n += (not r["fails"] and bool(r["warns"]))
    t = len(r.get("title", "")); d = len(r.get("desc", ""))
    print(f"{r['label']:<12}{r['status']:<6}{t:>6}{d:>6}{r.get('hreflang', 0):>9}  {st}" +
          (f"  ← {'; '.join(r['fails'] + r['warns'])}" if (r['fails'] or r['warns']) else ""))

s = redirect["status"]
print(f"{redirect['label']:<12}{s:<6}{'-':>6}{'-':>6}{'-':>9}  {'OK' if not redirect['fails'] else 'FAIL'}" +
      (f"  ← {'; '.join(redirect['fails'])}" if redirect['fails'] else f"  → {redirect.get('location','')}"))

print(f"\n合计: FAIL {fail_n} / WARN {warn_n} / 共 {len(results)+1} 项")
sys.exit(1 if fail_n or redirect["fails"] else 0)
PY
