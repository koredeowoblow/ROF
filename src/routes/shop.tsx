import React, { useState, useMemo } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { z } from 'zod'
import { Search, SlidersHorizontal, ArrowUpDown, X, LayoutGrid, Columns3 } from 'lucide-react'
import { Pane } from '@/components/Pane'
import { Mast } from '@/components/Mast'
import { Numeral } from '@/components/Numeral'
import { Chip } from '@/components/Chip'
import { Button } from '@/components/Button'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'
import { ShopAccordion } from '@/components/ShopAccordion'
import { initialProducts } from '@/api/products'
import { formatNaira } from '@/lib/money'
import { Product } from '@/api/types'
import { cn } from '@/lib/utils'

const ShopSearchSchema = z.object({
  colour: z.enum(['black', 'white', 'green']).optional(),
  sort: z.enum(['featured', 'price-low', 'price-high']).optional(),
  q: z.string().optional(),
})

type ShopSearchParams = z.infer<typeof ShopSearchSchema>

export const Route = createFileRoute('/shop')({
  validateSearch: (search: Record<string, unknown>): ShopSearchParams => {
    return ShopSearchSchema.parse(search)
  },
  component: ShopPage,
})

function ShopPage() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState(searchParams.q || '')
  const [viewMode, setViewMode] = useState<'accordion' | 'grid'>('accordion')
  const activeColour = searchParams.colour
  const activeSort = searchParams.sort || 'featured'

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts]

    // Colour filter
    if (activeColour) {
      list = list.filter((p) => p.colourKey === activeColour)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.print.toLowerCase().includes(q) ||
          p.colour.toLowerCase().includes(q)
      )
    }

    // Sorting
    if (activeSort === 'price-low') {
      list.sort((a, b) => a.price - b.price)
    } else if (activeSort === 'price-high') {
      list.sort((a, b) => b.price - a.price)
    } else {
      list.sort((a, b) => a.position - b.position)
    }

    return list
  }, [activeColour, searchQuery, activeSort])

  const handleColourChange = (colour?: 'black' | 'white' | 'green') => {
    navigate({
      to: '/shop',
      search: {
        colour: activeColour === colour ? undefined : colour,
        sort: activeSort,
        q: searchQuery || undefined,
      },
    })
  }

  const handleSortChange = (sort: 'featured' | 'price-low' | 'price-high') => {
    navigate({
      to: '/shop',
      search: {
        colour: activeColour,
        sort,
        q: searchQuery || undefined,
      },
    })
  }

  const getTeeMeta = (p: Product): { design: TeeDesign; colour: TeeColour } => {
    const design: TeeDesign = p.name.includes('Cards') ? 'cards' : p.name.includes('Wave') ? 'wave' : 'scribble'
    const colour: TeeColour = p.colour.toLowerCase().includes('green')
      ? 'forest-green'
      : p.colour.toLowerCase().includes('white')
      ? 'white'
      : 'black'
    return { design, colour }
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Ink Masthead & Bone Breadcrumb Tape */}
      <Mast
        badge="Collection 01"
        title="The *collection*"
        lead="Five heavyweight pieces. Oversized streetwear silhouettes engineered for greatness and original ambition."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
        ]}
        rightContent={<span>Five pieces available</span>}
      />

      {/* 2. Bone Body: Filter Strip & Product Grid */}
      <Pane tone="bone" className="min-h-screen py-8 px-4 md:px-8">
        <div className="mx-auto max-w-[var(--max-content)]">
          {/* Sticky Filter Bar */}
          <div className="sticky top-16 md:top-20 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-[var(--bone)]/95 backdrop-blur-md border-b border-[var(--hairline)] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Left: Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs uppercase tracking-wider font-semibold mr-1 flex items-center gap-1.5 text-[var(--ink)]">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Colour:</span>
              </span>
              <Chip
                label="All"
                selected={!activeColour}
                onClick={() => handleColourChange(undefined)}
                className="h-9 px-3 text-[11px]"
              />
              <Chip
                label="White"
                selected={activeColour === 'white'}
                onClick={() => handleColourChange('white')}
                className="h-9 px-3 text-[11px]"
              />
              <Chip
                label="Black"
                selected={activeColour === 'black'}
                onClick={() => handleColourChange('black')}
                className="h-9 px-3 text-[11px]"
              />
              <Chip
                label="Forest Green"
                selected={activeColour === 'green'}
                onClick={() => handleColourChange('green')}
                className="h-9 px-3 text-[11px]"
              />
            </div>

            {/* Right: Search Input & Sort Selector */}
            <div className="flex items-center gap-3">
              {/* Search with micro clear button */}
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search pieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-8 text-xs bg-transparent border border-[var(--hairline)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--acc-on-bone)] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] p-0.5 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center border border-[var(--hairline)] h-9 px-2 bg-transparent text-xs hover:border-[var(--ink)] transition-colors">
                <ArrowUpDown className="h-3 w-3 mr-1 text-[var(--muted)]" />
                <select
                  value={activeSort}
                  onChange={(e) => handleSortChange(e.target.value as any)}
                  className="bg-transparent text-[var(--ink)] text-xs font-sans focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* View Mode Toggle: Accordion vs Grid */}
              <div className="flex items-center border border-[var(--hairline)] p-0.5 rounded-xs bg-[var(--bone)]">
                <button
                  type="button"
                  onClick={() => setViewMode('accordion')}
                  title="Swipeable Accordion Lookbook"
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer',
                    viewMode === 'accordion'
                      ? 'bg-[var(--ink)] text-[var(--bone)] font-bold shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  )}
                >
                  <Columns3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Accordion</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Catalogue Grid"
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer',
                    viewMode === 'grid'
                      ? 'bg-[var(--ink)] text-[var(--bone)] font-bold shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count & Layout Feedback */}
          <div className="mt-6 mb-4 text-xs font-sans text-[var(--muted)] uppercase tracking-wider flex justify-between items-center">
            <span>
              Showing {filteredProducts.length} of {initialProducts.length} pieces •{' '}
              <span className="text-[var(--acc-on-bone)] font-semibold">
                {viewMode === 'accordion' ? 'Swipeable Accordion Lookbook' : 'Catalogue Grid'}
              </span>
            </span>
            {activeColour && (
              <button
                onClick={() => handleColourChange(undefined)}
                className="text-[var(--acc-on-bone)] hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Main Showcase: Swipe Accordion or Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="font-serif text-3xl text-[var(--ink)]">No pieces matched your search.</p>
              <p className="text-xs text-[var(--muted)] font-sans">
                Try selecting a different colour or clearing the search query.
              </p>
              <Button variant="secondary" onClick={() => { setSearchQuery(''); handleColourChange(undefined) }}>
                Reset all filters
              </Button>
            </div>
          ) : viewMode === 'accordion' ? (
            <ShopAccordion products={filteredProducts} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => {
                  const meta = getTeeMeta(product)
                  const tileTone: 'ink' | 'bone' = product.ground

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Link
                        to="/product/$id"
                        params={{ id: product.slug }}
                        className="group flex flex-col border border-[var(--hairline)] bg-[var(--bone)] overflow-hidden transition-all duration-200 hover:border-[var(--ink)] hover:shadow-md cursor-pointer block h-full"
                      >
                        {/* Image Tile Pane */}
                        <div
                          data-tone={tileTone}
                          className={`relative aspect-square w-full flex items-center justify-center p-6 sm:p-8 overflow-hidden transition-colors ${
                            tileTone === 'ink' ? 'bg-[var(--ink)]' : 'bg-[#e2dbcc]'
                          }`}
                        >
                          {/* Red index number top-left */}
                          <div className="absolute top-3 left-3 z-10 transition-transform duration-200 group-hover:scale-110">
                            <Numeral value={product.position} size="sm" />
                          </div>

                          {/* Cut-out tee image with gentle hover lift */}
                          <div className="w-full h-full flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1">
                            <TeeCutout
                              design={meta.design}
                              colour={meta.colour}
                              withDiamondAccent={false}
                              className="w-full h-full"
                            />
                          </div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="p-4 flex flex-col flex-1 justify-between border-t border-[var(--hairline)]">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-sans uppercase tracking-wider">
                              <span>{product.colour}</span>
                              <span className="font-semibold text-[var(--ink)]">Heavyweight</span>
                            </div>
                            <h3 className="font-serif text-lg sm:text-xl text-[var(--ink)] mt-1 group-hover:text-[var(--acc-on-bone)] transition-colors leading-snug">
                              {product.name}
                            </h3>
                          </div>

                          <div className="mt-3 pt-3 border-t border-[var(--hairline)]/60 flex items-center justify-between font-sans">
                            <span className="text-base font-semibold text-[var(--ink)]">
                              {formatNaira(product.price)}
                            </span>
                            <span className="text-xs text-[var(--acc-on-bone)] uppercase font-medium tracking-wider group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-1">
                              View →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Pane>
    </div>
  )
}
