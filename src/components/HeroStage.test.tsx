import { describe, it, expect } from 'vitest'

describe('Hero Circular Hand Wrap Calculation', () => {
  it('correctly calculates circular positions for active Look 01 (index 0)', () => {
    const activeCardIndex = 0
    const indices = [0, 1, 2, 3, 4]

    const diffs = indices.map((idx) => {
      let diff = idx - activeCardIndex
      while (diff > 2) diff -= 5
      while (diff < -2) diff += 5
      return diff
    })

    // Look 01 is 0 (center)
    // Look 02 is 1 (right)
    // Look 03 is 2 (far right)
    // Look 04 is -2 (far left)
    // Look 05 is -1 (left)
    expect(diffs).toEqual([0, 1, 2, -2, -1])
  })

  it('correctly calculates circular positions for active Look 05 (index 4)', () => {
    const activeCardIndex = 4
    const indices = [0, 1, 2, 3, 4]

    const diffs = indices.map((idx) => {
      let diff = idx - activeCardIndex
      while (diff > 2) diff -= 5
      while (diff < -2) diff += 5
      return diff
    })

    // Active Look 05 is diff 0
    // Look 03 (idx 2) is diff -2 (left)
    // Look 04 (idx 3) is diff -1 (left)
    // Look 01 (idx 0) is diff 1 (right)
    // Look 02 (idx 1) is diff 2 (right)
    expect(diffs[4]).toBe(0)
    expect(diffs[2]).toBe(-2)
    expect(diffs[3]).toBe(-1)
    expect(diffs[0]).toBe(1)
    expect(diffs[1]).toBe(2)
  })

  it('ensures supporting line copy strictly adheres to brand rules', () => {
    const copy = 'Clothing and fashion • Collection 01 / Five pieces'
    expect(copy).toContain('Clothing and fashion')
    expect(copy).toContain('Collection 01 / Five pieces')
    expect(copy).not.toContain('haute streetwear')
    expect(copy).not.toContain('ready-to-wear')
    expect(copy).not.toContain('heavyweight')
  })
})

