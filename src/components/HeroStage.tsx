import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Sparkles, Compass } from 'lucide-react'
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
  const [hoveredLetter, setHoveredLetter] = useState<'R' | 'O' | 'F' | null>(null)
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
  const garmentRotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12])
  const garmentRotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15])
  const garmentTranslateX = useTransform(smoothX, [-0.5, 0.5], [-20, 20])
  const garmentTranslateY = useTransform(smoothY, [-0.5, 0.5], [-14, 14])

  // Parallax for Monumental Background Letters
  const lettersShiftX = useTransform(smoothX, [-0.5, 0.5], [28, -28])
  const lettersShiftY = useTransform(smoothY, [-0.5, 0.5], [16, -16])

  // Dynamic Contact Shadow
  const shadowSkewX = useTransform(smoothX, [-0.5, 0.5], [-16, 16])
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.9, 1.1])

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
    setHoveredLetter(null)
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
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-tone="ink"
      className={cn(
        'relative min-h-[96svh] w-full flex flex-col justify-between pt-16 sm:pt-20 pb-0 border-b border-[var(--hairline)] grain-overlay overflow-hidden select-none cursor-default bg-[#0c0b0a]',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. ATMOSPHERIC STUDIO ENVIRONMENT & RADIAL COLOR TEMPERATURE */}
      {/* ============================================================ */}
      {/* Dramatic overhead stage beam focused onto the suspended tee */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] sm:w-[940px] h-[640px] pointer-events-none z-0 opacity-40 transition-opacity duration-700"
        style={{
          background:
            activeMeta.colour === 'forest-green'
              ? 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(27,56,43,0.35) 0%, rgba(236,230,216,0.12) 35%, transparent 75%)'
              : activeMeta.colour === 'white'
              ? 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(236,230,216,0.24) 0%, rgba(229,55,45,0.06) 40%, transparent 75%)'
              : 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(229,55,45,0.14) 0%, rgba(236,230,216,0.08) 40%, transparent 75%)',
        }}
      />

      {/* Subtle pulsing warmth behind the garment */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[360px] sm:w-[560px] h-[360px] sm:h-[560px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.08)_0%,transparent_65%)]" />
      </div>

      {/* ============================================================ */}
      {/* 2. MONUMENTAL ARCHITECTURAL R - O - F KINETIC BACKDROP */}
      {/* ============================================================ */}
      <motion.div
        style={{
          x: isTouch ? 0 : lettersShiftX,
          y: isTouch ? 0 : lettersShiftY,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-4"
        aria-hidden="true"
      >
        <div className="w-full max-w-[1040px] flex items-center justify-center opacity-30 sm:opacity-40 transition-all duration-300">
          <svg
            viewBox="0 0 280 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto text-[var(--bone)] overflow-visible"
          >
            {/* Monumental 'R' (Ambition) */}
            <motion.path
              d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
              stroke={hoveredLetter === 'R' ? 'var(--acc)' : 'currentColor'}
              strokeWidth="5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: hoveredLetter === 'R' ? 0.95 : 0.45,
              }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Monumental Diamond 'O' Outer Contour */}
            <motion.polygon
              points="140,8 178,46 140,84 102,46"
              stroke={hoveredLetter === 'O' ? 'var(--acc)' : 'currentColor'}
              strokeWidth="5"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: hoveredLetter === 'O' ? 0.95 : 0.48,
              }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Concentric Inner Diamond Accent Core - Pulsing Rage Red */}
            <motion.polygon
              points="140,26 160,46 140,66 120,46"
              stroke="var(--acc)"
              strokeWidth="2.8"
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

            {/* Monumental 'F' (Greatness) */}
            <motion.path
              d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
              stroke={hoveredLetter === 'F' ? 'var(--acc)' : 'currentColor'}
              strokeWidth="5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: hoveredLetter === 'F' ? 0.95 : 0.45,
              }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* 3. TOP EDITORIAL RUNWAY MASTHEAD (LIVE TELEMETRY) */}
      {/* ============================================================ */}
      <div className="relative z-20 mx-auto w-full max-w-[var(--max-content)] px-4 md:px-8 pt-3">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3.5 text-xs">
          {/* Left: Live Runway Signal & Coordinates */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc)] opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--acc)]" />
            </span>
            <span className="label-caps text-[var(--bone)] tracking-[0.24em] font-semibold">
              Drop 01 // Lagos Runway
            </span>
            <span className="hidden sm:inline-block text-[var(--hairline)]">/</span>
            <span className="hidden sm:inline-block font-mono text-xs text-[var(--muted)]">
              Piece 0{currentIndex + 1} of 05
            </span>
          </div>

          {/* Center: Interactive Mindset Letter Triggers */}
          <div className="hidden lg:flex items-center gap-6">
            <span
              onMouseEnter={() => setHoveredLetter('R')}
              onMouseLeave={() => setHoveredLetter(null)}
              className={cn(
                'label-caps cursor-pointer transition-colors',
                hoveredLetter === 'R' ? 'text-[var(--acc)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'
              )}
            >
              R • Ambition
            </span>
            <span className="text-[var(--hairline)]">•</span>
            <span
              onMouseEnter={() => setHoveredLetter('O')}
              onMouseLeave={() => setHoveredLetter(null)}
              className={cn(
                'label-caps cursor-pointer transition-colors',
                hoveredLetter === 'O' ? 'text-[var(--acc)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'
              )}
            >
              O • The Diamond Mindset
            </span>
            <span className="text-[var(--hairline)]">•</span>
            <span
              onMouseEnter={() => setHoveredLetter('F')}
              onMouseLeave={() => setHoveredLetter(null)}
              className={cn(
                'label-caps cursor-pointer transition-colors',
                hoveredLetter === 'F' ? 'text-[var(--acc)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'
              )}
            >
              F • Greatness
            </span>
          </div>

          {/* Right: Live Lagos Clock */}
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--bone)]">
            <Clock className="w-3.5 h-3.5 text-[var(--acc)]" />
            <span className="tracking-wider">
              LAGOS {lagosTime} WAT
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. MAIN SPECTACLE STAGE: 3D SUSPENDED RUNWAY PIECE */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-4 sm:py-6 px-4">
        {/* Floating Garment Viewport with 3D Physics */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-2xl flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px]"
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
            animate={{
              y: [0, -14, 0],
              rotateZ: [-0.8, 0.8, -0.8],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 flex flex-col items-center justify-center w-full"
          >
            {/* View Mode Pill Switcher */}
            <div className="mb-3 z-20 flex items-center gap-1 bg-[var(--ink)]/85 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm shadow-xl">
              <button
                type="button"
                onClick={() => setInspectMode('full')}
                className={cn(
                  'px-3 py-1 text-[10px] font-sans uppercase tracking-[0.22em] transition-all cursor-pointer rounded-xs',
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
                  'px-3 py-1 text-[10px] font-sans uppercase tracking-[0.22em] transition-all cursor-pointer rounded-xs flex items-center gap-1.5',
                  inspectMode === 'closeup'
                    ? 'bg-[var(--acc)] text-[#fff6ec] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                <Sparkles className="w-2.5 h-2.5" />
                Inspect Print
              </button>
            </div>

            {/* Active Garment Cutout */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeProduct.id}-${inspectMode}`}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
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
                    'w-auto transition-transform duration-500 ease-out drop-shadow-[0_36px_50px_rgba(0,0,0,0.8)]',
                    inspectMode === 'closeup'
                      ? 'max-h-[390px] sm:max-h-[500px] scale-110'
                      : 'max-h-[360px] sm:max-h-[460px] md:max-h-[500px]'
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
                opacity: [0.65, 0.42, 0.65],
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-64 sm:w-92 h-4.5 bg-black/85 rounded-full blur-[14px] -mt-1 pointer-events-none"
            />
          </motion.div>

          {/* Left/Right Stage Navigators */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous archival piece"
            className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 p-3 text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)] bg-[var(--ink)]/80 backdrop-blur-md transition-all cursor-pointer z-30 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next archival piece"
            className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 p-3 text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)] bg-[var(--ink)]/80 backdrop-blur-md transition-all cursor-pointer z-30 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Editorial Headline Overlay */}
        <div className="relative z-20 w-full max-w-[var(--max-content)] mt-2 sm:mt-4 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 px-4 md:px-8">
          <div>
            <div className="overflow-hidden py-1">
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
            <p className="mt-2 text-xs sm:text-sm font-sans text-[var(--muted)] uppercase tracking-[0.24em] font-medium">
              Heavyweight Streetwear • Building Your Legacy
            </p>
          </div>

          {/* Primary Exploration Action (Point of Attraction, Not Sales) */}
          <div className="flex items-center gap-3">
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
              className="text-sm uppercase tracking-wider font-semibold px-6 py-3.5 shadow-xl cursor-pointer"
            >
              Explore Collection
            </Button>

            <Link
              to="/product/$id"
              params={{ id: activeProduct.id }}
              className="p-3 text-[var(--bone)] border border-[var(--hairline)] hover:border-[var(--bone)] bg-[var(--ink)]/80 backdrop-blur-md transition-colors text-xs font-mono uppercase tracking-wider"
            >
              Piece 0{currentIndex + 1} Archive
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. ARCHIVAL 5-PIECE RUNWAY DECK (30% BONE RUNWAY PANE) */}
      {/* ============================================================ */}
      <div
        data-tone="bone"
        className="relative z-30 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)] px-4 md:px-8 py-4"
      >
        <div className="mx-auto max-w-[var(--max-content)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Left: The 5-Piece Interactive Reel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[var(--acc-on-bone)] shrink-0 mr-2 flex items-center gap-1.5">
              <DiamondMark size={8} accent filled />
              <span>RUNWAY ARCHIVE</span>
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
                    'touch-target-48 flex items-center gap-2.5 px-3.5 py-2 text-xs font-sans uppercase tracking-wider border transition-all cursor-pointer shrink-0',
                    isCurrent
                      ? 'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)] font-semibold shadow-md'
                      : 'bg-transparent text-[var(--ink)] border-[var(--hairline)] hover:border-[var(--ink)] hover:bg-[rgba(12,11,10,0.05)]'
                  )}
                  aria-label={`Switch runway to piece 0${idx + 1}: ${p.name}`}
                >
                  <span
                    className={cn(
                      'font-mono text-[11px]',
                      isCurrent ? 'text-[var(--acc)] font-bold' : 'text-[var(--muted)]'
                    )}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className="w-2.5 h-2.5 border border-black/20 shrink-0"
                    style={{ backgroundColor: p.swatch }}
                  />
                  <span className="truncate max-w-[120px] sm:max-w-none text-[11px]">
                    {p.name.replace(' Tee', '')}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right: Technical Guarantee & Brand Credential */}
          <div className="flex items-center justify-between sm:justify-end gap-6 text-xs font-mono shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--hairline)] text-[var(--ink)]/75">
            <span className="hidden lg:inline-block">
              260 GSM COMBED COTTON • OVERSIZED BOXY FIT
            </span>
            <span className="label-caps text-[var(--acc-on-bone)] font-semibold flex items-center gap-1.5">
              <span>LAGOS FULFILLMENT</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
