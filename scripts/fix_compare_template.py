"""清理"产品对比表"模板文：栏头里塞英文合成产品名、单元格留英文枚举值。

用法：
    python3 scripts/fix_compare_template.py            # 只报告
    python3 scripts/fix_compare_template.py --apply    # 回写（按 HEAD 缩进）
    python3 scripts/fix_compare_template.py --slug X --show   # 单篇看前后对比
"""
import re, sys, glob
sys.path.insert(0, 'scripts')
import json_rewrite as jr

TH = re.compile(r'<th>(.*?)</th>')
LATIN = re.compile(r"[A-Za-z][A-Za-z0-9&:,'\- ]{6,}")
# 只排除"表头标签列"这类单词型标题，合成产品名一律多词
LABEL = {'attribute', 'parameter', 'atributo', 'attribut', 'preferido', 'preferida'}
VALS = {
    'ru': {'Moderate': 'Средняя', 'Low (uncoated)': 'Низкая (без покрытия)',
           'High (stainless)': 'Высокая (нержавеющая сталь)',
           '4-6 weeks': '4–6 недель', '2-4 weeks': '2–4 недели', '6-10 weeks': '6–10 недель'},
    'ar': {'Moderate': 'متوسطة', 'Low (uncoated)': 'منخفضة (بدون طلاء)',
           'High (stainless)': 'عالية (فولاذ مقاوم للصدأ)',
           '4-6 weeks': '4–6 أسابيع', '2-4 weeks': '2–4 أسابيع', '6-10 weeks': '6–10 أسابيع'},
    'ja': {'Moderate': '中程度', 'Low (uncoated)': '低（コートなし）',
           'High (stainless)': '高（ステンレス）',
           '4-6 weeks': '4–6 週', '2-4 weeks': '2–4 週', '6-10 weeks': '6–10 週'},
    'es': {'Moderate': 'Moderada', 'Low (uncoated)': 'Baja (sin recubrimiento)',
           'High (stainless)': 'Alta (acero inoxidable)',
           '4-6 weeks': '4–6 semanas', '2-4 weeks': '2–4 semanas', '6-10 weeks': '6–10 semanas'},
    'fr': {'Moderate': 'Moyenne', 'Low (uncoated)': 'Faible (sans revêtement)',
           'High (stainless)': 'Élevée (acier inoxydable)',
           '4-6 weeks': '4–6 semaines', '2-4 weeks': '2–4 semaines', '6-10 weeks': '6–10 semaines'},
    'pt': {'Moderate': 'Moderada', 'Low (uncoated)': 'Baixa (sem revestimento)',
           'High (stainless)': 'Alta (aço inoxidável)',
           '4-6 weeks': '4–6 semanas', '2-4 weeks': '2–4 semanas', '6-10 weeks': '6–10 semanas'},
    'de': {'Moderate': 'Mittel', 'Low (uncoated)': 'Niedrig (unbeschichtet)',
           'High (stainless)': 'Hoch (Edelstahl)',
           '4-6 weeks': '4–6 Wochen', '2-4 weeks': '2–4 Wochen', '6-10 weeks': '6–10 Wochen'},
    'zh': {'Moderate': '中等', 'Low (uncoated)': '低（无涂层）', 'High (stainless)': '高（不锈钢）',
           '4-6 weeks': '4–6 周', '2-4 weeks': '2–4 周', '6-10 weeks': '6–10 周'},
    'hi': {'Moderate': 'मध्यम', 'Low (uncoated)': 'कम (बिना कोटिंग)', 'High (stainless)': 'उच्च (स्टेनलेस स्टील)',
           '4-6 weeks': '4–6 सप्ताह', '2-4 weeks': '2–4 सप्ताह', '6-10 weeks': '6–10 सप्ताह'},
}


def synthetic_name(body):
    """对比表第 2 个栏头就是"本方案"列，英文合成产品名只会出现在这里。

    只认这一格可避免把"Alternativa premium""Standard alternative"这类
    其它栏头当成产品名替换掉。
    """
    cells = [re.sub(r'<[^>]+>', '', c).strip() for c in TH.findall(body)]
    if len(cells) < 2:
        return None
    t = cells[1]
    if not LATIN.fullmatch(t) or len(t.split()) < 2 or t.lower() in LABEL:
        return None
    return t


def process(path, apply=False, show=False):
    d = jr.load(path)
    title = d.get('title') or {}
    changes = []
    for i, s in enumerate(d.get('sections', [])):
        for lang, b in (s.get('body') or {}).items():
            if lang == 'en' or not isinstance(b, str) or '<table>' not in b:
                continue
            name = synthetic_name(b)
            if not name:
                continue
            loc = (title.get(lang) or '').strip()
            if not loc:
                changes.append((i, lang, 'NO_TITLE', name))
                continue
            nb = b.replace(name, loc)
            for k, v in VALS.get(lang, {}).items():
                nb = re.sub(r'<td>' + re.escape(k) + r'</td>', '<td>' + v + '</td>', nb)
            if nb != b:
                changes.append((i, lang, 'FIX', name))
                if apply:
                    d['sections'][i]['body'][lang] = nb
                if show:
                    print('---', lang, '>>> 后：')
                    print(nb[:700])
    if apply and changes:
        jr.dump_same(path, d)
    return changes


if __name__ == '__main__':
    apply = '--apply' in sys.argv
    show = '--show' in sys.argv
    only = None
    if '--slug' in sys.argv:
        only = sys.argv[sys.argv.index('--slug') + 1]
    total = 0
    for p in sorted(glob.glob('content/articles/*.json')):
        if only and only not in p:
            continue
        ch = process(p, apply, show)
        if ch:
            total += len(ch)
            print(p.split('/')[-1][:-5], ch[:4], '...' if len(ch) > 4 else '')
    print(('APPLIED' if apply else 'DRY'), total, 'sections')
