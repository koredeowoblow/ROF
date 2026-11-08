import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  animated?: boolean
  ghost?: boolean
  size?: 'sm' | 'md' | 'lg' | 'hero'
}

/**
 * ROF Angular Wordmark Logo
 * Angular line wordmark "ROF" where the O is drawn as a diamond.
 * Stroke only.
 * Supports stroke dash drawing animation (1.1s) and ghost hero mode.
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  animated = false,
  ghost = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    hero: 'w-full max-w-[680px] h-auto',
  }

  // Path definitions: R, Diamond O, F
  // ViewBox: 0 0 280 90
  // R: M 20,80 L 20,10 L 60,10 L 80,30 L 60,50 L 20,50 M 55,50 L 82,80
  // O (Diamond): M 140,8 L 175,45 L 140,82 L 105,45 Z
  // Inner diamond: M 140,24 L 158,45 L 140,66 L 122,45 Z
  // F: M 205,80 L 205,10 L 265,10 M 205,45 L 250,45

  if (ghost) {
    return (
      <svg
        viewBox="0 0 280 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          sizeClasses[size],
          'pointer-events-none select-none text-[var(--bone)] opacity-[0.045]',
          className
        )}
        aria-hidden="true"
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

  if (animated) {
    return (
      <svg
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
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
