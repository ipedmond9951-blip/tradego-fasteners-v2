# 内容队列与排期（TradeGo 独立站）

本目录是 `scripts/publish-queue.sh` 的投稿箱：Agent 直写好的文章 JSON 放这里，脚本每天 10:00（机器 PST，约北京时间次日 02:00）校验并发布，空队列时静默退出。

## 入库门槛（脚本强制）

- 必填字段：`slug` `category` `date` `title` `description` `metaDescription` `sections`
- `title` / `description` / `metaDescription` 必须 **10 语齐全**（en zh es fr pt ar ru ja de hi），不接受非空占位或英文原文混入
- `sections` ≥ 4 段，正文合计 ≥ 300 词
- 同名 slug 已存在于 `content/articles/` 时跳过并归档到 `_done/`；不达标移入 `_rejected/`
- 单次最多发布 2 篇，发布后自动 commit + fetch/rebase + push（触发 Vercel 部署）

## 写作约定

- 选题必须是"某国 + 某采购问题"，不要写成通用科普；每篇落到具体港口、标准号、图纸参数或成本口径
- `image` 复用 `public/images/products/` 已有产品图，不新造衍生图
- 正文当前体系为 `sections[].body` 的 en / zh 双份（页面按 `localizedText(body, locale)` 回落）；标题与描述必须十语原生
- `relatedProducts` 指向现有产品 slug（见 `src/lib/products.ts`），`cta.link` 指向对应产品页
- `category` 用现有分类，避免新造分类页

## 排期（8 周 × 3 篇，周一 / 周三 / 周五）

| 周 | 日期 | 选题 | 市场 | 状态 |
|---|---|---|---|---|
| W1 | 11-25 | Tanzania: IBR 屋面钉与自钻屋面钉在达累斯萨拉姆仓库屋面的取舍 | TZ | 已入队 |
| W1 | 11-27 | Ghana: 海岸盐雾环境下热镀锌与不锈钢紧固件的选择 | GH | 待写 |
| W1 | 11-30 | Zambia: 铜矿用 8.8 与 10.9 级螺栓的选型与验收 | ZM | 待写 |
| W2 | 12-02 | Egypt: 木结构连接件 CE 与 EN 14592 的申报要点 | EG | 待写 |
| W2 | 12-04 | Kenya: 蒙巴萨港清关单证清单与紧固件进口实操 | KE | 待写 |
| W2 | 12-07 | Ethiopia: 户外光伏支架热镀锌层厚的图纸写法 | ET | 待写 |
| W3 | 12-09 | Nigeria: 拉各斯陆运与阿帕帕港——每柜紧固件的内陆运费口径 | NG | 待写 |
| W3 | 12-11 | South Africa: SANS 135 结构螺栓合规自查清单 | ZA | 待写 |
| W3 | 12-14 | Morocco: CE 标识与法语数据表的双重要求 | MA | 待写 |
| W4 | 12-16 | Uganda: 0.4 与 0.47 板厚的固定密度差异 | UG | 待写 |
| W4 | 12-18 | Tanzania: 12.5mm 石膏板配轻钢龙骨的钉距 | TZ | 待写 |
| W4 | 12-21 | Ghana: 特马港滞港费——紧固件买家的到港节奏控制 | GH | 待写 |
| W5 | 12-23 | Zambia: 光伏地锚的埋深与抗拔 | ZM | 待写 |
| W5 | 12-25 | Botswana: 卡拉哈里砂土条件下的化学锚栓选型 | BW | 待写 |
| W5 | 12-28 | Mozambique: 贝拉与纳卡拉走廊的钢材紧固件运输路线 | MZ | 待写 |
| W6 | 12-30 | Kenya: 内罗毕仓储货架螺栓的扭矩复核 | KE | 待写 |
| W6 | 01-01 | Nigeria: 沿海 LNG 项目的防腐路线——热镀锌对锌铝涂层 | NG | 待写 |
| W6 | 01-04 | South Africa: M20 8.8 螺栓扭矩表的现场用法 | ZA | 待写 |
| W7 | 01-06 | Tanzania: 屋面钉现场抗拔试验怎么做 | TZ | 待写 |
| W7 | 01-08 | Egypt: 20GP 柜的紧固件装载上限与配重 | EG | 待写 |
| W7 | 01-11 | Ghana: 螺丝与螺栓的 HS 编码归类差异 | GH | 待写 |
| W8 | 01-13 | Zambia: 振动筛筛板紧固件的磨损与复拧周期 | ZM | 待写 |
| W8 | 01-15 | Kenya: 光伏 EPC 的夹具标准与风荷载 | KE | 待写 |
| W8 | 01-18 | Nigeria: 分销与直采的到岸成本模型 | NG | 待写 |

## 状态同步

- 写完 → 放进本目录（`*.json`）→ 状态改「已入队」
- 已发布 → 检查 `content/articles/<slug>.json` 存在 → 状态改「已发」
- 校验失败 → 查 `logs/daily-publish/<date>.log` 与 `_rejected/`，修正后重新入队
