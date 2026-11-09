import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { DiamondMark } from './Logo'

interface PageLoaderProps {
  currentPath?: string
}

let isGlobalPageLoaderActive = true

/**
 * Returns whether the fullscreen luxury page loader is currently covering the viewport.
 */
export function getIsPageLoaderActive(): boolean {
  if (typeof window === 'undefined') return false
  return isGlobalPageLoaderActive
}

/**
 * Fullscreen Luxury ROF Page Loader
 * Covers the ENTIRE screen 100% (fixed inset-0 w-screen h-screen z-[9999]).
 * No partial curtains, no sliding off the top, no peeking through.
 * Stays dead-center with sacred multi-layered diamond geometry,
 * radiant gold core ignition, and a smooth full-page dissolve reveal.
 */
export const PageLoader: React.FC<PageLoaderProps> = ({ currentPath }) => {
  const [activePath, setActivePath] = useState(currentPath)
  const [displaying, setDisplaying] = useState(true)

  // Synchronously activate loader immediately when route changes
  if (currentPath !== activePath) {
    setActivePath(currentPath)
    setDisplaying(true)
    isGlobalPageLoaderActive = true
  }

  useEffect(() => {
    if (!displaying) return

    isGlobalPageLoaderActive = true

    // Lock body scroll while loader covers the screen
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Clean 620ms full-page transition timing
    const timer = setTimeout(() => {
      setDisplaying(false)
      document.body.style.overflow = originalOverflow
    }, 620)

    // Complete exit dispatch backup (620ms display + 360ms fade + 20ms buffer = 1000ms)
    const backupCompleteTimer = setTimeout(() => {
      isGlobalPageLoaderActive = false
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('rof:page-loader-done'))
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearTimeout(backupCompleteTimer)
      document.body.style.overflow = originalOverflow
    }
  }, [displaying, activePath])

  const notifyLoaderDone = () => {
    isGlobalPageLoaderActive = false
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rof:page-loader-done'))
    }
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={notifyLoaderDone}>
      {displaying && (
        <motion.div
          key={`rof-page-loader-${activePath}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.36,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center bg-[var(--ink)] text-[var(--bone)] select-none grain-overlay pointer-events-auto overflow-hidden"
          style={{ willChange: 'opacity' }}
        >
          {/* ============================================================ */}
          {/* 1. AMBIENT GOLDEN RADIANCE & SACRED EMBER FIELD              */}
          {/* ============================================================ */}
          {/* Fullscreen Radial Aura centered on the logo */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0.3 }}
            animate={{ scale: [0.9, 1.15, 0.95], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full bg-[radial-gradient(circle,rgba(240,180,41,0.28)_0%,rgba(236,227,203,0.06)_45%,transparent_70%)] blur-3xl pointer-events-none"
          />

          {/* Floating Diamond Embers */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { top: '18%', left: '18%', size: 4, delay: 0 },
              { top: '26%', left: '80%', size: 5, delay: 0.2 },
              { top: '74%', left: '22%', size: 6, delay: 0.4 },
              { top: '72%', left: '76%', size: 4, delay: 0.1 },
              { top: '46%', left: '10%', size: 3, delay: 0.3 },
              { top: '52%', left: '90%', size: 4, delay: 0.5 },
            ].map((pt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.75, 0.25],
                  scale: [0.8, 1.3, 1],
                  y: [-6, 6, -6],
                }}
                transition={{
                  duration: 2.2,
                  delay: pt.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ top: pt.top, left: pt.left }}
                className="absolute text-[var(--acc)] drop-shadow-[0_0_8px_rgba(240,180,41,0.8)]"
              >
                <DiamondMark size={pt.size} accent filled />
              </motion.div>
            ))}
          </div>

          {/* ============================================================ */}
          {/* 2. CENTERPIECE: SACRED ROF GEOMETRY (Dead Center)            */}
          {/* ============================================================ */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl w-full">
            {/* Concentric Resonance Diamond Ripples */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Counter-Rotating Dashed Reticle */}
              <motion.div
                initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                animate={{ rotate: -90, scale: 1, opacity: [0, 0.45, 0.25] }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                className="w-48 h-48 sm:w-64 sm:h-64 border border-dashed border-[var(--acc)]/35 rotate-45 rounded-sm"
              />

              {/* Expanding Sacred Diamond Ripple */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0.6 }}
                animate={{ scale: [0.5, 1.55], opacity: [0.65, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                className="w-36 h-36 sm:w-50 sm:h-50 border border-[var(--acc)]/40 rotate-45"
              />
            </div>

            {/* MASTER ROF LOGO SVG */}
            <div className="relative z-10 w-[280px] sm:w-[380px] md:w-[460px] max-w-full drop-shadow-[0_12px_36px_rgba(0,0,0,0.7)]">
              <svg
                viewBox="0 0 280 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto overflow-visible"
              >
                <defs>
                  {/* Liquid Gold Metallic Gradient */}
                  <linearGradient id="gold-metal-gradient-full" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff3d1" />
                    <stop offset="35%" stopColor="#f0b429" />
                    <stop offset="70%" stopColor="#b57a15" />
                    <stop offset="100%" stopColor="#f0b429" />
                  </linearGradient>

                  {/* Intense Diamond Starburst Glow Filter */}
                  <filter id="starburst-glow-full" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 1. Letter 'R' - Laser-sharp geometric stroke drawing */}
                <motion.path
                  d="M 20,82 L 20,10 L 64,10 L 84,32 L 64,52 L 20,52 M 56,52 L 86,82"
                  stroke="var(--bone)"
                  strokeWidth="5.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* 2. 'O' Outer Concentric Diamond: Sharp 45° Facets */}
                <motion.polygon
                  points="140,8 178,46 140,84 102,46"
                  stroke="var(--bone)"
                  strokeWidth="5.5"
                  strokeLinejoin="miter"
                  initial={{ pathLength: 0, opacity: 0, scale: 0.85 }}
                  animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.46, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* 3. 'O' Inner Accent Diamond: Radiant Marigold Flare */}
                <motion.polygon
                  points="140,26 160,46 140,66 120,46"
                  stroke="url(#gold-metal-gradient-full)"
                  fill="rgba(240, 180, 41, 0.35)"
                  strokeWidth="4"
                  strokeLinejoin="miter"
                  filter="url(#starburst-glow-full)"
                  initial={{ scale: 0, opacity: 0, rotate: 180 }}
                  animate={{ scale: [0, 1.15, 1], opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.52, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Center Starburst Laser Crosshairs */}
                <motion.line
                  x1="126"
                  y1="46"
                  x2="154"
                  y2="46"
                  stroke="var(--acc)"
                  strokeWidth="1.5"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: [0, 1.4, 1], opacity: [0, 1, 0.8] }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                />
                <motion.line
                  x1="140"
                  y1="32"
                  x2="140"
                  y2="60"
                  stroke="var(--acc)"
                  strokeWidth="1.5"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: [0, 1.4, 1], opacity: [0, 1, 0.8] }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                />

                {/* Center Diamond Light Source Core */}
                <motion.circle
                  cx="140"
                  cy="46"
                  r="4"
                  fill="#ffffff"
                  filter="url(#starburst-glow-full)"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.6, 1.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                />

                {/* 4. Letter 'F' - Crisp Architectural Spine & Crossbeams */}
                <motion.path
                  d="M 205,82 L 205,10 L 268,10 M 205,46 L 252,46"
                  stroke="var(--bone)"
                  strokeWidth="5.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.44, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>

              {/* Dynamic Prismatic Light Sweep across the entire logo */}
              <motion.div
                initial={{ x: '-140%', opacity: 0 }}
                animate={{ x: '150%', opacity: [0, 1, 0] }}
                transition={{ duration: 0.55, delay: 0.14, ease: 'easeInOut' }}
                className="absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-[var(--acc)]/50 to-transparent skew-x-[-25deg] pointer-events-none"
              />
            </div>

            {/* ============================================================ */}
            {/* 3. CENTERPIECE TYPOGRAPHY & ROOF • OF • FRAME TRINITY        */}
            {/* ============================================================ */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-col items-center gap-2.5 z-10"
            >
              <h2 className="font-serif italic text-2xl sm:text-3xl text-[var(--acc)] tracking-wide drop-shadow-[0_2px_12px_rgba(240,180,41,0.4)]">
                Destined for riches.
              </h2>

              {/* ROOF • OF • FRAME Badge */}
              <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.28em] text-[var(--bone)]/85 bg-[var(--surface-deep)]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[var(--acc)]/40 shadow-lg">
                <span className="text-[var(--bone)] font-semibold">ROOF</span>
                <span className="text-[var(--acc)]">◆</span>
                <span className="text-[var(--acc)] font-bold">OF</span>
                <span className="text-[var(--acc)]">◆</span>
                <span className="text-[var(--bone)] font-semibold">FRAME</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Top Navigation Route Progress Bar
 */
export const RouteProgressBar: React.FC<{ activeKey: string }> = ({ activeKey }) => {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timeout = setTimeout(() => {
      setAnimating(false)
    }, 400)
    return () => clearTimeout(timeout)
  }, [activeKey])

  if (!animating) return null

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 1 }}
      animate={{ x: '0%', opacity: [1, 1, 0] }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--acc)] z-50 pointer-events-none shadow-[0_0_8px_var(--acc)]"
    />
  )
}
