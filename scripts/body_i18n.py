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
# 分两阶段补齐：先铺 es/fr/pt/ar（法语非洲、莫桑比克/安哥拉、北非与阿语市场），
# 再补 ru/de/ja/hi。阶段一用 verify --phase1 校验，阶段二用默认 verify 做终检。
PHASE1 = ['es', 'fr', 'pt', 'ar']
ART = 'content/articles'
I18N = 'content/i18n'


def load(slug):
    p = os.path.join(ART, slug + '.json')
    if not os.path.exists(p):
        sys.exit('文章不存在: ' + p)
    return json.load(open(p, encoding='utf-8'))


EN_STOP = set(('the and for with from that this are is of to in on by as at be or '
               "its their it we you our will can not").split())
TARGET_RE = {'ar': r'[\u0600-\u06ff]', 'ru': r'[\u0400-\u04ff]',
             'ja': r'[\u3040-\u30ff\u4e00-\u9fff]', 'hi': r'[\u0900-\u097f]'}


def is_english_copy(en, t, lang):
    """检出「译文槽位里其实是英文原文/占位符/错语种」：非拉丁语种按字符集，拉丁语种按与 en 的相似度。"""
    if not en or not isinstance(t, str) or not t.strip():
        return False
    plain = re.sub(r'<[^>]+>', '', t)
    if re.fullmatch(r'[\.\s…·•\-]+', plain.strip()):
        return True
    rx = TARGET_RE.get(lang)
    if rx:
        target = len(re.findall(rx, plain))
        other = len(re.findall(r'[\u0600-\u06ff\u0400-\u04ff\u3040-\u30ff\u4e00-\u9fff\u0900-\u097f]', plain))
        nonspace = len(re.sub(r'\s', '', plain)) or 1
        words = len(re.findall(r'[A-Za-z]{2,}', plain))
        if target == 0 and other > 0:
            return True
        if target == 0 and words >= 2 and nonspace > 8:
            return True
        if (target / float(nonspace)) < 0.15 and words >= 3:
            return True
        return False
    try:
        from difflib import SequenceMatcher
        r = SequenceMatcher(None, en, t).ratio()
        if r > 0.95 and len(en) >= 30:
            return True
        if r <= 0.9:
            return False
    except Exception:
        return False
    ewords = re.findall(r"[A-Za-z']{2,}", re.sub(r'<[^>]+>', '', en))
    return len({w.lower() for w in ewords} & EN_STOP) >= 6


def english_copy(article):
    out = []
    for s in article.get('sections', []):
        for field in ('heading', 'body'):
            d = s.get(field) or {}
            en = d.get('en', '')
            for lang in LANGS:
                if lang in ('en', 'zh'):
                    continue
                if is_english_copy(en, d.get(lang, ''), lang):
                    out.append({'id': s.get('id'), 'field': field, 'lang': lang})
    return out


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
    copies = 0
    for f in sorted(glob.glob(os.path.join(ART, '*.json'))):
        a = json.load(open(f, encoding='utf-8'))
        m = missing(a)
        c = english_copy(a)
        if m or c:
            copies += len(c)
            rows.append({
                'slug': a.get('slug'),
                'date': a.get('date'),
                'category': a.get('category'),
                'sections': len(a.get('sections', [])),
                'missing_sections': len(m),
                'langs_missing': sorted({l for x in m for l in x['body_missing']}),
                'detail': m,
                'english_copy_fields': len(c),
                'english_copy': c,
            })
    if as_json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return
    print('缺语种/英文占位文章: %d 篇，英文占位字段 %d 个' % (len(rows), copies))
    for r in sorted(rows, key=lambda x: -x['english_copy_fields']):
        print('  %-58s %2d段 缺: %-24s 英文占位: %d' % (
            r['slug'][:58], r['sections'], ','.join(r['langs_missing']) or '-', r['english_copy_fields']))


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


def dedupe_para(p):
    """去掉段落尾部整块重复的句子（内容注入残留），保留原有换行结构。"""
    sents = re.split(r'(?<=[.!?])\s+', p.strip())
    while len(sents) > 1:
        hit = False
        for k in range(len(sents) // 2, 0, -1):
            if sents[-k:] == sents[-2*k:-k]:
                sents = sents[:-k]
                hit = True
                break
        if not hit:
            break
    return ' '.join(sents)


def dedupe_text(t):
    return '\n'.join(dedupe_para(line) for line in t.split('\n'))


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
                    target.setdefault(field, {})[lang] = dedupe_text(str(text))
                    touched += 1
    json.dump(a, open(os.path.join(ART, slug + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('已合并 %d 个字段 -> %s（来源 %d 个草稿）' % (touched, slug, len(parts)))





def cmd_dedupe(skip=()):
    files = 0
    blocks = 0
    removed = 0
    for f in sorted(glob.glob(os.path.join(ART, '*.json'))):
        if os.path.basename(f) in skip:
            continue
        a = json.load(open(f, encoding='utf-8'))
        dirty = False
        for s in a.get('sections', []):
            for lang, text in list((s.get('body') or {}).items()):
                if not text:
                    continue
                out = dedupe_text(text)
                if out != text:
                    s['body'][lang] = out
                    blocks += 1
                    removed += len(text) - len(out)
                    dirty = True
        if dirty:
            json.dump(a, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
            files += 1
    print('去重完成: %d 篇 / %d 段落，删除约 %d 字符' % (files, blocks, removed))


def cmd_verify(slug, phase1=False):
    a = load(slug)
    check = (['en', 'zh'] + PHASE1) if phase1 else LANGS
    bad = []
    for s in a.get('sections', []):
        for field in ('heading', 'body'):
            d = s.get(field) or {}
            en = d.get('en', '')
            for lang in check:
                t = d.get(lang, '')
                if not t.strip():
                    bad.append((s.get('id'), field, lang, 'missing'))
                    continue
                if lang in ('ar', 'ja', 'hi', 'ru') and is_english_heavy(t, lang):
                    bad.append((s.get('id'), field, lang, 'english-heavy'))
                if lang not in ('en', 'zh') and is_english_copy(en, t, lang):
                    bad.append((s.get('id'), field, lang, 'english-copy'))
                if en:
                    ratio = len(t.split()) / max(len(en.split()), 1)
                    if lang not in ('zh', 'ja') and not (0.45 <= ratio <= 2.2):
                        bad.append((s.get('id'), field, lang, 'length-ratio %.2f' % ratio))
    if bad:
        print('校验未通过 (%d):' % len(bad))
        for b in bad[:40]:
            print('  ', b)
        sys.exit(1)
    if phase1:
        print('校验通过(阶段一 en/zh/es/fr/pt/ar):', slug)
    else:
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
    elif cmd == 'dedupe':
        cmd_dedupe(tuple(sys.argv[2:]))
    elif cmd == 'verify':
        cmd_verify(sys.argv[2], phase1='--phase1' in sys.argv)
    else:
        sys.exit(__doc__)
