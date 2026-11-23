#!/usr/bin/env python3
"""
收尾：把 localize_articles.py 没拿到的语种按 2-3 个一组再要一遍。

一次要 8 个语种时模型经常只回一半或者直接空（长 JSON 容易截断），
拆成小批成功率明显更高。复用 localize_articles.py 的提示词、解析与校验。

用法：python3 scripts/finish_localize.py [--apply]
"""
import glob
import json
import os
import sys
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
import localize_articles as L  # noqa: E402

CHUNK = 6
PROGRESS = L.PROGRESS


def main():
    apply = '--apply' in sys.argv
    prog = json.load(open(PROGRESS)) if os.path.exists(PROGRESS) else {}
    todo_all = []
    for path in sorted(glob.glob('content/articles/*.json')):
        art = json.load(open(path, encoding='utf-8'))
        todo = L.needs_job(art)
        if todo:
            todo_all.append((path, art, todo))
    print(f'仍有缺口 {len(todo_all)} 篇', flush=True)

    done_articles = 0
    for path, art, todo in todo_all:
        langs = sorted(todo)
        got = {}
        for i in range(0, len(langs), CHUNK):
            part = {k: todo[k] for k in langs[i:i + CHUNK]}
            for attempt in range(3):
                raw = L.call_llm(L.build_prompt(art, part))
                ok, problems = L.validate(L.parse_json(raw) or {}, part)
                with open('logs/finish-localize.log', 'a', encoding='utf-8') as lf:
                    lf.write(f'\n== {art["slug"]} {sorted(part)} a{attempt + 1} got={sorted(ok)} p={problems} ==\n{raw[:1500]}\n')
                if ok:
                    got.update(ok)
                    break
                time.sleep(6)
        if got:
            for lang, v in got.items():
                if (v.get('title') or '').strip():
                    art['title'][lang] = v['title'].strip()
                if (v.get('meta') or '').strip():
                    art.setdefault('metaDescription', {})[lang] = v['meta'].strip()
            if apply:
                with open(path, 'w', encoding='utf-8') as f:
                    json.dump(art, f, ensure_ascii=False, indent=2)
                    f.write('\n')
            done_articles += 1
        missing = sorted(set(todo) - set(got))
        prog[art['slug']] = {'done': not missing, 'ok': sorted(got), 'missing': missing}
        json.dump(prog, open(PROGRESS, 'w'), ensure_ascii=False, indent=2)
        print(f'  {art["slug"]}: 补到 {sorted(got)} 仍缺 {missing}', flush=True)

    left = sorted({s for s, v in prog.items() if not v.get('done')})
    print(f'{"APPLIED" if apply else "DRY"} 处理 {done_articles} 篇；仍缺: {len(left)} -> {left[:6]}')


if __name__ == '__main__':
    main()
