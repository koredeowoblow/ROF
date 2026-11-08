import React, { useState } from 'react'
import { motion, HTMLMotionProps } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  withArrow?: boolean
  children: React.ReactNode
}

/**
 * ROF Signature Button
 * - Red primary button inverts on hover
 * - Arrow slides 4px on hover
 * - Press scales to 0.98
 * - Touch ripple effect
 * - Accessible 48px minimum height on touch
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      withArrow = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null)

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setRipple({ x, y, id: Date.now() })
    }

    const sizeClasses = {
      sm: 'h-10 px-4 text-xs font-medium tracking-wider uppercase',
      md: 'h-12 px-6 text-sm font-medium tracking-wider uppercase',
      lg: 'h-14 px-8 text-base font-medium tracking-wider uppercase',
    }

    // Base styles
    const variantClasses = {
      primary:
        'bg-[var(--acc)] text-[#fff6ec] hover:bg-[var(--fg)] hover:text-[var(--bg)] border border-transparent shadow-sm',
      secondary:
        'bg-transparent text-[var(--fg)] border border-[var(--hairline)] hover:border-[var(--fg)] hover:bg-[var(--surface-tint)]',
      ghost:
        'bg-transparent text-[var(--fg)] hover:bg-[var(--surface-tint)] border border-transparent',
      link:
        'bg-transparent text-[var(--fg)] hover:text-[var(--acc)] p-0 h-auto underline underline-offset-4 decoration-[var(--hairline)] hover:decoration-[var(--acc)]',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.12 }}
        onPointerDown={handlePointerDown}
        onClick={onClick}
        className={cn(
          'group relative inline-flex items-center justify-center gap-2 overflow-hidden select-none cursor-pointer transition-colors duration-200',
          'touch-target-48',
          variant !== 'link' && 'rounded-none font-sans',
          variant !== 'link' && sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {/* Touch ripple effect */}
        {ripple && (
          <span
            key={ripple.id}
            onAnimationEnd={() => setRipple(null)}
            className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/20"
            style={{ left: ripple.x, top: ripple.y }}
          />
        )}

        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
          {withArrow && (
            <ArrowRight
              className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          )}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
