import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Check, ArrowRight, Sparkles, Layers } from 'lucide-react'
import { Product } from '@/api/types'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { Numeral } from '@/components/Numeral'
import { Button } from '@/components/Button'
import { DiamondMark } from '@/components/Logo'
import { formatNaira } from '@/lib/money'
import { useBagStore } from '@/features/bag/bagStore'
import { cn } from '@/lib/utils'

interface ShopAccordionProps {
  products: Product[]
}

const ACCORDION_HOOKS: Record<string, { tag: string; punchline: string }> = {
  'prod-1': {
    tag: 'HOOK 01 // THE GAMBLE & THE GLORY',
    punchline: 'Play the hand you were dealt like it was destined to win.',
  },
  'prod-2': {
    tag: 'HOOK 02 // THE PULSE OF MOMENTUM',
    punchline: 'Ride the frequency of your own ambition. Never dilute the sound.',
  },
  'prod-3': {
    tag: 'HOOK 03 // THE MIDNIGHT CURRENT',
    punchline: 'Silence the room before you ever speak a word.',
  },
  'prod-4': {
    tag: 'HOOK 04 // THE ARCHITECTURAL SKELETON',
    punchline: 'One unbroken standard. Drawn in darkness, built to outlast all noise.',
  },
  'prod-5': {
    tag: 'HOOK 05 // THE RAW CANVAS',
    punchline: 'A luminous canvas for an uncompromising life.',
  },
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const
type SizeType = typeof AVAILABLE_SIZES[number]

export const ShopAccordion: React.FC<ShopAccordionProps> = ({ products }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, SizeType>>({})
  const [addedId, setAddedId] = useState<string | null>(null)
  const addItem = useBagStore((s) => s.addItem)

  // Touch swipe support
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 45
    const isRightSwipe = distance < -45

    if (isLeftSwipe && activeIndex < products.length - 1) {
      setActiveIndex((prev) => prev + 1)
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1)
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0))
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1))
  }

  const getTeeMeta = (p: Product): { design: TeeDesign; colour: TeeColour } => {
    const design: TeeDesign = p.name.includes('Cards')
      ? 'cards'
      : p.name.includes('Wave')
      ? 'wave'
      : 'scribble'
    const colour: TeeColour = p.colour.toLowerCase().includes('green')
      ? 'forest-green'
      : p.colour.toLowerCase().includes('white')
      ? 'white'
      : 'black'
    return { design, colour }
  }

  const handleSizeSelect = (productId: string, size: SizeType) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }))
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

  if (!products.length) return null

  const activeProduct = products[activeIndex]
  const activeMeta = getTeeMeta(activeProduct)
  const activeSize = selectedSizes[activeProduct.id] || 'L'

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ------------------------------------------------------------ */}
      {/* 1. DESKTOP ACCORDION LOOKBOOK (md:flex) */}
      {/* Expands horizontal luxury panels with smooth spring transition */}
      {/* ------------------------------------------------------------ */}
      <div className="hidden lg:flex w-full h-[620px] gap-2 select-none">
        {products.map((product, idx) => {
          const isExpanded = activeIndex === idx
          const meta = getTeeMeta(product)
          const size = selectedSizes[product.id] || 'L'
          const tileTone: 'ink' | 'bone' = product.ground

          return (
            <motion.div
              key={product.id}
              onClick={() => setActiveIndex(idx)}
              layout
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className={cn(
                'relative h-full rounded-md border overflow-hidden cursor-pointer transition-colors flex',
                isExpanded
                  ? 'flex-[4.5] border-[var(--ink)] bg-[var(--bone)] shadow-2xl ring-1 ring-[var(--hairline)]'
                  : 'flex-[0.8] hover:flex-[1.0] border-[var(--hairline)] bg-[var(--bone)]/60 hover:bg-[var(--bone)]/90 hover:border-[var(--acc-on-bone)]'
              )}
            >
              {/* COLLAPSED ACCORDION SPINE */}
              {!isExpanded && (
                <div className="w-full h-full flex flex-col items-center justify-between py-8 px-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[var(--acc-on-bone)]">
                      {String(product.position).padStart(2, '0')}
                    </span>
                    <DiamondMark size={6} accent filled />
                    <span className="text-[7px] font-mono uppercase tracking-widest text-[var(--acc-on-bone)] font-bold">
                      HOOK 0{idx + 1}
                    </span>
                  </div>

                  {/* Rotated Vertical Title */}
                  <div className="flex-1 flex items-center justify-center -rotate-90 whitespace-nowrap">
                    <span className="font-serif text-lg font-bold tracking-wider text-[var(--ink)] uppercase">
                      {product.name}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-[var(--muted)] font-medium">
                    {formatNaira(product.price)}
                  </span>
                </div>
              )}

              {/* EXPANDED LUXURY PANEL */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="w-full h-full grid grid-cols-12 overflow-hidden"
                >
                  {/* Left: Monumental Tee Cutout Display (7 cols) */}
                  <div
                    data-tone={tileTone}
                    className={cn(
                      'col-span-7 h-full flex flex-col items-center justify-center p-8 relative overflow-hidden',
                      tileTone === 'ink' ? 'bg-[var(--ink)]' : 'bg-[var(--bone-muted)]'
                    )}
                  >
                    {/* Top Index & Fabric Spec */}
                    <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                      <Numeral value={product.position} size="md" />
                      <span className="px-2 py-0.5 border border-[var(--hairline)] bg-[var(--surface-tint)] text-[10px] font-mono uppercase tracking-wider rounded-xs text-[var(--fg)]">
                        260 GSM TERRIER
                      </span>
                    </div>

                    <div className="absolute top-6 right-6 z-10">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">
                        {product.colour}
                      </span>
                    </div>

                    {/* Garment Cutout Display */}
                    <div className="w-full max-w-[340px] h-[340px] flex items-center justify-center transition-transform duration-500 hover:scale-105">
                      <TeeCutout
                        design={meta.design}
                        colour={meta.colour}
                        withDiamondAccent={false}
                        className="w-full h-full drop-shadow-2xl"
                      />
                    </div>

                    {/* Bottom Ground Cue */}
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[10px] font-mono text-[var(--muted)] border-t border-[var(--hairline)]/50 pt-2">
                      <span>SILICON ENZYME WASH</span>
                      <span>OVERSIZED BOXY DRAPE</span>
                    </div>
                  </div>

                  {/* Right: Architectural Dossier & Quick Actions (5 cols) */}
                  <div className="col-span-5 h-full p-8 flex flex-col justify-between bg-[var(--bone)] text-[var(--ink)] border-l border-[var(--hairline)]">
                    <div>
                      {/* Section Hook Tag & Punchline */}
                      <div className="pb-3 mb-3 border-b border-[var(--hairline)] flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs border border-[var(--acc-on-bone)]/30 bg-[var(--acc-on-bone)]/10 text-[var(--acc-on-bone)] text-[9px] font-mono uppercase tracking-widest font-bold">
                          <DiamondMark size={4} accent filled />
                          <span>HOOK 0{idx + 1} // {product.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-[var(--muted)]">ARCHIVE 01</span>
                      </div>

                      {/* Hook Quote */}
                      {ACCORDION_HOOKS[product.id] && (
                        <p className="font-serif italic text-sm text-[var(--acc-on-bone)] mb-3 leading-snug">
                          "{ACCORDION_HOOKS[product.id].punchline}"
                        </p>
                      )}

                      {/* Subtitle */}
                      <div className="flex items-center gap-2 text-xs font-mono text-[var(--acc-on-bone)] uppercase tracking-widest font-bold">
                        <DiamondMark size={6} accent filled />
                        <span>PIECE {String(product.position).padStart(2, '0')} // ARCHIVE 01</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-3xl font-bold text-[var(--ink)] mt-1.5 leading-tight">
                        {product.name}
                      </h3>

                      <p className="mt-2.5 text-xs text-[var(--ink)]/80 leading-relaxed font-sans">
                        Heavyweight 260 GSM combed cotton. Built with dropped shoulders, reinforced ribbed neckline, and subtle luxury silhouette.
                      </p>

                      {/* Price */}
                      <div className="mt-5 pb-4 border-b border-[var(--hairline)]">
                        <span className="text-2xl font-bold font-sans text-[var(--ink)]">
                          {formatNaira(product.price)}
                        </span>
                      </div>

                      {/* Size Selector */}
                      <div className="mt-5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[var(--muted)] uppercase">SELECT SIZE</span>
                          <span className="font-semibold text-[var(--ink)]">{size} (IN STOCK)</span>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          {AVAILABLE_SIZES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSizeSelect(product.id, s)
                              }}
                              className={cn(
                                'h-10 text-xs font-mono font-semibold uppercase tracking-wider rounded-xs border transition-all cursor-pointer',
                                size === s
                                  ? 'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)] shadow-md'
                                  : 'border-[var(--hairline)] hover:border-[var(--ink)] text-[var(--ink)]/80 bg-transparent'
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Hub */}
                    <div className="space-y-3 pt-6 border-t border-[var(--hairline)]">
                      <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation()
                          handleQuickAdd(product)
                        }}
                        className={addedId === product.id ? 'bg-[var(--ink)] text-[var(--bone)]' : ''}
                      >
                        {addedId === product.id ? 'Added To Bag ✓' : 'Add To Bag'}
                      </Button>

                      <Link
                        to="/product/$id"
                        params={{ id: product.slug }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-mono uppercase tracking-wider text-[var(--ink)]/80 hover:text-[var(--acc-on-bone)] transition-colors"
                      >
                        <span>Inspect Full Dossier</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 2. MOBILE & TABLET SWIPEABLE TOUCH ACCORDION (< lg) */}
      {/* Swipe left/right, with tactile indicator controls */}
      {/* ------------------------------------------------------------ */}
      <div
        className="lg:hidden w-full flex flex-col gap-4 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipeable Viewport */}
        <div className="relative w-full overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--bone)] shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col w-full"
            >
              {/* Product Top Visual */}
              <div
                data-tone={activeProduct.ground}
                className={cn(
                  'relative aspect-square w-full flex items-center justify-center p-8 overflow-hidden',
                  activeProduct.ground === 'ink' ? 'bg-[var(--ink)]' : 'bg-[var(--bone-muted)]'
                )}
              >
                <div className="absolute top-4 left-4 z-10">
                  <Numeral value={activeProduct.position} size="md" />
                </div>
                <div className="absolute top-4 right-4 z-10 px-2 py-0.5 border border-[var(--hairline)] bg-[var(--surface-tint)] text-[9px] font-mono uppercase tracking-wider rounded-xs text-[var(--fg)]">
                  260 GSM
                </div>

                <div className="w-4/5 h-4/5 flex items-center justify-center">
                  <TeeCutout
                    design={activeMeta.design}
                    colour={activeMeta.colour}
                    withDiamondAccent={false}
                    className="w-full h-full drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Product Dossier Details */}
              <div className="p-5 flex flex-col gap-4 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)]">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1 text-[var(--acc-on-bone)] font-bold">
                      <DiamondMark size={4} accent filled />
                      <span>HOOK 0{activeIndex + 1}</span>
                    </span>
                    <span className="font-bold text-[var(--ink)]">{formatNaira(activeProduct.price)}</span>
                  </div>

                  {ACCORDION_HOOKS[activeProduct.id] && (
                    <p className="font-serif italic text-xs text-[var(--acc-on-bone)] mt-1.5 leading-snug">
                      "{ACCORDION_HOOKS[activeProduct.id].punchline}"
                    </p>
                  )}

                  <h3 className="font-serif text-2xl font-bold text-[var(--ink)] mt-1.5">
                    {activeProduct.name}
                  </h3>

                  <p className="text-xs text-[var(--ink)]/80 mt-1 line-clamp-2">
                    Heavyweight 260 GSM combed cotton. Oversized streetwear cut engineered for longevity.
                  </p>
                </div>

                {/* Size Pills */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                    <span>SIZE</span>
                    <span className="font-semibold text-[var(--ink)]">{activeSize}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {AVAILABLE_SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSizeSelect(activeProduct.id, s)}
                        className={cn(
                          'h-9 text-xs font-mono font-semibold uppercase rounded-xs border transition-colors cursor-pointer',
                          activeSize === s
                            ? 'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)]'
                            : 'border-[var(--hairline)] text-[var(--ink)] bg-transparent'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--hairline)]">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => handleQuickAdd(activeProduct)}
                    className={addedId === activeProduct.id ? 'bg-[var(--ink)] text-[var(--bone)]' : ''}
                  >
                    {addedId === activeProduct.id ? 'Added To Bag ✓' : 'Add To Bag'}
                  </Button>

                  <Link
                    to="/product/$id"
                    params={{ id: activeProduct.slug }}
                    className="w-full text-center py-2 text-xs font-mono uppercase tracking-wider text-[var(--ink)]/80 hover:text-[var(--acc-on-bone)]"
                  >
                    View Piece Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Swipe Navigation Controls */}
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1 px-3 py-2 border border-[var(--hairline)] bg-[var(--bone)] text-[var(--ink)] text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer hover:border-[var(--ink)] transition-colors"
          >
            <ChevronLeft size={14} />
            <span>PREV</span>
          </button>

          {/* Swipe Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {products.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 ease-[var(--ease-out-quart)] cursor-pointer',
                  activeIndex === idx
                    ? 'w-6 bg-[var(--acc-on-bone)]'
                    : 'w-2 bg-[var(--hairline)] hover:bg-[var(--muted)]'
                )}
                aria-label={`Jump to piece ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-2 border border-[var(--hairline)] bg-[var(--bone)] text-[var(--ink)] text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer hover:border-[var(--ink)] transition-colors"
          >
            <span>NEXT</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <p className="text-center font-mono text-[10px] text-[var(--muted)] tracking-widest uppercase">
          SWIPE LEFT / RIGHT TO EXPLORE THE CAPSULE
        </p>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 3. TACTICAL EXPANSION BAR & QUICK NAVIGATION STRIP */}
      {/* Shows current position and one-click piece jumper */}
      {/* ------------------------------------------------------------ */}
      <div className="hidden lg:flex items-center justify-between py-3 px-4 border border-[var(--hairline)] bg-[var(--bone)]/80 rounded-md text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-[var(--acc-on-bone)] font-bold">
            [{activeIndex + 1} OF {products.length}]
          </span>
          <span className="text-[var(--ink)] font-semibold uppercase">
            {products[activeIndex].name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="px-3 py-1 border border-[var(--hairline)] hover:border-[var(--ink)] text-[var(--ink)] transition-colors rounded-xs cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft size={13} />
            <span>PREVIOUS</span>
          </button>

          {products.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded-xs transition-all cursor-pointer border',
                activeIndex === idx
                  ? 'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)] font-bold'
                  : 'border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--ink)]'
              )}
            >
              {idx + 1}
            </button>
          ))}

          <button
            type="button"
            onClick={handleNext}
            className="px-3 py-1 border border-[var(--hairline)] hover:border-[var(--ink)] text-[var(--ink)] transition-colors rounded-xs cursor-pointer flex items-center gap-1"
          >
            <span>NEXT</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
