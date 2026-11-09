import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'
import { getIsPageLoaderActive } from '@/components/PageLoader'
import { useBagStore } from '@/features/bag/bagStore'
import { Check, ShoppingBag } from 'lucide-react'

interface HeroStageProps {
  className?: string
}

// ---------------------------------------------------------------------------
// 20-CARD DECK CONSTANTS & REUSABLE CARD BACK COMPONENT
// ---------------------------------------------------------------------------
// Imposing, monumental high-fashion runway proportions
const CARD_SIZE_CLASSES =
  'w-[180px] h-[280px] sm:w-[230px] sm:h-[350px] md:w-[265px] md:h-[400px] lg:w-[295px] lg:h-[445px] xl:w-[330px] xl:h-[490px] 2xl:w-[360px] 2xl:h-[530px]'

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
    className="absolute inset-0 rounded-xl lg:rounded-2xl p-3 sm:p-5 flex flex-col justify-between bg-[var(--surface-deep)] text-[var(--bone)] border-2 border-[var(--acc)]/75 overflow-hidden shadow-2xl pointer-events-none select-none"
  >
    {/* Stitched Luxury Atelier Border */}
    <div className="absolute inset-2 sm:inset-3 border border-dashed border-[var(--bone)]/30 rounded-lg flex flex-col justify-between p-2.5 sm:p-4 overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--acc)_0%,transparent_70%)]" />

      {/* Top Header of Garment Tag */}
      <div className="relative z-10 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-[var(--bone)]/70 uppercase tracking-widest border-b border-[var(--bone)]/20 pb-1">
        <span className="text-[var(--acc)] font-bold">ROF RAGE</span>
        <span>ATELIER ARCHIVE</span>
      </div>

      {/* Center Crest: Diamond Emblem + Unmistakable Fashion House Branding */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
        <div className="relative mb-1.5 sm:mb-2">
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--acc)]">
            <polygon points="50,6 94,50 50,94 6,50" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <polygon points="50,18 82,50 50,82 18,50" stroke="var(--bone)" strokeWidth="1" fill="rgba(236,227,203,0.06)" />
            <polygon points="50,30 70,50 50,70 30,50" stroke="currentColor" strokeWidth="1.5" fill="rgba(240,180,41,0.22)" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-serif text-lg sm:text-xl font-bold text-[var(--bone)] tracking-widest">
            ROF
          </span>
        </div>

        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-[var(--bone)] font-bold">
          A LUXURY FASHION BRAND
        </span>
        <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[var(--acc)] mt-0.5 font-semibold">
          MADE FOR THE STREET
        </span>
        <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.16em] text-[var(--bone)]/70 mt-1">
          COLLECTION 01 • READY-TO-WEAR
        </span>
      </div>

      {/* Bottom Atelier Details & Care Icons */}
      <div className="relative z-10 pt-1.5 border-t border-[var(--bone)]/20">
        <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-[var(--bone)]/70">
          <span>{serial}</span>
          <span className="text-[var(--acc)] italic font-serif">Destined for riches.</span>
        </div>
      </div>
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// THE 3 CARDS OF ROF: ROOF • OF • FAME & THEIR SIGNATURE FASHION SILHOUETTES
// ---------------------------------------------------------------------------
interface RofCard {
  id: number
  productId: string
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
  cutDesc: string
  moodColor: string
}

const ROF_CARDS: RofCard[] = [
  {
    id: 1,
    productId: 'prod-1',
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
    cutDesc: 'Five cracked playing cards spelling ROF RAGE with high-gloss red dice graphic',
    moodColor: 'rgba(27, 56, 43, 0.40)',
  },
  {
    id: 2,
    productId: 'prod-2',
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
    cutDesc: 'Warped ROF RAGE chest wordmark in red and mint with lilac brand tag',
    moodColor: 'rgba(236, 227, 203, 0.22)',
  },
  {
    id: 3,
    productId: 'prod-5',
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
    garmentSlug: 'rage-scribble-tee-black',
    cutDesc: 'Burnt orange continuous line artwork contained in architectural frame',
    moodColor: 'rgba(240, 180, 41, 0.18)',
  },
]

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()
  const addItem = useBagStore((s) => s.addItem)

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0) // First card (Destined Cards Tee) default
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M')
  const [addedNotice, setAddedNotice] = useState(false)
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
  const sequenceTimersRef = useRef<NodeJS.Timeout[]>([])

  // Skip shuffle directly to dealt if user taps, clicks, or scrolls
  const skipToDealt = useCallback(() => {
    if (deckPhase === 'dealt') return
    sequenceTimersRef.current.forEach((t) => clearTimeout(t))
    sequenceTimersRef.current = []
    setDeckPhase('dealt')
    isShufflingRef.current = false
  }, [deckPhase])

  // 20-Card Realistic Ritual: Plenty Faced Backward -> Gathered -> Shuffled (Split, Riffle, Bridge) -> R • O • F Deal
  // Optimized to a snappy ~3.4s cinematic cadence so garments land with maximum runway impact
  const handleShuffleDeck = useCallback(() => {
    if (isShufflingRef.current) return
    isShufflingRef.current = true

    // Clear any active individual card flip timers and reset flip state
    Object.values(flipTimersRef.current).forEach((timer) => clearTimeout(timer))
    flipTimersRef.current = {}
    setFlippedCards({})

    // Step 1: 20 cards face-down in wide table ribbon spread
    setDeckPhase('spread')

    sequenceTimersRef.current.forEach((t) => clearTimeout(t))
    sequenceTimersRef.current = []

    // Step 2: Croupier scoops cards inward to gather into center deck
    const t1 = setTimeout(() => setDeckPhase('gathering'), 400)
    // Step 3: Deck cuts and lifts into 2 distinct angled packets (left & right)
    const t2 = setTimeout(() => setDeckPhase('splitting'), 900)
    // Step 4: Rapid alternating 3D thumb riffle interleave
    const t3 = setTimeout(() => setDeckPhase('riffling'), 1450)
    // Step 5: The arched bridge waterfall cascade snap
    const t4 = setTimeout(() => setDeckPhase('bridge'), 2050)
    // Step 6: Deck edges squared flush with crisp table taps
    const t5 = setTimeout(() => setDeckPhase('squaring'), 2550)
    // Step 7: Dealer pitches top 3 cards R - O - F flipping face-up into trinity
    const t6 = setTimeout(() => setDeckPhase('dealing'), 2900)
    // Step 8: Settled into final hero layout matching reference image
    const t7 = setTimeout(() => {
      setDeckPhase('dealt')
      isShufflingRef.current = false
    }, 3400)

    sequenceTimersRef.current = [t1, t2, t3, t4, t5, t6, t7]

    return () => {
      sequenceTimersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  // Initial cinematic sequence: 20 cards faced backward -> gathered -> shuffled -> R • O • F
  useEffect(() => {
    let timer: NodeJS.Timeout
    let started = false

    const triggerAutoSequence = () => {
      if (started) return
      started = true
      // Display the wide ribbon spread of 20 cards faced backward for 400ms so user takes it in, then gather & shuffle
      timer = setTimeout(() => {
        handleShuffleDeck()
      }, 400)
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
    }, 900)

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

  const stageRotateX = useTransform(smoothMouseY, [-200, 200], [6, -6])
  const stageRotateY = useTransform(smoothMouseX, [-300, 300], [-8, 8])

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
      sequenceTimersRef.current.forEach((t) => clearTimeout(t))
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

  // Handle Quick Add to Bag from Hero
  const handleQuickAddToBag = () => {
    const garment = ROF_CARDS[activeCardIndex] || ROF_CARDS[0]
    addItem({
      productId: garment.productId,
      name: garment.garmentName,
      colour: garment.garmentColor,
      size: selectedSize,
      unitPrice: garment.garmentPrice,
      image: garment.garmentImage,
    })
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 2400)
  }

  // Spatial calculations for 20-card deck pile & 3 trinity cards
  const spread =
    screenWidth < 640
      ? 110
      : screenWidth < 768
        ? 170
        : screenWidth < 1024
          ? 225
          : screenWidth < 1440
            ? 315
            : 385
  const xOffsets = [-spread, 0, spread]
  const baseRot = [-6, 0, 6]
  const baseY = [8, -12, 8]

  const getDeckCardTransform = (i: number) => {
    const isLeft = i < 10
    const packetIdx = isLeft ? i : i - 10
    const interleaveOrder = isLeft ? i * 2 : (i - 10) * 2 + 1

    if (deckPhase === 'spread') {
      const t = (i - 9.5) / 9.5
      const spreadWidth =
        screenWidth < 640
          ? 160
          : screenWidth < 768
            ? 260
            : screenWidth < 1024
              ? 390
              : screenWidth < 1440
                ? 520
                : 640
      return {
        x: t * spreadWidth,
        y: Math.sin(((i + 0.5) / 20) * Math.PI) * -26 + ((i % 2 === 0 ? 1 : -1) * 2.5),
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
      const targetX = isLeft ? -130 - packetIdx * 1.5 : 130 + packetIdx * 1.5
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
          ? 160
          : screenWidth < 768
            ? 260
            : screenWidth < 1024
              ? 390
              : screenWidth < 1440
                ? 520
                : 640
      return {
        x: t * spreadWidth,
        y: Math.sin(((cardI + 0.5) / 20) * Math.PI) * -26 + ((cardI % 2 === 0 ? 1 : -1) * 2.5),
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
        x: 130 + packetIdx * 1.5,
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
      y: isSelected ? -28 : baseY[idx],
      z: isSelected ? 50 : idx === 1 ? 35 : 25,
      rotateZ: isSelected ? 0 : baseRot[idx],
      rotateY: deckPhase === 'dealt' && isCardFlipped ? 180 : 0, // Face up when dealt, flips to 180 on individual double tap
      scale: isSelected ? 1.08 : 0.96,
      zIndex: isSelected ? 65 : idx === 1 ? 40 : 30,
    }
  }

  const activeGarment = ROF_CARDS[activeCardIndex] || ROF_CARDS[0]

  return (
    <section
      ref={stageRef}
      onClick={skipToDealt}
      onMouseMove={handleStageMouseMove}
      onMouseLeave={handleStageMouseLeave}
      aria-label="ROF Haute Streetwear Stage"
      className={cn(
        'relative min-h-[96vh] md:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[var(--ink)] text-[var(--bone)] select-none pt-4 pb-0 transition-colors duration-700',
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. ATMOSPHERIC SACRED GEOMETRY CANVAS (DEEP PINE TEAL SPACE) */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Piece Color Tone Glow */}
        <motion.div
          animate={{
            backgroundColor: activeGarment.moodColor,
          }}
          transition={{ duration: 0.8 }}
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[750px] md:w-[1100px] h-[750px] md:h-[1100px] rounded-full blur-3xl opacity-75"
        />

        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[360px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(240,180,41,0.06)_0%,transparent_65%)] blur-2xl opacity-60" />

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,180,41,0.035)_0%,transparent_50%)]" />
      </div>

      {/* Editorial Side Markers (Ultra-wide screens) */}
      <div className="hidden 2xl:flex flex-col gap-4 absolute left-12 top-1/2 -translate-y-1/2 text-left font-mono text-[10px] text-[var(--bone)]/50 tracking-widest z-20 pointer-events-none">
        <div>
          <span className="block text-[var(--acc)] font-bold text-[9px] mb-0.5 tracking-wider">BRAND TYPE</span>
          <span className="text-[var(--bone)]/90 font-semibold">CLOTHING & FASHION</span>
        </div>
        <div>
          <span className="block text-[var(--acc)] font-bold text-[9px] mb-0.5 tracking-wider">GENRE</span>
          <span className="text-[var(--bone)]/85">HAUTE STREETWEAR</span>
        </div>
        <div>
          <span className="block text-[var(--acc)] font-bold text-[9px] mb-0.5 tracking-wider">COLLECTION</span>
          <span className="text-[var(--bone)]/85">CAPSULE 01 (SS26)</span>
        </div>
        <div>
          <span className="block text-[var(--acc)] font-bold text-[9px] mb-0.5 tracking-wider">FABRIC</span>
          <span className="text-[var(--bone)]/85">100% HEAVY LUXURY COTTON</span>
        </div>
      </div>

      <div className="hidden 2xl:flex flex-col gap-4 absolute right-12 top-1/2 -translate-y-1/2 text-right font-mono text-[10px] text-[var(--bone)]/50 tracking-widest z-20 pointer-events-none">
        <div>
          <span className="block text-[var(--acc)] font-bold text-[9px] mb-0.5 tracking-wider">PIECES</span>
          <span className="text-[var(--bone)]/85">03 SILHOUETTES</span>
        </div>
        <div>
          <span className="block text-[var(--acc)] font-bold text-[9px] mb-0.5 tracking-wider">ORIGIN</span>
          <span className="text-[var(--bone)]/85">LAGOS TO THE WORLD</span>
        </div>
        <div>
          <span className="block text-[var(--acc)] font-bold text-[9px] mb-0.5 tracking-wider">TAGLINE</span>
          <span className="text-[var(--acc)] italic font-serif text-xs">Destined for riches.</span>
        </div>
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
            <span className="label-caps text-[var(--bone)] tracking-[0.22em] font-bold text-[10px] sm:text-xs">
              ROF RAGE // A LUXURY FASHION BRAND MADE FOR THE STREET
            </span>
          </div>

          {/* Runway Lookbook Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[var(--surface-deep)]/95 backdrop-blur-md border border-[var(--acc)]/40 p-1 rounded-sm shadow-xl">
            {ROF_CARDS.map((card, idx) => {
              const isActive = activeCardIndex === idx

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    skipToDealt()
                    handleSelectCard(idx)
                  }}
                  className={cn(
                    'px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] transition-all cursor-pointer rounded-xs flex items-center gap-2',
                    isActive
                      ? 'bg-[var(--acc)] text-[var(--label-on-acc)] font-bold shadow-md'
                      : 'text-[var(--bone)]/75 hover:text-[var(--bone)] hover:bg-[var(--bone)]/10'
                  )}
                >
                  <span className={isActive ? 'text-[var(--label-on-acc)] font-black' : 'text-[var(--acc)] font-bold'}>
                    LOOK 0{idx + 1}
                  </span>
                  <span>{card.garmentName}</span>
                </button>
              )
            })}
          </div>

          {/* Haute Streetwear subtle indicator */}
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--acc)] font-semibold">
            READY-TO-WEAR APPAREL
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CENTERPIECE: UNCLUTTERED MONUMENTAL HERO */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-2 sm:py-3 px-4 md:px-8 text-center">
        {/* Editorial Fashion Classification Badge (Definitive Brand Statement) */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-2.5 sm:mb-3 rounded-full border border-[var(--acc)] bg-[var(--surface-deep)]/90 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.24em] text-[var(--acc)] shadow-lg backdrop-blur-md font-bold"
        >
          <DiamondMark size={4} accent filled />
          <span>ROF RAGE // A LUXURY FASHION BRAND MADE FOR THE STREET</span>
        </motion.div>

        {/* Masked Clip-Reveal Monumental Headline */}
        <div className="overflow-hidden py-1 mb-1 sm:mb-2">
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

        {/* Clear Fashion Subtitle */}
        <p className="font-serif italic text-base sm:text-lg lg:text-xl text-[var(--bone)]/90 max-w-xl mx-auto mb-1 leading-snug">
          A luxury fashion brand made for the street.
        </p>

        {/* Fashion Collection Specs Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--acc)] mb-3">
          <span>COLLECTION 01</span>
          <span>•</span>
          <span>THREE ARCHITECTURAL HEAVYWEIGHT TEES</span>
          <span>•</span>
          <span>READY-TO-WEAR</span>
        </div>

        {/* 3D Tilted Perspective Canvas */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-[660px] md:max-w-[860px] lg:max-w-[1060px] xl:max-w-[1280px] 2xl:max-w-[1460px] h-[280px] sm:h-[350px] md:h-[410px] lg:h-[465px] xl:h-[515px] 2xl:h-[555px] flex items-center justify-center mb-3 sm:mb-4"
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
                  onClick={(e) => {
                    e.stopPropagation()
                    if (deckPhase !== 'dealt') {
                      skipToDealt()
                    }
                    handleSelectCard(idx)
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
                        y: isSelected ? -36 : pos.y - 18,
                        scale: 1.1,
                        zIndex: 70,
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
                      ? 'ring-2 ring-[var(--acc)] shadow-[0_28px_70px_rgba(240,180,41,0.4),0_12px_28px_rgba(0,0,0,0.7)]'
                      : 'shadow-[0_16px_36px_rgba(0,0,0,0.68)] hover:shadow-[0_22px_45px_rgba(240,180,41,0.25)]'
                  )}
                >
                  {/* FRONT FACE OF CARD (HAUTE-COUTURE STREETWEAR LOOKBOOK PLATE) */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 flex flex-col justify-between bg-[var(--bone-surface)] text-[var(--ink)] border border-[var(--acc)]/35 overflow-hidden shadow-inner"
                  >
                    {/* Top Specular Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/45 pointer-events-none" />

                    {/* Subtle metallic reflection sweep on active card selection */}
                    {isSelected && !prefersReduced && (
                      <motion.div
                        key={`sheen-${activeCardIndex}`}
                        initial={{ x: '-150%', opacity: 0 }}
                        animate={{ x: '180%', opacity: [0, 0.45, 0] }}
                        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="absolute inset-y-0 -inset-x-1/2 w-full bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 pointer-events-none z-20"
                      />
                    )}

                    {/* Inset Gold Hairline Frame with Corner Diamonds */}
                    <div className="absolute inset-1.5 sm:inset-2.5 border border-[var(--acc)]/35 rounded-lg pointer-events-none">
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

                    {/* Top Header Row with Look Index & Garment Price */}
                    <div className="relative z-10 flex items-start justify-between w-full">
                      {/* Top-Left: Look Index */}
                      <div className="flex flex-col items-start leading-none text-left">
                        <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-[var(--ink)]">
                          LOOK 0{card.id}
                        </span>
                        <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-[var(--acc-on-bone)] font-bold mt-0.5">
                          READY-TO-WEAR
                        </span>
                      </div>

                      {/* Top Center: ROF RAGE Tag */}
                      <span className="hidden sm:inline-block font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.24em] text-[var(--ink)]/55 font-bold mt-0.5">
                        ROF RAGE
                      </span>

                      {/* Top Right: Garment Price */}
                      <div className="flex flex-col items-end leading-none text-right">
                        <span className="font-sans text-xs sm:text-sm lg:text-base font-bold text-[var(--acc-on-bone)]">
                          ₦{card.garmentPrice.toLocaleString('en-NG')}
                        </span>
                        <span className="font-mono text-[6px] sm:text-[7px] uppercase tracking-wider text-[var(--ink)]/50 mt-0.5 font-semibold">
                          COLLECTION 01
                        </span>
                      </div>
                    </div>

                    {/* Center Monumental Garment Showcase with 3D Pop Elevation */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full overflow-visible py-1 sm:py-2">
                      {/* Ambient Radial Soft Glow Behind Garment */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(240,180,41,0.25)_0%,transparent_70%)]" />
                      </div>

                      {/* REAL LUXURY GARMENT CUT-OUT (MONUMENTAL FASHION IMPACT) */}
                      <motion.div
                        whileHover={{ scale: 1.08, y: -4 }}
                        transition={{ duration: 0.25 }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={card.garmentImage}
                          alt={card.garmentName}
                          width={360}
                          height={360}
                          loading="eager"
                          decoding="async"
                          className="w-full h-auto max-h-[160px] sm:max-h-[210px] md:max-h-[250px] lg:max-h-[295px] xl:max-h-[330px] 2xl:max-h-[365px] object-contain pointer-events-none filter drop-shadow-[0_18px_36px_rgba(0,0,0,0.38)]"
                        />
                      </motion.div>
                    </div>

                    {/* Bottom Garment Lockup */}
                    <div className="relative z-10 flex flex-col items-center text-center w-full pt-1.5 border-t border-[var(--acc)]/25">
                      <span className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[var(--ink)] leading-tight tracking-tight truncate max-w-full">
                        {card.garmentName}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-[var(--acc-on-bone)] font-bold mt-0.5">
                        <span>{card.garmentColor}</span>
                        <span>•</span>
                        <span>HEAVYWEIGHT GRAPHIC TEE</span>
                      </div>
                    </div>

                    {/* Bottom-Right Corner Pip */}
                    <div className="relative z-10 flex items-center justify-between w-full pt-1 border-t border-[var(--acc)]/15">
                      <span className="font-mono text-[6px] sm:text-[7px] text-[var(--ink)]/45 uppercase tracking-widest">
                        {card.serial}
                      </span>
                      <span className="font-mono text-[6px] sm:text-[7px] text-[var(--acc-on-bone)] font-bold uppercase tracking-wider">
                        A LUXURY FASHION BRAND
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

        {/* ============================================================ */}
        {/* SCULPTURAL HIGH-FASHION SHOWROOM CONSOLE                     */}
        {/* ============================================================ */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3">
          {/* Integrated Garment Bar */}
          <motion.div
            key={activeCardIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[var(--surface-deep)]/95 border border-[var(--acc)]/50 text-[var(--bone)] shadow-xl backdrop-blur-xl"
          >
            {/* Garment Title & Price */}
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--acc)] shrink-0 animate-pulse" />
              <div className="text-left">
                <div className="flex items-center gap-2 font-mono text-[9px] text-[var(--acc)] uppercase tracking-wider font-semibold">
                  <span>LOOK 0{activeGarment.id}</span>
                  <span>•</span>
                  <span>READY-TO-WEAR</span>
                  <span>•</span>
                  <span>{activeGarment.garmentColor}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-serif text-base font-bold text-[var(--bone)] leading-none">
                    {activeGarment.garmentName}
                  </h3>
                  <span className="font-sans text-sm font-bold text-[var(--acc)]">
                    ₦{activeGarment.garmentPrice.toLocaleString('en-NG')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Size Pills & Instant Add To Bag */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-[var(--hairline)] rounded-sm p-0.5 bg-[var(--ink)]/60">
                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedSize(sz)
                    }}
                    className={cn(
                      'w-6 h-6 flex items-center justify-center font-mono text-[9px] font-bold rounded-xs transition-colors cursor-pointer',
                      selectedSize === sz
                        ? 'bg-[var(--acc)] text-[var(--label-on-acc)] shadow-sm'
                        : 'text-[var(--bone)]/70 hover:text-[var(--bone)]'
                    )}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuickAddToBag()
                }}
                className="px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                {addedNotice ? (
                  <>
                    <Check size={12} strokeWidth={3} />
                    <span>ADDED</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} />
                    <span>+ ADD ({selectedSize})</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Primary Navigation CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Primary CTA: Shop The Collection */}
            <Button
              variant="primary"
              size="md"
              withArrow
              onClick={(e) => {
                e.stopPropagation()
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
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] border border-[var(--hairline)] hover:border-[var(--bone)] text-xs font-mono uppercase tracking-wider text-[var(--bone)] transition-colors bg-[var(--ink)]/80 backdrop-blur-md hover:bg-[var(--bone)]/5 rounded-xs"
            >
              Brand story
            </Link>
          </div>

          {/* Micro-hint explaining the interactive card flip (replaces former inspect button) */}
          <p className="font-mono text-[10px] text-[var(--bone)]/60 uppercase tracking-wider flex items-center gap-1.5">
            <DiamondMark size={4} accent filled />
            <span>Double-tap any card to inspect certified archive • Auto-reverts in 10s</span>
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
            <DiamondMark size={5} accent filled />
            <span>A LUXURY FASHION BRAND MADE FOR THE STREET</span>
          </div>

          <div className="flex items-center gap-4 text-[var(--ink)]/80">
            <span className="hidden md:inline-block font-mono text-[11px]">
              CAPSULE 01 // 3 ARCHITECTURAL SILHOUETTES
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
