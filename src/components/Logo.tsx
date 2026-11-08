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
 * Geometrically exact concentric diamond O:
 * - Outer Diamond: (140,8) (178,46) (140,84) (102,46) - Center (140, 46), radius 38
 * - Inner Diamond: (140,26) (160,46) (140,66) (120,46) - Center (140, 46), radius 20
 * Perfectly parallel 45° edges with uniform 18px vertex spacing and zero skew.
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

  // Hero Background Animated Ghost Mode
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
        {/* 'R' Path with stroke drawing */}
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
          }}
          transition={{
            pathLength: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.2 },
          }}
        />

        {/* 'O' Diamond Outer Contour */}
        <motion.polygon
          points="140,8 178,46 140,84 102,46"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0, 0.24, 0.18],
          }}
          transition={{
            pathLength: { duration: 1.1, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.2, delay: 0.18 },
          }}
        />

        {/* 'O' Inner Accent Diamond - perfectly concentric, zero skew */}
        <motion.polygon
          points="140,26 160,46 140,66 120,46"
          stroke="var(--acc)"
          strokeWidth="3"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0.45, 0.85, 0.45],
          }}
          transition={{
            pathLength: { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* 'F' Path with stroke drawing */}
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
          }}
          transition={{
            pathLength: { duration: 1.1, delay: 0.32, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.2, delay: 0.32 },
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
        {/* Diamond O Outer */}
        <motion.polygon
          points="140,8 178,46 140,84 102,46"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Diamond O Inner Accent - perfectly concentric */}
        <motion.polygon
          points="140,26 160,46 140,66 120,46"
          stroke="var(--acc)"
          strokeWidth="2.5"
          strokeLinejoin="miter"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1],
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

  // Static Fallback & Standard Crisp Logo (Sidebar, Footer, etc.)
  return (
    <svg
      viewBox="0 0 280 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], 'text-[var(--fg)] shrink-0', className)}
      aria-label="ROF logo"
    >
      {/* R */}
      <path
        d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Outer Diamond O */}
      <polygon
        points="140,8 178,46 140,84 102,46"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="miter"
      />
      {/* Inner Diamond Accent - exact concentric 45° square, zero skew */}
      <polygon
        points="140,26 160,46 140,66 120,46"
        stroke="var(--acc)"
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />
      {/* F */}
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
        {/* LETTER 'R' */}
        <motion.g
          tabIndex={0}
          role="button"
          aria-label="Letter R: Ambition"
          onMouseEnter={() => handleHover('R')}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => handleHover('R')}
          onBlur={() => handleHover(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="outline-none"
        >
          <rect x="10" y="5" width="85" height="80" fill="transparent" />
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

        {/* LETTER 'O' - The Diamond */}
        <motion.g
          tabIndex={0}
          role="button"
          aria-label="Diamond O: The Mindset"
          onMouseEnter={() => handleHover('O')}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => handleHover('O')}
          onBlur={() => handleHover(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="outline-none"
        >
          <rect x="95" y="5" width="90" height="80" fill="transparent" />
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
          {/* Inner Accent Diamond - exact concentric (140,26)(160,46)(140,66)(120,46) */}
          <motion.polygon
            points="140,26 160,46 140,66 120,46"
            stroke="var(--acc)"
            strokeWidth="2.8"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: 1,
              opacity: hoveredLetter === 'O' ? 1 : 0.75,
            }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.g>

        {/* LETTER 'F' */}
        <motion.g
          tabIndex={0}
          role="button"
          aria-label="Letter F: Greatness"
          onMouseEnter={() => handleHover('F')}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => handleHover('F')}
          onBlur={() => handleHover(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="outline-none"
        >
          <rect x="195" y="5" width="85" height="80" fill="transparent" />
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

      <div className="h-5 mt-2 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {hoveredLetter && (
            <motion.span
              key={hoveredLetter}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
              className="label-caps text-[10px] tracking-[0.28em] text-[var(--acc)]"
            >
              {hoveredLetter === 'R'
                ? 'R • Ambition and Drive'
                : hoveredLetter === 'O'
                ? 'O • The Diamond Mindset'
                : 'F • Greatness and Legacy'}
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
