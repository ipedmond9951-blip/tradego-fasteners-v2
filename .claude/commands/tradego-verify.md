# /tradego-verify

> 部署前的自动化检查。所有代码修改上线前必须通过。
> 根据修改类型决定检查深度（见下方分类）。

## 触发时机
`/tradego-deploy` 前自动调用，或手动说"帮我检查一下"

---

## 检查流程

### 1. 确定修改类型

```bash
cd ~/workspace/tradego-fasteners-v2
git diff --stat HEAD
```

根据变更文件判断：

| 文件类型 | 修改类型 |
|---------|---------|
| `src/content/` `scripts/` `public/images/` | 内容修改 |
| `src/styles/` `src/components/` (样式) | 样式调整 |
| `src/lib/` `src/app/` `src/pages/` | 代码修改 |
| 混合 | 取最高风险类型 |

---

### 2. 自动化检查（所有类型都跑）

#### 2.1 Lint检查
```bash
cd ~/workspace/tradego-fasteners-v2
npm run lint 2>&1
```
**失败标准**：exit code != 0 → 停止，修复后再继续

#### 2.2 构建测试
```bash
cd ~/workspace/tradego-fasteners-v2
npm run build 2>&1 | tail -30
```
**失败标准**：exit code != 0 → 停止，修复后再继续

#### 2.3 SEO图片检查（内容修改时必须）
```bash
cd ~/workspace/tradego-fasteners-v2
# 检查最近修改的图片
git diff --name-only HEAD | grep -E "\.(jpg|jpeg|png|webp)$" | while read f; do
  size=$(stat -f%z "public/$f" 2>/dev/null || echo "0")
  if [ "$size" -lt 102400 ]; then
    echo "⚠️ $f 文件太小: $size bytes (建议 >100KB)"
  fi
done
```
**警告标准**：图片 < 100KB → 警告但不阻止，提示修复

---

### 3. 输出验证报告

通过所有检查后输出：

```
## ✅ Verify通过

检查时间：<YYYY-MM-DD HH:MM>
修改类型：<内容/样式/代码>
检查项：
  ✅ Lint: 通过
  ✅ Build: 通过
  ✅ SEO图片: <通过/有X个警告>

可以去 Review 了。
```

有任何失败：

```
## ❌ Verify失败

检查项：
  ❌ Lint: 失败（<错误摘要>）
     → 修复命令: npm run lint  查看完整错误
  
  ❌ Build: 失败
     → 修复命令: npm run build  查看完整错误

🚫 请修复后再继续，不要跳过。
```

---

## 简化版（紧急hotfix时）

当总裁说"紧急，先上线再说"时：

```bash
cd ~/workspace/tradego-fasteners-v2
npm run lint -- --max-warnings=100  # 容许warning但不阻止
npm run build  # 必须成功
echo "✅ 简化Verify完成，请尽快补全检查"
```

**简化版只能用于紧急情况**，事后必须补全完整检查。

---

*融合：Addy Osmani的Verify步骤 + TradeGo部署教训*
*必读：TOOLS.md里的Vercel部署红线*