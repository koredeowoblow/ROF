import React from 'react'
import { Pane } from './Pane'
import { Tape, type BreadcrumbItem } from './Tape'
import { DiamondMark } from './Logo'
import { cn } from '@/lib/utils'

interface MastProps {
  title: string
  lead?: string
  breadcrumbs?: BreadcrumbItem[]
  rightContent?: React.ReactNode
  badge?: string
  className?: string
}

/**
 * Utility to parse markdown-like *word* into red italic serif accent word
 */
export function formatAccentText(text: string): React.ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const clean = part.slice(1, -1)
      return (
        <span key={index} className="acc-word">
          {clean}
        </span>
      )
    }
    return part
  })
}

/**
 * Inner page masthead
 * Architectural Ink block + big serif headline + one red italic word + lead + Bone breadcrumb tape
 */
export const Mast: React.FC<MastProps> = ({
  title,
  lead,
  breadcrumbs,
  rightContent,
  badge,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <Pane tone="ink" withGrain className="pt-24 pb-14 px-4 md:px-8 border-b border-[var(--hairline)]">
        <div className="mx-auto max-w-[var(--max-content)]">
          {badge && (
            <div className="mb-4 flex items-center gap-2">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--acc)]">{badge}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display tracking-tight text-[var(--bone)] max-w-4xl leading-[1.08]">
            {formatAccentText(title)}
          </h1>

          {lead && (
            <p className="mt-4 text-base md:text-lg text-[var(--muted)] max-w-2xl font-sans font-normal leading-relaxed">
              {lead}
            </p>
          )}
        </div>
      </Pane>

      {breadcrumbs && (
        <Tape breadcrumbs={breadcrumbs} rightContent={rightContent} />
      )}
    </div>
  )
}

