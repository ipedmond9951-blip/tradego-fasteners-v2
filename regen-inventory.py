#!/usr/bin/env python3
"""Regenerate i18n inventory - count empty/placeholder sections per lang.
Based on i18n-fix-missing.sh detection logic.
"""
import json
import os
import sys
from collections import Counter
from datetime import datetime

ARTICLES_DIR = os.path.expanduser("~/workspace/tradego-fasteners-v2/content/articles")
LANGS = ["en", "es", "fr", "pt", "ru", "de", "hi", "ar", "ja"]
PLACEHOLDER_PATTERNS = ["coming soon", "todo", "placeholder", "tbd"]

def is_placeholder(s):
    body = s.get("body", {})
    for lang in LANGS:
        v = body.get(lang, "")
        if v and any(p in v.lower() for p in PLACEHOLDER_PATTERNS) and len(v) < 200:
            return True
    return False

def avg_chars(s):
    body = s.get("body", {})
    vals = [len(v) for v in body.values() if v]
    return sum(vals) / len(vals) if vals else 0

def scan_article(fp):
    """Return list of (slug, lang, issue_type) for problematic entries."""
    slug = os.path.basename(fp).replace(".json", "")
    out = []
    try:
        with open(fp) as f:
            d = json.load(f)
    except Exception as e:
        return out

    sections = d.get("sections", [])
    for s in sections:
        # Check each lang
        for lang in LANGS:
            v = s.get("body", {}).get(lang, "")
            if not v or len(v) < 50:
                out.append((slug, lang, "empty"))
            elif any(p in v.lower() for p in PLACEHOLDER_PATTERNS) and len(v) < 200:
                out.append((slug, lang, "placeholder"))

    # Also check description
    desc = d.get("description", {})
    if isinstance(desc, dict):
        for lang in LANGS:
            v = desc.get(lang, "")
            if not v:
                out.append((slug, lang, "empty"))
            elif any(p in v.lower() for p in PLACEHOLDER_PATTERNS) and len(v) < 200:
                out.append((slug, lang, "placeholder"))

    return out

def main():
    empty = []
    placeholder = []
    total = 0
    for fname in os.listdir(ARTICLES_DIR):
        if not fname.endswith(".json"):
            continue
        total += 1
        results = scan_article(os.path.join(ARTICLES_DIR, fname))
        for slug, lang, kind in results:
            if kind == "empty":
                empty.append([slug, lang, 0])
            else:
                placeholder.append([slug, lang, 0])

    ts = datetime.now().strftime("%Y-%m-%d-%H%M%S")
    out = {
        "placeholder": placeholder,
        "empty": empty,
        "total_checked": total,
        "ts": ts,
        "source": "regen-inventory.py"
    }

    out_path = f"logs/i18n-translate/inventory-{ts.replace('-','')}.json"
    os.makedirs("logs/i18n-translate", exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    print(f"Wrote {out_path}")
    print(f"Empty: {len(empty)} (by lang: {dict(Counter(x[1] for x in empty))})")
    print(f"Placeholder: {len(placeholder)} (by lang: {dict(Counter(x[1] for x in placeholder))})")
    print(f"Total: {total}")
    print(f"SUM: {len(empty) + len(placeholder)}")

if __name__ == "__main__":
    main()
