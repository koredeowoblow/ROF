import { describe, it, expect } from 'vitest'
import { formatNaira, formatNairaNumber, formatNairaAria } from './money'

describe('Nigerian Naira Currency Formatter', () => {
  it('formats regular whole naira amounts with en-NG grouping', () => {
    expect(formatNaira(25000)).toBe('₦25,000')
    expect(formatNaira(30000)).toBe('₦30,000')
    expect(formatNaira(28000)).toBe('₦28,000')
  })

  it('formats small amounts without decimals', () => {
    expect(formatNaira(2500)).toBe('₦2,500')
    expect(formatNaira(4500)).toBe('₦4,500')
    expect(formatNaira(0)).toBe('₦0')
  })

  it('formats high values correctly with thousand separators', () => {
    expect(formatNaira(1500000)).toBe('₦1,500,000')
  })

  it('returns clean number string with formatNairaNumber', () => {
    expect(formatNairaNumber(30000)).toBe('30,000')
  })

  it('returns accessible voiceover string with formatNairaAria', () => {
    expect(formatNairaAria(30000)).toBe('30,000 Nigerian Naira')
    expect(formatNairaAria(2500)).toBe('2,500 Nigerian Naira')
  })
})

