import React, { useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Minus, Check, ArrowRight, Shield, Truck } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Numeral } from '@/components/Numeral'
import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { Tape } from '@/components/Tape'
import { DiamondMark } from '@/components/Logo'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { initialProducts } from '@/api/products'
import { formatNaira, formatNairaAria } from '@/lib/money'
import { useBagStore } from '@/features/bag/bagStore'
import { Product } from '@/api/types'
import { formatAccentText } from '@/components/Mast'

export const Route = createFileRoute('/product/$id')({
  loader: ({ params }) => {
    const product = initialProducts.find((p) => p.slug === params.id || p.id === params.id)
    if (!product) {
      throw notFound()
    }
    return product
  },
  component: ProductPage,
})

function ProductPage() {
  const product = Route.useLoaderData()
  const addItem = useBagStore((s) => s.addItem)

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L')
  const [quantity, setQuantity] = useState(1)
  const [activeView, setActiveView] = useState<'full' | 'closeup'>('full')
  const [isAddedFeedback, setIsAddedFeedback] = useState(false)

  // Associated colourway pair if available
  const pairedProduct = product.pairId
    ? initialProducts.find((p) => p.id === product.pairId)
    : null

  // Other rail pieces (excluding current piece)
  const railPieces = initialProducts.filter((p) => p.id !== product.id)

  const getTeeMeta = (p: Product): { design: TeeDesign; colour: TeeColour } => {
    const design: TeeDesign = p.name.includes('Cards') ? 'cards' : p.name.includes('Wave') ? 'wave' : 'scribble'
    const colour: TeeColour = p.colour.toLowerCase().includes('green')
      ? 'forest-green'
      : p.colour.toLowerCase().includes('white')
      ? 'white'
      : 'black'
    return { design, colour }
  }

  const meta = getTeeMeta(product)

  // 3fr / 2fr split rule with Ink wider:
  // If product ground is ink: Image pane is Ink (7 cols, 3fr), Info pane is Bone (5 cols, 2fr).
  // If product ground is bone: Info pane is Ink (7 cols, 3fr), Image pane is Bone (5 cols, 2fr).
  const isImageInk = product.ground === 'ink'
  const imageCols = isImageInk ? 'lg:col-span-7' : 'lg:col-span-5'
  const infoCols = isImageInk ? 'lg:col-span-5' : 'lg:col-span-7'
  const imageTone: 'ink' | 'bone' = product.ground
  const infoTone: 'ink' | 'bone' = imageTone === 'ink' ? 'bone' : 'ink'

  const handleAddToBag = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        colour: product.colour,
        size: selectedSize,
        unitPrice: product.price,
        image: product.images[0],
      },
      quantity
    )
    setIsAddedFeedback(true)
    setTimeout(() => {
      useBagStore.getState().setIsOpen(true)
    }, 350)
    setTimeout(() => setIsAddedFeedback(false), 2000)
  }

  // Schema.org Product JSON-LD for rich snippets
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.blurb,
    brand: {
      '@type': 'Brand',
      name: 'ROF RAGE',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <div className="flex flex-col w-full">
      {/* Product JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb Tape */}
      <Tape
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: product.name },
        ]}
        rightContent={<span>Piece {String(product.position).padStart(2, '0')} of 05</span>}
      />

      {/* Main Split Section */}
      <div className="w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100svh-120px)]">
        {/* ============================================================ */}
        {/* 1. IMAGE PANE */}
        {/* ============================================================ */}
        <Pane
          tone={imageTone}
          withGrain={imageTone === 'ink'}
          className={`${imageCols} relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-[var(--hairline)] overflow-hidden`}
        >
          {/* Top Bar inside Image Pane */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--acc)]">
                {product.name}
              </span>
            </div>
            <Numeral value={product.position} size="md" />
          </div>

          {/* Interactive Cutout Stage */}
          <div className="relative z-10 my-8 flex-1 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-center max-w-lg"
              >
                <TeeCutout
                  design={meta.design}
                  colour={meta.colour}
                  view={activeView}
                  withDiamondAccent
                  className="w-full h-auto max-h-[520px]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom View Switcher (Full Piece vs Print Close-up) */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.12 }}
              onClick={() => setActiveView('full')}
              className={`touch-target-48 text-xs uppercase tracking-wider px-4 py-2 border transition-all cursor-pointer ${
                activeView === 'full'
                  ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] font-semibold shadow-sm'
                  : 'border-[var(--hairline)] text-[var(--fg)] hover:border-[var(--fg)] hover:bg-[var(--surface-tint)]'
              }`}
            >
              Full Silhouette
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.12 }}
              onClick={() => setActiveView('closeup')}
              className={`touch-target-48 text-xs uppercase tracking-wider px-4 py-2 border transition-all cursor-pointer ${
                activeView === 'closeup'
                  ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] font-semibold shadow-sm'
                  : 'border-[var(--hairline)] text-[var(--fg)] hover:border-[var(--fg)] hover:bg-[var(--surface-tint)]'
              }`}
            >
              Print Detail
            </motion.button>
          </div>
        </Pane>

        {/* ============================================================ */}
        {/* 2. INFO PANE */}
        {/* ============================================================ */}
        <Pane
          tone={infoTone}
          withGrain={infoTone === 'ink'}
          className={`${infoCols} p-6 sm:p-10 lg:p-12 flex flex-col justify-between`}
        >
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <span className="label-caps text-[var(--acc)]">Heavyweight Streetwear</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[var(--fg)] mt-1">
                {product.name}
              </h1>
              <p
                className="mt-2 text-2xl sm:text-3xl font-display font-medium text-[var(--fg)]"
                aria-label={formatNairaAria(product.price)}
              >
                {formatNaira(product.price)}
              </p>
            </div>

            {/* Colour Switcher (Link to alternate colourway if present) */}
            <div className="border-t border-b border-[var(--hairline)] py-4">
              <div className="flex items-center justify-between text-xs font-sans mb-2">
                <span className="label-caps text-[var(--muted)]">Colourway</span>
                <span className="font-semibold text-[var(--fg)]">{product.colour}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Active Colour Swatch */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="h-8 w-8 border-2 border-[var(--acc)] p-0.5 cursor-default shadow-sm"
                  title={product.colour}
                >
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: product.swatch }}
                  />
                </motion.div>

                {/* Paired Alternate Colourway Link */}
                {pairedProduct && (
                  <Link
                    to="/product/$id"
                    params={{ id: pairedProduct.slug }}
                    className="flex items-center gap-2 group cursor-pointer"
                    title={`Switch to ${pairedProduct.colour}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      className="h-8 w-8 border border-[var(--hairline)] p-0.5 opacity-75 group-hover:opacity-100 group-hover:border-[var(--fg)] transition-all"
                    >
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: pairedProduct.swatch }}
                      />
                    </motion.div>
                    <span className="text-xs text-[var(--muted)] group-hover:text-[var(--fg)] underline underline-offset-4 transition-colors">
                      View in {pairedProduct.colour}
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="label-caps text-[var(--muted)]">Select Size</span>
                <Link
                  to="/help"
                  hash="size-guide"
                  className="text-xs text-[var(--acc)] hover:underline"
                >
                  Size Guide & Measurements
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <Chip
                    key={v.size}
                    label={v.size}
                    sublabel={v.stock <= 5 ? `Low (${v.stock})` : undefined}
                    selected={selectedSize === v.size}
                    disabled={v.stock === 0}
                    onClick={() => setSelectedSize(v.size)}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Stepper with micro-interactions */}
            <div>
              <span className="label-caps text-[var(--muted)] block mb-2">Quantity</span>
              <div className="inline-flex items-center border border-[var(--hairline)] bg-transparent">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  transition={{ duration: 0.1 }}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="touch-target-48 h-12 w-12 flex items-center justify-center text-[var(--fg)] hover:bg-[var(--surface-tint)] disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <div className="w-12 text-center overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={quantity}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="block text-sm font-sans font-semibold text-[var(--fg)]"
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  transition={{ duration: 0.1 }}
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="touch-target-48 h-12 w-12 flex items-center justify-center text-[var(--fg)] hover:bg-[var(--surface-tint)] cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                withArrow={!isAddedFeedback}
                onClick={handleAddToBag}
              >
                {isAddedFeedback ? (
                  <motion.span
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-5 w-5" /> Added to Bag
                  </motion.span>
                ) : (
                  `Add to Bag • ${formatNaira(product.price * quantity)}`
                )}
              </Button>
            </div>

            {/* Product Specifications Table */}
            <div className="border-t border-[var(--hairline)] pt-5 space-y-3 text-xs font-sans">
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--hairline)]/50">
                <span className="text-[var(--muted)] uppercase tracking-wider">Silhouette</span>
                <span className="col-span-2 text-[var(--fg)] font-medium">Oversized, boxy streetwear cut</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--hairline)]/50">
                <span className="text-[var(--muted)] uppercase tracking-wider">Fabrication</span>
                <span className="col-span-2 text-[var(--fg)] font-medium">260 GSM combed cotton with dense 1.25" rib collar</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--hairline)]/50">
                <span className="text-[var(--muted)] uppercase tracking-wider">Print Spec</span>
                <span className="col-span-2 text-[var(--fg)] font-medium">{product.print}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-[var(--muted)] uppercase tracking-wider">Dispatch</span>
                <span className="col-span-2 text-[var(--fg)] font-medium">
                  Lagos (1-2 days {formatNaira(2500)}), Interstate (3-5 days {formatNaira(4500)})
                </span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-[var(--hairline)] flex items-center justify-between text-[11px] text-[var(--muted)] uppercase tracking-wider font-sans">
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-[var(--acc)]" />
              Express Dispatch
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-[var(--acc)]" />
              Size Exchange Supported
            </span>
          </div>
        </Pane>
      </div>

      {/* ============================================================ */}
      {/* 3. MOBILE STICKY BOTTOM BAR (Thumb Zone with Safe Area) */}
      {/* ============================================================ */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--ink)]/95 backdrop-blur-md border-t border-[var(--hairline)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-4"
      >
        <div>
          <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block">
            {product.name} ({selectedSize})
          </span>
          <span className="text-lg font-serif text-[var(--bone)] font-semibold leading-none">
            {formatNaira(product.price)}
          </span>
        </div>

        <Button
          variant="primary"
          size="md"
          className="flex-1"
          onClick={handleAddToBag}
        >
          {isAddedFeedback ? 'Added' : 'Add to bag'}
        </Button>
      </motion.div>

      {/* ============================================================ */}
      {/* 4. ALSO ON THE RAIL SECTION (Ink) */}
      {/* ============================================================ */}
      <section data-tone="ink" className="w-full bg-[var(--ink)] text-[var(--bone)] py-16 px-4 md:px-8 grain-overlay">
        <div className="mx-auto max-w-[var(--max-content)]">
          <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4 mb-8">
            <h2 className="text-3xl sm:text-4xl font-display text-[var(--bone)]">
              {formatAccentText('Also on the *rail*')}
            </h2>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-medium text-[var(--acc)] hover:underline flex items-center gap-1"
            >
              <span>View all pieces</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {railPieces.slice(0, 4).map((p) => {
              const pMeta = getTeeMeta(p)
              const tileTone: 'ink' | 'bone' = p.ground

              return (
                <Link
                  key={p.id}
                  to="/product/$id"
                  params={{ id: p.slug }}
                  className="group flex flex-col border border-[var(--hairline)] bg-[var(--ink)] overflow-hidden transition-all duration-200 hover:border-[var(--bone)]"
                >
                  <div
                    data-tone={tileTone}
                    className={`relative aspect-square w-full flex items-center justify-center p-4 overflow-hidden ${
                      tileTone === 'ink' ? 'bg-[var(--surface-deep)]' : 'bg-[var(--bone-muted)]'
                    }`}
                  >
                    <TeeCutout
                      design={pMeta.design}
                      colour={pMeta.colour}
                      withDiamondAccent={false}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 bg-[var(--ink)] border-t border-[var(--hairline)]">
                    <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{p.colour}</p>
                    <h3 className="font-serif text-base text-[var(--bone)] truncate group-hover:text-[var(--acc)] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs font-sans text-[var(--bone)] mt-1 font-medium">
                      {formatNaira(p.price)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

