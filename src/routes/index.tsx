import React, { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { DiamondMark } from '@/components/Logo'
import { HeroStage } from '@/components/HeroStage'
import { Numeral } from '@/components/Numeral'
import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { Ticker } from '@/components/Ticker'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { formatAccentText } from '@/components/Mast'
import { useBagStore } from '@/features/bag/bagStore'
import { initialProducts } from '@/api/products'
import { formatNaira } from '@/lib/money'
import { Product } from '@/api/types'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const addItem = useBagStore((s) => s.addItem)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, 'S' | 'M' | 'L' | 'XL' | 'XXL'>>({
    'prod-1': 'L',
    'prod-2': 'M',
    'prod-3': 'L',
    'prod-4': 'L',
    'prod-5': 'XL',
  })

  const getTeeMeta = (p: Product): { design: TeeDesign; colour: TeeColour } => {
    const design: TeeDesign = p.name.includes('Cards') ? 'cards' : p.name.includes('Wave') ? 'wave' : 'scribble'
    const colour: TeeColour = p.colour.toLowerCase().includes('green')
      ? 'forest-green'
      : p.colour.toLowerCase().includes('white')
      ? 'white'
      : 'black'
    return { design, colour }
  }

  const handleQuickAdd = (product: Product) => {
    const size = selectedSizes[product.id] || 'L'
    addItem({
      productId: product.id,
      name: product.name,
      colour: product.colour,
      size,
      unitPrice: product.price,
      image: product.images[0],
    })
    setAddedId(product.id)
    setTimeout(() => {
      setAddedId((prev) => (prev === product.id ? null : prev))
    }, 1800)
  }

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ============================================================ */}
      {/* 1. CINEMATIC 3D HERO VAULT STAGE */}
      {/* ============================================================ */}
      <HeroStage />

      {/* ============================================================ */}
      {/* 2. SOLID RED TICKER STRIP */}
      {/* ============================================================ */}
      <Ticker />

      {/* ============================================================ */}
      {/* 3. FIVE CHAPTERS (One per piece, 3fr / 2fr split with scroll reveals) */}
      {/* ============================================================ */}
      <section id="collection-chapters" className="w-full flex flex-col">
        {initialProducts.map((product, idx) => {
          const meta = getTeeMeta(product)
          const isEven = idx % 2 === 0
          // White tees sit on Ink, Black/Green tees sit on Bone
          const teeTone: 'ink' | 'bone' = product.ground
          const infoTone: 'ink' | 'bone' = teeTone === 'ink' ? 'bone' : 'ink'
          const selectedSize = selectedSizes[product.id] || 'L'

          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-[580px]"
            >
              {/* Desktop alternating order:
                  Even: Tee pane left (7 cols, 3fr), Info pane right (5 cols, 2fr)
                  Odd: Info pane left (5 cols, 2fr), Tee pane right (7 cols, 3fr)
                  Mobile: Tee pane always first.
              */}
              {/* TEE PANE */}
              <Pane
                tone={teeTone}
                withGrain={teeTone === 'ink'}
                className={`relative flex items-center justify-center p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 ${
                  isEven
                    ? 'lg:col-span-7 lg:border-r border-[var(--hairline)] lg:order-1'
                    : 'lg:col-span-7 lg:border-l border-[var(--hairline)] lg:order-2'
                }`}
              >
                {/* Floating Tee with Hover Spring Lift */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -6 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="relative w-full max-w-md flex justify-center cursor-pointer"
                >
                  <TeeCutout
                    design={meta.design}
                    colour={meta.colour}
                    withDiamondAccent
                    interactiveZoom
                    priority={idx === 0}
                    className="w-full h-auto max-h-[480px]"
                  />
                </motion.div>
              </Pane>

              {/* INFO PANE */}
              <Pane
                tone={infoTone}
                withGrain={infoTone === 'ink'}
                className={`flex flex-col justify-between p-6 sm:p-10 lg:p-12 ${
                  isEven
                    ? 'lg:col-span-5 lg:order-2'
                    : 'lg:col-span-5 lg:order-1'
                }`}
              >
                <div>
                  {/* Top numeral and index label */}
                  <div className="flex items-start justify-between border-b border-[var(--hairline)] pb-4">
                    <div>
                      <span className="label-caps text-[var(--acc)]">
                        Piece {String(idx + 1).padStart(2, '0')} of 05
                      </span>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-[var(--fg)] mt-1">
                        {product.name}
                      </h2>
                    </div>
                    <Numeral value={product.position} size="md" />
                  </div>

                  {/* Blurb and print specs */}
                  <p className="mt-4 text-sm sm:text-base text-[var(--muted)] leading-relaxed font-sans">
                    {product.blurb}
                  </p>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-display font-medium text-[var(--fg)]">
                      {formatNaira(product.price)}
                    </span>
                    <span className="text-xs text-[var(--muted)] uppercase tracking-wider font-sans">
                      {product.colour}
                    </span>
                  </div>

                  {/* Size Chips */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="label-caps text-[var(--muted)]">Select Size</span>
                      <Link to="/help" hash="size-guide" className="text-xs text-[var(--acc)] hover:underline">
                        Size Guide
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <Chip
                          key={v.size}
                          label={v.size}
                          selected={selectedSize === v.size}
                          disabled={v.stock === 0}
                          onClick={() =>
                            setSelectedSizes((prev) => ({
                              ...prev,
                              [product.id]: v.size,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 pt-6 border-t border-[var(--hairline)] flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    variant="primary"
                    withArrow={addedId !== product.id}
                    fullWidth
                    onClick={() => handleQuickAdd(product)}
                    className={addedId === product.id ? 'bg-[#1b382b] text-[#fff6ec]' : ''}
                  >
                    {addedId === product.id ? 'Piece added to bag ✓' : 'Add to bag'}
                  </Button>

                  <Link
                    to="/product/$id"
                    params={{ id: product.slug }}
                    className="text-xs uppercase tracking-[0.2em] font-medium text-[var(--fg)] hover:text-[var(--acc)] transition-colors py-2"
                  >
                    View piece details
                  </Link>
                </div>
              </Pane>
            </motion.article>
          )
        })}
      </section>

      {/* ============================================================ */}
      {/* 4. MANIFESTO SPLIT WITH SCROLL REVEALS */}
      {/* ============================================================ */}
      <section className="w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Ink Pane (3fr / 7 cols) */}
        <Pane
          tone="ink"
          withGrain
          className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--acc)]">The Mindset</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display text-[var(--bone)] leading-[1.04] max-w-xl">
              {formatAccentText('More than clothing. A *mindset.*')}
            </h2>
          </motion.div>

          {/* Four pillars with staggered reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-[var(--hairline)] flex flex-wrap items-center gap-3 text-xs tracking-[0.24em] uppercase text-[var(--muted)]"
          >
            <span className="text-[var(--bone)]">Ambition</span>
            <DiamondMark size={6} accent />
            <span className="text-[var(--bone)]">Confidence</span>
            <DiamondMark size={6} accent />
            <span className="text-[var(--bone)]">Originality</span>
            <DiamondMark size={6} accent />
            <span className="text-[var(--bone)]">Greatness</span>
          </motion.div>
        </Pane>

        {/* Bone Pane (2fr / 5 cols) */}
        <Pane
          tone="bone"
          className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps text-[var(--acc-on-bone)]">Conviction</span>
            <p className="mt-4 text-base sm:text-lg text-[var(--ink)] leading-relaxed font-sans font-normal">
              ROF stands for ambition, confidence and originality. It is made for people who stay focused on their goals, never settle for less, and wear it with pride because it represents something bigger than themselves.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <Button
              variant="secondary"
              onClick={() => navigate({ to: '/story' })}
            >
              Read the story
            </Button>
            <Button
              variant="primary"
              withArrow
              onClick={() => navigate({ to: '/shop' })}
            >
              Shop all five
            </Button>
          </motion.div>
        </Pane>
      </section>

      {/* ============================================================ */}
      {/* 5. SERVICES ROW (Ink, Bone, Ink) WITH ENTRANCE ANIMATIONS */}
      {/* ============================================================ */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 border-b border-[var(--hairline)]">
        {/* Service 1: Delivery (Ink) */}
        <Pane
          tone="ink"
          withGrain
          className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-[var(--hairline)] flex flex-col justify-between min-h-[220px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <motion.div whileHover={{ scale: 1.15, rotate: -4 }} transition={{ type: 'spring' }} className="inline-block">
              <Truck className="h-6 w-6 text-[var(--acc)] stroke-[1.6]" />
            </motion.div>
            <h3 className="font-serif text-2xl text-[var(--bone)]">Nationwide Delivery</h3>
            <p className="text-xs text-[var(--muted)] font-sans leading-relaxed">
              Express dispatch across Lagos and all 36 Nigerian states with real-time SMS tracking.
            </p>
          </motion.div>
          <Link
            to="/help"
            hash="delivery"
            className="mt-6 text-xs uppercase tracking-wider font-medium text-[var(--bone)] hover:text-[var(--acc)] transition-colors flex items-center gap-1.5"
          >
            <span>Delivery schedule</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Pane>

        {/* Service 2: Returns (Bone) */}
        <Pane
          tone="bone"
          className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-[var(--hairline)] flex flex-col justify-between min-h-[220px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <motion.div whileHover={{ scale: 1.15, rotate: 6 }} transition={{ type: 'spring' }} className="inline-block">
              <RefreshCw className="h-6 w-6 text-[var(--acc-on-bone)] stroke-[1.6]" />
            </motion.div>
            <h3 className="font-serif text-2xl text-[var(--ink)]">Exchanges</h3>
            <p className="text-xs text-[var(--muted)] font-sans leading-relaxed">
              Fast, hassle-free size exchanges within our return window. Tags intact, unworn pieces.
            </p>
          </motion.div>
          <Link
            to="/help"
            hash="returns"
            className="mt-6 text-xs uppercase tracking-wider font-medium text-[var(--ink)] hover:text-[var(--acc-on-bone)] transition-colors flex items-center gap-1.5"
          >
            <span>Exchange window</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Pane>

        {/* Service 3: Sizes (Ink) */}
        <Pane
          tone="ink"
          withGrain
          className="p-8 sm:p-10 flex flex-col justify-between min-h-[220px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <motion.div whileHover={{ scale: 1.15, rotate: -4 }} transition={{ type: 'spring' }} className="inline-block">
              <ShieldCheck className="h-6 w-6 text-[var(--acc)] stroke-[1.6]" />
            </motion.div>
            <h3 className="font-serif text-2xl text-[var(--bone)]">Oversized Fit</h3>
            <p className="text-xs text-[var(--muted)] font-sans leading-relaxed">
              Intentionally boxy streetwear silhouettes with dropped shoulders and heavy ribbing.
            </p>
          </motion.div>
          <Link
            to="/help"
            hash="size-guide"
            className="mt-6 text-xs uppercase tracking-wider font-medium text-[var(--bone)] hover:text-[var(--acc)] transition-colors flex items-center gap-1.5"
          >
            <span>View size specs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Pane>
      </section>
    </div>
  )
}
