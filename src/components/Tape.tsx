import React from 'react'
import { Link } from '@tanstack/react-router'
import { DiamondMark } from './Logo'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface TapeProps {
  breadcrumbs: BreadcrumbItem[]
  className?: string
  rightContent?: React.ReactNode
}

/**
 * Bone breadcrumb tape
 * Runs immediately beneath inner page mastheads.
 * Architectural strip with small caps and diamond separators.
 */
export const Tape: React.FC<TapeProps> = ({
  breadcrumbs,
  className,
  rightContent,
}) => {
  return (
    <div
      data-tone="bone"
      className={cn(
        'w-full border-y border-[var(--hairline)] bg-[var(--bone)] py-2.5 px-4 md:px-8',
        className
      )}
    >
      <div className="mx-auto flex max-w-[var(--max-content)] items-center justify-between text-xs font-medium uppercase tracking-[0.18em]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <React.Fragment key={index}>
                {index > 0 && <DiamondMark size={6} accent className="opacity-60" />}
                {isLast || !item.href ? (
                  <span className="text-[var(--ink)] font-semibold" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="text-[var(--ink)] opacity-70 hover:opacity-100 hover:text-[var(--acc-on-bone)] transition-opacity"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </nav>

        {rightContent && (
          <div className="hidden sm:flex items-center gap-3 text-[var(--muted)] text-[11px]">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  )
}

