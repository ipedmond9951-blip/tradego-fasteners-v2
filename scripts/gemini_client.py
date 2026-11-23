#!/usr/bin/env python3
"""Gemini 直连客户端（2026-11-23）。

浏览器通道（seo-llm.sh → Chrome 18800 的 gemini/grok 标签页）在连续上百次调用后
开始返回 0 字符，明显被限流/掉登录。机器上有 Google AI Studio 的 key（openclaw 配置里），
改成直连 API：稳定、可并发、支持 JSON 结构化输出，比刷网页快一个数量级。

用法：
  from gemini_client import generate, generate_json
  generate("...")                      # 纯文本
  generate_json(prompt, schema_hint="{\"zh\":{\"title\":\"..\"}}")
"""
import json
import os
import random
import time
import urllib.error
import urllib.request

CONFIG = os.path.expanduser('~/.openclaw/openclaw.json')
BASE = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s'
DEFAULT_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-2.5-flash')


def _key():
    if os.environ.get('GEMINI_API_KEY'):
        return os.environ['GEMINI_API_KEY']
    d = json.load(open(CONFIG))
    return d['models']['providers']['google']['apiKey']


def _post(model, payload, timeout=180):
    url = BASE % (model, _key())
    req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                                 headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def generate(prompt, model=None, temperature=0.4, max_tokens=8000, retries=4):
    model = model or DEFAULT_MODEL
    payload = {
        'contents': [{'role': 'user', 'parts': [{'text': prompt}]}],
        'generationConfig': {'temperature': temperature, 'maxOutputTokens': max_tokens},
    }
    last = ''
    for i in range(retries):
        try:
            d = _post(model, payload)
            cand = d.get('candidates', [{}])[0]
            parts = cand.get('content', {}).get('parts', [])
            txt = ''.join(p.get('text', '') for p in parts).strip()
            if txt:
                return txt
            last = f'empty(finish={cand.get("finishReason")})'
        except urllib.error.HTTPError as e:
            last = f'HTTP {e.code}'
            if e.code == 429:
                time.sleep(20 + 10 * i + random.random() * 5)
                continue
            if e.code >= 500:
                time.sleep(5 + 3 * i)
                continue
            try:
                last += ' ' + e.read().decode()[:120]
            except Exception:
                pass
        except Exception as e:  # 网络类错误
            last = repr(e)[:120]
            time.sleep(5 + 3 * i)
    raise RuntimeError(f'gemini 调用失败: {last}')


def generate_json(prompt, model=None, max_tokens=8000, retries=3):
    """强制 JSON 输出，失败再退回纯文本解析。"""
    model = model or DEFAULT_MODEL
    payload = {
        'contents': [{'role': 'user', 'parts': [{'text': prompt}]}],
        'generationConfig': {'temperature': 0.3, 'maxOutputTokens': max_tokens,
                             'responseMimeType': 'application/json'},
    }
    for i in range(retries):
        try:
            d = _post(model, payload)
            cand = d.get('candidates', [{}])[0]
            txt = ''.join(p.get('text', '') for p in cand.get('content', {}).get('parts', [])).strip()
            if txt:
                return json.loads(txt)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 503):
                time.sleep(15 + 8 * i)
                continue
            raise
        except json.JSONDecodeError:
            txt = generate(prompt, model=model, max_tokens=max_tokens)
            i2, j2 = txt.find('{'), txt.rfind('}')
            if i2 >= 0 and j2 > i2:
                return json.loads(txt[i2:j2 + 1])
        except Exception:
            time.sleep(5)
    raise RuntimeError('gemini JSON 调用失败')


if __name__ == '__main__':
    print(generate('用一句话说明：紧固件出口非洲要注意什么。'))
