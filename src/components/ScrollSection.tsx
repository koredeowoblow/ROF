import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useScrollDirection } from '@/lib/useScrollDirection'
import { cn } from '@/lib/utils'

interface ScrollSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  as?: 'section' | 'article' | 'div'
  margin?: string
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  className,
  id,
  as = 'section',
  margin = '-80px',
}) => {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: margin as any, once: false, amount: 0.12 })
  const { direction } = useScrollDirection()
  const prefersReduced = useReducedMotion()

  // Direction-specific motion profiles:
  // SCROLL DOWN: Rises up from depth (y: +48px, scale: 0.98)
  // SCROLL UP: Descends with celestial architectural elevation (y: -40px, scale: 1.015)
  const isScrollingDown = direction === 'down'

  const initialY = prefersReduced ? 0 : isScrollingDown ? 48 : -40
  const initialScale = prefersReduced ? 1 : isScrollingDown ? 0.98 : 1.015

  const MotionComponent = as === 'article' ? motion.article : as === 'div' ? motion.div : motion.section

  return (
    <MotionComponent
      id={id}
      ref={ref as any}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
            }
          : {
              opacity: 0.2,
              y: initialY,
              scale: initialScale,
              filter: prefersReduced ? 'blur(0px)' : 'blur(4px)',
            }
      }
      transition={{
        duration: 0.68,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn('relative w-full', className)}
    >
      {/* Scroll Up Shimmer Accent Beam */}
      {!prefersReduced && (
        <motion.div
          animate={
            inView && !isScrollingDown
              ? { scaleX: [0, 1, 0], opacity: [0, 0.85, 0] }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--acc)] to-transparent z-20 pointer-events-none origin-left"
        />
      )}

      {children}
    </MotionComponent>
  )
}
