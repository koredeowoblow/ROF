import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'motion/react'
import { Volume2, VolumeX, RotateCw, Sparkles, BookOpen, Check, X, ShieldCheck, Layers } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'

interface HeroStageProps {
  className?: string
}

// ---------------------------------------------------------------------------
// SOOTHING ACOUSTIC WEB AUDIO SYNTHESIZER (Pure 432Hz harmonic resonance)
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

function playSoothingSound(type: 'card' | 'flip' | 'seal' | 'click' | 'dice', enabled: boolean) {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    if (type === 'seal') {
      // 432Hz Crystal Diamond Singing Chime with warm harmonic overtone
      osc.type = 'sine'
      osc.frequency.setValueAtTime(432, now)
      osc.frequency.exponentialRampToValueAtTime(864, now + 0.15)
      osc.frequency.exponentialRampToValueAtTime(432, now + 0.7)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4)

      // Soft harmonic fifth (648Hz)
      const subOsc = ctx.createOscillator()
      const subGain = ctx.createGain()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(648, now)
      subGain.gain.setValueAtTime(0.035, now)
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0)
      subOsc.connect(subGain)
      subGain.connect(ctx.destination)
      subOsc.start(now)
      subOsc.stop(now + 1.0)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 1.4)
    } else if (type === 'dice') {
      // Resonant wooden/resin dice impact
      osc.type = 'sine'
      osc.frequency.setValueAtTime(460, now)
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.09)

      gain.gain.setValueAtTime(0.09, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.09)
    } else if (type === 'card') {
      // Soft, organic card sliding over heavy textured cardstock
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(680, now)
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.06)

      gain.gain.setValueAtTime(0.035, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.06)
    } else if (type === 'flip') {
      // Gentle spatial card turn whoosh
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.08)

      gain.gain.setValueAtTime(0.045, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.08)
    } else if (type === 'click') {
      // Soft velvet switch click
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.03)

      gain.gain.setValueAtTime(0.03, now)
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
// THE 3 CARDS OF ROF: MINDSET, MANTRA & INNER REFLECTION
// ---------------------------------------------------------------------------
interface RofCard {
  id: number
  letter: 'R' | 'O' | 'F'
  number: string
  label: string
  title: string
  mantra: string
  creed: string
  reflection: string
  codexEssay: string
  serial: string
  rot: number
  xOffset: number
}

const ROF_CARDS: RofCard[] = [
  {
    id: 1,
    letter: 'R',
    number: '01',
    label: 'AMBITION',
    title: 'THE RELENTLESS DRIVE',
    mantra: 'I move without waiting for permission. Noise fades; focus remains.',
    creed: 'We do not wait for permission. We build through the noise, outwork every doubt, and relentlessly claim what was destined for us.',
    reflection: 'What is the highest ambition you are dedicating your energy to today?',
    codexEssay:
      'True ambition is quiet. It does not shout in crowded rooms or seek validation from temporary audiences. In Lagos, Paris, or London, the creators of lasting culture wake before dawn with a singularity of purpose. When you put on ROF, you step into that sacred stillness where work speaks for itself.',
    serial: 'ROF-AMB-8821',
    rot: -12,
    xOffset: -130,
  },
  {
    id: 2,
    letter: 'O',
    number: '02',
    label: 'CONFIDENCE',
    title: 'THE DIAMOND MINDSET',
    mantra: 'Pressure does not break me; it refines my edges into permanence.',
    creed: 'Pressure does not break us; it refines us into geometric sharpness. Cut sharp with mathematical precision and worn with unwavering pride.',
    reflection: 'Can you hold your calm conviction while the world around you is loud?',
    codexEssay:
      'Diamonds are born under subterranean weight. Most crumble; the few endure until carbon transforms into brilliance. Confidence is not arrogance; it is the deep, soothing knowledge that whatever storms arrive, your core has already been tested and solidified.',
    serial: 'ROF-DIA-9940',
    rot: 0,
    xOffset: 0,
  },
  {
    id: 3,
    letter: 'F',
    number: '03',
    label: 'ORIGINALITY',
    title: 'THE ROOF OF FAME',
    mantra: 'Heavyweight intention in every step. Built to outlive the moment.',
    creed: 'Heavyweight intention woven into every fiber. Built for those creating something authentic that outlives the temporary hype.',
    reflection: 'What are you crafting today that will matter ten years from now?',
    codexEssay:
      'Fast trends come and dissolve within weeks. Originality is the stubborn decision to build at 260 GSM heavyweight permanence. When you hold an original mindset, you refuse to be a replica. You reach for the roof of fame on your own terms.',
    serial: 'ROF-FAM-7703',
    rot: 12,
    xOffset: 130,
  },
]

const DICE_OUTCOMES: Record<number, { title: string; desc: string }> = {
  1: { title: 'AMBITION IGNITED', desc: 'The relentless drive starts now.' },
  2: { title: 'PRESSURE ENDURED', desc: 'Resilience solidifies the core.' },
  3: { title: 'CONFIDENCE REFINED', desc: 'The diamond cuts through doubt.' },
  4: { title: 'ORIGINALITY WOVEN', desc: 'Distinct from temporary hype.' },
  5: { title: 'ROOF OF FAME REACHED', desc: 'Heavyweight mindset recognized.' },
  6: { title: 'DESTINED FOR RICHES', desc: 'The winning roll. Your destiny is secured.' },
}

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  const [activeCardIndex, setActiveCardIndex] = useState<number>(1) // Center 'O' card default
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  const [lagosTime, setLagosTime] = useState<string>('12:00:00')
  const [isTouch, setIsTouch] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [sealedMindset, setSealedMindset] = useState<string | null>(null)
  const [isSealing, setIsSealing] = useState(false)
  const [showCodex, setShowCodex] = useState(false)
  const [showSpecs, setShowSpecs] = useState(false)
  const [diceRolling, setDiceRolling] = useState(false)
  const [diceNumber, setDiceNumber] = useState<number>(5)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale')

  const stageRef = useRef<HTMLDivElement>(null)

  // Restore sealed mindset from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rof_sealed_mindset')
      if (stored) {
        setSealedMindset(stored)
      }
    } catch {
      // Storage safe
    }
  }, [])

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

  // Calming 8-second human breath cycle (4s inhale, 4s exhale)
  useEffect(() => {
    const breathTimer = setInterval(() => {
      setBreathPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'))
    }, 4000)
    return () => clearInterval(breathTimer)
  }, [])

  // Touch device detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch(!window.matchMedia('(pointer: fine)').matches)
    }
  }, [])

  // Smooth luxury spring physics
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 95, mass: 0.8 }
  const smoothMouseX = useSpring(rawMouseX, springConfig)
  const smoothMouseY = useSpring(rawMouseY, springConfig)

  // 3D rotations & spatial parallax
  const stageRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10])
  const stageRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-14, 14])
  const stageTranslateZ = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 15])
  const spotlightX = useTransform(smoothMouseX, [-0.5, 0.5], [-60, 60])
  const spotlightY = useTransform(smoothMouseY, [-0.5, 0.5], [-50, 50])
  const holoGleam = useTransform(smoothMouseX, [-0.5, 0.5], [0, 360])

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
      playSoothingSound('card', soundEnabled)
    },
    [soundEnabled]
  )

  // Handle Card Flip
  const handleToggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
    playSoothingSound('flip', soundEnabled)
  }, [soundEnabled])

  // Handle Dice Roll
  const handleRollDice = useCallback(() => {
    if (diceRolling) return
    setDiceRolling(true)
    playSoothingSound('dice', soundEnabled)
    setTimeout(() => {
      const outcomes = [3, 4, 5, 6, 6]
      const nextRoll = outcomes[Math.floor(Math.random() * outcomes.length)]
      setDiceNumber(nextRoll)
      setDiceRolling(false)
      playSoothingSound('click', soundEnabled)
    }, 550)
  }, [diceRolling, soundEnabled])

  // Seal Current Mindset Ritual
  const handleSealMindset = useCallback(() => {
    const card = ROF_CARDS[activeCardIndex]
    setIsSealing(true)
    playSoothingSound('seal', soundEnabled)

    setTimeout(() => {
      setSealedMindset(card.label)
      try {
        localStorage.setItem('rof_sealed_mindset', card.label)
      } catch {
        // Storage fail safe
      }
      setIsSealing(false)
    }, 600)
  }, [activeCardIndex, soundEnabled])

  const currentCard = ROF_CARDS[activeCardIndex]
  const isCurrentCardSealed = sealedMindset === currentCard.label
  const currentOutcome = DICE_OUTCOMES[diceNumber]

  return (
    <section
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-tone="ink"
      className={cn(
        'relative min-h-[96svh] w-full flex flex-col justify-between pt-16 sm:pt-20 pb-0 border-b border-[var(--hairline)] grain-overlay overflow-hidden select-none cursor-default bg-[var(--ink)]',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. CINEMATIC ATMOSPHERE: SOOTHING BREATHING VOLUMETRIC AURA */}
      {/* ============================================================ */}
      <motion.div
        animate={
          prefersReduced
            ? { opacity: 0.25 }
            : {
                scale: breathPhase === 'inhale' ? 1.05 : 0.95,
                opacity: breathPhase === 'inhale' ? 0.32 : 0.22,
              }
        }
        transition={{ duration: 4, ease: 'easeInOut' }}
        style={{
          x: isTouch || prefersReduced ? 0 : spotlightX,
          y: isTouch || prefersReduced ? 0 : spotlightY,
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1200px] h-[650px] pointer-events-none z-0"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(240,180,41,0.18)_0%,rgba(236,227,203,0.05)_45%,transparent_70%)] blur-3xl" />
      </motion.div>

      {/* Massive Monumental Ghosted Typography */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none z-0 overflow-hidden opacity-[0.03] select-none">
        <div className="text-[14vw] font-display font-bold leading-none tracking-tighter whitespace-nowrap text-[var(--bone)]">
          ROF ◇ AMBITION ◇ CONFIDENCE ◇ ORIGINALITY ◇ DESTINED FOR RICHES
        </div>
        <div className="text-[14vw] font-display font-bold leading-none tracking-tighter whitespace-nowrap text-[var(--bone)] -translate-x-[12vw]">
          THE DIAMOND MINDSET ◇ NO PERMISSION ◇ 260 GSM HEAVYWEIGHT DRAPE
        </div>
      </div>

      {/* Crosshairs & Calm Architectural Markings */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none font-mono text-[10px] text-[var(--bone)]/40 flex items-center gap-1.5">
        <span className="text-[var(--acc)]">+</span>
        <span className="hidden sm:inline">ROF MINDSET SANCTUARY</span>
      </div>
      <div className="absolute top-4 right-4 z-20 pointer-events-none font-mono text-[10px] text-[var(--bone)]/40 flex items-center gap-1.5">
        <span className="hidden sm:inline">LAGOS • 6.4541° N, 3.4246° E</span>
        <span className="text-[var(--acc)]">+</span>
      </div>

      {/* Floating Diamond Embers */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[
            { top: '24%', left: '12%', size: 4, delay: 0 },
            { top: '40%', left: '84%', size: 6, delay: 1.2 },
            { top: '68%', left: '22%', size: 5, delay: 0.8 },
            { top: '78%', left: '80%', size: 4, delay: 1.8 },
          ].map((pt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2, y: 0 }}
              animate={{ opacity: [0.2, 0.7, 0.2], y: [-8, 8, -8] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: pt.delay }}
              style={{ top: pt.top, left: pt.left }}
              className="absolute text-[var(--acc)] opacity-40"
            >
              <DiamondMark size={pt.size} accent filled />
            </motion.div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. TOP MASTHEAD TELEMETRY */}
      {/* ============================================================ */}
      <div className="relative z-20 mx-auto w-full max-w-[var(--max-content)] px-4 md:px-8 pt-2 sm:pt-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3.5 text-xs">
          {/* Brand Telemetry with Active Mindset Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc)] opacity-70" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--acc)]" />
            </span>
            <span className="label-caps text-[var(--bone)] tracking-[0.24em] font-semibold text-[11px] sm:text-xs">
              ROF RAGE • ARCHIVE 01
            </span>

            {/* Retained Mindset Badge */}
            {sealedMindset && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 border border-[var(--acc)]/60 bg-[var(--acc)]/10 text-[var(--acc)] text-[10px] font-mono uppercase tracking-wider rounded-xs"
              >
                <DiamondMark size={5} accent filled />
                <span>SEALED: {sealedMindset}</span>
              </motion.span>
            )}
          </div>

          {/* 3 ROF Pillars Mindset Bar */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[var(--ink)]/90 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm shadow-xl">
            {ROF_CARDS.map((card, idx) => {
              const isActive = activeCardIndex === idx
              const isCardSealed = sealedMindset === card.label

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectCard(idx)}
                  className={cn(
                    'px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.18em] transition-all cursor-pointer rounded-xs flex items-center gap-1.5',
                    isActive
                      ? 'bg-[var(--acc)] text-[var(--label-on-acc)] font-bold shadow-md'
                      : 'text-[var(--muted)] hover:text-[var(--bone)] hover:bg-[var(--bone)]/5'
                  )}
                >
                  <span className={isActive ? 'text-[var(--label-on-acc)]' : 'text-[var(--acc)]'}>
                    [{card.letter}]
                  </span>
                  <span>{card.label}</span>
                  {isCardSealed && <Check size={11} className="text-[var(--label-on-acc)]" />}
                </button>
              )
            })}
          </div>

          {/* Calm Sound, Specs & Live Clock Controls */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs text-[var(--bone)]">
            {/* Fabric Specs Button */}
            <button
              type="button"
              onClick={() => {
                setShowSpecs(!showSpecs)
                playSoothingSound('click', soundEnabled)
              }}
              title="Inspect 260 GSM Heavyweight Specs"
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 border text-[10px] uppercase tracking-wider cursor-pointer transition-colors rounded-xs',
                showSpecs
                  ? 'border-[var(--acc)] bg-[var(--acc)] text-[var(--label-on-acc)] font-bold'
                  : 'border-[var(--hairline)] text-[var(--bone)]/75 hover:text-[var(--bone)] hover:border-[var(--bone)] bg-[var(--ink)]/70'
              )}
            >
              <Layers size={11} />
              <span className="hidden sm:inline">260 GSM SPECS</span>
            </button>

            {/* Mindset Codex Drawer Button */}
            <button
              type="button"
              onClick={() => {
                setShowCodex(true)
                playSoothingSound('click', soundEnabled)
              }}
              title="Open The ROF Mindset Codex"
              className="flex items-center gap-1 px-2.5 py-1 border border-[var(--hairline)] hover:border-[var(--bone)] text-[10px] uppercase tracking-wider text-[var(--bone)]/80 hover:text-[var(--bone)] cursor-pointer transition-colors bg-[var(--ink)]/70 rounded-xs"
            >
              <BookOpen size={11} className="text-[var(--acc)]" />
              <span className="hidden sm:inline">CODEX</span>
            </button>

            {/* Audio Toggle with Live Acoustic Waveform Visualizer */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled
                setSoundEnabled(next)
                playSoothingSound('click', next)
              }}
              title={soundEnabled ? 'Mute soothing audio' : 'Enable soothing audio'}
              className="flex items-center gap-1.5 px-2 py-1 border border-[var(--hairline)] hover:border-[var(--bone)]/60 text-[10px] uppercase tracking-wider text-[var(--bone)]/80 hover:text-[var(--bone)] cursor-pointer transition-colors bg-[var(--ink)]/70 rounded-xs"
            >
              {soundEnabled ? (
                <>
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-[var(--acc)] animate-[pulse_1s_ease-in-out_infinite]" />
                    <span className="w-0.5 h-3 bg-[var(--acc)] animate-[pulse_1.4s_ease-in-out_infinite]" />
                    <span className="w-0.5 h-1.5 bg-[var(--acc)] animate-[pulse_0.8s_ease-in-out_infinite]" />
                  </div>
                  <span className="hidden sm:inline">432Hz</span>
                </>
              ) : (
                <>
                  <VolumeX size={12} className="text-[var(--muted)]" />
                  <span className="hidden sm:inline">MUTED</span>
                </>
              )}
            </button>

            {/* Live Clock */}
            <div className="flex items-center gap-1.5 pl-1 border-l border-[var(--hairline)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
              <span className="tracking-wider text-[11px] sm:text-xs">LAGOS {lagosTime} WAT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CENTERPIECE: THE 3 SOOTHING CARDS OF ROF (R • O • F) & RED DIE */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-3 sm:py-6 px-4 md:px-8">
        {/* Mindset Prompt Banner */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="h-[1px] w-6 sm:w-10 bg-[var(--acc)]" />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[var(--acc)] font-bold">
            THE ROF TRINITY // R • O • F
          </span>
          <span className="h-[1px] w-6 sm:w-10 bg-[var(--acc)]" />
        </div>

        {/* 3D Tilted Perspective Canvas */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-[640px] h-[270px] sm:h-[320px] md:h-[360px] flex items-center justify-center mb-2 sm:mb-4"
        >
          {/* Holographic Authenticity Seal in Corner */}
          <div className="absolute top-0 right-2 sm:right-6 z-30 pointer-events-none hidden sm:block">
            <motion.div
              style={{ rotate: holoGleam }}
              className="w-16 h-16 rounded-full border border-[var(--hairline)] p-1 flex items-center justify-center bg-gradient-to-tr from-transparent via-[var(--acc)]/10 to-white/10 backdrop-blur-md shadow-lg"
            >
              <div className="w-full h-full rounded-full border border-dashed border-[var(--acc)]/40 flex items-center justify-center text-[7px] font-mono uppercase text-center leading-tight text-[var(--bone)]/70">
                <span>ROF<br />AUTHENTIC</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            style={{
              rotateX: isTouch || prefersReduced ? 0 : stageRotateX,
              rotateY: isTouch || prefersReduced ? 0 : stageRotateY,
              z: isTouch || prefersReduced ? 0 : stageTranslateZ,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Deep Contact Shadow */}
            <div className="absolute -bottom-8 w-4/5 h-10 bg-black/80 blur-2xl rounded-full pointer-events-none" />

            {/* THE 3 CARDS: R, O, F */}
            {ROF_CARDS.map((card, idx) => {
              const isSelected = activeCardIndex === idx
              const baseRot = card.rot
              const baseOffsetX = card.xOffset * (window.innerWidth < 640 ? 0.65 : 1)
              const isCardSealed = sealedMindset === card.label

              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleSelectCard(idx)}
                  onMouseEnter={() => {
                    if (!isTouch) handleSelectCard(idx)
                  }}
                  animate={{
                    x: baseOffsetX,
                    y: isSelected ? -28 : 0,
                    rotateZ: isSelected ? 0 : baseRot,
                    rotateY: isFlipped ? 180 : 0,
                    scale: isSelected ? 1.08 : 0.96,
                    zIndex: isSelected ? 30 : idx + 10,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 320,
                    damping: 28,
                    mass: 0.75,
                  }}
                  whileHover={
                    isTouch
                      ? undefined
                      : {
                          y: -36,
                          scale: 1.12,
                          zIndex: 40,
                          transition: { duration: 0.2 },
                        }
                  }
                  style={{ transformStyle: 'preserve-3d' }}
                  className={cn(
                    'absolute cursor-pointer select-none rounded-xl p-3.5 sm:p-5 flex flex-col justify-between transition-shadow duration-400',
                    'w-[135px] h-[205px] sm:w-[175px] sm:h-[265px] md:w-[200px] md:h-[305px]',
                    isSelected
                      ? 'ring-2 ring-[var(--acc)] shadow-[0_24px_50px_rgba(240,180,41,0.3)]'
                      : 'shadow-[0_16px_32px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_rgba(240,180,41,0.18)]'
                  )}
                >
                  {/* FRONT FACE OF CARD */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 rounded-xl p-3.5 sm:p-5 flex flex-col justify-between bg-[var(--bone)] text-[var(--ink)] border border-[var(--hairline)] overflow-hidden"
                  >
                    {/* Top Specular Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/45 pointer-events-none" />

                    {/* Top-Left Card Corner Index */}
                    <div className="relative z-10 flex flex-col items-center leading-none text-left self-start">
                      <span
                        className={cn(
                          'font-serif text-2xl sm:text-3xl font-bold',
                          card.letter === 'O' ? 'text-[var(--acc-on-bone)]' : 'text-[var(--ink)]'
                        )}
                      >
                        {card.letter}
                      </span>
                      <DiamondMark
                        size={7}
                        accent={card.letter === 'O'}
                        filled
                        className="mt-0.5 opacity-90"
                      />
                      <span className="font-mono text-[8px] text-[var(--muted)] font-bold mt-1">
                        {card.number}
                      </span>
                    </div>

                    {/* Center Monumental Art */}
                    <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                      {card.letter === 'O' ? (
                        <div className="relative flex items-center justify-center my-1">
                          <svg
                            viewBox="0 0 100 100"
                            className="w-20 h-20 sm:w-24 sm:h-24 text-[var(--acc-on-bone)]"
                          >
                            <polygon
                              points="50,10 90,50 50,90 10,50"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="rgba(143,82,0,0.10)"
                            />
                            <polygon
                              points="50,28 72,50 50,72 28,50"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              fill="rgba(143,82,0,0.18)"
                            />
                            <circle cx="50" cy="50" r="4" fill="currentColor" />
                          </svg>
                          <span className="absolute font-serif font-bold text-5xl sm:text-6xl text-[var(--acc-on-bone)] drop-shadow-sm">
                            O
                          </span>
                        </div>
                      ) : (
                        <div className="relative flex items-center justify-center my-1">
                          <svg
                            viewBox="0 0 80 80"
                            className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--ink)]/25 absolute inset-0 m-auto pointer-events-none"
                          >
                            <path
                              d="M 12,15 L 32,34 L 65,28 M 18,65 L 40,52 L 62,70"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              fill="none"
                            />
                          </svg>
                          <span className="relative z-10 font-serif font-bold text-6xl sm:text-7xl text-[var(--ink)] drop-shadow-sm">
                            {card.letter}
                          </span>
                        </div>
                      )}

                      {/* Card Pillar Tag */}
                      <span className="relative z-10 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-bold text-[var(--muted)] mt-1">
                        {card.label}
                      </span>
                    </div>

                    {/* Bottom-Right Corner Index */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      {isCardSealed && (
                        <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-[var(--acc-on-bone)] font-bold">
                          <Check size={10} strokeWidth={3} />
                          SEALED
                        </span>
                      )}
                      <div className="flex flex-col items-center leading-none text-right ml-auto rotate-180">
                        <span
                          className={cn(
                            'font-serif text-2xl sm:text-3xl font-bold',
                            card.letter === 'O' ? 'text-[var(--acc-on-bone)]' : 'text-[var(--ink)]'
                          )}
                        >
                          {card.letter}
                        </span>
                        <DiamondMark
                          size={7}
                          accent={card.letter === 'O'}
                          filled
                          className="mt-0.5 opacity-90"
                        />
                      </div>
                    </div>
                  </div>

                  {/* REVERSE FACE OF CARD */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 rounded-xl p-3.5 sm:p-5 flex flex-col justify-between bg-[#0a2323] text-[var(--bone)] border border-[var(--acc)] overflow-hidden shadow-2xl"
                  >
                    <div className="absolute inset-2 border border-[var(--bone)]/20 rounded-lg flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,var(--acc)_0%,transparent_70%)]" />

                      <svg
                        viewBox="0 0 120 120"
                        className="w-24 h-24 sm:w-28 sm:h-28 text-[var(--bone)]/30"
                      >
                        <polygon points="60,8 112,60 60,112 8,60" stroke="currentColor" strokeWidth="1" fill="none" />
                        <polygon points="60,20 100,60 60,100 20,60" stroke="currentColor" strokeWidth="1" fill="none" />
                        <polygon points="60,32 88,60 60,88 32,60" stroke="var(--acc)" strokeWidth="1.5" fill="rgba(240,180,41,0.20)" />
                        <polygon points="60,44 76,60 60,76 44,60" stroke="var(--acc)" strokeWidth="1" fill="none" />
                      </svg>

                      <span className="absolute font-serif text-2xl sm:text-3xl font-bold text-[var(--bone)] tracking-widest">
                        ROF
                      </span>
                    </div>

                    <div className="relative z-10 w-full flex items-center justify-between text-[8px] font-mono text-[var(--bone)]/60 pt-1">
                      <span>CERTIFIED ARCHIVE</span>
                      <span className="text-[var(--acc)]">{card.serial}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Soothing Tactical Mindset Bar: Seal Mindset, Roll Die, Flip */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          {/* SEAL THIS MINDSET INTERACTION */}
          <motion.button
            type="button"
            onClick={handleSealMindset}
            disabled={isSealing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-sm shadow-xl cursor-pointer transition-all border',
              isCurrentCardSealed
                ? 'bg-[var(--bone)] text-[var(--ink)] border-[var(--bone)] font-bold'
                : 'bg-[var(--acc)] hover:bg-[#fabf36] text-[var(--label-on-acc)] border-[#e0a31a] font-bold shadow-[0_8px_24px_rgba(240,180,41,0.28)]'
            )}
          >
            {isSealing ? (
              <Sparkles size={14} className="animate-spin text-[var(--label-on-acc)]" />
            ) : isCurrentCardSealed ? (
              <Check size={14} className="text-[var(--acc-on-bone)]" />
            ) : (
              <ShieldCheck size={14} className="text-[var(--label-on-acc)]" />
            )}
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {isSealing
                ? 'SEALING MINDSET...'
                : isCurrentCardSealed
                ? `MINDSET ACTIVE: ${currentCard.label}`
                : `SEAL ${currentCard.label} MINDSET`}
            </span>
          </motion.button>

          {/* Interactive Red Die Button */}
          <motion.button
            type="button"
            onClick={handleRollDice}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#133d3d] hover:bg-[#184d4d] text-[var(--bone)] rounded-sm shadow-lg border border-[var(--acc)]/40 cursor-pointer transition-colors"
          >
            <motion.div
              animate={
                diceRolling
                  ? {
                      rotateX: [0, 360, 720],
                      rotateY: [0, 540, 1080],
                      scale: [1, 1.35, 1],
                    }
                  : { rotateX: 0, rotateY: 0, scale: 1 }
              }
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="w-4 h-4 bg-[#0e2f2f] rounded-xs border border-[var(--acc)]/60 flex items-center justify-center p-0.5 shadow-inner"
            >
              {diceNumber === 6 ? (
                <div className="grid grid-cols-2 gap-0.5 w-full h-full p-0.5">
                  <div className="w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="w-1 h-1 bg-[var(--acc)] rounded-full" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-0 w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="absolute top-0 right-0 w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-[var(--acc)] rounded-full" />
                  <div className="absolute bottom-0 right-0 w-1 h-1 bg-[var(--acc)] rounded-full" />
                </div>
              )}
            </motion.div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              {diceRolling ? 'ROLLING...' : `ROLL [${diceNumber}]`}
            </span>
          </motion.button>

          {/* Flip Card Button */}
          <motion.button
            type="button"
            onClick={handleToggleFlip}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[var(--hairline)] hover:border-[var(--bone)] text-[11px] font-mono uppercase tracking-wider text-[var(--bone)] bg-[var(--ink)]/80 backdrop-blur-md rounded-sm cursor-pointer transition-colors"
          >
            <RotateCw size={13} className={cn('text-[var(--acc)]', isFlipped && 'rotate-180 transition-transform duration-300')} />
            <span>{isFlipped ? 'SHOW FRONT' : 'INSPECT BACK'}</span>
          </motion.button>
        </div>

        {/* ============================================================ */}
        {/* 4. MONUMENTAL HEADLINE & SOOTHING INNER REFLECTION */}
        {/* ============================================================ */}
        <div className="relative z-20 w-full max-w-3xl text-center flex flex-col items-center gap-2 sm:gap-2.5">
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
                whileHover={{ scale: 1.04 }}
                className="italic font-serif text-[var(--acc)] inline-block transition-transform duration-200 cursor-pointer drop-shadow-[0_4px_24px_rgba(240,180,41,0.35)]"
              >
                riches.
              </motion.span>
            </motion.h1>
          </div>

          {/* Soothing Mindset Mantra & Reflection */}
          <div className="min-h-[54px] flex flex-col items-center justify-center max-w-xl px-4">
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
                    PILLAR {currentCard.number} • {currentCard.label} • {currentCard.title}
                  </span>
                </div>
                <p className="font-serif italic text-sm sm:text-base text-[var(--bone)] leading-relaxed">
                  "{currentCard.mantra}"
                </p>
                <p className="text-xs text-[var(--bone)]/70 font-sans max-w-md">
                  {currentCard.reflection}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dice Roll Outcome Message */}
          <div className="h-5 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={diceNumber}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-[10px] font-mono text-[var(--bone)]/70 uppercase tracking-widest flex items-center gap-2"
              >
                <span className="text-[var(--acc)]">DESTINY ROLL [{diceNumber}]:</span>
                <span className="text-[var(--bone)] font-semibold">{currentOutcome.title}</span>
                <span className="hidden sm:inline text-[var(--muted)]">• {currentOutcome.desc}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Hub: Enter Capsule & Story */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 w-full sm:w-auto">
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
                className="w-full sm:w-auto uppercase tracking-wider text-xs font-semibold px-8 py-4 cursor-pointer shadow-xl hover:shadow-[0_8px_30px_rgba(240,180,41,0.3)] transition-shadow"
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
      {/* 5. 260 GSM SPECS ARCHITECTURAL OVERLAY */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showSpecs && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-4 right-4 sm:left-8 sm:right-8 z-40 bg-[var(--ink)]/95 backdrop-blur-xl border border-[var(--acc)] p-4 sm:p-5 rounded-md shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)] text-xs font-mono">
              <div className="flex items-center gap-2 text-[var(--acc)] font-bold tracking-wider">
                <Sparkles size={14} />
                <span>ROF ARCHITECTURAL SPECIFICATIONS // ARCHIVE 01</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSpecs(false)}
                className="text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer"
              >
                [CLOSE ×]
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 font-mono text-xs">
              <div>
                <span className="text-[var(--muted)] text-[10px] uppercase block">GARMENT FABRIC</span>
                <span className="text-[var(--bone)] font-semibold">260 GSM Heavyweight French Terry</span>
              </div>
              <div>
                <span className="text-[var(--muted)] text-[10px] uppercase block">SILHOUETTE</span>
                <span className="text-[var(--bone)] font-semibold">Oversized Boxy Drop-Shoulder</span>
              </div>
              <div>
                <span className="text-[var(--muted)] text-[10px] uppercase block">FINISH & DYE</span>
                <span className="text-[var(--bone)] font-semibold">Silicon Enzyme Preshrunk Wash</span>
              </div>
              <div>
                <span className="text-[var(--muted)] text-[10px] uppercase block">LAGOS STUDIO</span>
                <span className="text-[var(--acc)] font-semibold">6.4541° N, 3.4246° E</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 6. MINDSET CODEX MODAL DRAWER (Soothing Deep-Read Ritual) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showCodex && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg select-text"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0a2323] border border-[var(--hairline)] rounded-lg p-6 sm:p-8 text-[var(--bone)] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--hairline)]">
                <div className="flex items-center gap-2">
                  <DiamondMark size={8} accent filled />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold text-[var(--acc)]">
                    THE ROF MINDSET CODEX // ARCHIVE 01
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCodex(false)}
                  className="p-1 hover:text-[var(--acc)] cursor-pointer text-[var(--muted)]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Codex Content */}
              <div className="py-6 flex flex-col gap-6 font-sans">
                {ROF_CARDS.map((card) => (
                  <div key={card.id} className="flex flex-col gap-2 pb-5 border-b border-[var(--hairline)]/50 last:border-b-0">
                    <div className="flex items-center gap-2 font-mono text-xs text-[var(--acc)]">
                      <span>[{card.number}]</span>
                      <span className="font-bold tracking-wider">{card.label}</span>
                      <span className="text-[var(--hairline)]">•</span>
                      <span className="text-[var(--bone)]/70">{card.title}</span>
                    </div>
                    <p className="font-serif italic text-base text-[var(--bone)]">
                      "{card.mantra}"
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--bone)]/80 leading-relaxed font-normal">
                      {card.codexEssay}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-[var(--hairline)] flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--muted)] text-[10px]">
                  DESTINED FOR RICHES // LAGOS STUDIO
                </span>
                <button
                  type="button"
                  onClick={() => setShowCodex(false)}
                  className="px-4 py-2 bg-[var(--acc)] text-[var(--label-on-acc)] uppercase tracking-wider text-[11px] font-bold rounded-xs cursor-pointer"
                >
                  RETURN TO SANCTUARY
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 7. FULL-WIDTH BONE CREDENTIAL BAND (THE 30% BONE GROUND) */}
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
