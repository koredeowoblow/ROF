import React from 'react'
import { motion, HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'
import { DiamondMark } from './Logo'

interface ChipProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  selected?: boolean
  disabled?: boolean
  label: string
  sublabel?: string
  className?: string
  children?: React.ReactNode
}

/**
 * Tap chip primitive for sizes, colours, and filters
 * Sized for thumb-zone precision (minimum 48px touch target).
 * Features subtle tactile tap depression and diamond selected indicator.
 */
export const Chip: React.FC<ChipProps> = ({
  selected = false,
  disabled = false,
  label,
  sublabel,
  className,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      whileHover={!disabled ? { y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.12 }}
      className={cn(
        'relative inline-flex min-h-[48px] min-w-[48px] items-center justify-center px-4 py-2 text-xs font-medium uppercase tracking-wider select-none cursor-pointer transition-colors duration-150',
        'border border-[var(--hairline)] focus-visible:outline-2 focus-visible:outline-[var(--acc)]',
        selected
          ? 'bg-[var(--fg)] text-[var(--bg)] border-transparent font-semibold shadow-sm'
          : 'bg-transparent text-[var(--fg)] hover:border-[var(--fg)] hover:bg-[var(--surface-tint)]',
        disabled && 'opacity-30 cursor-not-allowed line-through hover:border-[var(--hairline)] hover:bg-transparent',
        className
      )}
      {...props}
    >
      <span className="flex flex-col items-center leading-none gap-1">
        <span className="flex items-center gap-1.5">
          {label}
          {selected && (
            <DiamondMark
              size={5}
              accent
              filled
              className="transition-transform scale-100"
            />
          )}
        </span>
        {sublabel && (
          <span className="text-[10px] tracking-normal font-normal opacity-70">
            {sublabel}
          </span>
        )}
      </span>
    </motion.button>
  )
}
