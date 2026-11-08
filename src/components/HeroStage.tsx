import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { ArrowRight, ShoppingBag, Eye, Sparkles, Check } from 'lucide-react'
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
  const [inspectMode, setInspectMode] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [shockwaves, setShockwaves] = useState<Array<{ id: number; x: number; y: number }>>([])
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
  const garmentRotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12])
  const garmentRotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15])
  const garmentTranslateX = useTransform(smoothX, [-0.5, 0.5], [-20, 20])
  const garmentTranslateY = useTransform(smoothY, [-0.5, 0.5], [-16, 16])

  // Parallax for Monumental Letters
  const lettersShiftX = useTransform(smoothX, [-0.5, 0.5], [24, -24])
  const lettersShiftY = useTransform(smoothY, [-0.5, 0.5], [14, -14])

  // Shadow displacement
  const shadowSkewX = useTransform(smoothX, [-0.5, 0.5], [-18, 18])
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.92, 1.08])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch(!window.matchMedia('(pointer: fine)').matches)
    }
  }, [])

  // Mouse move handler on the stage
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

  // Click shockwave ripple
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only fire if clicking on empty stage space
    if ((e.target as HTMLElement).closest('button, a, input')) return
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const id = Date.now()
    setShockwaves((prev) => [...prev.slice(-3), { id, x, y }])
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
      onClick={handleStageClick}
      data-tone="ink"
      className={cn(
        'relative min-h-[96svh] w-full flex flex-col justify-between pt-20 pb-0 px-4 md:px-8 border-b border-[var(--hairline)] grain-overlay overflow-hidden select-none cursor-default bg-[#0c0b0a]',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. INTERACTIVE EXPANDING DIAMOND SHOCKWAVES ON CLICK */}
      {/* ============================================================ */}
      {shockwaves.map((wave) => (
        <motion.div
          key={wave.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3.5, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          onAnimationComplete={() =>
            setShockwaves((prev) => prev.filter((w) => w.id !== wave.id))
          }
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: wave.x, top: wave.y }}
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            <polygon
              points="50,4 96,50 50,96 4,50"
              stroke="var(--acc)"
              strokeWidth="1.8"
            />
          </svg>
        </motion.div>
      ))}

      {/* ============================================================ */}
      {/* 2. ARCHITECTURAL MONUMENTAL "R • ◇ • F" WIREFRAME BACKDROP */}
      {/* ============================================================ */}
      <motion.div
        style={{
          x: lettersShiftX,
          y: lettersShiftY,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 680"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full max-w-[1600px] text-[#ece6d8] overflow-visible opacity-90"
        >
          {/* Subtle Grid Coordinates & Hairline Marks */}
          <line x1="80" y1="0" x2="80" y2="680" stroke="currentColor" strokeWidth="0.8" opacity="0.06" strokeDasharray="3 6" />
          <line x1="1360" y1="0" x2="1360" y2="680" stroke="currentColor" strokeWidth="0.8" opacity="0.06" strokeDasharray="3 6" />
          <line x1="0" y1="340" x2="1440" y2="340" stroke="currentColor" strokeWidth="0.8" opacity="0.06" strokeDasharray="3 6" />

          {/* ======================================================== */}
          {/* LETTER 'R' - MONUMENTAL WIREFRAME LEFT */}
          {/* ======================================================== */}
          <motion.path
            d="M 140,560 L 140,120 L 320,120 L 400,210 L 320,300 L 140,300 M 280,300 L 410,560"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.16 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* ======================================================== */}
          {/* '◇' (DIAMOND O) - ROTATING GEOMETRIC PORTAL CENTER */}
          {/* ======================================================== */}
          <g transform="translate(720, 340)">
            {/* Outer Slow-Rotating Dashed Coordinate Ring */}
            <motion.polygon
              points="0,-270 270,0 0,270 -270,0"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="4 8"
              opacity="0.14"
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            />

            {/* Main Outer Diamond Portal */}
            <motion.polygon
              points="0,-230 230,0 0,230 -230,0"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.22 }}
              transition={{ duration: 1.4, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Inner Red Laser Diamond Port */}
            <motion.polygon
              points="0,-140 140,0 0,140 -140,0"
              stroke="var(--acc)"
              strokeWidth="2.5"
              strokeLinejoin="miter"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.35, 0.75, 0.35],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Horizontal & Vertical Crosshair ticks */}
            <line x1="-300" y1="0" x2="-250" y2="0" stroke="var(--acc)" strokeWidth="1.5" opacity="0.6" />
            <line x1="250" y1="0" x2="300" y2="0" stroke="var(--acc)" strokeWidth="1.5" opacity="0.6" />
            <line x1="0" y1="-300" x2="0" y2="-250" stroke="var(--acc)" strokeWidth="1.5" opacity="0.6" />
            <line x1="0" y1="250" x2="0" y2="300" stroke="var(--acc)" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* ======================================================== */}
          {/* LETTER 'F' - MONUMENTAL WIREFRAME RIGHT */}
          {/* ======================================================== */}
          <motion.path
            d="M 1040,560 L 1040,120 L 1320,120 M 1040,280 L 1240,280"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.16 }}
            transition={{ duration: 1.4, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </motion.div>

      {/* ============================================================ */}
      {/* 3. STUDIO DOSSIER & CROP MARKS (TOP BAR) */}
      {/* ============================================================ */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--max-content)] pt-2 md:pt-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3 text-xs">
          {/* Left: Brand Coordinates */}
          <div className="flex items-center gap-3">
            <DiamondMark size={8} accent filled />
            <span className="label-caps text-[var(--acc)] tracking-[0.24em]">
              Collection 01
            </span>
            <span className="hidden sm:inline-block text-[var(--hairline)]">/</span>
            <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--muted)]">
              06°27'N 03°24'E • LAGOS
            </span>
          </div>

          {/* Right: Technical Silhouette Specs & Inspect Loupe Toggle */}
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="label-caps text-[var(--muted)] hidden md:inline-block">
              260 GSM Heavyweight Combed Cotton
            </span>

            <button
              type="button"
              onClick={() => setInspectMode(!inspectMode)}
              className={cn(
                'touch-target-48 flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-wider uppercase border transition-all cursor-pointer',
                inspectMode
                  ? 'border-[var(--acc)] bg-[var(--acc)] text-[#fff6ec]'
                  : 'border-[var(--hairline)] text-[var(--bone)]/85 hover:border-[var(--bone)]'
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{inspectMode ? 'Close Loupe' : 'Inspect Print'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. THE MAIN SHOWSTAGE: 3D SUSPENDED GARMENT & EDITORIAL TITLE */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 md:py-8 my-auto">
        {/* Floating Garment Viewport with 3D Tilt Inertia */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-2xl flex flex-col items-center justify-center min-h-[360px] sm:min-h-[460px] md:min-h-[500px]"
        >
          {/* Studio Framing Hairlines around the garment */}
          <div className="pointer-events-none absolute inset-x-8 sm:inset-x-16 inset-y-4 border border-[var(--hairline)]/30 border-dashed rounded-none z-0 flex flex-col justify-between p-3">
            <div className="flex justify-between text-[9px] font-mono text-[var(--muted)]/60 uppercase">
              <span>[ ROF-STUDIO-ARCHIVE ]</span>
              <span>[ REF {activeProduct.id.toUpperCase()} ]</span>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[var(--muted)]/60 uppercase">
              <span>[ BOX SILHOUETTE ]</span>
              <span>[ DROPPED SHOULDER ]</span>
            </div>
          </div>

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
                    rotateZ: [0, 1, 0, -1, 0],
                  }
                : undefined
            }
            transition={
              isTouch
                ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
            className="relative z-10 flex flex-col items-center justify-center w-full"
          >
            {/* Active Garment Cutout with Elastic Recoil Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -24 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setInspectMode(!inspectMode)}
                className="w-full flex justify-center cursor-pointer group"
                title="Click to toggle Print Inspection Loupe"
              >
                <TeeCutout
                  design={activeMeta.design}
                  colour={activeMeta.colour}
                  view={inspectMode ? 'closeup' : 'full'}
                  withDiamondAccent
                  className={cn(
                    'w-auto transition-transform duration-500 ease-out drop-shadow-[0_28px_36px_rgba(0,0,0,0.65)]',
                    inspectMode
                      ? 'max-h-[380px] sm:max-h-[480px] scale-110'
                      : 'max-h-[340px] sm:max-h-[440px] md:max-h-[480px] group-hover:scale-[1.03]'
                  )}
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
                scaleX: [1, 0.92, 1],
                opacity: [0.55, 0.35, 0.55],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-56 sm:w-80 h-3.5 bg-black/70 rounded-full blur-[10px] -mt-2 pointer-events-none"
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
              Heavyweight Streetwear • Ambition & Legacy
            </p>
          </div>

          {/* Quick Add / Piece Purchase Card on Stage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 bg-[var(--ink)]/90 backdrop-blur-md border border-[var(--hairline)] p-2 sm:p-2.5 shadow-xl"
          >
            <div className="text-left px-2">
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block">
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
      {/* 5. INTERACTIVE 5-PIECE ARCHIVAL GARMENT REEL (BOTTOM BAR) */}
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
                <motion.button
                  key={p.id}
                  type="button"
                  whileTap={{ scale: 0.94 }}
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
                </motion.button>
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
