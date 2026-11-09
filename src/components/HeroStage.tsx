import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'
import { getIsPageLoaderActive } from '@/components/PageLoader'

interface HeroStageProps {
  className?: string
}

// ---------------------------------------------------------------------------
// 20-CARD DECK CONSTANTS & REUSABLE CARD BACK COMPONENT
// ---------------------------------------------------------------------------
const CARD_SIZE_CLASSES =
  'w-[140px] h-[215px] sm:w-[185px] sm:h-[280px] md:w-[215px] md:h-[325px] lg:w-[245px] lg:h-[365px] xl:w-[275px] xl:h-[410px] 2xl:w-[295px] 2xl:h-[440px]'

// 17 foundation cards forming the 20-card pile with the 3 trinity cards
const DECK_FOUNDATION_CARDS = Array.from({ length: 17 }, (_, i) => ({
  id: `deck-${i}`,
  index: i,
  serial: `ROF-ARC-${String(i + 1).padStart(2, '0')}`,
}))

const CardBackFace: React.FC<{ serial?: string }> = ({ serial = 'ROF-ARCHIVE-01' }) => (
  <div
    style={{
      backfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
    }}
    className="absolute inset-0 rounded-xl lg:rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between bg-[var(--surface-deep)] text-[var(--bone)] border border-[var(--acc)] overflow-hidden shadow-2xl pointer-events-none select-none"
  >
    <div className="absolute inset-2 border border-[var(--bone)]/20 rounded-lg flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,var(--acc)_0%,transparent_70%)]" />

      <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 text-[var(--bone)]/30">
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
      <span className="text-[var(--acc)]">{serial}</span>
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// THE 3 CARDS OF ROF: ROOF • OF • FAME & THEIR SIGNATURE FASHION SILHOUETTES
// ---------------------------------------------------------------------------
interface RofCard {
  id: number
  letter: 'R' | 'O' | 'F'
  word: string
  pillar: string
  number: string
  roman: string
  label: string
  title: string
  mantra: string
  serial: string
  garmentName: string
  garmentColor: string
  garmentImage: string
  garmentPrice: number
  garmentSlug: string
}

const ROF_CARDS: RofCard[] = [
  {
    id: 1,
    letter: 'R',
    word: 'ROOF',
    pillar: 'AMBITION',
    number: '01',
    roman: 'I',
    label: 'ROOF',
    title: 'THE APEX OF AMBITION',
    mantra: 'Built above the noise. No ceiling to what was destined.',
    serial: 'ROF-ROOF-8821',
    garmentName: 'Destined Cards Tee',
    garmentColor: 'Forest green',
    garmentImage: '/images/destined-cards-green.webp',
    garmentPrice: 30000,
    garmentSlug: 'destined-cards-tee',
  },
  {
    id: 2,
    letter: 'O',
    word: 'OF',
    pillar: 'CONFIDENCE',
    number: '02',
    roman: 'II',
    label: 'OF',
    title: 'THE SACRED CONNECTOR',
    mantra: 'Pressure does not break the core; it refines our edges into diamonds.',
    serial: 'ROF-OF-9940',
    garmentName: 'Rage Wave Tee',
    garmentColor: 'White',
    garmentImage: '/images/rage-wave-white.webp',
    garmentPrice: 25000,
    garmentSlug: 'rage-wave-tee-white',
  },
  {
    id: 3,
    letter: 'F',
    word: 'FAME',
    pillar: 'ORIGINALITY',
    number: '03',
    roman: 'III',
    label: 'FAME',
    title: 'THE PINNACLE OF FAME',
    mantra: 'Intention recognized. Greatness earned through relentless craft.',
    serial: 'ROF-FAME-7703',
    garmentName: 'Rage Scribble Tee',
    garmentColor: 'Black',
    garmentImage: '/images/rage-scribble-black.webp',
    garmentPrice: 28000,
    garmentSlug: 'rage-scribble-tee-white',
  },
]

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0) // First card (Destined Cards Tee) default
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({}) // Per-card flip state
  const flipTimersRef = useRef<Record<number, NodeJS.Timeout>>({})
  const lastTapTimeRef = useRef<Record<number, number>>({})
  const [isTouch, setIsTouch] = useState(true)
  const [deckPhase, setDeckPhase] = useState<'spread' | 'gathering' | 'splitting' | 'riffling' | 'bridge' | 'squaring' | 'dealing' | 'dealt'>('spread')
  const [screenWidth, setScreenWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )

  const stageRef = useRef<HTMLDivElement>(null)
  const isShufflingRef = useRef(false)

  // 20-Card Realistic Ritual: Plenty Faced Backward -> Gathered -> Shuffled (Split, Riffle, Bridge) -> R • O • F Deal
  const handleShuffleDeck = useCallback(() => {
    if (isShufflingRef.current) return
    isShufflingRef.current = true

    // Clear any active individual card flip timers and reset flip state
    Object.values(flipTimersRef.current).forEach((timer) => clearTimeout(timer))
    flipTimersRef.current = {}
    setFlippedCards({})

    // Step 1: 20 cards face-down in wide table ribbon spread
    setDeckPhase('spread')

    // Step 2: Croupier scoops cards inward to gather into center deck
    const t1 = setTimeout(() => {
      setDeckPhase('gathering')
    }, 900)

    // Step 3: Deck cuts and lifts into 2 distinct angled packets (left & right)
    const t2 = setTimeout(() => {
      setDeckPhase('splitting')
    }, 1850)

    // Step 4: Rapid alternating 3D thumb riffle interleave
    const t3 = setTimeout(() => {
      setDeckPhase('riffling')
    }, 2550)

    // Step 5: The arched bridge waterfall cascade snap
    const t4 = setTimeout(() => {
      setDeckPhase('bridge')
    }, 3650)

    // Step 6: Deck edges squared flush with crisp table taps
    const t5 = setTimeout(() => {
      setDeckPhase('squaring')
    }, 4200)

    // Step 7: Dealer pitches top 3 cards R - O - F flipping face-up into trinity
    const t6 = setTimeout(() => {
      setDeckPhase('dealing')
    }, 4700)

    // Step 8: Settled into final hero layout matching reference image
    const t7 = setTimeout(() => {
      setDeckPhase('dealt')
      isShufflingRef.current = false
    }, 5850)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
      clearTimeout(t7)
    }
  }, [])

  // Initial cinematic sequence: 20 cards faced backward plenty -> gathered -> shuffled -> R • O • F
  useEffect(() => {
    let timer: NodeJS.Timeout
    let started = false

    const triggerAutoSequence = () => {
      if (started) return
      started = true
      // Display the wide ribbon spread of 20 cards faced backward for 850ms so user takes it in, then gather & shuffle
      timer = setTimeout(() => {
        handleShuffleDeck()
      }, 850)
    }

    if (!getIsPageLoaderActive()) {
      triggerAutoSequence()
    }

    const handleLoaderDone = () => {
      triggerAutoSequence()
    }
    window.addEventListener('rof:page-loader-done', handleLoaderDone)

    const fallbackTimer = setTimeout(() => {
      triggerAutoSequence()
    }, 1300)

    return () => {
      window.removeEventListener('rof:page-loader-done', handleLoaderDone)
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
    }
  }, [handleShuffleDeck])

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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

  const stageRotateX = useTransform(smoothMouseY, [-200, 200], [7, -7])
  const stageRotateY = useTransform(smoothMouseX, [-300, 300], [-9, 9])

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || prefersReduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    rawMouseX.set(e.clientX - centerX)
    rawMouseY.set(e.clientY - centerY)
  }

  const handleStageMouseLeave = () => {
    rawMouseX.set(0)
    rawMouseY.set(0)
  }

  // Clean up any remaining card flip timers on unmount
  useEffect(() => {
    return () => {
      Object.values(flipTimersRef.current).forEach((timer) => clearTimeout(timer))
    }
  }, [])

  // Handle Card Select
  const handleSelectCard = useCallback((index: number) => {
    setActiveCardIndex(index)
  }, [])

  // Handle Individual Card Flip (Double Tap / Double Click with 10s auto-revert)
  const handleToggleCardFlip = useCallback(
    (idx: number) => {
      if (deckPhase !== 'dealt') return

      // Clear existing timer if any for this card
      if (flipTimersRef.current[idx]) {
        clearTimeout(flipTimersRef.current[idx])
        delete flipTimersRef.current[idx]
      }

      setFlippedCards((prev) => {
        const isCurrentlyFlipped = Boolean(prev[idx])
        const willBeFlipped = !isCurrentlyFlipped

        if (willBeFlipped) {
          // Revert back to front face after exactly 10 seconds
          flipTimersRef.current[idx] = setTimeout(() => {
            setFlippedCards((current) => {
              if (!current[idx]) return current
              return { ...current, [idx]: false }
            })
            delete flipTimersRef.current[idx]
          }, 10000)
        }

        return { ...prev, [idx]: willBeFlipped }
      })
    },
    [deckPhase]
  )

  // Double-tap detector for mobile & touchscreens
  const handleCardTouchEnd = useCallback(
    (idx: number, e: React.TouchEvent) => {
      if (deckPhase !== 'dealt') return
      const now = Date.now()
      const lastTap = lastTapTimeRef.current[idx] || 0
      if (now - lastTap < 350) {
        // Double-tap detected!
        e.preventDefault()
        handleToggleCardFlip(idx)
        lastTapTimeRef.current[idx] = 0
      } else {
        lastTapTimeRef.current[idx] = now
      }
    },
    [deckPhase, handleToggleCardFlip]
  )

  // Spatial calculations for 20-card deck pile & 3 trinity cards
  const spread =
    screenWidth < 640
      ? 88
      : screenWidth < 768
        ? 145
        : screenWidth < 1024
          ? 195
          : screenWidth < 1440
            ? 275
            : 340
  const xOffsets = [-spread, 0, spread]
  const baseRot = [-6, 0, 6]
  const baseY = [6, -10, 6]

  const getDeckCardTransform = (i: number) => {
    const isLeft = i < 10
    const packetIdx = isLeft ? i : i - 10
    const interleaveOrder = isLeft ? i * 2 : (i - 10) * 2 + 1

    if (deckPhase === 'spread') {
      const t = (i - 9.5) / 9.5
      const spreadWidth =
        screenWidth < 640
          ? 150
          : screenWidth < 768
            ? 240
            : screenWidth < 1024
              ? 360
              : screenWidth < 1440
                ? 490
                : 600
      return {
        x: t * spreadWidth,
        y: Math.sin(((i + 0.5) / 20) * Math.PI) * -24 + ((i % 2 === 0 ? 1 : -1) * 2.5),
        z: i * 1.8,
        rotateZ: t * 14,
        rotateY: 180,
        scale: 1,
        zIndex: 5 + i,
      }
    }

    if (deckPhase === 'gathering') {
      return {
        x: 0,
        y: -i * 1.4,
        z: i * 2,
        rotateZ: 0,
        rotateY: 180,
        scale: 1,
        zIndex: 10 + i,
      }
    }

    if (deckPhase === 'splitting') {
      const targetX = isLeft ? -125 - packetIdx * 1.5 : 125 + packetIdx * 1.5
      const rotZ = isLeft ? -14 : 14
      return {
        x: targetX,
        y: -packetIdx * 1.8 - 18,
        z: packetIdx * 2.5 + 20,
        rotateZ: rotZ,
        rotateY: isLeft ? 195 : 165,
        scale: 1.02,
        zIndex: 15 + i,
      }
    }

    if (deckPhase === 'riffling') {
      const dropY = -interleaveOrder * 1.35
      const interleaveZ = interleaveOrder * 2.5
      const sideOffset = isLeft ? -18 : 18
      const tiltZ = isLeft ? -4 : 4
      return {
        x: sideOffset * 0.25,
        y: dropY,
        z: interleaveZ,
        rotateZ: tiltZ * 0.35,
        rotateY: 180,
        scale: 1,
        zIndex: 20 + interleaveOrder,
      }
    }

    if (deckPhase === 'bridge') {
      const bridgeArcY = -28 - Math.sin((packetIdx / 9) * Math.PI) * 20
      const bridgeRotZ = isLeft ? -10 + packetIdx * 0.8 : 10 - packetIdx * 0.8
      const bridgeOffsetX = isLeft ? -30 + packetIdx * 2.2 : 30 - packetIdx * 2.2
      return {
        x: bridgeOffsetX,
        y: bridgeArcY,
        z: 42 + packetIdx * 2,
        rotateZ: bridgeRotZ,
        rotateY: isLeft ? 188 : 172,
        scale: 1.02,
        zIndex: 25 + i,
      }
    }

    if (deckPhase === 'squaring') {
      return {
        x: 0,
        y: -i * 1.3,
        z: i * 2,
        rotateZ: 0,
        rotateY: 180,
        scale: 1,
        zIndex: 20 + i,
      }
    }

    // 'dealing' or 'dealt': Foundation stack stays squared resting in background center
    return {
      x: 0,
      y: -i * 1.2,
      z: i * 1.5,
      rotateZ: 0,
      rotateY: 180,
      scale: 0.98,
      zIndex: 10 + i,
    }
  }

  const getDestinyCardTransform = (idx: number) => {
    const cardI = 17 + idx
    const packetIdx = cardI - 10
    const interleaveOrder = (cardI - 10) * 2 + 1
    const isSelected = activeCardIndex === idx

    if (deckPhase === 'spread') {
      const t = (cardI - 9.5) / 9.5
      const spreadWidth =
        screenWidth < 640
          ? 150
          : screenWidth < 768
            ? 240
            : screenWidth < 1024
              ? 360
              : screenWidth < 1440
                ? 490
                : 600
      return {
        x: t * spreadWidth,
        y: Math.sin(((cardI + 0.5) / 20) * Math.PI) * -24 + ((cardI % 2 === 0 ? 1 : -1) * 2.5),
        z: cardI * 1.8,
        rotateZ: t * 14,
        rotateY: 180,
        scale: 1,
        zIndex: 25 + idx,
      }
    }

    if (deckPhase === 'gathering') {
      return {
        x: 0,
        y: -cardI * 1.4,
        z: cardI * 2,
        rotateZ: 0,
        rotateY: 180,
        scale: 1,
        zIndex: 35 + idx,
      }
    }

    if (deckPhase === 'splitting') {
      return {
        x: 125 + packetIdx * 1.5,
        y: -packetIdx * 1.8 - 18,
        z: packetIdx * 2.5 + 20,
        rotateZ: 14,
        rotateY: 165,
        scale: 1.02,
        zIndex: 40 + idx,
      }
    }

    if (deckPhase === 'riffling') {
      return {
        x: 5,
        y: -interleaveOrder * 1.35,
        z: interleaveOrder * 2.5,
        rotateZ: 1.5,
        rotateY: 180,
        scale: 1,
        zIndex: 45 + idx,
      }
    }

    if (deckPhase === 'bridge') {
      return {
        x: 30 - packetIdx * 2.2,
        y: -28 - Math.sin((packetIdx / 9) * Math.PI) * 20,
        z: 42 + packetIdx * 2,
        rotateZ: 10 - packetIdx * 0.8,
        rotateY: 172,
        scale: 1.02,
        zIndex: 50 + idx,
      }
    }

    if (deckPhase === 'squaring') {
      return {
        x: 0,
        y: -cardI * 1.3,
        z: cardI * 2,
        rotateZ: 0,
        rotateY: 180,
        scale: 1,
        zIndex: 52 + idx,
      }
    }

    // 'dealing' or 'dealt':
    const isCardFlipped = Boolean(flippedCards[idx])
    return {
      x: xOffsets[idx],
      y: isSelected ? -24 : baseY[idx],
      z: isSelected ? 40 : idx === 1 ? 30 : 20,
      rotateZ: isSelected ? 0 : baseRot[idx],
      rotateY: deckPhase === 'dealt' && isCardFlipped ? 180 : 0, // Face up when dealt, flips to 180 on individual double tap
      scale: isSelected ? 1.06 : 0.98,
      zIndex: isSelected ? 60 : idx === 1 ? 40 : 30,
    }
  }

  const activeGarment = ROF_CARDS[activeCardIndex] || ROF_CARDS[0]

  return (
    <section
      ref={stageRef}
      onMouseMove={handleStageMouseMove}
      onMouseLeave={handleStageMouseLeave}
      aria-label="ROF Haute Streetwear Stage"
      className={cn(
        'relative min-h-[90vh] md:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[var(--ink)] text-[var(--bone)] select-none pt-4 pb-0',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. ATMOSPHERIC SACRED GEOMETRY CANVAS (DEEP PINE TEAL SPACE) */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Ambient Radial Lights */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[720px] md:w-[1050px] h-[720px] md:h-[1050px] rounded-full bg-[radial-gradient(circle_at_center,rgba(240,180,41,0.075)_0%,rgba(14,47,47,0.25)_45%,transparent_70%)] blur-3xl opacity-80" />
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[580px] md:w-[840px] h-[340px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(240,180,41,0.05)_0%,transparent_65%)] blur-2xl opacity-60" />

        {/* Sacred Concentric Diamond Grid */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035]">
          <svg viewBox="0 0 1000 1000" className="w-[850px] h-[850px] md:w-[1250px] md:h-[1250px]">
            <polygon points="500,40 960,500 500,960 40,500" stroke="currentColor" strokeWidth="1" fill="none" />
            <polygon points="500,120 880,500 500,880 120,500" stroke="currentColor" strokeWidth="0.75" fill="none" />
            <polygon points="500,200 800,500 500,800 200,500" stroke="currentColor" strokeWidth="0.75" fill="none" />
            <polygon points="500,280 720,500 500,720 280,500" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="500" cy="500" r="300" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 8" />
            <circle cx="500" cy="500" r="420" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="3 9" />
          </svg>
        </div>

        {/* Diagonal Ray Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,180,41,0.03)_0%,transparent_50%)]" />
      </div>

      {/* ============================================================ */}
      {/* 2. TOP MASTHEAD TELEMETRY */}
      {/* ============================================================ */}
      <div className="relative z-20 mx-auto w-full max-w-[var(--max-content)] px-4 md:px-8 pt-3 sm:pt-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3 text-xs">
          {/* Brand Telemetry */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acc)] opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--acc)]" />
            </span>
            <span className="label-caps text-[var(--bone)] tracking-[0.24em] font-semibold text-[11px] sm:text-xs">
              ROF RAGE • CAPSULE 01
            </span>
          </div>

          {/* 3 ROF Pillars & Silhouettes Bar */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[var(--ink)]/90 backdrop-blur-md border border-[var(--hairline)] p-1 rounded-sm shadow-xl">
            {ROF_CARDS.map((card, idx) => {
              const isActive = activeCardIndex === idx

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectCard(idx)}
                  className={cn(
                    'px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.16em] transition-all cursor-pointer rounded-xs flex items-center gap-1.5',
                    isActive
                      ? 'bg-[var(--acc)] text-[var(--label-on-acc)] font-bold shadow-md'
                      : 'text-[var(--muted)] hover:text-[var(--bone)] hover:bg-[var(--bone)]/5'
                  )}
                >
                  <span className={isActive ? 'text-[var(--label-on-acc)]' : 'text-[var(--acc)]'}>
                    [{card.letter}]
                  </span>
                  <span>{card.garmentName}</span>
                </button>
              )
            })}
          </div>

          {/* Haute Streetwear subtle indicator */}
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--bone)]/60">
            HAUTE STREETWEAR
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CENTERPIECE: UNCLUTTERED MONUMENTAL HERO */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-2 sm:py-4 px-4 md:px-8 text-center">
        {/* Editorial Fashion Capsule Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 sm:mb-3 rounded-full border border-[var(--hairline)] bg-[var(--surface-deep)]/80 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--acc)] shadow-sm">
          <DiamondMark size={4} accent filled />
          <span>ROF RAGE • HAUTE STREETWEAR CAPSULE 01</span>
        </div>

        {/* Masked Clip-Reveal Monumental Headline */}
        <div className="overflow-hidden py-1 mb-1 sm:mb-2">
          <motion.h1
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-[var(--bone)] leading-[0.94] tracking-tight cursor-default"
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

        {/* Minimalist Subtitle with Fashion Focus */}
        <p className="font-mono text-[10px] sm:text-xs text-[var(--bone)]/70 uppercase tracking-[0.26em] mb-3 sm:mb-4">
          THREE ARCHITECTURAL SILHOUETTES • AMBITION • CONFIDENCE • ORIGINALITY
        </p>

        {/* 3D Tilted Perspective Canvas */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-[640px] md:max-w-[820px] lg:max-w-[1020px] xl:max-w-[1240px] 2xl:max-w-[1420px] h-[270px] sm:h-[330px] md:h-[390px] lg:h-[440px] xl:h-[490px] 2xl:h-[530px] flex items-center justify-center mb-3 sm:mb-4"
        >
          <motion.div
            style={{
              rotateX: stageRotateX,
              rotateY: stageRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* 17 FOUNDATION DECK CARDS */}
            {DECK_FOUNDATION_CARDS.map((item, i) => {
              const pos = getDeckCardTransform(i)
              return (
                <motion.div
                  key={item.id}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                    rotateZ: pos.rotateZ,
                    rotateY: pos.rotateY,
                    scale: pos.scale,
                    zIndex: pos.zIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness:
                      deckPhase === 'riffling'
                        ? 320
                        : deckPhase === 'bridge'
                          ? 280
                          : deckPhase === 'gathering'
                            ? 220
                            : 340,
                    damping:
                      deckPhase === 'riffling'
                        ? 22
                        : deckPhase === 'bridge'
                          ? 20
                          : deckPhase === 'gathering'
                            ? 24
                            : 28,
                    mass: 0.75,
                    delay:
                      deckPhase === 'gathering'
                        ? Math.abs(i - 8.5) * 0.016
                        : deckPhase === 'riffling'
                          ? (i < 10 ? i * 2 : (i - 10) * 2 + 1) * 0.035
                          : 0,
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className={cn(
                    'absolute select-none pointer-events-none rounded-xl lg:rounded-2xl shadow-xl border border-[var(--acc)]/25',
                    CARD_SIZE_CLASSES
                  )}
                >
                  <CardBackFace serial={item.serial} />
                </motion.div>
              )
            })}

            {/* THE 3 TRINITY FASHION CARDS: ROOF [R] • OF [O] • FAME [F] */}
            {ROF_CARDS.map((card, idx) => {
              const pos = getDestinyCardTransform(idx)
              const isSelected = activeCardIndex === idx

              return (
                <motion.div
                  key={card.id}
                  onClick={() => {
                    if (deckPhase === 'dealt') {
                      handleSelectCard(idx)
                    }
                  }}
                  onDoubleClick={(e) => {
                    if (deckPhase === 'dealt') {
                      e.stopPropagation()
                      handleToggleCardFlip(idx)
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (deckPhase === 'dealt') {
                      handleCardTouchEnd(idx, e)
                    }
                  }}
                  title="Click to select • Double-tap or double-click to flip card"
                  onMouseEnter={() => {
                    if (deckPhase === 'dealt') handleSelectCard(idx)
                  }}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                    rotateZ: pos.rotateZ,
                    rotateY: pos.rotateY,
                    scale: pos.scale,
                    zIndex: pos.zIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness:
                      deckPhase === 'riffling'
                        ? 320
                        : deckPhase === 'bridge'
                          ? 280
                          : deckPhase === 'gathering'
                            ? 220
                            : 340,
                    damping:
                      deckPhase === 'riffling'
                        ? 22
                        : deckPhase === 'bridge'
                          ? 20
                          : deckPhase === 'gathering'
                            ? 24
                            : 28,
                    mass: 0.75,
                    delay:
                      deckPhase === 'gathering'
                        ? Math.abs((17 + idx) - 8.5) * 0.016
                        : deckPhase === 'riffling'
                          ? ((7 + idx) * 2 + 1) * 0.035
                          : deckPhase === 'dealing'
                            ? idx * 0.32
                            : 0,
                  }}
                  whileHover={
                    deckPhase !== 'dealt'
                      ? undefined
                      : {
                        y: isSelected ? -30 : pos.y - 14,
                        scale: 1.08,
                        zIndex: 50,
                        transition: { duration: 0.2 },
                      }
                  }
                  style={{ transformStyle: 'preserve-3d' }}
                  className={cn(
                    'group absolute select-none rounded-xl lg:rounded-2xl transition-shadow duration-300',
                    CARD_SIZE_CLASSES,
                    deckPhase === 'dealt'
                      ? 'cursor-pointer'
                      : 'pointer-events-none',
                    deckPhase === 'dealt' && isSelected
                      ? 'ring-2 ring-[var(--acc)] shadow-[0_24px_60px_rgba(240,180,41,0.36),0_8px_24px_rgba(0,0,0,0.6)]'
                      : 'shadow-[0_14px_32px_rgba(0,0,0,0.65)] hover:shadow-[0_18px_40px_rgba(240,180,41,0.22)]'
                  )}
                >
                  {/* FRONT FACE OF CARD (HAUTE-COUTURE STREETWEAR TAROT) */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 rounded-xl lg:rounded-2xl p-2.5 sm:p-3.5 lg:p-4 flex flex-col justify-between bg-[var(--bone-surface)] text-[var(--ink)] border border-[var(--acc)]/30 overflow-hidden"
                  >
                    {/* Top Specular Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/40 pointer-events-none" />

                    {/* Subtle metallic reflection sweep on active card selection */}
                    {isSelected && !prefersReduced && (
                      <motion.div
                        key={`sheen-${activeCardIndex}`}
                        initial={{ x: '-150%', opacity: 0 }}
                        animate={{ x: '180%', opacity: [0, 0.45, 0] }}
                        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="absolute inset-y-0 -inset-x-1/2 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none z-20"
                      />
                    )}

                    {/* Inset Gold Hairline Frame with Corner Diamonds */}
                    <div className="absolute inset-1.5 sm:inset-2 border border-[var(--acc)]/30 rounded-lg pointer-events-none">
                      <div className="absolute top-1 left-1">
                        <DiamondMark size={4} accent filled />
                      </div>
                      <div className="absolute top-1 right-1">
                        <DiamondMark size={4} accent filled />
                      </div>
                      <div className="absolute bottom-1 left-1">
                        <DiamondMark size={4} accent filled />
                      </div>
                      <div className="absolute bottom-1 right-1">
                        <DiamondMark size={4} accent filled />
                      </div>
                    </div>

                    {/* Top Header Row with Index Pip & Price */}
                    <div className="relative z-10 flex items-start justify-between w-full">
                      {/* Top-Left Card Corner Pip */}
                      <div className="flex flex-col items-center leading-none text-left">
                        <span
                          className={cn(
                            'font-serif text-lg sm:text-xl lg:text-2xl font-bold',
                            card.letter === 'O' ? 'text-[var(--acc-on-bone)]' : 'text-[var(--ink)]'
                          )}
                        >
                          {card.letter}
                        </span>
                        <DiamondMark
                          size={5}
                          accent={card.letter === 'O'}
                          filled
                          className="mt-0.5 opacity-90"
                        />
                        <span className="font-mono text-[7px] text-[var(--muted)] font-bold mt-0.5">
                          {card.roman}
                        </span>
                      </div>

                      {/* Top Center Capsule Tag */}
                      <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-[var(--ink)]/50 font-semibold mt-0.5">
                        CAPSULE 01
                      </span>

                      {/* Top Right Price Tag */}
                      <div className="flex flex-col items-end leading-none text-right">
                        <span className="font-sans text-[8px] sm:text-[9px] font-bold text-[var(--acc-on-bone)]">
                          ₦{card.garmentPrice.toLocaleString('en-NG')}
                        </span>
                        <span className="font-mono text-[6px] uppercase tracking-wider text-[var(--ink)]/40 mt-0.5">
                          PIECE 0{card.id}
                        </span>
                      </div>
                    </div>

                    {/* Center Monumental Garment Showcase with Subtle Sacred Geometry Watermark */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full overflow-hidden">
                      {/* Subtle Geometric Watermark Behind Garment */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        {card.letter === 'R' ? (
                          <svg viewBox="0 0 100 100" className="w-24 h-24 text-[var(--ink)]">
                            <polygon points="50,12 88,78 12,78" stroke="currentColor" strokeWidth="2" fill="none" />
                            <polygon points="50,26 78,74 22,74" stroke="currentColor" strokeWidth="1" fill="none" />
                          </svg>
                        ) : card.letter === 'O' ? (
                          <svg viewBox="0 0 100 100" className="w-24 h-24 text-[var(--acc-on-bone)]">
                            <polygon points="50,8 92,50 50,92 8,50" stroke="currentColor" strokeWidth="2.5" fill="none" />
                            <polygon points="50,22 78,50 50,78 22,50" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 100 100" className="w-24 h-24 text-[var(--ink)]">
                            <rect x="14" y="14" width="72" height="72" stroke="currentColor" strokeWidth="2" fill="none" />
                            <rect x="28" y="28" width="44" height="44" stroke="currentColor" strokeWidth="1" fill="none" />
                          </svg>
                        )}
                      </div>

                      {/* REAL LUXURY GARMENT CUT-OUT (UNMISTAKABLY FASHION) */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.25 }}
                        className="relative z-10 w-full flex items-center justify-center py-0.5 sm:py-1"
                      >
                        <img
                          src={card.garmentImage}
                          alt={card.garmentName}
                          width={240}
                          height={240}
                          loading="eager"
                          decoding="async"
                          className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.24)]"
                        />
                      </motion.div>
                    </div>

                    {/* Bottom Garment Lockup */}
                    <div className="relative z-10 flex flex-col items-center text-center w-full pt-1 border-t border-[var(--acc)]/20">
                      <span className="font-serif text-xs sm:text-sm font-bold text-[var(--ink)] leading-tight tracking-tight truncate max-w-full">
                        {card.garmentName}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-[var(--acc-on-bone)] font-semibold mt-0.5">
                        <span>{card.word}</span>
                        <span>•</span>
                        <span>{card.garmentColor}</span>
                      </div>
                    </div>

                    {/* Bottom-Right Corner Pip */}
                    <div className="relative z-10 flex items-center justify-between w-full pt-0.5">
                      <span className="font-mono text-[6px] sm:text-[7px] text-[var(--ink)]/40 uppercase tracking-widest">
                        {card.serial.replace('ROF-', '')}
                      </span>
                      <span className="font-mono text-[6px] sm:text-[7px] text-[var(--acc-on-bone)] font-semibold uppercase tracking-wider">
                        ROF RAGE
                      </span>
                    </div>
                  </div>

                  {/* REVERSE FACE OF CARD */}
                  <CardBackFace serial={card.serial} />
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Selected Garment Fashion Readout */}
        <motion.div
          key={activeCardIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-deep)]/90 border border-[var(--acc)]/40 text-[11px] font-mono text-[var(--bone)] shadow-md mb-3"
        >
          <span className="flex items-center gap-1.5 text-[var(--acc)] font-semibold tracking-wider uppercase text-[10px]">
            <DiamondMark size={4} accent filled />
            <span>PIECE 0{activeCardIndex + 1} //</span>
          </span>
          <span className="font-semibold text-[var(--bone)]">{activeGarment.garmentName}</span>
          <span className="text-[var(--bone)]/50">({activeGarment.garmentColor})</span>
          <span className="text-[var(--acc)] font-bold font-sans">
            ₦{activeGarment.garmentPrice.toLocaleString('en-NG')}
          </span>
          <button
            type="button"
            onClick={() => {
              const target = document.getElementById(activeGarment.garmentSlug)
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' })
              } else {
                navigate({ to: '/shop' })
              }
            }}
            className="underline hover:text-[var(--acc)] text-[10px] tracking-wider uppercase ml-1 cursor-pointer"
          >
            view piece ↓
          </button>
        </motion.div>

        {/* Clean Tactical Controls & Action Row */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Primary CTA: Shop The Collection */}
            <Button
              variant="primary"
              size="md"
              withArrow
              onClick={() => {
                const target = document.getElementById('collection-chapters')
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' })
                } else {
                  navigate({ to: '/shop' })
                }
              }}
              className="px-6 py-2.5 min-h-[44px] uppercase tracking-wider text-xs font-semibold cursor-pointer shadow-xl hover:shadow-[0_8px_30px_rgba(240,180,41,0.3)]"
            >
              Shop the collection
            </Button>

            {/* Brand Story Link */}
            <Link
              to="/story"
              className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] border border-[var(--hairline)] hover:border-[var(--bone)] text-xs font-mono uppercase tracking-wider text-[var(--bone)] transition-colors bg-[var(--ink)]/80 backdrop-blur-md hover:bg-[var(--bone)]/5 rounded-xs"
            >
              Brand story
            </Link>
          </div>

          {/* Micro-hint explaining the interactive card flip (replaces former inspect button) */}
          <p className="font-mono text-[10px] text-[var(--bone)]/60 uppercase tracking-wider flex items-center gap-1.5 pt-0.5">
            <DiamondMark size={4} accent filled />
            <span>Double-tap any card to flip archive • Auto-reverts in 10s</span>
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. FULL-WIDTH BONE CREDENTIAL BAND (THE 30% BONE GROUND) */}
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
              COLLECTION 01 // HAUTE STREETWEAR
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
