# 认证表述复核（2026-11-26）

> 目的：把 `check-cert-claims.py` 的「待复核」从 35 处收敛到 0，同时不误删合法的市场描述。基线机制落 `content/cert-claims-baseline.json`。

## 一、结论

| 类别 | 数量 | 处置 |
|---|---|---|
| 初检命中 | 35 处 / 28 文件 | 逐条人工判定 |
| 真违规（暗示本站/我们的产品已持证） | 4 处 | 已改写 |
| 第三方/市场要求描述（非本站自述） | 32 处 | 登记基线，不再每周报警 |
| 复核后剩余 | **0 处** | — |

## 二、改写的 4 处

| 文件 | 位置 | 原文 | 改后 |
|---|---|---|---|
| `china-hex-nuts-manufacturer` | description 10 语种 | "Find ISO 9001 certified hex nut suppliers…" / "寻找通过 ISO 9001 认证的…供应商" | "Producers work to ISO 9001 and DIN 934; certificates on request." / "按 ISO 9001 与 DIN 934 生产，证书按订单要求提供…" |
| `solar-panel-mounting-fasteners-africa` | FAQ 第 5 条 a（en/zh） | "Our solar fasteners meet ISO 9001 quality standards…" / "我们的太阳能紧固件符合 ISO 9001 质量标准…" | "…produced under an ISO 9001-aligned quality system, with material certificates available on request…" / "…按 ISO 9001 质量管理体系生产，材质与检测证书按订单要求提供…" |
| `mining-fasteners-africa` | sections[3].body.ja | "- ISO 9001:2015認証取得済み製造" | "- ISO 9001:2015 の品質管理体系に沿って製造（証明書はご依頼に応じて提供）" |
| `durban-fastener-supplier` | sections[1].body.ja | "IBR屋根用釘およびねじ（SABS認証済み）" | "（SABS 1195 に準拠、検査書類を添付）" |

判定标准只用一条：**句子主语是否指向本站/我们的产品**。指向第三方（南非品牌、客户、行业惯例、采购建议）的，保留原文；指向我们且含"已取得/已通过/持有/認証済み"的，一律改成"按 SABS 1195 / DIN / ISO 生产"或"证书按订单要求提供"。

## 三、基线机制怎么工作

- `scripts/check-cert-claims.py` 增加 `--write-baseline`；已复核判定为非违规的句子按「slug + 句子 sha1」写入 `content/cert-claims-baseline.json`。
- 之后每次跑脚本，基线内的句子跳过；**新出现的句子照常报警**，不会因为基线而漏掉新违规。
- 句子一旦被改写，哈希变化 → 自动重新进入待复核，不会"洗白"。
- 周检（`weekly-audit.sh`）读到 0 处即判 ✅。

## 四、后续

- 存量 A1 认证红点（`docs/compliance-redspots-2026-1126.md` 记的 70 篇）仍未按篇清；本次只清"自述持证"这一类高风险句式。
- 语种一致性抽查：`mining-fasteners-africa` 与 `durban-fastener-supplier` 只改了 ja 一处，其余语种若存在同义句，下一批用 `check-body-lang` + `faq_audit` 一起扫。
