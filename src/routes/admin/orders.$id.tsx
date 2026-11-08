import React, { useState, useEffect } from 'react'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import {
  Printer,
  MessageCircle,
  Truck,
  CheckCircle,
  Package,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react'
import { Button } from '@/components/Button'
import { Numeral } from '@/components/Numeral'
import { DiamondMark } from '@/components/Logo'
import { api } from '@/api/client'
import { Order, OrderStatus } from '@/api/types'
import { formatNaira } from '@/lib/money'

export const Route = createFileRoute('/admin/orders/$id')({
  loader: async ({ params }): Promise<Order | null> => {
    const orders = await api.getAdminOrders()
    const order = orders.find((o) => o.id === params.id)
    return order || null
  },
  component: AdminOrderDetailPage,
})

const STATUS_STEPS: OrderStatus[] = [
  'received',
  'confirmed',
  'packed',
  'out_for_delivery',
  'delivered',
]

function AdminOrderDetailPage() {
  const params = useParams({ strict: false }) as { id?: string }
  const id = params.id || ''
  const initialOrder = Route.useLoaderData() as Order | null
  const [order, setOrder] = useState<Order | null>(initialOrder || null)
  const [internalNote, setInternalNote] = useState(initialOrder?.internalNotes || '')
  const [courierName, setCourierName] = useState('GIG Logistics')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const reloadOrder = async () => {
    const list = await api.getAdminOrders()
    const found = list.find((o) => o.id === id)
    if (found) setOrder(found)
  }

  const handleStatusChange = async (nextStatus: OrderStatus, note?: string) => {
    if (!order) return
    const updated = await api.updateOrderStatus(
      order.id,
      nextStatus,
      note,
      nextStatus === 'out_for_delivery' ? courierName : undefined,
      nextStatus === 'out_for_delivery' ? trackingNumber : undefined
    )
    setOrder(updated)
    setToast(`Order shifted to ${nextStatus}.`)
    setTimeout(() => setToast(null), 2500)
    setDispatchModalOpen(false)
    setCancelModalOpen(false)
  }

  const handlePrintSlip = () => {
    window.print()
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="font-serif text-2xl text-[var(--bone)]">Order {id} not located.</p>
        <Link to="/admin/orders">
          <Button variant="secondary" size="sm">
            Return to Orders
          </Button>
        </Link>
      </div>
    )
  }

  // Format phone number for WhatsApp link
  const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '')
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${order.customer.name}, reaching out from ROF RAGE regarding your order ${order.id}.`
  )}`

  const currentStepIdx = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-[var(--bone)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-2xl text-xs font-sans font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-[var(--acc-on-bone)]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Bar with Back Link & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 border border-[var(--hairline)] hover:border-[var(--bone)] text-[var(--bone)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-2xl text-[var(--bone)]">{order.id}</span>
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
            <p className="text-xs text-[var(--muted)] font-sans mt-0.5">
              Placed {new Date(order.createdAt).toLocaleString('en-NG')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Print Packing Slip */}
          <Button variant="secondary" size="sm" onClick={handlePrintSlip}>
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Packing Slip
          </Button>

          {/* WhatsApp Direct Link */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-sans font-semibold uppercase tracking-wider bg-transparent border border-[var(--hairline)] text-[var(--bone)] hover:border-[var(--bone)] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[var(--acc)]" />
            <span>WhatsApp Client</span>
          </a>
        </div>
      </div>

      {/* Status Stepper Progression */}
      <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-4">
        <span className="label-caps text-[var(--muted)]">Fulfillment Lifecycle</span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STATUS_STEPS.map((step, idx) => {
            const isDone = idx <= currentStepIdx
            const isCurrent = idx === currentStepIdx
            return (
              <div
                key={step}
                className={`p-3 border text-xs font-sans transition-colors ${
                  isCurrent
                    ? 'border-[var(--acc)] bg-[var(--acc)]/10 text-[var(--bone)]'
                    : isDone
                    ? 'border-[var(--bone)] bg-[var(--bone)]/10 text-[var(--bone)]'
                    : 'border-[var(--hairline)] text-[var(--muted)] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px]">0{idx + 1}</span>
                  {isDone && <Check className="h-3 w-3 text-[var(--acc)]" />}
                </div>
                <p className="font-semibold uppercase tracking-wider text-[11px]">
                  {step.replace(/_/g, ' ')}
                </p>
              </div>
            )
          })}
        </div>

        {/* Operational Transition Action Buttons */}
        <div className="pt-4 border-t border-[var(--hairline)] flex flex-wrap items-center gap-3">
          {order.status === 'received' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('confirmed', 'Payment verified')}
            >
              Verify & Confirm Order
            </Button>
          )}

          {order.status === 'confirmed' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('packed', 'Folded and sleeved')}
            >
              Mark Garments Packed
            </Button>
          )}

          {order.status === 'packed' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setDispatchModalOpen(true)}
            >
              <Truck className="h-3.5 w-3.5 mr-1.5" />
              Dispatch with Waybill
            </Button>
          )}

          {order.status === 'out_for_delivery' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('delivered', 'Signed by customer')}
            >
              Confirm Delivery Completed
            </Button>
          )}

          {order.status !== 'cancelled' && order.status !== 'refunded' && (
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="text-xs uppercase tracking-wider text-[var(--acc)] hover:underline ml-auto"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Details Breakdown (7 cols) + Customer & Notes (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Garment Pieces & Ledger Financials (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Items */}
          <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-4">
            <h3 className="font-serif text-xl text-[var(--bone)]">Order Items</h3>
            <div className="divide-y divide-[var(--hairline)]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 flex items-center justify-between text-xs font-sans">
                  <div>
                    <h4 className="font-serif text-base text-[var(--bone)]">{item.name}</h4>
                    <p className="text-[var(--muted)]">
                      {item.colour} • Size {item.size} • Qty {item.qty}
                    </p>
                  </div>
                  <span className="font-semibold text-sm text-[var(--bone)]">
                    {formatNaira(item.unitPrice * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-[var(--hairline)] space-y-2 text-xs font-sans">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Delivery Fee</span>
                <span>{formatNaira(order.fee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[var(--acc)]">
                  <span>Discount</span>
                  <span>-{formatNaira(order.discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[var(--hairline)] flex justify-between font-semibold text-base text-[var(--bone)]">
                <span>Total Amount</span>
                <span>{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-4">
            <h3 className="font-serif text-xl text-[var(--bone)]">Status Event History</h3>
            <div className="space-y-3 font-mono text-xs">
              {order.history.map((h, i) => (
                <div key={i} className="flex items-start gap-3 text-[var(--muted)]">
                  <span className="text-[var(--bone)]">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-[var(--acc)] font-bold uppercase">{h.status}</span>
                  <span>{h.note || 'No notes'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Customer & Dispatch Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Coordinates */}
          <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-3 text-xs font-sans">
            <span className="label-caps text-[var(--muted)]">Client Coordinates</span>
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold text-base text-[var(--bone)]">{order.customer.name}</p>
              <p className="text-[var(--muted)]">{order.customer.email}</p>
              <p className="text-[var(--muted)]">{order.customer.phone}</p>
              <p className="text-[var(--bone)] pt-1">{order.customer.address}</p>
              <p className="text-[var(--bone)]">{order.customer.city}, {order.customer.state}</p>
            </div>
            {order.notes && (
              <div className="mt-3 p-3 bg-[#141312] border border-[var(--hairline)]">
                <span className="text-[10px] uppercase text-[var(--acc)] block">Customer Delivery Note:</span>
                <p className="text-xs text-[var(--bone)] mt-0.5">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Courier Dispatch Info */}
          {order.courier && (
            <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-2 text-xs font-sans">
              <span className="label-caps text-[var(--acc)]">Waybill Tracking</span>
              <p className="text-sm font-semibold text-[var(--bone)]">Courier: {order.courier}</p>
              {order.trackingNumber && (
                <p className="font-mono text-xs text-[var(--bone)]">Waybill: {order.trackingNumber}</p>
              )}
            </div>
          )}

          {/* Internal Staff Notes */}
          <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-3 text-xs font-sans">
            <span className="label-caps text-[var(--muted)]">Internal Staff Notes</span>
            <textarea
              rows={3}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Private notes visible only to fulfillment team..."
              className="w-full p-2.5 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await api.updateOrderStatus(order.id, order.status, internalNote)
                setToast('Internal note saved.')
                setTimeout(() => setToast(null), 2500)
              }}
            >
              Save Internal Note
            </Button>
          </div>
        </div>
      </div>

      {/* Dispatch Waybill Modal */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--ink)] border border-[var(--bone)] p-6 space-y-4 text-xs font-sans text-[var(--bone)]">
            <h3 className="font-serif text-2xl">Dispatch Order {order.id}</h3>
            <div>
              <label className="block uppercase tracking-wider mb-1">Courier Partner *</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full h-10 px-3 bg-[var(--ink)] border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
              >
                <option value="GIG Logistics">GIG Logistics</option>
                <option value="DHL Express">DHL Express</option>
                <option value="Kwik Delivery">Kwik Delivery</option>
                <option value="Feather Express">Feather Express</option>
                <option value="Direct Studio Courier">Direct Studio Courier</option>
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wider mb-1">Waybill / Tracking Reference *</label>
              <input
                type="text"
                placeholder="e.g. WAY-981294"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] font-mono focus:outline-none focus:border-[var(--acc)]"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setDispatchModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusChange('out_for_delivery', `Dispatched via ${courierName}`)}
              >
                Confirm Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--ink)] border border-[var(--acc)] p-6 space-y-4 text-xs font-sans text-[var(--bone)]">
            <h3 className="font-serif text-2xl text-[var(--acc)]">Cancel Order {order.id}</h3>
            <div>
              <label className="block uppercase tracking-wider mb-1">Reason for cancellation *</label>
              <input
                type="text"
                placeholder="e.g. Out of stock / Customer requested cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setCancelModalOpen(false)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusChange('cancelled', cancelReason || 'Cancelled by staff')}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
