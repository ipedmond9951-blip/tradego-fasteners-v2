#!/usr/bin/env node
/**
 * Fix corrupted articles by restoring from clean commits
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// Corrupted files to fix
const corruptedFiles = [
  'agrifastener-water-infrastructure.json',
  'conveyor-belt-fasteners.json',
  'full-thread-half-thread-coarse-fine-thread-guide.json',
  'gb-din-ansi-fastener-standards-export-guide.json',
  'high-strength-bolts-8-8-10-9-12-9-grade-guide.json',
  'imperial-metric-hex-nut-export-guide.json',
  'industrial-washers-flat-spring-lock-guide.json',
  'kenya-fastener-market-case-study.json',
  'lock-nuts-flange-nuts-vibration-proof-guide.json',
  'marine-outdoor-corrosion-resistant-bolts-guide.json',
  'senegal-fastener-market.json',
  'solar-mounting-hex-bolt-solution-guide.json',
  'south-africa-fastener-market-case-study.json',
  'stainless-steel-hex-bolt-304-316-guide.json',
  'stainless-steel-hex-nuts-304-316-heavy-guide.json',
  'structural-heavy-duty-bolts-building-guide.json',
  'welding-nuts-square-nut-special-nut-guide.json',
  'wind-power-machinery-high-strength-bolts-guide.json',
  'wood-screws-machine-screws-furniture-guide.json',
  'zambia-fastener-market-case-study.json',
  'zimbabwe-fastener-market-case-study.json'
];

// Find earliest clean commit for each file
function findCleanCommit(file) {
  try {
    const log = execSync(`git log --oneline --all -- content/articles/${file}`, { encoding: 'utf8' });
    const commits = log.trim().split('\n');
    
    // Go through commits from oldest to newest to find first non-corrupted
    for (let i = commits.length - 1; i >= 0; i--) {
      const commit = commits[i].split(' ')[0];
      try {
        const content = execSync(`git show ${commit}:content/articles/${file}`, { encoding: 'utf8' });
        if (!content.includes('</a>ef=')) {
          return commit;
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

let fixed = 0;
for (const file of corruptedFiles) {
  const cleanCommit = findCleanCommit(file);
  if (cleanCommit) {
    try {
      const content = execSync(`git show ${cleanCommit}:content/articles/${file}`, { encoding: 'utf8' });
      const fpath = path.join(ARTICLES_DIR, file);
      fs.writeFileSync(fpath, content);
      console.log(`✅ Fixed: ${file} (from ${cleanCommit})`);
      fixed++;
    } catch (e) {
      console.log(`❌ Failed: ${file}`);
    }
  } else {
    console.log(`❌ No clean version found: ${file}`);
  }
}

console.log(`\n📊 Fixed ${fixed}/${corruptedFiles.length} corrupted articles`);
