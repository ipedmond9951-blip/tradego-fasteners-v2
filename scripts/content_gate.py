#!/usr/bin/env python3
"""内容闸门：一条命令跑完"体检 + 可自动修的建议"，供写稿、提交前、每日巡检直接调用。

用法：
  python3 scripts/content_gate.py            # 带基线体检，新增 BLOCK 退出 1
  python3 scripts/content_gate.py --brief    # 只打一行结论（给每日报告用）
  python3 scripts/content_gate.py --fix      # 先跑安全修复（meta/extract/date/image），再体检
  python3 scripts/content_gate.py --slug X   # 只看一篇
"""
import glob
import json
import os
import signal
import subprocess
import sys

try:  # 被 head/tee 截断时安静退出，不抛 BrokenPipeError
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, "content", "contract-baseline.json")
REPORT = os.path.join(ROOT, "logs", "content-contract-latest.json")


def run(args, capture=True):
    return subprocess.run([sys.executable] + args, cwd=ROOT, text=True,
                          capture_output=capture)


def i18n_gate(slug=None):
    """只查"本次动过的文章"：删掉英文原文泄漏，别让新文章继续复制 en。
    存量 169 篇的欠账走 docs/FAQ-LOCALIZATION-BACKLOG.md 批量清，不在这里堵全站。"""
    args = ["scripts/check-i18n-leakage.py", "--strict", "--quiet"]
    if slug:
        p = os.path.join(ROOT, "content/articles", f"{slug}.json")
        if not os.path.exists(p):
            return None
        args += ["--paths", p]
    else:
        changed = run(["git", "diff", "--name-only", "origin/main", "--", "content/articles"])
        files = [os.path.join(ROOT, f.strip()) for f in (changed.stdout or "").splitlines() if f.strip()]
        files = [f for f in files if os.path.exists(f)]
        if not files:
            return None
        args += ["--paths", ",".join(files)]
    # 先做增量归一化：把"非英文=英文原文"的伪翻译清掉（不影响真实译文），再判泄漏
    run(["scripts/normalize-faq-i18n.py", "--apply", "--paths", args[-1]])
    r = run(args)
    return r


def _leak_counts(path):
    """用 check-body-lang 的扫描器数一篇正文里的 english/script 残留。"""
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "_cbl", os.path.join(ROOT, "scripts", "check-body-lang.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    rows = mod.scan_article(path) if os.path.exists(path) else []
    n = {"english": 0, "script": 0}
    snippets = []
    for r in rows:
        if r["level"] in n:
            n[r["level"]] += 1
            snippets.append(f"§{r['section']} {r['field']}.{r['lang']} "
                            f"{(r['english'][0] if r['english'] else r.get('script',''))[:60]}")
    return n, snippets


def body_lang_gate(slug=None):
    """正文语种闸门：只堵"新增"的英文残留（对比 origin/main），不要求一次清完存量。
    清完 B 区后这里会自然接近零；A 区欠账由 seo-geo-main 侧负责，不在此处拦。"""
    import tempfile
    if slug:
        slugs = [slug]
    else:
        changed = run(["git", "diff", "--name-only", "origin/main", "--", "content/articles"])
        slugs = [os.path.basename(f.strip())[:-5]
                 for f in (changed.stdout or "").splitlines() if f.strip().endswith(".json")]
    bad = []
    for s in slugs:
        cur_p = os.path.join(ROOT, "content", "articles", f"{s}.json")
        if not os.path.exists(cur_p):
            continue
        cur, sn = _leak_counts(cur_p)
        base = {"english": 0, "script": 0}
        show = run(["git", "show", f"origin/main:content/articles/{s}.json"])
        if show.returncode == 0 and show.stdout:
            with tempfile.NamedTemporaryFile("w", suffix=".json",
                                            delete=False, encoding="utf-8") as t:
                t.write(show.stdout)
                base, _ = _leak_counts(t.name)
            os.unlink(t.name)
        if cur["english"] > base["english"] or cur["script"] > base["script"]:
            bad.append((s, base, cur, sn))
    return bad


def main():
    argv = sys.argv[1:]
    brief = "--brief" in argv
    do_fix = "--fix" in argv
    slug = None
    if "--slug" in argv:
        slug = argv[argv.index("--slug") + 1]

    def check():
        args = ["scripts/content_contract.py", "--quiet", "--json", REPORT]
        if os.path.exists(BASE) and not slug:
            args += ["--baseline", BASE]
        if slug:
            args += ["--slug", slug]
        return run(args)

    if do_fix:
        for sub in ("date", "image", "meta", "extract"):
            r = run(["scripts/fix_content_contract.py", sub, "--apply"])
            hits = [l for l in (r.stdout or "").splitlines() if l.startswith("[")]
            print(f"修复 {sub}: {len(hits)} 处")
        print()

    r = check()
    out = (r.stdout or "") + (r.stderr or "")
    code = r.returncode

    ig = i18n_gate(slug)
    if ig is not None and ig.returncode != 0:
        msg = (ig.stdout or "").strip()
        print(("\n" + msg) if not brief else msg.replace("\n", " ")[:180])
        code = 1

    bl = body_lang_gate(slug)
    if bl:
        code = 1
        print("\n⛔ 正文里新混入英文原文（非拉丁语种正文夹整句英文）：")
        for s, base, cur, sn in bl:
            print(f"  {s}: english {base['english']}→{cur['english']} / "
                  f"script {base['script']}→{cur['script']}")
            for x in sn[:3]:
                print(f"    {x}")
        print("  修法：把英文句按原意译回该语种（数字与标准号保留），别删段。")

    if brief:
        line = " | ".join(l.strip() for l in out.splitlines()
                          if "有 BLOCK" in l or "新增 BLOCK" in l or "完全干净" in l)
        print(line or out.strip().splitlines()[-1])
        return code

    print(out.strip())
    if code == 0:
        print("\n✅ 闸门通过：没有新增 BLOCK。")
        return 0

    # 有新增 BLOCK：把明细和最可能省事的修法一起给出来
    print("\n⛔ 有新增 BLOCK，逐条看：")
    try:
        rep = json.load(open(REPORT, encoding="utf-8"))
    except Exception:
        return 1
    shown = 0
    for a in rep.get("articles", []):
        for i in a.get("block", []):
            print(f"  [{a['slug']}] {i['msg']}")
            shown += 1
            if shown >= 12:
                break
        if shown >= 12:
            break
    print("\n可先试自动修（默认 dry-run，看清再落盘）：")
    for sub in ("meta", "extract", "zh-strip", "date", "image"):
        r2 = run(["scripts/fix_content_contract.py", sub, "--dry-run"])
        tail = [l for l in (r2.stdout or "").splitlines() if l.strip().startswith(sub[:4]) or "处理" in l]
        print(f"  {sub:<9} {tail[-1].strip() if tail else '无命中'}")
    print("\n修完别忘了收口基线：python3 scripts/content_contract.py --write-baseline content/contract-baseline.json")
    return 1


if __name__ == "__main__":
    sys.exit(main())
