#!/usr/bin/env python3
"""Build i18n WRITE-MODE prompt. Usage: build_i18n_write_prompt.py <article> <sec_idx> <lang>"""
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
parts.append('You are a professional ' + lang_name + ' technical content writer for industrial B2B publications.')
parts.append('Based on the English source below, WRITE (do not translate) a ' + lang_name + ' version of this section.')
parts.append('Write as if you are an original author writing in ' + lang_name + '. Do not preserve the exact English sentence structure.')
parts.append('Target: body 1500-2500 characters (in ' + lang_name + ').')
parts.append('')
parts.append('=== OUTPUT FORMAT (CRITICAL) ===')
parts.append('Response: START with { and END with }. Nothing before, nothing after.')
parts.append('No markdown fence. No preamble. No thinking aloud. No analysis.')
parts.append('The body field is a JSON string. Every newline inside body MUST be the two chars backslash+n (BACKSLASH + n), not a real line break.')
parts.append('If you would normally think, do it silently.')
parts.append('')
parts.append('=== JSON SHAPE ===')
parts.append('JSON object with two keys: heading (string, 30-50 chars) and body (string, 1500-2500 chars).')
parts.append('All inner double quotes inside body must be escaped as backslash-quote.')
parts.append('All newlines inside body must be the two characters backslash+n, NOT real line breaks.')
parts.append('')
parts.append('=== WRITING RULES ===')
parts.append('1. Cover EVERY key fact from the English source - dates, numbers, dimensions, grades, standards, technical terms.')
parts.append('2. Keep technical terms (ISO, ASTM, A193 B7, API 6A, HS code, BX-series, H2S, hex bolts, stud bolts, anchor bolts, ASME B18.2.1) in English.')
parts.append('3. Preserve all citations [1], [2], [3] intact in the body.')
parts.append('4. Include all numbers, dimensions, percentages, temperatures from the source.')
parts.append('5. Write 4-5 paragraphs in ' + lang_name + ' covering the same depth as the English source.')
parts.append('6. Translate the heading to ' + lang_name + '. Keep concise and technical.')
parts.append('7. CRITICAL: every inner double quote in body must be escaped as backslash-quote.')
parts.append('8. CRITICAL: every newline in body must be the two chars backslash+n, NOT a real line break.')
parts.append('9. Use real ' + lang_name + ' technical writing style. Not a literal word-for-word translation.')
parts.append('')
parts.append('=== ARTICLE TITLE (EN, for context) ===')
parts.append(title)
parts.append('')
parts.append('=== SECTION ' + str(sec_idx) + ' ENGLISH SOURCE ===')
parts.append('heading(en): ' + sec['heading']['en'])
parts.append('body(en):')
parts.append(sec['body']['en'])
parts.append('')
parts.append('=== NOW WRITE THE ' + lang_name.upper() + ' VERSION (body 1500-2500 chars) ===')
print(NL.join(parts))
