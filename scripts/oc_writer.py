#!/usr/bin/env python3
"""通过 OpenClaw 网关做文本生成（2026-11-24）。

为什么要走 OpenClaw，而不是继续直连各家 API：
  - key、OAuth、代理、重试、模型目录都在 OpenClaw 里统一维护，换 key 不用改脚本；
  - 它自带 provider 级重试与 fallback，脚本只需要给出候选模型顺序；
  - 同一份额度台账对本机所有 agent 共享，不会多个进程各自撞 429。

实测（2026-11-24）：
  zai/glm-4.5-flash    ok（可用，约 3.8s 一次，cost 0）
  zai/glm-4.6          429 余额不足或无可用资源包
  zai/glm-5.3-flashx   429
  zai/glm-4.5-air      429
  volcengine-agent-plan/*  400 AgentPlan 订阅失效 / 404 该模型不支持 agent plan
  google/gemini-*      402 prepayment credits depleted
  groq/*               未配置 API key

用法：
  python3 scripts/oc_writer.py "把这句翻译成日语，只输出译文：Fastener sourcing guide"
  python3 scripts/oc_writer.py --models zai/glm-4.5-flash,zai/glm-4.6 "prompt"
"""
import argparse
import glob
import json
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    import llm_quota
except Exception:
    llm_quota = None

DEFAULT_MODELS = os.environ.get(
    'OC_MODELS', 'zai/glm-4.5-flash,openrouter/free,zai/glm-4.7-flash,openrouter/nvidia/nemotron-3-ultra-550b-a55b:free,zai/glm-4.6v-flash').split(',')
TIMEOUT = int(os.environ.get('OC_TIMEOUT', '300'))


def _find_cli():
    """优先用网关服务实际使用的那个 node + openclaw 入口（版本可能比 PATH 里的新）。"""
    for node in sorted(glob.glob(os.path.expanduser('~/.nvm/versions/node/*/bin/node')), reverse=True):
        entry = os.path.join(os.path.dirname(os.path.dirname(node)),
                             'lib/node_modules/openclaw/dist/index.js')
        if os.path.exists(entry):
            return [node, entry]
    from shutil import which
    cli = which('openclaw')
    return [cli] if cli else None


def _quota_key(model):
    """provider/model → provider:model，与直连通道共用同一份额度台账。"""
    return model.replace('/', ':', 1)


def run(prompt, models=None, timeout=None):
    """按 models 顺序尝试，返回 (text, model, elapsed)。全部失败抛 RuntimeError。"""
    models = models or DEFAULT_MODELS
    cli = _find_cli()
    if not cli:
        raise RuntimeError('找不到 openclaw CLI')
    timeout = timeout or TIMEOUT
    errs = []
    for model in models:
        model = model.strip()
        if not model:
            continue
        if llm_quota:
            ok, wait, why = llm_quota.allow(_quota_key(model))
            if not ok:
                errs.append('%s 额度闸门: %s' % (model, why))
                continue
        t0 = time.time()
        try:
            p = subprocess.run(cli + ['infer', 'model', 'run', '--model', model,
                                      '--prompt', prompt, '--json'],
                               capture_output=True, text=True, timeout=timeout)
            out = p.stdout
            i, j = out.find('{'), out.rfind('}')
            data = json.loads(out[i:j + 1]) if i >= 0 and j >= 0 else {}
            text = ''
            for o in (data.get('outputs') or []):
                if isinstance(o, dict) and (o.get('text') or '').strip():
                    text = o['text'].strip()
                    break
            if data.get('ok') and text:
                if llm_quota:
                    llm_quota.record_success(_quota_key(model))
                return text, model, round(time.time() - t0, 1)
            msg = (data.get('error') or {}).get('message') or (p.stderr or '')[-120:]
            if '429' in msg and llm_quota:
                llm_quota.record_429(_quota_key(model))
            errs.append('%s: %s' % (model, msg[:110]))
        except subprocess.TimeoutExpired:
            errs.append('%s: timeout %ds' % (model, timeout))
        except Exception as e:
            errs.append('%s: %r' % (model, e))
    raise RuntimeError('OpenClaw 通道全部失败: ' + '; '.join(errs[-4:]))


def run_json(prompt, models=None, timeout=None):
    text, model, elapsed = run(prompt, models, timeout)
    s = text.strip()
    if s.startswith('```'):
        s = s.split('```')[1] if '```' in s[3:] else s.strip('`')
        s = s.lstrip('json').strip()
    i, j = s.find('{'), s.rfind('}')
    if i < 0:
        raise ValueError('返回里没有 JSON: ' + text[:120])
    return json.loads(s[i:j + 1]), model, elapsed


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('prompt', nargs='*', help='留空或 - 时从 stdin 读取')
    ap.add_argument('--models')
    args = ap.parse_args()
    text = ' '.join(args.prompt).strip()
    if not text or text == '-':
        text = sys.stdin.read()
    models = args.models.split(',') if args.models else None
    try:
        out, model, sec = run(text, models)
        print(out)
        print('\n[model=%s, %.1fs]' % (model, sec), file=sys.stderr)
    except RuntimeError as e:
        print('FAIL:', e, file=sys.stderr)
        sys.exit(1)
