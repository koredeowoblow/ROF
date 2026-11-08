import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'motion/react'
import { ArrowRight, Compass, Shield, Flame, Sparkles } from 'lucide-react'
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
  title: string
  subtitle: string
  manifesto: string
  quote: string
}

const PILLARS: Record<PillarKey, PillarInfo> = {
  ambition: {
    letter: 'R',
    title: 'Ambition & Drive',
    subtitle: 'The Journey to Becoming Somebody',
    manifesto:
      'We do not wait for permission. We build through the noise, stay relentless in our craft, and relentlessly pursue what was destined for us.',
    quote: 'Never settle for less than your potential.',
  },
  mindset: {
    letter: 'O',
    title: 'The Diamond Mindset',
    subtitle: 'Unbreakable & Original',
    manifesto:
      'Pressure does not break us; it refines us. Cut sharp with precision and pride, the diamond is our permanent mark of resilience.',
    quote: 'Destined for riches.',
  },
  greatness: {
    letter: 'F',
    title: 'Legacy & Greatness',
    subtitle: 'Building Something Bigger',
    manifesto:
      'Clothing that carries weight, intention, and history. You wear ROF not to blend into the room, but to declare your purpose.',
    quote: 'Wear it with pride.',
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

  const springConfig = { damping: 24, stiffness: 160, mass: 0.5 }
  const smoothX = useSpring(rawMouseX, springConfig)
  const smoothY = useSpring(rawMouseY, springConfig)

  // 3D Perspective Transformations for the suspended brand artifact
  const garmentRotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8])
  const garmentRotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const garmentTranslateX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const garmentTranslateY = useTransform(smoothY, [-0.5, 0.5], [-10, 10])

  // Parallax for Monumental Background Letters
  const lettersShiftX = useTransform(smoothX, [-0.5, 0.5], [26, -26])
  const lettersShiftY = useTransform(smoothY, [-0.5, 0.5], [16, -16])

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
      className={cn(
        'relative w-full border-b border-[var(--hairline)] overflow-hidden select-none',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 60-30-10 DUAL PANE STORYTELLING ARCHITECTURE */}
      {/* LEFT PANE (BONE ~35% / 5 COLS): THE BRAND MANIFESTO */}
      {/* RIGHT PANE (INK ~65% / 7 COLS): THE MONUMENTAL SPECTACLE STAGE */}
      {/* ============================================================ */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[92svh]">
        {/* ============================================================ */}
        {/* LEFT PANE (BONE ~35% / 5 COLS): STORY, IDENTITY & MANIFESTO */}
        {/* ============================================================ */}
        <motion.div
          data-tone="bone"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
          className="relative lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[var(--bone)] text-[var(--ink)] border-b lg:border-b-0 lg:border-r border-[var(--hairline)] order-2 lg:order-1"
        >
          {/* Top: Brand Signal & Lagos Time */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="flex items-center justify-between border-b border-[var(--hairline)] pb-4 text-xs font-mono"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc-on-bone)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--acc-on-bone)]" />
              </span>
              <span className="label-caps text-[var(--ink)] font-semibold tracking-[0.24em]">
                ROF RAGE • Lagos
              </span>
            </div>

            <div className="flex items-center gap-2 text-[var(--ink)]/80">
              <span className="text-[11px] font-mono tracking-wider">
                LAGOS {lagosTime} WAT
              </span>
            </div>
          </motion.div>

          {/* Center: Monumental Brand Story Manifesto */}
          <div className="my-auto py-8 sm:py-12 flex flex-col gap-6">
            {/* The Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -16 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              className="flex items-center gap-2"
            >
              <DiamondMark size={9} accent filled />
              <span className="label-caps text-[var(--acc-on-bone)] tracking-[0.28em] font-bold">
                THE ROF MINDSET
              </span>
            </motion.div>

            {/* Monumental Headline */}
            <div className="overflow-hidden">
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display text-[var(--ink)] leading-[0.92] tracking-tight"
              >
                More than clothing.{' '}
                <span className="italic font-serif text-[var(--acc-on-bone)] block sm:inline">
                  A mindset.
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="mt-4 text-sm sm:text-base font-sans text-[var(--ink)]/85 leading-relaxed max-w-md"
              >
                ROF stands for ambition, confidence and originality. It is built for people who stay focused on their goals, never settle for less, and wear it with pride because it represents something bigger than themselves.
              </motion.p>
            </div>

            {/* Dynamic Interactive Pillar Story Box */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.98 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
              }}
              className="border-t border-b border-[var(--hairline)] py-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--acc-on-bone)] uppercase tracking-wider font-bold">
                  PILLAR • {currentPillar.letter}
                </span>
                <span className="text-xs font-serif italic text-[var(--acc-on-bone)]">
                  {currentPillar.quote}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillar}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] block">
                    {currentPillar.title}
                  </span>
                  <p className="text-xs font-sans text-[var(--ink)]/75 mt-1 leading-normal">
                    {currentPillar.manifesto}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Story & Attraction Actions */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
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
                className="w-full sm:w-auto uppercase tracking-wider text-xs font-semibold px-6 py-4 cursor-pointer shadow-lg"
              >
                Witness The Collection
              </Button>

              <Link
                to="/story"
                className="inline-flex items-center justify-center px-4 py-3.5 border border-[var(--hairline)] hover:border-[var(--ink)] text-xs font-mono uppercase tracking-wider text-[var(--ink)] transition-all hover:bg-[rgba(12,11,10,0.04)]"
              >
                Read Full Story
              </Link>
            </motion.div>
          </div>

          {/* Bottom: Permanent Tagline Credential */}
          <div className="border-t border-[var(--hairline)] pt-4 flex items-center justify-between text-xs font-mono text-[var(--ink)]/75">
            <span className="font-serif italic text-sm text-[var(--ink)]">
              Destined for riches.
            </span>
            <span className="text-[var(--acc-on-bone)] font-semibold uppercase text-[11px] tracking-wider">
              Lagos Fashion Archive
            </span>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* RIGHT PANE (INK ~65% / 7 COLS): THE CINEMATIC SPECTACLE */}
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
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[620px] sm:w-[900px] h-[640px] pointer-events-none z-0 opacity-45"
            style={{
              background:
                activePillar === 'mindset'
                  ? 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(229,55,45,0.2) 0%, rgba(236,230,216,0.1) 40%, transparent 75%)'
                  : activePillar === 'ambition'
                  ? 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(27,56,43,0.35) 0%, rgba(236,230,216,0.1) 40%, transparent 75%)'
                  : 'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(236,230,216,0.22) 0%, rgba(229,55,45,0.08) 40%, transparent 75%)',
            }}
          />

          {/* Subtle Ambient Red Glow behind Garment */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] rounded-full bg-[radial-gradient(circle,rgba(229,55,45,0.09)_0%,transparent_68%)]" />
          </div>

          {/* 2. Monumental Architectural R - O - F Wordmark with Parallax */}
          <motion.div
            style={{
              x: isTouch || prefersReduced ? 0 : lettersShiftX,
              y: isTouch || prefersReduced ? 0 : lettersShiftY,
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-4"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 280 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[700px] text-[var(--bone)] overflow-visible opacity-35"
            >
              {/* 'R' Path: Ambition */}
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

              {/* 'O' Diamond Outer: Originality */}
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

              {/* 'O' Concentric Red Accent Core - The Heartbeat of the Brand */}
              <motion.polygon
                points="140,26 160,46 140,66 120,46"
                stroke="var(--acc)"
                strokeWidth="3.2"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: prefersReduced ? 0.8 : [0.65, 1, 0.65],
                  scale: prefersReduced ? 1 : [1, 1.05, 1],
                }}
                transition={{
                  pathLength: { duration: 1, delay: 0.3 },
                  opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                }}
              />

              {/* 'F' Path: Greatness */}
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
          </motion.div>

          {/* 3. Top Stage Strip: Interactive Pillar Switcher */}
          <div className="relative z-20 flex items-center justify-between border-b border-[var(--hairline)] pb-3">
            <div className="flex items-center gap-2">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--bone)] tracking-[0.24em] font-medium">
                Identity Pillars
              </span>
            </div>

            {/* Pillar Selector Pills */}
            <div className="flex items-center gap-1 bg-[var(--ink)]/85 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm shadow-xl">
              <button
                type="button"
                onClick={() => setActivePillar('ambition')}
                className={cn(
                  'px-3 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs',
                  activePillar === 'ambition'
                    ? 'bg-[var(--bone)] text-[var(--ink)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                R • Ambition
              </button>
              <button
                type="button"
                onClick={() => setActivePillar('mindset')}
                className={cn(
                  'px-3 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs',
                  activePillar === 'mindset'
                    ? 'bg-[var(--acc)] text-[#fff6ec] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                O • Mindset
              </button>
              <button
                type="button"
                onClick={() => setActivePillar('greatness')}
                className={cn(
                  'px-3 py-1 text-[10px] font-sans uppercase tracking-[0.2em] transition-all cursor-pointer rounded-xs',
                  activePillar === 'greatness'
                    ? 'bg-[var(--bone)] text-[var(--ink)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--bone)]'
                )}
              >
                F • Greatness
              </button>
            </div>
          </div>

          {/* 4. Massive Suspended Brand Relic (High-Fashion Cutout Stage) */}
          <div
            style={{ perspective: 1200 }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-6"
          >
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
                      y: [0, -16, 0],
                      rotateZ: [-1, 1, -1],
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
              {/* Suspended Brand Relic Silhouette */}
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
                  className="w-auto max-h-[380px] sm:max-h-[500px] md:max-h-[560px] drop-shadow-[0_42px_56px_rgba(0,0,0,0.85)]"
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
                className="w-64 sm:w-96 h-5 bg-black/90 rounded-full blur-[14px] -mt-1 pointer-events-none"
              />
            </motion.div>
          </div>

          {/* 5. Bottom Brand Creed Tape */}
          <div className="relative z-20 pt-4 border-t border-[var(--hairline)] flex items-center justify-between text-xs font-mono text-[var(--bone)]/75">
            <span className="flex items-center gap-2">
              <span className="text-[var(--acc)] font-bold">R • O • F</span>
              <span>Ambition. Confidence. Originality.</span>
            </span>

            <span className="hidden sm:inline-block text-[var(--muted)]">
              Destined for riches.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
