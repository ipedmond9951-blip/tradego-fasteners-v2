#!/usr/bin/env python3
"""
seo-delivery-check.py
8 项硬性交付标准自动验证.

Usage: python3 scripts/seo-delivery-check.py <article-slug>
Exit 0: 8 项全达 ✅ DELIVERED
Exit 1: 有项不达 ❌ NOT DELIVERED + 列出哪些不达

8 项标准:
1. Validator score >= 90/100
2. 10 语言全填 (title/description/sections/FAQ/CTA 都不能空)
3. 关键词密度 (核心词≥3, 长尾词≥5)
4. 内部链接 >= 3 产品页 + 1 category
5. 真实部署 10/10 语言 curl 200
6. 配图存在 (50-500KB, 有效 JPEG)
7. Git pushed (HEAD in main)
8. GSC 可索引 (无 noindex meta)
"""

import sys
import json
import re
import os
import subprocess
from pathlib import Path

PROJECT_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
ARTICLES_DIR = PROJECT_DIR / "content" / "articles"
IMAGES_DIR = PROJECT_DIR / "public" / "images" / "articles"
VALIDATOR = Path.home() / ".agents/skills/seo-universal-author/scripts/validate-article.py"

LANGUAGES = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']
SITE_URL = "https://www.tradego-fasteners.com"

# 产品核心词 (用作关键词密度检查)
CORE_KEYWORDS = [
    'hex bolt', 'anchor bolt', 'concrete screw', 'stainless bolt',
    'high-tensile', 'fastener', 'thread', 'steel', 'zinc'
]
# 长尾词 (产品 + 应用) - 使用更宽松的匹配
# 格式: (pattern, can_match_zero_or_more_words)
import re as _re
LONG_TAIL_KEYWORDS = [
    _re.compile(r'\b(?:for|in|to)\s+(?:mining|mineral|mining sector)', _re.IGNORECASE),
    _re.compile(r'\b(?:for|in|to)\s+(?:construction|building|infrastructure)', _re.IGNORECASE),
    _re.compile(r'\b(?:zimbabwe|bulawayo|harare)\b', _re.IGNORECASE),
    _re.compile(r'\b(?:africa|african|sadc|eac|afcfta)\b', _re.IGNORECASE),
    _re.compile(r'\b(?:grade\s*8\.8|grade\s*10\.9|8\.8|10\.9)\b', _re.IGNORECASE),
    _re.compile(r'\b(?:iso\s*898|astm\s*a325|iso\s*3506|iso\s*3269)\b', _re.IGNORECASE),
    _re.compile(r'\b(?:hot-dip|galvaniz|hdg|electro-galvaniz)', _re.IGNORECASE),
    _re.compile(r'\b(?:stainless\s*316|a4-80|a2-70|316l)\b', _re.IGNORECASE),
    _re.compile(r'\b(?:structural\s*bolt|high.?tensile|preload)\b', _re.IGNORECASE),
    _re.compile(r'\b(?:zimra|sabs|son|kebs|keBS|tbs|standards?\s*bureau)\b', _re.IGNORECASE),
]


class CheckResult:
    def __init__(self, name, passed, detail):
        self.name = name
        self.passed = passed
        self.detail = detail

    def __str__(self):
        icon = "✅" if self.passed else "❌"
        return f"{icon} {self.name}: {self.detail}"


def get_validator_score(article_path):
    """Run validator and return (score, errors, warnings)."""
    try:
        result = subprocess.run(
            ['python3', str(VALIDATOR), str(article_path)],
            capture_output=True, text=True, timeout=30
        )
        output = result.stdout
        # Parse score from output
        m = re.search(r'(\d+)/100', output)
        if m:
            score = int(m.group(1))
        else:
            score = 0
        return score, output
    except Exception as e:
        return 0, f"Validator error: {e}"


def check_1_score(slug):
    article_path = ARTICLES_DIR / f"{slug}.json"
    if not article_path.exists():
        return CheckResult("1. Score ≥ 90", False, "Article JSON missing")
    score, output = get_validator_score(article_path)
    return CheckResult("1. Score ≥ 90", score >= 90, f"{score}/100")


def check_2_ten_languages(slug):
    article_path = ARTICLES_DIR / f"{slug}.json"
    if not article_path.exists():
        return CheckResult("2. 10 Languages", False, "Article JSON missing")
    try:
        article = json.load(open(article_path))
    except Exception as e:
        return CheckResult("2. 10 Languages", False, f"JSON invalid: {e}")

    missing = []
    for lang in LANGUAGES:
        # title
        if not article.get('title', {}).get(lang):
            missing.append(f"title.{lang}")
        # description
        if not article.get('description', {}).get(lang):
            missing.append(f"description.{lang}")
        # sections (skip FAQ-only sections that have no body, but have faqItems)
        for s in article.get('sections', []):
            if s.get('id') == 'faq' and s.get('faqItems'):
                continue  # FAQ section doesn't need body
            body = s.get('body', {})
            if not body.get(lang):
                missing.append(f"section.body.{lang}")
        # FAQ - check both top-level and section-level (support q/a AND question/answer)
        all_faqs = list(article.get('faqItems', []))
        for s in article.get('sections', []):
            all_faqs.extend(s.get('faqItems', []))
        for f in all_faqs:
            # Try 'question' first, fallback to 'q'
            q_val = f.get('question', {}).get(lang) or f.get('q', {}).get(lang)
            a_val = f.get('answer', {}).get(lang) or f.get('a', {}).get(lang)
            if not q_val or not a_val:
                missing.append(f"faq.{lang}")
        # CTA - support nested (cta.en.title) AND flat (cta.text.en) structures
        cta = article.get('cta', {})
        if isinstance(cta.get(lang), dict):
            # nested structure: cta.en.title / cta.en.buttonText
            cta_lang = cta.get(lang, {})
            if not cta_lang.get('title') and not cta_lang.get('body'):
                missing.append(f"cta.{lang}")
        else:
            # flat structure: cta.text.en / cta.buttonText.en
            if not cta.get('text', {}).get(lang):
                missing.append(f"cta.text.{lang}")
            if not cta.get('buttonText', {}).get(lang):
                missing.append(f"cta.buttonText.{lang}")
        # imageAlt
        if not article.get('imageAlt', {}).get(lang):
            missing.append(f"imageAlt.{lang}")

    if missing:
        return CheckResult("2. 10 Languages", False, f"Missing: {missing[:5]}{'...' if len(missing)>5 else ''}")
    return CheckResult("2. 10 Languages", True, "10/10 langs complete")


def check_3_keywords(slug):
    article_path = ARTICLES_DIR / f"{slug}.json"
    try:
        article = json.load(open(article_path))
    except Exception:
        return CheckResult("3. Keywords", False, "JSON invalid")

    # Count EN body
    en_text = ""
    for s in article.get('sections', []):
        en_text += s.get('body', {}).get('en', '') + " "
    en_text = en_text.lower()

    core_count = sum(1 for k in CORE_KEYWORDS if k.lower() in en_text)
    long_tail_count = sum(1 for k in LONG_TAIL_KEYWORDS if k.search(en_text))

    passed = core_count >= 3 and long_tail_count >= 5
    return CheckResult(
        "3. Keywords", passed,
        f"core={core_count} (need 3), long-tail={long_tail_count} (need 5)"
    )


def check_4_internal_links(slug):
    article_path = ARTICLES_DIR / f"{slug}.json"
    try:
        article = json.load(open(article_path))
    except Exception:
        return CheckResult("4. Internal Links", False, "JSON invalid")

    en_html = ""
    for s in article.get('sections', []):
        en_html += s.get('body', {}).get('en', '')

    # Find product links
    product_links = re.findall(r'href="(/en/products/[^"]+)"', en_html)
    category_links = re.findall(r'href="(/en/(?!products/)[^"]+)"', en_html)

    passed = len(product_links) >= 3 and len(category_links) >= 1
    return CheckResult(
        "4. Internal Links", passed,
        f"products={len(product_links)} (need 3), categories={len(category_links)} (need 1)"
    )


def check_5_deployment(slug):
    """Check all 10 languages return 200."""
    failed = []
    for lang in LANGUAGES:
        url = f"{SITE_URL}/{lang}/industry/{slug}"
        try:
            result = subprocess.run(
                ['curl', '-sL', '--max-time', '10', '-o', '/dev/null', '-w', '%{http_code}', url],
                capture_output=True, text=True, timeout=15
            )
            code = result.stdout.strip()
            if code != '200':
                failed.append(f"{lang}={code}")
        except Exception as e:
            failed.append(f"{lang}=err")

    if failed:
        return CheckResult("5. Deployment 10-lang", False, f"Failed: {failed}")
    return CheckResult("5. Deployment 10-lang", True, "10/10 langs 200")


def check_6_image(slug):
    img_path = IMAGES_DIR / f"{slug}.jpg"
    if not img_path.exists():
        return CheckResult("6. Image", False, "Image file missing")
    size = img_path.stat().st_size
    # 50-500KB, 有效 JPEG (前 2 字节 0xFF 0xD8)
    if size < 50_000:
        return CheckResult("6. Image", False, f"Too small: {size} bytes")
    if size > 500_000:
        return CheckResult("6. Image", False, f"Too large: {size} bytes")
    with open(img_path, 'rb') as f:
        magic = f.read(2)
    if magic != b'\xff\xd8':
        return CheckResult("6. Image", False, f"Not a JPEG (magic: {magic.hex()})")
    return CheckResult("6. Image", True, f"{size//1024}KB JPEG")


def check_7_git_pushed(slug):
    """Check the article file is in git log pushed to origin/main."""
    try:
        # Get latest commit for this file
        result = subprocess.run(
            ['git', 'log', '--oneline', '-1', '--', f'content/articles/{slug}.json'],
            cwd=str(PROJECT_DIR),
            capture_output=True, text=True, timeout=10
        )
        if not result.stdout.strip():
            return CheckResult("7. Git pushed", False, "No commit for this article")

        commit_hash = result.stdout.split()[0]

        # Check if commit is in origin/main
        result2 = subprocess.run(
            ['git', 'branch', '-r', '--contains', commit_hash],
            cwd=str(PROJECT_DIR),
            capture_output=True, text=True, timeout=10
        )
        if 'origin/main' in result2.stdout:
            return CheckResult("7. Git pushed", True, f"{commit_hash} on origin/main")
        return CheckResult("7. Git pushed", False, f"{commit_hash} not on origin/main")
    except Exception as e:
        return CheckResult("7. Git pushed", False, f"Git error: {e}")


def check_8_gsc_indexable(slug):
    """Check no noindex meta tag on the page."""
    url = f"{SITE_URL}/en/industry/{slug}"
    try:
        result = subprocess.run(
            ['curl', '-sL', '--max-time', '10', url],
            capture_output=True, text=True, timeout=15
        )
        html = result.stdout
        # Check for noindex
        if re.search(r'<meta\s+name="robots"\s+content="[^"]*noindex', html, re.IGNORECASE):
            return CheckResult("8. GSC Indexable", False, "noindex meta found")
        if re.search(r'x-robots-tag[^>]*noindex', html, re.IGNORECASE):
            return CheckResult("8. GSC Indexable", False, "x-robots-tag noindex")
        return CheckResult("8. GSC Indexable", True, "no noindex markers")
    except Exception as e:
        return CheckResult("8. GSC Indexable", False, f"Curl error: {e}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/seo-delivery-check.py <article-slug>")
        sys.exit(1)

    slug = sys.argv[1]
    print(f"")
    print(f"═══════════════════════════════════════════════════════")
    print(f"  DELIVERY CHECK: {slug}")
    print(f"═══════════════════════════════════════════════════════")
    print(f"")

    checks = [
        check_1_score(slug),
        check_2_ten_languages(slug),
        check_3_keywords(slug),
        check_4_internal_links(slug),
        check_5_deployment(slug),
        check_6_image(slug),
        check_7_git_pushed(slug),
        check_8_gsc_indexable(slug),
    ]

    for c in checks:
        print(f"  {c}")

    passed = sum(1 for c in checks if c.passed)
    print(f"")
    print(f"═══════════════════════════════════════════════════════")
    if passed == 8:
        print(f"  ✅ DELIVERED: 8/8 ({slug})")
        print(f"═══════════════════════════════════════════════════════")
        sys.exit(0)
    else:
        failed = [c.name for c in checks if not c.passed]
        print(f"  ❌ NOT DELIVERED: {passed}/8 (failed: {', '.join(failed)})")
        print(f"═══════════════════════════════════════════════════════")
        sys.exit(1)


if __name__ == '__main__':
    main()
