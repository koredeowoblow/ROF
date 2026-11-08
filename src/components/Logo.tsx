import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  animated?: boolean
  ghost?: boolean
  size?: 'sm' | 'md' | 'lg' | 'hero'
  replayKey?: number | string
}

/**
 * ROF Angular Wordmark Logo
 * Angular line wordmark "ROF" where the O is drawn as a diamond.
 * Stroke only.
 * Features 1.1s stroke-dash drawing entrance, separate R, O, F letter animation,
 * and ambient levitation for hero stage.
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  animated = false,
  ghost = false,
  size = 'md',
  replayKey,
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    hero: 'w-full max-w-[840px] h-auto',
  }

  // Hero Background Animated Ghost Mode: R, Diamond O, and F animated with visible stroke drawing & ambient float
  if (ghost) {
    return (
      <svg
        key={replayKey}
        viewBox="0 0 280 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          sizeClasses[size],
          'pointer-events-none select-none text-[var(--bone)]',
          className
        )}
        aria-hidden="true"
      >
        {/* 'R' Path with stroke drawing & gentle floating */}
        <motion.path
          d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0, 0.22, 0.16],
            y: [0, -4, 0],
          }}
          transition={{
            pathLength: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.2 },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* 'O' Diamond Outer Contour with stroke drawing */}
        <motion.polygon
          points="140,8 178,46 140,84 102,46"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0, 0.24, 0.18],
            y: [0, -5, 0],
          }}
          transition={{
            pathLength: { duration: 1.1, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.2, delay: 0.18 },
            y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
          }}
        />

        {/* 'O' Inner Accent Diamond with Dynamic Red Pulse */}
        <motion.polygon
          points="140,24 158,46 140,68 122,46"
          stroke="var(--acc)"
          strokeWidth="3.5"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, scale: 0.8, opacity: 0 }}
          animate={{
            pathLength: 1,
            scale: [1, 1.08, 1],
            opacity: [0.45, 0.9, 0.45],
            y: [0, -5, 0],
          }}
          transition={{
            pathLength: { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
          }}
        />

        {/* 'F' Path with stroke drawing & gentle floating */}
        <motion.path
          d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0, 0.22, 0.16],
            y: [0, -4, 0],
          }}
          transition={{
            pathLength: { duration: 1.1, delay: 0.32, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.2, delay: 0.32 },
            y: { duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
          }}
        />
      </svg>
    )
  }

  // Standard Animated Mode (Header & Login)
  if (animated) {
    return (
      <svg
        key={replayKey}
        viewBox="0 0 280 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size], 'overflow-visible text-[var(--fg)]', className)}
        aria-label="ROF logo"
      >
        {/* R path */}
        <motion.path
          d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Diamond O */}
        <motion.polygon
          points="140,8 178,46 140,84 102,46"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Inner subtle diamond accent */}
        <motion.polygon
          points="140,24 158,46 140,68 122,46"
          stroke="var(--acc)"
          strokeWidth="2.5"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0.4, 0.9, 0.4],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            pathLength: { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        {/* F path */}
        <motion.path
          d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    )
  }

  // Static Fallback
  return (
    <svg
      viewBox="0 0 280 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], 'text-[var(--fg)]', className)}
      aria-label="ROF logo"
    >
      <path
        d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <polygon
        points="140,8 178,46 140,84 102,46"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="miter"
      />
      <polygon
        points="140,24 158,46 140,68 122,46"
        stroke="var(--acc)"
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />
      <path
        d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

/**
 * Dedicated Interactive Hero R-O-F Letters Component
 * Prominently presents the letters R, Diamond O, and F with:
 * - 1.1s stroke-dash entrance drawing
 * - Out-of-phase levitation floating for each letter
 * - Interactive hover & tap states with red accent illumination
 * - Replayable kinetic drawing trigger
 */
interface HeroROFLettersProps {
  className?: string
  replayKey?: number | string
  onLetterHover?: (letter: 'R' | 'O' | 'F' | null) => void
}

export const HeroROFLetters: React.FC<HeroROFLettersProps> = ({
  className,
  replayKey = 0,
  onLetterHover,
}) => {
  const [hoveredLetter, setHoveredLetter] = useState<'R' | 'O' | 'F' | null>(null)

  const handleHover = (letter: 'R' | 'O' | 'F' | null) => {
    setHoveredLetter(letter)
    if (onLetterHover) onLetterHover(letter)
  }

  return (
    <div className={cn('relative inline-flex flex-col items-center select-none', className)}>
      <svg
        key={replayKey}
        viewBox="0 0 280 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible cursor-pointer"
        role="group"
        aria-label="Interactive ROF wordmark"
      >
        {/* ======================================================== */}
        {/* LETTER 'R': Ambition / Journey */}
        {/* ======================================================== */}
        <motion.g
          tabIndex={0}
          role="button"
          aria-label="Letter R: Ambition"
          onMouseEnter={() => handleHover('R')}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => handleHover('R')}
          onBlur={() => handleHover(null)}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            y: [0, -3.5, 0],
          }}
          transition={{
            y: { duration: 5.6, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.2 },
          }}
          className="outline-none"
        >
          {/* Background interactive hitbox */}
          <rect x="10" y="5" width="85" height="80" fill="transparent" />

          {/* Glowing accent aura on hover */}
          {hoveredLetter === 'R' && (
            <motion.path
              d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
              stroke="var(--acc)"
              strokeWidth="10"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="filter blur-[4px]"
            />
          )}

          {/* Main 'R' Stroke */}
          <motion.path
            d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
            stroke={hoveredLetter === 'R' ? 'var(--acc)' : 'var(--bone)'}
            strokeWidth="6"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.g>

        {/* ======================================================== */}
        {/* LETTER 'O': The Signature Diamond / Mindset */}
        {/* ======================================================== */}
        <motion.g
          tabIndex={0}
          role="button"
          aria-label="Diamond O: The Mindset"
          onMouseEnter={() => handleHover('O')}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => handleHover('O')}
          onBlur={() => handleHover(null)}
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
            scale: { duration: 0.2 },
          }}
          className="outline-none"
        >
          {/* Hitbox */}
          <rect x="95" y="5" width="90" height="80" fill="transparent" />

          {/* Outer glow on hover */}
          {hoveredLetter === 'O' && (
            <motion.polygon
              points="140,8 178,46 140,84 102,46"
              stroke="var(--acc)"
              strokeWidth="11"
              strokeLinejoin="miter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              className="filter blur-[4px]"
            />
          )}

          {/* Outer Diamond */}
          <motion.polygon
            points="140,8 178,46 140,84 102,46"
            stroke={hoveredLetter === 'O' ? 'var(--acc)' : 'var(--bone)'}
            strokeWidth="6"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Inner Accent Diamond with Pulse & Breathing */}
          <motion.polygon
            points="140,24 158,46 140,68 122,46"
            stroke="var(--acc)"
            strokeWidth="3.2"
            strokeLinejoin="miter"
            initial={{ pathLength: 0, scale: 0.8 }}
            animate={{
              pathLength: 1,
              scale: hoveredLetter === 'O' ? [1.12, 1.2, 1.12] : [1, 1.06, 1],
              opacity: hoveredLetter === 'O' ? 1 : [0.55, 0.95, 0.55],
            }}
            transition={{
              pathLength: { duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: hoveredLetter === 'O' ? 1.4 : 3.2, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: hoveredLetter === 'O' ? 1.4 : 3.2, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </motion.g>

        {/* ======================================================== */}
        {/* LETTER 'F': Greatness / Legacy */}
        {/* ======================================================== */}
        <motion.g
          tabIndex={0}
          role="button"
          aria-label="Letter F: Greatness"
          onMouseEnter={() => handleHover('F')}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => handleHover('F')}
          onBlur={() => handleHover(null)}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            y: [0, -3.5, 0],
          }}
          transition={{
            y: { duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
            scale: { duration: 0.2 },
          }}
          className="outline-none"
        >
          {/* Hitbox */}
          <rect x="195" y="5" width="85" height="80" fill="transparent" />

          {/* Glow on hover */}
          {hoveredLetter === 'F' && (
            <motion.path
              d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
              stroke="var(--acc)"
              strokeWidth="10"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="filter blur-[4px]"
            />
          )}

          {/* Main 'F' Stroke */}
          <motion.path
            d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
            stroke={hoveredLetter === 'F' ? 'var(--acc)' : 'var(--bone)'}
            strokeWidth="6"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.g>
      </svg>

      {/* Dynamic letter meaning indicator below the wordmark */}
      <div className="h-5 mt-2 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {hoveredLetter ? (
            <motion.span
              key={hoveredLetter}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="label-caps text-[10px] tracking-[0.28em] text-[var(--acc)]"
            >
              {hoveredLetter === 'R'
                ? 'R • Ambition and Drive'
                : hoveredLetter === 'O'
                ? 'O • The Diamond Mindset'
                : 'F • Greatness and Legacy'}
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="label-caps text-[9px] tracking-[0.22em] text-[var(--muted)]"
            >
              Hover or tap R • O • F to inspect
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Small standalone diamond mark from the logo
 */
export const DiamondMark: React.FC<{
  className?: string
  size?: number
  filled?: boolean
  accent?: boolean
}> = ({ className, size = 10, filled = false, accent = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={filled ? (accent ? 'var(--acc)' : 'currentColor') : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block shrink-0', className)}
      style={{ color: accent ? 'var(--acc)' : 'currentColor' }}
      aria-hidden="true"
    >
      <polygon
        points="8,1 15,8 8,15 1,8"
        stroke={accent ? 'var(--acc)' : 'currentColor'}
        strokeWidth="1.8"
      />
    </svg>
  )
}
