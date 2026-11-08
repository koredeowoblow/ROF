import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Trash2, Plus, Minus, RotateCcw } from 'lucide-react'
import { Sheet } from '@/components/Sheet'
import { Button } from '@/components/Button'
import { DiamondMark } from '@/components/Logo'
import { useBagStore } from './bagStore'
import { formatNaira } from '@/lib/money'
import { TeeCutout, TeeDesign, TeeColour } from '@/components/TeeCutout'

export const BagDrawer: React.FC = () => {
  const isOpen = useBagStore((s) => s.isOpen)
  const setIsOpen = useBagStore((s) => s.setIsOpen)
  const items = useBagStore((s) => s.items)
  const removeItem = useBagStore((s) => s.removeItem)
  const updateQty = useBagStore((s) => s.updateQty)
  const undoRemove = useBagStore((s) => s.undoRemove)
  const lastRemoved = useBagStore((s) => s.lastRemoved)
  const subtotal = useBagStore((s) => s.subtotal())
  const totalPieces = useBagStore((s) => s.totalPieces())
  const navigate = useNavigate()

  const getTeeMeta = (name: string, colour: string): { design: TeeDesign; colour: TeeColour } => {
    const design: TeeDesign = name.includes('Cards') ? 'cards' : name.includes('Wave') ? 'wave' : 'scribble'
    const col: TeeColour = colour.toLowerCase().includes('green')
      ? 'forest-green'
      : colour.toLowerCase().includes('white')
      ? 'white'
      : 'black'
    return { design, colour: col }
  }

  const handleCheckout = () => {
    setIsOpen(false)
    navigate({ to: '/checkout' })
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title={
        <span className="flex items-center gap-2">
          <span>Your Bag</span>
          <span className="text-xs text-[var(--muted)] font-sans">
            ({totalPieces} {totalPieces === 1 ? 'piece' : 'pieces'})
          </span>
        </span>
      }
      description="Heavyweight streetwear items ready for checkout"
    >
      <div className="flex flex-col h-full justify-between">
        {/* Undo notification bar */}
        <AnimatePresence>
          {lastRemoved && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mb-4 flex items-center justify-between bg-[var(--bone)] text-[var(--ink)] p-2.5 text-xs font-sans overflow-hidden"
            >
              <span>Removed {lastRemoved.item.name}</span>
              <button
                type="button"
                onClick={undoRemove}
                className="flex items-center gap-1 font-semibold text-[var(--acc-on-bone)] hover:underline cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Undo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <DiamondMark size={16} accent filled className="opacity-40" />
            <p className="font-serif text-2xl text-[var(--bone)]">Your bag is empty.</p>
            <p className="text-xs text-[var(--muted)] font-sans max-w-xs mx-auto">
              Ambition waits for no one. Explore Collection 01 and claim your pieces.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false)
                navigate({ to: '/shop' })
              }}
            >
              Explore Collection
            </Button>
          </div>
        ) : (
          /* Item List with smooth removal exit micro-interactions */
          <div className="space-y-4 divide-y divide-[var(--hairline)]">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const meta = getTeeMeta(item.name, item.colour)

                return (
                  <motion.div
                    key={`${item.productId}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                    className="pt-4 first:pt-0 flex gap-4 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 bg-[#161514] border border-[var(--hairline)] flex items-center justify-center p-1 overflow-hidden group">
                      <TeeCutout
                        design={meta.design}
                        colour={meta.colour}
                        withDiamondAccent={false}
                        className="w-full h-full scale-125 transition-transform duration-300 group-hover:scale-135"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-base text-[var(--bone)] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[var(--muted)] font-sans">
                        {item.colour} • Size {item.size}
                      </p>
                      <p className="text-sm font-sans font-medium text-[var(--bone)] mt-1">
                        {formatNaira(item.unitPrice)}
                      </p>
                    </div>

                    {/* Stepper & Remove with tactile micro-interactions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center border border-[var(--hairline)] bg-transparent">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.88 }}
                          transition={{ duration: 0.1 }}
                          aria-label="Decrease quantity"
                          onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                          className="touch-target-48 h-8 w-8 flex items-center justify-center text-[var(--bone)] hover:bg-[var(--surface-tint)] cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </motion.button>

                        <div className="w-7 text-center overflow-hidden">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={item.qty}
                              initial={{ y: -8, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 8, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="block text-xs font-sans font-medium"
                            >
                              {item.qty}
                            </motion.span>
                          </AnimatePresence>
                        </div>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.88 }}
                          transition={{ duration: 0.1 }}
                          aria-label="Increase quantity"
                          onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                          className="touch-target-48 h-8 w-8 flex items-center justify-center text-[var(--bone)] hover:bg-[var(--surface-tint)] cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </motion.button>
                      </div>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.12 }}
                        aria-label="Remove item"
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-[var(--muted)] hover:text-[var(--acc)] transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="mt-8 border-t border-[var(--hairline)] pt-5 space-y-4">
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="text-[var(--bone)] font-medium">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Delivery</span>
                <span>Calculated at checkout (Lagos ₦2,500 / Interstate ₦4,500)</span>
              </div>
            </div>

            <div className="border-t border-[var(--hairline)] pt-3 flex justify-between items-baseline font-sans">
              <span className="text-sm uppercase tracking-wider font-semibold">Total</span>
              <span className="text-xl font-serif text-[var(--bone)] font-medium">
                {formatNaira(subtotal)}
              </span>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              withArrow
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </Sheet>
  )
}
