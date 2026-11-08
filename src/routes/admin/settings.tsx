import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Sliders, Check, Shield, Landmark, Mail, Users } from 'lucide-react'
import { Button } from '@/components/Button'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
})

function AdminSettingsPage() {
  const [toast, setToast] = useState<string | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setToast('Configuration settings updated successfully.')
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-[var(--bone)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-2xl text-xs font-sans font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-[var(--acc-on-bone)]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-[var(--hairline)]">
        <span className="label-caps text-[var(--acc)]">Operational Infrastructure</span>
        <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Settings</h1>
        <p className="text-xs text-[var(--muted)] font-sans">
          Store gateway keys, staff role authorizations and fulfillment thresholds
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-sans">
        {/* Payment Gateways */}
        <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--hairline)]">
            <Landmark className="h-4 w-4 text-[var(--acc)]" />
            <h2 className="font-serif text-xl text-[var(--bone)]">Payment Gateways</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-1">
                Paystack Secret Key (Nigeria Live / Test)
              </label>
              <input
                type="password"
                defaultValue="sk_test_98a7192837491028475918274"
                className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] font-mono focus:outline-none focus:border-[var(--acc)]"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-1">
                Paystack Webhook URL Endpoint
              </label>
              <input
                type="text"
                readOnly
                defaultValue="https://rofrage.com/api/v1/payments/paystack/webhook"
                className="w-full h-10 px-3 bg-[#161514] border border-[var(--hairline)] text-[var(--muted)] font-mono select-all"
              />
            </div>
          </div>
        </div>

        {/* Studio Team & Roles */}
        <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--hairline)]">
            <Users className="h-4 w-4 text-[var(--acc)]" />
            <h2 className="font-serif text-xl text-[var(--bone)]">Staff Roles & Permissions</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 border border-[var(--hairline)] bg-[#141312] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--bone)]">Studio Owner</p>
                <p className="text-[10px] text-[var(--muted)]">owner@rofrage.com • Full administrative control</p>
              </div>
              <span className="px-2 py-0.5 bg-[var(--bone)] text-[var(--ink)] text-[10px] font-semibold uppercase">
                Owner Role
              </span>
            </div>

            <div className="p-3 border border-[var(--hairline)] bg-[#141312] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--bone)]">Dispatch Staff</p>
                <p className="text-[10px] text-[var(--muted)]">fulfillment@rofrage.com • Orders & Inventory only</p>
              </div>
              <span className="px-2 py-0.5 border border-[var(--hairline)] text-[var(--bone)] text-[10px] font-semibold uppercase">
                Staff Role
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}

