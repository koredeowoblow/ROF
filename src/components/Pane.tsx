import React from 'react'
import { cn } from '@/lib/utils'

export type Tone = 'ink' | 'bone'

interface PaneProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone
  withGrain?: boolean
  children: React.ReactNode
}

/**
 * Split pane building block for 60-30-10 color system.
 * Explicitly sets data-tone to ensure children consume tokens: --fg, --bg, --acc.
 */
export const Pane = React.forwardRef<HTMLDivElement, PaneProps>(
  ({ tone = 'ink', withGrain = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-tone={tone}
        className={cn(
          'relative w-full transition-colors duration-300',
          tone === 'ink' ? 'bg-[var(--ink)] text-[var(--bone)]' : 'bg-[var(--bone)] text-[var(--ink)]',
          tone === 'ink' && withGrain && 'grain-overlay',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Pane.displayName = 'Pane'

