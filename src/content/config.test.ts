import { describe, it, expect } from 'vitest'
import { initialContentConfig } from './config'

describe('Content Configuration Contract', () => {
  it('has valid delivery rates for Lagos and Interstate with Draft markers', () => {
    expect(initialContentConfig.delivery.lagosFee.value).toBe(2500)
    expect(initialContentConfig.delivery.lagosFee.isDraft).toBe(true)

    expect(initialContentConfig.delivery.interstateFee.value).toBe(4500)
    expect(initialContentConfig.delivery.interstateFee.isDraft).toBe(true)
  })

  it('contains the mandatory tagline and brand identifiers without prohibited text', () => {
    expect(initialContentConfig.brand.name).toBe('ROF')
    expect(initialContentConfig.brand.subname).toBe('ROF RAGE')
    expect(initialContentConfig.brand.tagline.value).toBe('Destined for riches')

    // Prohibit em dashes in UI copy according to brief
    const allText = JSON.stringify(initialContentConfig)
    expect(allText.includes('—')).toBe(false)
  })

  it('provides a complete 5-tier size guide (S, M, L, XL, XXL)', () => {
    const sizes = initialContentConfig.help.sizeGuide.measurements.map((m) => m.size)
    expect(sizes).toEqual(['S', 'M', 'L', 'XL', 'XXL'])
  })
})
