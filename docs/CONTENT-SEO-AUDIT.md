# TradeGo-Fasteners Content & Local SEO Audit Report

**Project:** /Users/zhangming/workspace/tradego-fasteners-v2
**Audit Date:** 2026-04-29
**Auditor:** Content & Local SEO Specialist (Subagent)
**Articles Reviewed:** 77 JSON articles + Zimbabwe landing page + key components

---

## 1. Article Structure

### 1.1 Overview
- **Total articles:** 77 JSON files in `content/articles/`
- **Structure:** All articles share 13 fields: category, cta, date, description, image, imageAlt, keywords, readTime, relatedProducts, sections, slug, title, updated
- **Category distribution:**
  - Technical Guide: 49 ✓ (dominant)
  - Regional Supplier: 11 ✓
  - Market Analysis: 6 ✓
  - Procurement Guide: 3
  - Product Comparison: 2
  - Supplier Directory: 1
  - Quality Standards: 1
  - Logistics Guide: 1
  - Installation Guide: 1
  - Import Guide: 1
  - Buying Guide: 1

### 1.2 Issues

#### P0 — Missing `author` field in article JSON
- **File:** All 77 JSON articles (e.g., `anchor-bolts-foundation-guide.json`)
- **Current state:** Articles have `date` and `updated` but no `author` field
- **Fix:** Add `"author": "TradeGo Fasteners"` to each article JSON (or an individual name if available). This is critical for E-E-A-T `author` property in Article schema.
- **Effort:** Scriptable bulk update, ~1 hour

#### P1 — Mixed-language content in English articles
- **File:** `south africa-fasteners-china-import-guide.json` section 1 body contains Chinese text: `综合制造业、矿业、汽车、农产品` and `津巴布韦-南非最大边境`, `主要陆地边境`
- **Impact:** Looks like machine translation residue; damages credibility
- **Fix:** Identify all articles with Chinese characters in English body/text fields; clean them
- **Script check:**
```bash
cd content/articles/ && grep -l -P '\p{Han}' *.json
```
- **Priority:** P1 (credibility damage)

---

## 2. Internal Linking Strategy

### 2.1 Current State
- **61 of 77 articles have ZERO internal markdown links** in body text
- **Only 16 articles** contain at least one markdown-style link `[text](/en/industry/slug)`
- Internal navigation relies entirely on `relatedProducts` field (displayed as tag buttons at bottom of article)
- Average relatedProducts: **2.5 per article** (193 total / 77 articles)
- Only `africa-fastener-market-opportunities-2026.json` has cross-article contextual links (references 3 other articles)

### 2.2 Issues

#### P1 — No contextual internal links in 61 articles
- Articles like `anchor-bolts-foundation-guide.json`, `bolt-markings-identify-grade.json`, `carriage-bolts-guide.json` etc. have rich content but no links to related guides
- **Fix:** Add a "Related Guides" section or inline contextual links in the body of each article. E.g., when discussing hex bolts, link to `hex-bolt-dimensions-chart`
- **Hub-and-spoke model suggestion:**
  - **Hub: Bolt Types** → spokes: `bolt-grade-markings-guide`, `hex-bolt-dimensions-chart`, `carriage-bolts-guide`, `anchor-bolts-selection-guide`
  - **Hub: Corrosion** → spokes: `galvanic-corrosion-fastener-selection`, `fastener-corrosion-resistance-guide`, `galvanized-vs-stainless-steel-fasteners`
  - **Hub: Regional Africa** → spokes: `zimbabwe-fastener-supplier`, `durban-fastener-supplier`, `south africa-fasteners-china-import-guide`
  - **Hub: Roofing** → spokes: `ibr-roofing-nails-installation-guide`, `roofing-screws-epdm-washer-guide`, `self-drilling-screws-selection-guide`

#### P2 — `relatedProducts` values are inconsistent (text vs slug)
- Some articles have `["drywall-screws", "hex-bolts"]` (slugs), others have `["rock-bolts", "structural-bolts"]` (descriptive)
- The article page renders them as `p.replace(/-/g, ' ')` which works for slugs but produces awkward output for descriptive values
- **Fix:** Standardize all `relatedProducts` to product slug format

---

## 3. Zimbabwe Landing Page (`zimbabwe-fasteners-wholesale/page.tsx`)

### 3.1 Good Aspects
- ✅ Has local cities grid: Harare, Bulawayo, Mutare, Gweru, Kwekwe, Masvingo, Zvishavane, Chinhoyi
- ✅ FAQ section (5 questions — great for AI/search)
- ✅ Trust signals section (15+ years, ISO 9001 & SABS, sea freight)
- ✅ Mining sector mention (Hwange, Kadoma, Mutare)
- ✅ Internal JSON-LD schema (LocalBusiness type) embedded in page
- ✅ WhatsApp CTA button present

### 3.2 Issues

#### P0 — WhatsApp uses Chinese number, not Zimbabwe local
- **File:** `src/app/[locale]/zimbabwe-fasteners-wholesale/page.tsx`, line ~30
- **Current:** `https://wa.me/8615963409951` (China number)
- **Impact:** Zimbabwe customers seeing a +86 number may distrust
- **Fix:** Either (a) keep +86 number but add text "International/WHATSAPP", or (b) research a Zimbabwe local contact number if one exists, or (c) at minimum add a Zimbabwe-local alternative contact in the schema
- **Note:** The OrganizationSchema already has `whatsapp: '+8615963409951'` globally — this is consistent but not localized

#### P1 — LocalBusiness JSON-LD on this page is incomplete
- **Current schema:** Has name, description, telephone, areaServed (Country-level), OfferCatalog
- **Missing for local SEO:**
  - No `address` with Zimbabwe locality (Harare/Bulawayo)
  - No local pricing information
  - No `priceRange` specific to Zimbabwe market
  - `areaServed` uses `Country` type (weak) — should use `City` for Harare, Bulawayo
  - Missing `image` for the Zimbabwe-specific page

#### P2 — No E-E-A-T signals specific to Zimbabwe on this page
- No mention of Zimbabwe-specific certifications or SABS documentation
- No local testimonials from Zimbabwe customers (TestimonialsSection only on homepage)
- No Zimbabwe-specific shipping timeline (Beira port vs Durban) mentioned in main content

---

## 4. E-E-A-T Signals

### 4.1 What's Working
- ✅ **OrganizationSchema.tsx:** foundingDate, numberOfEmployees (150), annualRevenue ($50M), credentials (ISO 9001, CE, SABS), contactPoint with 9 languages
- ✅ **AboutPageSchema.tsx:** company description, foundingDate 2012, areaServed
- ✅ **ArticleSchema.tsx:** author, publisher, datePublished, dateModified, keywords, articleSection
- ✅ **TestimonialsSection.tsx:** 3 testimonials from South Africa, Nigeria, Kenya (real-looking company names: VanBerg Construction, Okonkwo Steel Works, Premier Manufacturing)
- ✅ **ReviewSchema.tsx:** 3 reviews with location (Johannesburg, Harare, Nairobi), dates (2026)
- ✅ **LocalBusinessSchema:** aggregateRating 4.8, reviewCount 156

### 4.2 Issues

#### P0 — Inconsistent foundingDate (2004 vs 2012)
- **OrganizationSchema.tsx** says `foundingDate: '2004'`
- **AboutPageSchema.tsx** says `foundingDate: '2012'`
- **Impact:** Conflicting data for Google/AI scraping — trust issue
- **Fix:** Decide on one founding date (likely 2012 based on AboutPage more detailed context) and update OrganizationSchema

#### P1 — Author field missing from all article JSON
- Articles use `date` and `updated` but no `author`
- ArticleSchema has `author = 'TradeGo Fasteners'` as fallback default
- For true E-E-A-T, individual author names or at minimum "TradeGo Fasteners Editorial Team" should be explicit
- **Fix:** Add `author` field to all 77 JSON articles

#### P1 — Article pages don't display TestimonialsSection or aggregateRating
- TestimonialsSection is only on the homepage (`/page.tsx`)
- Article pages (`/industry/[slug]/page.tsx`) show no trust signals beyond the schema markup
- A reader has no visible proof of company credibility while reading an article
- **Fix:** Add a short "Trusted by X customers" or testimonial snippet at bottom of article page, or at minimum in the Zimbabwe landing page

#### P2 — No individual author bio or credentials displayed
- All articles attributed to "TradeGo Fasteners" with no individual author info
- For B2B industrial content, adding author credentials (e.g., "By John Smith, Senior Fastener Engineer, 15 years experience") would strengthen E-E-A-T
- **Fix:** Create author profile system, at minimum add `author` field to JSON and display "Written by TradeGo Fasteners Technical Team" in article page

---

## 5. Regional Supplier Content

### 5.1 Coverage (11 Regional Supplier articles)
| File | Target Region | Date | Updated |
|------|---------------|------|---------|
| `botswana-fastener-supplier.json` | Botswana | 2025-01-29 | 2026-03-03 |
| `congo-brazzaville-fastener.json` | Congo-Brazzaville | 2025-03-01 | 2026-03-27 |
| `drc-diamond-mining-fasteners.json` | DRC | 2025-03-01 | 2026-02-06 |
| `durban-fastener-supplier.json` | Durban (SA) | 2025-03-01 | 2026-02-08 |
| `ghana-building-materials.json` | Ghana | 2025-01-29 | 2026-03-18 |
| `lagos-industrial-fasteners.json` | Nigeria/Lagos | 2024-12-29 | 2026-03-12 |
| `mozambique-hardware-supplier.json` | Mozambique | 2024-12-29 | 2026-02-04 |
| `nairobi-construction-hardware.json` | Kenya/Nairobi | 2025-01-29 | 2026-02-24 |
| `mombasa-port-fasteners.json` | East Africa (port) | 2024-11-29 | 2026-03-20 |
| `zambia-fastener-supplier.json` | Zambia | 2024-11-29 | 2026-03-24 |
| `zimbabwe-fastener-supplier.json` | Zimbabwe | 2024-12-29 | 2026-02-24 |

### 5.2 Issues

#### P1 — Missing key regions
- **No Tanzania article** (Dar es Salaam is a major distribution hub)
- **No Namibia article** (Walvis Bay port, growing mining market)
- **No Malawi article** (landlocked, imports via Beira or Durban)
- **No Ethiopia article** (largest East Africa economy)
- **Fix:** Create articles for Tanzania, Namibia, Malawi (quick wins for local SEO)

#### P2 — Some regional articles have outdated shipping info
- `south africa-fasteners-china-import-guide.json`: date 2024-10-29 (oldest), mixed Chinese in English content
- `mombasa-port-fasteners.json`: has solid content but 2024-11 publication date
- **Fix:** Review and update publication dates to 2025+, refresh statistics

#### P2 — Regional articles lack cross-links to each other
- Botswana article doesn't link to South Africa (Durban) article
- Zimbabwe article doesn't link to Mozambique (Beira port) article
- **Fix:** Add internal links between regional articles (shipping routes connect them naturally)

---

## 6. Content Freshness

### 6.1 Articles with Old `date` (< 2025-06-01)
| Slug | date | updated |
|------|------|---------|
| `south africa-fasteners-china-import-guide` | 2024-10-29 | 2026-03-16 |
| `mombasa-port-fasteners` | 2024-11-29 | 2026-03-20 |
| `zambia-fastener-supplier` | 2024-11-29 | 2026-03-24 |
| `mozambique-hardware-supplier` | 2024-12-29 | 2026-02-04 |
| `fastener-supplier-verification-checklist` | 2024-12-29 | 2026-02-24 |
| `zimbabwe-fastener-supplier` | 2024-12-29 | 2026-02-24 |
| `lagos-industrial-fasteners` | 2024-12-29 | 2026-03-12 |

### 6.2 Issues

#### P2 — "date" vs "updated" confusion
- Many articles have old `date` (2024) but recent `updated` (2026-03)
- Google may interpret `date` as "original publication" (correct) but the displayed date in article page is from `article.date`
- On article pages, only `article.date` is shown — not `updated`
- **Impact:** Visitors see 2024 date on an article that was substantively updated in 2026, which looks stale
- **Fix:** Either (a) update the `date` field when making substantive content changes, or (b) display `updated` field alongside `date` in article page

#### P2 — Some dates are in 2025-01 (earliest in 2025 batch) — verify accuracy
- `fastener-export-china-to-africa-guide.json`: date 2025-01-29, updated 2026-01-30 (only 1 update)
- `nairobi-construction-hardware.json`: date 2025-01-29, updated 2026-02-24
- These may need more recent market data refresh

---

## Priority Summary

### P0 — Must Fix Immediately
1. **Fix OrganizationSchema foundingDate inconsistency** (2004 vs 2012)
2. **Add `author` field to all 77 article JSON files**
3. **Fix Chinese characters in English article bodies** (`south africa-fasteners-china-import-guide.json`)

### P1 — High Priority (this week)
4. **Add internal markdown links to 61 articles without body links**
5. **Fix Zimbabwe page WhatsApp number** (or clarify it's international)
6. **Add E-E-A-T signals to article pages** (trust badges, testimonial snippets)
7. **Create missing regional articles** (Tanzania, Namibia, Malawi)
8. **Standardize relatedProducts format** to product slugs

### P2 — Medium Priority (this month)
9. **Fix article date display** (show `updated` instead of or alongside `date`)
10. **Cross-link regional supplier articles** (shipping routes)
11. **Add Zimbabwe-specific LocalBusiness schema** to zimbabwe landing page
12. **Refresh oldest articles** with updated market data (Q2 2026)
13. **Review and clean up `relatedProducts` values** for consistency

---

## Quick Wins for SEO Impact

1. **Add FAQ schema to article pages** — 16 articles already have FAQ sections, but the page needs to render them with proper FAQPage schema (some already do via article.sections[].faqItems rendering)
2. **Hub-and-spoke internal link structure** — add 2-3 contextual links per article for top 20 articles
3. **Add "Last updated" to article pages** — display both `date` and `updated` so Googlebot knows content is fresh
4. **Zimbabwe page schema** — add local address, city-level areaServed, and Zimbabwe-specific pricing signals

---

*Audit completed. Recommendations ordered by impact/priority. No code changes made during audit — all fixes require explicit approval.*