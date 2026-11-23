// 标准聚合页数据源：从产品 standard 字段解析标准号，生成 /standards/<slug>/ 落地页
// 目的：承接 "DIN 933 bolts supplier" 这类按标准号搜索的长尾，与产品页、品类分区互链
import { allProducts } from '@/lib/products'

const STD_RE = /(DIN|ISO|ANSI\/ASME|ANSI|ASTM|SABS|EN|GB\/T|GB|JIS|BS|UNI|LS|JC\/T)\s*([A-Z]?\d[\w.\-]*)/g

export function parseStandards(standard: string): string[] {
  const out = new Set<string>()
  for (const m of standard.matchAll(STD_RE)) {
    const prefix = m[1]
    const nums = m[2]
    // "933/934" 这类同族编号拆开，各自成页
    for (const n of nums.split('/')) {
      const clean = n.trim()
      if (clean) out.add(`${prefix} ${clean}`)
    }
  }
  return [...out]
}

export function stdSlug(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export interface StdEntry {
  slug: string
  code: string
  products: string[]
}

// 由产品数据推导，产品新增标准后自动出现新页
export const standardEntries: StdEntry[] = (() => {
  const map = new Map<string, StdEntry>()
  for (const p of allProducts) {
    const codes = parseStandards(p.specs.standard || '')
    for (const code of codes) {
      const slug = stdSlug(code)
      const entry = map.get(slug) || { slug, code, products: [] }
      if (!entry.products.includes(p.slug)) entry.products.push(p.slug)
      map.set(slug, entry)
    }
  }
  return [...map.values()].filter(e => e.products.length > 0).sort((a, b) => a.code.localeCompare(b.code))
})()

export function getStd(slug: string): StdEntry | undefined {
  return standardEntries.find(e => e.slug === slug)
}

// 标准号的中英对照说明：只描述该标准涵盖的产品类型，不复述条款细节
const stdNotes: Record<string, { en: string; zh: string }> = {
  'DIN 933': { en: 'Hexagon head bolts, fully threaded', zh: '六角头全螺纹螺栓' },
  'DIN 934': { en: 'Hexagon nuts, standard series', zh: '六角螺母（标准系列）' },
  'DIN 912': { en: 'Hexagon socket head cap screws', zh: '内六角圆柱头螺钉' },
  'DIN 913': { en: 'Hexagon socket set screws, flat point', zh: '内六角平端紧定螺钉' },
  'DIN 315': { en: 'Wing nuts', zh: '蝶形螺母' },
  'DIN 3570': { en: 'U-bolts for pipes and poles', zh: 'U 型螺栓（管道与立柱）' },
  'DIN 529': { en: 'Foundation anchor bolts', zh: '地脚锚栓' },
  'DIN 571': { en: 'Hexagon head wood screws (coach screws)', zh: '六角头木螺钉（木结构螺栓）' },
  'DIN 580': { en: 'Ring bolts', zh: '吊环螺栓' },
  'DIN 581': { en: 'Ring nuts', zh: '吊环螺母' },
  'DIN 603': { en: 'Carriage bolts with square neck', zh: '马车螺栓（方颈）' },
  'DIN 6334': { en: 'Flange nuts', zh: '法兰螺母' },
  'DIN 6797': { en: 'Spring lock washers with internal teeth', zh: '内齿锁紧垫圈' },
  'DIN 6921': { en: 'Hexagon head flange bolts', zh: '六角法兰面螺栓' },
  'DIN 6923': { en: 'Hexagon flange nuts', zh: '六角法兰螺母' },
  'DIN 7337': { en: 'Blind rivets', zh: '拉铆钉' },
  'DIN 7338': { en: 'Semi-tubular rivets', zh: '半空心铆钉' },
  'DIN 7340': { en: 'Rivet nuts (blind threaded inserts)', zh: '拉铆螺母' },
  'DIN 7500': { en: 'Self-tapping screws, general purpose', zh: '自攻螺钉（通用）' },
  'DIN 7504': { en: 'Self-drilling screws (TEK type)', zh: '自钻自攻螺钉（TEK）' },
  'DIN 7505': { en: 'Drywall screws for gypsum board', zh: '干墙螺钉（石膏板）' },
  'DIN 7985': { en: 'Pan head self-tapping screws', zh: '盘头自攻螺钉' },
  'DIN 7998': { en: 'Round head self-tapping screws', zh: '圆头自攻螺钉' },
  'DIN 1587': { en: 'Large wafer head self-tapping screws', zh: '大扁头自攻螺钉' },
  'DIN 975': { en: 'Threaded rods, fully threaded', zh: '全螺纹螺杆' },
  'DIN 976': { en: 'Stud bolts / double-ended studs', zh: '双头螺栓' },
  'DIN 985': { en: 'Nylon insert lock nuts', zh: '尼龙锁紧螺母' },
  'DIN 125': { en: 'Flat washers, plain', zh: '平垫圈' },
  'DIN 127': { en: 'Spring washers', zh: '弹簧垫圈' },
  'ISO 4014': { en: 'Hexagon head bolts, partially threaded', zh: '六角头螺栓（半螺纹）' },
  'ISO 4762': { en: 'Hexagon socket head cap screws', zh: '内六角圆柱头螺钉' },
  'ISO 7040': { en: 'Prevailing torque hexagon nuts with nylon insert', zh: '尼龙锁紧六角螺母' },
  'ISO 7089': { en: 'Plain washers, normal series', zh: '平垫圈（标准系列）' },
  'ISO 898': { en: 'Mechanical properties of carbon steel fasteners', zh: '碳钢紧固件机械性能' },
  'ASTM F1554': { en: 'Anchor bolts for structural foundations', zh: '结构基础锚栓' },
  'ASTM A193': { en: 'Alloy and stainless steel bolting for high temperature service', zh: '高温工况合金与不锈钢螺栓' },
  'ASTM D1970': { en: 'Self-adhering polymer modified bituminous waterproofing', zh: '自粘聚合物改性沥青防水材料' },
  'ANSI B18.5': { en: 'Round head and square neck bolts (carriage bolts)', zh: '圆头方颈螺栓（马车螺栓）' },
  'SABS 1195': { en: 'Roofing nails for corrugated and IBR sheeting', zh: '瓦楞与 IBR 屋面用钉' },
  'SABS 153': { en: 'Anchor bolts for construction', zh: '建筑用锚栓' },
  'EN 10230-1': { en: 'Steel wire nails', zh: '钢制圆钉' },
  'EN 14566': { en: 'Gypsum board screws and accessories', zh: '石膏板螺钉及配件' },
  'EN 10346': { en: 'Continuously hot-dip coated steel flat products', zh: '连续热镀锌钢板' },
  'JC/T 408': { en: 'Waterproofing coatings for buildings', zh: '建筑防水涂料' },
}

export function stdNote(code: string, locale: string): string {
  const n = stdNotes[code]
  if (!n) return locale === 'zh' ? '紧固件产品执行标准' : 'Fastener product standard'
  return locale === 'zh' ? n.zh : n.en
}
