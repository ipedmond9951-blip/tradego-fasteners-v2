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
    r = run(args)
    return r


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
