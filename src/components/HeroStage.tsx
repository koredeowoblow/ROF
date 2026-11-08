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

type PillarKey = 'ambition' | 'mindset' | 'greatness'

interface PillarInfo {
  letter: string
  roman: string
  title: string
  label: string
  creed: string
}

const PILLARS: Record<PillarKey, PillarInfo> = {
  ambition: {
    letter: 'R',
    roman: '01',
    label: 'AMBITION',
    title: 'The Relentless Drive',
    creed: 'We do not wait for permission. We build through the noise and relentlessly pursue what was destined for us.',
  },
  mindset: {
    letter: 'O',
    roman: '02',
    label: 'THE MINDSET',
    title: 'The Diamond Core',
    creed: 'Pressure does not break us; it refines us. Cut sharp with precision, unbroken by circumstance.',
  },
  greatness: {
    letter: 'F',
    roman: '03',
    label: 'GREATNESS',
    title: 'Building Your Legacy',
    creed: 'Heavyweight intention woven into every action. Made for those building something bigger than themselves.',
  },
}

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()
  const [activePillar, setActivePillar] = useState<PillarKey>('mindset')
  const [isTouch, setIsTouch] = useState(true)
  const [lagosTime, setLagosTime] = useState<string>('12:00:00')

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

  const springConfig = { damping: 26, stiffness: 140, mass: 0.6 }
  const smoothX = useSpring(rawMouseX, springConfig)
  const smoothY = useSpring(rawMouseY, springConfig)

  // 3D Perspective Transformations for the kinetic diamond vault
  const vaultRotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14])
  const vaultRotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16])
  const vaultTranslateX = useTransform(smoothX, [-0.5, 0.5], [-24, 24])
  const vaultTranslateY = useTransform(smoothY, [-0.5, 0.5], [-18, 18])

  // Parallax for Monumental Letters in depth
  const lettersShiftX = useTransform(smoothX, [-0.5, 0.5], [32, -32])
  const lettersShiftY = useTransform(smoothY, [-0.5, 0.5], [20, -20])

  // Parallax for Diamond rings (counter-rotation)
  const ringRotate = useTransform(smoothX, [-0.5, 0.5], [-12, 12])

  // Dynamic Contact Shadow
  const shadowSkewX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.94, 1.06])

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
      {/* 1. ATMOSPHERIC VOLUMETRIC STUDIO LIGHTING */}
      {/* ============================================================ */}
      {/* Overhead dramatic spotlight cone casting onto the diamond core */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1300px] h-[800px] pointer-events-none z-0 opacity-40 transition-all duration-1000"
        style={{
          background:
            activePillar === 'mindset'
              ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(229,55,45,0.25) 0%, rgba(236,230,216,0.12) 40%, transparent 75%)'
              : activePillar === 'ambition'
              ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(27,56,43,0.4) 0%, rgba(236,230,216,0.1) 40%, transparent 75%)'
              : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(236,230,216,0.22) 0%, rgba(229,55,45,0.1) 40%, transparent 75%)',
        }}
      />

      {/* Deep Ambient Warmth Halo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.09)_0%,transparent_65%)]" />
      </div>

      {/* ============================================================ */}
      {/* 2. TOP TELEMETRY MASTHEAD */}
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
              ROF RAGE • THE ARCHIVE
            </span>
            <span className="hidden sm:inline-block text-[var(--hairline)]">/</span>
            <span className="hidden sm:inline-block font-mono text-xs text-[var(--muted)]">
              LAGOS • 6.4541° N, 3.4246° E
            </span>
          </div>

          {/* Identity Pillars Navigator */}
          <div className="hidden md:flex items-center gap-1.5 bg-[var(--ink)]/80 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm">
            {(['ambition', 'mindset', 'greatness'] as const).map((key) => {
              const p = PILLARS[key]
              const isActive = activePillar === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePillar(key)}
                  className={cn(
                    'px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs flex items-center gap-1.5',
                    isActive
                      ? 'bg-[var(--acc)] text-[#fff6ec] font-bold shadow-md'
                      : 'text-[var(--muted)] hover:text-[var(--bone)]'
                  )}
                >
                  <span>{p.letter}</span>
                  <span className="text-[var(--hairline)]">•</span>
                  <span>{p.label.split(' • ')[1] || p.label}</span>
                </button>
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
      {/* 3. CENTERPIECE: THE KINETIC DIAMOND INSTALLATION (NO CLOTH) */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-8 sm:py-12 px-4 md:px-8">
        {/* Kinetic Vault 3D Viewport */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-2xl flex flex-col items-center justify-center min-h-[340px] sm:min-h-[460px]"
        >
          {/* Monumental Letters 'R' and 'F' flanking the central Diamond */}
          <motion.div
            style={{
              x: isTouch || prefersReduced ? 0 : lettersShiftX,
              y: isTouch || prefersReduced ? 0 : lettersShiftY,
            }}
            className="absolute inset-0 flex items-center justify-between pointer-events-none z-0 px-2 sm:px-8 opacity-25 sm:opacity-35"
            aria-hidden="true"
          >
            {/* Monumental 'R' */}
            <motion.svg
              viewBox="0 0 90 90"
              className="w-24 sm:w-44 md:w-56 h-auto text-[var(--bone)] overflow-visible"
              fill="none"
            >
              <motion.path
                d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
                stroke={activePillar === 'ambition' ? 'var(--acc)' : 'currentColor'}
                strokeWidth={activePillar === 'ambition' ? '6' : '4.5'}
                strokeLinecap="square"
                strokeLinejoin="miter"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>

            {/* Monumental 'F' */}
            <motion.svg
              viewBox="0 0 90 90"
              className="w-24 sm:w-44 md:w-56 h-auto text-[var(--bone)] overflow-visible"
              fill="none"
            >
              <motion.path
                d="M 20,82 L 20,10 L 80,10 M 20,46 L 68,46"
                stroke={activePillar === 'greatness' ? 'var(--acc)' : 'currentColor'}
                strokeWidth={activePillar === 'greatness' ? '6' : '4.5'}
                strokeLinecap="square"
                strokeLinejoin="miter"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>
          </motion.div>

          {/* The Kinetic Diamond Installation (Precision Sacred Geometry) */}
          <motion.div
            style={{
              rotateX: isTouch || prefersReduced ? 0 : vaultRotateX,
              rotateY: isTouch || prefersReduced ? 0 : vaultRotateY,
              x: isTouch || prefersReduced ? 0 : vaultTranslateX,
              y: isTouch || prefersReduced ? 0 : vaultTranslateY,
              transformStyle: 'preserve-3d',
            }}
            animate={
              prefersReduced
                ? undefined
                : {
                    y: [0, -14, 0],
                  }
            }
            transition={
              prefersReduced
                ? undefined
                : {
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
            className="relative z-10 flex flex-col items-center justify-center w-full max-w-[420px] sm:max-w-[480px] h-[340px] sm:h-[440px]"
          >
            {/* Multi-Layered Rotating Diamond Cage */}
            <motion.svg
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-[var(--bone)] overflow-visible drop-shadow-[0_24px_48px_rgba(0,0,0,0.8)]"
            >
              {/* Outer Subtle Orbit Ring */}
              <circle
                cx="200"
                cy="200"
                r="185"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 8"
                opacity="0.25"
              />

              {/* Layer 1: Outermost Diamond Frame */}
              <motion.polygon
                points="200,20 380,200 200,380 20,200"
                stroke="currentColor"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Layer 2: Intermediate Architectural Diamond (Slightly counter-rotated) */}
              <motion.polygon
                points="200,55 345,200 200,345 55,200"
                stroke="currentColor"
                strokeWidth="2.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Layer 3: Main Bold Diamond Contour */}
              <motion.polygon
                points="200,90 310,200 200,310 90,200"
                stroke={activePillar === 'mindset' ? 'var(--acc)' : 'currentColor'}
                strokeWidth="4"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: activePillar === 'mindset' ? 0.95 : 0.75,
                }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Layer 4: Concentric Inner Rage Red Core - The Brand Heartbeat */}
              <motion.polygon
                points="200,135 265,200 200,265 135,200"
                stroke="var(--acc)"
                strokeWidth="3.2"
                fill="rgba(229, 55, 45, 0.08)"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: prefersReduced ? 0.8 : [0.65, 1, 0.65],
                  scale: prefersReduced ? 1 : [1, 1.06, 1],
                }}
                transition={{
                  pathLength: { duration: 1, delay: 0.35 },
                  opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                }}
              />

              {/* Innermost Brilliant Diamond Sparkle */}
              <polygon
                points="200,170 230,200 200,230 170,200"
                fill="var(--acc)"
                opacity="0.9"
              />

              {/* Cardinal Alignment Ticks */}
              <line x1="200" y1="5" x2="200" y2="25" stroke="var(--acc)" strokeWidth="2" />
              <line x1="395" y1="200" x2="375" y2="200" stroke="var(--acc)" strokeWidth="2" />
              <line x1="200" y1="395" x2="200" y2="375" stroke="var(--acc)" strokeWidth="2" />
              <line x1="5" y1="200" x2="25" y2="200" stroke="var(--acc)" strokeWidth="2" />
            </motion.svg>

            {/* Dynamic Ground Shadow */}
            <motion.div
              style={{
                skewX: isTouch || prefersReduced ? 0 : shadowSkewX,
                scaleX: isTouch || prefersReduced ? 1 : shadowScale,
              }}
              animate={
                prefersReduced
                  ? undefined
                  : {
                      scaleX: [1, 0.92, 1],
                      opacity: [0.65, 0.45, 0.65],
                    }
              }
              transition={
                prefersReduced
                  ? undefined
                  : {
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
              className="w-56 sm:w-80 h-4.5 bg-black/85 rounded-full blur-[14px] -mt-4 pointer-events-none"
            />
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* 4. MONUMENTAL HEADLINE & BRAND STORY MANIFESTO */}
        {/* ============================================================ */}
        <div className="relative z-20 w-full max-w-4xl text-center mt-4 sm:mt-6 flex flex-col items-center gap-4">
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display text-[var(--bone)] leading-[0.9] tracking-tight"
            >
              Destined for{' '}
              <span className="italic font-serif text-[var(--acc)]">
                riches.
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg font-sans text-[var(--bone)]/85 max-w-2xl leading-relaxed"
          >
            ROF stands for ambition, confidence and originality. It is built for people who stay focused on their goals, never settle for less, and wear it with pride because it represents something bigger than themselves.
          </motion.p>

          {/* Active Pillar Creed */}
          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5 text-xs font-mono text-[var(--acc)] uppercase tracking-widest font-semibold"
              >
                <DiamondMark size={7} accent filled />
                <span>{currentPillar.title}</span>
                <span className="text-[var(--hairline)]">•</span>
                <span className="text-[var(--bone)]/75 normal-case font-sans">
                  {currentPillar.creed}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Actions: Exploration & Story (Point of Attraction, Not Sales) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3.5 pt-3"
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
              className="uppercase tracking-wider text-xs font-semibold px-8 py-4 cursor-pointer shadow-2xl"
            >
              Witness The Capsule
            </Button>

            <Link
              to="/story"
              className="inline-flex items-center justify-center px-6 py-4 border border-[var(--hairline)] hover:border-[var(--bone)] text-xs font-mono uppercase tracking-wider text-[var(--bone)] transition-colors bg-[var(--ink)]/80 backdrop-blur-md"
            >
              Read Full Brand Story
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. FULL-WIDTH BONE CREDENTIAL BAND (THE 30% BONE REQUIREMENT) */}
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
            <span className="hidden md:inline-block">ROOF OF FAME ARCHIVE</span>
            <span className="font-serif italic text-sm text-[var(--acc-on-bone)] font-bold">
              Destined for riches.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
