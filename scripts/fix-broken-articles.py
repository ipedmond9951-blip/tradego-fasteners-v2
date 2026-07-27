#!/usr/bin/env python3
"""
fix-broken-articles.py - 修复最近 5 篇 sections=0 的 article

根因: 7/23+ 之后, 豆包 (CDP) 输出的 MD 文件没 ## H2 标题, 只有纯文本 + 行内 section title.
     pipeline STEP 5 的 markdown parser 只认 `## `, 解析出来 0 sections / 0 FAQs / 0 body.
     结果: article.json 是个空壳, 线上文章只有 title + description + imageAlt, 几行字.

修法: 用 outline.json 的 section heading + 豆包格式特点, 重写 parser:
  1. 跳过前 6 行 CDP debug log + `=== 🫛 豆包 回复 ===`
  2. 用 outline.sections 的 heading 逐个在 MD 里找, 提取 body
  3. 找 "FAQ" 行开始提取 Q:/A: 对

用法:
  python3 scripts/fix-broken-articles.py --slug togo-lome-port-fastener-import-procedure
  python3 scripts/fix-broken-articles.py --all
"""
import json
import os
import re
import sys
import argparse
import glob

PROJECT_DIR = "/Users/zhangming/workspace/tradego-fasteners-v2"
TMP_DIR = os.path.join(PROJECT_DIR, "logs/seo-ai-pipeline/tmp")
ARTICLES_DIR = os.path.join(PROJECT_DIR, "content/articles")

LANGS = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']


def to_dict(value):
    return {lang: value for lang in LANGS}


def strip_debug_log(article_md: str) -> str:
    """剥掉前 6 行 CDP debug log + `=== 🫛 豆包 回复 ===`"""
    lines = article_md.split('\n')
    out = []
    skip_until_marker = True
    for line in lines:
        if skip_until_marker:
            if '豆包 回复' in line or 'gemini 回复' in line or 'grok 回复' in line or 'chatgpt 回复' in line or 'minimax 回复' in line or '===' in line:
                skip_until_marker = False
                continue
            # 同时跳过 [send] 之类行 (CDP interaction log)
            if line.startswith('[send]') or line.startswith('  [豆包]') or line.startswith('  [gemini]') or line.startswith('[豆包]') or line.startswith('[gemini]'):
                continue
            if line.strip() == '':
                continue
            skip_until_marker = False
        out.append(line)
    return '\n'.join(out)


def parse_md_with_outline(article_md: str, outline: dict) -> tuple:
    """
    用 outline.sections 的 heading 去 MD 里 find + extract body.
    返回 (sections, faqs)
    """
    cleaned = strip_debug_log(article_md)

    # Build section heading -> body chunks
    section_headings = [s['heading'] for s in outline.get('sections', [])]

    # 找每个 heading 第一次出现的位置, 下一个 heading 之前就是 body
    # 简化: 按 outline.sections 顺序 split cleaned text
    sections = []
    for i, heading in enumerate(section_headings):
        # 在 cleaned 里找 heading (允许前后有换行/空格, 不要求 ## 标记)
        # 用 first occurrence (heading 在 MD 里通常作为 standalone 行)
        pattern = re.compile(r'(?:^|\n)\s*' + re.escape(heading) + r'\s*\n', re.MULTILINE)
        match = pattern.search(cleaned)
        if not match:
            # try fuzzy: heading 短词 + 关键词
            print(f"  ⚠️ Section heading not found in MD: '{heading[:50]}...'")
            continue

        start = match.end()
        # 找下一个 heading 的位置
        if i + 1 < len(section_headings):
            next_pattern = re.compile(r'(?:^|\n)\s*' + re.escape(section_headings[i + 1]) + r'\s*\n', re.MULTILINE)
            next_match = next_pattern.search(cleaned, pos=start)
            end = next_match.start() if next_match else len(cleaned)
        else:
            # 最后一个 section, 到 "FAQ" 之前
            faq_pattern = re.compile(r'(?:^|\n)\s*FAQ\s*\n', re.MULTILINE)
            faq_match = faq_pattern.search(cleaned, pos=start)
            end = faq_match.start() if faq_match else len(cleaned)

        body = cleaned[start:end].strip()
        # 去掉可能残留的标题行 (如果 heading 跟了一些 inline 内容)
        # body 应该是长段文字
        sections.append({
            "heading": {"en": heading},
            "body": {"en": body},
            "type": "text"
        })

    # FAQs: 找 "FAQ" 之后, 多种格式
    #   格式 A: Q: ... \n A: ... (togo, tunisia, nigeria x 2)
    #   格式 B: <Question ending with ?>\n<Answer paragraph>... (libya)
    faqs = []
    faq_pattern = re.compile(r'(?:^|\n)\s*FAQ\s*\n', re.MULTILINE)
    faq_match = faq_pattern.search(cleaned)
    if faq_match:
        faq_text = cleaned[faq_match.end():]

        # 先试 格式 A (Q:/A:)
        qa_pattern = re.compile(r'Q:\s*(.+?)\nA:\s*(.+?)(?=\nQ:|\Z)', re.DOTALL)
        for m in qa_pattern.finditer(faq_text):
            q = m.group(1).strip()
            a = m.group(2).strip()
            if q and a:
                faqs.append({
                    "q": {"en": q},
                    "a": {"en": a}
                })

        # 没匹配到, 试 格式 B (? ending 行 = 问题, 下个 ? 之前 = 答案)
        if not faqs:
            # 找所有 '?' 结尾的行作为 Q 边界
            # split by '?' 之后的部分作为 answer
            chunks = re.split(r'\n(?=[^\n]*\?\n)', faq_text)
            for chunk in chunks:
                lines_in_chunk = [l.strip() for l in chunk.strip().split('\n') if l.strip()]
                if not lines_in_chunk:
                    continue
                # Q 是第一行 (含 ?)
                q = lines_in_chunk[0]
                if '?' not in q:
                    continue
                # A 是后续所有行
                a = '\n'.join(lines_in_chunk[1:]).strip()
                if a:
                    faqs.append({
                        "q": {"en": q},
                        "a": {"en": a}
                    })

    return sections, faqs


def fix_article(slug: str, dry_run: bool = False) -> bool:
    md_file = os.path.join(TMP_DIR, f"{slug}_article.md")
    outline_file = os.path.join(TMP_DIR, f"{slug}_outline.json")
    article_file = os.path.join(ARTICLES_DIR, f"{slug}.json")

    if not os.path.exists(md_file):
        print(f"  ❌ MD file not found: {md_file}")
        return False
    if not os.path.exists(outline_file):
        print(f"  ❌ Outline file not found: {outline_file}")
        return False
    if not os.path.exists(article_file):
        print(f"  ❌ Article file not found: {article_file}")
        return False

    with open(md_file) as f:
        article_md = f.read()
    with open(outline_file) as f:
        outline = json.load(f)
    with open(article_file) as f:
        article = json.load(f)

    sections, faqs = parse_md_with_outline(article_md, outline)

    print(f"  📄 {slug}")
    print(f"     MD size: {len(article_md)} bytes, {len(article_md.split())} words")
    print(f"     Outline sections: {len(outline.get('sections', []))}")
    print(f"     Outline FAQs: {len(outline.get('faqs', []))}")
    print(f"     Parsed sections: {len(sections)}")
    print(f"     Parsed FAQs: {len(faqs)}")

    if len(sections) < 4:
        print(f"     ❌ Too few sections parsed, skipping")
        return False

    # 10 语言占位 - 用 outline 字段填 en, 其它语言后续翻译
    # 这里只补 en, 其它语言保持现状 (为空就保留空 dict, 后续 i18n cron 跑)
    article['sections'] = sections
    article['faq'] = faqs

    # 检查现有 i18n 翻译是否还在 (sections 覆盖会丢翻译)
    # 安全: 只覆盖 en 字段, 保留其它语言已有的
    for i, sec in enumerate(article['sections']):
        if 'translations' in sec:
            # 如果有旧翻译, 保留
            for lang in LANGS:
                if lang != 'en' and lang in sec.get('translations', {}):
                    # 旧版用的是 'translations' 字段, 新版用 'heading'/'body' dict
                    pass

    # write
    if dry_run:
        print(f"     🧪 DRY RUN, would write {len(sections)} sections + {len(faqs)} faqs")
        return True

    with open(article_file, 'w', encoding='utf-8') as f:
        json.dump(article, f, ensure_ascii=False, indent=2)

    print(f"     ✅ Updated {article_file}")
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--slug', help='single article slug')
    parser.add_argument('--all', action='store_true', help='fix all 0-section articles')
    parser.add_argument('--dry-run', action='store_true', help='preview only')
    args = parser.parse_args()

    if args.slug:
        slugs = [args.slug]
    elif args.all:
        # 找所有 0 sections 的 article
        slugs = []
        for f in glob.glob(os.path.join(ARTICLES_DIR, '*.json')):
            with open(f) as fp:
                d = json.load(fp)
            if len(d.get('sections', [])) == 0:
                slug = os.path.basename(f).replace('.json', '')
                # 必须有对应的 tmp md + outline
                if os.path.exists(os.path.join(TMP_DIR, f"{slug}_article.md")):
                    slugs.append(slug)
                else:
                    print(f"  ⚠️ Skipping {slug} (no tmp md)")
        print(f"Found {len(slugs)} broken articles with tmp files")
    else:
        parser.print_help()
        sys.exit(1)

    success = 0
    for slug in slugs:
        if fix_article(slug, dry_run=args.dry_run):
            success += 1
        print()

    print(f"\n{success}/{len(slugs)} articles fixed")


if __name__ == '__main__':
    main()
