import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OrderItem } from '@/api/types'

export interface BagItem extends OrderItem {}

interface BagState {
  items: BagItem[]
  isOpen: boolean
  lastRemoved: { item: BagItem; index: number } | null
  // Actions
  addItem: (item: Omit<BagItem, 'qty'>, qty?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQty: (productId: string, size: string, qty: number) => void
  undoRemove: () => void
  clearBag: () => void
  setIsOpen: (isOpen: boolean) => void
  // Getters
  totalPieces: () => number
  subtotal: () => number
}

export const useBagStore = create<BagState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastRemoved: null,

      addItem: (item, qty = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size
          )

          let updatedItems: BagItem[]
          if (existingIndex > -1) {
            updatedItems = state.items.map((i, index) =>
              index === existingIndex ? { ...i, qty: i.qty + qty } : i
            )
          } else {
            updatedItems = [...state.items, { ...item, qty }]
          }

          return {
            items: updatedItems,
            isOpen: true, // open bag sheet on add
            lastRemoved: null,
          }
        })
      },

      removeItem: (productId, size) => {
        set((state) => {
          const idx = state.items.findIndex((i) => i.productId === productId && i.size === size)
          if (idx === -1) return state

          const removed = state.items[idx]
          return {
            items: state.items.filter((_, i) => i !== idx),
            lastRemoved: { item: removed, index: idx },
          }
        })
      },

      updateQty: (productId, size, qty) => {
        set((state) => {
          if (qty <= 0) {
            return {
              items: state.items.filter(
                (i) => !(i.productId === productId && i.size === size)
              ),
            }
          }

          return {
            items: state.items.map((i) =>
              i.productId === productId && i.size === size ? { ...i, qty } : i
            ),
          }
        })
      },

      undoRemove: () => {
        set((state) => {
          if (!state.lastRemoved) return state
          const { item, index } = state.lastRemoved
          const items = [...state.items]
          items.splice(index, 0, item)
          return { items, lastRemoved: null }
        })
      },

      clearBag: () => {
        set({ items: [], lastRemoved: null })
      },

      setIsOpen: (isOpen) => set({ isOpen }),

      totalPieces: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0)
      },

      subtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
      },
    }),
    {
      name: 'rof_bag_storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

