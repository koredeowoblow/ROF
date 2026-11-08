import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Boxes, AlertTriangle, Check, Save, ArrowDown, ArrowUp } from 'lucide-react'
import { Button } from '@/components/Button'
import { api } from '@/api/client'
import { Product } from '@/api/types'

export const Route = createFileRoute('/admin/inventory')({
  component: AdminInventoryPage,
})

function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    const list = await api.getProducts()
    setProducts(list)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStockUpdate = async (productId: string, size: string, newStock: number) => {
    await api.updateInventory(productId, size, newStock)
    setToast(`Updated stock for ${size} to ${newStock} units.`)
    setTimeout(() => setToast(null), 2500)
    await loadData()
  }

  return (
    <div className="space-y-6 w-full max-w-7xl">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-[var(--bone)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-2xl text-xs font-sans font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-[var(--acc-on-bone)]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <span className="label-caps text-[var(--acc)]">Stock Management</span>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Inventory</h1>
          <p className="text-xs text-[var(--muted)] font-sans">
            Direct stock control across all streetwear sizes with low-stock warnings
          </p>
        </div>
      </div>

      {/* Inventory Matrix Table */}
      <div className="border border-[var(--hairline)] bg-[var(--ink)] overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#121110] border-b border-[var(--hairline)] text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Piece</th>
              <th className="p-3.5">Colour</th>
              <th className="p-3.5 text-center">S</th>
              <th className="p-3.5 text-center">M</th>
              <th className="p-3.5 text-center">L</th>
              <th className="p-3.5 text-center">XL</th>
              <th className="p-3.5 text-center">XXL</th>
              <th className="p-3.5 text-right">Total Units</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hairline)]/40">
            {products.map((p) => {
              const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
              return (
                <tr key={p.id} className="hover:bg-[var(--surface-tint)]">
                  <td className="p-3.5 font-serif text-sm font-semibold text-[var(--bone)]">
                    {p.name}
                  </td>
                  <td className="p-3.5 text-[var(--muted)]">{p.colour}</td>
                  {p.variants.map((v) => (
                    <td key={v.size} className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-1 font-mono">
                        <button
                          type="button"
                          onClick={() => handleStockUpdate(p.id, v.size, Math.max(0, v.stock - 1))}
                          className="h-6 w-6 border border-[var(--hairline)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--bone)]"
                        >
                          -
                        </button>
                        <span
                          className={`w-10 text-center font-bold ${
                            v.stock <= 5 ? 'text-[var(--acc)]' : 'text-[var(--bone)]'
                          }`}
                        >
                          {v.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStockUpdate(p.id, v.size, v.stock + 1)}
                          className="h-6 w-6 border border-[var(--hairline)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--bone)]"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  ))}
                  <td className="p-3.5 text-right font-mono font-bold text-sm text-[var(--bone)]">
                    {totalStock} pcs
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

