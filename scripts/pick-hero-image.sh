#!/bin/bash
# pick-hero-image.sh - 给新文章挑一张已有图库里的配图 (2026-11-22)
#
# 背景: 配图 API (MiniMax) 已不可用, 原来每篇文章都 copy 同一张 africa-1.jpg,
#       站内出现大量重复首图. 改为按主题关键词从 public/images/articles 里挑最贴近的一张,
#       并避开最近 20 篇文章已经用过的图.
#
# 用法: pick-hero-image.sh "<topic>" "<slug>" "<dest.jpg>"
# 输出: 成功打印选中图片名, exit 0; 找不到退化为随机一张, 仍 exit 0

set +e
TOPIC="$1"
SLUG="$2"
DEST="$3"

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LIB="$PROJECT_DIR/public/images/articles"

if [ -z "$TOPIC" ] || [ -z "$DEST" ]; then
    echo "[error] usage: pick-hero-image.sh '<topic>' '<slug>' '<dest.jpg>'" >&2
    exit 1
fi

PICKED=$(python3 - "$TOPIC" "$SLUG" "$LIB" "$PROJECT_DIR" <<'PY'
import glob, json, os, random, re, sys

topic, slug, lib, project = sys.argv[1:5]
STOP = {"the", "and", "for", "with", "from", "guide", "market", "fastener", "fasteners",
        "bolt", "bolts", "sourcing", "supply", "specification", "procurement", "import",
        "export", "industrial", "complete", "overview", "analysis", "requirements"}
tokens = [t for t in re.findall(r"[a-z0-9]+", topic.lower()) if len(t) >= 3 and t not in STOP]
if not tokens:
    tokens = ["fastener"]

# 最近 20 篇文章用过的图, 避免重复
recent = []
files = sorted(glob.glob(os.path.join(project, "content", "articles", "*.json")),
               key=os.path.getmtime, reverse=True)[:20]
for f in files:
    try:
        img = json.load(open(f, encoding="utf-8")).get("image", "")
        recent.append(os.path.basename(img))
    except Exception:
        pass

cands = [p for p in glob.glob(os.path.join(lib, "*"))
         if os.path.splitext(p)[1].lower() in {".jpg", ".jpeg", ".png", ".webp"}]
if not cands:
    sys.exit(1)

# 通用占位图(全站曾被复制成多份)先排除, 避免新文章又拿到同一张
import hashlib
def digest(path):
    with open(path, "rb") as fh:
        return hashlib.md5(fh.read()).hexdigest()

placeholder = os.path.join(lib, "africa-1.jpg")
ph_hash = digest(placeholder) if os.path.exists(placeholder) else None
if ph_hash:
    cands = [p for p in cands if digest(p) != ph_hash] or cands

# slug 同名的图优先(重跑同题时复用), 但要跳过目标文件自身
for p in cands:
    if os.path.basename(p).startswith(slug) and os.path.basename(p) != slug + ".jpg":
        print(p)
        sys.exit(0)

# 调用方可传 SEO_PICK_EXCLUDE=<md5:md5> 强制避开已用过的图
exclude = {x for x in os.environ.get("SEO_PICK_EXCLUDE", "").split(":") if x}

best, best_score = [], -1
for p in cands:
    name = os.path.basename(p).lower()
    score = sum(3 if t in name else 0 for t in tokens)
    if exclude and digest(p) in exclude:
        score -= 10
    if os.path.basename(p) in recent:
        score -= 4
    if score > best_score:
        best, best_score = [p], score
    elif score == best_score:
        best.append(p)

print(random.choice(best))
PY
)

if [ -z "$PICKED" ] || [ ! -f "$PICKED" ]; then
    echo "[warn] pick-hero-image: 图库无可用图片" >&2
    exit 1
fi

EXT="${PICKED##*.}"
if [ "$EXT" = "jpg" ] || [ "$EXT" = "jpeg" ]; then
    cp "$PICKED" "$DEST"
elif [ "$EXT" = "png" ]; then
    sips -s format jpeg "$PICKED" --out "$DEST" >/dev/null 2>&1
else
    TMP_PNG=$(mktemp -t pick-hero).png
    if /opt/homebrew/bin/dwebp "$PICKED" -o "$TMP_PNG" >/dev/null 2>&1; then
        sips -s format jpeg "$TMP_PNG" --out "$DEST" >/dev/null 2>&1
    fi
    rm -f "$TMP_PNG"
fi

if [ -s "$DEST" ]; then
    echo "$(basename "$PICKED")"
    exit 0
fi
echo "[warn] pick-hero-image: 转换失败 ($PICKED)" >&2
exit 1
