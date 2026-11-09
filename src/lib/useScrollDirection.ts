import { useState, useEffect, useRef } from 'react'

export type ScrollDirection = 'down' | 'up'

/**
 * High-performance scroll direction and boundary observer.
 * Employs requestAnimationFrame throttling and state change guards
 * to guarantee ZERO re-renders during steady scrolling.
 */
export function useScrollDirection(threshold = 6): {
  direction: ScrollDirection
  isAtTop: boolean
} {
  const [direction, setDirection] = useState<ScrollDirection>('up')
  const [isAtTop, setIsAtTop] = useState(() => (typeof window !== 'undefined' ? window.scrollY <= 12 : true))
  const prevScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0)
  const prevDirection = useRef<ScrollDirection>('up')
  const prevIsAtTop = useRef(typeof window !== 'undefined' ? window.scrollY <= 12 : true)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const atTop = currentScrollY <= 12
          if (atTop !== prevIsAtTop.current) {
            prevIsAtTop.current = atTop
            setIsAtTop(atTop)
          }

          const diff = currentScrollY - prevScrollY.current
          if (Math.abs(diff) >= threshold) {
            const nextDirection: ScrollDirection = diff > 0 ? 'down' : 'up'
            if (nextDirection !== prevDirection.current) {
              prevDirection.current = nextDirection
              setDirection(nextDirection)
            }
            prevScrollY.current = currentScrollY
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return { direction, isAtTop }
}

