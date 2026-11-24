#!/usr/bin/env python3
"""文章正文本地化工具（body / heading 十语补齐）。

用法：
  python3 scripts/body_i18n.py status            # 列出缺语种的文章与缺口段落数
  python3 scripts/body_i18n.py status --json     # 机器可读
  python3 scripts/body_i18n.py init <slug>       # 生成待译草稿 content/i18n/<slug>.json（含 en 原文）
  python3 scripts/body_i18n.py merge <slug>      # 把 content/i18n/<slug>.json 的译文合并回文章 JSON
  python3 scripts/body_i18n.py verify <slug>     # 校验合并结果（十语齐全 / 长度比 / 字符集）

约定：
  - 译文草稿结构 { "slug": ..., "sections": [ { "id":..., "heading": {lang:text}, "body": {lang:text} } ] }
  - merge 只写入草稿里出现的语种，en/zh 永不覆盖
  - ar/ja/hi/ru 做字符集粗检，防止英文原文被直接粘进去
"""
import json, sys, re, glob, os

LANGS = ['en', 'zh', 'es', 'fr', 'pt', 'ar', 'ru', 'ja', 'de', 'hi']
ART = 'content/articles'
I18N = 'content/i18n'


def load(slug):
    p = os.path.join(ART, slug + '.json')
    if not os.path.exists(p):
        sys.exit('文章不存在: ' + p)
    return json.load(open(p, encoding='utf-8'))


def missing(article):
    out = []
    for s in article.get('sections', []):
        miss_b = [l for l in LANGS if l not in (s.get('body') or {})]
        miss_h = [l for l in LANGS if l not in (s.get('heading') or {})]
        if miss_b or miss_h:
            out.append({'id': s.get('id'), 'body_missing': miss_b, 'heading_missing': miss_h})
    return out


def cmd_status(as_json):
    rows = []
    for f in sorted(glob.glob(os.path.join(ART, '*.json'))):
        a = json.load(open(f, encoding='utf-8'))
        m = missing(a)
        if m:
            rows.append({
                'slug': a.get('slug'),
                'date': a.get('date'),
                'category': a.get('category'),
                'sections': len(a.get('sections', [])),
                'missing_sections': len(m),
                'langs_missing': sorted({l for x in m for l in x['body_missing']}),
                'detail': m,
            })
    if as_json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return
    print('缺语种文章: %d 篇' % len(rows))
    for r in sorted(rows, key=lambda x: (x['date'] or ''), reverse=True):
        print('  %-58s %2d段 缺: %s' % (r['slug'][:58], r['sections'], ','.join(r['langs_missing']) or '-'))


def cmd_init(slug):
    a = load(slug)
    os.makedirs(I18N, exist_ok=True)
    draft = {
        'slug': slug,
        'sections': [{
            'id': s.get('id'),
            'heading': {'en': (s.get('heading') or {}).get('en', '')},
            'body': {'en': (s.get('body') or {}).get('en', '')},
        } for s in a.get('sections', [])],
    }
    p = os.path.join(I18N, slug + '.json')
    json.dump(draft, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('已生成草稿:', p, '段数:', len(draft['sections']))


def is_english_heavy(text, lang):
    """粗检：ar/ja/hi/ru 等非拉丁语种里拉丁字母词占比过高即报警。"""
    words = re.findall(r'[A-Za-z]{3,}', text)
    cjk = len(re.findall(r'[\u3040-\u30ff\u4e00-\u9fff\u0900-\u097f]', text))
    arab = len(re.findall(r'[\u0600-\u06ff]', text))
    cyr = len(re.findall(r'[\u0400-\u04ff]', text))
    if lang in ('ar',):
        return arab < 20 and len(words) > 5
    if lang in ('ja', 'hi'):
        return cjk < 20 and len(words) > 5
    if lang == 'ru':
        return cyr < 20 and len(words) > 5
    return False


def cmd_merge(slug):
    a = load(slug)
    p = os.path.join(I18N, slug + '.json')
    parts = sorted(glob.glob(os.path.join(I18N, slug + '*.json')))
    if not parts:
        sys.exit('译文草稿不存在: ' + p)
    touched = 0
    for part in parts:
        draft = json.load(open(part, encoding='utf-8'))
        by_id = {s.get('id'): s for s in a.get('sections', [])}
        for ds in draft.get('sections', []):
            target = by_id.get(ds.get('id'))
            if not target:
                print('  跳过未知段落:', ds.get('id'))
                continue
            for field in ('heading', 'body'):
                for lang, text in (ds.get(field) or {}).items():
                    if lang in ('en', 'zh'):
                        continue
                    if not str(text).strip():
                        continue
                    target.setdefault(field, {})[lang] = text
                    touched += 1
    json.dump(a, open(os.path.join(ART, slug + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('已合并 %d 个字段 -> %s（来源 %d 个草稿）' % (touched, slug, len(parts)))




def cmd_verify(slug):
    a = load(slug)
    bad = []
    for s in a.get('sections', []):
        for field in ('heading', 'body'):
            d = s.get(field) or {}
            en = d.get('en', '')
            for lang in LANGS:
                t = d.get(lang, '')
                if not t.strip():
                    bad.append((s.get('id'), field, lang, 'missing'))
                    continue
                if lang in ('ar', 'ja', 'hi', 'ru') and is_english_heavy(t, lang):
                    bad.append((s.get('id'), field, lang, 'english-heavy'))
                if en:
                    ratio = len(t.split()) / max(len(en.split()), 1)
                    if lang not in ('zh', 'ja') and not (0.45 <= ratio <= 2.2):
                        bad.append((s.get('id'), field, lang, 'length-ratio %.2f' % ratio))
    if bad:
        print('校验未通过 (%d):' % len(bad))
        for b in bad[:40]:
            print('  ', b)
        sys.exit(1)
    print('校验通过:', slug, '十语正文齐全')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    cmd = sys.argv[1]
    if cmd == 'status':
        cmd_status('--json' in sys.argv)
    elif cmd == 'init':
        cmd_init(sys.argv[2])
    elif cmd == 'merge':
        cmd_merge(sys.argv[2])
    elif cmd == 'verify':
        cmd_verify(sys.argv[2])
    else:
        sys.exit(__doc__)
