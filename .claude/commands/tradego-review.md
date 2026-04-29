# /tradego-review

> 代码审查。检查git变更，运行lint，审查关键文件变更的合理性。

## 触发条件
自动执行，不需要用户确认。

## 执行步骤

### 1. 检查未提交变更
```bash
cd ~/workspace/tradego-fasteners-v2
git status --short
git diff --stat
```

### 2. 运行Lint
```bash
npm run lint
```
报告任何错误。

### 3. 关键文件审查
重点检查以下文件的变更：
- `src/app/` — 页面逻辑是否正确
- `src/i18n/` — 翻译完整性
- `src/components/` — 组件改动影响
- `scripts/` — 脚本改动是否安全

### 4. 输出报告
```markdown
## 代码审查报告

### 变更文件
[文件列表]

### Lint结果
✅ 通过 / ❌ 有X个错误

### 关键审查意见
[针对变更的具体建议]

### 风险评估
- 高风险变更：X个（如有）
- 中风险变更：X个（如有）
- 低风险/安全：X个
```

---

## 使用方法
```
/tradego-review
```
