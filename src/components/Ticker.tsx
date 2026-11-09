import React from 'react'
import { DiamondMark } from './Logo'
import { cn } from '@/lib/utils'

interface TickerProps {
  items?: string[]
  className?: string
  speed?: 'normal' | 'fast'
}

const defaultItems = [
  'Destined for greatness',
  'ROF RAGE',
  'Destined for riches',
  'Collection 01',
  'Built for legacy',
  'Ambition and original craft',
]

/**
 * Continuous Rotating Marigold Ticker Strip
 * Continuously glides from LEFT TO RIGHT across the screen.
 * Driven by GPU-accelerated translate3d for 60fps infinite rotation.
 * Features continuously rotating 360° diamond marks.
 */
export const Ticker: React.FC<TickerProps> = React.memo(({
  items = defaultItems,
  className,
  speed = 'normal',
}) => {
  // 4 identical sets ensure a 100% seamless, mathematically infinite loop from -50% to 0%
  const repeated = [...items, ...items, ...items, ...items]

  const animDuration = speed === 'fast' ? '18s' : '26s'

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--acc-on-ink)] text-[var(--ink)] py-3 select-none border-y border-[var(--ink)] cursor-default',
        'group',
        className
      )}
      role="region"
      aria-label="Continuous brand rotating ticker"
    >
      <div
        className="flex w-max items-center will-change-transform group-hover:[animation-play-state:paused]"
        style={{
          animation: `rof-ticker-ltr ${animDuration} linear infinite`,
        }}
      >
        {repeated.map((phrase, idx) => (
          <div key={idx} className="flex items-center shrink-0 space-x-6 pr-6">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] font-sans">
              {phrase}
            </span>

            {/* Continuously 360° Rotating Diamond Icon */}
            <div
              className="inline-flex items-center justify-center shrink-0"
              style={{
                animation: 'rof-spin-diamond 3.2s linear infinite',
              }}
            >
              <DiamondMark size={8} filled className="text-[var(--ink)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
