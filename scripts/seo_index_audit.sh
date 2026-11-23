#!/bin/bash
# 索引审计：对 sitemap 全量 URL 做状态码与 canonical 检查，只产出报告，不改站点
set -u
OUT=${OUT:-logs/seo-ai-pipeline/index-audit-$(date +%Y-%m-%d).tsv}
mkdir -p "$(dirname "$OUT")"
curl -s https://www.tradego-fasteners.com/sitemap.xml \
  | grep -o "<loc>[^<]*</loc>" | sed 's/<loc>//;s/<\/loc>//' > /tmp/sitemap-urls.txt
echo "URLs: $(wc -l < /tmp/sitemap-urls.txt)"
: > "$OUT"
cat /tmp/sitemap-urls.txt | xargs -P 12 -I{} bash -c '
u="{}"
code=$(curl -s -o /tmp/body_$$.html -w "%{http_code}" -L --max-time 25 "$u")
canon=$(grep -o "<link rel=\"canonical\" href=\"[^\"]*\"" /tmp/body_$$.html | head -1 | sed "s/.*href=\"//;s/\"//")
title=$(grep -o "<title>[^<]*</title>" /tmp/body_$$.html | head -1 | sed "s/<title>//;s/<\/title>//")
words=$(grep -o "<p" /tmp/body_$$.html | wc -l | tr -d " ")
echo -e "$code\t$u\t$canon\t$words"
rm -f /tmp/body_$$.html
' >> "$OUT"
echo done
awk -F'\t' '{print $1}' "$OUT" | sort | uniq -c | sort -rn
# canonical 与自身不一致
awk -F'\t' '$3!="" && $3!=$2 {print}' "$OUT" | wc -l
