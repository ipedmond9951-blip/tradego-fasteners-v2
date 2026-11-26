# R-T9j 轮名单（冻结版，2026-11-26）

> 生成命令：`python3 scripts/faq_audit.py --csv docs/faq-native-gap-2026-1126.csv`
> 筛选口径：`content/articles/*.json` 中 **不在 A 区名单**（`docs/seo-geo-main-owned-40-2026-1125.csv` 的 `slug` 列，39 条）**且 `git status` 干净**（排除 8 个在途文件）。
> 冻结时间：开跑前。**名单冻结后不再追加**；中途新出现的缺口记入下一轮（R-T9k）。

## 0. 冻结时的实测缺口（B 区 · 干净文件）

| 语种 | 缺篇 | 缺条 | 批数 | 每批篇次 |
|---|---|---|---|---|
| 俄语 ru | 19 | 63 | 2 | 10, 9 |
| 简体中文 zh | 17 | 49 | 2 | 10, 7 |
| 印地语 hi | 20 | 68 | 2 | 10, 10 |
| 西班牙语 es | 168 | 627 | 21 | 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8 |
| 法语 fr | 176 | 631 | 22 | 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8 |
| 德语 de | 185 | 683 | 24 | 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1 |
| 葡语 pt | 167 | 625 | 21 | 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7 |
| 日语 ja | 163 | 660 | 21 | 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3 |
| **合计** | **915 篇次** | **3406 条** | **115 批** | — |

- 另有 **4 篇在途冻结**（`africa-fastener-market-opportunities-2026`、`china-fasteners-zimbabwe-procurement-guide`、`ghana-fastener-market-guide`、`drc-diamond-mining-fasteners`）：`git status` 仍为 ` M`，本轮**不碰**，ru/ar 缺口继续登记（与上一轮同）。
- A 区 39 篇的语种缺口不计入本轮（归 A 线）。

## 1. 排序与并发

| 阶段 | 语种 | 并发 | 说明 |
|---|---|---|---|
| 1 | ru | 1 | 3 篇保护名单仍脏 → 只补 19 篇干净文件（63 条）；判据 `check_ru.py`（西里尔 ≥73%、词级 6-gram） |
| 2 | zh / hi | 各 1 | zh 49 条（判据 `check_zh.py`）；hi 68 条（判据 `check_hi.py`，**答案下限已由 80 提到 120**，另需回补 `rwanda-construction-fastener-market-2026` #5–7 三条 80/99/95 字符） |
| 3 | es / fr / pt / de | 每语种 5 | 本轮主战场（696 篇次 / 2566 条），统一判据 `check_latin.py`（语言纯度 ≥0.55，停用词+变音符双指标，四语种交叉判别） |
| 4 | ja | 5 | 最后跑（163 篇 / 660 条），判据 `check_ja.py` |

**时间闸**：6 小时软上限；4.5 小时后若 es/fr/de/pt 未收口，按 `es → fr → pt → de → ja` 保留已完成整批，剩余写进下一轮，不提交半成品文章。

## 2. 批次表（每批 8 篇 × 单语种；ru/zh/hi/ja 按批 10 篇）

### 俄语 ru（19 篇 / 63 条 / 2 批）

| 批 | 篇 | 条 | 英文量 | 文件 |
|---|---|---|---|---|
| ru-01 | 10 | 39 | 32714 | `t9j/batches/ru-01.txt` |
| ru-02 | 9 | 24 | 17824 | `t9j/batches/ru-02.txt` |

### 简体中文 zh（17 篇 / 49 条 / 2 批）

| 批 | 篇 | 条 | 英文量 | 文件 |
|---|---|---|---|---|
| zh-01 | 10 | 36 | 33171 | `t9j/batches/zh-01.txt` |
| zh-02 | 7 | 13 | 10573 | `t9j/batches/zh-02.txt` |

### 印地语 hi（20 篇 / 68 条 / 2 批）

| 批 | 篇 | 条 | 英文量 | 文件 |
|---|---|---|---|---|
| hi-01 | 10 | 39 | 33473 | `t9j/batches/hi-01.txt` |
| hi-02 | 10 | 29 | 20165 | `t9j/batches/hi-02.txt` |

### 西班牙语 es（168 篇 / 627 条 / 21 批）

| 批 | 篇 | 条 | 英文量 | 文件 |
|---|---|---|---|---|
| es-01 | 8 | 35 | 27706 | `t9j/batches/es-01.txt` |
| es-02 | 8 | 38 | 18843 | `t9j/batches/es-02.txt` |
| es-03 | 8 | 33 | 16393 | `t9j/batches/es-03.txt` |
| es-04 | 8 | 38 | 14765 | `t9j/batches/es-04.txt` |
| es-05 | 8 | 30 | 13164 | `t9j/batches/es-05.txt` |
| es-06 | 8 | 33 | 11168 | `t9j/batches/es-06.txt` |
| es-07 | 8 | 31 | 9669 | `t9j/batches/es-07.txt` |
| es-08 | 8 | 32 | 8808 | `t9j/batches/es-08.txt` |
| es-09 | 8 | 30 | 8169 | `t9j/batches/es-09.txt` |
| es-10 | 8 | 29 | 7545 | `t9j/batches/es-10.txt` |
| es-11 | 8 | 36 | 7078 | `t9j/batches/es-11.txt` |
| es-12 | 8 | 31 | 6594 | `t9j/batches/es-12.txt` |
| es-13 | 8 | 30 | 6312 | `t9j/batches/es-13.txt` |
| es-14 | 8 | 27 | 5903 | `t9j/batches/es-14.txt` |
| es-15 | 8 | 28 | 5670 | `t9j/batches/es-15.txt` |
| es-16 | 8 | 25 | 5294 | `t9j/batches/es-16.txt` |
| es-17 | 8 | 24 | 5041 | `t9j/batches/es-17.txt` |
| es-18 | 8 | 25 | 4867 | `t9j/batches/es-18.txt` |
| es-19 | 8 | 24 | 4579 | `t9j/batches/es-19.txt` |
| es-20 | 8 | 24 | 4338 | `t9j/batches/es-20.txt` |
| es-21 | 8 | 24 | 3770 | `t9j/batches/es-21.txt` |

### 法语 fr（176 篇 / 631 条 / 22 批）

| 批 | 篇 | 条 | 英文量 | 文件 |
|---|---|---|---|---|
| fr-01 | 8 | 28 | 28993 | `t9j/batches/fr-01.txt` |
| fr-02 | 8 | 43 | 19350 | `t9j/batches/fr-02.txt` |
| fr-03 | 8 | 34 | 16619 | `t9j/batches/fr-03.txt` |
| fr-04 | 8 | 36 | 14911 | `t9j/batches/fr-04.txt` |
| fr-05 | 8 | 30 | 13412 | `t9j/batches/fr-05.txt` |
| fr-06 | 8 | 35 | 11417 | `t9j/batches/fr-06.txt` |
| fr-07 | 8 | 31 | 9714 | `t9j/batches/fr-07.txt` |
| fr-08 | 8 | 32 | 8808 | `t9j/batches/fr-08.txt` |
| fr-09 | 8 | 21 | 8258 | `t9j/batches/fr-09.txt` |
| fr-10 | 8 | 15 | 8076 | `t9j/batches/fr-10.txt` |
| fr-11 | 8 | 28 | 7616 | `t9j/batches/fr-11.txt` |
| fr-12 | 8 | 35 | 7144 | `t9j/batches/fr-12.txt` |
| fr-13 | 8 | 32 | 6630 | `t9j/batches/fr-13.txt` |
| fr-14 | 8 | 30 | 6362 | `t9j/batches/fr-14.txt` |
| fr-15 | 8 | 28 | 5938 | `t9j/batches/fr-15.txt` |
| fr-16 | 8 | 27 | 5701 | `t9j/batches/fr-16.txt` |
| fr-17 | 8 | 25 | 5294 | `t9j/batches/fr-17.txt` |
| fr-18 | 8 | 24 | 5041 | `t9j/batches/fr-18.txt` |
| fr-19 | 8 | 25 | 4867 | `t9j/batches/fr-19.txt` |
| fr-20 | 8 | 24 | 4579 | `t9j/batches/fr-20.txt` |
| fr-21 | 8 | 24 | 4338 | `t9j/batches/fr-21.txt` |
| fr-22 | 8 | 24 | 3770 | `t9j/batches/fr-22.txt` |

### 德语 de（185 篇 / 683 条 / 24 批）

| 批 | 篇 | 条 | 英文量 | 文件 |
|---|---|---|---|---|
| de-01 | 8 | 35 | 34005 | `t9j/batches/de-01.txt` |
| de-02 | 8 | 52 | 21199 | `t9j/batches/de-02.txt` |
| de-03 | 8 | 39 | 17352 | `t9j/batches/de-03.txt` |
| de-04 | 8 | 38 | 15256 | `t9j/batches/de-04.txt` |
| de-05 | 8 | 34 | 13839 | `t9j/batches/de-05.txt` |
| de-06 | 8 | 30 | 11955 | `t9j/batches/de-06.txt` |
| de-07 | 8 | 35 | 10109 | `t9j/batches/de-07.txt` |
| de-08 | 8 | 33 | 9077 | `t9j/batches/de-08.txt` |
| de-09 | 8 | 23 | 8481 | `t9j/batches/de-09.txt` |
| de-10 | 8 | 14 | 8125 | `t9j/batches/de-10.txt` |
| de-11 | 8 | 24 | 7894 | `t9j/batches/de-11.txt` |
| de-12 | 8 | 33 | 7361 | `t9j/batches/de-12.txt` |
| de-13 | 8 | 32 | 6888 | `t9j/batches/de-13.txt` |
| de-14 | 8 | 28 | 6540 | `t9j/batches/de-14.txt` |
| de-15 | 8 | 29 | 6310 | `t9j/batches/de-15.txt` |
| de-16 | 8 | 27 | 5903 | `t9j/batches/de-16.txt` |
| de-17 | 8 | 28 | 5670 | `t9j/batches/de-17.txt` |
| de-18 | 8 | 25 | 5294 | `t9j/batches/de-18.txt` |
| de-19 | 8 | 24 | 5052 | `t9j/batches/de-19.txt` |
| de-20 | 8 | 25 | 4890 | `t9j/batches/de-20.txt` |
| de-21 | 8 | 24 | 4615 | `t9j/batches/de-21.txt` |
| de-22 | 8 | 24 | 4377 | `t9j/batches/de-22.txt` |
| de-23 | 8 | 24 | 3916 | `t9j/batches/de-23.txt` |
| de-24 | 1 | 3 | 376 | `t9j/batches/de-24.txt` |

### 葡语 pt（167 篇 / 625 条 / 21 批）

| 批 | 篇 | 条 | 英文量 | 文件 |
|---|---|---|---|---|
| pt-01 | 8 | 35 | 27706 | `t9j/batches/pt-01.txt` |
| pt-02 | 8 | 38 | 18843 | `t9j/batches/pt-02.txt` |
| pt-03 | 8 | 33 | 16393 | `t9j/batches/pt-03.txt` |
| pt-04 | 8 | 38 | 14765 | `t9j/batches/pt-04.txt` |
| pt-05 | 8 | 30 | 13164 | `t9j/batches/pt-05.txt` |
| pt-06 | 8 | 33 | 11168 | `t9j/batches/pt-06.txt` |
| pt-07 | 8 | 32 | 9669 | `t9j/batches/pt-07.txt` |
| pt-08 | 8 | 32 | 8808 | `t9j/batches/pt-08.txt` |
| pt-09 | 8 | 30 | 8169 | `t9j/batches/pt-09.txt` |
| pt-10 | 8 | 29 | 7545 | `t9j/batches/pt-10.txt` |
| pt-11 | 8 | 36 | 7078 | `t9j/batches/pt-11.txt` |
| pt-12 | 8 | 31 | 6594 | `t9j/batches/pt-12.txt` |
| pt-13 | 8 | 30 | 6312 | `t9j/batches/pt-13.txt` |
| pt-14 | 8 | 27 | 5903 | `t9j/batches/pt-14.txt` |
| pt-15 | 8 | 28 | 5631 | `t9j/batches/pt-15.txt` |
| pt-16 | 8 | 25 | 5248 | `t9j/batches/pt-16.txt` |
| pt-17 | 8 | 24 | 5024 | `t9j/batches/pt-17.txt` |
| pt-18 | 8 | 25 | 4832 | `t9j/batches/pt-18.txt` |
| pt-19 | 8 | 24 | 4552 | `t9j/batches/pt-19.txt` |
| pt-20 | 8 | 24 | 4295 | `t9j/batches/pt-20.txt` |
| pt-21 | 7 | 21 | 3255 | `t9j/batches/pt-21.txt` |

### 日语 ja（163 篇 / 660 条 / 21 批）

| 批 | 篇 | 条 | 英文量 | 文件 |
|---|---|---|---|---|
| ja-01 | 8 | 50 | 28770 | `t9j/batches/ja-01.txt` |
| ja-02 | 8 | 56 | 19848 | `t9j/batches/ja-02.txt` |
| ja-03 | 8 | 46 | 16840 | `t9j/batches/ja-03.txt` |
| ja-04 | 8 | 36 | 14884 | `t9j/batches/ja-04.txt` |
| ja-05 | 8 | 30 | 13164 | `t9j/batches/ja-05.txt` |
| ja-06 | 8 | 32 | 10806 | `t9j/batches/ja-06.txt` |
| ja-07 | 8 | 33 | 9296 | `t9j/batches/ja-07.txt` |
| ja-08 | 8 | 34 | 8567 | `t9j/batches/ja-08.txt` |
| ja-09 | 8 | 31 | 7873 | `t9j/batches/ja-09.txt` |
| ja-10 | 8 | 35 | 7194 | `t9j/batches/ja-10.txt` |
| ja-11 | 8 | 34 | 6657 | `t9j/batches/ja-11.txt` |
| ja-12 | 8 | 33 | 6325 | `t9j/batches/ja-12.txt` |
| ja-13 | 8 | 27 | 5903 | `t9j/batches/ja-13.txt` |
| ja-14 | 8 | 28 | 5670 | `t9j/batches/ja-14.txt` |
| ja-15 | 8 | 25 | 5294 | `t9j/batches/ja-15.txt` |
| ja-16 | 8 | 24 | 5057 | `t9j/batches/ja-16.txt` |
| ja-17 | 8 | 25 | 4920 | `t9j/batches/ja-17.txt` |
| ja-18 | 8 | 24 | 4649 | `t9j/batches/ja-18.txt` |
| ja-19 | 8 | 24 | 4410 | `t9j/batches/ja-19.txt` |
| ja-20 | 8 | 24 | 4021 | `t9j/batches/ja-20.txt` |
| ja-21 | 3 | 9 | 1279 | `t9j/batches/ja-21.txt` |

## 3. 判据与工具（全部位于本轮工作目录 `t9j/`）

| 脚本 | 判据 |
|---|---|
| `check_ru.py`（沿用） | 西里尔 ≥73%、答案长度、问句 `?`、词级 6-gram 跨篇不撞 |
| `check_zh.py` | 汉字占比 ≥55%、问句 8–70 且 `？` 结尾、答案 120–450、禁英文整句/异种文字 |
| `check_hi.py`（**下限 120**） | 天城文 ≥55%（目标 ≥71%）、答案 ≥120 字符、问句 8–140、禁 5+ 拉丁词、禁套话 |
| `check_latin.py` | 语言纯度 ≥0.55（归一化；等价于停用词密度 ≥ 存量中位 55%）、答案 120–450、问句 8–70 且 `?` 结尾、禁 4+ 英文功能词、四语种交叉判别 |
| `check_ja.py` | 假名+汉字 ≥60%、平假名 ≥5 个、禁中文简体专用字、问句以 `か`/`？` 结尾、答案 120–450 |

其它共用：`scripts/article-claim.py claim|release <slug> 今日头条分析`、`scripts/content_gate.py --slug`、`t9j/dedupe_<loc>.py`（词级 6-gram，≥15 判超标）。

## 4. 纪律（逐条照做）

R1 幂等 · R2 质量意见只登记 · R3 谁后补谁让位 · R4 写锁必领必释 · R5 在途不碰不 restore · R6 单文件 add+commit 同行 · R7 语种键只增不删 · R8 经验号段先 grep（**181–187 已被占用，本轮预约 188–193**）· R9 量具以最新 commit 为准。撞 `.git/index.lock` 只等 2 秒重试，不删锁。
