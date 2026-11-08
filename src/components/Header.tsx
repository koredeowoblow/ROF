import React, { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { Logo, DiamondMark } from './Logo'
import { useBagStore } from '@/features/bag/bagStore'
import { cn } from '@/lib/utils'

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const bagOpen = useBagStore((s) => s.isOpen)
  const setBagOpen = useBagStore((s) => s.setIsOpen)
  const totalPieces = useBagStore((s) => s.totalPieces())

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--acc)] focus:text-[#fff6ec] focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        data-tone="ink"
        className="fixed top-0 left-0 right-0 z-40 bg-[var(--ink)]/95 backdrop-blur-md border-b border-[rgba(236,230,216,0.18)]"
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-[var(--max-content)] items-center justify-between px-4 md:px-8">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" aria-label="ROF RAGE Home" className="flex items-center gap-2 group">
              <Logo size="md" className="transition-transform group-hover:scale-[1.02]" />
            </Link>
          </div>

          {/* Desktop Center: Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-8 text-xs uppercase font-medium tracking-[0.22em]"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[var(--bone)]/75 hover:text-[var(--bone)] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-[var(--acc)] after:absolute after:bottom-0 after:left-0 after:transition-all"
                activeProps={{
                  className: 'text-[var(--bone)] after:w-full after:bg-[var(--acc)]',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Bag Trigger & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Bag Button */}
            <button
              type="button"
              onClick={() => setBagOpen(!bagOpen)}
              aria-label={`Shopping bag with ${totalPieces} items`}
              className="touch-target-48 relative flex items-center gap-2 px-3 py-2 text-[var(--bone)] hover:text-[#fff6ec] transition-colors"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
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
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--acc)] px-1.5 text-[10px] font-bold text-[#fff6ec]"
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
              className="touch-target-48 md:hidden flex h-11 w-11 items-center justify-center text-[var(--bone)] hover:text-[var(--acc)]"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
