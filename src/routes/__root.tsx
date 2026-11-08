import React from 'react'
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BagDrawer } from '@/features/bag/BagDrawer'

export const Route = createRootRoute({
  component: RootComponent,
})

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
