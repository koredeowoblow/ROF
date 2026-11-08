import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Users, Search, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react'
import { api } from '@/api/client'
import { Order } from '@/api/types'
import { formatNaira } from '@/lib/money'

export const Route = createFileRoute('/admin/customers')({
  component: AdminCustomersPage,
})

interface AggregatedCustomer {
  email: string
  name: string
  phone: string
  city: string
  state: string
  totalSpent: number
  orderCount: number
  orders: Order[]
}

function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AggregatedCustomer[]>([])
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<AggregatedCustomer | null>(null)

  useEffect(() => {
    api.getAdminOrders().then((orders) => {
      const map = new Map<string, AggregatedCustomer>()

      orders.forEach((o) => {
        const key = o.customer.email.toLowerCase()
        if (!map.has(key)) {
          map.set(key, {
            email: o.customer.email,
            name: o.customer.name,
            phone: o.customer.phone,
            city: o.customer.city,
            state: o.customer.state,
            totalSpent: 0,
            orderCount: 0,
            orders: [],
          })
        }
        const c = map.get(key)!
        c.totalSpent += o.total
        c.orderCount += 1
        c.orders.push(o)
      })

      setCustomers(Array.from(map.values()))
    })
  }, [])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <span className="label-caps text-[var(--acc)]">Directory</span>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Customers</h1>
          <p className="text-xs text-[var(--muted)] font-sans">
            {customers.length} unique client coordinates recorded
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs font-sans bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
          />
        </div>
      </div>

      {/* Grid: Customer Table (7 cols) + Detail Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 border border-[var(--hairline)] bg-[var(--ink)] overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#121110] border-b border-[var(--hairline)] text-[var(--muted)] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Orders</th>
                <th className="p-3.5">Total Spent</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]/40">
              {filtered.map((c) => (
                <tr
                  key={c.email}
                  onClick={() => setSelectedCustomer(c)}
                  className={`cursor-pointer hover:bg-[var(--surface-tint)] transition-colors ${
                    selectedCustomer?.email === c.email ? 'bg-[var(--surface-tint)]' : ''
                  }`}
                >
                  <td className="p-3.5">
                    <p className="font-semibold text-[var(--bone)]">{c.name}</p>
                    <p className="text-[10px] text-[var(--muted)]">{c.email}</p>
                  </td>
                  <td className="p-3.5 text-[var(--muted)]">
                    {c.city}, {c.state}
                  </td>
                  <td className="p-3.5 font-mono text-[var(--bone)]">{c.orderCount}</td>
                  <td className="p-3.5 font-semibold text-[var(--bone)]">
                    {formatNaira(c.totalSpent)}
                  </td>
                  <td className="p-3.5 text-right">
                    <button className="text-[var(--acc)] uppercase text-[10px] font-semibold hover:underline">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer Detail Inspector (5 cols) */}
        <div className="lg:col-span-5 border border-[var(--hairline)] p-6 bg-[var(--ink)] space-y-6">
          {selectedCustomer ? (
            <>
              <div className="pb-4 border-b border-[var(--hairline)]">
                <span className="label-caps text-[var(--acc)]">Profile Ledger</span>
                <h3 className="font-serif text-2xl text-[var(--bone)] mt-1">
                  {selectedCustomer.name}
                </h3>
                <div className="mt-3 space-y-1 text-xs text-[var(--muted)] font-sans">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[var(--acc)]" />
                    <span>{selectedCustomer.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[var(--acc)]" />
                    <span>{selectedCustomer.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[var(--acc)]" />
                    <span>{selectedCustomer.city}, {selectedCustomer.state}</span>
                  </p>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <span className="label-caps text-[var(--muted)]">Order History</span>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {selectedCustomer.orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3 border border-[var(--hairline)] bg-[#141312] text-xs font-sans flex items-center justify-between"
                    >
                      <div>
                        <p className="font-mono font-bold text-[var(--bone)]">{o.id}</p>
                        <p className="text-[10px] text-[var(--muted)]">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[var(--bone)]">{formatNaira(o.total)}</p>
                        <span className="text-[10px] uppercase text-[var(--acc)]">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-[var(--muted)] font-sans">
              Select any customer row to inspect their lifetime spending and order ledger.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

