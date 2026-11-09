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
 * Continuously scrolls infinitely across the screen with 360° rotating gold diamonds.
 * Driven by hardware-accelerated CSS animations for guaranteed 60fps rotation.
 */
export const Ticker: React.FC<TickerProps> = React.memo(({
  items = defaultItems,
  className,
  speed = 'normal',
}) => {
  // Repeat items to ensure a seamless infinite loop
  const repeated = [...items, ...items, ...items, ...items]
  const animDuration = speed === 'fast' ? '20s' : '30s'

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--acc-on-ink)] text-[var(--ink)] py-3 select-none border-y border-[var(--ink)] cursor-default',
        className
      )}
      role="region"
      aria-label="Continuous brand rotating ticker"
    >
      <style>{`
        @keyframes rofContinuousTicker {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes rofContinuousDiamondSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .rof-ticker-wrapper {
          display: flex;
          width: max-content;
          align-items: center;
          animation: rofContinuousTicker ${animDuration} linear infinite !important;
          will-change: transform;
        }
        .rof-ticker-wrapper:hover {
          animation-play-state: paused;
        }
        .rof-spinning-diamond {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: rofContinuousDiamondSpin 2.8s linear infinite !important;
          will-change: transform;
        }
      `}</style>

      <div className="rof-ticker-wrapper">
        {repeated.map((phrase, idx) => (
          <div key={idx} className="flex items-center shrink-0 space-x-6 pr-6">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] font-sans">
              {phrase}
            </span>

            {/* Continuously 360° Rotating Diamond Icon */}
            <div className="rof-spinning-diamond">
              <DiamondMark size={8} filled className="text-[var(--ink)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
