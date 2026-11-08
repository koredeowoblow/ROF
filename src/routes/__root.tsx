import React from 'react'
import { createRootRoute, Outlet, useRouterState, Link } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BagDrawer } from '@/features/bag/BagDrawer'
import { Button } from '@/components/Button'
import { DiamondMark, Logo } from '@/components/Logo'
import { formatAccentText } from '@/components/Mast'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
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

function RootComponent() {
  const router = useRouterState()
  const isAdmin = router.location.pathname.startsWith('/admin')

  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--ink)] text-[var(--bone)]">
      {!isAdmin && <Header />}

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {!isAdmin && <BagDrawer />}
      {!isAdmin && <Footer />}
    </div>
  )
}


