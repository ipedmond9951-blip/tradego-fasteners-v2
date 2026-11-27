// 纯函数自测：识别 / E.164 归一化，不依赖服务器与浏览器。
// 跑法：node --experimental-strip-types scripts/test-lead-capture.mjs
import { detectContact } from '../src/lib/leadCapture.ts'

const cases = [
  { input: 'a@b.com', locale: 'en', expect: { kind: 'email', email: 'a@b.com', phone: null, normalized: 'a@b.com' } },
  { input: '+263771234567', locale: 'en', expect: { kind: 'whatsapp', email: null, phone: '+263771234567', normalized: '+263771234567' } },
  { input: '0771234567', locale: 'en', expect: { kind: 'whatsapp', email: null, phone: '+263771234567', normalized: '+263771234567' } },
  { input: '0771234567', locale: 'zh', expect: { kind: 'whatsapp', email: null, phone: '+86771234567', normalized: '+86771234567' } },
  { input: '+86 138 0000 1111', locale: 'zh', expect: { kind: 'whatsapp', email: null, phone: '+8613800001111', normalized: '+8613800001111' } },
  { input: 'abc', locale: 'en', expect: { kind: 'invalid', email: null, phone: null, normalized: null } },
  { input: '', locale: 'en', expect: { kind: 'invalid', email: null, phone: null, normalized: null } },
  { input: '  +27 82 123 4567 ', locale: 'en', expect: { kind: 'whatsapp', email: null, phone: '+27821234567', normalized: '+27821234567' } },
  { input: 'sales@tradego.com', locale: 'de', expect: { kind: 'email', email: 'sales@tradego.com', phone: null, normalized: 'sales@tradego.com' } },
]

let failed = 0
for (const c of cases) {
  const got = detectContact(c.input, c.locale)
  const ok =
    got.kind === c.expect.kind &&
    got.email === c.expect.email &&
    got.phone === c.expect.phone &&
    got.normalized === c.expect.normalized
  console.log(
    `${ok ? 'PASS' : 'FAIL'} | input=${JSON.stringify(c.input)} locale=${c.locale} => ` +
      `kind=${got.kind} email=${got.email ?? '-'} phone=${got.phone ?? '-'} normalized=${got.normalized ?? '-'} reason=${got.reason ?? '-'}`
  )
  if (!ok) {
    failed += 1
    console.log('       expected:', JSON.stringify(c.expect))
  }
}

if (failed) {
  console.error(`\n${failed} case(s) failed`)
  process.exit(1)
}
console.log('\nAll lead-capture cases passed.')
