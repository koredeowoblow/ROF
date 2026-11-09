import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroStageProps {
  className?: string
}

// ---------------------------------------------------------------------------
// 20-CARD DECK: 15 FOUNDATION + 5 LOOK CARDS = 20 TOTAL
// Sized to fill roughly 65-70% of hero height at 1440x900 without overlapping
// ---------------------------------------------------------------------------
const CARD_SIZE_CLASSES =
  'w-[155px] h-[240px] sm:w-[185px] sm:h-[290px] md:w-[215px] md:h-[335px] lg:w-[245px] lg:h-[380px] xl:w-[265px] xl:h-[415px]'

const DECK_FOUNDATION_CARDS = Array.from({ length: 15 }, (_, i) => ({
  id: `deck-${i}`,
  index: i,
}))

/**
 * Card backs: ONLY the ROF diamond mark in fine gold line.
 */
const CardBackFace: React.FC = () => (
  <div
    style={{
      backfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
    }}
    className="absolute inset-0 rounded-xl lg:rounded-2xl flex items-center justify-center bg-[var(--surface-deep)] text-[var(--bone)] border border-[var(--acc)]/40 overflow-hidden shadow-2xl pointer-events-none select-none"
  >
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-22 sm:h-22 text-[var(--acc)]">
        <polygon points="50,10 90,50 50,90 10,50" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <polygon points="50,22 78,50 50,78 22,50" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="3 3" />
        <polygon points="50,34 66,50 50,66 34,50" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
      <span className="absolute font-serif text-base sm:text-xl font-bold text-[var(--bone)] tracking-widest">
        ROF
      </span>
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// ALL 5 ROF CARDS: LOOK 01 TO LOOK 05
// ---------------------------------------------------------------------------
interface RofCard {
  id: number
  productId: string
  lookNumber: string
  garmentName: string
  garmentColor: string
  garmentImage: string
  ground: 'cream' | 'teal'
  moodColor: string
}

const INITIAL_ROF_CARDS: RofCard[] = [
  {
    id: 1,
    productId: 'prod-1',
    lookNumber: 'Look 01',
    garmentName: 'Destined Cards Tee',
    garmentColor: 'Forest green',
    garmentImage: '/images/destined-cards-green.webp',
    ground: 'cream',
    moodColor: 'rgba(27, 56, 43, 0.40)',
  },
  {
    id: 2,
    productId: 'prod-2',
    lookNumber: 'Look 02',
    garmentName: 'Rage Wave Tee',
    garmentColor: 'White',
    garmentImage: '/images/rage-wave-white.webp',
    ground: 'teal',
    moodColor: 'rgba(236, 227, 203, 0.22)',
  },
  {
    id: 3,
    productId: 'prod-3',
    lookNumber: 'Look 03',
    garmentName: 'Rage Wave Tee',
    garmentColor: 'Black',
    garmentImage: '/images/rage-wave-black.webp',
    ground: 'cream',
    moodColor: 'rgba(240, 180, 41, 0.18)',
  },
  {
    id: 4,
    productId: 'prod-4',
    lookNumber: 'Look 04',
    garmentName: 'Rage Scribble Tee',
    garmentColor: 'White',
    garmentImage: '/images/rage-scribble-white.webp',
    ground: 'teal',
    moodColor: 'rgba(236, 227, 203, 0.22)',
  },
  {
    id: 5,
    productId: 'prod-5',
    lookNumber: 'Look 05',
    garmentName: 'Rage Scribble Tee',
    garmentColor: 'Black',
    garmentImage: '/images/rage-scribble-black.webp',
    ground: 'cream',
    moodColor: 'rgba(240, 180, 41, 0.18)',
  },
]

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  const [orderedCards, setOrderedCards] = useState<RofCard[]>(INITIAL_ROF_CARDS)
  const [activeCardIndex, setActiveCardIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const cardParam = params.get('card')
      if (cardParam !== null) {
        const idx = parseInt(cardParam, 10)
        if (!isNaN(idx) && idx >= 0 && idx < 5) return idx
      }
    }
    return 0
  })

  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const flipTimersRef = useRef<Record<number, NodeJS.Timeout>>({})
  const lastTapTimeRef = useRef<Record<number, number>>({})
  const [isTouch, setIsTouch] = useState(true)
  const [deckPhase, setDeckPhase] = useState<'spread' | 'gathering' | 'splitting' | 'riffling' | 'bridge' | 'squaring' | 'dealing' | 'dealt'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('dealt') === '1') return 'dealt'
    }
    return 'spread'
  })
  const [screenWidth, setScreenWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )
  const [isTabVisible, setIsTabVisible] = useState(true)

  const stageRef = useRef<HTMLDivElement>(null)
  const isShufflingRef = useRef(false)
  const sequenceTimersRef = useRef<NodeJS.Timeout[]>([])
  const touchStartXRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Skip shuffle directly to dealt on user interaction
  const skipToDealt = useCallback(() => {
    if (deckPhase === 'dealt') return
    sequenceTimersRef.current.forEach((t) => clearTimeout(t))
    sequenceTimersRef.current = []
    setDeckPhase('dealt')
    isShufflingRef.current = false
  }, [deckPhase])

  // Select card handler
  const handleSelectCard = useCallback((index: number) => {
    setActiveCardIndex(index)
  }, [])

  // Previous and Next card handlers
  const handlePrevCard = useCallback(() => {
    setActiveCardIndex((prev) => (prev - 1 + orderedCards.length) % orderedCards.length)
  }, [orderedCards.length])

  const handleNextCard = useCallback(() => {
    setActiveCardIndex((prev) => (prev + 1) % orderedCards.length)
  }, [orderedCards.length])

  // Shuffle intro: phone = 3.0s, desktop = 4.4s, skippable
  const handleShuffleDeck = useCallback(() => {
    if (isShufflingRef.current) return
    isShufflingRef.current = true

    Object.values(flipTimersRef.current).forEach((timer) => clearTimeout(timer))
    flipTimersRef.current = {}
    setFlippedCards({})

    setDeckPhase('spread')

    sequenceTimersRef.current.forEach((t) => clearTimeout(t))
    sequenceTimersRef.current = []

    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false

    const tGather = isMobile ? 500 : 750
    const tSplit = isMobile ? 900 : 1300
    const tRiffle = isMobile ? 1350 : 1950
    const tBridge = isMobile ? 1850 : 2650
    const tSquare = isMobile ? 2250 : 3300
    const tDeal = isMobile ? 2550 : 3800
    const tDone = isMobile ? 3000 : 4400

    const t1 = setTimeout(() => setDeckPhase('gathering'), tGather)
    const t2 = setTimeout(() => setDeckPhase('splitting'), tSplit)
    const t3 = setTimeout(() => setDeckPhase('riffling'), tRiffle)
    const t4 = setTimeout(() => setDeckPhase('bridge'), tBridge)
    const t5 = setTimeout(() => setDeckPhase('squaring'), tSquare)
    const t6 = setTimeout(() => setDeckPhase('dealing'), tDeal)
    const t7 = setTimeout(() => {
      setDeckPhase('dealt')
      isShufflingRef.current = false
    }, tDone)

    sequenceTimersRef.current = [t1, t2, t3, t4, t5, t6, t7]

    return () => {
      sequenceTimersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  // 1. Shuffle action: plays shuffle ritual and re-orders the five looks randomly
  const handleShuffleAndRandomize = useCallback(() => {
    const shuffled = [...INITIAL_ROF_CARDS].sort(() => Math.random() - 0.5)
    setOrderedCards(shuffled)
    setActiveCardIndex(0)
    handleShuffleDeck()
  }, [handleShuffleDeck])

  // 1. Draw next card action
  const handleDrawNextCard = useCallback(() => {
    skipToDealt()
    handleNextCard()
  }, [handleNextCard, skipToDealt])

  // Initial trigger
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('dealt') === '1') return
    }
    const timer = setTimeout(() => {
      handleShuffleDeck()
    }, 80)

    return () => {
      clearTimeout(timer)
      sequenceTimersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [handleShuffleDeck])

  // Window resize & touch detection
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    if (typeof window !== 'undefined') {
      setIsTouch(!window.matchMedia('(pointer: fine)').matches)
    }
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Tab visibility detection
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Keyboard navigation: ArrowLeft and ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        skipToDealt()
        handlePrevCard()
      } else if (e.key === 'ArrowRight') {
        skipToDealt()
        handleNextCard()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNextCard, handlePrevCard, skipToDealt])

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEndStage = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX
    if (Math.abs(diff) > 36) {
      skipToDealt()
      if (diff > 0) {
        handleNextCard()
      } else {
        handlePrevCard()
      }
    }
    touchStartXRef.current = null
  }

  // 7. Pointer Parallax: Card tilts up to 3 degrees, Tee moves 6px more
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 95, mass: 0.8 }
  const smoothMouseX = useSpring(rawMouseX, springConfig)
  const smoothMouseY = useSpring(rawMouseY, springConfig)

  // Card tilts up to 3 degrees
  const stageRotateX = useTransform(smoothMouseY, [-200, 200], [3, -3])
  const stageRotateY = useTransform(smoothMouseX, [-300, 300], [-3, 3])

  // Tee moves 6px more than card
  const teeParallaxX = useTransform(smoothMouseX, [-300, 300], [-6, 6])
  const teeParallaxY = useTransform(smoothMouseY, [-200, 200], [-6, 6])

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

  // Double-tap or double-click to flip card with 10s auto-revert
  const handleToggleCardFlip = useCallback(
    (idx: number) => {
      if (deckPhase !== 'dealt') return

      if (flipTimersRef.current[idx]) {
        clearTimeout(flipTimersRef.current[idx])
        delete flipTimersRef.current[idx]
      }

      setFlippedCards((prev) => {
        const isCurrentlyFlipped = Boolean(prev[idx])
        const willBeFlipped = !isCurrentlyFlipped

        if (willBeFlipped) {
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

  const handleCardTouchEnd = useCallback(
    (idx: number, e: React.TouchEvent) => {
      if (deckPhase !== 'dealt') return
      const now = Date.now()
      const lastTap = lastTapTimeRef.current[idx] || 0
      if (now - lastTap < 320) {
        e.preventDefault()
        handleToggleCardFlip(idx)
        lastTapTimeRef.current[idx] = 0
      } else {
        lastTapTimeRef.current[idx] = now
      }
    },
    [deckPhase, handleToggleCardFlip]
  )

  // Gold dust particles: max 28 particles, slow drift, off for reduced motion & hardwareConcurrency <= 4
  useEffect(() => {
    const isLowEnd =
      typeof window !== 'undefined' &&
      window.navigator &&
      window.navigator.hardwareConcurrency &&
      window.navigator.hardwareConcurrency <= 4
    if (prefersReduced || isLowEnd || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth)
    const h = (canvas.height = canvas.offsetHeight)

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.4 + 0.6,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.45 + 0.15,
    }))

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#f0b429'

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.y < 0) p.y = h
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0

        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [prefersReduced])

  // Circular hand spread distance
  const spread =
    screenWidth < 640
      ? 50
      : screenWidth < 768
        ? 80
        : screenWidth < 1024
          ? 115
          : screenWidth < 1440
            ? 150
            : 175

  const getDeckCardTransform = (i: number) => {
    const isLeft = i < 10
    const packetIdx = isLeft ? i : i - 10
    const interleaveOrder = isLeft ? i * 2 : (i - 10) * 2 + 1

    if (deckPhase === 'spread') {
      const t = (i - 9.5) / 9.5
      const spreadWidth =
        screenWidth < 640
          ? 130
          : screenWidth < 768
            ? 190
            : screenWidth < 1024
              ? 270
              : screenWidth < 1440
                ? 360
                : 440
      return {
        x: t * spreadWidth,
        y: Math.sin(((i + 0.5) / 20) * Math.PI) * -18 + ((i % 2 === 0 ? 1 : -1) * 2),
        z: i * 1.5,
        rotateZ: t * 10,
        rotateY: 180,
        scale: 1,
        zIndex: 5 + i,
      }
    }

    if (deckPhase === 'gathering') {
      return {
        x: 0,
        y: -i * 1.2,
        z: i * 1.8,
        rotateZ: 0,
        rotateY: 180,
        scale: 1,
        zIndex: 10 + i,
      }
    }

    if (deckPhase === 'splitting') {
      const targetX = isLeft ? -110 - packetIdx * 1.3 : 110 + packetIdx * 1.3
      const rotZ = isLeft ? -12 : 12
      return {
        x: targetX,
        y: -packetIdx * 1.5 - 14,
        z: packetIdx * 2.2 + 18,
        rotateZ: rotZ,
        rotateY: isLeft ? 195 : 165,
        scale: 1,
        zIndex: 15 + i,
      }
    }

    if (deckPhase === 'riffling') {
      const dropY = -interleaveOrder * 1.2
      const interleaveZ = interleaveOrder * 2.2
      const sideOffset = isLeft ? -15 : 15
      const tiltZ = isLeft ? -3 : 3
      return {
        x: sideOffset * 0.2,
        y: dropY,
        z: interleaveZ,
        rotateZ: tiltZ * 0.3,
        rotateY: 180,
        scale: 1,
        zIndex: 20 + interleaveOrder,
      }
    }

    if (deckPhase === 'bridge') {
      const bridgeArcY = -24 - Math.sin((packetIdx / 9) * Math.PI) * 16
      const bridgeRotZ = isLeft ? -8 + packetIdx * 0.7 : 8 - packetIdx * 0.7
      const bridgeOffsetX = isLeft ? -25 + packetIdx * 1.8 : 25 - packetIdx * 1.8
      return {
        x: bridgeOffsetX,
        y: bridgeArcY,
        z: 36 + packetIdx * 1.8,
        rotateZ: bridgeRotZ,
        rotateY: isLeft ? 188 : 172,
        scale: 1,
        zIndex: 25 + i,
      }
    }

    if (deckPhase === 'squaring') {
      return {
        x: 0,
        y: -i * 1.1,
        z: i * 1.6,
        rotateZ: 0,
        rotateY: 180,
        scale: 1,
        zIndex: 20 + i,
      }
    }

    return {
      x: 0,
      y: -i * 1,
      z: i * 1.2,
      rotateZ: 0,
      rotateY: 180,
      scale: 0.96,
      zIndex: 10 + i,
    }
  }

  // Circular hand calculation: always 2 cards on left, active in center, 2 on right
  const getDestinyCardTransform = (idx: number) => {
    const cardI = 15 + idx
    const packetIdx = cardI - 10
    const interleaveOrder = (cardI - 10) * 2 + 1

    if (deckPhase === 'spread') {
      const t = (cardI - 9.5) / 9.5
      const spreadWidth =
        screenWidth < 640
          ? 130
          : screenWidth < 768
            ? 190
            : screenWidth < 1024
              ? 270
              : screenWidth < 1440
                ? 360
                : 440
      return {
        x: t * spreadWidth,
        y: Math.sin(((cardI + 0.5) / 20) * Math.PI) * -18 + ((cardI % 2 === 0 ? 1 : -1) * 2),
        z: cardI * 1.5,
        rotateZ: t * 10,
        rotateY: 180,
        scale: 1,
        zIndex: 25 + idx,
        filter: 'none',
      }
    }

    if (deckPhase === 'gathering') {
      return {
        x: 0,
        y: -cardI * 1.2,
        z: cardI * 1.8,
        rotateZ: 0,
        rotateY: 180,
        scale: 1,
        zIndex: 35 + idx,
        filter: 'none',
      }
    }

    if (deckPhase === 'splitting') {
      return {
        x: 110 + packetIdx * 1.3,
        y: -packetIdx * 1.5 - 14,
        z: packetIdx * 2.2 + 18,
        rotateZ: 12,
        rotateY: 165,
        scale: 1,
        zIndex: 40 + idx,
        filter: 'none',
      }
    }

    if (deckPhase === 'riffling') {
      return {
        x: 4,
        y: -interleaveOrder * 1.2,
        z: interleaveOrder * 2.2,
        rotateZ: 1.2,
        rotateY: 180,
        scale: 1,
        zIndex: 45 + idx,
        filter: 'none',
      }
    }

    if (deckPhase === 'bridge') {
      return {
        x: 25 - packetIdx * 1.8,
        y: -24 - Math.sin((packetIdx / 9) * Math.PI) * 16,
        z: 36 + packetIdx * 1.8,
        rotateZ: 8 - packetIdx * 0.7,
        rotateY: 172,
        scale: 1,
        zIndex: 50 + idx,
        filter: 'none',
      }
    }

    if (deckPhase === 'squaring') {
      return {
        x: 0,
        y: -cardI * 1.1,
        z: cardI * 1.6,
        rotateZ: 0,
        rotateY: 180,
        scale: 1,
        zIndex: 52 + idx,
        filter: 'none',
      }
    }

    // Phase: dealing or dealt
    // Circular wrap calculation: range [-2, 2]
    let diff = idx - activeCardIndex
    while (diff > 2) diff -= 5
    while (diff < -2) diff += 5

    const isSelected = diff === 0
    const isCardFlipped = Boolean(flippedCards[idx])

    // Clean circular fanning
    const x = diff * spread
    const y = isSelected ? -8 : Math.abs(diff) === 1 ? 6 : 18
    const z = isSelected ? 50 : Math.abs(diff) === 1 ? 25 : 8
    const rotateZ = isSelected ? 0 : diff < 0 ? -4 * Math.abs(diff) : 4 * Math.abs(diff)
    const rotateY = deckPhase === 'dealt' && isCardFlipped ? 180 : 0
    const scale = isSelected ? 1.05 : Math.abs(diff) === 1 ? 0.92 : 0.82
    const zIndex = isSelected ? 65 : 45 - Math.abs(diff) * 8

    // 2. Outer cards (positions plus or minus 2): brightness(0.62) and saturate(0.85). No opacity below 1!
    const filter = Math.abs(diff) === 2 ? 'brightness(0.62) saturate(0.85)' : 'none'

    return {
      x,
      y,
      z,
      rotateZ,
      rotateY,
      scale,
      zIndex,
      filter,
    }
  }

  const activeGarment = orderedCards[activeCardIndex] || orderedCards[0]
  const isMobile = screenWidth < 640

  return (
    <section
      ref={stageRef}
      onClick={skipToDealt}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEndStage}
      onMouseMove={handleStageMouseMove}
      onMouseLeave={handleStageMouseLeave}
      aria-label="ROF Stage"
      className={cn(
        'relative min-h-[100svh] h-[100svh] max-h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-[var(--ink)] text-[var(--bone)] select-none transition-colors duration-700',
        className
      )}
    >
      <style>{`
        @keyframes rofMarqueeLeft {
          0% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes rofMarqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0%, 0, 0); }
        }
        .rof-text-marquee-top {
          animation: rofMarqueeLeft 52s linear infinite;
        }
        .rof-text-marquee-bot {
          animation: rofMarqueeRight 48s linear infinite;
        }
        ${!isTabVisible || prefersReduced ? `
          .rof-text-marquee-top, .rof-text-marquee-bot {
            animation-play-state: paused !important;
          }
        ` : ''}
      `}</style>

      {/* Gold Dust Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* ============================================================ */}
      {/* 3. GHOST TEXT BANDS: TOP (3%) & BOTTOM (4.5%)                */}
      {/* ============================================================ */}
      {/* Top Band: sits between header (h-16) and eyebrow, 3% opacity */}
      <div className="absolute top-[68px] left-0 right-0 overflow-hidden pointer-events-none opacity-[0.03] z-0 select-none">
        <div className="flex w-max rof-text-marquee-top font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-[0.25em] uppercase text-transparent [-webkit-text-stroke:1.5px_var(--bone)]">
          <span className="pr-12">Destined for riches • Destined for riches • Destined for riches • Destined for riches •</span>
          <span className="pr-12">Destined for riches • Destined for riches • Destined for riches • Destined for riches •</span>
        </div>
      </div>

      {/* Bottom Band: ROF RAGE */}
      <div className="absolute bottom-11 left-0 right-0 overflow-hidden pointer-events-none opacity-[0.045] z-0 select-none">
        <div className="flex w-max rof-text-marquee-bot font-serif text-6xl sm:text-7xl md:text-8xl font-bold tracking-[0.3em] uppercase text-transparent [-webkit-text-stroke:1.5px_var(--acc)]">
          <span className="pr-12">ROF RAGE • ROF RAGE • ROF RAGE • ROF RAGE • ROF RAGE •</span>
          <span className="pr-12">ROF RAGE • ROF RAGE • ROF RAGE • ROF RAGE • ROF RAGE •</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. SPOTLIGHT: NEUTRAL WARM CREAM LIGHT CONE (NARROW, NO YELLOW) */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_50%_18%,rgba(236,227,203,0.10)_0%,rgba(236,227,203,0.02)_55%,transparent_75%)]" />
      </div>

      {/* ============================================================ */}
      {/* TOP HEADER BAR                                               */}
      {/* ============================================================ */}
      <div className="relative z-20 mx-auto w-full max-w-[var(--max-content)] px-4 md:px-8 pt-3 sm:pt-4">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <DiamondMark size={4} accent filled />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold text-[var(--bone)]">
              ROF RAGE
            </span>
          </div>

          <div className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[var(--acc)] font-semibold">
            Collection 01 / Five pieces
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. THREE-COLUMN DESKTOP GRID                                 */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 my-auto">
        {/* ============================================================ */}
        {/* COLUMN 1: LEFT RAIL (w-[220px])                             */}
        {/* ============================================================ */}
        <div className="hidden lg:flex w-[220px] shrink-0 flex-col gap-[14px] text-left select-none z-20">
          {orderedCards.map((card, i) => {
            const isActive = activeCardIndex === i
            return (
              <button
                key={card.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  skipToDealt()
                  handleSelectCard(i)
                }}
                className={cn(
                  'min-h-[44px] flex items-center gap-2 text-[13px] font-mono tracking-wider transition-all duration-200 cursor-pointer text-left',
                  isActive
                    ? 'text-[var(--acc)] font-bold translate-x-1'
                    : 'text-[rgba(236,227,203,0.70)] hover:text-[var(--bone)]'
                )}
              >
                {isActive ? (
                  <DiamondMark size={4} accent filled />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[rgba(236,227,203,0.35)] shrink-0" />
                )}
                <span className="leading-tight">{card.lookNumber} {card.garmentName}</span>
              </button>
            )
          })}
        </div>

        {/* ============================================================ */}
        {/* COLUMN 2: DECK COLUMN (FLEXIBLE CENTER)                     */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-0 max-w-full z-10 px-2 overflow-visible">
          {/* 4 & 6. Eyebrow: at least 24px below header, text: "Collection 01 / Five pieces" */}
          <div className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-[rgba(236,227,203,0.75)] mt-4 mb-1 font-medium">
            Collection 01 / Five pieces
          </div>

          {/* 4. Headline: reduced 8% to guarantee 28px clearance before cards */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-display text-[var(--bone)] leading-none tracking-tight cursor-default mb-7">
            Destined for{' '}
            <span className="italic font-serif text-[var(--acc)] inline-block drop-shadow-[0_4px_24px_rgba(240,180,41,0.35)]">
              riches.
            </span>
          </h1>

          {/* 3D Stage with Deck Ritual: overflow-visible so cards are never cropped */}
          <div
            style={{
              perspective: 1200,
            }}
            className="relative w-full max-w-[560px] sm:max-w-[660px] md:max-w-[760px] lg:max-w-[840px] xl:max-w-[940px] h-[260px] sm:h-[310px] md:h-[360px] lg:h-[405px] xl:h-[440px] flex items-center justify-center overflow-visible my-1"
          >
            {/* Logo Draw on First Beat */}
            <AnimatePresence>
              {deckPhase === 'spread' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.35 }}
                  className="absolute z-50 pointer-events-none flex flex-col items-center justify-center drop-shadow-[0_8px_24px_rgba(240,180,41,0.5)]"
                >
                  <svg viewBox="0 0 160 60" className="w-32 sm:w-44 h-auto">
                    <motion.polygon
                      points="80,6 116,30 80,54 44,30"
                      stroke="var(--acc)"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: isMobile ? 0.45 : 0.65, ease: 'easeInOut' }}
                    />
                    <motion.path
                      d="M 24,46 L 24,14 L 40,14 L 50,25 L 40,36 L 24,36 M 38,36 L 50,46"
                      stroke="var(--bone)"
                      strokeWidth="2.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: isMobile ? 0.45 : 0.65, ease: 'easeInOut' }}
                    />
                    <motion.polygon
                      points="80,16 96,30 80,44 64,30"
                      stroke="var(--bone)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: isMobile ? 0.45 : 0.65, delay: 0.08, ease: 'easeInOut' }}
                    />
                    <motion.path
                      d="M 110,46 L 110,14 L 134,14 M 110,29 L 128,29"
                      stroke="var(--bone)"
                      strokeWidth="2.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: isMobile ? 0.45 : 0.65, delay: 0.12, ease: 'easeInOut' }}
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              style={{
                rotateX: stageRotateX,
                rotateY: stageRotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* 15 FOUNDATION DECK CARDS */}
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
                          ? Math.abs(i - 7.5) * 0.016
                          : deckPhase === 'riffling'
                            ? (i < 8 ? i * 2 : (i - 8) * 2 + 1) * 0.035
                            : 0,
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className={cn(
                      'absolute select-none pointer-events-none rounded-xl lg:rounded-2xl shadow-xl',
                      CARD_SIZE_CLASSES
                    )}
                  >
                    <CardBackFace />
                  </motion.div>
                )
              })}

              {/* 2. THE 5 CIRCULAR ROF LOOK CARDS */}
              {orderedCards.map((card, idx) => {
                const pos = getDestinyCardTransform(idx)
                const isSelected = activeCardIndex === idx
                const isCream = card.ground === 'cream'

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
                    title="Click to select • Double-tap to flip"
                    animate={{
                      x: pos.x,
                      y: pos.y,
                      z: pos.z,
                      rotateZ: pos.rotateZ,
                      rotateY: pos.rotateY,
                      scale: pos.scale,
                      zIndex: pos.zIndex,
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      filter: pos.filter,
                      opacity: 1, // 2. No opacity below 1 on card faces
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
                          ? Math.abs((15 + idx) - 7.5) * 0.016
                          : deckPhase === 'riffling'
                            ? ((6 + idx) * 2 + 1) * 0.035
                            : deckPhase === 'dealing'
                              ? idx * 0.25
                              : 0,
                    }}
                    whileHover={
                      deckPhase === 'dealt' && !isTouch && !prefersReduced
                        ? {
                          y: pos.y - 6, // 7. On hover lift the card 6px
                          scale: isSelected ? 1.08 : 0.98,
                          zIndex: 70,
                          transition: { duration: 0.2 },
                        }
                        : undefined
                    }
                    className={cn(
                      'group absolute select-none rounded-xl lg:rounded-2xl transition-shadow duration-300',
                      CARD_SIZE_CLASSES,
                      deckPhase === 'dealt'
                        ? 'cursor-pointer'
                        : 'pointer-events-none',
                      deckPhase === 'dealt' && isSelected
                        ? 'ring-2 ring-[var(--acc)] shadow-[0_20px_50px_rgba(240,180,41,0.32),0_10px_20px_rgba(0,0,0,0.65)]'
                        : 'shadow-[0_14px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_18px_36px_rgba(240,180,41,0.2)]'
                    )}
                  >
                    {/* FRONT FACE OF CARD */}
                    <div
                      style={{ backfaceVisibility: 'hidden' }}
                      className={cn(
                        'absolute inset-0 rounded-xl lg:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between overflow-hidden shadow-inner',
                        isCream
                          ? 'bg-[var(--bone)] text-[var(--ink)]'
                          : 'bg-[var(--surface-deep)] text-[var(--bone)]'
                      )}
                    >
                      {/* 7. One 900ms shimmer sweep when card becomes active */}
                      {isSelected && !prefersReduced && (
                        <motion.div
                          key={`shimmer-${card.id}-${activeCardIndex}`}
                          initial={{ x: '-150%', opacity: 0 }}
                          animate={{ x: '180%', opacity: [0, 0.55, 0] }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-y-0 -inset-x-1/2 w-full bg-gradient-to-r from-transparent via-[#ffe08a]/35 to-transparent -skew-x-12 pointer-events-none z-30"
                        />
                      )}

                      {/* Tailor-chalk hairline border */}
                      <div
                        className={cn(
                          'absolute inset-1 sm:inset-2 rounded-lg pointer-events-none border border-dashed',
                          isCream ? 'border-[var(--ink)]/20' : 'border-[var(--bone)]/25'
                        )}
                      >
                        {/* 7. Corner marks with gold foil gradient when active */}
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

                      {/* Top: "Look 0X" with gold foil gradient when active */}
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span
                          style={
                            isSelected
                              ? {
                                background: 'linear-gradient(135deg, #b8860b 0%, #f0b429 35%, #ffe08a 70%, #f0b429 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }
                              : undefined
                          }
                          className="font-serif text-xs sm:text-sm lg:text-base font-bold"
                        >
                          {card.lookNumber}
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--acc)] font-bold">
                          ROF
                        </span>
                      </div>

                      {/* Center: The tee cut-out with pointer parallax (moves 6px more) */}
                      <motion.div
                        style={{
                          x: !isTouch && !prefersReduced ? teeParallaxX : 0,
                          y: !isTouch && !prefersReduced ? teeParallaxY : 0,
                        }}
                        className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full overflow-visible py-1"
                      >
                        <img
                          src={card.garmentImage}
                          alt={card.garmentName}
                          width={320}
                          height={320}
                          loading="eager"
                          decoding="async"
                          style={{
                            filter: !isCream
                              ? 'drop-shadow(0 0 1px rgba(236, 227, 203, 0.5)) drop-shadow(0 14px 28px rgba(0, 0, 0, 0.45))'
                              : 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35))',
                          }}
                          className="w-full h-auto max-h-[140px] sm:max-h-[175px] md:max-h-[210px] lg:max-h-[245px] xl:max-h-[275px] object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Soft contact shadow beneath the tee */}
                        <div
                          className={cn(
                            'w-2/3 h-2 rounded-full blur-md mt-1 pointer-events-none',
                            isCream ? 'bg-black/30' : 'bg-black/60'
                          )}
                        />
                      </motion.div>

                      {/* Bottom: The piece name on the card only */}
                      <div className="relative z-10 text-center w-full pt-1 border-t border-[var(--acc)]/25">
                        <span className="font-serif text-[11px] sm:text-xs lg:text-sm font-bold truncate block">
                          {card.garmentName}
                        </span>
                      </div>
                    </div>

                    {/* REVERSE FACE OF CARD */}
                    <CardBackFace />
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Lit floor line under the hand */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 max-w-xl h-[1px] bg-gradient-to-r from-transparent via-[rgba(236,227,203,0.30)] to-transparent pointer-events-none" />

            {/* Reflection under the deck */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-6 bg-[rgba(236,227,203,0.07)] rounded-full blur-lg pointer-events-none" />
          </div>

          {/* 8. Readout row with 16px spacing */}
          <div className="my-4 font-mono text-[13px] sm:text-sm uppercase tracking-[0.2em] text-[var(--acc)] font-semibold text-center select-none">
            {activeGarment.garmentColor} / 0{activeGarment.id} of 05
          </div>

          {/* Bottom Thumbnail Strip with the 5 tee cut-outs (approx 56px, active underlined in gold) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 max-w-full overflow-x-auto px-4 py-1 no-scrollbar mb-2 select-none">
            {orderedCards.map((card, i) => {
              const isActive = activeCardIndex === i
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    skipToDealt()
                    handleSelectCard(i)
                  }}
                  aria-label={`Select ${card.lookNumber} ${card.garmentName}`}
                  className={cn(
                    'relative w-12 h-12 sm:w-14 sm:h-14 rounded-md flex items-center justify-center p-1 transition-all duration-200 cursor-pointer shrink-0 border',
                    isActive
                      ? 'border-[var(--acc)] bg-[var(--surface-deep)] shadow-[0_0_12px_rgba(240,180,41,0.35)] scale-105'
                      : 'border-[var(--hairline)] bg-[var(--ink)]/70 hover:border-[var(--bone)]/40 hover:bg-[var(--bone)]/5'
                  )}
                >
                  <img
                    src={card.garmentImage}
                    alt={card.garmentName}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                  {/* Active Gold Underline Indicator */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[var(--acc)] rounded-full shadow-[0_0_6px_var(--acc)]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* 1. Deck Pile Controls: Shuffle stack + Draw a card */}
          <div className="flex items-center justify-center gap-4 my-1 select-none">
            {/* Small stack of 6 to 8 card backs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShuffleAndRandomize()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleShuffleAndRandomize()
                  }
                }}
                aria-label="Shuffle and re-order cards"
                className="relative w-8 h-10 group cursor-pointer focus:outline-none min-h-[44px] flex items-center justify-center"
              >
                <div className="relative w-6 h-8.5">
                  {[0, 1, 2, 3, 4, 5, 6].map((stkIdx) => (
                    <div
                      key={stkIdx}
                      style={{
                        transform: `translate(${stkIdx * 1.5}px, -${stkIdx * 1.5}px)`,
                        zIndex: stkIdx,
                      }}
                      className="absolute inset-0 rounded-xs bg-[var(--surface-deep)] border border-[var(--acc)]/40 shadow-xs flex items-center justify-center transition-transform group-hover:-translate-y-0.5"
                    >
                      {stkIdx === 6 && (
                        <svg viewBox="0 0 30 30" className="w-3 h-3 text-[var(--acc)]">
                          <polygon points="15,3 27,15 15,27 3,15" stroke="currentColor" strokeWidth="1" fill="none" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShuffleAndRandomize()
                }}
                className="text-xs font-mono uppercase tracking-wider text-[var(--acc)] hover:text-[var(--bone)] transition-colors min-h-[44px] flex items-center cursor-pointer"
              >
                Shuffle
              </button>
            </div>

            <span className="text-[var(--hairline)]">|</span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleDrawNextCard()
              }}
              className="text-xs font-mono uppercase tracking-wider text-[var(--bone)]/70 hover:text-[var(--bone)] transition-colors min-h-[44px] flex items-center cursor-pointer"
            >
              Draw a card
            </button>
          </div>

          {/* Buttons: Shop the collection & Brand story */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1 mb-1">
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
              className="px-6 py-2 min-h-[40px] uppercase tracking-wider text-xs font-semibold cursor-pointer shadow-xl hover:shadow-[0_8px_30px_rgba(240,180,41,0.3)]"
            >
              Shop the collection
            </Button>

            <Link
              to="/story"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center px-5 py-2 min-h-[40px] border border-[var(--hairline)] hover:border-[var(--bone)] text-xs font-mono uppercase tracking-wider text-[var(--bone)] transition-colors bg-[var(--ink)]/80 backdrop-blur-md hover:bg-[var(--bone)]/5 rounded-xs"
            >
              Brand story
            </Link>
          </div>

          {/* Small "Scroll" cue with a diamond at the bottom centre */}
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--bone)]/40 mt-1 pointer-events-none">
            <span>Scroll</span>
            <DiamondMark size={3} accent filled />
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: RIGHT RAIL (w-[220px])                            */}
        {/* ============================================================ */}
        <div className="hidden lg:flex w-[220px] shrink-0 flex-col items-end text-right select-none z-20">
          {/* 5. Right numeral: large serif, 14px gap before 'of 05', thin gold line */}
          <div className="flex flex-col items-end gap-[14px]">
            <span className="font-serif font-extralight text-[clamp(80px,7.5vw,130px)] leading-none text-[var(--acc)] select-none tracking-tighter">
              0{activeGarment.id}
            </span>
            <span className="text-[13px] font-mono uppercase tracking-widest text-[rgba(236,227,203,0.70)]">
              of 05
            </span>
          </div>

          <span className="text-[13px] font-mono uppercase text-[var(--bone)] font-semibold mt-1">
            {activeGarment.garmentColor}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              const el = document.getElementById(`hook-0${activeGarment.id}`) || document.getElementById('collection-chapters')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
              else navigate({ to: '/shop' })
            }}
            className="inline-flex items-center gap-1.5 text-[13px] font-mono uppercase tracking-wider text-[var(--acc)] hover:text-[var(--bone)] mt-3 underline underline-offset-4 cursor-pointer transition-colors"
          >
            <span>Shop this look</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FULL-WIDTH BONE CREDENTIAL BAND                              */}
      {/* ============================================================ */}
      <div
        data-tone="bone"
        className="relative z-30 bg-[var(--bone)] text-[var(--ink)] border-t border-[var(--hairline)] px-4 md:px-8 py-2.5"
      >
        <div className="mx-auto max-w-[var(--max-content)] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5 font-semibold">
            <span className="text-[var(--acc-on-bone)]">ROF RAGE</span>
            <DiamondMark size={5} accent filled />
            <span>Clothing and fashion</span>
            <span className="hidden sm:inline">• Collection 01 / Five pieces</span>
          </div>

          <div className="flex items-center gap-4 text-[var(--ink)]/80">
            <span className="font-serif italic text-sm text-[var(--acc-on-bone)] font-bold">
              Destined for riches.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
