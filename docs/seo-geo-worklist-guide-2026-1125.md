# SEO/GEO 整改工单使用说明（2026-11-25）

工单文件：`docs/seo-geo-worklist-2026-1125.csv`（到期重跑即更新）
生成命令：`python3 scripts/build-seo-geo-worklist.py`
口径来源：`docs/SEO-GEO-STRATEGY.md` 第 1 节基线与第 5 节批次定义。**本工单不另立标准**，策略文件改了口径，重跑脚本即可，别手改 CSV。

## 一行是什么意思

一行 = 一篇 × 它的全部问题。`batch` 是最早该做的批次，`batches` 列出全部适用批次，`issues` 是问题标签，`actions` 是可以照着做的动作。

| 标签 | 判据 | 批次 |
|---|---|---|
| `title>55` | 英文标题 >55 字符（线上会被代码 slice 截断） | 1 |
| `meta>160` | 描述 >160 字符 | 1 |
| `ctr<1%` | GSC 曝光 ≥100 且 CTR <1%（P0 清单内） | 1 |
| `echo` | 首段逐字复述标题 | 2 |
| `p1_out` | 首段不在 40–130 词 | 2 |
| `ent<2` | 可核实体密度 <2 / 千词 | 2 |
| `zh_thin` | 中文节覆盖 <0.2 | 3 |
| `template` | 模板填充 ≥50%（`check-template-filler.py`） | 3 |
| `orphan` | 零站内文章入链 | 3 |

## 当前分布（2026-11-25 实测，264 篇有效文章）

批次成员数：**批 1 = 117 篇、批 2 = 200 篇、批 3 = 92 篇、批 4 = 29 篇**。
问题数：echo 142 / p1_out 76 / zh_thin 72 / title>55 70 / ent<2 63 / meta>160 31 / template 30 / orphan 28 / ctr<1% 27。

与策略文件基线交叉验证：标题 70 vs 71、meta 31 vs 31、orphan 28 vs 29、echo 142 vs 145、ent 63 vs 63 —— 差异都在"这几篇刚被改过"的量级，说明工单与基线同源，不是两套账。

## 怎么用

1. **批 0 没通之前不动正文**。上线通道是当前第一瓶颈；批 0 未完成时只读本表、排好顺序，不 commit 正文。
2. 领租约再动手：`python3 scripts/article-claim.py claim <slug> <线名>`，拿不到就换下一篇。
3. 按 `batch` 升序、同批次内按 `exposure` 降序做。
4. 每篇改完的闸门（缺一不算完成）：
   ```bash
   python3 scripts/content_gate.py --slug <slug>
   python3 scripts/check-claims.py
   python3 scripts/check-body-lang.py --slug <slug>
   python3 scripts/geo_audit.py --slug <slug>
   ```
5. 改完 `release` 租约，重跑 `build-seo-geo-worklist.py` 看该篇是否掉出原批次——**掉批次才算真改完**，不然只是改了个字数。

## 排序上要注意的两件事

- `batch` 是"最早该做"，不代表只需要做那一件；`batches` 里同时有 1 和 3 的篇，标题改完后依旧要做 zh 补齐。
- 先去重、再补内容。同一篇既有 `template` 又有 `zh_thin` 时，按 4 节骨架重写一并解决两项，别分两次动同一篇 JSON（这也是上次整篇覆盖事故的成因）。
