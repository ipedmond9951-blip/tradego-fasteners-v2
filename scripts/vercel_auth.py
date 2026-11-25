#!/usr/bin/env python3
"""vercel_auth.py — 全项目唯一的 Vercel token 取用入口（可 import）。

坑（2026-11-26 实测）：`~/Library/Application Support/com.vercel.cli/auth.json` 里的 token
会过期（`expiresAt`，秒级）。它只在 CLI 有联网动作时才自动续期，后台脚本直接读文件常读到
过期 token，API 返回 invalidToken → 预算回退本地台账、审计读不到数、prune/promote 全挂。

规则：任何脚本都不许自己 open(auth.json) 拿 token，一律：
  from vercel_auth import get_token, api_get
  tok = get_token()                 # 需要时自动续期
  data = api_get("https://api.vercel.com/v6/deployments?limit=100")

get_token 会先看 expiresAt，快过期就跑一次 `vercel whoami` 让 CLI 用 refreshToken 换新再重读；
api_get 遇到 401/403 会自动续期重试一次。
"""
import json
import os
import subprocess
import time
import urllib.error
import urllib.request

AUTH = os.path.expanduser("~/Library/Application Support/com.vercel.cli/auth.json")
SKEW = 300  # 提前 5 分钟算过期，避免刚好卡在边界


def _load():
    try:
        with open(AUTH) as f:
            return json.load(f)
    except Exception:
        return {}


def _fresh(d):
    exp = d.get("expiresAt")
    if not exp:
        return False
    return time.time() < float(exp) - SKEW


def _refresh():
    # whoami 是最轻的联网动作，CLI 会在需要时用 refreshToken 换新 token 写回 auth.json
    try:
        subprocess.run(["vercel", "whoami"], capture_output=True, timeout=60)
    except Exception:
        pass


def get_token(force=False):
    """返回当前可用 token；过期/缺失时先让 CLI 续期。失败抛 RuntimeError。"""
    d = _load()
    if force or not d.get("token") or not _fresh(d):
        _refresh()
        d = _load()
    tok = d.get("token")
    if not tok:
        raise RuntimeError("没有可用的 Vercel token（终端里跑一次 vercel login）")
    return tok


def api_get(url, timeout=20, force_retry=True):
    """GET 一个 api.vercel.com JSON 接口；401/403 时强制续期重试一次。"""
    def _once(tok):
        req = urllib.request.Request(url, headers={"Authorization": "Bearer " + tok})
        return json.load(urllib.request.urlopen(req, timeout=timeout))

    tok = get_token()
    try:
        return _once(tok)
    except urllib.error.HTTPError as e:
        if force_retry and e.code in (401, 403):
            return _once(get_token(force=True))
        raise
