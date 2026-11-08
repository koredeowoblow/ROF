import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Logo, DiamondMark } from './Logo'
import { Button } from './Button'
import { api } from '@/api/client'
import { formatAccentText } from './Mast'
import { cn } from '@/lib/utils'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    try {
      await api.joinNewsletter(email)
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer data-tone="ink" className="relative w-full border-t border-[var(--hairline)] bg-[var(--ink)] text-[var(--bone)]">
      {/* Top Section: Newsletter Block */}
      <div className="mx-auto max-w-[var(--max-content)] px-4 md:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <span className="label-caps text-[var(--acc)]">Access</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display mt-3 text-[var(--bone)] leading-tight">
              {formatAccentText('Join the *list*')}
            </h2>
            <p className="mt-3 text-sm md:text-base text-[var(--muted)] max-w-md font-sans">
              First call on new pieces, restocks and private studio drops. No noise, strictly craft and ambition.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                inputMode="email"
                autoComplete="email"
                className="h-12 flex-1 px-4 text-sm font-sans bg-transparent border border-[var(--hairline)] text-[var(--bone)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc)] transition-colors"
              />
              <Button type="submit" variant="primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </Button>
            </form>

            {status === 'success' && (
              <p className="mt-2 text-xs text-[var(--bone)] flex items-center gap-2">
                <DiamondMark size={8} accent filled />
                You are on the list. Destined for riches.
              </p>
            )}
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="my-12 h-[1px] w-full bg-[var(--hairline)]" />

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-sans">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
            </div>
            <p className="text-[var(--muted)] text-xs leading-relaxed max-w-[220px]">
              Oversized heavyweight streetwear engineered in Lagos, Nigeria. Built for ambition and legacy.
            </p>
          </div>

          <div>
            <h3 className="label-caps text-[var(--bone)] mb-4 font-semibold">Shop</h3>
            <ul className="space-y-2.5 text-[var(--muted)]">
              <li>
                <Link to="/shop" className="hover:text-[var(--bone)] transition-colors">
                  All Pieces
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ colour: 'green' }} className="hover:text-[var(--bone)] transition-colors">
                  Destined Cards
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ colour: 'white' }} className="hover:text-[var(--bone)] transition-colors">
                  Rage Wave
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ colour: 'black' }} className="hover:text-[var(--bone)] transition-colors">
                  Rage Scribble
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label-caps text-[var(--bone)] mb-4 font-semibold">Brand</h3>
            <ul className="space-y-2.5 text-[var(--muted)]">
              <li>
                <Link to="/story" className="hover:text-[var(--bone)] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--bone)] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-[var(--bone)] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[var(--acc)] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label-caps text-[var(--bone)] mb-4 font-semibold">Support</h3>
            <ul className="space-y-2.5 text-[var(--muted)]">
              <li>
                <Link to="/help" className="hover:text-[var(--bone)] transition-colors">
                  Delivery & States
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-[var(--bone)] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-[var(--bone)] transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-[var(--bone)] transition-colors">
                  Privacy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Signature Bone Bottom Strip */}
      <div
        data-tone="bone"
        className="w-full bg-[var(--bone)] text-[var(--ink)] py-3 px-4 md:px-8 border-t border-[var(--hairline)]"
      >
        <div className="mx-auto flex max-w-[var(--max-content)] items-center justify-between text-xs tracking-[0.2em] uppercase font-sans">
          <div className="flex items-center gap-3">
            <DiamondMark size={8} accent filled />
            <span className="font-semibold">Destined for riches</span>
            <DiamondMark size={8} accent filled />
          </div>
          <div className="text-[11px] opacity-75">
            ROF RAGE • Lagos, Nigeria
          </div>
        </div>
      </div>
    </footer>
  )
}
