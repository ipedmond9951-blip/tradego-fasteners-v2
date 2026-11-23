import re, sys, urllib.request

SITE = "https://www.tradego-fasteners.com"

def fetch_bytes(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Mobile/15E148", "Accept-Encoding": "br, gzip"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return len(r.read()), r.headers.get("Content-Encoding")

def page_report(path):
    req = urllib.request.Request(SITE + path, headers={"User-Agent": "Mozilla/5.0 (iPhone)", "Accept-Encoding": "br, gzip"})
    with urllib.request.urlopen(req, timeout=30) as r:
        html_bytes = len(r.read())
    req2 = urllib.request.Request(SITE + path, headers={"User-Agent": "Mozilla/5.0 (iPhone)"})
    with urllib.request.urlopen(req2, timeout=30) as r:
        body = r.read().decode("utf-8", "ignore")
    js = sorted(set(re.findall(r'/_next/static/[^"\']+\.js', body)))
    css = sorted(set(re.findall(r'/_next/static/[^"\']+\.css', body)))
    imgs = sorted(set(re.findall(r'/images/[^"\')\s]+?\.(?:jpg|jpeg|png|webp)', body)))
    jsb = sum(fetch_bytes(SITE + p)[0] for p in js)
    cssb = sum(fetch_bytes(SITE + p)[0] for p in css)
    img = [(i, fetch_bytes(SITE + i)[0]) for i in imgs]
    imgb = sum(b for _, b in img)
    print(f"{path}\n  html {html_bytes/1024:.0f}KB | js {len(js)}× {jsb/1024:.0f}KB | css {cssb/1024:.0f}KB | img {len(imgs)}× {imgb/1024:.0f}KB | TOTAL {(html_bytes+jsb+cssb+imgb)/1024:.0f}KB")
    for i, b in sorted(img, key=lambda x: -x[1])[:5]:
        print(f"    {b/1024:6.0f}KB {i}")
    for p in js:
        n = fetch_bytes(SITE + p)[0]
        if n > 60000:
            print(f"    js {n/1024:5.0f}KB {p.rsplit('/',1)[-1]}")

for p in sys.argv[1:] or ["/en/"]:
    page_report(p)
