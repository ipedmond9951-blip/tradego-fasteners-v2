import json, re, sys, urllib.request, gzip, io
from concurrent.futures import ThreadPoolExecutor
from datetime import date

SITE = "https://www.tradego-fasteners.com"
out = f"logs/seo-ai-pipeline/index-audit-{date.today()}.tsv"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 audit"})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            body = r.read().decode("utf-8", "ignore")
            return r.status, url, body
    except urllib.error.HTTPError as e:
        return e.code, url, ""
    except Exception as e:
        return 0, url, str(e)

sm = urllib.request.urlopen(SITE + "/sitemap.xml", timeout=30).read().decode()
urls = re.findall(r"<loc>(.*?)</loc>", sm)
print("urls", len(urls))

def check(u):
    code, final, body = fetch(u)
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', body)
    title = re.search(r"<title>([^<]*)</title>", body)
    words = len(re.findall(r"\s+", re.sub(r"<[^>]+>", " ", body)))
    return [str(code), u, canon.group(1) if canon else "", str(words), (title.group(1) if title else "")[:90]]

with ThreadPoolExecutor(max_workers=12) as ex:
    rows = list(ex.map(check, urls))

with open(out, "w") as f:
    for r in rows:
        f.write("\t".join(r) + "\n")

from collections import Counter
print(Counter(r[0] for r in rows).most_common())
print("canonical 不一致:", sum(1 for r in rows if r[2] and r[2] != r[1]))
print("正文过短(<400字符):", sum(1 for r in rows if r[0] == "200" and int(r[3]) < 400))
print("写入", out)
