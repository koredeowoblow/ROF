import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, Truck, RefreshCw, Ruler, HelpCircle } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Mast } from '@/components/Mast'
import { DiamondMark } from '@/components/Logo'
import { initialContentConfig } from '@/content/config'
import { formatNaira } from '@/lib/money'

export const Route = createFileRoute('/help')({
  component: HelpPage,
})

function HelpPage() {
  const content = initialContentConfig
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1')

  const navItems = [
    { id: 'delivery', label: 'Delivery & Tariffs', icon: Truck },
    { id: 'returns', label: 'Returns & Exchanges', icon: RefreshCw },
    { id: 'size-guide', label: 'Size Guide & Fit', icon: Ruler },
    { id: 'faq', label: 'Frequently Asked', icon: HelpCircle },
  ]

  return (
    <div className="flex flex-col w-full">
      {/* 1. Masthead */}
      <Mast
        badge="Customer Concierge"
        title="How can we *help?*"
        lead="Clear answers on our nationwide dispatch schedule, oversized sizing specs, return policy and garment care."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Help' },
        ]}
      />

      {/* 2. Body: Sticky Ink Nav on Bone Content */}
      <Pane tone="bone" className="min-h-screen py-12 px-4 md:px-8">
        <div className="mx-auto max-w-[var(--max-content)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Side Nav (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 p-6 bg-[var(--ink)] text-[var(--bone)] border border-[var(--hairline)] grain-overlay">
            <span className="label-caps text-[var(--acc)] block mb-4">Quick Navigation</span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-3 p-3 text-xs uppercase tracking-wider font-sans text-[var(--bone)]/80 hover:text-[var(--bone)] hover:bg-[var(--surface-tint)] transition-colors"
                  >
                    <Icon className="h-4 w-4 text-[var(--acc)]" />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-[var(--hairline)] text-xs text-[var(--muted)] space-y-2">
              <p className="font-semibold text-[var(--bone)]">Need personalized concierge?</p>
              <p>Email: {content.contact.email.value}</p>
              <p>Phone: {content.contact.phone.value}</p>
            </div>
          </div>

          {/* Main Help Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Section 1: Delivery */}
            <section id="delivery" className="p-8 bg-[var(--bone)] border border-[var(--hairline)] scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--acc-on-bone)]" />
                <h2 className="font-serif text-3xl text-[var(--ink)]">Delivery & Tariffs</h2>
              </div>
              <p className="text-sm text-[var(--ink)] font-sans leading-relaxed">
                All pieces are fulfilled directly from our dispatch hub in Lagos, Nigeria. Orders placed before 12:00 PM are processed same day.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 border border-[var(--hairline)] bg-[#ded6c3]/60 space-y-1">
                  <span className="label-caps text-[var(--acc-on-bone)]">Lagos Delivery</span>
                  <p className="font-serif text-2xl text-[var(--ink)]">
                    {formatNaira(content.delivery.lagosFee.value)}
                  </p>
                  <p className="text-xs text-[var(--muted)]">1 to 2 business days via express courier</p>
                </div>

                <div className="p-4 border border-[var(--hairline)] bg-[#ded6c3]/60 space-y-1">
                  <span className="label-caps text-[var(--acc-on-bone)]">Interstate Delivery</span>
                  <p className="font-serif text-2xl text-[var(--ink)]">
                    {formatNaira(content.delivery.interstateFee.value)}
                  </p>
                  <p className="text-xs text-[var(--muted)]">3 to 5 business days across all 35 other states & FCT</p>
                </div>
              </div>
            </section>

            {/* Section 2: Returns & Exchanges */}
            <section id="returns" className="p-8 bg-[var(--bone)] border border-[var(--hairline)] scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-[var(--acc-on-bone)]" />
                <h2 className="font-serif text-3xl text-[var(--ink)]">Returns & Size Exchanges</h2>
              </div>
              <p className="text-sm text-[var(--ink)] font-sans leading-relaxed">
                {content.delivery.exchangePolicy.value}
              </p>
              <div className="p-4 bg-[#ded6c3]/40 border-l-2 border-[var(--acc-on-bone)] text-xs text-[var(--ink)] space-y-1">
                <p className="font-semibold">Exchange Conditions:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[var(--muted)]">
                  <li>Garment unworn and unwashed with original hangtags attached</li>
                  <li>Returned in original ROF protective poly sleeve</li>
                  <li>Exchange requested within 7 days of package delivery</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Size Guide Table */}
            <section id="size-guide" className="p-8 bg-[var(--bone)] border border-[var(--hairline)] scroll-mt-28 space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-[var(--acc-on-bone)]" />
                <h2 className="font-serif text-3xl text-[var(--ink)]">Size Guide & Fit Specifications</h2>
              </div>
              <p className="text-sm text-[var(--ink)] font-sans leading-relaxed">
                {content.help.sizeGuide.note}
              </p>

              {/* Responsive Size Table */}
              <div className="overflow-x-auto border border-[var(--hairline)] mt-4">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#ded6c3] border-b border-[var(--hairline)] text-[var(--ink)] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Chest Width (cm)</th>
                      <th className="p-3">Garment Length (cm)</th>
                      <th className="p-3">Shoulder Width (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--hairline)] text-[var(--ink)]">
                    {content.help.sizeGuide.measurements.map((row) => (
                      <tr key={row.size} className="hover:bg-[#ded6c3]/30 transition-colors">
                        <td className="p-3 font-bold">{row.size}</td>
                        <td className="p-3">{row.chestCm} cm</td>
                        <td className="p-3">{row.lengthCm} cm</td>
                        <td className="p-3">{row.shoulderCm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: FAQ Accordion */}
            <section id="faq" className="p-8 bg-[var(--bone)] border border-[var(--hairline)] scroll-mt-28 space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--acc-on-bone)]" />
                <h2 className="font-serif text-3xl text-[var(--ink)]">Frequently Asked Questions</h2>
              </div>

              <div className="divide-y divide-[var(--hairline)] border border-[var(--hairline)]">
                {content.help.faqs.map((faq) => {
                  const isOpen = openFaq === faq.id
                  return (
                    <div key={faq.id} className="bg-[var(--bone)]">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold font-serif text-[var(--ink)] hover:text-[var(--acc-on-bone)] transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs font-sans text-[var(--muted)] leading-relaxed border-t border-[var(--hairline)]/40 pt-2">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </Pane>
    </div>
  )
}
