#!/usr/bin/env python3
"""写作通道额度闸门：按 80% 上限用，用完就等，不再撞 429。

额度估算全部来自 2026-11-23/24 的实际调用记录（不是官方文档），置信度不高，
所以有两层保护：
  1) 只用估算容量的 SAFE_RATIO（默认 80%）；
  2) 真撞到 429 就自适应下调该通道容量，并冷却 15 分钟。

台账在 logs/llm_quota.json，跨进程共享；调用本身串行，不需要文件锁。

命令行：
  python3 scripts/llm_quota.py status     # 各通道今天用了多少、还剩多少
  python3 scripts/llm_quota.py reset      # 清空台账（换了 key / 账号时）
"""
import json
import os
import sys
import time
from datetime import date

LEDGER = os.path.join('logs', 'llm_quota.json')
SAFE_RATIO = 0.8
COOLDOWN_429 = 15 * 60

PROVIDERS = {
    'zai:glm-4.6': {
        'window': 600, 'window_cap': 4, 'day_cap': 150,
        'note': '实测 25s 间隔可出合格结果；连续 20s 批跑立即 429；45s 间隔仍 429，窗口极窄',
    },
    'zai:glm-4.5-flash': {
        'window': 600, 'window_cap': 2, 'day_cap': 40,
        'note': '几乎首次调用即 429，只做 glm-4.6 之外的极低频兜底',
    },
    'zai:glm-4.7-flash': {
        'window': 600, 'window_cap': 1, 'day_cap': 20,
        'note': '实测频繁 429，基本不可用于批量',
    },
    'google:gemini-api': {
        'window': 0, 'window_cap': 0, 'day_cap': 0,
        'note': 'HTTP 402 prepayment credits depleted，当前可用额度 0，不要排进链路',
    },
    'ark:agent-plan': {
        'window': 0, 'window_cap': 0, 'day_cap': 0,
        'note': '/api/v3 401、/api/plan/v3 404 UnsupportedModel，未订阅，额度 0',
    },
    'codex:cli': {
        'window': 0, 'window_cap': 0, 'day_cap': 0,
        'note': '额度耗尽，12-21 03:33 才恢复，期间为 0',
    },
    'browser:gemini-web': {
        'window': 86400, 'window_cap': 160, 'day_cap': 160,
        'note': '早期可用，累计约 150 次后整段返回 0 字符；按会话 200 次估，80% 即 160 次，每 40 次换会话',
        'session_rotate': 40,
    },
    'browser:grok-web': {
        'window': 86400, 'window_cap': 120, 'day_cap': 120,
        'note': '与 gemini 同批耗尽并返回 0 字符；按 150 次估，80% 即 120 次，每 40 次换会话',
        'session_rotate': 40,
    },
}


def _load():
    try:
        return json.load(open(LEDGER, encoding='utf-8'))
    except Exception:
        return {}


def _save(d):
    os.makedirs(os.path.dirname(LEDGER), exist_ok=True)
    tmp = LEDGER + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        f.write(json.dumps(d, ensure_ascii=False, indent=1))
    os.replace(tmp, LEDGER)


def _entry(d, key):
    if key not in PROVIDERS:
        return None
    e = d.setdefault(key, {'day': '', 'used_today': 0, 'events': [],
                           'cap_shrink': 0, 'penalty_until': 0, 'hits_429': 0})
    today = date.today().isoformat()
    if e.get('day') != today:
        e['day'] = today
        e['used_today'] = 0
        e['events'] = []
        e['hits_429'] = 0
        e['cap_shrink'] = 0
    return e


def allow(key, now=None):
    """返回 (ok, wait_seconds, reason)。ok=False 时若 wait_seconds>0 就睡这么久再试。"""
    now = now or time.time()
    cfg = PROVIDERS.get(key)
    if not cfg:
        return False, 0, 'unknown provider'
    if cfg['day_cap'] == 0:
        return False, 0, cfg['note']
    d = _load()
    e = _entry(d, key)
    if e['penalty_until'] > now:
        return False, int(e['penalty_until'] - now), '429 冷却中'
    cap = max(1, cfg['window_cap'] - min(cfg['window_cap'] - 1, e['cap_shrink']))
    budget = max(1, int(cap * SAFE_RATIO))
    win = cfg['window']
    recent = [t for t in e['events'] if now - t < win]
    e['events'] = recent
    if len(recent) >= budget:
        wait = int(win - (now - min(recent)))
        _save(d)
        return False, max(1, wait), '窗口内已用 %d/%d' % (len(recent), budget)
    day_budget = max(1, int(cfg['day_cap'] * SAFE_RATIO))
    if e['used_today'] >= day_budget:
        _save(d)
        return False, 0, '今日已用 %d/%d（80%% 上限）' % (e['used_today'], day_budget)
    _save(d)
    return True, 0, 'ok（窗口 %d/%d，今日 %d/%d）' % (len(recent), budget, e['used_today'], day_budget)


def record_success(key, now=None):
    now = now or time.time()
    d = _load()
    e = _entry(d, key)
    if e is None:
        return
    e['used_today'] += 1
    e['events'].append(now)
    _save(d)


def record_429(key, now=None):
    now = now or time.time()
    d = _load()
    e = _entry(d, key)
    if e is None:
        return
    e['used_today'] += 1
    e['events'].append(now)
    e['hits_429'] += 1
    cap = PROVIDERS[key]['window_cap']
    if cap > 1:
        e['cap_shrink'] = min(cap - 1, e['cap_shrink'] + 1)
    e['penalty_until'] = now + COOLDOWN_429
    _save(d)


def status():
    d = _load()
    today = date.today().isoformat()
    print('=== 写作通道额度（只用 %d%%，台账 %s）===' % (int(SAFE_RATIO * 100), LEDGER))
    for key, cfg in PROVIDERS.items():
        e = d.get(key) or {}
        used = e.get('used_today', 0) if e.get('day') == today else 0
        if cfg['window_cap']:
            cap = max(1, cfg['window_cap'] - min(cfg['window_cap'] - 1, e.get('cap_shrink', 0)))
        else:
            cap = 0
        budget_w = int(cap * SAFE_RATIO)
        budget_d = int(cfg['day_cap'] * SAFE_RATIO)
        extra = ''
        penalty = e.get('penalty_until', 0) or 0
        if penalty > time.time():
            extra = '  冷却 %ds' % int(penalty - time.time())
        line = '%-24s 窗口 %3d/%-3d 今日 %3d/%-3d 429:%d%s' % (
            key, budget_w, cfg['window_cap'], used, budget_d, e.get('hits_429', 0), extra)
        print(line)
        print('%-24s └ %s' % ('', cfg['note']))


def reset():
    _save({})
    print('台账已清空')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    if cmd == 'status':
        status()
    elif cmd == 'reset':
        reset()
    else:
        print('用法: llm_quota.py [status|reset]')
        sys.exit(2)
