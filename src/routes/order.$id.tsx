import React, { useState } from 'react'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { Check, Copy, ArrowRight, ShieldCheck, Truck, Package } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Mast } from '@/components/Mast'
import { Button } from '@/components/Button'
import { DiamondMark } from '@/components/Logo'
import { api } from '@/api/client'
import { formatNaira } from '@/lib/money'
import { Order } from '@/api/types'

export const Route = createFileRoute('/order/$id')({
  loader: async ({ params }) => {
    const orders = await api.getAdminOrders()
    const order = orders.find((o) => o.id === params.id)
    return order || null
  },
  component: OrderConfirmationPage,
})

function OrderConfirmationPage() {
  const { id } = useParams({ from: '/order/$id' })
  const order = Route.useLoaderData()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Masthead */}
      <Mast
        badge="Order Received"
        title="Destined for *delivery.*"
        lead="Your order has been recorded in our dispatch ledger. Each piece is individually inspected and packaged in signature ROF sleeves."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Orders' },
          { label: id },
        ]}
      />

      {/* 2. Confirmation Details */}
      <Pane tone="bone" className="min-h-screen py-12 px-4 md:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Order ID Banner */}
          <div className="p-6 md:p-8 bg-[var(--bone)] border-2 border-[var(--ink)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="label-caps text-[var(--acc-on-bone)]">Official Reference</span>
              <p className="font-serif text-3xl sm:text-4xl text-[var(--ink)] mt-1 font-bold">
                {id}
              </p>
              <p className="text-xs text-[var(--muted)] mt-1 font-sans">
                Confirmation notification dispatched to {order ? order.customer.email : 'your email'}.
              </p>
            </div>

            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
                <span className="flex items-center gap-1.5 text-[var(--acc-on-bone)]">
                  <Check className="h-4 w-4" /> Copied
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Copy className="h-4 w-4" /> Copy Reference
                </span>
              )}
            </Button>
          </div>

          {/* Bank Transfer Instructions (if applicable) */}
          {order?.payment.method === 'bank_transfer' && (
            <div className="p-6 bg-[#ded6c3] border border-[var(--ink)] space-y-3">
              <span className="label-caps text-[var(--acc-on-bone)]">Studio Bank Details</span>
              <h3 className="font-serif text-xl text-[var(--ink)]">Complete your direct transfer</h3>
              <p className="text-xs text-[var(--ink)] leading-relaxed">
                Please transfer exactly <span className="font-semibold">{formatNaira(order.total)}</span> to the official ROF operations account below. Use your reference <span className="font-mono font-semibold">{id}</span> in the payment narration.
              </p>
              <div className="p-4 bg-[var(--bone)] border border-[var(--hairline)] space-y-1 text-xs font-mono text-[var(--ink)]">
                <div>Bank: <span className="font-semibold">Guaranty Trust Bank (GTBank)</span></div>
                <div>Account Name: <span className="font-semibold">ROF RAGE CLOTHING LTD</span></div>
                <div>Account Number: <span className="font-semibold">0819203912</span></div>
              </div>
            </div>
          )}

          {/* Order Summary & Destination */}
          {order && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Destination */}
              <div className="p-6 border border-[var(--hairline)] space-y-3">
                <span className="label-caps text-[var(--muted)]">Shipping Destination</span>
                <div className="text-sm font-sans text-[var(--ink)] space-y-1">
                  <p className="font-semibold">{order.customer.name}</p>
                  <p>{order.customer.address}</p>
                  <p>{order.customer.city}, {order.customer.state}</p>
                  <p className="text-xs text-[var(--muted)] pt-1">{order.customer.phone}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-6 border border-[var(--hairline)] space-y-3">
                <span className="label-caps text-[var(--muted)]">Payment Summary</span>
                <div className="text-sm font-sans space-y-1">
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span>{formatNaira(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>Delivery</span>
                    <span>{formatNaira(order.fee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-xs text-[var(--acc-on-bone)]">
                      <span>Discount</span>
                      <span>-{formatNaira(order.discount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[var(--hairline)] flex justify-between font-semibold text-base text-[var(--ink)]">
                    <span>Total Paid</span>
                    <span>{formatNaira(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps Stepper */}
          <div className="p-6 md:p-8 border border-[var(--hairline)] space-y-6">
            <h3 className="font-serif text-2xl text-[var(--ink)]">Next steps for your piece</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-sans">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--acc-on-bone)] font-semibold">
                  <Package className="h-4 w-4" />
                  <span>1. Inspection</span>
                </div>
                <p className="text-[var(--muted)] leading-relaxed">
                  Piece is verified, folded and sleeved with tags in our Lagos studio.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--acc-on-bone)] font-semibold">
                  <Truck className="h-4 w-4" />
                  <span>2. Dispatch</span>
                </div>
                <p className="text-[var(--muted)] leading-relaxed">
                  Passed to express courier. Waybill tracking details sent via SMS.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--acc-on-bone)] font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>3. Arrival</span>
                </div>
                <p className="text-[var(--muted)] leading-relaxed">
                  Delivered directly to your door. Wear with pride and ambition.
                </p>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Link to="/track" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" withArrow fullWidth>
                Track this order
              </Button>
            </Link>
            <Link to="/shop" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth>
                Continue browsing
              </Button>
            </Link>
          </div>
        </div>
      </Pane>
    </div>
  )
}
