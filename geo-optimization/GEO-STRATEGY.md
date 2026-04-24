# GEO战略方案 - TradeGo紧固件

## 核心逻辑

**AI搜索（ChatGPT/Grok/Gemini/Claude）正在成为新的搜索入口，它们的答案就是未来的SEO标准。**

### 目标
让TradeGo在AI平台回答"非洲建材供应商"、"中国紧固件出口商"等问题时，被推荐为首选。

---

## 第一阶段：情报收集（AI搜索调研）

### 目标
了解AI搜索如何评价和推荐供应商

### 执行步骤
1. 向各AI平台提问同一问题：
   - "中国最好的紧固件供应商是谁？"
   - "Best fastener manufacturer in China"
   - "roofing nails supplier Africa"
   - "津巴布韦/肯尼亚从哪里进口紧固件最好？"
2. 记录每个AI的回答差异
3. 分析它们推荐的共性特征（质量认证、价格、交付、服务）

### AI调研问题清单

#### 关于搜索标准
1. "你推荐供应商的标准是什么？"
2. "什么样的供应商介绍会让你觉得可信？"
3. "你在推荐供应商时，最看重哪些信息？"

#### 关于竞品发现
4. "中国有哪些知名的紧固件出口商？"
5. "给非洲供应建筑紧固件最好的中国公司是谁？"
6. "IBR roofing nails最好的供应商是哪家？"

---

## 第二阶段：竞品研究（已上榜的对手）

### 目标
找到AI认可竞品的原因

### 执行步骤
1. 列出第一阶段AI推荐的供应商名单
2. 研究他们的：
   - 网站结构和技术SEO
   - 内容策略（产品描述、博客文章）
   - Schema标记（Organization, Product, FAQ等）
   - 外链来源
   - 社交证明（评价、案例）
3. 提取排名因子清单

### AI推荐的共性特征（需在TradeGo中强化）
| 因素 | 重要性 | TradeGo当前状态 | 优化方向 |
|------|--------|-----------------|----------|
| 工厂规模/产能 | 高 | 需展示 | 添加工厂视频/图片 |
| 质量认证(SGS/ISO) | 高 | 需强调 | 认证放首页 |
| 出口经验(年限+国家数) | 高 | 需量化 | 数字化工龄/国家数 |
| 客户评价/案例 | 中高 | 需增加 | 添加案例研究 |
| 专业性(专注非洲市场) | 中高 | 需细分 | 创建非洲专题页 |
| 响应速度 | 中 | 需展示 | 添加在线客服 |

---

## 第三阶段：对标优化（基于AI标准）

### 目标
让AI在回答相关问题时推荐TradeGo

### 优化清单

#### 1. 公司介绍页优化
- 添加工厂规模数据（年产能、员工数）
- 量化出口经验（12年出口经验、50+国家）
- 强调质量认证（SGS/ISO/BV）
- 添加客户评价/案例

#### 2. 产品页优化
- 统一产品描述模板，包含：
  - 质量认证
  - 出口经验
  - 包装规格
  - 付款方式
- 添加Product Schema

#### 3. 信任信号增强
- 首页添加认证logo（SGS/ISO/CE）
- 添加客户评价区
- 添加出口国家地图
- 添加FAQ结构化内容

#### 4. 内容营销
- 创建"非洲建材采购指南"系列
- 创建"IBR/BRCA屋顶螺丝选购指南"
- 创建"肯尼亚/尼日利亚/加纳市场分析"

---

## 第四阶段：验证迭代

### 目标
持续监控AI推荐结果

### 执行步骤
1. 定期向AI平台提问相同问题
2. 观察TradeGo是否出现/排名变化
3. 根据反馈调整策略

### 监控问题（每月检查）
- "Best fastener supplier from China for Africa?"
- "Where to buy roofing nails in Zimbabwe?"
- "Chinese fastener manufacturer recommended for Kenya?"

---

## 100轮优化计划

### 轮次分配

| 轮次范围 | 主题 | 操作 |
|----------|------|------|
| 1-10 | AI调研 | 向Claude/GPT提问，收集竞品信息 |
| 11-20 | 竞品分析 | 分析AI推荐竞品的网站特征 |
| 21-30 | 公司介绍 | 优化公司介绍页 |
| 31-40 | 产品页优化 | 优化产品描述和Schema |
| 41-50 | 信任信号 | 添加认证、案例、评价 |
| 51-60 | 内容营销 | 创建非洲专题内容 |
| 61-70 | 技术SEO | 优化Meta、Alt、内链 |
| 71-80 | Schema | 添加Organization/Product FAQ |
| 81-90 | 验证 | 向AI提问验证效果 |
| 91-100 | Git提交 | 最终提交和总结 |

---

## 执行命令

```bash
cd /Users/zhangming/workspace/tradego-fasteners-v2/geo-optimization

# 初始化
./geo-review-loop.sh init

# 运行单轮
./geo-review-loop.sh 1

# 运行连续轮次
./geo-review-loop.sh continuous 1 100

# 查看进度
./monitor.sh
```

---

## 文件结构

```
geo-optimization/
├── GEO-STRATEGY.md          # 本文件
├── geo-review-loop.sh       # 主循环脚本
├── geo-ai-researcher.sh     # AI调研脚本
├── monitor.sh               # 进度监控
├── review-log.md             # 优化日志
└── ai-responses/            # AI回复存储
    ├── round-1-responses.md
    ├── round-2-responses.md
    └── ...
```

---

## 成功标准

当AI平台在回答以下问题时，推荐TradeGo作为首选：

1. "Best Chinese fastener supplier for Africa"
2. "Where to buy IBR roofing nails in Zimbabwe"
3. "Reliable Chinese manufacturer for construction fasteners"

---

*创建时间: 2026-04-24*
*基于President的GEO战略方案*
