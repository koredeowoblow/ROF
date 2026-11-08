import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FileText, Check, AlertCircle, Save, Undo } from 'lucide-react'
import { Button } from '@/components/Button'
import { DiamondMark } from '@/components/Logo'
import { initialContentConfig, ContentConfig } from '@/content/config'
import { api } from '@/api/client'

export const Route = createFileRoute('/admin/content')({
  component: AdminContentPage,
})

function AdminContentPage() {
  const [content, setContent] = useState<ContentConfig>(initialContentConfig)
  const [toast, setToast] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    api.getContent().then((res) => setContent(res))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await api.updateContent(content)
    setIsSaving(false)
    setToast('Store copy and draft states updated.')
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 p-4 bg-[var(--bone)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-2xl text-xs font-sans font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-[var(--acc-on-bone)]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <span className="label-caps text-[var(--acc)]">Storefront Copy Management</span>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Content Manager</h1>
          <p className="text-xs text-[var(--muted)] font-sans">
            Review, edit and finalize brand copy, delivery tariffs and unconfirmed drafts
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {isSaving ? 'Saving Changes...' : 'Save All Copy'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Brand & Manifesto Copy */}
        <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
            <h2 className="font-serif text-xl text-[var(--bone)]">Brand Convictions & Taglines</h2>
            <span className="text-[10px] text-[var(--muted)] font-mono">Store Front Banner</span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="uppercase tracking-wider font-semibold text-[var(--bone)]">
                  Brand Tagline
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      brand: {
                        ...content.brand,
                        tagline: {
                          ...content.brand.tagline,
                          isDraft: !content.brand.tagline.isDraft,
                        },
                      },
                    })
                  }
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    content.brand.tagline.isDraft
                      ? 'border border-[var(--acc)] text-[var(--acc)]'
                      : 'bg-[var(--bone)] text-[var(--ink)]'
                  }`}
                >
                  {content.brand.tagline.isDraft ? 'Draft Status' : 'Confirmed'}
                </button>
              </div>
              <input
                type="text"
                value={content.brand.tagline.value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    brand: {
                      ...content.brand,
                      tagline: { ...content.brand.tagline, value: e.target.value },
                    },
                  })
                }
                className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="uppercase tracking-wider font-semibold text-[var(--bone)]">
                  Manifesto Headline
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      brand: {
                        ...content.brand,
                        manifestoHeadline: {
                          ...content.brand.manifestoHeadline,
                          isDraft: !content.brand.manifestoHeadline.isDraft,
                        },
                      },
                    })
                  }
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    content.brand.manifestoHeadline.isDraft
                      ? 'border border-[var(--acc)] text-[var(--acc)]'
                      : 'bg-[var(--bone)] text-[var(--ink)]'
                  }`}
                >
                  {content.brand.manifestoHeadline.isDraft ? 'Draft Status' : 'Confirmed'}
                </button>
              </div>
              <input
                type="text"
                value={content.brand.manifestoHeadline.value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    brand: {
                      ...content.brand,
                      manifestoHeadline: {
                        ...content.brand.manifestoHeadline,
                        value: e.target.value,
                      },
                    },
                  })
                }
                className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="uppercase tracking-wider font-semibold text-[var(--bone)]">
                  Manifesto Lead Copy
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      brand: {
                        ...content.brand,
                        manifestoLead: {
                          ...content.brand.manifestoLead,
                          isDraft: !content.brand.manifestoLead.isDraft,
                        },
                      },
                    })
                  }
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    content.brand.manifestoLead.isDraft
                      ? 'border border-[var(--acc)] text-[var(--acc)]'
                      : 'bg-[var(--bone)] text-[var(--ink)]'
                  }`}
                >
                  {content.brand.manifestoLead.isDraft ? 'Draft Status' : 'Confirmed'}
                </button>
              </div>
              <textarea
                rows={3}
                value={content.brand.manifestoLead.value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    brand: {
                      ...content.brand,
                      manifestoLead: {
                        ...content.brand.manifestoLead,
                        value: e.target.value,
                      },
                    },
                  })
                }
                className="w-full p-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delivery Fees & Policy */}
        <div className="p-6 border border-[var(--hairline)] bg-[var(--ink)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
            <h2 className="font-serif text-xl text-[var(--bone)]">Delivery Tariffs & Exchange Policy</h2>
            <span className="text-[10px] text-[var(--muted)] font-mono">Operations Rates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="uppercase tracking-wider font-semibold text-[var(--bone)]">
                  Lagos Delivery Fee (NGN)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      delivery: {
                        ...content.delivery,
                        lagosFee: {
                          ...content.delivery.lagosFee,
                          isDraft: !content.delivery.lagosFee.isDraft,
                        },
                      },
                    })
                  }
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    content.delivery.lagosFee.isDraft
                      ? 'border border-[var(--acc)] text-[var(--acc)]'
                      : 'bg-[var(--bone)] text-[var(--ink)]'
                  }`}
                >
                  {content.delivery.lagosFee.isDraft ? 'Draft' : 'Confirmed'}
                </button>
              </div>
              <input
                type="number"
                value={content.delivery.lagosFee.value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    delivery: {
                      ...content.delivery,
                      lagosFee: {
                        ...content.delivery.lagosFee,
                        value: Number(e.target.value),
                      },
                    },
                  })
                }
                className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="uppercase tracking-wider font-semibold text-[var(--bone)]">
                  Interstate Delivery Fee (NGN)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      delivery: {
                        ...content.delivery,
                        interstateFee: {
                          ...content.delivery.interstateFee,
                          isDraft: !content.delivery.interstateFee.isDraft,
                        },
                      },
                    })
                  }
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    content.delivery.interstateFee.isDraft
                      ? 'border border-[var(--acc)] text-[var(--acc)]'
                      : 'bg-[var(--bone)] text-[var(--ink)]'
                  }`}
                >
                  {content.delivery.interstateFee.isDraft ? 'Draft' : 'Confirmed'}
                </button>
              </div>
              <input
                type="number"
                value={content.delivery.interstateFee.value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    delivery: {
                      ...content.delivery,
                      interstateFee: {
                        ...content.delivery.interstateFee,
                        value: Number(e.target.value),
                      },
                    },
                  })
                }
                className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="uppercase tracking-wider font-semibold text-[var(--bone)]">
                  Exchange Window & Terms
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      delivery: {
                        ...content.delivery,
                        exchangePolicy: {
                          ...content.delivery.exchangePolicy,
                          isDraft: !content.delivery.exchangePolicy.isDraft,
                        },
                      },
                    })
                  }
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    content.delivery.exchangePolicy.isDraft
                      ? 'border border-[var(--acc)] text-[var(--acc)]'
                      : 'bg-[var(--bone)] text-[var(--ink)]'
                  }`}
                >
                  {content.delivery.exchangePolicy.isDraft ? 'Draft' : 'Confirmed'}
                </button>
              </div>
              <textarea
                rows={2}
                value={content.delivery.exchangePolicy.value}
                onChange={(e) =>
                  setContent({
                    ...content,
                    delivery: {
                      ...content.delivery,
                      exchangePolicy: {
                        ...content.delivery.exchangePolicy,
                        value: e.target.value,
                      },
                    },
                  })
                }
                className="w-full p-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
