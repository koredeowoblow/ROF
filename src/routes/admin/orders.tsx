import React, { useState, useEffect, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Truck,
  Package,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Button } from '@/components/Button'
import { api } from '@/api/client'
import { Order, OrderStatus } from '@/api/types'
import { formatNaira } from '@/lib/money'

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrdersPage,
})

function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    const res = await api.getAdminOrders()
    setOrders(res)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status filter
      if (selectedStatus !== 'all' && o.status !== selectedStatus) {
        return false
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchId = o.id.toLowerCase().includes(q)
        const matchName = o.customer.name.toLowerCase().includes(q)
        const matchPhone = o.customer.phone.includes(q)
        const matchEmail = o.customer.email.toLowerCase().includes(q)
        if (!matchId && !matchName && !matchPhone && !matchEmail) return false
      }

      return true
    })
  }, [orders, selectedStatus, searchQuery])

  // Bulk status change action
  const handleBulkStatus = async (status: OrderStatus) => {
    if (selectedOrders.length === 0) return

    for (const id of selectedOrders) {
      await api.updateOrderStatus(id, status, `Bulk transition to ${status}`)
    }
    setToastMessage(`Updated ${selectedOrders.length} orders to ${status}.`)
    setTimeout(() => setToastMessage(null), 3000)
    setSelectedOrders([])
    await fetchOrders()
  }

  // Quick single status transition
  const handleTransition = async (orderId: string, nextStatus: OrderStatus) => {
    await api.updateOrderStatus(orderId, nextStatus)
    setToastMessage(`Order ${orderId} shifted to ${nextStatus}.`)
    setTimeout(() => setToastMessage(null), 3000)
    await fetchOrders()
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Order ID,Customer,Phone,Email,State,Subtotal,Delivery Fee,Total,Status,Payment Method,Created At\n']
    const rows = filteredOrders.map((o) =>
      `"${o.id}","${o.customer.name}","${o.customer.phone}","${o.customer.email}","${o.customer.state}",${o.subtotal},${o.fee},${o.total},"${o.status}","${o.payment.method}","${o.createdAt}"\n`
    )
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rof_orders_${Date.now()}.csv`
    a.click()
  }

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6 w-full max-w-7xl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-[var(--bone)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-2xl text-xs font-sans font-semibold flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-[var(--acc-on-bone)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <span className="label-caps text-[var(--acc)]">Ledger Management</span>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Orders</h1>
          <p className="text-xs text-[var(--muted)] font-sans">
            Total {orders.length} orders recorded in production ledger
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[var(--ink)] border border-[var(--hairline)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search order ref, name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs font-sans bg-transparent border border-[var(--hairline)] text-[var(--bone)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc)]"
          />
        </div>

        {/* Status Pill Tabs with tactile micro-interactions */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['all', 'received', 'confirmed', 'packed', 'out_for_delivery', 'delivered'].map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.1 }}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-sans whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === s
                  ? 'bg-[var(--bone)] text-[var(--ink)] font-semibold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--bone)] hover:bg-[var(--surface-tint)]'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bulk actions banner when rows are selected */}
      {selectedOrders.length > 0 && (
        <div className="p-3 bg-[#ded6c3] text-[var(--ink)] border border-[var(--ink)] flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          <span className="font-semibold">{selectedOrders.length} orders selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus('confirmed')}
              className="px-2.5 py-1 bg-[var(--ink)] text-[var(--bone)] hover:bg-[var(--acc)] transition-colors uppercase text-[10px] font-semibold"
            >
              Mark Confirmed
            </button>
            <button
              onClick={() => handleBulkStatus('packed')}
              className="px-2.5 py-1 bg-[var(--ink)] text-[var(--bone)] hover:bg-[var(--acc)] transition-colors uppercase text-[10px] font-semibold"
            >
              Mark Packed
            </button>
            <button
              onClick={() => handleBulkStatus('out_for_delivery')}
              className="px-2.5 py-1 bg-[var(--ink)] text-[var(--bone)] hover:bg-[var(--acc)] transition-colors uppercase text-[10px] font-semibold"
            >
              Mark In Transit
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="px-2 text-xs text-[var(--ink)] underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DESKTOP TABLE VIEW (>= 768px) */}
      {/* ============================================================ */}
      <div className="hidden md:block border border-[var(--hairline)] bg-[var(--ink)] overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#121110] border-b border-[var(--hairline)] text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="p-3.5 w-10">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={(e) =>
                    setSelectedOrders(e.target.checked ? filteredOrders.map((o) => o.id) : [])
                  }
                />
              </th>
              <th className="p-3.5">Reference</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Destination</th>
              <th className="p-3.5">Items</th>
              <th className="p-3.5">Total</th>
              <th className="p-3.5">Payment</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Quick Transition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hairline)]/40">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-xs text-[var(--muted)]">
                  No orders matched this filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrders.includes(order.id)
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-[var(--surface-tint)] transition-colors ${
                      isSelected ? 'bg-[var(--surface-tint)]' : ''
                    }`}
                  >
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(order.id)}
                      />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[var(--bone)]">
                      {order.id}
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-[var(--bone)]">{order.customer.name}</p>
                      <p className="text-[10px] text-[var(--muted)]">{order.customer.phone}</p>
                    </td>
                    <td className="p-3.5 text-[var(--muted)]">
                      {order.customer.city}, {order.customer.state}
                    </td>
                    <td className="p-3.5 text-[var(--bone)]">
                      {order.items.map((i) => `${i.qty}× ${i.size}`).join(', ')}
                    </td>
                    <td className="p-3.5 font-semibold text-[var(--bone)]">
                      {formatNaira(order.total)}
                    </td>
                    <td className="p-3.5">
                      <span className="uppercase text-[10px] text-[var(--muted)]">
                        {order.payment.method}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider ${
                          order.status === 'received'
                            ? 'border border-[var(--acc)] text-[var(--acc)]'
                            : order.status === 'delivered'
                            ? 'bg-[var(--bone)] text-[var(--ink)]'
                            : 'border border-[var(--hairline)] text-[var(--bone)]'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {order.status === 'received' && (
                        <button
                          onClick={() => handleTransition(order.id, 'confirmed')}
                          className="px-2 py-1 border border-[var(--bone)] text-[10px] uppercase text-[var(--bone)] hover:bg-[var(--bone)] hover:text-[var(--ink)] font-semibold"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleTransition(order.id, 'packed')}
                          className="px-2 py-1 border border-[var(--bone)] text-[10px] uppercase text-[var(--bone)] hover:bg-[var(--bone)] hover:text-[var(--ink)] font-semibold"
                        >
                          Pack
                        </button>
                      )}
                      {order.status === 'packed' && (
                        <button
                          onClick={() => handleTransition(order.id, 'out_for_delivery')}
                          className="px-2 py-1 bg-[var(--acc)] text-[var(--label-on-acc)] text-[10px] uppercase font-semibold"
                        >
                          Dispatch
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleTransition(order.id, 'delivered')}
                          className="px-2 py-1 bg-[var(--bone)] text-[var(--ink)] text-[10px] uppercase font-semibold"
                        >
                          Deliver
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================ */}
      {/* MOBILE STACKED RECORD CARDS (< 768px) */}
      {/* One-handed operation friendly! */}
      {/* ============================================================ */}
      <div className="md:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="p-8 text-center text-xs text-[var(--muted)]">No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 border border-[var(--hairline)] bg-[#0a2323] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-[var(--bone)]">{order.id}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider ${
                    order.status === 'received'
                      ? 'border border-[var(--acc)] text-[var(--acc)]'
                      : order.status === 'delivered'
                      ? 'bg-[var(--bone)] text-[var(--ink)]'
                      : 'border border-[var(--hairline)] text-[var(--bone)]'
                  }`}
                >
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="text-xs font-sans space-y-0.5">
                <p className="font-semibold text-[var(--bone)]">{order.customer.name}</p>
                <p className="text-[var(--muted)]">{order.customer.phone} • {order.customer.city}, {order.customer.state}</p>
                <p className="text-[var(--bone)] pt-1">
                  {order.items.map((i) => `${i.qty}× ${i.name} (${i.size})`).join(', ')}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-base text-[var(--bone)]">{formatNaira(order.total)}</span>
                <div className="flex items-center gap-2">
                  {order.status === 'received' && (
                    <button
                      onClick={() => handleTransition(order.id, 'confirmed')}
                      className="px-3 py-1.5 bg-[var(--acc)] text-[var(--label-on-acc)] text-xs font-semibold uppercase"
                    >
                      Confirm
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handleTransition(order.id, 'packed')}
                      className="px-3 py-1.5 bg-[var(--bone)] text-[var(--ink)] text-xs font-semibold uppercase"
                    >
                      Pack
                    </button>
                  )}
                  {order.status === 'packed' && (
                    <button
                      onClick={() => handleTransition(order.id, 'out_for_delivery')}
                      className="px-3 py-1.5 bg-[var(--acc)] text-[var(--label-on-acc)] text-xs font-semibold uppercase"
                    >
                      Dispatch
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleTransition(order.id, 'delivered')}
                      className="px-3 py-1.5 bg-[var(--bone)] text-[var(--ink)] text-xs font-semibold uppercase"
                    >
                      Deliver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

