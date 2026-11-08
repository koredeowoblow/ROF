import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { initialProducts } from '@/api/products'
import { Product } from '@/api/types'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'

interface HeroStageProps {
  className?: string
}

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inspectMode, setInspectMode] = useState<'full' | 'closeup'>('full')
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

  // Touch device detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch(!window.matchMedia('(pointer: fine)').matches)
    }
  }, [])

  // Spring physics mouse tracking normalized to [-0.5, 0.5]
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  const springConfig = { damping: 24, stiffness: 160, mass: 0.5 }
  const smoothX = useSpring(rawMouseX, springConfig)
  const smoothY = useSpring(rawMouseY, springConfig)

  // 3D Perspective Transformations for the suspended garment
  const garmentRotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10])
  const garmentRotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const garmentTranslateX = useTransform(smoothX, [-0.5, 0.5], [-16, 16])
  const garmentTranslateY = useTransform(smoothY, [-0.5, 0.5], [-12, 12])

  // Parallax for Background Logo Ghost
  const ghostShiftX = useTransform(smoothX, [-0.5, 0.5], [22, -22])
  const ghostShiftY = useTransform(smoothY, [-0.5, 0.5], [14, -14])

  // Dynamic Contact Shadow
  const shadowSkewX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.92, 1.08])

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

  return (
    <section
      className={cn(
        'relative w-full border-b border-[var(--hairline)] overflow-hidden select-none',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 60-30-10 DUAL PANE ARCHITECTURE: BONE (35%) + INK (65%) */}
      {/* ============================================================ */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[92svh]">
        {/* ============================================================ */}
        {/* LEFT PANE (BONE ~35% / 5 COLS): EDITORIAL MANIFESTO & IDENTITY */}
        {/* ============================================================ */}
        <div
          data-tone="bone"
          className="relative lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[var(--bone)] text-[var(--ink)] border-b lg:border-b-0 lg:border-r border-[var(--hairline)] order-2 lg:order-1"
        >
          {/* Top: Live Telemetry & Drop Status */}
          <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc-on-bone)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--acc-on-bone)]" />
              </span>
              <span className="label-caps text-[var(--ink)] font-semibold tracking-[0.24em]">
                Drop 01 // Archive
              </span>
            </div>

            <div className="flex items-center gap-2 text-[var(--ink)]/80">
              <Clock className="w-3.5 h-3.5 text-[var(--acc-on-bone)]" />
              <span className="tracking-wider">LAGOS {lagosTime}</span>
            </div>
          </div>

          {/* Center Editorial Manifesto & Headline */}
          <div className="my-auto py-8 sm:py-12 flex flex-col gap-6">
            {/* Colossal Index Numeral */}
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-serif italic text-[var(--acc-on-bone)] font-bold">
                0{currentIndex + 1}
              </span>
              <span className="text-[var(--hairline)] text-xl">/</span>
              <span className="text-xs font-mono tracking-widest text-[var(--ink)]/60 uppercase">
                Silhouette 05
              </span>
            </div>

            {/* Monumental Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display text-[var(--ink)] leading-[0.92] tracking-tight">
                Destined for{' '}
                <span className="italic font-serif text-[var(--acc-on-bone)]">
                  riches.
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base font-sans text-[var(--ink)]/80 leading-relaxed max-w-md">
                ROF is ambition, confidence and originality. Engineered in Lagos with heavy 260 GSM combed cotton, custom boxy drape, and archival prints.
              </p>
            </div>

            {/* Active Garment Card */}
            <div className="border-t border-b border-[var(--hairline)] py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[var(--acc-on-bone)] uppercase tracking-wider block font-bold">
                  ACTIVE RUNWAY PIECE
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] block">
                  {activeProduct.name}
                </span>
                <span className="text-xs font-sans text-[var(--ink)]/70 block mt-0.5">
                  Colourway: {activeProduct.colour}
                </span>
              </div>
              <div
                className="w-8 h-8 rounded-full border border-black/20 shadow-inner shrink-0"
                style={{ backgroundColor: activeProduct.swatch }}
                title={activeProduct.colour}
              />
            </div>

            {/* Point of Attraction CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                withArrow
                onClick={() => {
                  const target = document.getElementById('collection-chapters')
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    navigate({ to: '/shop' })
                  }
                }}
                className="w-full sm:w-auto uppercase tracking-wider text-xs font-semibold px-6 py-4 cursor-pointer shadow-lg"
              >
                Explore Capsule
              </Button>

              <Link
                to="/product/$id"
                params={{ id: activeProduct.id }}
                className="inline-flex items-center justify-center px-4 py-3.5 border border-[var(--hairline)] hover:border-[var(--ink)] text-xs font-mono uppercase tracking-wider text-[var(--ink)] transition-colors"
              >
                View Piece Story
              </Link>
            </div>
          </div>

          {/* Bottom: Technical Guarantee */}
          <div className="border-t border-[var(--hairline)] pt-4 flex items-center justify-between text-xs font-mono text-[var(--ink)]/70">
            <span>260 GSM HEAVYWEIGHT COTTON</span>
            <span className="text-[var(--acc-on-bone)] font-semibold">
              LAGOS DISPATCH
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANE (INK ~65% / 7 COLS): THE RUNWAY SPECTACLE STAGE */}
        {/* ============================================================ */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          data-tone="ink"
          className="relative lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-[#0c0b0a] grain-overlay overflow-hidden min-h-[580px] sm:min-h-[680px] lg:min-h-[880px] order-1 lg:order-2"
        >
          {/* 1. Dramatic Overhead Spotlight Beam */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[850px] h-[600px] pointer-events-none z-0 opacity-45 transition-all duration-700"
            style={{
              background:
                activeMeta.colour === 'forest-green'
                  ? 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(27,56,43,0.4) 0%, rgba(236,230,216,0.12) 35%, transparent 75%)'
                  : activeMeta.colour === 'white'
                  ? 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(236,230,216,0.25) 0%, rgba(229,55,45,0.06) 40%, transparent 75%)'
                  : 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(229,55,45,0.18) 0%, rgba(236,230,216,0.08) 40%, transparent 75%)',
            }}
          />

          {/* Subtle Ambient Red Glow behind Garment */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.09)_0%,transparent_68%)]" />
          </div>

          {/* 2. Monumental Architectural ROF Logo Ghost with Parallax */}
          <motion.div
            style={{
              x: isTouch ? 0 : ghostShiftX,
              y: isTouch ? 0 : ghostShiftY,
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-4"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 280 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[680px] text-[var(--bone)] overflow-visible opacity-30"
            >
              {/* 'R' */}
              <motion.path
                d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* 'O' Diamond Outer */}
              <motion.polygon
                points="140,8 178,46 140,84 102,46"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* 'O' Concentric Red Accent Core - Pulsing with Rage Red */}
              <motion.polygon
                points="140,26 160,46 140,66 120,46"
                stroke="var(--acc)"
                strokeWidth="3"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  pathLength: { duration: 1, delay: 0.3 },
                  opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                }}
              />

              {/* 'F' */}
              <motion.path
                d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </motion.div>

          {/* 3. Top Stage Strip: View Mode Switcher */}
          <div className="relative z-20 flex items-center justify-between border-b border-[var(--hairline)] pb-3">
            <div className="flex items-center gap-2">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--acc)] tracking-[0.24em] font-medium">
                3D Kinetic Stage
              </span>
            </div>

            {/* Silhouette vs Print Toggle */}
            <div className="flex items-center gap-1 bg-[var(--ink)]/85 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm shadow-xl">
              <button
                type="button"
                onClick={() => setInspectMode('full')}
                className={cn(
                  'px-3 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs',
                  inspectMode === 'full'
                    ? 'bg-[var(--bone)] text-[var(--ink)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                Full Silhouette
              </button>
              <button
                type="button"
                onClick={() => setInspectMode('closeup')}
                className={cn(
                  'px-3 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs flex items-center gap-1.5',
                  inspectMode === 'closeup'
                    ? 'bg-[var(--acc)] text-[#fff6ec] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                <Sparkles className="w-2.5 h-2.5" />
                Inspect Print
              </button>
            </div>
          </div>

          {/* 4. Massive Suspended Heavyweight Garment (Large Scale) */}
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
              animate={{
                y: [0, -16, 0],
                rotateZ: [-1, 1, -1],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10 flex flex-col items-center justify-center w-full"
            >
              {/* Active Garment Cutout */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeProduct.id}-${inspectMode}`}
                  initial={{ opacity: 0, scale: 0.92, y: 22 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -18 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex justify-center cursor-pointer"
                  onClick={() => setInspectMode((m) => (m === 'full' ? 'closeup' : 'full'))}
                >
                  <TeeCutout
                    design={activeMeta.design}
                    colour={activeMeta.colour}
                    view={inspectMode}
                    withDiamondAccent={false}
                    className={cn(
                      'w-auto transition-transform duration-500 ease-out drop-shadow-[0_42px_56px_rgba(0,0,0,0.85)]',
                      inspectMode === 'closeup'
                        ? 'max-h-[420px] sm:max-h-[520px] scale-110'
                        : 'max-h-[380px] sm:max-h-[500px] md:max-h-[560px]'
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
                  scaleX: [1, 0.92, 1],
                  opacity: [0.7, 0.45, 0.7],
                }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-64 sm:w-96 h-5 bg-black/90 rounded-full blur-[14px] -mt-1 pointer-events-none"
              />
            </motion.div>

            {/* Prev/Next Stage Navigators */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous piece"
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)] bg-[var(--ink)]/80 backdrop-blur-md transition-all cursor-pointer z-30 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next piece"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)] bg-[var(--ink)]/80 backdrop-blur-md transition-all cursor-pointer z-30 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 5. Bottom Interactive Runway Switcher Tape */}
          <div className="relative z-20 pt-4 border-t border-[var(--hairline)] flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--acc)] font-bold shrink-0 flex items-center gap-1.5">
              <span>RUNWAY REEL</span>
              <span className="text-[var(--hairline)]">/</span>
            </span>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
                      'px-3 py-2 text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 shrink-0',
                      isCurrent
                        ? 'border-[var(--acc)] bg-[var(--ink)] text-[var(--bone)] font-semibold shadow-md'
                        : 'border-[var(--hairline)] text-[var(--muted)] hover:text-[var(--bone)] hover:border-[var(--bone)]/40'
                    )}
                  >
                    <span className={isCurrent ? 'text-[var(--acc)] font-bold' : ''}>
                      0{idx + 1}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0"
                      style={{ backgroundColor: p.swatch }}
                    />
                    <span className="truncate max-w-[100px] sm:max-w-none text-[11px]">
                      {p.name.replace(' Tee', '')}
                    </span>
                  </button>
                )
              })}
            </div>

            <span className="text-xs font-mono text-[var(--bone)] hidden md:inline-block shrink-0">
              {activeProduct.colour}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
