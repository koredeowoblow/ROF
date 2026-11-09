import React, { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { Logo, DiamondMark } from './Logo'
import { safeStorage } from '@/lib/storage'
import { useBagStore } from '@/features/bag/bagStore'
import { useScrollDirection } from '@/lib/useScrollDirection'
import { cn } from '@/lib/utils'

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const bagOpen = useBagStore((s) => s.isOpen)
  const setBagOpen = useBagStore((s) => s.setIsOpen)
  const totalPieces = useBagStore((s) => s.totalPieces())
  const [sealedMindset, setSealedMindset] = useState<string | null>(null)
  const { direction, isAtTop } = useScrollDirection()

  React.useEffect(() => {
    const syncMindset = () => {
      setSealedMindset(safeStorage.getItem('rof_sealed_mindset'))
    }
    syncMindset()
    window.addEventListener('storage', syncMindset)
    window.addEventListener('rof-mindset-update', syncMindset)
    return () => {
      window.removeEventListener('storage', syncMindset)
      window.removeEventListener('rof-mindset-update', syncMindset)
    }
  }, [])

  // Close mobile menu on route change
  const routerState = useRouterState()
  React.useEffect(() => {
    setMenuOpen(false)
  }, [routerState.location.pathname])

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Story', href: '/story' },
    { label: 'Help', href: '/help' },
    { label: 'Contact', href: '/contact' },
    { label: 'Track order', href: '/track' },
  ]

  return (
    <>
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--acc)] focus:text-[var(--label-on-acc)] focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        data-tone="ink"
        className={cn(
          'fixed top-0 left-0 right-0 z-40 bg-[var(--ink)]/95 backdrop-blur-md transition-all duration-300',
          !isAtTop && direction === 'down'
            ? '-translate-y-full border-b border-[var(--hairline)] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100',
          !isAtTop && direction === 'up'
            ? 'border-b border-[var(--acc)]/40 shadow-[0_8px_30px_rgba(14,47,47,0.8)]'
            : 'border-b border-[var(--hairline)]'
        )}
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-[var(--max-content)] items-center justify-between px-4 md:px-8">
          {/* Left: Brand Logo & Classification */}
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="ROF RAGE Home" className="flex items-center gap-3 group">
              <Logo size="md" className="transition-transform group-hover:scale-[1.02]" />
              <div className="flex flex-col border-l border-[var(--hairline)] pl-2 sm:pl-3 text-left">
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[var(--acc)] font-bold leading-tight">
                  ROF RAGE
                </span>
                <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[var(--bone)]/60 leading-tight">
                  CLOTHING AND FASHION
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Center: Navigation with Active Indicator */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-7 lg:gap-9 text-xs uppercase font-medium tracking-[0.24em]"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[var(--bone)]/70 hover:text-[var(--bone)] transition-colors relative py-1 flex items-center gap-1 group"
                activeProps={{
                  className: 'text-[var(--bone)] font-semibold',
                }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavDiamond"
                        className="inline-flex text-[var(--acc)] mr-0.5"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      >
                        <DiamondMark size={5} accent filled />
                      </motion.span>
                    )}
                    <span>{link.label}</span>
                    <span
                      className={cn(
                        'absolute bottom-0 left-0 h-[1.5px] bg-[var(--acc)] transition-all duration-300',
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      )}
                    />
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Bag Trigger & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Bag Button */}
            <button
              type="button"
              onClick={() => setBagOpen(!bagOpen)}
              aria-label={`Shopping bag with ${totalPieces} items`}
              className="touch-target-48 relative flex items-center gap-2 px-3 py-2 text-[var(--bone)] hover:text-[var(--acc)] transition-colors border border-[var(--hairline)] hover:border-[var(--acc)]/60 rounded-xs bg-[var(--ink)]/80 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 stroke-[1.8] text-[var(--acc)]" />
              <span className="hidden sm:inline-block text-xs uppercase tracking-wider font-medium">
                Bag
              </span>

              {/* Counter with flip animation */}
              <AnimatePresence mode="popLayout">
                {totalPieces > 0 && (
                  <motion.span
                    key={totalPieces}
                    initial={{ scale: 0.5, y: -4, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--acc)] px-1 text-[9px] font-bold text-[var(--label-on-acc)]"
                  >
                    {totalPieces}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              className="touch-target-48 md:hidden flex h-10 w-10 items-center justify-center text-[var(--bone)] hover:text-[var(--acc)] border border-[var(--hairline)] rounded-xs cursor-pointer"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Sheet Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            data-tone="ink"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 flex flex-col bg-[var(--ink)] text-[var(--bone)] pt-24 px-6 pb-8 md:hidden overflow-y-auto"
          >
            {/* Background faint diamond watermark */}
            <div className="absolute right-[-40px] bottom-[-40px] pointer-events-none opacity-5">
              <Logo size="hero" ghost />
            </div>

            <div className="mb-4">
              <span className="label-caps text-[var(--acc)]">Navigation</span>
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-3xl font-display text-[var(--bone)] hover:text-[var(--acc)]"
                  >
                    <span>{link.label}</span>
                    <DiamondMark size={12} accent className="opacity-40" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto pt-10 border-t border-[var(--hairline)] flex flex-col gap-3">
              <span className="label-caps text-[var(--muted)]">Roof of Fame</span>
              <p className="text-sm font-serif italic text-[var(--bone)]">
                Destined for riches.
              </p>
              <div className="text-xs text-[var(--muted)]">
                Lagos, Nigeria • Express Nationwide Dispatch
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

