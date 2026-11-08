import { describe, it, expect, beforeEach } from 'vitest'
import { useBagStore } from './bagStore'

describe('Shopping Bag Store', () => {
  beforeEach(() => {
    useBagStore.getState().clearBag()
  })

  it('initializes with empty bag items', () => {
    const { items, totalPieces, subtotal } = useBagStore.getState()
    expect(items).toEqual([])
    expect(totalPieces()).toBe(0)
    expect(subtotal()).toBe(0)
  })

  it('adds an item to the bag and opens sheet', () => {
    useBagStore.getState().addItem({
      productId: 'prod-1',
      name: 'Destined Cards Tee',
      colour: 'Forest green',
      size: 'L',
      unitPrice: 30000,
      image: '/images/destined-cards-green.webp',
    })

    const { items, totalPieces, subtotal, isOpen } = useBagStore.getState()
    expect(items.length).toBe(1)
    expect(items[0].qty).toBe(1)
    expect(items[0].size).toBe('L')
    expect(totalPieces()).toBe(1)
    expect(subtotal()).toBe(30000)
    expect(isOpen).toBe(true)
  })

  it('increments quantity when same product and size is added', () => {
    const item = {
      productId: 'prod-1',
      name: 'Destined Cards Tee',
      colour: 'Forest green',
      size: 'L' as const,
      unitPrice: 30000,
      image: '/images/destined-cards-green.webp',
    }

    useBagStore.getState().addItem(item, 1)
    useBagStore.getState().addItem(item, 2)

    const { items, totalPieces, subtotal } = useBagStore.getState()
    expect(items.length).toBe(1)
    expect(items[0].qty).toBe(3)
    expect(totalPieces()).toBe(3)
    expect(subtotal()).toBe(90000)
  })

  it('updates quantity and removes item when qty set to 0', () => {
    useBagStore.getState().addItem({
      productId: 'prod-2',
      name: 'Rage Wave Tee',
      colour: 'White',
      size: 'M',
      unitPrice: 25000,
      image: '/images/rage-wave-white.webp',
    })

    useBagStore.getState().updateQty('prod-2', 'M', 4)
    expect(useBagStore.getState().items[0].qty).toBe(4)

    useBagStore.getState().updateQty('prod-2', 'M', 0)
    expect(useBagStore.getState().items.length).toBe(0)
  })

  it('removes item and allows undo restoration', () => {
    useBagStore.getState().addItem({
      productId: 'prod-3',
      name: 'Rage Wave Tee',
      colour: 'Black',
      size: 'XL',
      unitPrice: 25000,
      image: '/images/rage-wave-black.webp',
    })

    expect(useBagStore.getState().items.length).toBe(1)

    // Remove
    useBagStore.getState().removeItem('prod-3', 'XL')
    expect(useBagStore.getState().items.length).toBe(0)
    expect(useBagStore.getState().lastRemoved).not.toBeNull()

    // Undo
    useBagStore.getState().undoRemove()
    expect(useBagStore.getState().items.length).toBe(1)
    expect(useBagStore.getState().items[0].name).toBe('Rage Wave Tee')
    expect(useBagStore.getState().lastRemoved).toBeNull()
  })
})
