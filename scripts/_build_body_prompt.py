#!/usr/bin/env python3
"""Build body translation prompt for one article + one target lang.
Usage: LANG=es ARTICLE_FILE=/path/to/article.json python3 _build_body_prompt.py
"""
import json, os, sys

lang = os.environ['LANG']
article_file = os.environ['ARTICLE_FILE']

with open(article_file) as f:
    a = json.load(f)
title = a['title']['en']
sections = a.get('sections', [])

parts = [f'Translate ALL section bodies to {lang}.']
parts.append(f'Article title (EN): {title}')
parts.append('')
parts.append('Output STRICT JSON: {"translations": {"<lang>": {"title": "...", "sections": [{"heading": "...", "body": "..."}], "faqs": [{"q": "...", "a": "..."}], "ctaText": "..."}}}')
parts.append('RULES:')
parts.append(f'1. Output ONLY in {lang} (NO Chinese, NO other languages)')
parts.append('2. Preserve technical terms (HS code, ISO, EN, ASTM, etc.)')
parts.append('3. Keep citations like [1], [2] intact')
parts.append('4. Preserve HTML <a href="..."> tags as-is')
parts.append('5. In JSON string values, escape ALL double quotes with backslash')
parts.append('6. Output ONLY the JSON object, no markdown fence, no commentary')
parts.append('')
parts.append('SECTION BODIES:')
for i, s in enumerate(sections):
    body_en = s.get('body', {}).get('en', '')
    if not body_en:
        # 2026-07-19 04:50 FIX: skip sections without EN body (v2 翻译 bug 遗留, 部分 section body.en 为空)
        continue
    parts.append(f'--- section {i} ---')
    parts.append(f'heading(en): {s["heading"]["en"]}')
    parts.append(f'body(en):')
    parts.append(body_en)
faqs = a.get('faqs', [])
if faqs:
    parts.append('')
    parts.append('FAQs:')
    for i, f in enumerate(faqs):
        parts.append(f'--- faq {i} ---')
        parts.append(f'q(en): {f["q"]["en"]}')
        parts.append(f'a(en): {f["a"]["en"]}')
cta = a.get('cta', {}).get('text', {}).get('en', '')
if cta:
    parts.append('')
    parts.append(f'CTA(en): {cta}')
print('\n'.join(parts))
