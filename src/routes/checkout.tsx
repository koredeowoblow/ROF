import React, { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { ShieldCheck, ArrowRight, CreditCard, Landmark, Truck, ChevronDown, ChevronUp } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Mast } from '@/components/Mast'
import { Button } from '@/components/Button'
import { DiamondMark } from '@/components/Logo'
import { useBagStore } from '@/features/bag/bagStore'
import { formatNaira } from '@/lib/money'
import { NIGERIAN_STATES } from '@/lib/states'
import { api } from '@/api/client'
import { CustomerInfo, PaymentMethod } from '@/api/types'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

const checkoutSchema = z.object({
  name: z.string().min(3, 'Enter your full name'),
  phone: z.string().min(10, 'Enter a valid Nigerian phone number (+234 or 080...)'),
  email: z.string().email('Enter a valid email address'),
  address: z.string().min(5, 'Enter street address'),
  city: z.string().min(2, 'Enter town or city'),
  state: z.string().min(1, 'Select your state'),
  notes: z.string().optional(),
})

const CUSTOMER_SAVED_KEY = 'rof_saved_customer'

function CheckoutPage() {
  const navigate = useNavigate()
  const items = useBagStore((s) => s.items)
  const subtotal = useBagStore((s) => s.subtotal())
  const clearBag = useBagStore((s) => s.clearBag)

  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Lagos',
    notes: '',
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack')
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0)
  const [discountMsg, setDiscountMsg] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

  // Load saved customer details from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_SAVED_KEY)
      if (saved) {
        setFormData(JSON.parse(saved))
      }
    } catch {}
  }, [])

  // Dynamic delivery fee calculation: Lagos = ₦2500, other states = ₦4500
  const isLagos = formData.state.toLowerCase().includes('lagos')
  const deliveryFee = isLagos ? 2500 : 4500
  const total = Math.max(0, subtotal + deliveryFee - appliedDiscount)

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase()
    if (code === 'LEGACY10') {
      const discount = Math.round((subtotal * 10) / 100)
      setAppliedDiscount(discount)
      setDiscountMsg('10% Legacy discount applied.')
    } else if (code === 'ROFFAMILY') {
      setAppliedDiscount(5000)
      setDiscountMsg(`${formatNaira(5000)} ROF Family credit applied.`)
    } else {
      setDiscountMsg('Invalid discount code.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      alert('Your bag is empty. Please add items before checking out.')
      navigate({ to: '/shop' })
      return
    }

    const result = checkoutSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      // Save customer info for future checkouts
      localStorage.setItem(CUSTOMER_SAVED_KEY, JSON.stringify(formData))

      // Submit order to API (idempotency enforced, server calculates totals)
      const idempotencyKey = `order_attempt_${Date.now()}`
      const newOrder = await api.createOrder({
        customer: formData,
        items,
        paymentMethod,
        discountCode: appliedDiscount > 0 ? discountCode : undefined,
        idempotencyKey,
      })

      // Clear bag and route to confirmation
      clearBag()
      navigate({ to: '/order/$id', params: { id: newOrder.id } })
    } catch (err) {
      alert('Could not complete order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Masthead */}
      <Mast
        badge="Direct Dispatch"
        title="Check*out*"
        lead="Provide your delivery coordinates and select your payment method. Secure checkout processed in Nigerian Naira."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Bag', href: '/shop' },
          { label: 'Checkout' },
        ]}
      />

      {/* 2. Main Checkout Body (Bone form + Ink summary) */}
      <div className="w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* ============================================================ */}
        {/* LEFT: BONE FORM BODY (7 cols) */}
        {/* ============================================================ */}
        <Pane tone="bone" className="lg:col-span-7 p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-[var(--hairline)]">
          <form onSubmit={handleSubmit} noValidate className="max-w-xl mx-auto space-y-8">
            {/* Step 1: Delivery Coordinates */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--hairline)]">
                <span className="label-caps text-[var(--acc-on-bone)]">01. Coordinates</span>
                <span className="text-xs text-[var(--muted)]">• Destination details</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="checkout-name" className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "checkout-name-error" : undefined}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Babatunde Adeleke"
                    className="w-full h-12 px-4 text-base font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                  />
                  {errors.name && (
                    <p id="checkout-name-error" role="alert" className="mt-1 text-xs text-[var(--acc-on-bone)]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkout-phone" className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      maxLength={25}
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +234 802 345 6789"
                      className="w-full h-12 px-4 text-base font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                    />
                    {errors.phone && (
                      <p id="checkout-phone-error" role="alert" className="mt-1 text-xs text-[var(--acc-on-bone)]">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="checkout-email" className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                      Email Address *
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      required
                      maxLength={120}
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "checkout-email-error" : undefined}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. adeleke@example.ng"
                      className="w-full h-12 px-4 text-base font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                    />
                    {errors.email && (
                      <p id="checkout-email-error" role="alert" className="mt-1 text-xs text-[var(--acc-on-bone)]">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="checkout-address" className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                    Street Address *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    maxLength={200}
                    autoComplete="street-address"
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? "checkout-address-error" : undefined}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House number, street name, apartment or building"
                    className="w-full h-12 px-4 text-base font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                  />
                  {errors.address && (
                    <p id="checkout-address-error" role="alert" className="mt-1 text-xs text-[var(--acc-on-bone)]">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkout-city" className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                      City / Area *
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      maxLength={80}
                      aria-invalid={!!errors.city}
                      aria-describedby={errors.city ? "checkout-city-error" : undefined}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Lekki, Ikeja, Garki"
                      className="w-full h-12 px-4 text-base font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                    />
                    {errors.city && (
                      <p id="checkout-city-error" role="alert" className="mt-1 text-xs text-[var(--acc-on-bone)]">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="checkout-state" className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                      State *
                    </label>
                    <select
                      id="checkout-state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full h-12 px-4 text-base font-sans bg-[var(--bone)] border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)] cursor-pointer"
                    >
                      {NIGERIAN_STATES.map((state) => (
                        <option key={state.code} value={state.name}>
                          {state.name} {state.isLagos ? `(Lagos Dispatch ${formatNaira(2500)})` : `(Interstate ${formatNaira(4500)})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="checkout-notes" className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                    Special Dispatch Notes (Optional)
                  </label>
                  <input
                    id="checkout-notes"
                    type="text"
                    maxLength={250}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Gate code, landmark, or delivery instructions"
                    className="w-full h-12 px-4 text-base font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Selection */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--hairline)]">
                <span className="label-caps text-[var(--acc-on-bone)]">02. Settlement</span>
                <span className="text-xs text-[var(--muted)]">• Payment channel</span>
              </div>

              <div role="radiogroup" aria-label="Settlement payment channel" className="space-y-3">
                {/* Option 1: Paystack */}
                <label
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === 'paystack'
                      ? 'border-[var(--ink)] bg-[var(--surface-tint)]'
                      : 'border-[var(--hairline)] hover:border-[var(--ink)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-sm text-[var(--ink)]">
                      <CreditCard className="h-4 w-4 text-[var(--acc-on-bone)]" />
                      <span>Card / USSD / Bank (Paystack Nigeria)</span>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-1 font-sans">
                      Instant, encrypted payment with Mastercard, Visa, Verve or USSD transfer.
                    </p>
                  </div>
                </label>

                {/* Option 2: Direct Bank Transfer */}
                <label
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[var(--ink)] bg-[var(--surface-tint)]'
                      : 'border-[var(--hairline)] hover:border-[var(--ink)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-sm text-[var(--ink)]">
                      <Landmark className="h-4 w-4 text-[var(--acc-on-bone)]" />
                      <span>Direct Studio Bank Transfer</span>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-1 font-sans">
                      Transfer directly to the official ROF bank account. Account details appear after order submission.
                    </p>
                  </div>
                </label>

                {/* Option 3: Pay on Delivery (Lagos only) */}
                <label
                  className={`flex items-start gap-4 p-4 border transition-colors ${
                    !isLagos
                      ? 'opacity-40 cursor-not-allowed border-[var(--hairline)]'
                      : paymentMethod === 'delivery'
                      ? 'border-[var(--ink)] bg-[var(--surface-tint)] cursor-pointer'
                      : 'border-[var(--hairline)] hover:border-[var(--ink)] cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="delivery"
                    disabled={!isLagos}
                    checked={paymentMethod === 'delivery'}
                    onChange={() => isLagos && setPaymentMethod('delivery')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-sm text-[var(--ink)]">
                      <Truck className="h-4 w-4 text-[var(--acc-on-bone)]" />
                      <span>Pay on Delivery</span>
                      {!isLagos && <span className="text-[10px] text-[var(--acc-on-bone)]">(Lagos Only)</span>}
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-1 font-sans">
                      Available for selected Lagos mainland and island deliveries. Pay via POS or transfer upon courier arrival.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                withArrow
                disabled={isSubmitting || items.length === 0}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Confirming Order...' : `Place Order • ${formatNaira(total)}`}
              </Button>
              <p className="mt-3 text-center text-xs text-[var(--muted)] font-sans flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[var(--acc-on-bone)]" />
                <span>Orders are fulfilled in original packaging with serial authenticity</span>
              </p>
            </div>
          </form>
        </Pane>

        {/* ============================================================ */}
        {/* RIGHT: INK ORDER SUMMARY PANEL (5 cols, Sticky on desktop) */}
        {/* ============================================================ */}
        <Pane tone="ink" withGrain className="lg:col-span-5 p-6 sm:p-10 lg:p-12 border-t lg:border-t-0">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
              <h2 className="font-serif text-2xl text-[var(--bone)]">Order Summary</h2>
              <span className="text-xs text-[var(--muted)] font-sans">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Mobile collapsible summary toggle */}
            <div className="lg:hidden flex items-center justify-between py-2 border-b border-[var(--hairline)]">
              <button
                type="button"
                onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                className="text-xs uppercase tracking-wider text-[var(--bone)] flex items-center gap-2"
              >
                <span>{mobileSummaryOpen ? 'Hide piece list' : 'View piece list'}</span>
                {mobileSummaryOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              <span className="font-serif text-base text-[var(--bone)]">{formatNaira(total)}</span>
            </div>

            {/* Line items list */}
            <div className={`space-y-4 ${mobileSummaryOpen ? 'block' : 'hidden lg:block'}`}>
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between gap-3 text-xs font-sans">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 flex items-center justify-center border border-[var(--hairline)] text-[10px] text-[var(--muted)]">
                      {item.qty}×
                    </span>
                    <div>
                      <p className="font-serif text-sm text-[var(--bone)]">{item.name}</p>
                      <p className="text-[var(--muted)] text-[11px]">
                        {item.colour} • Size {item.size}
                      </p>
                    </div>
                  </div>
                  <span className="text-[var(--bone)] font-medium">
                    {formatNaira(item.unitPrice * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discount Code input */}
            <div className="pt-4 border-t border-[var(--hairline)]">
              <span className="label-caps text-[var(--muted)] block mb-2">Discount Code</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. LEGACY10"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 h-10 px-3 text-xs bg-transparent border border-[var(--hairline)] text-[var(--bone)] uppercase placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc)]"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleApplyDiscount}>
                  Apply
                </Button>
              </div>
              {discountMsg && (
                <p className={`mt-1.5 text-xs ${appliedDiscount > 0 ? 'text-[var(--acc)]' : 'text-[var(--muted)]'}`}>
                  {discountMsg}
                </p>
              )}
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-[var(--hairline)] space-y-2 text-xs font-sans">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="text-[var(--bone)]">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>
                  Delivery ({isLagos ? 'Lagos Express' : 'Interstate Express'})
                </span>
                <span className="text-[var(--bone)]">{formatNaira(deliveryFee)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[var(--acc)]">
                  <span>Discount</span>
                  <span>-{formatNaira(appliedDiscount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[var(--hairline)] flex justify-between items-baseline">
                <span className="text-sm uppercase tracking-wider font-semibold text-[var(--bone)]">
                  Total Due
                </span>
                <span className="text-2xl font-serif text-[var(--bone)] font-semibold">
                  {formatNaira(total)}
                </span>
              </div>
            </div>
          </div>
        </Pane>
      </div>
    </div>
  )
}

