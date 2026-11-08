import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Logo, DiamondMark } from './Logo'

describe('Logo Component', () => {
  it('renders the SVG with the concentric diamond wordmark', () => {
    const { container } = render(<Logo animated={false} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 280 90')

    // Verify outer and inner diamond polygons
    const polygons = container.querySelectorAll('polygon')
    expect(polygons.length).toBeGreaterThanOrEqual(2)

    // Outer diamond centered at 140, 46 with radius 38
    const outerDiamond = Array.from(polygons).find((p) => p.getAttribute('points') === '140,8 178,46 140,84 102,46')
    expect(outerDiamond).toBeTruthy()

    // Inner diamond concentric at 140, 46 with radius 20 (18px clearance)
    const innerDiamond = Array.from(polygons).find((p) => p.getAttribute('points') === '140,26 160,46 140,66 120,46')
    expect(innerDiamond).toBeTruthy()
  })

  it('renders DiamondMark standalone ornament correctly', () => {
    const { container } = render(<DiamondMark size={16} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('16')
    expect(svg?.getAttribute('height')).toBe('16')
  })
})
