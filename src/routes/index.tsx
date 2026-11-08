import React, { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Logo, DiamondMark } from '@/components/Logo'
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
  const [heroIndex, setHeroIndex] = useState(0)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, 'S' | 'M' | 'L' | 'XL' | 'XXL'>>({
    'prod-1': 'L',
    'prod-2': 'M',
    'prod-3': 'L',
    'prod-4': 'L',
    'prod-5': 'XL',
  })

  const currentHeroPiece = initialProducts[heroIndex]

  // Auto carousel rotation with gentle settle
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % initialProducts.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

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
  }

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (Ink) */}
      {/* ============================================================ */}
      <section
        data-tone="ink"
        className="relative min-h-[92svh] flex flex-col justify-between pt-24 pb-0 px-4 md:px-8 border-b border-[var(--hairline)] grain-overlay overflow-hidden"
      >
        {/* Animated Ghost Logo background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <Logo size="hero" ghost className="opacity-[0.038] scale-125" />
        </div>

        {/* Hero Top Mast */}
        <div className="relative z-10 mx-auto w-full max-w-[var(--max-content)] pt-4 md:pt-8">
          <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4 text-xs">
            <div className="flex items-center gap-2">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--acc)]">Collection 01</span>
            </div>
            <div className="label-caps text-[var(--muted)]">Five Pieces • Heavyweight Cut</div>
          </div>

          <div className="mt-8 md:mt-12 max-w-4xl">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display tracking-tight text-[var(--bone)] leading-[0.96]">
              {formatAccentText('Destined for *greatness.*')}
            </h1>
          </div>
        </div>

        {/* Hero Floating Tee Stage */}
        <div className="relative z-10 mx-auto w-full max-w-2xl py-6 md:py-12 flex items-center justify-center min-h-[320px] sm:min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroPiece.id}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -14 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center"
            >
              <TeeCutout
                design={getTeeMeta(currentHeroPiece).design}
                colour={getTeeMeta(currentHeroPiece).colour}
                withDiamondAccent
                className="max-h-[360px] sm:max-h-[460px] w-auto cursor-pointer"
                interactiveZoom
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Bone Bottom Band */}
        <div
          data-tone="bone"
          className="relative z-20 -mx-4 md:-mx-8 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)] px-4 md:px-8 py-4 sm:py-5"
        >
          <div className="mx-auto max-w-[var(--max-content)] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Piece index & meta */}
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <Numeral value={currentHeroPiece.position} size="md" />
              <div>
                <span className="label-caps text-[var(--acc-on-bone)]">Current Piece</span>
                <p className="font-serif text-lg md:text-xl font-medium leading-none text-[var(--ink)]">
                  {currentHeroPiece.name} ({currentHeroPiece.colour})
                </p>
                <p className="text-xs font-sans text-[var(--muted)] mt-0.5">
                  {formatNaira(currentHeroPiece.price)}
                </p>
              </div>
            </div>

            {/* Center: Progress indicators */}
            <div className="flex items-center gap-2">
              {initialProducts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setHeroIndex(idx)}
                  aria-label={`Jump to piece ${idx + 1}`}
                  className="touch-target-48 flex items-center justify-center p-1"
                >
                  <span
                    className={`block h-1 transition-all duration-300 ${
                      idx === heroIndex
                        ? 'w-10 bg-[var(--acc-on-bone)]'
                        : 'w-4 bg-[var(--ink)] opacity-25 hover:opacity-50'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Right: Primary Call to Action */}
            <div className="w-full sm:w-auto">
              <Button
                variant="primary"
                withArrow
                fullWidth
                onClick={() => navigate({ to: '/shop' })}
              >
                Shop the collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SOLID RED TICKER STRIP */}
      {/* ============================================================ */}
      <Ticker />

      {/* ============================================================ */}
      {/* 3. FIVE CHAPTERS (One per piece, 3fr / 2fr split) */}
      {/* ============================================================ */}
      <section className="w-full flex flex-col">
        {initialProducts.map((product, idx) => {
          const meta = getTeeMeta(product)
          const isEven = idx % 2 === 0
          // White tees sit on Ink, Black/Green tees sit on Bone
          const teeTone: 'ink' | 'bone' = product.ground
          const infoTone: 'ink' | 'bone' = teeTone === 'ink' ? 'bone' : 'ink'
          const selectedSize = selectedSizes[product.id] || 'L'

          return (
            <article
              key={product.id}
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
                <div className="relative w-full max-w-md flex justify-center">
                  <TeeCutout
                    design={meta.design}
                    colour={meta.colour}
                    withDiamondAccent
                    interactiveZoom
                    className="w-full h-auto max-h-[480px]"
                  />
                </div>
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
                    withArrow
                    fullWidth
                    onClick={() => handleQuickAdd(product)}
                  >
                    Add to bag
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
            </article>
          )
        })}
      </section>

      {/* ============================================================ */}
      {/* 4. MANIFESTO SPLIT */}
      {/* ============================================================ */}
      <section className="w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Ink Pane (3fr / 7 cols) */}
        <Pane
          tone="ink"
          withGrain
          className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--acc)]">The Mindset</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display text-[var(--bone)] leading-[1.04] max-w-xl">
              {formatAccentText('More than clothing. A *mindset.*')}
            </h2>
          </div>

          {/* Four pillars */}
          <div className="mt-12 pt-8 border-t border-[var(--hairline)] flex flex-wrap items-center gap-3 text-xs tracking-[0.24em] uppercase text-[var(--muted)]">
            <span>Ambition</span>
            <DiamondMark size={6} accent />
            <span>Confidence</span>
            <DiamondMark size={6} accent />
            <span>Originality</span>
            <DiamondMark size={6} accent />
            <span>Greatness</span>
          </div>
        </Pane>

        {/* Bone Pane (2fr / 5 cols) */}
        <Pane
          tone="bone"
          className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between"
        >
          <div>
            <span className="label-caps text-[var(--acc-on-bone)]">Conviction</span>
            <p className="mt-4 text-base sm:text-lg text-[var(--ink)] leading-relaxed font-sans font-normal">
              ROF stands for ambition, confidence and originality. It is made for people who stay focused on their goals, never settle for less, and wear it with pride because it represents something bigger than themselves.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
          </div>
        </Pane>
      </section>

      {/* ============================================================ */}
      {/* 5. SERVICES ROW (Ink, Bone, Ink) */}
      {/* ============================================================ */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 border-b border-[var(--hairline)]">
        {/* Service 1: Delivery (Ink) */}
        <Pane
          tone="ink"
          withGrain
          className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-[var(--hairline)] flex flex-col justify-between min-h-[220px]"
        >
          <div className="space-y-3">
            <Truck className="h-6 w-6 text-[var(--acc)] stroke-[1.6]" />
            <h3 className="font-serif text-2xl text-[var(--bone)]">Nationwide Delivery</h3>
            <p className="text-xs text-[var(--muted)] font-sans leading-relaxed">
              Express dispatch across Lagos and all 36 Nigerian states with real-time SMS tracking.
            </p>
          </div>
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
          <div className="space-y-3">
            <RefreshCw className="h-6 w-6 text-[var(--acc-on-bone)] stroke-[1.6]" />
            <h3 className="font-serif text-2xl text-[var(--ink)]">Exchanges</h3>
            <p className="text-xs text-[var(--muted)] font-sans leading-relaxed">
              Fast, hassle-free size exchanges within our return window. Tags intact, unworn pieces.
            </p>
          </div>
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
          <div className="space-y-3">
            <ShieldCheck className="h-6 w-6 text-[var(--acc)] stroke-[1.6]" />
            <h3 className="font-serif text-2xl text-[var(--bone)]">Oversized Fit</h3>
            <p className="text-xs text-[var(--muted)] font-sans leading-relaxed">
              Intentionally boxy streetwear silhouettes with dropped shoulders and heavy ribbing.
            </p>
          </div>
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
