import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, MapPin } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Mast } from '@/components/Mast'
import { Button } from '@/components/Button'
import { DiamondMark } from '@/components/Logo'
import { api } from '@/api/client'
import { Order, OrderStatus } from '@/api/types'
import { formatNaira } from '@/lib/money'

export const Route = createFileRoute('/track')({
  component: TrackOrderPage,
})

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'received', label: 'Order Received', desc: 'Recorded in dispatch ledger' },
  { status: 'confirmed', label: 'Payment Confirmed', desc: 'Settlement verified' },
  { status: 'packed', label: 'Packed & Sealed', desc: 'Sleeved in signature packaging' },
  { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'In courier transit' },
  { status: 'delivered', label: 'Delivered', desc: 'Received and signed' },
]

function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [contact, setContact] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || !contact) return

    setLoading(true)
    setErrorMsg('')
    setOrder(null)

    try {
      const result = await api.trackOrder(orderId, contact)
      if (result) {
        setOrder(result)
      } else {
        setErrorMsg('No order found matching those credentials. Please check your reference and phone/email.')
      }
    } catch {
      setErrorMsg('Could not verify status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Determine active step index
  const getStepIndex = (status: OrderStatus) => {
    const idx = STATUS_STEPS.findIndex((s) => s.status === status)
    return idx >= 0 ? idx : 0
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Masthead */}
      <Mast
        badge="Real-time Status"
        title="Track an *order*"
        lead="Enter your official ROF reference and the phone number or email address submitted during checkout."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Track Order' },
        ]}
      />

      {/* 2. Tracking Form & Timeline */}
      <Pane tone="bone" className="min-h-screen py-12 px-4 md:px-8">
        <div className="mx-auto max-w-2xl space-y-10">
          {/* Tracking Form */}
          <form
            onSubmit={handleTrack}
            className="p-6 md:p-8 bg-[var(--bone)] border border-[var(--hairline)] shadow-sm space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                  Order Reference *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROF-849102"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full h-12 px-4 text-base font-mono uppercase bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                  Phone or Email *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. chidi.okafor@gmail.com"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full h-12 px-4 text-base font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching Ledger...' : 'Locate Order'}
            </Button>

            {/* Quick Demo Hint */}
            <p className="text-[11px] text-[var(--muted)] font-sans text-center">
              Try demo order: <button type="button" onClick={() => { setOrderId('ROF-849102'); setContact('chidi.okafor@gmail.com') }} className="underline font-semibold text-[var(--acc-on-bone)]">ROF-849102</button> (Chidi Okafor)
            </p>

            {errorMsg && (
              <p className="p-3 bg-[var(--acc-on-bone)]/10 border border-[var(--acc-on-bone)] text-xs text-[var(--acc-on-bone)] font-sans">
                {errorMsg}
              </p>
            )}
          </form>

          {/* Result Timeline */}
          {order && (
            <div className="p-6 md:p-8 bg-[var(--bone)] border-2 border-[var(--ink)] space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[var(--hairline)]">
                <div>
                  <span className="label-caps text-[var(--acc-on-bone)]">Current Status</span>
                  <h3 className="font-serif text-3xl text-[var(--ink)] capitalize">
                    {order.status.replace(/_/g, ' ')}
                  </h3>
                </div>
                <div className="text-right text-xs font-sans text-[var(--muted)]">
                  <p>Ref: <span className="font-mono font-semibold text-[var(--ink)]">{order.id}</span></p>
                  <p>{new Date(order.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</p>
                </div>
              </div>

              {/* Waybill / Courier info if out for delivery */}
              {order.courier && (
                <div className="p-4 bg-[#ded6c3] border border-[var(--hairline)] flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[var(--acc-on-bone)]" />
                    <span>Courier: <strong className="text-[var(--ink)]">{order.courier}</strong></span>
                  </div>
                  {order.trackingNumber && (
                    <span>Waybill: <strong className="font-mono">{order.trackingNumber}</strong></span>
                  )}
                </div>
              )}

              {/* Vertical Status Timeline */}
              <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--hairline)]">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(order.status)
                  const isDone = idx <= currentIdx
                  const isCurrent = idx === currentIdx

                  return (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Step Indicator with active pulse */}
                      <span
                        className={`absolute -left-6 h-5 w-5 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                          isDone
                            ? 'bg-[var(--acc-on-bone)] text-[#fff6ec]'
                            : 'bg-[var(--bone)] border border-[var(--hairline)] text-[var(--muted)]'
                        } ${isCurrent ? 'ring-4 ring-[var(--acc-on-bone)]/25 animate-pulse' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                      </span>

                      {/* Content */}
                      <div className="space-y-0.5">
                        <p
                          className={`text-sm font-semibold uppercase tracking-wider font-sans ${
                            isCurrent
                              ? 'text-[var(--acc-on-bone)]'
                              : isDone
                              ? 'text-[var(--ink)]'
                              : 'text-[var(--muted)]'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-[var(--muted)] font-sans">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Item summary */}
              <div className="pt-4 border-t border-[var(--hairline)] space-y-2">
                <span className="label-caps text-[var(--muted)]">Package Pieces</span>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs font-sans text-[var(--ink)]">
                    <span>{item.qty}× {item.name} ({item.colour}, Size {item.size})</span>
                    <span className="font-medium">{formatNaira(item.unitPrice * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Pane>
    </div>
  )
}

