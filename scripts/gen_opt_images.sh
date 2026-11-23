#!/bin/bash
# 生成文章图的优化衍生版：hero(1200x675 webp q66) / thumb(400x225 webp q62)
set -u
cd "$(dirname "$0")/.."
mkdir -p public/images/opt
files=$(ls public/images/articles/*.jpg public/images/articles/*.jpeg public/images/articles/*.png 2>/dev/null)
for f in $files; do
  b=$(basename "$f"); n="${b%.*}"
  hero="public/images/opt/${n}-hero.webp"; thumb="public/images/opt/${n}-thumb.webp"
  if [ -s "$hero" ] && [ -s "$thumb" ]; then continue; fi
  sips -Z 1200 "$f" --out /tmp/_h1.jpg >/dev/null 2>&1 || continue
  sips -c 675 1200 /tmp/_h1.jpg --out /tmp/_h2.jpg >/dev/null 2>&1 || continue
  cwebp -quiet -q 66 /tmp/_h2.jpg -o "$hero" || continue
  sips -Z 400 "$f" --out /tmp/_t1.jpg >/dev/null 2>&1 || continue
  sips -c 225 400 /tmp/_t1.jpg --out /tmp/_t2.jpg >/dev/null 2>&1 || continue
  cwebp -quiet -q 62 /tmp/_t2.jpg -o "$thumb"
done
# 产品图衍生版：thumb 400x300，hero 1200x900
for f in $(ls public/images/products/*.jpg public/images/products/*.jpeg public/images/products/*.png public/images/products/*.webp 2>/dev/null | grep -v -- '-thumb'); do
  b=$(basename "$f"); n="${b%.*}"
  case "$n" in *-thumb|*_thumb) continue;; esac
  hero="public/images/opt/${n}-hero.webp"; thumb="public/images/opt/${n}-thumb.webp"
  [ -s "$hero" ] || { sips -Z 1200 "$f" --out /tmp/_ph1.jpg >/dev/null 2>&1 && sips -c 900 1200 /tmp/_ph1.jpg --out /tmp/_ph2.jpg >/dev/null 2>&1 && cwebp -quiet -q 68 /tmp/_ph2.jpg -o "$hero"; }
  [ -s "$thumb" ] || { sips -Z 400 "$f" --out /tmp/_pt1.jpg >/dev/null 2>&1 && sips -c 300 400 /tmp/_pt1.jpg --out /tmp/_pt2.jpg >/dev/null 2>&1 && cwebp -quiet -q 64 /tmp/_pt2.jpg -o "$thumb"; }
done
rm -f /tmp/_h1.jpg /tmp/_h2.jpg /tmp/_t1.jpg /tmp/_t2.jpg /tmp/_ph1.jpg /tmp/_ph2.jpg /tmp/_pt1.jpg /tmp/_pt2.jpg
echo "done $(ls public/images/opt/*-hero.webp 2>/dev/null | wc -l | tr -d ' ') heroes"

python3 scripts/refresh_opt_manifest.py
