import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'motion/react'
import { Sparkles, BookOpen, Check, X, ShieldCheck, Layers } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiamondMark } from '@/components/Logo'
import { safeStorage } from '@/lib/storage'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'
import { getIsPageLoaderActive } from '@/components/PageLoader'

interface HeroStageProps {
  className?: string
}

// ---------------------------------------------------------------------------
// CRISP VECTOR DIE COMPONENT (Sharp at all DPIs with Gold Pips)
// ---------------------------------------------------------------------------
const DIE_DOT_COORDS: Record<number, Array<[number, number]>> = {
  1: [[10, 10]],
  2: [[6, 6], [14, 14]],
  3: [[6, 6], [10, 10], [14, 14]],
  4: [[6, 6], [14, 6], [6, 14], [14, 14]],
  5: [[6, 6], [14, 6], [10, 10], [6, 14], [14, 14]],
  6: [[6, 5], [14, 5], [6, 10], [14, 10], [6, 15], [14, 15]],
}

const DieFace: React.FC<{ value: number }> = ({ value }) => {
  const dots = DIE_DOT_COORDS[value] || DIE_DOT_COORDS[1]
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0 overflow-visible" aria-hidden="true">
      <rect
        x="1.5"
        y="1.5"
        width="17"
        height="17"
        rx="3.5"
        fill="var(--surface-deep)"
        stroke="var(--acc)"
        strokeWidth="1.25"
      />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="var(--acc)" />
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// ISOLATED MEMOIZED LAGOS CLOCK (Prevents parent stage re-renders every 1s)
// ---------------------------------------------------------------------------
const LagosClock = React.memo(() => {
  const [timeStr, setTimeStr] = useState<string>('12:00:00')

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
        setTimeStr(time)
      } catch {
        const d = new Date()
        setTimeStr(d.toTimeString().split(' ')[0])
      }
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return <span className="tracking-wider text-[11px] sm:text-xs">LAGOS {timeStr} WAT</span>
})

// ---------------------------------------------------------------------------
// 20-CARD DECK CONSTANTS & REUSABLE CARD BACK COMPONENT
// ---------------------------------------------------------------------------
const CARD_SIZE_CLASSES =
  'w-[140px] h-[215px] sm:w-[185px] sm:h-[280px] md:w-[215px] md:h-[325px] lg:w-[245px] lg:h-[365px] xl:w-[275px] xl:h-[410px] 2xl:w-[295px] 2xl:h-[440px]'

// 17 foundation cards forming the 20-card pile with the 3 destiny cards
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
// THE 3 CARDS OF ROF: ROOF • OF • FRAME (AMBITION • CONFIDENCE • ORIGINALITY)
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
  creed: string
  reflection: string
  codexEssay: string
  serial: string
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
    creed: 'Roof stands for the apex. We build above the noise, outwork doubt, and relentlessly claim the heights of greatness.',
    reflection: 'What is the highest ambition you are dedicating your craft to today?',
    codexEssay:
      'The Roof represents the shelter and the summit. It is the pinnacle under which relentless ambition is forged. In Lagos or anywhere across the globe, the true architects of culture rise without asking for permission.',
    serial: 'ROF-ROOF-8821',
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
    creed: 'The sacred connective geometry of the Diamond. Cut sharp with mathematical precision and worn with quiet conviction.',
    reflection: 'Can you hold your calm conviction while the world around you is loud?',
    codexEssay:
      'The sacred concentric diamond at the heart of ROF. Formed under subterranean weight, it transforms pressure into brilliant geometry. Confidence is the unbreakable certainty of your core.',
    serial: 'ROF-OF-9940',
  },
  {
    id: 3,
    letter: 'F',
    word: 'FRAME',
    pillar: 'ORIGINALITY',
    number: '03',
    roman: 'III',
    label: 'FRAME',
    title: 'THE ARCHITECTURAL SKELETON',
    mantra: 'Heavyweight intention in every seam. An unbreakable frame built to outlast trends.',
    creed: 'Frame is the foundation and structure. Heavyweight 260 GSM combed terry engineered to outlive temporary hype.',
    reflection: 'What are you crafting today that will stand ten years from now?',
    codexEssay:
      'A flawless frame defines true permanence. Fast trends come and dissolve within weeks, but a solid architectural frame endures for generations. ROOF OF FRAME is the standard of original greatness.',
    serial: 'ROF-FRAME-7703',
  },
]

const DICE_OUTCOMES: Record<number, { title: string; desc: string; perk: string; cardIndex: number }> = {
  1: {
    title: 'AMBITION IGNITED',
    desc: 'The relentless drive starts now. Outwork doubt and claim the summit.',
    perk: 'MINDSET UNLOCKED: THE ROOF APEX',
    cardIndex: 0,
  },
  2: {
    title: 'PRESSURE ENDURED',
    desc: 'Resilience solidifies the core. The subterranean heat forges true strength.',
    perk: 'MINDSET UNLOCKED: 260 GSM RESILIENCE',
    cardIndex: 0,
  },
  3: {
    title: 'CONFIDENCE REFINED',
    desc: 'The sacred diamond cuts through noise. Quiet certainty in every room.',
    perk: 'MINDSET UNLOCKED: SACRED CONFIDENCE',
    cardIndex: 1,
  },
  4: {
    title: 'ORIGINALITY WOVEN',
    desc: 'Architectural distinction engineered in heavyweight combed terry.',
    perk: 'MINDSET UNLOCKED: UNBROKEN FRAME',
    cardIndex: 2,
  },
  5: {
    title: 'ROOF OF FAME REACHED',
    desc: 'Heavyweight intention recognized. The pinnacle belongs to the relentless.',
    perk: 'MINDSET UNLOCKED: ARCHITECTURAL ASCENT',
    cardIndex: 0,
  },
  6: {
    title: 'DESTINED FOR RICHES',
    desc: 'The winning roll. Your destiny is secured. No permission asked.',
    perk: 'SUPREME DESTINY SECURED • VIP PASS',
    cardIndex: 1,
  },
}

export const HeroStage: React.FC<HeroStageProps> = ({ className }) => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  const [activeCardIndex, setActiveCardIndex] = useState<number>(1) // Center 'O' card default
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({}) // Per-card flip state
  const flipTimersRef = useRef<Record<number, NodeJS.Timeout>>({})
  const lastTapTimeRef = useRef<Record<number, number>>({})
  const [isTouch, setIsTouch] = useState(true)
  const [sealedMindset, setSealedMindset] = useState<string | null>(null)
  const [isSealing, setIsSealing] = useState(false)
  const [showCodex, setShowCodex] = useState(false)
  const [showSpecs, setShowSpecs] = useState(false)
  const [diceRolling, setDiceRolling] = useState(false)
  const [diceNumber, setDiceNumber] = useState<number>(6)
  const [hasRolled, setHasRolled] = useState(false)
  const [showRollOutcome, setShowRollOutcome] = useState(false)
  const [deckPhase, setDeckPhase] = useState<'spread' | 'gathering' | 'splitting' | 'riffling' | 'bridge' | 'squaring' | 'dealing' | 'dealt'>('spread')
  const [screenWidth, setScreenWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )

  const stageRef = useRef<HTMLDivElement>(null)
  const rollButtonRef = useRef<HTMLButtonElement>(null)
  const decreeRef = useRef<HTMLDivElement>(null)
  const isShufflingRef = useRef(false)

  // 20-Card Realistic Ritual: Plenty Faced Backward -> Gathered -> Shuffled (Split, Riffle, Bridge) -> R • O • F Deal
  const handleShuffleDeck = useCallback(() => {
    if (isShufflingRef.current) return
    isShufflingRef.current = true

    // Clear any active individual card flip timers and reset flip state
    Object.values(flipTimersRef.current).forEach((timer) => clearTimeout(timer))
    flipTimersRef.current = {}
    setFlippedCards({})

    // Step 1: 20 cards face-down in wide table ribbon spread ("faced backward plenty")
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
      // Display the wide ribbon spread of 20 cards faced backward for 850ms so user clearly takes it in, then gather & shuffle
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

  // Accessible Decree Focus & Escape Handling
  useEffect(() => {
    if (showRollOutcome) {
      const timer = setTimeout(() => {
        decreeRef.current?.focus()
      }, 50)

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowRollOutcome(false)
          rollButtonRef.current?.focus()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [showRollOutcome])

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Restore sealed mindset from safeStorage
  useEffect(() => {
    const stored = safeStorage.getItem('rof_sealed_mindset')
    if (stored) {
      setSealedMindset(stored)
    }
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
    if (!stageRef.current) return
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

      setFlippedCards((prev) => {
        const isCurrentlyFlipped = Boolean(prev[idx])
        const willBeFlipped = !isCurrentlyFlipped

        // Clear existing timer if any for this card
        if (flipTimersRef.current[idx]) {
          clearTimeout(flipTimersRef.current[idx])
          delete flipTimersRef.current[idx]
        }

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

  // Handle Dice Roll & Destiny Revelation
  const handleRollDice = useCallback(() => {
    if (diceRolling) return
    setDiceRolling(true)
    setShowRollOutcome(false)
    setTimeout(() => {
      const outcomes = [1, 2, 3, 4, 5, 6, 6]
      const nextRoll = outcomes[Math.floor(Math.random() * outcomes.length)]
      setDiceNumber(nextRoll)
      setDiceRolling(false)
      setHasRolled(true)
      setShowRollOutcome(true)
      const outcome = DICE_OUTCOMES[nextRoll]
      if (outcome) {
        setActiveCardIndex(outcome.cardIndex)
      }
    }, 550)
  }, [diceRolling])

  // Seal Current Mindset Ritual
  const handleSealMindset = useCallback(() => {
    const card = ROF_CARDS[activeCardIndex]
    setIsSealing(true)

    setTimeout(() => {
      setSealedMindset(card.label)
      safeStorage.setItem('rof_sealed_mindset', card.label)
      window.dispatchEvent(new Event('rof-mindset-update'))
      setIsSealing(false)
    }, 600)
  }, [activeCardIndex])

  const currentCard = ROF_CARDS[activeCardIndex]
  const isCurrentCardSealed = sealedMindset === currentCard.label
  const currentOutcome = DICE_OUTCOMES[diceNumber]

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
        rotateY: 180, // ALL 20 cards face-down
        opacity: 1,
        scale: 1,
      }
    }

    if (deckPhase === 'gathering') {
      return {
        x: 0,
        y: -i * 1.4,
        z: i * 2,
        rotateZ: 0,
        rotateY: 180,
        opacity: 1,
        scale: 1,
      }
    }

    if (deckPhase === 'splitting') {
      return {
        x: isLeft ? -125 - packetIdx * 1.5 : 125 + packetIdx * 1.5,
        y: -packetIdx * 1.8 - 18,
        z: packetIdx * 2.5 + 20,
        rotateZ: isLeft ? -14 : 14,
        rotateY: isLeft ? 195 : 165,
        opacity: 1,
        scale: 1.02,
      }
    }

    if (deckPhase === 'riffling') {
      return {
        x: isLeft ? -5 : 5,
        y: -interleaveOrder * 1.35,
        z: interleaveOrder * 2.5,
        rotateZ: isLeft ? -1.5 : 1.5,
        rotateY: 180,
        opacity: 1,
        scale: 1,
      }
    }

    if (deckPhase === 'bridge') {
      return {
        x: isLeft ? -30 + packetIdx * 2.2 : 30 - packetIdx * 2.2,
        y: -28 - Math.sin((packetIdx / 9) * Math.PI) * 20,
        z: 42 + packetIdx * 2,
        rotateZ: isLeft ? -10 + packetIdx * 0.8 : 10 - packetIdx * 0.8,
        rotateY: isLeft ? 188 : 172,
        opacity: 1,
        scale: 1.02,
      }
    }

    if (deckPhase === 'squaring') {
      return {
        x: 0,
        y: -i * 1.3,
        z: i * 2,
        rotateZ: 0,
        rotateY: 180,
        opacity: 1,
        scale: 1,
      }
    }

    // 'dealing' or 'dealt': Foundation deck sits subtly centered behind
    return {
      x: 0,
      y: 20 - i * 0.35,
      z: -30 + i * 0.8,
      rotateZ: 0,
      rotateY: 180,
      opacity: 0.16,
      scale: 0.94,
    }
  }

  const getDestinyCardTransform = (idx: number) => {
    const cardI = 17 + idx // Top 3 cards in 20-card deck
    const isLeft = cardI < 10
    const packetIdx = cardI - 10
    const interleaveOrder = isLeft ? cardI * 2 : (cardI - 10) * 2 + 1
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

  return (
    <section
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-tone="ink"
      className={cn(
        'relative min-h-[94svh] w-full flex flex-col justify-between pt-14 sm:pt-16 pb-3 sm:pb-5 border-b border-[var(--hairline)] grain-overlay overflow-hidden select-none cursor-default bg-[var(--ink)]',
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
              scale: [0.95, 1.05, 0.95],
              opacity: [0.22, 0.32, 0.22],
            }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          x: isTouch || prefersReduced ? 0 : spotlightX,
          y: isTouch || prefersReduced ? 0 : spotlightY,
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1200px] h-[650px] pointer-events-none z-0"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(240,180,41,0.18)_0%,rgba(236,227,203,0.05)_45%,transparent_70%)] blur-3xl" />
      </motion.div>

      {/* Precision Geometric Watermark (Clean Architectural Diamond) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <svg
          viewBox="0 0 500 500"
          className="w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] lg:w-[680px] lg:h-[680px] opacity-[0.04] text-[var(--bone)]"
        >
          <polygon points="250,20 480,250 250,480 20,250" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <polygon points="250,60 440,250 250,440 60,250" stroke="currentColor" strokeWidth="1" fill="none" />
          <polygon points="250,110 390,250 250,390 110,250" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" fill="none" />
          <polygon points="250,160 340,250 250,340 160,250" stroke="var(--acc)" strokeWidth="1" fill="none" />
          <line x1="250" y1="20" x2="250" y2="480" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 6" />
          <line x1="20" y1="250" x2="480" y2="250" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 6" />
        </svg>
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

      {/* Floating Diamond Embers in Peripheral Atmosphere (Away from interactive zones) */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[
            { top: '20%', left: '5%', size: 4, delay: 0 },
            { top: '32%', left: '94%', size: 5, delay: 1.2 },
            { top: '56%', left: '4%', size: 5, delay: 0.8 },
            { top: '68%', left: '95%', size: 4, delay: 1.8 },
          ].map((pt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2, y: 0 }}
              animate={{ opacity: [0.2, 0.7, 0.2], y: [-8, 8, -8] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: pt.delay }}
              style={{ top: pt.top, left: pt.left }}
              className="absolute text-[var(--acc)] opacity-35"
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

          {/* Specs & Live Clock Controls with Accessible Touch Targets */}
          <div className="flex items-center gap-1.5 sm:gap-3 font-mono text-xs text-[var(--bone)]">
            {/* Fabric Specs Button */}
            <button
              type="button"
              onClick={() => setShowSpecs(!showSpecs)}
              title="Inspect 260 GSM Heavyweight Specs"
              aria-label="Inspect 260 GSM Heavyweight Fabric Specs"
              className={cn(
                'flex items-center gap-1 px-3 sm:px-2.5 py-2 sm:py-1 min-h-[44px] sm:min-h-0 border text-[10px] uppercase tracking-wider cursor-pointer transition-colors rounded-xs',
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
              onClick={() => setShowCodex(true)}
              title="Open The ROF Mindset Codex"
              aria-label="Open The ROF Mindset Codex"
              className="flex items-center gap-1 px-3 sm:px-2.5 py-2 sm:py-1 min-h-[44px] sm:min-h-0 border border-[var(--hairline)] hover:border-[var(--bone)] text-[10px] uppercase tracking-wider text-[var(--bone)]/80 hover:text-[var(--bone)] cursor-pointer transition-colors bg-[var(--ink)]/70 rounded-xs"
            >
              <BookOpen size={11} className="text-[var(--acc)]" />
              <span className="hidden sm:inline">CODEX</span>
            </button>

            {/* Live Clock (Isolated Micro-Component) */}
            <div className="flex items-center gap-1.5 pl-1 border-l border-[var(--hairline)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
              <LagosClock />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CENTERPIECE: UNCLUTTERED MONUMENTAL HERO */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-2 sm:py-4 px-4 md:px-8 text-center">
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

        {/* Minimalist Subtitle */}
        <p className="font-mono text-[10px] sm:text-xs text-[var(--muted)] uppercase tracking-[0.28em] mb-3 sm:mb-4">
          ROF TRINITY // ROOF • OF • FRAME
        </p>

        {/* 3D Tilted Perspective Canvas - Monumental on Big Screens */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full max-w-[640px] md:max-w-[820px] lg:max-w-[1020px] xl:max-w-[1240px] 2xl:max-w-[1420px] h-[260px] sm:h-[320px] md:h-[380px] lg:h-[430px] xl:h-[480px] 2xl:h-[520px] flex items-center justify-center mb-5 sm:mb-6"
        >
          <motion.div
            style={{
              rotateX: stageRotateX,
              rotateY: stageRotateY,
              z: stageTranslateZ,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Deep Contact Shadow */}
            <div className="absolute -bottom-6 lg:-bottom-10 w-4/5 h-10 lg:h-14 bg-black/80 blur-2xl lg:blur-3xl rounded-full pointer-events-none" />

            {/* 17 FOUNDATION CARDS (FORMING 20-CARD DECK WITH THE 3 TRINITY CARDS) */}
            {DECK_FOUNDATION_CARDS.map((deckCard) => {
              const pos = getDeckCardTransform(deckCard.index)
              return (
                <motion.div
                  key={deckCard.id}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                    rotateZ: pos.rotateZ,
                    rotateY: pos.rotateY,
                    opacity: pos.opacity,
                    scale: pos.scale,
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
                        ? Math.abs(deckCard.index - 8.5) * 0.016
                        : deckPhase === 'riffling'
                          ? (deckCard.index < 10 ? deckCard.index * 2 : (deckCard.index - 10) * 2 + 1) * 0.035
                          : 0,
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className={cn(
                    'absolute pointer-events-none select-none rounded-xl lg:rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,0.65)]',
                    CARD_SIZE_CLASSES
                  )}
                >
                  {/* Subtle Front Specimen Face */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 rounded-xl lg:rounded-2xl p-3 sm:p-4 flex flex-col justify-between bg-[var(--bone-surface)] text-[var(--ink)] border border-[var(--acc)]/30 overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-[7px] font-mono text-[var(--ink)]/50 uppercase">
                      <span>SPECIMEN // {deckCard.serial}</span>
                      <DiamondMark size={4} accent filled />
                    </div>
                    <div className="flex flex-col items-center justify-center my-auto opacity-20">
                      <DiamondMark size={14} accent />
                      <span className="font-serif text-lg text-[var(--ink)] font-bold mt-1">ROF</span>
                    </div>
                    <div className="text-[6px] font-mono text-[var(--ink)]/40 uppercase tracking-widest text-center">
                      HEAVYWEIGHT TERRY ARCHIVE
                    </div>
                  </div>

                  {/* Sacred Card Back Face */}
                  <CardBackFace serial={deckCard.serial} />
                </motion.div>
              )
            })}

            {/* THE 3 TRINITY CARDS: ROOF [R] • OF [O] • FRAME [F] */}
            {ROF_CARDS.map((card, idx) => {
              const pos = getDestinyCardTransform(idx)
              const isSelected = activeCardIndex === idx
              const isCardSealed = sealedMindset === card.label

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
                    'absolute select-none rounded-xl lg:rounded-2xl transition-shadow duration-300',
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
                    className="absolute inset-0 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 flex flex-col justify-between bg-[var(--bone-surface)] text-[var(--ink)] border border-[var(--acc)]/30 overflow-hidden"
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
                    <div className="absolute inset-2 sm:inset-2.5 border border-[var(--acc)]/30 rounded-lg pointer-events-none">
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

                    {/* Top Header Row with Index Pip */}
                    <div className="relative z-10 flex items-start justify-between w-full">
                      {/* Top-Left Card Corner Pip */}
                      <div className="flex flex-col items-center leading-none text-left">
                        <span
                          className={cn(
                            'font-serif text-xl sm:text-2xl lg:text-3xl font-bold',
                            card.letter === 'O' ? 'text-[var(--acc-on-bone)]' : 'text-[var(--ink)]'
                          )}
                        >
                          {card.letter}
                        </span>
                        <DiamondMark
                          size={6}
                          accent={card.letter === 'O'}
                          filled
                          className="mt-0.5 opacity-90"
                        />
                        <span className="font-mono text-[7px] sm:text-[8px] text-[var(--muted)] font-bold mt-0.5">
                          {card.roman}
                        </span>
                      </div>

                      {/* Top Center Archive Tag */}
                      <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.26em] text-[var(--ink)]/45 font-semibold mt-0.5">
                        ARCHIVE 01
                      </span>

                      {/* Sealed Status Indicator if Active */}
                      {isCardSealed ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[var(--acc)] text-[var(--label-on-acc)] font-mono text-[7px] uppercase tracking-wider font-bold rounded-xs shadow-xs">
                          <Check size={8} strokeWidth={3} />
                          <span>SEALED</span>
                        </span>
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>

                    {/* Center Monumental Art with Architectural Geometry */}
                    <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full">
                      {card.letter === 'R' ? (
                        /* CARD R: ROOF APEX SUMMIT MOTIF */
                        <div className="relative flex items-center justify-center mb-1">
                          <svg
                            viewBox="0 0 100 100"
                            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-30 lg:h-30 text-[var(--ink)]/15 absolute inset-0 m-auto pointer-events-none"
                          >
                            <polygon points="50,12 88,78 12,78" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <polygon points="50,26 78,74 22,74" stroke="currentColor" strokeWidth="1" fill="none" />
                            <line x1="50" y1="12" x2="50" y2="78" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                            <polygon points="50,4 56,12 50,20 44,12" fill="var(--acc)" />
                          </svg>
                          <span className="relative z-10 font-serif font-bold text-5xl sm:text-6xl lg:text-7xl text-[var(--ink)] drop-shadow-sm">
                            R
                          </span>
                        </div>
                      ) : card.letter === 'O' ? (
                        /* CARD O: SACRED CONCENTRIC DIAMOND */
                        <div className="relative flex items-center justify-center mb-1">
                          <svg
                            viewBox="0 0 100 100"
                            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-30 lg:h-30 text-[var(--acc-on-bone)]"
                          >
                            <polygon
                              points="50,8 92,50 50,92 8,50"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              fill="rgba(143,82,0,0.06)"
                            />
                            <polygon
                              points="50,22 78,50 50,78 22,50"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              fill="rgba(143,82,0,0.12)"
                            />
                            <polygon points="50,34 66,50 50,66 34,50" stroke="currentColor" strokeWidth="1" fill="none" />
                            <circle cx="50" cy="50" r="3.5" fill="currentColor" />
                          </svg>
                          <span className="absolute font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-[var(--acc-on-bone)] drop-shadow-sm">
                            O
                          </span>
                        </div>
                      ) : (
                        /* CARD F: 260 GSM ARCHITECTURAL FRAME WIREFRAME */
                        <div className="relative flex items-center justify-center mb-1">
                          <svg
                            viewBox="0 0 100 100"
                            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-30 lg:h-30 text-[var(--ink)]/15 absolute inset-0 m-auto pointer-events-none"
                          >
                            <rect x="14" y="14" width="72" height="72" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <line x1="14" y1="14" x2="86" y2="86" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                            <line x1="86" y1="14" x2="14" y2="86" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                            <rect x="28" y="28" width="44" height="44" stroke="currentColor" strokeWidth="1" fill="none" />
                            <polygon points="50,14 54,18 50,22 46,18" fill="var(--acc)" />
                            <polygon points="50,78 54,82 50,86 46,82" fill="var(--acc)" />
                          </svg>
                          <span className="relative z-10 font-serif font-bold text-5xl sm:text-6xl lg:text-7xl text-[var(--ink)] drop-shadow-sm">
                            F
                          </span>
                        </div>
                      )}

                      {/* Card Meaning & Pillar Tag (R = ROOF, O = OF, F = FRAME) */}
                      <span className="relative z-10 font-mono text-[11px] sm:text-xs lg:text-sm uppercase tracking-[0.24em] font-bold text-[var(--ink)] mt-0.5">
                        {card.word}
                      </span>
                      <span className="relative z-10 font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.22em] text-[var(--acc-on-bone)] font-semibold">
                        {card.pillar} // {card.number}
                      </span>
                    </div>

                    {/* Bottom-Right Inverted Corner Pip */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <span className="font-mono text-[7px] sm:text-[8px] text-[var(--ink)]/40 uppercase tracking-widest">
                        {card.serial.replace('ROF-', '')}
                      </span>
                      <div className="flex flex-col items-center leading-none text-right rotate-180">
                        <span
                          className={cn(
                            'font-serif text-xl sm:text-2xl lg:text-3xl font-bold',
                            card.letter === 'O' ? 'text-[var(--acc-on-bone)]' : 'text-[var(--ink)]'
                          )}
                        >
                          {card.letter}
                        </span>
                        <DiamondMark
                          size={6}
                          accent={card.letter === 'O'}
                          filled
                          className="mt-0.5 opacity-90"
                        />
                      </div>
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
        {/* DESTINY REVELATION DECREE (INSTANT ROLL REWARD & FEEDBACK) */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showRollOutcome && !diceRolling && currentOutcome && (
            <motion.div
              ref={decreeRef}
              role="region"
              aria-label="Destiny Revealed Decree"
              aria-live="polite"
              tabIndex={-1}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl mx-auto mb-4 p-4 sm:p-5 bg-[var(--surface-deep)]/95 border-2 border-[var(--acc)] rounded-lg shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(240,180,41,0.25)] backdrop-blur-xl relative overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc)]"
            >
              {/* Top gold bar glow with kinetic light ray */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--acc)]/30 to-transparent overflow-hidden">
                <motion.div
                  animate={prefersReduced ? {} : { x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: [0.16, 1, 0.3, 1], repeatDelay: 1 }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-[var(--acc)] to-transparent"
                />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-[var(--acc)] text-[var(--label-on-acc)] font-mono font-bold text-sm shadow-md">
                    {diceNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--acc)] uppercase tracking-widest font-bold">
                      <Sparkles size={11} />
                      <span>DESTINY REVEALED • ARCHIVE DECREE</span>
                    </div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-[var(--bone)] leading-tight">
                      {currentOutcome.title}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowRollOutcome(false)
                    rollButtonRef.current?.focus()
                  }}
                  className="p-1 text-[var(--muted)] hover:text-[var(--bone)] cursor-pointer"
                  title="Close Decree"
                  aria-label="Close Destiny Decree"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-[var(--bone)]/90 leading-relaxed font-sans">
                "{currentOutcome.desc}"
              </p>

              <div className="mt-3 pt-3 border-t border-[var(--hairline)] flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--acc)] uppercase tracking-wider font-bold">
                  <ShieldCheck size={13} />
                  <span>{currentOutcome.perk}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSealMindset}
                    className={cn(
                      'px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold rounded-xs cursor-pointer transition-all flex items-center gap-1 shadow-sm',
                      isCurrentCardSealed
                        ? 'bg-[var(--surface-lift)] text-[var(--acc)] border border-[var(--acc)]'
                        : 'bg-[var(--acc)] text-[var(--label-on-acc)] hover:brightness-110'
                    )}
                  >
                    <Check size={11} strokeWidth={3} />
                    <span>{isCurrentCardSealed ? 'DESTINY SEALED ✓' : 'SEAL DESTINY'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRollDice}
                    className="px-2.5 py-1 border border-[var(--hairline)] hover:border-[var(--bone)] text-[10px] font-mono uppercase tracking-wider text-[var(--bone)] rounded-xs cursor-pointer bg-[var(--ink)]/60"
                  >
                    RE-ROLL
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clean Tactical Controls & Action Row (Uncluttered) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Interactive Destiny Die Button with Dynamic State & Feedback */}
          <motion.button
            ref={rollButtonRef}
            type="button"
            onClick={handleRollDice}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] rounded-sm shadow-lg border cursor-pointer transition-all select-none",
              hasRolled
                ? "bg-[var(--surface-lift-hover)] hover:brightness-110 text-[var(--bone)] border-[var(--acc)] shadow-[0_4px_20px_rgba(240,180,41,0.25)]"
                : "bg-[var(--surface-lift)] hover:bg-[var(--surface-lift-hover)] text-[var(--bone)] border-[var(--acc)]/50"
            )}
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
              className="flex items-center justify-center shrink-0"
            >
              <DieFace value={diceNumber} />
            </motion.div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              {diceRolling ? (
                'ROLLING DESTINY...'
              ) : hasRolled ? (
                <>
                  <span>DESTINY [{diceNumber}]:</span>
                  <span className="text-[var(--acc)]">{currentOutcome?.title}</span>
                  <Check size={12} className="text-[var(--acc)]" />
                </>
              ) : (
                `DESTINY ROLL [${diceNumber}]`
              )}
            </span>
          </motion.button>

          {/* Primary CTA: Witness The Capsule */}
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
            Witness The Capsule
          </Button>

          {/* Brand Story Link */}
          <Link
            to="/story"
            className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] border border-[var(--hairline)] hover:border-[var(--bone)] text-xs font-mono uppercase tracking-wider text-[var(--bone)] transition-colors bg-[var(--ink)]/80 backdrop-blur-md hover:bg-[var(--bone)]/5 rounded-xs"
          >
            Brand Story
          </Link>
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
            role="dialog"
            aria-modal="true"
            aria-label="The ROF Mindset Codex"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg select-text"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[var(--surface-deep)] border border-[var(--hairline)] rounded-lg p-6 sm:p-8 text-[var(--bone)] shadow-2xl"
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
                  aria-label="Close Mindset Codex"
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
