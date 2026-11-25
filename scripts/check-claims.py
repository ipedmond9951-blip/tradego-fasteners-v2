#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check-claims.py — 站内文案的"过界表述"体检（src + public/llms.txt）

content_gate 只查 content/articles，UI 文案（i18n json / tsx / llms.txt）没有闸门，
2026-11-25 两次漏都是漏在这里。本脚本补这条口子，命中即 exit 1。

四类检查：
  1. cert      自称已持有 ISO 9001 / CE / SABS；或"证书可按需提供"
  1b. cert-neg  明写"不持有/未持有/暂无认证"（用户口径：只写"按订单要求提供"）
  2. geo       地名超出 China 口径（含非拉丁写法）
  3. dupgeo    批量替换留下的重复残句（中国中国 / China (China) / China, na China）
  4. factory   工厂直供式产权表述（factory direct / 工厂直供 / 工場直送）
  5. markup    "无贸易加价"这类对贸易商站不住的表述

用法：
  python3 scripts/check-claims.py          # 命中明细 + exit 1
  python3 scripts/check-claims.py --quiet  # 只打结论
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGETS = ["src", "public/llms.txt"]
EXTS = (".ts", ".tsx", ".json", ".txt", ".md")

CERT = re.compile(
    r"(?:we|our\s+(?:factory|plant|company|mill)|TradeGo)[^.\n]{0,40}(?:ISO\s?9001|SABS|CE)\s*(?:-|\s|:)?\s*"
    r"(?:certified|approved|認証|認定|认证|認證|certificat\w*|zertifiziert|प्रमाणित|معتمد|сертифиц\w*)", re.I)
CERT_AVAIL = re.compile(r"(?:ISO\s?9001|CE|SABS)[^.\n]{0,30}(?:certificate|documentation)\s*(?:available|on request)", re.I)
GEO = re.compile(r"(Weifang|Shandong|潍坊|濰坊|Вэйфан|Шаньдун|وييفانغ|شاندونغ|शानदोंग|山東|वेइफ़ांग)")
DUP = re.compile(r"(中国中国|China\s*\(China\)|China,\s*na\s*China|位于中国中国)")
FACTORY = re.compile(r"(factory[\s-]direct|工厂直供|工場直送|usine\s+directe|fábrica\s+directa|direkt\s+ab\s+Werk)", re.I)
NEG = re.compile(r"(不持有|未持有|尚未取得|尚未获得|does not hold|do not hold|do not claim|besitzt heute keine|ne détient pas|no posee hoy|não possui hoje|لا تملك|لا نملك|保有していません|नहीं हैं)", re.I)
CERTWORD = re.compile(r"(certif|认证|認証|認證|Zertifikat|сертифи|प्रमाणपत्र|شهاد|اعتماد)", re.I)
MARKUP = re.compile(r"(no trading markup|无贸易加价|ohne Handelsmarge|sem margem de trading|без наценки посредника)", re.I)

# 允许语境：写"可按订单申请/on request 的检验"不算过界
ALLOW = re.compile(r"(可按订单|请办理|按订单申请|申請|ご注文|against your order|against the order|requirements of your order|requirements of their order|按订单要求|требования заказа|меңгер|विनिर्देश|وفق متطلبات|по запросу|अनुरोध|عند الطلب|मांग|申请办理)", re.I)

RULES = [("cert", CERT), ("cert-avail", CERT_AVAIL), ("cert-neg", NEG), ("geo", GEO), ("dupgeo", DUP), ("factory", FACTORY), ("markup", MARKUP)]


def iter_files():
    for t in TARGETS:
        p = os.path.join(ROOT, t)
        if os.path.isfile(p):
            yield p
            continue
        for dp, dn, fs in os.walk(p):
            dn[:] = [d for d in dn if d not in ("node_modules", "backup", ".next")]
            for f in fs:
                if f.endswith(EXTS) and ".backup" not in f:
                    yield os.path.join(dp, f)


def main():
    quiet = "--quiet" in sys.argv
    hits = []
    for fp in iter_files():
        try:
            lines = open(fp, encoding="utf-8", errors="ignore").read().splitlines()
        except Exception:
            continue
        for i, line in enumerate(lines, 1):
            if ALLOW.search(line):
                continue
            for name, rgx in RULES:
                m = rgx.search(line)
                if m:
                    if name == "cert-neg" and not CERTWORD.search(line):
                        continue
                    hits.append((name, os.path.relpath(fp, ROOT), i, m.group(0)[:60]))
                    break
    if hits:
        print("❌ 文案体检发现 %d 处过界表述：" % len(hits))
        if not quiet:
            for h in hits[:40]:
                print("  [%s] %s:%d  %s" % h)
            if len(hits) > 40:
                print("  ... 其余 %d 条省略" % (len(hits) - 40))
        raise SystemExit(1)
    print("✅ 文案体检通过：src 与 llms.txt 无过界表述")
    raise SystemExit(0)


if __name__ == "__main__":
    main()
