import json, sys

P = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'scripts/data/new-products-batch1.json', encoding='utf-8'))


def js(s):
    return json.dumps(s, ensure_ascii=False)


def q(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


# --- products.ts ---
src = open('src/lib/products.ts', encoding='utf-8').read()
entries = []
for slug, v in P.items():
    nameKey = slug.replace('-', '')
    feats = ', '.join(q(x) for x in v['features'])
    apps = ', '.join(q(x) for x in v['apps'])
    faq = ', '.join(q(x) for x in v['faq'])
    specs = ', '.join(k + ': ' + q(val) for k, val in v['specs'].items())
    entries.append(
        "  { slug: '%s', image: '/images/products/%s.jpg', pricePerPiece: 0, nameKey: '%s', minOrder: '%s', leadTime: '%s', specs: { %s }, features: [%s], applications: [%s], faq: [%s] },"
        % (slug, slug, nameKey, v['minOrder'], v['leadTime'], specs, feats, apps, faq)
    )
idx = src.rstrip().rfind(']')
src = src[:idx] + "\n\n" + "\n".join(entries) + "\n\n" + src[idx:]
open('src/lib/products.ts', 'w', encoding='utf-8').write(src)

# --- productI18n.ts ---
s = open('src/lib/productI18n.ts', encoding='utf-8').read()
order = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']
names = []
for slug, v in P.items():
    parts = ', '.join('%s: %s' % (l, q(v['names'][l])) for l in order)
    names.append("  '%s': { %s }," % (slug, parts))
names_block = "\n".join(names)

descs = []
for slug, v in P.items():
    descs.append("  '%s': { en: %s, zh: %s }," % (slug, q(v['desc']['en']), q(v['desc']['zh'])))
desc_block = "\n".join(descs)

i = s.index('export const productNames')
j = s.index('\n}\n', i)
s = s[:j] + "\n" + names_block + s[j:]

i = s.index('export const productDescriptions')
j = s.index('\n}\n', i)
s = s[:j] + "\n" + desc_block + s[j:]

open('src/lib/productI18n.ts', 'w', encoding='utf-8').write(s)

print('inserted', len(P))
