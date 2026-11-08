import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'motion/react'
import { ArrowDown, Volume2, VolumeX, Shuffle, Sparkles, Compass } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'

interface HeroStageProps {
  className?: string
}

// ---------------------------------------------------------------------------
// TACTILE WEB AUDIO API SYNTHESIZER (Pure native audio, zero external files)
// ---------------------------------------------------------------------------
let globalAudioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!globalAudioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        globalAudioCtx = new AudioCtxClass()
      }
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume().catch(() => {})
    }
    return globalAudioCtx
  } catch {
    return null
  }
}

function playHapticSound(type: 'card' | 'dice' | 'shuffle' | 'click', enabled: boolean) {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    if (type === 'card') {
      // Crisp mechanical card flick (high-end playing card shuffle)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1100, now)
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04)

      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.04)
    } else if (type === 'dice') {
      // Heavy resin dice tumble and impact
      osc.type = 'sine'
      osc.frequency.setValueAtTime(460, now)
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.08)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.08)
    } else if (type === 'shuffle') {
      // Rapid 4-step deck riffling
      for (let i = 0; i < 4; i++) {
        const subOsc = ctx.createOscillator()
        const subGain = ctx.createGain()
        subOsc.type = 'triangle'
        const t = now + i * 0.028
        subOsc.frequency.setValueAtTime(800 + i * 160, t)
        subOsc.frequency.exponentialRampToValueAtTime(180, t + 0.025)
        subGain.gain.setValueAtTime(0.04, t)
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025)
        subOsc.connect(subGain)
        subGain.connect(ctx.destination)
        subOsc.start(t)
        subOsc.stop(t + 0.025)
      }
    } else if (type === 'click') {
      // Minimal luxury camera shutter / switch click
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1600, now)
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03)

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.03)
    }
  } catch {
    // Fail silently if browser blocks audio
  }
}

// ---------------------------------------------------------------------------
// 5 CARDS OF DESTINY DATA (Brand Mythos & Graphic Lore)
// ---------------------------------------------------------------------------
interface DestinyCard {
  id: number
  letter: 'R' | 'O' | 'F' | 'R' | 'G'
  code: string
  title: string
  subtitle: string
  creed: string
  rot: number
  xOffset: number
}

const DESTINY_CARDS: DestinyCard[] = [
  {
    id: 1,
    letter: 'R',
    code: '01 / DEAL',
    title: 'THE RELENTLESS DRIVE',
    subtitle: 'Ambition Unsettled',
    creed: 'We do not wait for permission. We build through the noise and pursue what was destined for us.',
    rot: -14,
    xOffset: -80,
  },
  {
    id: 2,
    letter: 'O',
    code: '02 / DIAMOND',
    title: 'THE DIAMOND MINDSET',
    subtitle: 'Confidence Under Pressure',
    creed: 'Pressure does not break us; it refines us into geometric sharpness. Cut sharp, worn with pride.',
    rot: -7,
    xOffset: -40,
  },
  {
    id: 3,
    letter: 'F',
    code: '03 / ROOF',
    title: 'THE ROOF OF FAME',
    subtitle: 'Originality & Craft',
    creed: 'The apex of ambition. 260 GSM heavyweight intention woven into every fiber for a lasting legacy.',
    rot: 0,
    xOffset: 0,
  },
  {
    id: 4,
    letter: 'R',
    code: '04 / ROLL',
    title: 'THE CALCULATED RISK',
    subtitle: 'Resilience In Motion',
    creed: 'Fortune favors those who stake everything on their vision. Roll the dice with unwavering grit.',
    rot: 7,
    xOffset: 40,
  },
  {
    id: 5,
    letter: 'G',
    code: '05 / HAND',
    title: 'THE WINNING HAND',
    subtitle: 'Destined For Riches',
    creed: 'Destiny is not chance; it is heavyweight execution. The winning hand was already written.',
    rot: 14,
    xOffset: 80,
  },
]

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  const [activeCardIndex, setActiveCardIndex] = useState<number>(2) // Center card 'F' default
  const [lagosTime, setLagosTime] = useState<string>('12:00:00')
  const [isTouch, setIsTouch] = useState(true)
  const [isShuffling, setIsShuffling] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [diceRolling, setDiceRolling] = useState(false)
  const [diceNumber, setDiceNumber] = useState<number>(5) // Signature 5 pips

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

  // Dynamic 3D Spatial Gyro Tilt
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  const springConfig = { damping: 28, stiffness: 120, mass: 0.6 }
  const smoothMouseX = useSpring(rawMouseX, springConfig)
  const smoothMouseY = useSpring(rawMouseY, springConfig)

  // Card Stage 3D rotations & parallax
  const stageRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [12, -12])
  const stageRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-16, 16])
  const stageTranslateZ = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 15])
  const spotlightX = useTransform(smoothMouseX, [-0.5, 0.5], [-80, 80])
  const spotlightY = useTransform(smoothMouseY, [-0.5, 0.5], [-60, 60])

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

  // Handle Card Select
  const handleSelectCard = useCallback(
    (index: number) => {
      setActiveCardIndex(index)
      playHapticSound('card', soundEnabled)
    },
    [soundEnabled]
  )

  // Handle Shuffle
  const handleShuffle = useCallback(() => {
    if (isShuffling) return
    setIsShuffling(true)
    playHapticSound('shuffle', soundEnabled)
    setTimeout(() => {
      setActiveCardIndex((prev) => (prev + 1) % DESTINY_CARDS.length)
      setIsShuffling(false)
    }, 450)
  }, [isShuffling, soundEnabled])

  // Handle Dice Roll
  const handleRollDice = useCallback(() => {
    if (diceRolling) return
    setDiceRolling(true)
    playHapticSound('dice', soundEnabled)
    setTimeout(() => {
      // High-stakes roll lands on 5 or 6 (Destined)
      const nextRoll = Math.random() > 0.4 ? 6 : 5
      setDiceNumber(nextRoll)
      setDiceRolling(false)
      playHapticSound('click', soundEnabled)
    }, 600)
  }, [diceRolling, soundEnabled])

  const currentCard = DESTINY_CARDS[activeCardIndex]

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
      {/* 1. CINEMATIC ATMOSPHERE: VOLUMETRIC SPOTLIGHT & BACKGROUND MARQUEE */}
      {/* ============================================================ */}
      <motion.div
        style={{
          x: isTouch || prefersReduced ? 0 : spotlightX,
          y: isTouch || prefersReduced ? 0 : spotlightY,
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1100px] h-[600px] pointer-events-none z-0 opacity-30 transition-opacity duration-700"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(229,55,45,0.25)_0%,rgba(236,230,216,0.06)_45%,transparent_70%)] blur-2xl" />
      </motion.div>

      {/* Massive Ghosted Background Marquee for Brutalist Depth */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none z-0 overflow-hidden opacity-[0.035] select-none">
        <div className="text-[14vw] font-display font-bold leading-none tracking-tighter whitespace-nowrap text-[var(--bone)]">
          ROOF OF FAME ◇ DESTINED FOR RICHES ◇ AMBITION ◇ CONFIDENCE ◇ ORIGINALITY
        </div>
        <div className="text-[14vw] font-display font-bold leading-none tracking-tighter whitespace-nowrap text-[var(--bone)] translate-x-[-12vw]">
          260 GSM HEAVYWEIGHT ◇ LAGOS RUNWAY 01 ◇ THE DIAMOND MINDSET ◇ NO PERMISSION
        </div>
      </div>

      {/* Crosshair Grid Markers at Corners */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none font-mono text-[10px] text-[var(--bone)]/40 flex items-center gap-1.5">
        <span className="text-[var(--acc)]">+</span>
        <span className="hidden sm:inline">VAULT PROTOCOL 01</span>
      </div>
      <div className="absolute top-4 right-4 z-20 pointer-events-none font-mono text-[10px] text-[var(--bone)]/40 flex items-center gap-1.5">
        <span className="hidden sm:inline">6.4541° N, 3.4246° E</span>
        <span className="text-[var(--acc)]">+</span>
      </div>

      {/* ============================================================ */}
      {/* 2. TOP MASTHEAD TELEMETRY */}
      {/* ============================================================ */}
      <div className="relative z-20 mx-auto w-full max-w-[var(--max-content)] px-4 md:px-8 pt-2 sm:pt-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3.5 text-xs">
          {/* Brand Telemetry */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc)] opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--acc)]" />
            </span>
            <span className="label-caps text-[var(--bone)] tracking-[0.24em] font-semibold text-[11px] sm:text-xs">
              ROF RAGE • ARCHIVE 01
            </span>
            <span className="hidden md:inline-block text-[var(--hairline)]">/</span>
            <span className="hidden md:inline-block font-mono text-[11px] text-[var(--muted)]">
              HEAVYWEIGHT STREETWEAR
            </span>
          </div>

          {/* Interactive Card/Pillar Quick Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-[var(--ink)]/90 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm shadow-xl">
            {DESTINY_CARDS.map((card, idx) => {
              const isActive = activeCardIndex === idx
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectCard(idx)}
                  className={cn(
                    'px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] transition-all cursor-pointer rounded-xs flex items-center gap-1.5',
                    isActive
                      ? 'bg-[var(--acc)] text-[#fff6ec] font-bold shadow-md'
                      : 'text-[var(--muted)] hover:text-[var(--bone)] hover:bg-[var(--bone)]/5'
                  )}
                >
                  <span className={isActive ? 'text-[#fff6ec]' : 'text-[var(--acc)]'}>
                    [{card.letter}]
                  </span>
                  <span>{card.code.split('/')[1].trim()}</span>
                </button>
              )
            })}
          </div>

          {/* Live Lagos Clock & Audio Toggle */}
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--bone)]">
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled
                setSoundEnabled(next)
                playHapticSound('click', next)
              }}
              title={soundEnabled ? 'Mute haptic audio' : 'Enable haptic audio'}
              className="flex items-center gap-1 px-2 py-1 border border-[var(--hairline)] hover:border-[var(--bone)]/60 text-[10px] uppercase tracking-wider text-[var(--bone)]/80 hover:text-[var(--bone)] cursor-pointer transition-colors bg-[var(--ink)]/70 rounded-xs"
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={12} className="text-[var(--acc)]" />
                  <span className="hidden sm:inline">AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={12} className="text-[var(--muted)]" />
                  <span className="hidden sm:inline">MUTED</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 pl-1 border-l border-[var(--hairline)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
              <span className="tracking-wider text-[11px] sm:text-xs">LAGOS {lagosTime} WAT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CENTERPIECE: KINETIC 3D "DECK OF DESTINY" & INTERACTIVE RED DIE */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-6 sm:py-10 px-4 md:px-8">
        {/* Sub-label banner */}
        <div className="flex items-center gap-2 mb-3 sm:mb-5">
          <span className="h-[1px] w-6 sm:w-10 bg-[var(--acc)]" />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[var(--acc)] font-bold">
            THE 5 PILLARS OF FAME // INTERACTIVE DECK
          </span>
          <span className="h-[1px] w-6 sm:w-10 bg-[var(--acc)]" />
        </div>

        {/* 3D Tilted Perspective Canvas */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-[680px] h-[220px] sm:h-[260px] md:h-[290px] flex items-center justify-center mb-4 sm:mb-6"
        >
          <motion.div
            style={{
              rotateX: isTouch || prefersReduced ? 0 : stageRotateX,
              rotateY: isTouch || prefersReduced ? 0 : stageRotateY,
              z: isTouch || prefersReduced ? 0 : stageTranslateZ,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Soft Ambient Contact Shadow under Card Fan */}
            <div className="absolute -bottom-6 w-3/4 h-8 bg-black/60 blur-xl rounded-full pointer-events-none" />

            {/* The 5 Tactile Playing Cards */}
            {DESTINY_CARDS.map((card, idx) => {
              const isSelected = activeCardIndex === idx
              const baseRot = card.rot
              const baseOffsetX = card.xOffset * (window.innerWidth < 640 ? 0.6 : 1)

              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleSelectCard(idx)}
                  onMouseEnter={() => {
                    if (!isTouch) handleSelectCard(idx)
                  }}
                  animate={
                    isShuffling
                      ? {
                          x: 0,
                          y: 0,
                          rotateZ: 0,
                          scale: 0.95,
                          zIndex: idx,
                        }
                      : {
                          x: baseOffsetX,
                          y: isSelected ? -24 : 0,
                          rotateZ: isSelected ? 0 : baseRot,
                          scale: isSelected ? 1.08 : 0.98,
                          zIndex: isSelected ? 30 : idx + 5,
                        }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 26,
                    mass: 0.8,
                  }}
                  whileHover={
                    isTouch
                      ? undefined
                      : {
                          y: -32,
                          scale: 1.12,
                          zIndex: 40,
                          transition: { duration: 0.2 },
                        }
                  }
                  style={{ transformStyle: 'preserve-3d' }}
                  className={cn(
                    'absolute cursor-pointer select-none rounded-lg p-2.5 sm:p-3.5 flex flex-col justify-between transition-shadow duration-300',
                    'w-[105px] h-[160px] sm:w-[135px] sm:h-[200px] md:w-[150px] md:h-[225px]',
                    // Heavy cardstock styling
                    'bg-[#f7f3ea] text-[#141312] border border-[#2b2824]',
                    isSelected
                      ? 'ring-2 ring-[var(--acc)] shadow-[0_20px_45px_rgba(229,55,45,0.4)]'
                      : 'shadow-[0_12px_28px_rgba(0,0,0,0.65)] hover:shadow-[0_16px_36px_rgba(229,55,45,0.25)]'
                  )}
                >
                  {/* Card Specular Light Flare Overlay */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none" />

                  {/* Top-Left Card Corner Index */}
                  <div className="flex flex-col items-center leading-none text-left self-start">
                    <span
                      className={cn(
                        'font-serif text-lg sm:text-2xl font-bold',
                        idx % 2 === 0 ? 'text-[var(--acc-on-bone)]' : 'text-[#141312]'
                      )}
                    >
                      {card.letter}
                    </span>
                    <DiamondMark
                      size={6}
                      accent={idx % 2 === 0}
                      filled
                      className="mt-0.5 opacity-90"
                    />
                  </div>

                  {/* Card Center Graphic */}
                  <div className="relative flex flex-col items-center justify-center my-auto">
                    {/* Authentic Vintage Fissure Crack Lines */}
                    <svg
                      viewBox="0 0 60 70"
                      className="w-12 h-14 sm:w-16 sm:h-20 text-[#2b2824]/20 absolute inset-0 m-auto pointer-events-none"
                    >
                      <path
                        d="M 10,12 L 25,28 L 50,22 M 15,55 L 32,45 L 48,60"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                      />
                    </svg>

                    {/* Central Monumental Serif Letter */}
                    <span
                      className={cn(
                        'relative z-10 font-serif font-bold text-4xl sm:text-5xl md:text-6xl drop-shadow-sm',
                        idx % 2 === 0 ? 'text-[var(--acc-on-bone)]' : 'text-[#141312]'
                      )}
                    >
                      {card.letter}
                    </span>

                    {/* Micro card label */}
                    <span className="relative z-10 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-[#4a453e] mt-1">
                      {card.subtitle.split(' ')[0]}
                    </span>
                  </div>

                  {/* Bottom-Right Inverted Corner Index */}
                  <div className="flex flex-col items-center leading-none text-right self-end rotate-180">
                    <span
                      className={cn(
                        'font-serif text-lg sm:text-2xl font-bold',
                        idx % 2 === 0 ? 'text-[var(--acc-on-bone)]' : 'text-[#141312]'
                      )}
                    >
                      {card.letter}
                    </span>
                    <DiamondMark
                      size={6}
                      accent={idx % 2 === 0}
                      filled
                      className="mt-0.5 opacity-90"
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Tactical Controls Strip: Shuffle & Roll The Dice */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Interactive Red Die Button */}
          <motion.button
            type="button"
            onClick={handleRollDice}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#c1211a] hover:bg-[#e5372d] text-[#fff6ec] rounded-sm shadow-lg border border-[#8a140f] cursor-pointer transition-colors"
          >
            {/* 3D Rolling Die Element */}
            <motion.div
              animate={
                diceRolling
                  ? {
                      rotateX: [0, 360, 720],
                      rotateY: [0, 540, 1080],
                      scale: [1, 1.3, 1],
                    }
                  : { rotateX: 0, rotateY: 0, scale: 1 }
              }
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-5 h-5 bg-[#96120c] rounded-xs border border-[#ffe0dc]/40 flex items-center justify-center p-0.5 shadow-inner"
            >
              {/* 5 or 6 pips render */}
              {diceNumber === 6 ? (
                <div className="grid grid-cols-2 gap-0.5 w-full h-full p-0.5">
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full" />
                </div>
              )}
            </motion.div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              {diceRolling ? 'ROLLING...' : `ROLL DESTINY [${diceNumber}]`}
            </span>
          </motion.button>

          {/* Shuffle Hand Button */}
          <motion.button
            type="button"
            onClick={handleShuffle}
            disabled={isShuffling}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--hairline)] hover:border-[var(--bone)] text-[11px] font-mono uppercase tracking-wider text-[var(--bone)] bg-[var(--ink)]/80 backdrop-blur-md rounded-sm cursor-pointer transition-colors"
          >
            <Shuffle size={13} className={cn('text-[var(--acc)]', isShuffling && 'animate-spin')} />
            <span>SHUFFLE DECK</span>
          </motion.button>
        </div>

        {/* ============================================================ */}
        {/* 4. MONUMENTAL HEADLINE & ACTIVE PILLAR CREED */}
        {/* ============================================================ */}
        <div className="relative z-20 w-full max-w-3xl text-center flex flex-col items-center gap-3 sm:gap-4">
          {/* Masked Clip-Reveal Monumental Headline */}
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-[var(--bone)] leading-[0.92] tracking-tight cursor-default"
            >
              Destined for{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="italic font-serif text-[var(--acc)] inline-block transition-transform duration-200 cursor-pointer drop-shadow-[0_4px_24px_rgba(229,55,45,0.45)]"
              >
                riches.
              </motion.span>
            </motion.h1>
          </div>

          {/* Active Card Creed Box with Live Micro-Fade */}
          <div className="min-h-[56px] flex flex-col items-center justify-center max-w-xl px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                transition={{ duration: 0.22 }}
                className="flex flex-col items-center text-center gap-1"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--acc)] uppercase tracking-widest font-bold">
                  <DiamondMark size={6} accent filled />
                  <span>
                    CARD [{currentCard.letter}] • {currentCard.title}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--bone)]/85 leading-relaxed font-sans font-normal">
                  {currentCard.creed}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Hub: Enter Capsule & Story */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
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
                className="w-full sm:w-auto uppercase tracking-wider text-xs font-semibold px-8 py-4 cursor-pointer shadow-xl hover:shadow-[0_8px_30px_rgba(229,55,45,0.4)] transition-shadow"
              >
                Witness The Capsule
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/story"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 border border-[var(--hairline)] hover:border-[var(--bone)] text-xs font-mono uppercase tracking-wider text-[var(--bone)] transition-colors bg-[var(--ink)]/80 backdrop-blur-md hover:bg-[var(--bone)]/5"
              >
                Read Brand Story
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. FULL-WIDTH BONE CREDENTIAL BAND (THE 30% BONE GROUND) */}
      {/* ============================================================ */}
      <div
        data-tone="bone"
        className="relative z-30 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)] px-4 md:px-8 py-3"
      >
        <div className="mx-auto max-w-[var(--max-content)] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2.5 sm:gap-3 font-semibold">
            <span className="text-[var(--acc-on-bone)]">ROF RAGE</span>
            <span>AMBITION</span>
            <DiamondMark size={5} accent filled />
            <span>CONFIDENCE</span>
            <DiamondMark size={5} accent filled />
            <span>ORIGINALITY</span>
          </div>

          <div className="flex items-center gap-4 text-[var(--ink)]/80">
            <span className="hidden md:inline-block font-mono text-[11px]">
              SPEC: 260 GSM HEAVYWEIGHT DRAPE
            </span>
            <span className="font-serif italic text-sm text-[var(--acc-on-bone)] font-bold">
              Destined for riches.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
