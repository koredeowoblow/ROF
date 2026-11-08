import React from 'react'
import { cn } from '@/lib/utils'

interface NumeralProps {
  value: string | number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
}

/**
 * Big italic red index numeral (01 to 05)
 * Instrument Serif display font, italic, tabular numbers, accent colour.
 */
export const Numeral: React.FC<NumeralProps> = ({
  value,
  className,
  size = 'lg',
}) => {
  const formatted = typeof value === 'number' ? String(value).padStart(2, '0') : value

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl md:text-6xl',
    xl: 'text-6xl md:text-8xl',
    hero: 'text-7xl sm:text-8xl md:text-9xl',
  }

  return (
    <span
      className={cn(
        'font-display italic font-normal tracking-tight text-[var(--acc)] select-none tabular-nums leading-none',
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    >
      {formatted}
    </span>
  )
}

