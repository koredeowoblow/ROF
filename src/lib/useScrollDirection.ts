import { useState, useEffect, useRef } from 'react'

export type ScrollDirection = 'down' | 'up'

export function useScrollDirection(threshold = 6): {
  direction: ScrollDirection
  scrollY: number
  isAtTop: boolean
} {
  const [direction, setDirection] = useState<ScrollDirection>('up')
  const [scrollY, setScrollY] = useState(() => (typeof window !== 'undefined' ? window.scrollY : 0))
  const prevScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const diff = currentScrollY - prevScrollY.current
          if (Math.abs(diff) >= threshold) {
            setDirection(diff > 0 ? 'down' : 'up')
            prevScrollY.current = currentScrollY
          }
          setScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return { direction, scrollY, isAtTop: scrollY <= 12 }
}

