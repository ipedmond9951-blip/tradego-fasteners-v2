#!/usr/bin/env python3
"""统一写作通道客户端（2026-11-23）。

现状：codex CLI 额度用尽（12-21 才恢复）；浏览器 gemini/grok 标签页连续跑了几百次后
开始返回 0 字符；Google AI Studio 的 key 余额耗尽（HTTP 402）。

可用的是本机 openclaw 配置里的 OpenAI 兼容端点：
  - zai（智谱 GLM，glm-4.6 实测 25s 能出合格日语；glm-4.7-flash 常被限流）
  - volcengine-agent-plan（/plan/v3 只支持 plan 内模型，未通）
不用 DeepSeek / MiniMax（用户明确排除）。

对外只暴露 generate(prompt) / generate_json(prompt)。
"""
import json
import os
import random
import time
import urllib.error
import urllib.request

CONFIG = os.path.expanduser('~/.openclaw/openclaw.json')
CHAIN = os.environ.get('WRITER_CHAIN', 'zai:glm-4.6,zai:glm-4.5-flash,zai:glm-4.5-air').split(',')


def _cfg():
    return json.load(open(CONFIG))['models']['providers']


def _post(base, key, model, messages, temperature, max_tokens, timeout=240):
    url = base.rstrip('/') + '/chat/completions'
    payload = {'model': model, 'messages': messages, 'temperature': temperature, 'max_tokens': max_tokens}
    req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                                 headers={'Content-Type': 'application/json',
                                          'Authorization': 'Bearer ' + key})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        d = json.load(r)
    return d['choices'][0]['message']['content']


def generate(prompt, temperature=0.4, max_tokens=4000, retries=2):
    provs = _cfg()
    errs = []
    for attempt in range(max(retries, 3)):
        for item in CHAIN:
            name, _, model = item.partition(':')
            p = provs.get(name)
            if not p or not p.get('apiKey'):
                continue
            try:
                txt = _post(p['baseUrl'], p['apiKey'], model,
                            [{'role': 'user', 'content': prompt}], temperature, max_tokens)
                if txt and txt.strip():
                    time.sleep(3)  # 主动限速，避免把免费额度打爆
                    return txt.strip()
                errs.append(f'{name}:{model} 空返回')
            except urllib.error.HTTPError as e:
                errs.append(f'{name}:{model} HTTP {e.code}')
                if e.code == 429:
                    time.sleep(10 + random.random() * 8)
            except Exception as e:
                errs.append(f'{name}:{model} {repr(e)[:60]}')
                time.sleep(4)
    raise RuntimeError('写作通道全部失败: ' + '; '.join(errs[-4:]))


def generate_json(prompt, temperature=0.3, max_tokens=4000, retries=2):
    txt = generate(prompt, temperature, max_tokens, retries)
    s = txt.strip()
    if s.startswith('```'):
        s = s.split('```')[1] if '```' in s[3:] else s.strip('`')
        s = s.lstrip('json').strip()
    i, j = s.find('{'), s.rfind('}')
    if i < 0 or j < 0:
        raise ValueError('返回里没有 JSON: ' + txt[:120])
    return json.loads(s[i:j + 1])


if __name__ == '__main__':
    print(generate('用一句话说明紧固件出口非洲要关注什么。'))
