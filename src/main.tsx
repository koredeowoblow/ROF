import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { initPwaAutoUpdate } from '@/lib/pwa'
import '@/styles/base.css'

// Automatically detect updates and reload without requiring hard refresh
initPwaAutoUpdate()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache retention
      gcTime: 15 * 60 * 1000,    // 15 minutes garbage collection threshold
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      retry: 1,
    },
  },
})

// Create router instance with eager preloading and cache optimizations
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadDelay: 40,
  defaultPreloadStaleTime: 30 * 1000, // Preloaded routes remain fresh for 30s
  scrollRestoration: true,
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

async function startApp() {
  // Only load MSW in development if explicitly requested via ?msw=true (completely excluded from production bundles)
  if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.search.includes('msw=true')) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  )
}

startApp()
