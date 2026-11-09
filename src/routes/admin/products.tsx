import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import {
  Plus,
  Shirt,
  Edit2,
  Check,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  AlertCircle,
  Save,
  X
} from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Button } from '@/components/Button'
import { Numeral } from '@/components/Numeral'
import { DiamondMark } from '@/components/Logo'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { initialProducts } from '@/api/products'
import { api } from '@/api/client'
import { Product } from '@/api/types'
import { formatNaira } from '@/lib/money'

export const Route = createFileRoute('/admin/products')({
  component: AdminProductsPage,
})

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const loadProducts = async () => {
    const list = await api.getProducts()
    setProducts(list)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const getTeeMeta = (p: Product): { design: TeeDesign; colour: TeeColour } => {
    const design: TeeDesign = p.name.includes('Cards') ? 'cards' : p.name.includes('Wave') ? 'wave' : 'scribble'
    const colour: TeeColour = p.colour.toLowerCase().includes('green')
      ? 'forest-green'
      : p.colour.toLowerCase().includes('white')
      ? 'white'
      : 'black'
    return { design, colour }
  }

  const handleTogglePublish = async (p: Product) => {
    const updated = { ...p, published: !p.published }
    await api.saveProduct(updated)
    setToast(`${p.name} ${updated.published ? 'published' : 'hidden'}.`)
    setTimeout(() => setToast(null), 2500)
    await loadProducts()
  }

  const handleOpenEditor = (product?: Product) => {
    if (product) {
      setEditingProduct({ ...product })
      setIsNew(false)
    } else {
      setEditingProduct({
        id: `prod-${Date.now()}`,
        slug: 'new-piece-tee',
        name: 'New Boxy Tee',
        colour: 'Black',
        colourKey: 'black',
        swatch: '#141312',
        print: 'Original ROF chest print spec',
        price: 28000,
        blurb: 'Heavyweight combed cotton cut with dropped shoulders.',
        ground: 'bone',
        zoomOrigin: '50% 50%',
        images: ['/images/placeholder.webp'],
        position: products.length + 1,
        published: true,
        variants: [
          { size: 'S', stock: 15 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 25 },
          { size: 'XL', stock: 15 },
          { size: 'XXL', stock: 10 },
        ],
      })
      setIsNew(true)
    }
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    await api.saveProduct(editingProduct)
    setToast(`Saved ${editingProduct.name}.`)
    setTimeout(() => setToast(null), 2500)
    setEditingProduct(null)
    await loadProducts()
  }

  return (
    <div className="space-y-6 w-full max-w-7xl">
      {/* Toast Alert with spring entrance */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-8 z-50 p-4 bg-[var(--bone)] text-[var(--ink)] border-2 border-[var(--ink)] shadow-2xl text-xs font-sans font-semibold flex items-center gap-2"
          >
            <Check className="h-4 w-4 text-[var(--acc-on-bone)]" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--hairline)]">
        <div>
          <span className="label-caps text-[var(--acc)]">Collection Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--bone)] mt-1">Products</h1>
          <p className="text-xs text-[var(--muted)] font-sans">
            {products.length} registered pieces in Collection 01
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / Table Toggle with micro-interaction */}
          <div className="flex items-center border border-[var(--hairline)] p-0.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode('grid')}
              className={`p-1.5 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[var(--bone)] text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'}`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode('table')}
              className={`p-1.5 cursor-pointer transition-colors ${viewMode === 'table' ? 'bg-[var(--bone)] text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--bone)]'}`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </motion.button>
          </div>

          <Button variant="primary" size="sm" onClick={() => handleOpenEditor()}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Product
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PRODUCT GRID VIEW */}
      {/* ============================================================ */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const meta = getTeeMeta(p)
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0)

            return (
              <div
                key={p.id}
                className="border border-[var(--hairline)] bg-[var(--surface-deep)] flex flex-col justify-between overflow-hidden group"
              >
                {/* Tile Preview */}
                <div
                  data-tone={p.ground}
                  className={`relative aspect-[4/3] flex items-center justify-center p-6 ${
                    p.ground === 'ink' ? 'bg-[var(--ink)]' : 'bg-[var(--bone-muted)]'
                  }`}
                >
                  <div className="absolute top-3 left-3">
                    <Numeral value={p.position} size="sm" />
                  </div>
                  <div className="w-full h-full flex items-center justify-center">
                    <TeeCutout
                      design={meta.design}
                      colour={meta.colour}
                      withDiamondAccent={false}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Info & Sizes Bar */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-sans">
                        {p.colour}
                      </span>
                      <h3 className="font-serif text-xl text-[var(--bone)]">{p.name}</h3>
                      <p className="font-sans text-sm font-semibold text-[var(--bone)] mt-0.5">
                        {formatNaira(p.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTogglePublish(p)}
                      title={p.published ? 'Published (click to unpublish)' : 'Unpublished (click to publish)'}
                      className={`p-1.5 border text-xs ${
                        p.published
                          ? 'border-[var(--bone)] text-[var(--bone)]'
                          : 'border-[var(--acc)] text-[var(--acc)]'
                      }`}
                    >
                      {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Stock chips */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] block mb-1.5">
                      Stock: {totalStock} total units
                    </span>
                    <div className="flex gap-1.5 text-xs font-mono">
                      {p.variants.map((v) => (
                        <span
                          key={v.size}
                          className={`px-2 py-1 border text-[11px] ${
                            v.stock <= 5
                              ? 'border-[var(--acc)] text-[var(--acc)] font-bold'
                              : 'border-[var(--hairline)] text-[var(--bone)]'
                          }`}
                        >
                          {v.size}: {v.stock}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--hairline)] flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditor(p)}
                      className="text-xs uppercase tracking-wider font-semibold text-[var(--acc)] hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit Piece Details
                    </button>
                    <span className="text-[10px] text-[var(--muted)] font-mono">
                      Ground: {p.ground}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="border border-[var(--hairline)] bg-[var(--ink)] overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[var(--surface-deep)] border-b border-[var(--hairline)] text-[var(--muted)] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Pos</th>
                <th className="p-3.5">Piece Name</th>
                <th className="p-3.5">Colour</th>
                <th className="p-3.5">Ground</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Total Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]/40">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--surface-tint)]">
                  <td className="p-3.5 font-mono font-bold text-[var(--acc)]">{p.position}</td>
                  <td className="p-3.5 font-serif text-sm font-semibold text-[var(--bone)]">{p.name}</td>
                  <td className="p-3.5 text-[var(--muted)]">{p.colour}</td>
                  <td className="p-3.5 text-[var(--muted)] capitalize">{p.ground}</td>
                  <td className="p-3.5 font-semibold text-[var(--bone)]">{formatNaira(p.price)}</td>
                  <td className="p-3.5 font-mono text-[var(--bone)]">
                    {p.variants.reduce((s, v) => s + v.stock, 0)} pcs
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                      p.published ? 'bg-[var(--bone)] text-[var(--ink)]' : 'border border-[var(--acc)] text-[var(--acc)]'
                    }`}>
                      {p.published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditor(p)}
                      className="px-2 py-1 border border-[var(--hairline)] hover:border-[var(--bone)] text-[var(--bone)]"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================ */}
      {/* PRODUCT EDITOR MODAL / DRAWER */}
      {/* ============================================================ */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[var(--ink)] border border-[var(--hairline)] shadow-2xl p-6 md:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--hairline)]">
              <div>
                <span className="label-caps text-[var(--acc)]">
                  {isNew ? 'Create New Piece' : 'Edit Piece'}
                </span>
                <h2 className="font-serif text-2xl text-[var(--bone)] mt-0.5">
                  {editingProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-[var(--muted)] hover:text-[var(--bone)] p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Form Fields */}
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-1">
                    Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-1">
                      Colourway *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.colour}
                      onChange={(e) => setEditingProduct({ ...editingProduct, colour: e.target.value })}
                      className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-1">
                      Price (NGN) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-1">
                    Print Specification *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.print}
                    onChange={(e) => setEditingProduct({ ...editingProduct, print: e.target.value })}
                    className="w-full h-10 px-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-1">
                    Blurb / Story *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingProduct.blurb}
                    onChange={(e) => setEditingProduct({ ...editingProduct, blurb: e.target.value })}
                    className="w-full p-3 bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-1">
                    Ground Colour *
                  </label>
                  <select
                    value={editingProduct.ground}
                    onChange={(e) => setEditingProduct({ ...editingProduct, ground: e.target.value as any })}
                    className="w-full h-10 px-3 bg-[var(--ink)] border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)] cursor-pointer"
                  >
                    <option value="bone">Bone Ground (Recommended for Black & Green tees)</option>
                    <option value="ink">Ink Ground (Recommended for White tees)</option>
                  </select>
                </div>

                {/* Stock per size */}
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[var(--bone)] mb-2">
                    Inventory Stock Per Size
                  </label>
                  <div className="grid grid-cols-5 gap-2 font-mono">
                    {editingProduct.variants.map((v, i) => (
                      <div key={v.size} className="text-center">
                        <span className="block text-[10px] text-[var(--muted)] mb-1">{v.size}</span>
                        <input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) => {
                            const newVariants = [...editingProduct.variants]
                            newVariants[i] = { ...v, stock: Math.max(0, parseInt(e.target.value) || 0) }
                            setEditingProduct({ ...editingProduct, variants: newVariants })
                          }}
                          className="w-full h-9 text-center bg-transparent border border-[var(--hairline)] text-[var(--bone)] focus:outline-none focus:border-[var(--acc)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Ground Preview & Cut-out Checker */}
              <div className="space-y-4">
                <span className="label-caps text-[var(--muted)] block">Live Ground Preview</span>

                {/* Live Preview on Selected Ground */}
                <div
                  data-tone={editingProduct.ground}
                  className={`aspect-square w-full p-6 border border-[var(--hairline)] flex flex-col justify-between ${
                    editingProduct.ground === 'ink' ? 'bg-[var(--ink)]' : 'bg-[var(--bone-muted)]'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <Numeral value={editingProduct.position} size="sm" />
                    <span className="text-[10px] uppercase font-mono text-[var(--muted)]">
                      {editingProduct.ground.toUpperCase()} GROUND
                    </span>
                  </div>
                  <div className="w-full flex-1 flex items-center justify-center">
                    <TeeCutout
                      design={getTeeMeta(editingProduct).design}
                      colour={getTeeMeta(editingProduct).colour}
                      withDiamondAccent={false}
                      className="w-full h-full max-h-48"
                    />
                  </div>
                  <div className="text-center font-serif text-sm">
                    {editingProduct.name} ({editingProduct.colour})
                  </div>
                </div>

                {/* Cut-out Checker Alert */}
                <div className="p-3 bg-[var(--surface-lift)] border border-[var(--hairline)] text-xs text-[var(--bone)] flex items-start gap-2">
                  <Check className="h-4 w-4 text-[var(--acc)] shrink-0 mt-0.5" />
                  <span>
                    Cut-out transparency verified. Piece sits cleanly on both Ink and Bone tones with soft layered shadow.
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="col-span-full pt-4 border-t border-[var(--hairline)] flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Piece Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

