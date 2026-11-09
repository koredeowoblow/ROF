import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { Pane } from '@/components/Pane'
import { Mast } from '@/components/Mast'

export const Route = createFileRoute('/legal')({
  component: LegalPage,
})

function LegalPage() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="flex flex-col w-full">
      {/* 1. Masthead */}
      <Mast
        badge="Governance"
        title="Terms, privacy and *dispatch.*"
        lead="Clear legal terms governing customer orders, intellectual property, data handling and delivery guarantees."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Legal & Policies' },
        ]}
      />

      {/* 2. Long-form Policies Body */}
      <Pane tone="bone" className="min-h-screen py-16 px-4 md:px-8">
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-3xl space-y-12 font-sans text-sm text-[var(--ink)] leading-relaxed"
        >
          {/* Section 1: Terms of Sale */}
          <section className="space-y-4 border-b border-[var(--hairline)] pb-8">
            <h2 className="font-serif text-3xl text-[var(--ink)]">1. Terms of Sale</h2>
            <p>
              By placing an order with ROF RAGE, you agree that you are purchasing heavyweight garments intended for personal use. All sales are confirmed once payment is recorded via our verified Paystack gateway or studio bank transfer.
            </p>
            <p>
              Prices are displayed in Nigerian Naira (NGN). We reserve the right to amend pricing prior to order confirmation in the event of severe raw material or currency fluctuations.
            </p>
          </section>

          {/* Section 2: Privacy Policy */}
          <section className="space-y-4 border-b border-[var(--hairline)] pb-8">
            <h2 className="font-serif text-3xl text-[var(--ink)]">2. Privacy & Data Integrity</h2>
            <p>
              We collect your delivery name, telephone contact, email and shipping coordinates strictly to process and deliver your order.
            </p>
            <p>
              We never sell or disclose your coordinates to third-party ad networks. Your details are shared only with registered Nigerian logistics partners for transit fulfillment. Payment card information is processed directly by Paystack through PCI-DSS Level 1 certified channels; ROF never stores your payment card credentials.
            </p>
          </section>

          {/* Section 3: Delivery & Dispatch Policy */}
          <section className="space-y-4 border-b border-[var(--hairline)] pb-8">
            <h2 className="font-serif text-3xl text-[var(--ink)]">3. Delivery & Fulfillment Policy</h2>
            <p>
              Standard Lagos dispatch takes 1 to 2 business days. Interstate dispatch to all other 35 states takes 3 to 5 business days.
            </p>
            <p>
              Couriers will attempt delivery twice before returning packages to our Lagos sorting facility. Customers are responsible for providing clear delivery coordinates and a functioning phone line.
            </p>
          </section>

          {/* Section 4: Exchanges & Defect Guarantees */}
          <section className="space-y-4">
            <h2 className="font-serif text-3xl text-[var(--ink)]">4. Exchanges & Defect Guarantees</h2>
            <p>
              We stand behind the craft and construction of every garment. If your piece arrives with a material or print defect, notify us within 48 hours for immediate replacement with all courier fees covered by ROF.
            </p>
            <p>
              Size exchanges must be initiated within 7 calendar days of package receipt. Items must be in pristine unworn condition with tags attached.
            </p>
          </section>
        </motion.div>
      </Pane>
    </div>
  )
}

