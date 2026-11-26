# SEO/GEO 周检 2026-11-26

生成：2026-11-26 15:45 CST｜站点 https://www.tradego-fasteners.com｜只读体检

规则：见 `docs/WEEKLY-AUDIT-SPEC.md`（每项都有阈值和处置动作）

## 1. GSC 读数

| 指标 | 当前 | 说明 |
|---|---|---|
| 点击 | 272 |  |
| 展示 | 26100 |  |
| CTR | 1.0% | <0.8% → P2 |
| 均排 | 13.1 |  |
| 已索引 | 1272 | 周环比 −5% → P1 |
| 未收录 | 4480 | 周环比 +10% → P1 |
| sitemap 条数 | 4101 |  |
| 结构化报错 | Review 175 / Video uploadDate 204 / Product price=0 36 |  |
| 重定向页 | 2104 |  |

快照日期：2026-11-23（3 天前）

阈值：索引 −5% / 未收录 +10% → P1；CTR <0.8% → P2。


## 2. 站点技术（12 项）

```
🔎 上线后复核 https://www.tradego-fasteners.com
页面          状态     title  desc hreflang  结论
首页 en       200       54   139       11  FAIL  ← robots 缺 max-image-preview:large
首页 zh       200       29   134       11  FAIL  ← robots 缺 max-image-preview:large
FAQ         200       63   196       10  FAIL  ← title 63>60; desc 196>155; robots 缺 max-image-preview:large
About       200       55   193       11  FAIL  ← desc 193>155; robots 缺 max-image-preview:large
Documents   200       65   225       10  FAIL  ← title 65>60; desc 225>155; robots 缺 max-image-preview:large
联系页         200       39   143       11  FAIL  ← robots 缺 max-image-preview:large
产品列表        200       47   160       11  FAIL  ← desc 160>155; robots 缺 max-image-preview:large
产品详情        200       61   105       11  FAIL  ← title 61>60; robots 缺 max-image-preview:large; 出现 meta keywords（应移除）
文章列表        200       49   157       11  FAIL  ← desc 157>155; robots 缺 max-image-preview:large
文章详情        200       45   139       11  FAIL  ← robots 缺 max-image-preview:large; 出现 meta keywords（应移除）
zh 产品列表     200       17    76       11  FAIL  ← robots 缺 max-image-preview:large
无前缀 308     307        -     -        -  FAIL  ← 期望 308，实际 307

合计: FAIL 11 / WARN 0 / 共 12 项
```

- **P1**：技术复核未通过，但本地有 1204 个未推提交 → 判定「待上线」，随下一次上线包修复；上线后必须重跑复验

## 3. 内容（闸门 / 模板文 / 语种混排 / 金额断言）

```
完全干净: 219 (83%) | 有 BLOCK: 0 (0%) | 新增 BLOCK: 0 篇（存量问题已按 /Users/zhangming/workspace/tradego-fasteners-v2/content/contract-baseline.json 放过）
```

```
模板文：2 / 279 篇（阈值 50%），命中小节 6 个
   60%  3/5  fastener-common-problems-solutions
   50%  3/6  high-strength-bolting-structural-steel
```

```
正文语种污染：english 0 处 / script 0 处 / label 0 处（无谓语、词组型，如产品名列表）/ noise 0 处
涉及文章 0 篇
```

```
金额断言：2163 处 / 49 篇，其中价格语义上下文 42 处
  harare-fastener-distributor-supplier-guide.json            金额  81  价格语义  42
  zimbabwe-import-duty-fastener-tariff-2026.json             金额 200  价格语义   0
  ghana-tema-port-fastener-import-procedure.json             金额 192  价格语义   0
```

- ✅ 内容闸门 0 BLOCK


## 4. GEO 可摘性

```
篇数 264 | 平均 69.1 | A 90+:49 B 80-89:27 C 70-79:43 D 60-69:68 E <60:77
首段复述标题(echo): 123 篇 | FAQ 不足 3 条: 0 篇 | 实体密度<2/千词: 44 篇

最差 5 篇:
 37  p1=149 echo=1 qh=0.0  ent=2.2  faq=5/41/q1.0  nigeria-lekki-port-construction-fastener-logistics
 40  p1=67  echo=1 qh=0.0  ent=0.0  faq=4/26/q1.0  africa-oil-refinery-high-pressure-fastener-guide
 40  p1=362 echo=1 qh=0.0  ent=12.5 faq=8/36/q1.0  botswana-fastener-supplier
 40  p1=274 echo=1 qh=0.0  ent=14.8 faq=5/24/q1.0  bulk-fastener-ordering-strategies
 40  p1=339 echo=1 qh=0.0  ent=11.7 faq=12/44/q1.0  drc-diamond-mining-fasteners
```

```
   62  asphalt-flash-band-buying-guide                      std,src,entity
   62  binding-wire-buying-guide                            std,src,entity
   62  roofing-screws-vs-ibr-nails                          std,src,entity
   67  chemical-anchors-buying-guide                        std,src
   67  chipboard-screws-buying-guide                        std,src
   67  coach-screws-buying-guide                            std,src
```

- **P1**：GEO 均分 69.1 <70（先补首段自证与实体密度，再段落去重）
阈值：GEO 均分 <70 → P1；<60 → P0。


## 5. 文案合规（认证 / 价格 / 地域）

```
✅ 文案体检通过：src 与 llms.txt 无过界表述
```

- ✅ UI 与 llms.txt 无过界表述

```
  mozambique-lng-construction-fasteners-standards      1
      [ZH-持有] ISO 9001认证代表最低质量体系要求，尽管许多液化天然气项目要求紧固件制造商的测试实验室获得ISO 17025认证。
  nigeria-lagos-fastener-import-wholesale-guide        1
      [RU-持有] Разграничение прямых ISO-сертифицированных заводов крепежа от посреднических торговых компаний является единственным наиболее значимым решением по зак
```

- **P1**：文章里仍有 13 处「持有认证」类表述（按批次清，改完跑 check-cert-claims 复验）
```
  kenya-affordable-housing-fasteners-wholesale.json          金额  89  价格语义   0
  morocco-casablanca-port-fastener-import-procedure.json     金额  86  价格语义   0
  kenya-infrastructure-fastener-demand.json                  金额  73  价格语义   0
```


## 6. 上线与部署预算

```
未推提交: 1204
工作区脏文件: 17
❌ 已达每日部署预算，本次 push 被拦下。
   原因: 每次部署都会新增 1–1.9GB 产物并重写全站预渲染缓存，Hobby 免费额度扛不住高频部署。
   把改动合并成一次提交再推；确需立即部署: DEPLOY_FORCE=1 git push
审计: 2026-11-26T15:26:06+08:00 exit 1 连续失败 3
```

- **P1**：未推提交 1204 个，超出单次上线合理包（应明确批次、一日只推一次）

## 7. 本周行动

共 **P0 0 条 / P1 4 条**。按 `docs/WEEKLY-AUDIT-SPEC.md` 处置：P0 当天、P1 本周内、P2 记录观察。

每条的定位命令见上文各节；修完重跑 `bash scripts/weekly-audit.sh` 复验。
