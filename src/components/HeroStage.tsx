import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, ShoppingBag, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { initialProducts } from '@/api/products'
import { formatNaira } from '@/lib/money'
import { Product } from '@/api/types'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { useBagStore } from '@/features/bag/bagStore'
import { cn } from '@/lib/utils'

interface HeroStageProps {
  className?: string
}

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const addItem = useBagStore((s) => s.addItem)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAdded, setIsAdded] = useState(false)
  const [inspectMode, setInspectMode] = useState<'full' | 'closeup'>('full')
  const [hoveredPillar, setHoveredPillar] = useState<'R' | 'O' | 'F' | null>(null)
  const [isTouch, setIsTouch] = useState(true)

  const activeProduct = initialProducts[currentIndex]
  const stageRef = useRef<HTMLDivElement>(null)

  // Spring physics mouse coordinates normalized to [-0.5, 0.5]
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  const springConfig = { damping: 26, stiffness: 170, mass: 0.55 }
  const smoothX = useSpring(rawMouseX, springConfig)
  const smoothY = useSpring(rawMouseY, springConfig)

  // 3D Perspective Transformations for the suspended garment
  const garmentRotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10])
  const garmentRotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const garmentTranslateX = useTransform(smoothX, [-0.5, 0.5], [-16, 16])
  const garmentTranslateY = useTransform(smoothY, [-0.5, 0.5], [-12, 12])

  // Parallax for Monumental Background Letters
  const lettersShiftX = useTransform(smoothX, [-0.5, 0.5], [20, -20])
  const lettersShiftY = useTransform(smoothY, [-0.5, 0.5], [12, -12])

  // Shadow displacement reacting naturally to tilt
  const shadowSkewX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.92, 1.08])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch(!window.matchMedia('(pointer: fine)').matches)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rawMouseX.set(x)
    rawMouseY.set(y)
  }

  const handleMouseLeave = () => {
    rawMouseX.set(0)
    rawMouseY.set(0)
    setHoveredPillar(null)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? initialProducts.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === initialProducts.length - 1 ? 0 : prev + 1))
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

  const activeMeta = getTeeMeta(activeProduct)

  const handleQuickAdd = () => {
    addItem({
      productId: activeProduct.id,
      name: activeProduct.name,
      colour: activeProduct.colour,
      size: 'L',
      unitPrice: activeProduct.price,
      image: activeProduct.images[0],
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <section
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-tone="ink"
      className={cn(
        'relative min-h-[96svh] w-full flex flex-col justify-between pt-20 pb-0 px-4 md:px-8 border-b border-[var(--hairline)] grain-overlay overflow-hidden select-none cursor-default bg-[#0c0b0a]',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. ATMOSPHERIC STUDIO LIGHTING & OVERHEAD SPOTLIGHT CONE */}
      {/* ============================================================ */}
      {/* Dramatic overhead studio beam casting onto garment shoulders */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[580px] pointer-events-none z-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(236,230,216,0.18) 0%, rgba(229,55,45,0.06) 40%, transparent 80%)',
        }}
      />

      {/* Subtle radial ambient warmth behind garment */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[360px] sm:w-[500px] h-[360px] sm:h-[500px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.09)_0%,transparent_68%)]" />
      </div>

      {/* ============================================================ */}
      {/* 2. MONUMENTAL ARCHITECTURAL R - O - F TYPOGRAPHY IN DEPTH */}
      {/* ============================================================ */}
      <motion.div
        style={{
          x: isTouch ? 0 : lettersShiftX,
          y: isTouch ? 0 : lettersShiftY,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="w-full max-w-[1020px] px-4 flex items-center justify-between opacity-30 sm:opacity-35 transition-opacity duration-300">
          <svg
            viewBox="0 0 280 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto text-[var(--bone)] overflow-visible"
          >
            {/* Monumental 'R' */}
            <motion.path
              d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
              stroke={hoveredPillar === 'R' ? 'var(--acc)' : 'currentColor'}
              strokeWidth="5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: hoveredPillar === 'R' ? 0.9 : 0.4 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Monumental Diamond 'O' Outer */}
            <motion.polygon
              points="140,8 178,46 140,84 102,46"
              stroke={hoveredPillar === 'O' ? 'var(--acc)' : 'currentColor'}
              strokeWidth="5"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: hoveredPillar === 'O' ? 0.95 : 0.45 }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Concentric Inner Diamond Accent Core - Pulsing with Rage Red */}
            <motion.polygon
              points="140,26 160,46 140,66 120,46"
              stroke="var(--acc)"
              strokeWidth="2.8"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0.55, 1, 0.55],
                scale: [1, 1.03, 1],
              }}
              transition={{
                pathLength: { duration: 1, delay: 0.3 },
                opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            {/* Monumental 'F' */}
            <motion.path
              d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
              stroke={hoveredPillar === 'F' ? 'var(--acc)' : 'currentColor'}
              strokeWidth="5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: hoveredPillar === 'F' ? 0.9 : 0.4 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* 3. TOP EDITORIAL META STRIP */}
      {/* ============================================================ */}
      <div className="relative z-20 mx-auto w-full max-w-[var(--max-content)] pt-2 md:pt-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3 text-xs">
          {/* Left: Drop Badge & Live Dispatch Signal */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--acc)]" />
            </span>
            <span className="label-caps text-[var(--bone)] tracking-[0.24em] font-medium">
              Drop 01 // Archival Capsule
            </span>
            <span className="hidden sm:inline-block text-[var(--hairline)]">/</span>
            <span className="hidden sm:inline-block font-sans text-xs text-[var(--muted)]">
              Piece {currentIndex + 1} of {initialProducts.length}
            </span>
          </div>

          {/* Center / Right: Interactive ROF Mindset Pillar Triggers */}
          <div className="hidden lg:flex items-center gap-6">
            <span
              onMouseEnter={() => setHoveredPillar('R')}
              onMouseLeave={() => setHoveredPillar(null)}
              className={cn(
                'label-caps cursor-pointer transition-colors',
                hoveredPillar === 'R' ? 'text-[var(--acc)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'
              )}
            >
              R • Ambition
            </span>
            <span className="text-[var(--hairline)]">•</span>
            <span
              onMouseEnter={() => setHoveredPillar('O')}
              onMouseLeave={() => setHoveredPillar(null)}
              className={cn(
                'label-caps cursor-pointer transition-colors',
                hoveredPillar === 'O' ? 'text-[var(--acc)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'
              )}
            >
              O • Originality
            </span>
            <span className="text-[var(--hairline)]">•</span>
            <span
              onMouseEnter={() => setHoveredPillar('F')}
              onMouseLeave={() => setHoveredPillar(null)}
              className={cn(
                'label-caps cursor-pointer transition-colors',
                hoveredPillar === 'F' ? 'text-[var(--acc)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'
              )}
            >
              F • Greatness
            </span>
          </div>

          {/* Right: Technical Streetwear Spec */}
          <div className="flex items-center gap-4 text-xs font-sans text-[var(--muted)]">
            <span className="hidden md:inline-block font-mono text-[11px] text-[var(--muted)]">
              260 GSM COMBED COTTON
            </span>
            <span className="label-caps text-[var(--acc)] font-medium">
              Lagos Hub
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. MAIN GARMENT RUNWAY STAGE */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 md:py-6 my-auto">
        {/* Floating Garment Viewport with 3D Perspective Tilt */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-2xl flex flex-col items-center justify-center min-h-[380px] sm:min-h-[470px]"
        >
          {/* Garment 3D Tilt Wrapper */}
          <motion.div
            style={{
              rotateX: isTouch ? 0 : garmentRotateX,
              rotateY: isTouch ? 0 : garmentRotateY,
              x: isTouch ? 0 : garmentTranslateX,
              y: isTouch ? 0 : garmentTranslateY,
              transformStyle: 'preserve-3d',
            }}
            animate={
              isTouch
                ? {
                    y: [0, -12, 0],
                  }
                : undefined
            }
            transition={
              isTouch
                ? { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
            className="relative z-10 flex flex-col items-center justify-center w-full"
          >
            {/* View Mode Toggle Switch (Silhouette vs Print Detail) */}
            <div className="mb-2 z-20 flex items-center gap-1 bg-[var(--ink)]/80 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm shadow-lg">
              <button
                type="button"
                onClick={() => setInspectMode('full')}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs',
                  inspectMode === 'full'
                    ? 'bg-[var(--bone)] text-[var(--ink)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                Silhouette
              </button>
              <button
                type="button"
                onClick={() => setInspectMode('closeup')}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs flex items-center gap-1',
                  inspectMode === 'closeup'
                    ? 'bg-[var(--acc)] text-[#fff6ec] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                <Sparkles className="w-2.5 h-2.5" />
                Print Detail
              </button>
            </div>

            {/* Active Garment Cutout with Smooth Cross-Dissolve Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeProduct.id}-${inspectMode}`}
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-center cursor-pointer"
                onClick={() => setInspectMode((m) => (m === 'full' ? 'closeup' : 'full'))}
              >
                <TeeCutout
                  design={activeMeta.design}
                  colour={activeMeta.colour}
                  view={inspectMode}
                  withDiamondAccent={false}
                  className={cn(
                    'w-auto transition-transform duration-500 ease-out drop-shadow-[0_32px_44px_rgba(0,0,0,0.75)]',
                    inspectMode === 'closeup'
                      ? 'max-h-[380px] sm:max-h-[480px] scale-110'
                      : 'max-h-[350px] sm:max-h-[440px] md:max-h-[480px]'
                  )}
                />
              </motion.div>
            </AnimatePresence>

            {/* Dynamic Ground Contact Shadow */}
            <motion.div
              style={{
                skewX: isTouch ? 0 : shadowSkewX,
                scaleX: isTouch ? 1 : shadowScale,
              }}
              animate={{
                scaleX: [1, 0.93, 1],
                opacity: [0.6, 0.4, 0.6],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-60 sm:w-84 h-4 bg-black/80 rounded-full blur-[12px] -mt-1 pointer-events-none"
            />
          </motion.div>

          {/* Left/Right Runway Arrow Navigators */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous piece"
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 p-2.5 text-[var(--muted)] hover:text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)]/40 bg-[var(--ink)]/60 backdrop-blur-md transition-all cursor-pointer z-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next piece"
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 p-2.5 text-[var(--muted)] hover:text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)]/40 bg-[var(--ink)]/60 backdrop-blur-md transition-all cursor-pointer z-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Editorial Headline & Fast Acquisition Bar */}
        <div className="relative z-20 w-full max-w-[var(--max-content)] mt-2 sm:mt-4 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div>
            <div className="overflow-hidden py-0.5">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-[var(--bone)] leading-[0.92] tracking-tight"
              >
                Destined for{' '}
                <span className="italic font-serif text-[var(--acc)]">
                  riches.
                </span>
              </motion.h1>
            </div>
            <p className="mt-2 text-xs sm:text-sm font-sans text-[var(--muted)] uppercase tracking-[0.2em] font-medium">
              Oversized Heavyweight Tees • Building Your Legacy
            </p>
          </div>

          {/* Quick Bag / Piece Acquisition Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3 bg-[var(--ink)]/95 backdrop-blur-md border border-[var(--hairline)] p-2 sm:p-2.5 shadow-2xl"
          >
            <div className="text-left px-2">
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block font-sans">
                {activeProduct.colour} • {activeProduct.name}
              </span>
              <span className="text-base sm:text-lg font-serif text-[var(--bone)] font-semibold leading-none">
                {formatNaira(activeProduct.price)}
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleQuickAdd}
              className="shrink-0"
            >
              {isAdded ? (
                <span className="flex items-center gap-1.5 text-xs">
                  <Check className="h-3.5 w-3.5" /> Added to Bag
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs">
                  <ShoppingBag className="h-3.5 w-3.5" /> Quick Bag
                </span>
              )}
            </Button>

            <Link
              to="/product/$id"
              params={{ id: activeProduct.id }}
              className="p-2 text-[var(--muted)] hover:text-[var(--bone)] transition-colors"
              title="View full piece archive"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. ARCHIVAL 5-PIECE RUNWAY DECK (BOTTOM BAR) */}
      {/* ============================================================ */}
      <div
        data-tone="bone"
        className="relative z-30 -mx-4 md:-mx-8 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)] px-4 md:px-8 py-3.5 sm:py-4"
      >
        <div className="mx-auto max-w-[var(--max-content)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Left: The 5-Piece Interactive Reel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[var(--acc-on-bone)] shrink-0 mr-1 flex items-center gap-1">
              <span>VAULT</span>
              <span className="text-[var(--ink)]">/</span>
            </span>

            {initialProducts.map((p, idx) => {
              const isCurrent = idx === currentIndex
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx)
                    setInspectMode('full')
                  }}
                  className={cn(
                    'touch-target-48 flex items-center gap-2.5 px-3 py-2 text-xs font-sans uppercase tracking-wider border transition-all cursor-pointer shrink-0',
                    isCurrent
                      ? 'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)] font-semibold shadow-md'
                      : 'bg-transparent text-[var(--ink)] border-[var(--hairline)] hover:border-[var(--ink)] hover:bg-[rgba(12,11,10,0.04)]'
                  )}
                  aria-label={`Select piece 0${idx + 1}: ${p.name}`}
                >
                  <span
                    className={cn(
                      'font-mono text-[11px]',
                      isCurrent ? 'text-[var(--acc)]' : 'text-[var(--muted)]'
                    )}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className="w-2.5 h-2.5 border border-black/20 shrink-0"
                    style={{ backgroundColor: p.swatch }}
                  />
                  <span className="truncate max-w-[110px] sm:max-w-none text-[11px]">
                    {p.name.replace(' Tee', '')}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right: Primary Collection CTA */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--hairline)]">
            <div className="text-left lg:text-right pr-2 hidden sm:block">
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block font-sans">
                Full 5-Piece Capsule
              </span>
              <span className="text-xs font-mono font-semibold text-[var(--ink)]">
                Lagos Express Courier Ready
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              withArrow
              onClick={() => navigate({ to: '/shop' })}
              className="w-full sm:w-auto"
            >
              Shop Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
