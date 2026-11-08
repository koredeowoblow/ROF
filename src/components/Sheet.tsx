import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { springs } from '@/motion/tokens'
import { cn } from '@/lib/utils'

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: string
  children: React.ReactNode
  side?: 'right' | 'bottom'
}

/**
 * Mobile-first Sheet / Drawer primitive
 * Bottom sheet on mobile (<768px), right slide-over on desktop (>=768px).
 * Built with Radix dialog accessibility + spring motion.
 */
export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Backdrop overlay */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px]"
              />
            </DialogPrimitive.Overlay>

            {/* Sheet Content */}
            <DialogPrimitive.Content asChild>
              <motion.div
                data-tone="ink"
                initial={
                  side === 'bottom'
                    ? { y: '100%' }
                    : { x: '100%', y: 0 }
                }
                animate={{ x: 0, y: 0 }}
                exit={
                  side === 'bottom'
                    ? { y: '100%' }
                    : { x: '100%' }
                }
                transition={springs.sheet}
                drag={side === 'bottom' ? 'y' : false}
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 140 || info.velocity.y > 500) {
                    onOpenChange(false)
                  }
                }}
                className={cn(
                  'fixed z-50 flex flex-col bg-[var(--ink)] text-[var(--bone)] border-[var(--hairline)] shadow-2xl focus:outline-none',
                  // Mobile bottom sheet / Desktop drawer
                  side === 'right'
                    ? 'inset-y-0 right-0 w-full max-w-md border-l'
                    : 'inset-x-0 bottom-0 max-h-[88svh] rounded-t-2xl border-t',
                  // When side is adaptive: bottom on mobile, right on desktop
                  'md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-md md:rounded-none md:border-l md:border-t-0'
                )}
              >
                {/* Drag handle for mobile */}
                <div className="md:hidden flex justify-center pt-3 pb-1">
                  <div className="h-1.5 w-12 rounded-full bg-[var(--muted)]/40" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--hairline)] px-6 py-4">
                  <div>
                    {title && (
                      <DialogPrimitive.Title className="text-lg font-serif tracking-tight text-[var(--bone)]">
                        {title}
                      </DialogPrimitive.Title>
                    )}
                    {description && (
                      <DialogPrimitive.Description className="text-xs text-[var(--muted)] font-sans">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                  <DialogPrimitive.Close asChild>
                    <button
                      type="button"
                      aria-label="Close dialog"
                      className="touch-target-48 -mr-2 flex h-10 w-10 items-center justify-center text-[var(--muted)] hover:text-[var(--bone)] transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </DialogPrimitive.Close>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

