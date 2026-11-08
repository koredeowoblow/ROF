import React, { useState, useEffect } from 'react'
import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard,
  ShoppingBag,
  Shirt,
  Users,
  MessageSquare,
  Boxes,
  FileText,
  Sliders,
  History,
  Search,
  Plus,
  LogOut,
  X,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Logo, DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { Pane } from '@/components/Pane'
import { api } from '@/api/client'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const [cmdOpen, setCmdOpen] = useState(false)
  const [cmdQuery, setCmdQuery] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Auth check
  useEffect(() => {
    try {
      const session = localStorage.getItem('rof_admin_session')
      if (session) {
        const parsed = JSON.parse(session)
        if (parsed.authenticated) {
          setIsAuthenticated(true)
        }
      }
    } catch {}
    setAuthChecked(true)
  }, [currentPath])

  // Global Command Palette Shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setCmdOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = async () => {
    await api.adminLogout()
    setIsAuthenticated(false)
    navigate({ to: '/admin/login' })
  }

  // Redirect to login if unauthenticated (unless already on login)
  if (authChecked && !isAuthenticated && currentPath !== '/admin/login') {
    navigate({ to: '/admin/login' })
    return null
  }

  // Login page bypasses the admin shell
  if (currentPath === '/admin/login') {
    return <Outlet />
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', href: '/admin/products', icon: Shirt },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Content', href: '/admin/content', icon: FileText },
    { label: 'Discounts', href: '/admin/discounts', icon: Sliders },
    { label: 'Settings', href: '/admin/settings', icon: Sliders },
    { label: 'Audit Log', href: '/admin/audit', icon: History },
  ]

  const mobileTabs = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', href: '/admin/products', icon: Shirt },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Content', href: '/admin/content', icon: FileText },
  ]

  const commandItems = [
    { label: 'New Product', href: '/admin/products', action: () => navigate({ to: '/admin/products' }) },
    { label: 'View Recent Orders', href: '/admin/orders', action: () => navigate({ to: '/admin/orders' }) },
    { label: 'Inventory Adjustment', href: '/admin/inventory', action: () => navigate({ to: '/admin/inventory' }) },
    { label: 'Customer Directory', href: '/admin/customers', action: () => navigate({ to: '/admin/customers' }) },
    { label: 'Edit Store Content', href: '/admin/content', action: () => navigate({ to: '/admin/content' }) },
    { label: 'Brand & Dispatch Settings', href: '/admin/settings', action: () => navigate({ to: '/admin/settings' }) },
    { label: 'Audit Trail', href: '/admin/audit', action: () => navigate({ to: '/admin/audit' }) },
    { label: 'Go to Storefront', href: '/', action: () => navigate({ to: '/' }) },
  ]

  const filteredCommands = commandItems.filter((item) =>
    item.label.toLowerCase().includes(cmdQuery.toLowerCase())
  )

  return (
    <div data-tone="ink" className="flex min-h-[100svh] bg-[var(--ink)] text-[var(--bone)]">
      {/* ============================================================ */}
      {/* 1. DESKTOP LEFT INK RAIL */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--hairline)] bg-[var(--ink)] fixed inset-y-0 left-0 z-30 grain-overlay">
        {/* Rail Header with Brand Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[var(--hairline)]">
          <Link to="/admin" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[var(--acc)]">
              Admin
            </span>
          </Link>
          <DiamondMark size={8} accent filled />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.12 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-sans uppercase tracking-[0.16em] transition-colors ${
                    isActive
                      ? 'bg-[var(--bone)] text-[var(--ink)] font-semibold shadow-sm'
                      : 'text-[var(--bone)]/75 hover:text-[var(--bone)] hover:bg-[var(--surface-tint)]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[var(--ink)]' : 'text-[var(--acc)]'}`} />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Rail Footer with User & Store link */}
        <div className="p-4 border-t border-[var(--hairline)] space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-[11px] text-[var(--muted)] hover:text-[var(--bone)] font-sans uppercase tracking-wider"
          >
            <span>Visit Storefront</span>
            <span>↗</span>
          </Link>
          <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--bone)]">Owner Studio</span>
              <span className="text-[10px] text-[var(--muted)]">Admin session active</span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-[var(--muted)] hover:text-[var(--acc)] p-1.5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      {/* ============================================================ */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Top Header Bar */}
        <header className="h-16 md:h-20 border-b border-[var(--hairline)] bg-[var(--ink)]/95 backdrop-blur-md sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between gap-4">
          {/* Global Search Button / Trigger */}
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-3 px-3.5 py-2 text-xs font-sans text-[var(--muted)] border border-[var(--hairline)] bg-transparent hover:border-[var(--bone)] transition-colors w-full max-w-xs md:max-w-md"
          >
            <Search className="h-3.5 w-3.5 text-[var(--acc)]" />
            <span>Search admin (orders, pieces, actions)...</span>
            <kbd className="hidden sm:inline-block ml-auto text-[10px] font-mono border border-[var(--hairline)] px-1.5 py-0.5 text-[var(--muted)]">
              ⌘K
            </kbd>
          </button>

          {/* Quick Action: New Product */}
          <div className="flex items-center gap-3">
            <Link to="/admin/products">
              <Button variant="primary" size="sm">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>New Piece</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Child Page Outlet */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* ============================================================ */}
      {/* 3. MOBILE FIVE-ITEM BOTTOM TAB BAR */}
      {/* ============================================================ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--ink)] border-t border-[var(--hairline)] px-2 py-1.5 flex items-center justify-around">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentPath === tab.href
          return (
            <motion.div
              key={tab.href}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <Link
                to={tab.href}
                className={`flex flex-col items-center gap-1 p-2 text-[10px] font-sans uppercase tracking-wider ${
                  isActive ? 'text-[var(--acc)] font-bold' : 'text-[var(--muted)] hover:text-[var(--bone)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* ============================================================ */}
      {/* 4. COMMAND PALETTE (CMD+K / CTRL+K) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              initial={{ scale: 0.97, y: -8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: -8, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl bg-[var(--ink)] border border-[var(--bone)] shadow-2xl p-4 text-[var(--bone)] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-[var(--acc)]" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type an action or navigate..."
                    value={cmdQuery}
                    onChange={(e) => setCmdQuery(e.target.value)}
                    className="w-full bg-transparent text-sm font-sans focus:outline-none text-[var(--bone)] placeholder:text-[var(--muted)]"
                  />
                </div>
                <button
                  onClick={() => setCmdOpen(false)}
                  className="text-[var(--muted)] hover:text-[var(--bone)] p-1 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1">
                {filteredCommands.length === 0 ? (
                  <p className="p-4 text-xs text-[var(--muted)] text-center font-sans">
                    No commands matching "{cmdQuery}"
                  </p>
                ) : (
                  filteredCommands.map((cmd) => (
                    <motion.button
                      key={cmd.label}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.1 }}
                      onClick={() => {
                        setCmdOpen(false)
                        cmd.action()
                      }}
                      className="w-full text-left p-3 text-xs uppercase tracking-wider font-sans hover:bg-[var(--bone)] hover:text-[var(--ink)] transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span>{cmd.label}</span>
                      <DiamondMark size={6} accent className="opacity-0 group-hover:opacity-100" />
                    </motion.button>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-[var(--hairline)] text-[10px] text-[var(--muted)] flex justify-between font-mono">
                <span>Navigate with arrow keys</span>
                <span>ESC to exit</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

