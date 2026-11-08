import React, { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Button } from '@/components/Button'
import { Numeral } from '@/components/Numeral'
import { DiamondMark } from '@/components/Logo'
import { api } from '@/api/client'
import { formatNaira } from '@/lib/money'

export const Route = createFileRoute('/admin/')({
  component: AdminOverviewPage,
})

function AdminOverviewPage() {
  const [range, setRange] = useState<'today' | '7d' | '30d'>('7d')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    api.getAdminOverview(range).then((res) => {
      if (isMounted) {
        setData(res)
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [range])

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-xs text-[var(--muted)] font-mono">
        Loading ledger analytics...
      </div>
    )
  }

  // Simulated daily chart values
  const dailyData = [
    { day: 'Mon', count: 4, revenue: 110000 },
    { day: 'Tue', count: 6, revenue: 165000 },
    { day: 'Wed', count: 8, revenue: 220000 },
    { day: 'Thu', count: 12, revenue: 340000, isPeak: true },
    { day: 'Fri', count: 7, revenue: 195000 },
    { day: 'Sat', count: 9, revenue: 250000 },
    { day: 'Sun', count: 5, revenue: 140000 },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Greeting & Date Range Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <span className="label-caps text-[var(--acc)]">Studio Dashboard</span>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">
            Welcome back, Owner
          </h1>
          <p className="text-xs text-[var(--muted)] font-sans mt-0.5">
            Lagos Fulfillment Hub • Operating under ROF RAGE OS v1.0
          </p>
        </div>

        {/* Date Switcher */}
        <div className="flex items-center border border-[var(--hairline)] p-0.5 bg-transparent">
          {(['today', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-sans transition-colors ${
                range === r
                  ? 'bg-[var(--bone)] text-[var(--ink)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--bone)]'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Primary KPI Stage: The Key Number in Rage Red */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Revenue Card (Ink ground, 7 cols) */}
        <Pane tone="ink" withGrain className="lg:col-span-7 p-6 sm:p-8 border border-[var(--hairline)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="label-caps text-[var(--muted)]">Gross Revenue ({range})</span>
              <span className="flex items-center gap-1 text-[var(--acc)] text-xs font-semibold">
                <TrendingUp className="h-3.5 w-3.5" /> +28.4% vs last cycle
              </span>
            </div>

            {/* The signature large red number */}
            <div className="mt-4">
              <span className="text-5xl sm:text-7xl font-display text-[var(--acc)] font-bold tracking-tight">
                {formatNaira(data.revenue)}
              </span>
            </div>

            {/* Sparkline visualization */}
            <div className="mt-6 flex items-end gap-2 h-16 pt-2 border-b border-[var(--hairline)]/40">
              {dailyData.map((d, i) => {
                const heightPct = Math.round((d.revenue / 340000) * 100)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className={`w-full transition-all duration-300 ${
                        d.isPeak ? 'bg-[var(--acc)]' : 'bg-[var(--bone)] opacity-30 group-hover:opacity-60'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] text-[var(--muted)] font-mono">{d.day}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-[var(--muted)] font-sans">
            <span>Server recomputed figures</span>
            <span className="text-[var(--bone)]">Settled via Paystack & Bank Transfer</span>
          </div>
        </Pane>

        {/* Three Secondary KPI figures in Bone Cards (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          {/* Card 1: Orders */}
          <Pane tone="bone" className="p-5 border border-[var(--hairline)] flex items-center justify-between">
            <div>
              <span className="label-caps text-[var(--muted)]">Orders Placed</span>
              <p className="font-serif text-3xl sm:text-4xl text-[var(--ink)] mt-1 font-bold">
                {data.orderCount}
              </p>
              <p className="text-[11px] text-[var(--muted)] font-sans mt-0.5">Across 18 Nigerian states</p>
            </div>
            <div className="h-12 w-12 border border-[var(--ink)] flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-[var(--ink)]" />
            </div>
          </Pane>

          {/* Card 2: Average Order Value */}
          <Pane tone="bone" className="p-5 border border-[var(--hairline)] flex items-center justify-between">
            <div>
              <span className="label-caps text-[var(--muted)]">Average Basket (AOV)</span>
              <p className="font-serif text-3xl sm:text-4xl text-[var(--ink)] mt-1 font-bold">
                {formatNaira(data.averageOrderValue)}
              </p>
              <p className="text-[11px] text-[var(--muted)] font-sans mt-0.5">1.4 pieces per customer</p>
            </div>
            <div className="h-12 w-12 border border-[var(--ink)] flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[var(--ink)]" />
            </div>
          </Pane>

          {/* Card 3: Pieces Sold */}
          <Pane tone="bone" className="p-5 border border-[var(--hairline)] flex items-center justify-between">
            <div>
              <span className="label-caps text-[var(--muted)]">Garments Sold</span>
              <p className="font-serif text-3xl sm:text-4xl text-[var(--ink)] mt-1 font-bold">
                {data.piecesSold}
              </p>
              <p className="text-[11px] text-[var(--muted)] font-sans mt-0.5">Heavyweight tees fulfilled</p>
            </div>
            <div className="h-12 w-12 border border-[var(--ink)] flex items-center justify-center">
              <Package className="h-5 w-5 text-[var(--ink)]" />
            </div>
          </Pane>
        </div>
      </div>

      {/* 3. "Needs Action" Ticker Block (Red accents for urgent items) */}
      <div className="border border-[var(--hairline)] bg-[var(--ink)] p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--hairline)]">
          <AlertTriangle className="h-4 w-4 text-[var(--acc)]" />
          <h2 className="label-caps text-[var(--acc)]">Urgent Attention Queue</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          {/* New unconfirmed orders */}
          <div className="p-4 border border-[var(--hairline)] bg-[#141312] space-y-2">
            <span className="text-[var(--muted)] uppercase tracking-wider block">New Orders Awaiting Confirmation</span>
            <p className="font-serif text-2xl text-[var(--bone)]">
              {data.needsAction.newOrders.length} orders
            </p>
            <Link to="/admin/orders" className="text-[var(--acc)] hover:underline inline-block pt-1">
              Confirm in orders ledger →
            </Link>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-4 border border-[var(--hairline)] bg-[#141312] space-y-2">
            <span className="text-[var(--muted)] uppercase tracking-wider block">Low Stock Sizes (&lt; 10 left)</span>
            <p className="font-serif text-2xl text-[var(--acc)]">
              {data.needsAction.lowStock.length} variants
            </p>
            <Link to="/admin/inventory" className="text-[var(--acc)] hover:underline inline-block pt-1">
              Restock in inventory →
            </Link>
          </div>

          {/* Unanswered messages */}
          <div className="p-4 border border-[var(--hairline)] bg-[#141312] space-y-2">
            <span className="text-[var(--muted)] uppercase tracking-wider block">Unanswered Studio Messages</span>
            <p className="font-serif text-2xl text-[var(--bone)]">
              {data.needsAction.unreadMessages.length} inquiries
            </p>
            <Link to="/admin/messages" className="text-[var(--acc)] hover:underline inline-block pt-1">
              View messages inbox →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Table & Top Pieces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 border border-[var(--hairline)] p-6 bg-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
            <h3 className="font-serif text-2xl text-[var(--bone)]">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs uppercase tracking-wider text-[var(--acc)] hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-[var(--hairline)] text-[var(--muted)] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5">Reference</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Pieces</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)]/40">
                {data.recentOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-[var(--surface-tint)]">
                    <td className="py-3 font-mono font-bold text-[var(--bone)]">{o.id}</td>
                    <td className="py-3 text-[var(--bone)]">{o.customer.name}</td>
                    <td className="py-3 text-[var(--muted)]">{o.items.length} items</td>
                    <td className="py-3 font-medium text-[var(--bone)]">{formatNaira(o.total)}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider ${
                        o.status === 'received'
                          ? 'border border-[var(--acc)] text-[var(--acc)]'
                          : o.status === 'delivered'
                          ? 'bg-[var(--bone)] text-[var(--ink)]'
                          : 'border border-[var(--hairline)] text-[var(--bone)]'
                      }`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link to="/admin/orders" className="text-[var(--acc)] hover:underline">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Pieces (4 cols) */}
        <div className="lg:col-span-4 border border-[var(--hairline)] p-6 bg-[var(--ink)] space-y-4">
          <div className="pb-3 border-b border-[var(--hairline)]">
            <h3 className="font-serif text-2xl text-[var(--bone)]">Top Pieces</h3>
            <span className="text-[11px] text-[var(--muted)] font-sans">Fastest moving in Collection 01</span>
          </div>

          <div className="space-y-4">
            {data.topPieces.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-[var(--hairline)] bg-[#141312]">
                <div className="flex items-center gap-3">
                  <Numeral value={idx + 1} size="sm" />
                  <div>
                    <h4 className="font-serif text-base text-[var(--bone)] leading-tight">{p.name}</h4>
                    <span className="text-[10px] text-[var(--muted)] font-sans uppercase">{p.colour}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[var(--bone)]">{p.soldCount} claimed</p>
                  <p className="text-[10px] text-[var(--muted)]">{formatNaira(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
