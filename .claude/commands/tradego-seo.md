# /tradego-seo

> SEO全面检查。跑auto-seo-v2.sh的干运行模式，生成审计报告，不实际执行修改。

## 触发条件
自动执行，不需要用户确认。

## 执行步骤

### 1. 运行干跑审计
```bash
cd ~/workspace/tradego-fasteners-v2
./scripts/auto-seo-v2.sh --dry-run
```

### 2. 生成审计报告
检查`SEO-AUDIT-$(date +%Y-%m-%d).md`是否存在，不存在则生成：
```bash
echo "# SEO审计报告 $(date +%Y-%m-%d)" > SEO-AUDIT-$(date +%Y-%m-%d).md
echo "" >> SEO-AUDIT-$(date +%Y-%m-%d).md
echo "## 干跑结果" >> SEO-AUDIT-$(date +%Y-%m-%d).md
./scripts/auto-seo-v2.sh --dry-run 2>&1 | tee -a SEO-AUDIT-$(date +%Y-%m-%d).md
```

### 3. 排名检查
```bash
cd ~/workspace/tradego-fasteners-v2
./scripts/check-rankings.sh
```

### 4. 输出结果
返回：
- 干跑发现的问题数量
- 排名检查结果摘要
- 审计报告位置

---

## 使用方法
```
/tradego-seo
```

## 输出格式
```
📊 SEO审计报告 [日期]

🔍 干跑检查结果：
- 低质量图片：X张（需处理）
- 缺失ALT标签：X张
- 损坏图片：X张

📈 排名状态：
- 核心关键词：排名位置
- ...

📋 详细报告：SEO-AUDIT-YYYY-MM-DD.md
```
