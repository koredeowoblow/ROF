import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'motion/react'
import { ArrowRight, Compass, Shield, Flame, Sparkles, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiamondMark, Logo } from '@/components/Logo'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'

interface HeroStageProps {
  className?: string
}

type PillarKey = 'ambition' | 'confidence' | 'originality'

interface PillarInfo {
  number: string
  label: string
  title: string
  creed: string
}

const PILLARS: Record<PillarKey, PillarInfo> = {
  ambition: {
    number: '01',
    label: 'AMBITION',
    title: 'The Relentless Drive',
    creed: 'We do not wait for permission. We build through the noise and relentlessly pursue what was destined for us.',
  },
  confidence: {
    number: '02',
    label: 'CONFIDENCE',
    title: 'The Diamond Mindset',
    creed: 'Pressure does not break us; it refines us. Cut sharp with precision and worn with unwavering pride.',
  },
  originality: {
    number: '03',
    label: 'ORIGINALITY',
    title: 'Building Your Legacy',
    creed: 'Heavyweight intention woven into every fiber. Built for those creating something that outlives them.',
  },
}

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()
  const [activePillar, setActivePillar] = useState<PillarKey>('confidence')
  const [lagosTime, setLagosTime] = useState<string>('12:00:00')
  const [isTouch, setIsTouch] = useState(true)
  const [isHeadlineHovered, setIsHeadlineHovered] = useState(false)

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

  // Silky smooth mouse tracking normalized to [-0.5, 0.5]
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 120, mass: 0.7 }
  const smoothX = useSpring(rawMouseX, springConfig)
  const smoothY = useSpring(rawMouseY, springConfig)

  // Subtle architectural parallax in depth
  const logoShiftX = useTransform(smoothX, [-0.5, 0.5], [16, -16])
  const logoShiftY = useTransform(smoothY, [-0.5, 0.5], [10, -10])
  const haloShiftX = useTransform(smoothX, [-0.5, 0.5], [-22, 22])
  const haloShiftY = useTransform(smoothY, [-0.5, 0.5], [-16, 16])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || prefersReduced || !stageRef.current) return
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

  const currentPillar = PILLARS[activePillar]

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
      {/* 1. CINEMATIC ATMOSPHERE: VOLUMETRIC STUDIO APEX */}
      {/* ============================================================ */}
      <motion.div
        style={{
          x: isTouch || prefersReduced ? 0 : haloShiftX,
          y: isTouch || prefersReduced ? 0 : haloShiftY,
          background:
            activePillar === 'ambition'
              ? 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(27,56,43,0.38) 0%, rgba(236,230,216,0.08) 45%, transparent 75%)'
              : activePillar === 'confidence'
              ? 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(229,55,45,0.22) 0%, rgba(236,230,216,0.1) 45%, transparent 75%)'
              : 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(236,230,216,0.2) 0%, rgba(229,55,45,0.08) 45%, transparent 75%)',
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1300px] h-[750px] pointer-events-none z-0 opacity-45 transition-all duration-1000"
      />

      {/* Deep ambient radial warmth */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] sm:w-[850px] h-[500px] sm:h-[850px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.06)_0%,transparent_65%)]" />
      </div>

      {/* ============================================================ */}
      {/* 2. TOP MASTHEAD TELEMETRY */}
      {/* ============================================================ */}
      <div className="relative z-20 mx-auto w-full max-w-[var(--max-content)] px-4 md:px-8 pt-2 sm:pt-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3.5 text-xs">
          {/* Brand Telemetry */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc)] opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--acc)]" />
            </span>
            <span className="label-caps text-[var(--bone)] tracking-[0.26em] font-semibold">
              ROF RAGE • ARCHIVE 01
            </span>
            <span className="hidden sm:inline-block text-[var(--hairline)]">/</span>
            <span className="hidden sm:inline-block font-mono text-xs text-[var(--muted)]">
              LAGOS • 6.4541° N, 3.4246° E
            </span>
          </div>

          {/* Interactive Identity Pillars Selector */}
          <div className="hidden md:flex items-center gap-1.5 bg-[var(--ink)]/85 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm shadow-xl">
            {(['ambition', 'confidence', 'originality'] as const).map((key) => {
              const p = PILLARS[key]
              const isActive = activePillar === key
              return (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePillar(key)}
                  className={cn(
                    'px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs flex items-center gap-1.5',
                    isActive
                      ? 'bg-[var(--acc)] text-[#fff6ec] font-bold shadow-md'
                      : 'text-[var(--muted)] hover:text-[var(--bone)] hover:bg-[var(--bone)]/5'
                  )}
                >
                  <span className={isActive ? 'text-[#fff6ec]' : 'text-[var(--acc)]'}>
                    {p.number}
                  </span>
                  <span className="text-[var(--hairline)]">•</span>
                  <span>{p.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Live Lagos Clock */}
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--bone)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
            <span className="tracking-wider">LAGOS {lagosTime} WAT</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MONUMENTAL SCULPTURAL WORDMARK (THE ARCHITECTURAL HERO) */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-8 sm:py-14 px-4 md:px-8">
        {/* Kinetic Wordmark Anchor with Restrained Luxury Parallax */}
        <motion.div
          style={{
            x: isTouch || prefersReduced ? 0 : logoShiftX,
            y: isTouch || prefersReduced ? 0 : logoShiftY,
          }}
          className="relative w-full max-w-[960px] flex items-center justify-center mb-6 sm:mb-8"
        >
          {/* SVG Animated Wordmark - Stroke-only, exact geometric concentric diamond */}
          <svg
            viewBox="0 0 280 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto text-[var(--bone)] overflow-visible drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)]"
            aria-label="ROF logo"
          >
            {/* 'R' */}
            <motion.path
              d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
              stroke={activePillar === 'ambition' ? 'var(--acc)' : 'currentColor'}
              strokeWidth={activePillar === 'ambition' ? '5.5' : '4.8'}
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: activePillar === 'ambition' ? 1 : 0.9 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* 'O' Outer Diamond Contour (Center: 140, 46 - Radius: 38) */}
            <motion.polygon
              points="140,8 178,46 140,84 102,46"
              stroke={activePillar === 'confidence' ? 'var(--acc)' : 'currentColor'}
              strokeWidth={activePillar === 'confidence' ? '5.5' : '4.8'}
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: activePillar === 'confidence' ? 1 : 0.95 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* 'O' Inner Concentric Accent Diamond (Radius: 20, exactly 18px clearance) */}
            <motion.polygon
              points="140,26 160,46 140,66 120,46"
              stroke="var(--acc)"
              strokeWidth="2.8"
              fill="rgba(229,55,45,0.08)"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: prefersReduced ? 0.85 : [0.75, 1, 0.75],
                scale: prefersReduced ? 1 : [1, 1.04, 1],
              }}
              transition={{
                pathLength: { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ originX: '140px', originY: '46px' }}
            />

            {/* 'F' */}
            <motion.path
              d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
              stroke={activePillar === 'originality' ? 'var(--acc)' : 'currentColor'}
              strokeWidth={activePillar === 'originality' ? '5.5' : '4.8'}
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: activePillar === 'originality' ? 1 : 0.9 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>

        {/* ============================================================ */}
        {/* 4. MONUMENTAL HEADLINE & BRAND STORY MANIFESTO */}
        {/* ============================================================ */}
        <div className="relative z-20 w-full max-w-3xl text-center flex flex-col items-center gap-4">
          {/* Masked Clip-Reveal Headline */}
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display text-[var(--bone)] leading-[0.9] tracking-tight cursor-default"
            >
              Destined for{' '}
              <motion.span
                onMouseEnter={() => setIsHeadlineHovered(true)}
                onMouseLeave={() => setIsHeadlineHovered(false)}
                animate={isHeadlineHovered ? { scale: 1.04 } : { scale: 1 }}
                className="italic font-serif text-[var(--acc)] inline-block transition-transform duration-200"
              >
                riches.
              </motion.span>
            </motion.h1>
          </div>

          {/* Staggered Manifesto Prose */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg font-sans text-[var(--bone)]/85 max-w-xl leading-relaxed font-normal"
          >
            ROF stands for ambition, confidence and originality. It is built for people who stay focused on their goals, never settle for less, and wear it with pride because it represents something bigger than themselves.
          </motion.p>

          {/* Active Pillar Creed with Interactive Reveal */}
          <div className="h-9 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5 text-xs font-mono text-[var(--acc)] uppercase tracking-widest font-semibold"
              >
                <DiamondMark size={6} accent filled />
                <span>{currentPillar.title}</span>
                <span className="text-[var(--hairline)]">•</span>
                <span className="text-[var(--bone)]/75 normal-case font-sans">
                  {currentPillar.creed}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Hub: Enter Collection & Story */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
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
                className="w-full sm:w-auto uppercase tracking-wider text-xs font-semibold px-8 py-4 cursor-pointer shadow-xl hover:shadow-[0_8px_30px_rgba(229,55,45,0.35)] transition-shadow"
              >
                Witness The Capsule
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/story"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 border border-[var(--hairline)] hover:border-[var(--bone)] text-xs font-mono uppercase tracking-wider text-[var(--bone)] transition-colors bg-[var(--ink)]/80 backdrop-blur-md hover:bg-[var(--bone)]/5"
              >
                Read Full Brand Story
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. FULL-WIDTH BONE CREDENTIAL BAND (THE 30% BONE GROUND) */}
      {/* ============================================================ */}
      <div
        data-tone="bone"
        className="relative z-30 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)] px-4 md:px-8 py-3.5"
      >
        <div className="mx-auto max-w-[var(--max-content)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3 font-semibold">
            <span className="text-[var(--acc-on-bone)]">ROF RAGE</span>
            <span>AMBITION</span>
            <DiamondMark size={5} accent filled />
            <span>CONFIDENCE</span>
            <DiamondMark size={5} accent filled />
            <span>ORIGINALITY</span>
          </div>

          <div className="flex items-center gap-4 text-[var(--ink)]/75">
            <span className="hidden md:inline-block">260 GSM HEAVYWEIGHT DRAPE</span>
            <span className="font-serif italic text-sm text-[var(--acc-on-bone)] font-bold">
              Destined for riches.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
