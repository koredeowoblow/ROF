import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { DiamondMark } from './Logo'

interface PageLoaderProps {
  onComplete?: () => void
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if user already saw the entrance loader in this session
    const hasSeenLoader = sessionStorage.getItem('rof_has_seen_loader')
    if (hasSeenLoader) {
      setIsVisible(false)
      onComplete?.()
      return
    }

    // Fast, crisp cinematic progress countdown
    const duration = 1100 // ms
    const interval = 20
    const steps = duration / interval
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const nextProgress = Math.min(100, Math.round((currentStep / steps) * 100))
      setProgress(nextProgress)

      if (currentStep >= steps) {
        clearInterval(timer)
        setTimeout(() => {
          setIsVisible(false)
          sessionStorage.setItem('rof_has_seen_loader', 'true')
          onComplete?.()
        }, 320)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="rof-page-loader"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 bg-[var(--ink)] text-[var(--bone)] select-none grain-overlay"
        >
          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-[var(--muted)] border-b border-[var(--hairline)] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--acc)] animate-ping" />
              <span className="text-[var(--bone)] font-semibold uppercase">ROF RAGE ARCHIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[10px]">
              <span>SYSTEM: 260 GSM SILK-TERRY</span>
              <span>•</span>
              <span>LAGOS 6.4541° N</span>
            </div>
          </div>

          {/* Center Monolith: Diamond Emblem & Pulse */}
          <div className="flex flex-col items-center justify-center my-auto gap-6 text-center">
            <motion.div
              animate={{
                scale: [0.92, 1.08, 0.92],
                rotate: [0, 45, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32"
            >
              {/* Outer Radiant Diamond Halo */}
              <div className="absolute inset-0 border border-[var(--acc)]/30 rotate-45 animate-pulse" />
              <div className="absolute inset-2 border border-dashed border-[var(--bone)]/20 rotate-45" />

              {/* Center Diamond Mark */}
              <DiamondMark size={28} accent filled className="drop-shadow-[0_0_24px_rgba(240,180,41,0.6)]" />
            </motion.div>

            {/* Headline Manifesto */}
            <div className="space-y-1">
              <h2 className="font-serif italic text-2xl sm:text-3xl text-[var(--acc)] tracking-wide">
                Destined for riches.
              </h2>
              <p className="font-mono text-[10px] sm:text-xs text-[var(--muted)] uppercase tracking-[0.26em]">
                Authentic Nigerian Streetwear Sanctuary
              </p>
            </div>
          </div>

          {/* Bottom Progress Bar & Counter */}
          <div className="w-full max-w-xl mx-auto space-y-3">
            <div className="flex items-end justify-between font-mono text-xs">
              <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest">
                CALIBRATING CAPSULE // 01
              </span>
              <span className="font-bold text-sm text-[var(--acc)]">
                {progress.toString().padStart(2, '0')}%
              </span>
            </div>

            {/* Glowing Marigold Progress Line */}
            <div className="h-[2px] w-full bg-[var(--hairline)] overflow-hidden relative">
              <motion.div
                className="h-full bg-[var(--acc)] shadow-[0_0_12px_var(--acc)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-[var(--muted)] tracking-wider">
              <span>AMBITION • CONFIDENCE • ORIGINALITY</span>
              <span>NO PERMISSION NEEDED</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Top Navigation Progress Bar
 * Shoots across the top when routes change
 */
export const RouteProgressBar: React.FC<{ activeKey: string }> = ({ activeKey }) => {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timeout = setTimeout(() => {
      setAnimating(false)
    }, 450)
    return () => clearTimeout(timeout)
  }, [activeKey])

  if (!animating) return null

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 1 }}
      animate={{ x: '0%', opacity: [1, 1, 0] }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-[var(--acc)] z-50 pointer-events-none shadow-[0_0_10px_var(--acc)]"
    />
  )
}
