import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'motion/react'

/**
 * Desktop-only Lazy Diamond Cursor
 * Trails pointer with gentle inertia when hovering over product images and interactive pieces.
 * Disabled on touch screens.
 */
export const DiamondCursor: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(true)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics for lazy trailing
  const springX = useSpring(mouseX, { stiffness: 400, damping: 28 })
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28 })

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsTouch(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Check if hovering over product image or clickable tile
      const target = e.target as HTMLElement | null
      const isOverInteractive = target?.closest('article, [data-interactive="true"], a, button')
      setVisible(!!isOverInteractive)
    }

    const handleMouseLeave = () => setVisible(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY])

  if (isTouch || !visible) return null

  return (
    <motion.div
      className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: springX,
        top: springY,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.9 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="8,1 15,8 8,15 1,8"
          fill="var(--acc)"
          stroke="#0e2f2f"
          strokeWidth="1.2"
        />
      </svg>
    </motion.div>
  )
}

