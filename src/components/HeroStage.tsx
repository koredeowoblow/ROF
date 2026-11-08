import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'motion/react'
import { ArrowRight, Compass, Shield, Flame, Sparkles, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { TeeCutout } from '@/components/TeeCutout'
import { DiamondMark, Logo } from '@/components/Logo'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'

interface HeroStageProps {
  className?: string
}

type PillarKey = 'ambition' | 'mindset' | 'greatness'

interface PillarInfo {
  letter: string
  label: string
  title: string
  manifesto: string
}

const PILLARS: Record<PillarKey, PillarInfo> = {
  ambition: {
    letter: 'R',
    label: 'R • AMBITION',
    title: 'The Journey to Becoming Somebody',
    manifesto: 'We do not wait for permission. We build through the noise and pursue what was destined for us.',
  },
  mindset: {
    letter: 'O',
    label: 'O • THE MINDSET',
    title: 'The Diamond Mindset',
    manifesto: 'Pressure does not break us; it refines us. Cut sharp with precision and worn with unwavering pride.',
  },
  greatness: {
    letter: 'F',
    label: 'F • GREATNESS',
    title: 'Building Your Legacy',
    manifesto: 'Heavyweight intention woven into every fiber. Wear it because it represents something bigger.',
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

  const springConfig = { damping: 26, stiffness: 150, mass: 0.55 }
  const smoothX = useSpring(rawMouseX, springConfig)
  const smoothY = useSpring(rawMouseY, springConfig)

  // 3D Perspective Transformations for the center suspended garment
  const garmentRotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8])
  const garmentRotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const garmentTranslateX = useTransform(smoothX, [-0.5, 0.5], [-16, 16])
  const garmentTranslateY = useTransform(smoothY, [-0.5, 0.5], [-12, 12])

  // Parallax for Background Monumental Letters
  const lettersShiftX = useTransform(smoothX, [-0.5, 0.5], [24, -24])
  const lettersShiftY = useTransform(smoothY, [-0.5, 0.5], [14, -14])

  // Dynamic Contact Shadow
  const shadowSkewX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const shadowScale = useTransform(smoothY, [-0.5, 0.5], [0.93, 1.07])

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
      {/* 1. ATMOSPHERIC STUDIO ENVIRONMENT & RADIAL COLOR DEPTH */}
      {/* ============================================================ */}
      {/* Overhead stage spotlight beam */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[720px] pointer-events-none z-0 opacity-40 transition-all duration-700"
        style={{
          background:
            activePillar === 'mindset'
              ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(229,55,45,0.22) 0%, rgba(236,230,216,0.12) 35%, transparent 75%)'
              : activePillar === 'ambition'
              ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(27,56,43,0.35) 0%, rgba(236,230,216,0.1) 35%, transparent 75%)'
              : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(236,230,216,0.22) 0%, rgba(229,55,45,0.08) 35%, transparent 75%)',
        }}
      />

      {/* Subtle radial ambient warmth behind center garment */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[420px] sm:w-[680px] h-[420px] sm:h-[680px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.08)_0%,transparent_68%)]" />
      </div>

      {/* ============================================================ */}
      {/* 2. MONUMENTAL ARCHITECTURAL R - O - F KINETIC BACKDROP */}
      {/* ============================================================ */}
      <motion.div
        style={{
          x: isTouch || prefersReduced ? 0 : lettersShiftX,
          y: isTouch || prefersReduced ? 0 : lettersShiftY,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-4"
        aria-hidden="true"
      >
        <div className="w-full max-w-[1120px] flex items-center justify-center opacity-30 sm:opacity-35 transition-all duration-300">
          <svg
            viewBox="0 0 280 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto text-[var(--bone)] overflow-visible"
          >
            {/* Monumental 'R' (Ambition) */}
            <motion.path
              d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
              stroke={activePillar === 'ambition' ? 'var(--acc)' : 'currentColor'}
              strokeWidth={activePillar === 'ambition' ? '6' : '5'}
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: activePillar === 'ambition' ? 0.95 : 0.45,
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Monumental Diamond 'O' Outer Contour (Originality) */}
            <motion.polygon
              points="140,8 178,46 140,84 102,46"
              stroke={activePillar === 'mindset' ? 'var(--acc)' : 'currentColor'}
              strokeWidth={activePillar === 'mindset' ? '6' : '5'}
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: activePillar === 'mindset' ? 0.95 : 0.5,
              }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Concentric Inner Diamond Accent Core - Pulsing Rage Red */}
            <motion.polygon
              points="140,26 160,46 140,66 120,46"
              stroke="var(--acc)"
              strokeWidth="3.2"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: prefersReduced ? 0.8 : [0.6, 1, 0.6],
                scale: prefersReduced ? 1 : [1, 1.05, 1],
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
              stroke={activePillar === 'greatness' ? 'var(--acc)' : 'currentColor'}
              strokeWidth={activePillar === 'greatness' ? '6' : '5'}
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: activePillar === 'greatness' ? 0.95 : 0.45,
              }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* 3. TOP TELEMETRY STRIP */}
      {/* ============================================================ */}
      <div className="relative z-20 mx-auto w-full max-w-[var(--max-content)] px-4 md:px-8 pt-3">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3.5 text-xs">
          {/* Left: Brand Telemetry */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc)] opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--acc)]" />
            </span>
            <span className="label-caps text-[var(--bone)] tracking-[0.24em] font-semibold">
              ROF RAGE • Lagos
            </span>
            <span className="hidden sm:inline-block text-[var(--hairline)]">/</span>
            <span className="hidden sm:inline-block font-mono text-xs text-[var(--muted)]">
              LAT 6.4541° N, LON 3.4246° E
            </span>
          </div>

          {/* Center: Interactive Identity Pillars */}
          <div className="hidden md:flex items-center gap-2 bg-[var(--ink)]/80 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm">
            {(['ambition', 'mindset', 'greatness'] as const).map((key) => {
              const p = PILLARS[key]
              const isActive = activePillar === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePillar(key)}
                  className={cn(
                    'px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs',
                    isActive
                      ? 'bg-[var(--acc)] text-[#fff6ec] font-bold shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--bone)]'
                  )}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Right: Live Lagos Time */}
          <div className="flex items-center gap-2.5 font-mono text-xs text-[var(--bone)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
            <span className="tracking-wider">LAGOS {lagosTime} WAT</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. MAIN CENTRAL SPECTACLE: SUSPENDED ARTIFACT & MANIFESTO */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-6 sm:py-8 px-4 md:px-8">
        {/* Floating Garment Viewport with 3D Physics */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-xl flex flex-col items-center justify-center min-h-[360px] sm:min-h-[460px]"
        >
          {/* Garment 3D Tilt Wrapper */}
          <motion.div
            style={{
              rotateX: isTouch || prefersReduced ? 0 : garmentRotateX,
              rotateY: isTouch || prefersReduced ? 0 : garmentRotateY,
              x: isTouch || prefersReduced ? 0 : garmentTranslateX,
              y: isTouch || prefersReduced ? 0 : garmentTranslateY,
              transformStyle: 'preserve-3d',
            }}
            animate={
              prefersReduced
                ? undefined
                : {
                    y: [0, -15, 0],
                    rotateZ: [-0.9, 0.9, -0.9],
                  }
            }
            transition={
              prefersReduced
                ? undefined
                : {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                }
            className="relative z-10 flex flex-col items-center justify-center w-full"
          >
            {/* The Floating Heavyweight Streetwear Artifact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center"
            >
              <TeeCutout
                design="cards"
                colour="forest-green"
                view="full"
                withDiamondAccent={false}
                className="w-auto max-h-[350px] sm:max-h-[460px] md:max-h-[500px] drop-shadow-[0_42px_56px_rgba(0,0,0,0.85)]"
              />
            </motion.div>

            {/* Dynamic Ground Contact Shadow */}
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
                      opacity: [0.7, 0.45, 0.7],
                    }
              }
              transition={
                prefersReduced
                  ? undefined
                  : {
                      duration: 5.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
              className="w-64 sm:w-92 h-5 bg-black/90 rounded-full blur-[14px] -mt-1 pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Central Editorial Narrative & Story Headline */}
        <div className="relative z-20 w-full max-w-4xl text-center mt-2 sm:mt-4 flex flex-col items-center gap-4">
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-[var(--bone)] leading-[0.92] tracking-tight"
            >
              More than clothing.{' '}
              <span className="italic font-serif text-[var(--acc)] block sm:inline">
                A mindset.
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base font-sans text-[var(--bone)]/80 max-w-xl leading-relaxed"
          >
            ROF stands for ambition, confidence and originality. Built for people who stay focused on their goals, never settle for less, and wear it with pride because it represents something bigger than themselves.
          </motion.p>

          {/* Active Pillar Story Manifestation */}
          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-xs font-mono text-[var(--acc)] uppercase tracking-widest font-semibold"
              >
                <DiamondMark size={6} accent filled />
                <span>{currentPillar.title}</span>
                <span className="text-[var(--hairline)]">•</span>
                <span className="text-[var(--bone)]/70 normal-case font-sans">
                  {currentPillar.manifesto}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Invitation Actions: Story & Collection */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-2"
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
              className="uppercase tracking-wider text-xs font-semibold px-8 py-4 cursor-pointer shadow-xl"
            >
              Witness The Collection
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
      {/* 5. FULL-WIDTH BONE CREDENTIAL TAPE (THE 30% BONE COMPONENT) */}
      {/* ============================================================ */}
      <div
        data-tone="bone"
        className="relative z-30 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)] px-4 md:px-8 py-3.5"
      >
        <div className="mx-auto max-w-[var(--max-content)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3 font-semibold">
            <span className="text-[var(--acc-on-bone)]">R • O • F</span>
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
