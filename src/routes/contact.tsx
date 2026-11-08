import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Mail, Phone, MessageSquare, MapPin, Instagram, Check } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Mast } from '@/components/Mast'
import { Button } from '@/components/Button'
import { DiamondMark } from '@/components/Logo'
import { initialContentConfig } from '@/content/config'
import { api } from '@/api/client'
import { formatAccentText } from '@/components/Mast'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const contact = initialContentConfig.contact

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setLoading(true)
    try {
      await api.sendContactMessage(form)
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      alert('Could not deliver message. Please reach out via email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Masthead */}
      <Mast
        badge="Direct Inquiry"
        title="Connect with *ROF.*"
        lead="Our studio concierge is active Monday through Saturday. Reach out regarding piece inquiries, fit consultations, and orders."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
      />

      {/* 2. Ink & Bone Split */}
      <div className="w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Ink Pane (3fr / 7 cols): Direct Coordinates */}
        <Pane tone="ink" withGrain className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--acc)]">Studio Coordinates</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-display text-[var(--bone)] leading-tight max-w-lg">
              {formatAccentText('We respond with *conviction.*')}
            </h2>

            <div className="mt-10 space-y-6 text-sm font-sans">
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-[var(--acc)] shrink-0 mt-0.5" />
                <div>
                  <span className="label-caps text-[var(--muted)] block">Orders & Inquiries</span>
                  <a href={`mailto:${contact.email.value}`} className="text-base text-[var(--bone)] hover:underline">
                    {contact.email.value}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-[var(--acc)] shrink-0 mt-0.5" />
                <div>
                  <span className="label-caps text-[var(--muted)] block">Phone Line</span>
                  <a href={`tel:${contact.phone.value}`} className="text-base text-[var(--bone)] hover:underline">
                    {contact.phone.value}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageSquare className="h-5 w-5 text-[var(--acc)] shrink-0 mt-0.5" />
                <div>
                  <span className="label-caps text-[var(--muted)] block">WhatsApp Concierge</span>
                  <span className="text-base text-[var(--bone)]">{contact.whatsapp.value}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Instagram className="h-5 w-5 text-[var(--acc)] shrink-0 mt-0.5" />
                <div>
                  <span className="label-caps text-[var(--muted)] block">Instagram</span>
                  <span className="text-base text-[var(--bone)]">{contact.instagram.value}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-[var(--acc)] shrink-0 mt-0.5" />
                <div>
                  <span className="label-caps text-[var(--muted)] block">Dispatch Operations</span>
                  <span className="text-base text-[var(--bone)]">{contact.location.value}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[var(--hairline)]">
            <span className="label-caps text-[var(--acc)]">ROF RAGE • Destined for riches</span>
          </div>
        </Pane>

        {/* Bone Pane (2fr / 5 cols): Message Form */}
        <Pane tone="bone" className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          <div>
            <span className="label-caps text-[var(--acc-on-bone)]">Direct Message</span>
            <h3 className="font-serif text-3xl text-[var(--ink)] mt-2 mb-6">Send an inquiry</h3>

            {submitted ? (
              <div className="p-8 bg-[#ded6c3] border-2 border-[var(--ink)] space-y-3">
                <div className="flex items-center gap-2 text-[var(--acc-on-bone)]">
                  <Check className="h-5 w-5" />
                  <span className="font-semibold text-sm">Message Delivered</span>
                </div>
                <p className="text-xs text-[var(--ink)] leading-relaxed font-sans">
                  Thank you for reaching out. Our team will review your message and reply via email within 24 hours.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full h-11 px-3 text-sm font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email address"
                    className="w-full h-11 px-3 text-sm font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+234..."
                    className="w-full h-11 px-3 text-sm font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--ink)] mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What would you like to ask or discuss?"
                    className="w-full p-3 text-sm font-sans bg-transparent border border-[var(--hairline)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc-on-bone)]"
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
                  {loading ? 'Transmitting...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </Pane>
      </div>
    </div>
  )
}
