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
import { ScrollSection } from '@/components/ScrollSection'
import { useBagStore } from '@/features/bag/bagStore'
import { initialProducts } from '@/api/products'
import { formatNaira } from '@/lib/money'
import { Product } from '@/api/types'
import { cn } from '@/lib/utils'

interface SectionHook {
  tag: string
  punchline: string
  subhook: string
}

const CITY_DELIVERY_DATA = {
  lagos: {
    city: 'Lagos State',
    estimate: 'Same-day or next-day express',
    price: formatNaira(2500),
    courier: 'Dedicated Studio Courier',
  },
  abuja: {
    city: 'Abuja FCT',
    estimate: '24 to 48 hours doorstep dispatch',
    price: formatNaira(4000),
    courier: 'GIGL Priority Air',
  },
  ph: {
    city: 'Port Harcourt',
    estimate: '48 hours doorstep dispatch',
    price: formatNaira(4500),
    courier: 'Sendbox Express Flight',
  },
  nationwide: {
    city: 'All Other 33 States',
    estimate: '2 to 4 working days delivery',
    price: formatNaira(4500),
    courier: 'DHL / GIGL Nationwide',
  },
} as const

const PILLAR_MANTRAS: Record<string, string> = {
  Ambition: 'We do not wait for permission. We outwork doubt and claim what was destined.',
  Confidence: 'Presence before speech. Stand tall in the quiet certainty of your craft.',
  Originality: 'Never replicate. The signature of Roof of Fame is authentic distinction.',
  Greatness: 'Every stitch, every drop, built to outlast trends and establish legacy.',
}

const CHAPTER_HOOKS: Record<string, SectionHook> = {
  'prod-1': {
    tag: 'HOOK 01 // THE GAMBLE & THE GLORY',
    punchline: 'Play the hand you were dealt like it was destined to win.',
    subhook: 'Five cracked playing cards. No permission asked. Destined for riches.',
  },
  'prod-2': {
    tag: 'HOOK 02 // THE PULSE OF MOMENTUM',
    punchline: 'Ride the frequency of your own ambition. Never dilute the sound.',
    subhook: 'Crisp organic drape cut for those who set the tempo in every room.',
  },
  'prod-3': {
    tag: 'HOOK 03 // THE MIDNIGHT CURRENT',
    punchline: 'Silence the room before you ever speak a word.',
    subhook: 'Pure obsidian presence with kinetic electric mint and rage accents.',
  },
  'prod-4': {
    tag: 'HOOK 04 // THE ARCHITECTURAL SKELETON',
    punchline: 'One unbroken standard. Drawn in darkness, built to outlast all noise.',
    subhook: 'Continuous line geometry mirroring the discipline of building a legacy.',
  },
  'prod-5': {
    tag: 'HOOK 05 // THE RAW CANVAS',
    punchline: 'A luminous canvas for an uncompromising life.',
    subhook: 'Burnt terracotta wireframe over chalk-white heavyweight combed terry.',
  },
}

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const addItem = useBagStore((s) => s.addItem)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<'lagos' | 'abuja' | 'ph' | 'nationwide'>('lagos')
  const [activePillar, setActivePillar] = useState<string>('Ambition')
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
      useBagStore.getState().setIsOpen(true)
    }, 350)
    setTimeout(() => {
      setAddedId((prev) => (prev === product.id ? null : prev))
    }, 1800)
  }

  return (
    <div className="flex flex-col w-full overflow-x-clip">
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
          const hook = CHAPTER_HOOKS[product.id] || {
            tag: `HOOK 0${idx + 1} // ARCHIVE`,
            punchline: product.blurb,
            subhook: '',
          }
          const isEven = idx % 2 === 0
          // White tees sit on Ink, Black/Green tees sit on Bone
          const teeTone: 'ink' | 'bone' = product.ground
          const infoTone: 'ink' | 'bone' = teeTone === 'ink' ? 'bone' : 'ink'
          const selectedSize = selectedSizes[product.id] || 'L'

          return (
            <ScrollSection
              key={product.id}
              id={`hook-0${idx + 1}`}
              as="article"
              className={cn(
                "w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-[580px]",
                idx > 0 && "content-visibility-auto"
              )}
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
                className={`relative flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-20 border-b lg:border-b-0 overflow-hidden ${
                  isEven
                    ? 'lg:col-span-7 lg:border-r border-[var(--hairline)] lg:order-1'
                    : 'lg:col-span-7 lg:border-l border-[var(--hairline)] lg:order-2'
                }`}
              >
                {/* Large Ghosted Architectural Watermark Numeral */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
                  <span className="font-display font-bold text-[34vw] lg:text-[24vw] leading-none text-current">
                    0{idx + 1}
                  </span>
                </div>

                {/* Section Hook Telemetry Pin */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-[var(--bg)]/90 backdrop-blur-md border border-[var(--hairline)] rounded-xs text-[10px] font-mono tracking-widest uppercase text-[var(--fg)] shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)] animate-pulse" />
                  <span>{hook.tag}</span>
                </div>

                {/* Floating Tee with Continuous Organic Drift & Spring Hover Lift */}
                <motion.div
                  animate={{
                    y: [-6, 6, -6],
                  }}
                  transition={{
                    duration: 5.5 + idx * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.05, y: -12, rotateZ: isEven ? -1.5 : 1.5 }}
                  className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center justify-center cursor-pointer group z-10"
                >
                  <TeeCutout
                    design={meta.design}
                    colour={meta.colour}
                    withDiamondAccent
                    interactiveZoom
                    priority={idx === 0}
                    className="w-full h-auto max-h-[480px] lg:max-h-[560px] xl:max-h-[640px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                  />
                  {/* Soft Breathing Contact Shadow */}
                  <motion.div
                    animate={{
                      scale: [0.9, 1.05, 0.9],
                      opacity: [0.35, 0.55, 0.35],
                    }}
                    transition={{
                      duration: 5.5 + idx * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-3/4 h-6 bg-black/60 blur-xl rounded-full mt-2 pointer-events-none"
                  />
                </motion.div>
              </Pane>

              {/* INFO PANE */}
              <Pane
                tone={infoTone}
                withGrain={infoTone === 'ink'}
                className={`flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-18 ${
                  isEven
                    ? 'lg:col-span-5 lg:order-2'
                    : 'lg:col-span-5 lg:order-1'
                }`}
              >
                <div>
                  {/* Editorial Section Hook Banner */}
                  <div className="mb-4 pb-3.5 border-b border-[var(--hairline)]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs border border-[var(--acc)]/40 bg-[var(--acc)]/10 text-[var(--acc)] text-[10px] font-mono font-bold tracking-widest uppercase">
                        <DiamondMark size={4} accent filled />
                        <span>{hook.tag}</span>
                      </span>
                      <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">
                        ARCHIVE 01
                      </span>
                    </div>
                    <p className="font-serif italic text-base sm:text-lg lg:text-xl text-[var(--fg)] mt-2 leading-snug">
                      "{hook.punchline}"
                    </p>
                  </div>

                  {/* Top numeral and index label */}
                  <div className="flex items-start justify-between border-b border-[var(--hairline)] pb-4">
                    <div>
                      <span className="label-caps text-[var(--acc)]">
                        Piece {String(idx + 1).padStart(2, '0')} of 05
                      </span>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display text-[var(--fg)] mt-1">
                        {product.name}
                      </h2>
                    </div>
                    <Numeral value={product.position} size="md" />
                  </div>

                  {/* Fabric Specs Tag Strip */}
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">
                    <span className="px-2 py-0.5 border border-[var(--hairline)] rounded-xs bg-[var(--surface-tint)]">
                      260 GSM SILK-TERRY
                    </span>
                    <span className="px-2 py-0.5 border border-[var(--hairline)] rounded-xs bg-[var(--surface-tint)]">
                      OVERSIZED BOXY
                    </span>
                  </div>

                  {/* Blurb and print specs */}
                  <p className="mt-4 text-sm sm:text-base text-[var(--muted)] leading-relaxed font-sans">
                    {product.blurb}
                  </p>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-[var(--fg)]">
                      {formatNaira(product.price)}
                    </span>
                    <span className="text-xs text-[var(--muted)] uppercase tracking-wider font-sans">
                      {product.colour}
                    </span>
                  </div>

                  {/* Size Chips & Vault Telemetry */}
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
                    {/* Live stock telemetry badge */}
                    {(() => {
                      const vStock = product.variants.find((v) => v.size === selectedSize)?.stock ?? 0
                      return (
                        <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
                          <span className={cn('w-1.5 h-1.5 rounded-full', vStock <= 10 ? 'bg-[var(--acc)] animate-pulse' : 'bg-emerald-500')} />
                          <span>
                            Vault stock: <strong className="text-[var(--fg)] font-medium">{vStock} units</strong> available in {selectedSize}
                          </span>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 pt-6 border-t border-[var(--hairline)] flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    variant="primary"
                    withArrow={addedId !== product.id}
                    fullWidth
                    onClick={() => handleQuickAdd(product)}
                    className={addedId === product.id ? 'bg-[var(--bone)] text-[var(--ink)]' : ''}
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
            </ScrollSection>
          )
        })}
      </section>

      {/* ============================================================ */}
      {/* 4. MANIFESTO SPLIT WITH DIRECTIONAL SCROLL REVEALS */}
      {/* ============================================================ */}
      <ScrollSection id="hook-06-manifesto" className="w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Ink Pane (3fr / 7 cols) */}
        <Pane
          tone="ink"
          withGrain
          className="lg:col-span-7 p-8 sm:p-12 lg:p-16 xl:p-24 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Hook 06 */}
            <div className="mb-4 pb-3 border-b border-[var(--hairline)]/60">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs border border-[var(--acc)]/50 bg-[var(--acc)]/10 text-[var(--acc)] text-[10px] font-mono font-bold tracking-widest uppercase">
                <DiamondMark size={4} accent filled />
                <span>HOOK 06 // THE CREED</span>
              </span>
              <p className="font-serif italic text-base sm:text-lg lg:text-xl text-[var(--acc)] mt-2">
                "We don't forge clothing for onlookers. We forge armor for builders."
              </p>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--bone)]/70">The Mindset</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display text-[var(--bone)] leading-[1.02] max-w-2xl">
              {formatAccentText('More than clothing. A *mindset.*')}
            </h2>
          </motion.div>

          {/* Interactive Four Pillars Tabs */}
          <div className="mt-12 pt-8 border-t border-[var(--hairline)]">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)] block mb-3">
              Explore the four pillars
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {['Ambition', 'Confidence', 'Originality', 'Greatness'].map((pillar) => {
                const isActive = activePillar === pillar
                return (
                  <button
                    key={pillar}
                    type="button"
                    onClick={() => setActivePillar(pillar)}
                    className={cn(
                      'px-4 py-2 text-xs lg:text-sm font-mono uppercase tracking-[0.18em] transition-all rounded-xs cursor-pointer flex items-center gap-2',
                      isActive
                        ? 'bg-[var(--acc)] text-[var(--label-on-acc)] font-bold shadow-md'
                        : 'border border-[var(--hairline)] text-[var(--bone)]/75 hover:text-[var(--bone)] hover:border-[var(--bone)]/60 bg-[var(--surface-tint)]'
                    )}
                  >
                    <span>{pillar}</span>
                    {isActive && <DiamondMark size={4} accent filled className="text-[var(--label-on-acc)]" />}
                  </button>
                )
              })}
            </div>

            {/* Active Pillar Mantra Callout */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 p-4 lg:p-5 rounded-xs border border-[var(--acc)]/30 bg-[var(--acc)]/5 text-sm sm:text-base lg:text-lg text-[var(--bone)]/90 font-serif italic max-w-xl shadow-inner"
              >
                "{PILLAR_MANTRAS[activePillar]}"
              </motion.div>
            </AnimatePresence>
          </div>
        </Pane>

        {/* Bone Pane (2fr / 5 cols) */}
        <Pane
          tone="bone"
          className="lg:col-span-5 p-8 sm:p-12 lg:p-16 xl:p-24 flex flex-col justify-between"
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
      </ScrollSection>

      {/* ============================================================ */}
      {/* 5. SERVICES ROW (Ink, Bone, Ink) WITH DIRECTIONAL ANIMATIONS */}
      {/* ============================================================ */}
      <ScrollSection id="hook-07-services" className="w-full grid grid-cols-1 md:grid-cols-3 border-b border-[var(--hairline)]">
        {/* Accessible Landmark Heading */}
        <h2 className="sr-only">ROF Studio Guarantees & Express Dispatch Across Nigeria</h2>

        {/* Top Hook Strip for Services */}
        <div className="col-span-full py-3.5 px-6 sm:px-10 border-b border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[var(--surface-tint)]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs border border-[var(--acc)]/40 bg-[var(--acc)]/10 text-[var(--acc)] text-[10px] font-mono font-bold tracking-widest uppercase self-start sm:self-auto">
            <DiamondMark size={4} accent filled />
            <span>HOOK 07 // THE LAGOS COVENANT</span>
          </span>
          <span className="font-serif italic text-xs sm:text-sm text-[var(--bone)]/80">
            "Zero friction: express dispatch across Lagos and all 36 Nigerian states."
          </span>
        </div>

        {/* Service 1: Delivery with Interactive Nigerian Dispatch Calculator (Ink) */}
        <Pane
          tone="ink"
          withGrain
          className="p-8 sm:p-10 lg:p-12 xl:p-14 border-b md:border-b-0 md:border-r border-[var(--hairline)] flex flex-col justify-between min-h-[320px] lg:min-h-[360px] group transition-colors hover:border-[var(--acc)]/40"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ scale: 1.2, rotate: -6 }} transition={{ type: 'spring' }} className="inline-block">
                <Truck className="h-7 w-7 text-[var(--acc)] stroke-[1.6]" />
              </motion.div>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--acc)] font-bold">
                {CITY_DELIVERY_DATA[selectedCity].price}
              </span>
            </div>
            <h3 className="font-serif text-2xl lg:text-3xl text-[var(--bone)]">Doorstep Delivery</h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-sans leading-relaxed">
              Express dispatch across Nigeria with live SMS tracking. Select region for estimate:
            </p>

            {/* City Selection Pills */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {(
                [
                  { id: 'lagos', label: 'Lagos' },
                  { id: 'abuja', label: 'Abuja' },
                  { id: 'ph', label: 'P. Harcourt' },
                  { id: 'nationwide', label: 'All 33 States' },
                ] as const
              ).map((c) => {
                const isSelected = selectedCity === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCity(c.id)}
                    className={cn(
                      'px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-left rounded-xs transition-colors cursor-pointer border',
                      isSelected
                        ? 'border-[var(--acc)] bg-[var(--acc)] text-[var(--label-on-acc)] font-bold shadow-sm'
                        : 'border-[var(--hairline)] text-[var(--bone)]/75 hover:text-[var(--bone)] hover:border-[var(--bone)]/50 bg-[var(--surface-tint)]'
                    )}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>

            {/* Live City Calculation Details */}
            <div className="p-3 rounded-xs border border-[var(--hairline)] bg-[var(--surface-tint)] text-[11px] sm:text-xs font-mono space-y-1">
              <div className="text-[var(--bone)] font-medium">
                {CITY_DELIVERY_DATA[selectedCity].city}: {CITY_DELIVERY_DATA[selectedCity].estimate}
              </div>
              <div className="text-[var(--muted)] text-[10px]">
                Courier: {CITY_DELIVERY_DATA[selectedCity].courier}
              </div>
            </div>
          </motion.div>
          <Link
            to="/help"
            hash="delivery"
            className="mt-6 text-xs uppercase tracking-wider font-medium text-[var(--bone)] hover:text-[var(--acc)] transition-colors flex items-center gap-1.5"
          >
            <span>Full shipping policy</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Pane>

        {/* Service 2: Returns (Bone) */}
        <Pane
          tone="bone"
          className="p-8 sm:p-10 lg:p-12 xl:p-14 border-b md:border-b-0 md:border-r border-[var(--hairline)] flex flex-col justify-between min-h-[320px] lg:min-h-[360px] group transition-colors"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3.5"
          >
            <motion.div whileHover={{ scale: 1.2, rotate: 8 }} transition={{ type: 'spring' }} className="inline-block">
              <RefreshCw className="h-7 w-7 text-[var(--acc-on-bone)] stroke-[1.6]" />
            </motion.div>
            <h3 className="font-serif text-2xl lg:text-3xl text-[var(--ink)]">Exchanges</h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-sans leading-relaxed">
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
          className="p-8 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between min-h-[320px] lg:min-h-[360px] group transition-colors"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3.5"
          >
            <motion.div whileHover={{ scale: 1.2, rotate: -6 }} transition={{ type: 'spring' }} className="inline-block">
              <ShieldCheck className="h-7 w-7 text-[var(--acc)] stroke-[1.6]" />
            </motion.div>
            <h3 className="font-serif text-2xl lg:text-3xl text-[var(--bone)]">Oversized Fit</h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-sans leading-relaxed">
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
      </ScrollSection>
    </div>
  )
}
