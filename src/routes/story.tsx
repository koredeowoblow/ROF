import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pane } from '@/components/Pane'
import { Mast } from '@/components/Mast'
import { Button } from '@/components/Button'
import { DiamondMark, Logo } from '@/components/Logo'
import { formatAccentText } from '@/components/Mast'

export const Route = createFileRoute('/story')({
  component: StoryPage,
})

function StoryPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Two-line Masthead */}
      <Mast
        badge="Origin & Purpose"
        title="Ambition, greatness and *legacy.*"
        lead="The story of Roof of Fame. A brand built for the journey to becoming somebody."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Story' },
        ]}
      />

      {/* 2. Bone and Ink Split: The Brand Story in the Owner's Words */}
      <section className="w-full border-b border-[var(--hairline)] grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Ink Pane (3fr / 7 cols) */}
        <Pane tone="ink" withGrain className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DiamondMark size={8} accent filled />
              <span className="label-caps text-[var(--acc)]">Roof of Fame</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-[var(--bone)] leading-[1.08] max-w-xl">
              {formatAccentText('The journey to becoming *somebody.*')}
            </h2>
            <div className="mt-8 space-y-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed font-sans max-w-xl">
              <p>
                ROF means Roof of Fame. It was created with a clear point of view: ambition is not something you hide, and greatness is not accidental.
              </p>
              <p>
                It is for people on the climb. People who put in the quiet hours, who take pride in their craft, and who intend to build their own legacy on their own terms.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--hairline)] flex items-center justify-between">
            <span className="label-caps text-[var(--acc)]">Destined for riches</span>
            <div className="opacity-20">
              <Logo size="sm" ghost />
            </div>
          </div>
        </Pane>

        {/* Bone Pane (2fr / 5 cols) */}
        <Pane tone="bone" className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          <div className="space-y-6">
            <span className="label-caps text-[var(--acc-on-bone)]">Mindset & Lifestyle</span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[var(--ink)] leading-snug">
              Wear it with pride because it represents something bigger than yourself.
            </h3>
            <p className="text-sm sm:text-base text-[var(--ink)] leading-relaxed font-sans">
              ROF stands for ambition, confidence and originality. It is made for people who stay focused on their goals, never settle for less, and understand that clothing is an outward statement of inner discipline.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--hairline)]">
            <Link to="/shop">
              <Button variant="primary" withArrow fullWidth>
                Explore Collection 01
              </Button>
            </Link>
          </div>
        </Pane>
      </section>

      {/* 3. Ink Section: Three Designs */}
      <section data-tone="ink" className="w-full bg-[var(--ink)] text-[var(--bone)] py-16 sm:py-24 px-4 md:px-8 border-b border-[var(--hairline)] grain-overlay">
        <div className="mx-auto max-w-[var(--max-content)]">
          <div className="max-w-2xl mb-12">
            <span className="label-caps text-[var(--acc)]">The Trilogy</span>
            <h2 className="text-4xl sm:text-5xl font-display text-[var(--bone)] mt-2">
              {formatAccentText('Three *designs*')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--muted)] font-sans">
              Each piece in Collection 01 explores a different facet of conviction, craft and identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Design 1: Cards */}
            <div className="p-8 border border-[var(--hairline)] bg-[#121110] flex flex-col justify-between min-h-[280px]">
              <div>
                <span className="label-caps text-[var(--acc)]">Design 01</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--bone)] mt-2 mb-3">
                  Destined Cards
                </h3>
                <p className="text-sm text-[var(--muted)] font-sans leading-relaxed">
                  Five cracked playing cards spelling ROF RAGE with high-gloss red dice and the unwavering conviction: destined for riches.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--hairline)]">
                <Link to="/shop" search={{ colour: 'green' }} className="text-xs uppercase tracking-wider text-[var(--bone)] hover:text-[var(--acc)] transition-colors">
                  View Forest Green piece →
                </Link>
              </div>
            </div>

            {/* Design 2: Wave */}
            <div className="p-8 border border-[var(--hairline)] bg-[#121110] flex flex-col justify-between min-h-[280px]">
              <div>
                <span className="label-caps text-[var(--acc)]">Design 02</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--bone)] mt-2 mb-3">
                  Rage Wave
                </h3>
                <p className="text-sm text-[var(--muted)] font-sans leading-relaxed">
                  A warped kinetic ROF RAGE wordmark printed in vibrant rage red and cool mint inks, finished with an authentic lilac brand tag.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--hairline)]">
                <Link to="/shop" search={{ colour: 'white' }} className="text-xs uppercase tracking-wider text-[var(--bone)] hover:text-[var(--acc)] transition-colors">
                  View Wave colourways →
                </Link>
              </div>
            </div>

            {/* Design 3: Scribble */}
            <div className="p-8 border border-[var(--hairline)] bg-[#121110] flex flex-col justify-between min-h-[280px]">
              <div>
                <span className="label-caps text-[var(--acc)]">Design 03</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--bone)] mt-2 mb-3">
                  Rage Scribble
                </h3>
                <p className="text-sm text-[var(--muted)] font-sans leading-relaxed">
                  One continuous line drawing contained within a burnt orange architectural frame, seamlessly weaving ROF Rage into every line.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--hairline)]">
                <Link to="/shop" search={{ colour: 'black' }} className="text-xs uppercase tracking-wider text-[var(--bone)] hover:text-[var(--acc)] transition-colors">
                  View Scribble colourways →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
