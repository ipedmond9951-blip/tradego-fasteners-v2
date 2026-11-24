// Google 产品类别（Product.category）必须是 Google Product Taxonomy 里的精确字符串，
// 写成本地化商品名（如"干墙钉"/"Drywall Screws"）会被 GSC 判为"字段 category 的值无效"。
// 取值来源：https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
// 2026-11-24 按 GSC 结构化数据报告新增

const FASTENERS = 'Hardware > Hardware Accessories > Hardware Fasteners'

const BY_SUFFIX: Array<[RegExp, string]> = [
  [/screws?$/, `${FASTENERS} > Screws`],
  [/nails?$/, `${FASTENERS} > Nails`],
  [/washers?$/, `${FASTENERS} > Washers`],
  [/rods?$/, `${FASTENERS} > Threaded Rods`],
  [/rivets?$/, `${FASTENERS} > Rivets`],
  [/bolts?$/, `${FASTENERS} > Nuts & Bolts`],
  [/nuts?$/, `${FASTENERS} > Nuts & Bolts`],
]

// 防水辅材不属于紧固件，归到构筑材料；太阳能支架归到五金配件
const BUILDING = /waterproof|butyl|flash-band|non-woven|membrane|coating/
const ACCESSORY = /bracket/

export function googleCategory(slug: string): string {
  if (BUILDING.test(slug)) return 'Hardware > Building Materials'
  if (ACCESSORY.test(slug)) return 'Hardware > Hardware Accessories'
  for (const [re, value] of BY_SUFFIX) {
    if (re.test(slug)) return value
  }
  // 锚栓类（sleeve-anchors / wedge-anchors / drop-in-anchors / set-anchors）本质是紧固螺栓
  if (/anchors?$/.test(slug)) return `${FASTENERS} > Nuts & Bolts`
  return FASTENERS
}
