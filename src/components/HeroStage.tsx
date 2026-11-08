import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, ShoppingBag, Check, Sparkles, ChevronLeft, ChevronRight, Clock, ShieldCheck, Truck } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { initialProducts } from '@/api/products'
import { formatNaira } from '@/lib/money'
import { Product } from '@/api/types'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { useBagStore } from '@/features/bag/bagStore'
import { cn } from '@/lib/utils'

interface HeroStageProps {
  className?: string
}

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const addItem = useBagStore((s) => s.addItem)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L')
  const [isAdded, setIsAdded] = useState(false)
  const [inspectMode, setInspectMode] = useState<'full' | 'closeup'>('full')
  const [hoveredPillar, setHoveredPillar] = useState<'R' | 'O' | 'F' | null>(null)
  const [isTouch, setIsTouch] = useState(true)
  const [lagosTime, setLagosTime] = useState<string>('12:00:00')

  const activeProduct = initialProducts[currentIndex]
  const stageRef = useRef<HTMLDivElement>(null)

  // Live Lagos Studio Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const time = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date())
        setLagosTime(time)
      } catch {
        const d = new Date()
        setLagosTime(d.toTimeString().split(' ')[0])
      }
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

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

  const handleAddCurrent = () => {
    addItem({
      productId: activeProduct.id,
      name: activeProduct.name,
      colour: activeProduct.colour,
      size: selectedSize,
      unitPrice: activeProduct.price,
      image: activeProduct.images[0],
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <section
      className={cn(
        'relative w-full border-b border-[var(--hairline)] overflow-hidden select-none',
        className
      )}
    >
      {/* ============================================================ */}
      {/* MASTER 60-30-10 SPLIT PANE HERO: INK (60%) + BONE (30%) + RED (10%) */}
      {/* ============================================================ */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[92svh]">
        {/* ============================================================ */}
        {/* LEFT PANE (7 COLS / 60%): THE INK RUNWAY VAULT */}
        {/* ============================================================ */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          data-tone="ink"
          className="relative lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[var(--hairline)] grain-overlay overflow-hidden bg-[#0c0b0a] min-h-[540px] sm:min-h-[620px] lg:min-h-[880px]"
        >
          {/* 1. Dramatic Overhead Studio Spotlight */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[580px] sm:w-[740px] h-[520px] pointer-events-none z-0 opacity-45"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(236,230,216,0.18) 0%, rgba(229,55,45,0.08) 45%, transparent 80%)',
            }}
          />

          {/* Subtle Ambient Red Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.08)_0%,transparent_68%)]" />
          </div>

          {/* 2. Monumental Architectural R - O - F Typography */}
          <motion.div
            style={{
              x: isTouch ? 0 : lettersShiftX,
              y: isTouch ? 0 : lettersShiftY,
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-4"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 280 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[620px] text-[var(--bone)] overflow-visible opacity-35"
            >
              {/* 'R' */}
              <motion.path
                d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
                stroke={hoveredPillar === 'R' ? 'var(--acc)' : 'currentColor'}
                strokeWidth="5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: hoveredPillar === 'R' ? 0.95 : 0.4 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* 'O' Diamond Outer */}
              <motion.polygon
                points="140,8 178,46 140,84 102,46"
                stroke={hoveredPillar === 'O' ? 'var(--acc)' : 'currentColor'}
                strokeWidth="5"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: hoveredPillar === 'O' ? 0.95 : 0.45 }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* 'O' Concentric Red Accent Core */}
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
                  opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                }}
              />

              {/* 'F' */}
              <motion.path
                d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
                stroke={hoveredPillar === 'F' ? 'var(--acc)' : 'currentColor'}
                strokeWidth="5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: hoveredPillar === 'F' ? 0.95 : 0.4 }}
                transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </motion.div>

          {/* 3. Top Left Meta Strip */}
          <div className="relative z-20 flex items-center justify-between border-b border-[var(--hairline)] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--acc)]" />
              </span>
              <span className="label-caps text-[var(--bone)] tracking-[0.24em] font-medium">
                Live Capsule Drop
              </span>
              <span className="text-[var(--hairline)]">•</span>
              <span className="text-xs font-mono text-[var(--acc)] font-bold">
                0{currentIndex + 1} / 05
              </span>
            </div>

            {/* View Mode Toggle Switch */}
            <div className="flex items-center gap-1 bg-[var(--ink)]/80 backdrop-blur-md border border-[var(--hairline)] p-0.5 rounded-sm">
              <button
                type="button"
                onClick={() => setInspectMode('full')}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer',
                  inspectMode === 'full'
                    ? 'bg-[var(--bone)] text-[var(--ink)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                Full Cut
              </button>
              <button
                type="button"
                onClick={() => setInspectMode('closeup')}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center gap-1',
                  inspectMode === 'closeup'
                    ? 'bg-[var(--acc)] text-[#fff6ec] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                <Sparkles className="w-2.5 h-2.5" />
                Print Detail
              </button>
            </div>
          </div>

          {/* 4. Center 3D Suspended Garment Viewport */}
          <div
            style={{ perspective: 1200 }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-6"
          >
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
              {/* Garment Cutout */}
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
                      'w-auto transition-transform duration-500 ease-out drop-shadow-[0_32px_44px_rgba(0,0,0,0.8)]',
                      inspectMode === 'closeup'
                        ? 'max-h-[380px] sm:max-h-[460px] scale-110'
                        : 'max-h-[340px] sm:max-h-[440px] md:max-h-[470px]'
                    )}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Ground Shadow */}
              <motion.div
                style={{
                  skewX: isTouch ? 0 : shadowSkewX,
                  scaleX: isTouch ? 1 : shadowScale,
                }}
                animate={{
                  scaleX: [1, 0.93, 1],
                  opacity: [0.65, 0.45, 0.65],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-56 sm:w-80 h-4 bg-black/80 rounded-full blur-[12px] -mt-1 pointer-events-none"
              />
            </motion.div>

            {/* Prev/Next Runway Controls */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous garment"
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2.5 text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)]/50 bg-[var(--ink)]/80 backdrop-blur-md transition-all cursor-pointer z-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next garment"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)]/50 bg-[var(--ink)]/80 backdrop-blur-md transition-all cursor-pointer z-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5. Bottom Vault Selector Tape */}
          <div className="relative z-20 pt-3 border-t border-[var(--hairline)] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--acc)] shrink-0 mr-1">
              ARCHIVE
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                      'px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 shrink-0',
                      isCurrent
                        ? 'border-[var(--acc)] bg-[var(--ink)] text-[var(--bone)] shadow-md'
                        : 'border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--bone)] hover:border-[var(--bone)]/30'
                    )}
                  >
                    <span className={isCurrent ? 'text-[var(--acc)] font-bold' : ''}>
                      0{idx + 1}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full border border-black/30"
                      style={{ backgroundColor: p.swatch }}
                    />
                  </button>
                )
              })}
            </div>
            <span className="text-[11px] font-sans text-[var(--muted)] hidden sm:inline-block shrink-0">
              {activeProduct.colour} • {activeProduct.name.replace(' Tee', '')}
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANE (5 COLS / 30%): THE BONE EDITORIAL CONTROL BOARD */}
        {/* ============================================================ */}
        <div
          data-tone="bone"
          className="relative lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-[var(--bone)] text-[var(--ink)] overflow-hidden"
        >
          {/* Top: Live Lagos Clock & Hub Status */}
          <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[var(--acc-on-bone)]" />
              <span className="font-semibold tracking-wider">
                LAGOS {lagosTime} WAT
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--acc-on-bone)] animate-pulse" />
              <span className="label-caps text-[var(--acc-on-bone)]">
                Hub Active
              </span>
            </div>
          </div>

          {/* Center: Monumental Headline & Piece Details */}
          <div className="my-auto py-6 sm:py-8 flex flex-col gap-6">
            <div>
              <span className="label-caps text-[var(--acc-on-bone)] tracking-[0.28em] block mb-2 font-semibold">
                ROF RAGE • CAPSULE 01
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-[var(--ink)] leading-[0.95] tracking-tight">
                Destined for{' '}
                <span className="italic font-serif text-[var(--acc-on-bone)]">
                  riches.
                </span>
              </h1>
              <p className="mt-3 text-sm font-sans text-[var(--ink)]/80 leading-relaxed font-normal">
                Oversized boxy cut, custom-milled 260 GSM combed cotton. Hand-finished screenprints engineered in Lagos for ambition and legacy.
              </p>
            </div>

            {/* Active Piece Price & Name Card */}
            <div className="border-t border-b border-[var(--hairline)] py-4 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-mono text-[var(--acc-on-bone)] uppercase tracking-wider block font-bold">
                  PIECE 0{currentIndex + 1}
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)]">
                  {activeProduct.name}
                </span>
                <span className="text-xs font-sans text-[var(--ink)]/65 block mt-0.5">
                  Colourway: {activeProduct.colour}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-sans font-bold text-[var(--ink)] tracking-tight">
                  {formatNaira(activeProduct.price)}
                </span>
                <span className="text-[10px] font-mono text-[var(--ink)]/60 block uppercase">
                  Inclusive of VAT
                </span>
              </div>
            </div>

            {/* Size Selector Chips */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="label-caps font-semibold text-[var(--ink)]">
                  Select Size (Boxy Oversized Cut)
                </span>
                <Link
                  to="/help"
                  className="text-[11px] font-sans text-[var(--acc-on-bone)] hover:underline"
                >
                  Size Guide
                </Link>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                  <Chip
                    key={sz}
                    label={sz}
                    selected={selectedSize === sz}
                    onClick={() => setSelectedSize(sz)}
                    className="touch-target-48 font-mono text-xs font-semibold py-2.5 justify-center"
                  />
                ))}
              </div>
            </div>

            {/* Primary Action Button (Rage Red) */}
            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddCurrent}
                className="w-full text-sm font-semibold tracking-wider uppercase py-4 shadow-lg cursor-pointer"
              >
                {isAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Added to Bag
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Add to Bag • {formatNaira(activeProduct.price)}
                  </span>
                )}
              </Button>

              <div className="flex items-center justify-between pt-1 text-[11px] font-sans text-[var(--ink)]/75">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[var(--acc-on-bone)]" /> Lagos Express Courier
                </span>
                <Link
                  to="/product/$id"
                  params={{ id: activeProduct.id }}
                  className="font-medium hover:text-[var(--acc-on-bone)] transition-colors inline-flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom: Technical Guarantee Badge */}
          <div className="border-t border-[var(--hairline)] pt-3 flex items-center justify-between text-xs text-[var(--ink)]/70">
            <span className="font-mono text-[11px]">
              260 GSM HEAVYWEIGHT COTTON
            </span>
            <span className="font-mono text-[11px] text-[var(--acc-on-bone)] font-semibold">
              ORIGINAL ARCHIVE
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
