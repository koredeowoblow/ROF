import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, ShoppingBag, Check } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { initialProducts } from '@/api/products'
import { formatNaira } from '@/lib/money'
import { Product } from '@/api/types'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { Logo, DiamondMark } from '@/components/Logo'
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
  const [isTouch, setIsTouch] = useState(true)

  const activeProduct = initialProducts[currentIndex]
  const stageRef = useRef<HTMLDivElement>(null)

  // Spring physics mouse coordinates normalized to [-0.5, 0.5]
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  const springConfig = { damping: 28, stiffness: 180, mass: 0.6 }
  const smoothX = useSpring(rawMouseX, springConfig)
  const smoothY = useSpring(rawMouseY, springConfig)

  // 3D Perspective Transformations for the suspended garment
  const garmentRotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8])
  const garmentRotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10])
  const garmentTranslateX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const garmentTranslateY = useTransform(smoothY, [-0.5, 0.5], [-10, 10])

  // Shadow displacement reacting naturally to tilt
  const shadowSkewX = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.94, 1.06])

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
    setTimeout(() => setIsAdded(false), 2200)
  }

  return (
    <section
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-tone="ink"
      className={cn(
        'relative min-h-[94svh] w-full flex flex-col justify-between pt-20 pb-0 px-4 md:px-8 border-b border-[var(--hairline)] grain-overlay overflow-hidden select-none cursor-default bg-[#0c0b0a]',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. FAINT ROF WORDMARK GHOST IN THE BACKGROUND */}
      {/* ============================================================ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <Logo
          size="hero"
          ghost
          className="w-full max-w-[880px] scale-110 sm:scale-125 opacity-40"
        />
      </div>

      {/* Subtle radial ambient warmth behind garment */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.06)_0%,transparent_65%)]" />
      </div>

      {/* ============================================================ */}
      {/* 2. TOP MASTHEAD STRIP */}
      {/* ============================================================ */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--max-content)] pt-2 md:pt-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3 text-xs">
          {/* Left: Collection Badge */}
          <div className="flex items-center gap-3">
            <DiamondMark size={8} accent filled />
            <span className="label-caps text-[var(--acc)] tracking-[0.24em]">
              Collection 01
            </span>
            <span className="hidden sm:inline-block text-[var(--hairline)]">/</span>
            <span className="hidden sm:inline-block font-sans text-xs text-[var(--muted)]">
              Five Heavyweight Pieces
            </span>
          </div>

          {/* Right: Technical Specs */}
          <div className="flex items-center gap-4 text-xs font-sans text-[var(--muted)]">
            <span className="hidden md:inline-block">
              260 GSM Heavyweight Cotton
            </span>
            <span className="label-caps text-[var(--bone)]">
              Lagos Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CENTER GARMENT STAGE: 3D SUSPENDED CUTOUT & EDITORIAL TITLE */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 md:py-8 my-auto">
        {/* Floating Garment Viewport with 3D Tilt Inertia */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-2xl flex flex-col items-center justify-center min-h-[360px] sm:min-h-[460px]"
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
                    y: [0, -10, 0],
                  }
                : undefined
            }
            transition={
              isTouch
                ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
            className="relative z-10 flex flex-col items-center justify-center w-full"
          >
            {/* Active Garment Cutout with Clean Cross-Dissolve Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-center"
              >
                <TeeCutout
                  design={activeMeta.design}
                  colour={activeMeta.colour}
                  view="full"
                  withDiamondAccent={false}
                  className="w-auto max-h-[350px] sm:max-h-[440px] md:max-h-[470px] drop-shadow-[0_28px_36px_rgba(0,0,0,0.65)]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Realistic Reactive Dynamic Contact Shadow */}
            <motion.div
              style={{
                skewX: isTouch ? 0 : shadowSkewX,
                scaleX: isTouch ? 1 : shadowScale,
              }}
              animate={{
                scaleX: [1, 0.94, 1],
                opacity: [0.55, 0.38, 0.55],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-56 sm:w-80 h-3.5 bg-black/75 rounded-full blur-[10px] -mt-2 pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Editorial Headline Overlay */}
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
                  greatness.
                </span>
              </motion.h1>
            </div>
            <p className="mt-2 text-xs sm:text-sm font-sans text-[var(--muted)] uppercase tracking-[0.2em] font-medium">
              Heavyweight Streetwear • Building Your Legacy
            </p>
          </div>

          {/* Quick Add / Piece Purchase Card on Stage */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3 bg-[var(--ink)]/90 backdrop-blur-md border border-[var(--hairline)] p-2 sm:p-2.5 shadow-xl"
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
                  <Check className="h-3.5 w-3.5" /> Claimed
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs">
                  <ShoppingBag className="h-3.5 w-3.5" /> Quick Bag
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. ARCHIVAL 5-PIECE GARMENT REEL (BOTTOM BAR) */}
      {/* ============================================================ */}
      <div
        data-tone="bone"
        className="relative z-30 -mx-4 md:-mx-8 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)] px-4 md:px-8 py-3.5 sm:py-4"
      >
        <div className="mx-auto max-w-[var(--max-content)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Left: The 5-Piece Interactive Reel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[var(--acc-on-bone)] shrink-0 mr-1 flex items-center gap-1">
              <span>REEL</span>
              <span className="text-[var(--ink)]">/</span>
            </span>

            {initialProducts.map((p, idx) => {
              const isCurrent = idx === currentIndex
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'touch-target-48 flex items-center gap-2.5 px-3 py-2 text-xs font-sans uppercase tracking-wider border transition-all cursor-pointer shrink-0',
                    isCurrent
                      ? 'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)] font-semibold shadow-md'
                      : 'bg-transparent text-[var(--ink)] border-[var(--hairline)] hover:border-[var(--ink)] hover:bg-[rgba(12,11,10,0.04)]'
                  )}
                  aria-label={`Switch hero to piece ${idx + 1}: ${p.name}`}
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
                Full Capsule Collection
              </span>
              <span className="text-xs font-mono font-semibold text-[var(--ink)]">
                5 Cut-Out Pieces Available
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
