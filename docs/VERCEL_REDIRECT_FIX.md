# Vercel Redirect Chain Issue - Fix Required

## Problem

The site has a **2+ second redirect chain** that is severely impacting Core Web Vitals:

```
tradego-fasteners.com/
    ↓ ~991ms (Vercel DNS redirect to www)
www.tradego-fasteners.com/
    ↓ ~1090ms (Next.js middleware redirect to /en)
www.tradego-fasteners.com/en
```

**Total wasted time: 2+ seconds on EVERY page load**

## Impact

- LCP (Largest Contentful Paint): **6.5 seconds** (target: <2.5s)
- FCP (First Contentful Paint): **5.0 seconds** (target: <1.8s)
- Performance Score: **63/100** (target: >90)

## Root Cause

Vercel is configured to redirect the root domain (`tradego-fasteners.com`) to `www.tradego-fasteners.com`. This redirect happens at the Vercel edge level BEFORE the Next.js middleware runs.

## Solution

**Option 1: Remove www redirect (Recommended)**
1. Log in to Vercel Dashboard
2. Go to the `tradego-fasteners` project
3. Navigate to Settings → Domains
4. Find `tradego-fasteners.com` and click Edit
5. Remove the redirect configuration for www
6. Save changes

**Option 2: Configure root domain redirect directly to /en**
1. Log in to Vercel Dashboard  
2. Go to Settings → Domains
3. Configure `tradego-fasteners.com` to redirect directly to `https://www.tradego-fasteners.com/en`
4. Or: Configure `www.tradego-fasteners.com` to redirect to `/en` (avoiding the middleware redirect)

## After Fix

Expected improvement:
- LCP: 6.5s → 3-4s (saves ~2 seconds)
- FCP: 5.0s → 2-3s (saves ~2 seconds)
- Performance Score: 63 → 80+ (if other optimizations also applied)

## Verification

After making changes, run:
```bash
curl -I https://tradego-fasteners.com
```

Should show only ONE redirect (or ZERO if configured to serve directly).

---

# Additional Optimizations Completed

## Image Optimization (DONE)
- Converted 3 video poster images to WebP (~210KB savings)
- Converted 10 product images to WebP (~1MB savings)
- Total image size reduction: ~1.2MB

## GA4 Loading (DONE)
- Changed GA4 from `beforeInteractive` to `lazyOnload`
- GA4 now loads after page is interactive, not blocking FCP/LCP

## What Still Needs Manual Action

1. **Vercel redirect fix** (see above)
2. **Google Search Console** - Submit sitemap for faster indexing
3. **Backlink building** - Manual outreach to directories
