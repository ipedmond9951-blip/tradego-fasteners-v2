// 文章图片优化衍生版路径（由 scripts/gen_opt_images.sh 生成）
// hero: 1200x675 webp，文章页 LCP 用；thumb: 400x225 webp，列表卡片用
import { OPT_BASES } from './optImageManifest'

export type OptSize = 'hero' | 'thumb'

export function optImagePath(src: string | undefined, size: OptSize): string {
  if (!src) return ''
  const base = src.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '') ?? ''
  if (!base) return src
  if (!OPT_BASES.has(base)) return src
  return `/images/opt/${base}-${size}.webp`
}
