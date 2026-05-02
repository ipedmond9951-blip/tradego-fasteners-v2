/**
 * GSC Real Data Scraper via Chrome CDP
 * Extracts real Search Console data from the user's logged-in GSC session
 */

const { chromium } = require('playwright')

async function scrapeGSC(options = {}) {
  const {
    weeks = 13,
    rowLimit = 100,
  } = options

  console.error('🔍 Connecting to Chrome CDP...')
  const browser = await chromium.connectOverCDP('http://localhost:9222')
  const context = browser.contexts()[0]
  const page = await context.newPage()

  try {
    // --- PERFORMANCE PAGE: OVERVIEW + QUERIES ---
    const url = `https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Atradego-fasteners.com&num_weeks=${weeks}`
    await page.goto(url, { timeout: 30000, waitUntil: 'networkidle' })
    await page.waitForTimeout(8000)

    // Parse overview stats from DOM
    const overview = await parseOverviewFromPage(page)

    // Parse queries table
    const queries = await parseTable(page, 'queries')

    // Parse pages table (click tab)
    await clickTab(page, '网页')
    await page.waitForTimeout(3000)
    const pages = await parseTable(page, 'pages')

    // Parse countries table (click tab)
    await clickTab(page, '国家')
    await page.waitForTimeout(3000)
    const countries = await parseTable(page, 'countries')

    // --- INDEXING PAGE ---
    await page.goto(`https://search.google.com/search-console/index?resource_id=sc-domain%3Atradego-fasteners.com`, { timeout: 20000, waitUntil: 'networkidle' })
    await page.waitForTimeout(5000)
    const indexing = await parseIndexingFromPage(page)

    await browser.close()

    return {
      overview,
      topQueries: queries.slice(0, rowLimit),
      topPages: pages.slice(0, rowLimit),
      topCountries: countries.slice(0, 20),
      indexing,
      timestamp: new Date().toISOString(),
      source: 'GSC via CDP',
    }

  } catch (err) {
    await browser.close()
    throw err
  }
}

async function parseOverviewFromPage(page) {
  return await page.evaluate(() => {
    const allText = (document.querySelector('#main') || document.body).innerText || ''
    const lines = allText.split('\n')

    const parseNum = s => {
      if (!s) return 0
      return parseFloat(s.replace(/,/g, '').replace(/，/g, '').replace(/\s/g, '')) || 0
    }

    let clicks = 0, impressions = 0, ctr = 0, position = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\s+/g, ' ').trim()
      const next = (lines[i + 1] || '').replace(/\s+/g, ' ').trim()

      if ((line.includes('总点击次数') || line.includes('点击次数')) && next && /^\d/.test(next)) {
        clicks = parseNum(next)
      }
      if ((line.includes('总曝光次数') || line.includes('展示')) && next && /^\d/.test(next)) {
        impressions = parseNum(next)
      }
      if (line.includes('点击率')) {
        const match = next.match(/([\d.]+)%/)
        ctr = match ? parseFloat(match[1]) : parseNum(next)
      }
      if (line.includes('平均排名') && next && /^\d/.test(next)) {
        position = parseNum(next)
      }
    }

    // Fallback
    if (clicks === 0) {
      const m = allText.match(/总点击次数[\s\S]{0,80}?(\d[\d,，]*)/)
      if (m) clicks = parseNum(m[1])
    }
    if (impressions === 0) {
      const m = allText.match(/总曝光次数[\s\S]{0,80}?(\d[\d,，]*)/)
      if (m) impressions = parseNum(m[1])
    }
    if (ctr === 0) {
      const m = allText.match(/([\d.]+)%/)
      if (m) ctr = parseFloat(m[1])
    }
    if (position === 0) {
      const m = allText.match(/平均排名[\s\S]{0,80}?([\d.]+)/)
      if (m) position = parseFloat(m[1])
    }

    return { clicks, impressions, ctr, position }
  })
}

async function parseTable(page, type) {
  return await page.evaluate((tableType) => {
    const table = document.querySelector('table')
    if (!table) return []
    const tbody = table.querySelector('tbody')
    if (!tbody) return []

    const rows = tbody.querySelectorAll('tr')
    const data = []

    rows.forEach(row => {
      const cells = row.querySelectorAll('td')
      if (cells.length < 3) return

      if (tableType === 'queries' || tableType === 'pages') {
        const name = cells[0]?.textContent?.trim() || ''
        const clicks = parseFloat(cells[1]?.textContent?.trim() || '0') || 0
        const impressions = parseFloat(cells[2]?.textContent?.trim() || '0') || 0
        const ctrText = cells[3]?.textContent?.trim() || '0%'
        const ctr = parseFloat(ctrText.replace('%', '')) || 0

        if (name && name.length > 1 && name.length < 300) {
          if (tableType === 'queries') {
            data.push({ query: name, clicks, impressions, ctr })
          } else {
            data.push({ page: name, clicks, impressions, ctr })
          }
        }
      } else if (tableType === 'countries') {
        const name = cells[0]?.textContent?.trim() || ''
        const clicks = parseFloat(cells[1]?.textContent?.trim() || '0') || 0
        const impressions = parseFloat(cells[2]?.textContent?.trim() || '0') || 0
        if (name && name.length > 1 && name.length < 100) {
          data.push({ country: name, clicks, impressions })
        }
      }
    })

    return data
  }, type)
}

async function clickTab(page, label) {
  const tabs = await page.locator('[role="tab"]').all()
  for (const tab of tabs) {
    const text = await tab.textContent()
    if (text && text.includes(label)) {
      await tab.click()
      return
    }
  }
}

async function parseIndexingFromPage(page) {
  return await page.evaluate(() => {
    const text = (document.querySelector('#main') || document.body).innerText || ''

    const parseNum = s => {
      if (!s) return 0
      return parseFloat(s.replace(/,/g, '').replace(/，/g, '')) || 0
    }

    let indexed = 0, submitted = 0, errors = 0

    const indexedMatch = text.match(/(?:已编制索引|已索引)[^\\n]{0,50}?(\d[\d,，]*)/)
    if (indexedMatch) indexed = parseNum(indexedMatch[1])

    const submittedMatch = text.match(/已提交[^\\n]{0,50}?(\d[\d,，]*)/)
    if (submittedMatch) submitted = parseNum(submittedMatch[1])

    const errorMatch = text.match(/错误[^\\n]{0,50}?(\d[\d,，]*)/)
    if (errorMatch) errors = parseNum(errorMatch[1])

    // Fallback: just grab the first three numbers that look like counts
    if (indexed === 0) {
      const nums = text.match(/\d[\d,，]+/g) || []
      if (nums.length >= 3) {
        indexed = parseNum(nums[0])
        submitted = parseNum(nums[1])
        errors = parseNum(nums[2])
      } else if (nums.length === 2) {
        indexed = parseNum(nums[0])
        submitted = parseNum(nums[1])
      } else if (nums.length === 1) {
        indexed = parseNum(nums[0])
      }
    }

    return { indexed, submitted, errors }
  })
}

// CLI mode
if (require.main === module) {
  const args = process.argv.slice(2)
  const weeks = parseInt(args.find(a => a.startsWith('--weeks='))?.split('=')[1] || '13')
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '100')

  scrapeGSC({ weeks, rowLimit: limit })
    .then(data => {
      console.log(JSON.stringify(data, null, 2))
    })
    .catch(err => {
      console.error('Error:', err.message)
      process.exit(1)
    })
}

module.exports = { scrapeGSC }