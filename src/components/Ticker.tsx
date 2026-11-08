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
 * Red ticker strip
 * The single location in the design system where red acts as a ground.
 * Solid red background, Ink text, separated by solid Ink diamonds.
 * Pauses on hover, ceases animation under prefers-reduced-motion.
 */
export const Ticker: React.FC<TickerProps> = ({
  items = defaultItems,
  className,
}) => {
  // Repeat items to ensure seamless infinite scroll
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--acc-on-ink)] text-[var(--ink)] py-3 select-none border-y border-[var(--ink)]',
        'group',
        className
      )}
      role="region"
      aria-label="Brand ticker"
    >
      <div className="flex w-max motion-safe:animate-[ticker_35s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:transform-none">
        {repeated.map((phrase, idx) => (
          <div key={idx} className="flex items-center shrink-0 space-x-6 pr-6">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] font-sans">
              {phrase}
            </span>
            <DiamondMark size={8} filled className="text-[var(--ink)]" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
