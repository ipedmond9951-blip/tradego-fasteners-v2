#!/usr/bin/env python3
"""Build i18n single-section prompt. Usage: build_i18n_prompt.py <article> <sec_idx> <lang>"""
import sys
import json

LANG_NAMES = {
  'es': 'Spanish (Espanol)',
  'ar': 'Arabic (Arabic, RTL)',
  'fr': 'French (Francais)',
  'pt': 'Portuguese (Portugues)',
  'ru': 'Russian (Russkij)',
  'ja': 'Japanese (Nihongo)',
  'de': 'German (Deutsch)',
  'hi': 'Hindi (Hindi, Devanagari script)',
  'zh': 'Chinese Simplified (Zhongwen)',
}

article_file = sys.argv[1]
sec_idx = int(sys.argv[2])
lang = sys.argv[3]

with open(article_file) as f:
    a = json.load(f)
sections = a.get('sections', [])
sec = sections[sec_idx]
title = a['title']['en']
lang_name = LANG_NAMES.get(lang, lang)
NL = chr(10)
BS = chr(92)
parts = []
parts.append('You are a professional ' + lang_name + ' technical translator for industrial B2B publications.')
parts.append('Translate the English section below to ' + lang_name + '.')
parts.append('Output: STRICT JSON, body MUST be 1500-2500 characters.')
parts.append('')
parts.append('=== OUTPUT FORMAT (CRITICAL) ===')
parts.append('Response: START with { and END with }. Nothing before, nothing after.')
parts.append('No markdown fence. No preamble. No thinking aloud. No analysis.')
parts.append('The body field is a JSON string. Every newline inside body MUST be the two chars backslash+n (BACKSLASH + n), not a real line break.')
parts.append('If you would normally think, do it silently.')
parts.append('')
parts.append('=== JSON SHAPE ===')
parts.append('JSON object with two keys: heading (string) and body (string). Body 1500-2500 chars.')
parts.append('All inner double quotes inside body must be escaped as backslash-quote.')
parts.append('All newlines inside body must be the two characters backslash+n, NOT real line breaks.')
parts.append('')
parts.append('=== RULES ===')
parts.append('1. Translate EVERY sentence faithfully. Do not skip. Do not summarize.')
parts.append('2. Keep technical terms (ISO, ASTM, A193 B7, API 6A, HS code, BX-series, H2S) in English.')
parts.append('3. Preserve all citations [1], [2], [3] intact in body.')
parts.append('4. Include all numbers, dimensions, percentages, temperatures from source.')
parts.append('5. Translate the heading to target language. Keep concise and technical.')
parts.append('6. CRITICAL: every inner double quote in body must be escaped as backslash-quote.')
parts.append('7. CRITICAL: every newline in body must be the two chars backslash+n, NOT a real line break.')
parts.append('8. Target 1500-2500 chars in body. Translate every paragraph fully.')
parts.append('')
parts.append('=== ARTICLE TITLE (EN) ===')
parts.append(title)
parts.append('')
parts.append('=== SECTION ' + str(sec_idx) + ' ===')
parts.append('heading(en): ' + sec['heading']['en'])
parts.append('body(en):')
parts.append(sec['body']['en'])
parts.append('')
parts.append('=== NOW OUTPUT THE JSON OBJECT (body 1500-2500 chars) ===')
print(NL.join(parts))
