import { registerSW } from 'virtual:pwa-register'

let isRefreshing = false

/**
 * Initializes automatic PWA and Service Worker updates.
 * Eliminates the need for manual hard-refreshes (Ctrl+Shift+R) when new versions deploy.
 */
export function initPwaAutoUpdate(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  // When a newly activated service worker takes control of the page,
  // reload the window once so the user immediately runs the fresh bundle.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!isRefreshing) {
      isRefreshing = true
      window.location.reload()
    }
  })

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Instantly trigger skipWaiting on the new worker
      updateSW(true)
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return

      // 1. Periodically check for new updates in background (every 10 minutes)
      const intervalId = window.setInterval(() => {
        registration.update().catch(() => {})
      }, 10 * 60 * 1000)

      // 2. Proactively check for updates whenever visitor focuses or switches back to tab
      const onFocusOrVisibility = () => {
        if (document.visibilityState === 'visible') {
          registration.update().catch(() => {})
        }
      }
      window.addEventListener('focus', onFocusOrVisibility)
      document.addEventListener('visibilitychange', onFocusOrVisibility)

      // 3. Check when regaining internet connection
      window.addEventListener('online', () => {
        registration.update().catch(() => {})
      })

      // Cleanup if window unloads
      window.addEventListener('pagehide', () => {
        window.clearInterval(intervalId)
        window.removeEventListener('focus', onFocusOrVisibility)
        document.removeEventListener('visibilitychange', onFocusOrVisibility)
      })
    },
    onRegisterError(error) {
      console.warn('[ROF PWA] Registration warning:', error)
    },
  })
}

