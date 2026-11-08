import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Sliders, Plus, Tag, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { api } from '@/api/client'
import { Discount } from '@/api/types'
import { formatNaira } from '@/lib/money'

export const Route = createFileRoute('/admin/discounts')({
  component: AdminDiscountsPage,
})

function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])

  useEffect(() => {
    api.getDiscounts().then((res) => setDiscounts(res))
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <span className="label-caps text-[var(--acc)]">Marketing Promotions</span>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Discounts</h1>
          <p className="text-xs text-[var(--muted)] font-sans">
            Campaign voucher codes and fixed checkout deductions
          </p>
        </div>
      </div>

      <div className="border border-[var(--hairline)] bg-[var(--ink)] overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#121110] border-b border-[var(--hairline)] text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Voucher Code</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Benefit</th>
              <th className="p-3.5">Threshold</th>
              <th className="p-3.5">Redemptions</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hairline)]/40">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-[var(--surface-tint)]">
                <td className="p-3.5 font-mono font-bold text-sm text-[var(--bone)]">
                  {d.code}
                </td>
                <td className="p-3.5 text-[var(--muted)] capitalize">{d.type}</td>
                <td className="p-3.5 font-semibold text-[var(--acc)]">
                  {d.type === 'percentage' ? `${d.value}% Off` : `-${formatNaira(d.value)}`}
                </td>
                <td className="p-3.5 text-[var(--muted)]">
                  Min order: {formatNaira(d.minOrder)}
                </td>
                <td className="p-3.5 font-mono text-[var(--bone)]">{d.usedCount} used</td>
                <td className="p-3.5 text-right">
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                    d.active ? 'bg-[var(--bone)] text-[var(--ink)]' : 'border border-[var(--hairline)] text-[var(--muted)]'
                  }`}>
                    {d.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
