import React from 'react'
import { cn } from '@/lib/utils'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  disabled?: boolean
  label: string
  sublabel?: string
  className?: string
}

/**
 * Tap chip primitive for sizes, colours, and filters
 * Sized for thumb-zone precision (minimum 48px touch target).
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
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'relative inline-flex min-h-[48px] min-w-[48px] items-center justify-center px-4 py-2 text-xs font-medium uppercase tracking-wider select-none transition-all duration-150',
        'border border-[var(--hairline)] focus-visible:outline-2 focus-visible:outline-[var(--acc)]',
        selected
          ? 'bg-[var(--fg)] text-[var(--bg)] border-transparent font-semibold shadow-sm'
          : 'bg-transparent text-[var(--fg)] hover:border-[var(--fg)] hover:bg-[var(--surface-tint)]',
        disabled && 'opacity-30 cursor-not-allowed line-through hover:border-[var(--hairline)] hover:bg-transparent',
        className
      )}
      {...props}
    >
      <span className="flex flex-col items-center leading-none gap-0.5">
        <span>{label}</span>
        {sublabel && (
          <span className="text-[10px] tracking-normal font-normal opacity-70">
            {sublabel}
          </span>
        )}
      </span>
    </button>
  )
}

