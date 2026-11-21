/**
 * Clamp a meta description to a SERP-friendly length without cutting mid-sentence.
 * Priority: end on a sentence boundary; fall back to a word boundary with an ellipsis.
 */
export function clampDescription(text: string, max = 155): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean

  const hardCut = clean.slice(0, max)
  const sentenceEnd = Math.max(
    hardCut.lastIndexOf('. '),
    hardCut.lastIndexOf('! '),
    hardCut.lastIndexOf('? ')
  )
  if (sentenceEnd >= Math.floor(max * 0.6)) {
    return hardCut.slice(0, sentenceEnd + 1).trim()
  }

  const wordEnd = hardCut.lastIndexOf(' ')
  return (wordEnd > 0 ? hardCut.slice(0, wordEnd) : hardCut).replace(/[,;:.\-–—]$/, '').trim() + '…'
}
