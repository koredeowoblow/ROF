import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Logo, DiamondMark } from '@/components/Logo'
import { Button } from '@/components/Button'
import { api } from '@/api/client'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('owner@rofrage.com')
  const [password, setPassword] = useState('admin')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [error, setError] = useState('')
  const [failureCount, setFailureCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return

    setLoading(true)
    setError('')

    try {
      const res = await api.adminLogin(password)
      if (res.success) {
        navigate({ to: '/admin' })
      } else {
        const nextFailures = failureCount + 1
        setFailureCount(nextFailures)
        if (nextFailures >= 5) {
          setIsLocked(true)
          setError('Account locked for 15 minutes following multiple unsuccessful attempts.')
        } else {
          setError(`Invalid credentials. ${5 - nextFailures} attempts remaining before temporary lockout.`)
        }
      }
    } catch {
      setError('Connection failure. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      data-tone="ink"
      className="min-h-[100svh] w-full flex flex-col items-center justify-center p-4 bg-[var(--ink)] text-[var(--bone)] grain-overlay relative"
    >
      {/* Background Ghost Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <Logo size="hero" ghost />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Top: Animated Logo Drawing */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo size="lg" animated />
          <div className="flex items-center gap-2 pt-2">
            <DiamondMark size={8} accent filled />
            <span className="label-caps text-[var(--acc)]">Studio Terminal</span>
          </div>
          <p className="text-xs text-[var(--muted)] font-sans">
            Authorized management credentials required for ledger access
          </p>
        </div>

        {/* Bone Login Card (The 30% layer) */}
        <Pane tone="bone" className="p-8 sm:p-10 border-2 border-[var(--ink)] shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                Admin Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  disabled={isLocked}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 text-sm font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)] disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                Studio Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  disabled={isLocked}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 text-sm font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)] disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                Two-Factor Passcode (Optional)
              </label>
              <input
                type="text"
                placeholder="6-digit authenticator code"
                value={twoFactorCode}
                disabled={isLocked}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full h-11 px-3 text-sm font-mono bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)] disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="p-3 bg-[var(--acc-on-bone)]/10 border border-[var(--acc-on-bone)] text-xs text-[var(--acc-on-bone)] font-sans flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              withArrow
              disabled={loading || isLocked}
            >
              {loading ? 'Authenticating...' : 'Sign In to Studio'}
            </Button>
          </form>

          <div className="pt-4 border-t border-[var(--hairline)] text-center">
            <span className="text-[11px] text-[var(--muted)] font-mono">
              ROF RAGE OS v1.0 • Demo pass: admin
            </span>
          </div>
        </Pane>
      </div>
    </div>
  )
}
