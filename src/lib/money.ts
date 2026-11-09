/**
 * Nigerian Naira currency formatter
 * Formatted with Intl.NumberFormat('en-NG'), no decimals.
 * The naira sign ₦ is rendered using the sans font to avoid serif glyph missing/fallback bugs.
 */

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatNaira(amount: number): string {
  return `₦${nairaFormatter.format(amount)}`
}

export function formatNairaNumber(amount: number): string {
  return nairaFormatter.format(amount)
}

/**
 * Screen-reader accessible currency announcement
 * e.g. "30,000 Nigerian Naira"
 */
export function formatNairaAria(amount: number): string {
  return `${nairaFormatter.format(amount)} Nigerian Naira`
}

