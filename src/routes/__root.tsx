import React, { useState, useEffect } from 'react'
import { createRootRoute, Outlet, useRouterState, Link, ErrorComponentProps } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BagDrawer } from '@/features/bag/BagDrawer'
import { Button } from '@/components/Button'
import { DiamondMark } from '@/components/Logo'
import { DiamondCursor } from '@/components/DiamondCursor'
import { formatAccentText } from '@/components/Mast'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorBoundaryComponent,
})

function NotFoundComponent() {
  return (
    <div
      data-tone="ink"
      className="min-h-[85svh] flex flex-col items-center justify-center p-6 text-center grain-overlay"
    >
      <div className="mb-4">
        <DiamondMark size={14} accent filled />
      </div>
      <h1 className="text-6xl sm:text-8xl md:text-9xl font-display text-[var(--bone)]">
        {formatAccentText('Lost *direction?*')}
      </h1>
      <p className="mt-4 text-base sm:text-lg text-[var(--muted)] font-sans max-w-md">
        The coordinates you requested do not exist in the collection. Re-anchor your focus.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button variant="primary" size="lg" withArrow>
            Return to the Collection
          </Button>
        </Link>
      </div>
    </div>
  )
}

function ErrorBoundaryComponent({ error, reset }: ErrorComponentProps) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'An unexpected operational fault occurred while rendering this view.'

  return (
    <div
      data-tone="ink"
      className="min-h-[80svh] flex flex-col items-center justify-center p-6 text-center grain-overlay"
    >
      <div className="mb-4">
        <DiamondMark size={14} accent filled />
      </div>
      <h1 className="text-4xl sm:text-6xl font-display text-[var(--bone)]">
        {formatAccentText('An interruption in *transmission.*')}
      </h1>
      <p className="mt-4 text-xs sm:text-sm text-[var(--muted)] font-sans max-w-md">
        {errorMessage}
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()}>
          <RefreshCw className="h-4 w-4 mr-1.5" />
          Retry Connection
        </Button>
        <Link to="/">
          <Button variant="secondary" size="md">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

function RootComponent() {
  const router = useRouterState()
  const isAdmin = router.location.pathname.startsWith('/admin')
  const [isOffline, setIsOffline] = useState(false)

  // Scroll to top smoothly on every route transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [router.location.pathname])

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--ink)] text-[var(--bone)]">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          data-tone="bone"
          className="fixed top-0 left-0 right-0 z-50 bg-[var(--bone)] text-[var(--ink)] py-2 px-4 text-center text-xs font-sans font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b border-[var(--hairline)]"
        >
          <WifiOff className="h-3.5 w-3.5 text-[var(--acc-on-bone)]" />
          <span>Operating offline. Cached shell and catalogue active.</span>
        </div>
      )}

      <DiamondCursor />
      {!isAdmin && <Header />}

      <main id="main-content" className={`flex-1 ${isOffline ? 'pt-8' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={router.location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAdmin && <BagDrawer />}
      {!isAdmin && <Footer />}
    </div>
  )
}
