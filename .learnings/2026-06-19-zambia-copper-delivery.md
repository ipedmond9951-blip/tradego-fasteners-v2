# 2026-06-19 Zambia Copper Mining Article — 8/8 Delivered

## Article
- **Slug**: zambia-copper-mining-fasteners-grade-selection-2026
- **Score**: 100/100 (SEO validator)
- **Delivery**: 8/8 ✅
- **URL**: https://www.tradego-fasteners.com/en/industry/zambia-copper-mining-fasteners-grade-selection-2026/
- **Word count**: 2,489 words
- **Topic**: Zambia copper mining fastener grade selection (Statutory Instrument No. 68 of 2025)

## Pipeline Journey
- 03:30 cron triggered (model overloads + auth issues)
- 06:55 user asked "为什么 cron 没跑？" — pipeline still running
- 07:30 user identified root cause: deepseek-client keyboard.press('Enter') not actually sending
- 08:00 fixed deepseek-client (16x15s polling, retry if truncated)
- 08:30 traced: bash $(dirname "$0") bug → scripts/scripts/extract_json.py (double path)
- 09:00 fixed SCRIPT_DIR variable + self-heal missing extract_json.py
- 09:30 outline OK 8771 chars, writer step 3 succeeded 2489-word article
- 17:30 re-assembled JSON to use i18n dicts (all 10 langs)
- 18:30 fixed schema (sections[i].faqItems vs top-level faq)
- 18:45 added internal links + 10-lang placeholders
- 19:00 deliver score 100/100, 8/8 ✅
- 19:13 Vercel Ready, alias set, 10/10 langs HTTP 200

## Critical Lessons

### 1. $(dirname "$0")/path bug — KILLER for cron jobs
**Symptom**: Script works in dev, fails in cron
**Root cause**: When $0 = absolute path "/Users/.../scripts/foo.sh", dirname = "/Users/.../scripts", 
  path = "/Users/.../scripts/scripts/bar.py" (DOUBLE scripts/, doesn't exist)
**Fix**: Use SCRIPT_DIR variable set at top of script:
```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTRACT_JSON="$SCRIPT_DIR/extract_json.py"
```

### 2. Article JSON must use i18n dicts — NOT plain strings
**Symptom**: Build fails with "Cannot read properties of undefined (reading 'length')"
**Root cause**: page.generateMetadata does `(article.title as Record<string, string>)[locale]`
  - If title is a plain string, this fails at runtime
**Fix**: All i18n fields must be `{en, zh, es, ar, fr, pt, ru, ja, de, hi}` dicts
**Affected fields**: title, description, metaDescription, imageAlt, section heading/body, FAQ q/a, CTA text/buttonText

### 3. FAQ must be in `sections[i].faqItems` — NOT top-level `faq`
**Symptom**: Page renders no FAQs, validator complains
**Root cause**: Industry page only reads from `sections[i].faqItems`, not article.faq
**Fix**: Place FAQ items in the last section as `faqItems: [{q, a}]`
**Note**: Validator checks BOTH top-level and section-level

### 4. Internal links must be in section.body HTML — not just relatedProducts array
**Symptom**: Delivery check fails "Internal Links: products=0 (need 3)"
**Root cause**: Check looks for `href="/en/products/..."` inside section bodies
**Fix**: Add HTML anchors in body text, e.g., `<a href="/en/products/anchor-bolts">anchor bolts</a>`

### 5. DeepSeek Client Polling — multi-modal problem
**Symptom**: DeepSeek returns 73 chars initially, then more chars later
**Root cause**: DeepSeek first shows "thinking" then expands; original 4x15s polling = 60s insufficient
**Fix**: 
- 8x15s polling = 120s minimum
- Add retry-if-truncated: if last char !== '}', force re-poll (because JSON likely cut off)
- Bash timeout 180s → 360s for 2000+ word outputs

### 6. Vercel Queue Degradation — June 2026
**Symptom**: Deployments stuck in "Queued" status for 17+ min
**Fix**: Manually `npx vercel rm <deployment> --yes` to clear stuck queue
- Old v5 SOP "3+ queued → rm" works
- Build itself is fast (5min) when it starts

## Stats
- Total time: 06:55 (user query) → 19:13 (delivery confirmed) = ~12h 18min
- 8 git commits
- 3 Vercel deployments (1 Error, 2 Ready)
- 1 article, 10 languages, 2489 words, 100/100 score
