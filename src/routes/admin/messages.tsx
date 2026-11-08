import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MessageSquare, Mail, Check, Phone, Reply, Clock } from 'lucide-react'
import { Button } from '@/components/Button'
import { api } from '@/api/client'
import { ContactMessage } from '@/api/types'

export const Route = createFileRoute('/admin/messages')({
  component: AdminMessagesPage,
})

function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const loadMessages = async () => {
    const list = await api.getAdminMessages()
    setMessages(list)
    if (list.length > 0 && !selectedMessage) {
      setSelectedMessage(list[0])
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleToggleHandled = async (msg: ContactMessage) => {
    await api.toggleMessageHandled(msg.id!)
    setToast(`Marked inquiry as ${!msg.handled ? 'handled' : 'unhandled'}.`)
    setTimeout(() => setToast(null), 2500)
    await loadMessages()
  }

  const handleSendReply = () => {
    if (!replyText || !selectedMessage) return
    window.location.href = `mailto:${selectedMessage.email}?subject=Regarding your ROF inquiry&body=${encodeURIComponent(replyText)}`
    setToast('Draft opened in default email client.')
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="space-y-6 w-full max-w-7xl">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-[var(--bone)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-2xl text-xs font-sans font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-[var(--acc-on-bone)]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-[var(--hairline)]">
        <span className="label-caps text-[var(--acc)]">Studio Inquiries</span>
        <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Messages</h1>
        <p className="text-xs text-[var(--muted)] font-sans">
          Customer questions, pop-up inquiries and size consultations
        </p>
      </div>

      {/* Grid: Message List (5 cols) + Message Reader (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 border border-[var(--hairline)] bg-[var(--ink)] divide-y divide-[var(--hairline)]">
          {messages.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMessage(m)}
              className={`p-4 cursor-pointer hover:bg-[var(--surface-tint)] transition-colors ${
                selectedMessage?.id === m.id ? 'bg-[var(--surface-tint)]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[var(--bone)]">{m.name}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 font-semibold ${
                    m.handled ? 'bg-[var(--bone)] text-[var(--ink)]' : 'border border-[var(--acc)] text-[var(--acc)]'
                  }`}
                >
                  {m.handled ? 'Handled' : 'Needs Reply'}
                </span>
              </div>
              <p className="text-xs text-[var(--bone)] font-serif mt-1 truncate">{m.message}</p>
              <p className="text-[10px] text-[var(--muted)] font-sans mt-1">
                {new Date(m.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Message Reader / Reply Composer (7 cols) */}
        <div className="lg:col-span-7 border border-[var(--hairline)] p-6 bg-[var(--ink)] space-y-6">
          {selectedMessage ? (
            <>
              <div className="flex items-start justify-between pb-4 border-b border-[var(--hairline)]">
                <div>
                  <span className="label-caps text-[var(--acc)]">Customer Detail</span>
                  <h3 className="font-serif text-2xl text-[var(--bone)] mt-1">
                    {selectedMessage.name}
                  </h3>
                  <div className="text-xs text-[var(--muted)] space-y-0.5 mt-1 font-sans">
                    <p>Email: {selectedMessage.email}</p>
                    {selectedMessage.phone && <p>Phone: {selectedMessage.phone}</p>}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleHandled(selectedMessage)}
                >
                  {selectedMessage.handled ? 'Mark Unhandled' : 'Mark as Handled'}
                </Button>
              </div>

              {/* Message Body */}
              <div className="p-4 bg-[#141312] border border-[var(--hairline)] text-sm font-sans text-[var(--bone)] leading-relaxed">
                "{selectedMessage.message}"
              </div>

              {/* Quick Reply Composer */}
              <div className="space-y-3">
                <span className="label-caps text-[var(--muted)]">Quick Email Template Reply</span>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Hi ${selectedMessage.name},\n\nThank you for reaching out to ROF RAGE...`}
                  className="w-full p-3 text-xs font-sans bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
                />
                <Button variant="primary" size="sm" onClick={handleSendReply}>
                  <Reply className="h-3.5 w-3.5 mr-1.5" />
                  Open in Mail Client
                </Button>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-[var(--muted)]">
              Select an inquiry to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

