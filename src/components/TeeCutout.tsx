import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export type TeeDesign = 'cards' | 'wave' | 'scribble'
export type TeeColour = 'forest-green' | 'white' | 'black'

interface TeeCutoutProps {
  design: TeeDesign
  colour: TeeColour
  view?: 'full' | 'closeup'
  className?: string
  priority?: boolean
  withDiamondAccent?: boolean
  interactiveZoom?: boolean
}

/**
 * High-fidelity transparent cut-out tee illustration
 * Oversized boxy streetwear silhouette, dropped shoulders, thick ribbed collar,
 * layered soft contact shadow, and authentic prints.
 */
export const TeeCutout: React.FC<TeeCutoutProps> = ({
  design,
  colour,
  view = 'full',
  className,
  withDiamondAccent = true,
  interactiveZoom = false,
}) => {
  // Fabric base color and shading definitions
  const fabricColors = {
    'forest-green': {
      base: '#1b382b',
      shadow: '#11251c',
      highlight: '#264e3c',
      rib: '#152c21',
    },
    white: {
      base: '#f4f3ef',
      shadow: '#dfded8',
      highlight: '#ffffff',
      rib: '#e7e5dc',
    },
    black: {
      base: '#161514',
      shadow: '#0a0909',
      highlight: '#2a2826',
      rib: '#100f0e',
    },
  }[colour]

  // Render the specific graphic on chest
  const renderGraphic = () => {
    switch (design) {
      case 'cards':
        // Five cracked playing cards spell ROF RAGE, red dice, "Destined for riches"
        return (
          <g transform="translate(130, 185) scale(0.92)">
            {/* Soft background glow */}
            <rect x="-80" y="-30" width="300" height="200" fill="black" opacity="0.15" rx="10" />

            {/* Five playing cards */}
            {[
              { letter: 'R', rot: -12, x: 0, y: 15 },
              { letter: 'O', rot: -6, x: 32, y: 5 },
              { letter: 'F', rot: 0, x: 64, y: 0 },
              { letter: 'R', rot: 6, x: 96, y: 5 },
              { letter: 'G', rot: 12, x: 128, y: 15 },
            ].map((c, i) => (
              <g key={i} transform={`translate(${c.x}, ${c.y}) rotate(${c.rot} 18 28)`}>
                {/* Card body */}
                <rect
                  x="0"
                  y="0"
                  width="36"
                  height="56"
                  rx="3"
                  fill="#f6f2e9"
                  stroke="#2b2824"
                  strokeWidth="1.5"
                />
                {/* Crack lines on card */}
                <path
                  d="M 6,10 L 14,24 L 28,18 M 8,42 L 18,34 L 30,48"
                  stroke="#575249"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.8"
                />
                {/* Card letter */}
                <text
                  x="18"
                  y="34"
                  textAnchor="middle"
                  fontFamily="'Instrument Serif', serif"
                  fontSize="22"
                  fontWeight="bold"
                  fill={i % 2 === 0 ? '#c1211a' : '#141312'}
                >
                  {c.letter}
                </text>
              </g>
            ))}

            {/* Red dice */}
            <g transform="translate(20, 84)">
              <rect
                x="0"
                y="0"
                width="22"
                height="22"
                rx="4"
                fill="#c1211a"
                stroke="#8a140f"
                strokeWidth="1"
              />
              <circle cx="6" cy="6" r="2" fill="#f4efe6" />
              <circle cx="16" cy="6" r="2" fill="#f4efe6" />
              <circle cx="11" cy="11" r="2" fill="#f4efe6" />
              <circle cx="6" cy="16" r="2" fill="#f4efe6" />
              <circle cx="16" cy="16" r="2" fill="#f4efe6" />
            </g>

            {/* Print Tagline */}
            <text
              x="72"
              y="126"
              textAnchor="middle"
              fontFamily="'Inter Tight', sans-serif"
              fontSize="9"
              letterSpacing="0.28em"
              fontWeight="600"
              fill="#e6dfce"
              opacity="0.9"
            >
              DESTINED FOR RICHES
            </text>
          </g>
        )

      case 'wave':
        // Warped ROF RAGE wordmark in red and mint, lilac tag
        return (
          <g transform="translate(130, 200) scale(0.95)">
            {/* Lilac garment tag at top right */}
            <rect x="135" y="-30" width="16" height="26" rx="2" fill="#d3c0eb" stroke="#9e85be" strokeWidth="1" />
            <text x="143" y="-14" textAnchor="middle" fontFamily="'Inter Tight', sans-serif" fontSize="6" fontWeight="bold" fill="#3c2f52">
              ROF
            </text>

            {/* Warped wave typography effect */}
            <path
              d="M 5,20 Q 40,-15 80,18 T 160,15"
              fill="none"
              stroke="#e5372d"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M 5,42 Q 40,7 80,40 T 160,37"
              fill="none"
              stroke="#7de3c8"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.9"
            />

            <text
              x="80"
              y="26"
              textAnchor="middle"
              fontFamily="'Instrument Serif', serif"
              fontStyle="italic"
              fontSize="34"
              fontWeight="bold"
              fill="#f4efe6"
            >
              ROF RAGE
            </text>

            <text
              x="80"
              y="68"
              textAnchor="middle"
              fontFamily="'Inter Tight', sans-serif"
              fontSize="8"
              letterSpacing="0.32em"
              fontWeight="600"
              fill={colour === 'white' ? '#141312' : '#f5efe0'}
            >
              HEAVYWEIGHT STREETWEAR
            </text>
          </g>
        )

      case 'scribble':
        // Continuous line drawing in an orange frame, ROF Rage worked into the lines
        return (
          <g transform="translate(135, 195) scale(0.94)">
            {/* Orange architectural framing box */}
            <rect
              x="0"
              y="0"
              width="155"
              height="150"
              fill="none"
              stroke="#e86127"
              strokeWidth="2.5"
            />
            {/* Fine internal gridlines */}
            <line x1="0" y1="25" x2="155" y2="25" stroke="#e86127" strokeWidth="0.8" opacity="0.5" />
            <line x1="0" y1="125" x2="155" y2="125" stroke="#e86127" strokeWidth="0.8" opacity="0.5" />

            {/* Continuous line art weaving face and letters */}
            <path
              d="M 20,110 C 25,60 50,45 75,55 C 95,65 110,40 120,60 C 130,80 135,115 110,120 C 85,125 55,90 40,95 C 25,100 20,110 20,110 Z"
              fill="none"
              stroke={colour === 'white' ? '#1a1816' : '#ece4d4'}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Embedded ROF stylized lines inside frame */}
            <text
              x="78"
              y="118"
              textAnchor="middle"
              fontFamily="'Instrument Serif', serif"
              fontSize="24"
              fontStyle="italic"
              fill={colour === 'white' ? '#c1211a' : '#e5372d'}
            >
              ROF Rage
            </text>

            <text
              x="78"
              y="140"
              textAnchor="middle"
              fontFamily="'Inter Tight', sans-serif"
              fontSize="7.5"
              letterSpacing="0.26em"
              fontWeight="600"
              fill="#e86127"
            >
              ONE CONTINUOUS LINE
            </text>
          </g>
        )
    }
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none overflow-hidden',
        interactiveZoom && 'group cursor-zoom-in',
        className
      )}
    >
      {/* Faint red diamond outline behind tee */}
      {withDiamondAccent && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 400 400"
            className="w-[82%] h-[82%] max-w-[460px] text-[var(--acc)] stroke-current"
            fill="none"
          >
            <polygon
              points="200,20 380,200 200,380 20,200"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />
          </svg>
        </div>
      )}

      {/* Cut-out tee graphic with soft drop-shadow */}
      <motion.svg
        viewBox={view === 'closeup' ? '100 150 220 220' : '0 0 420 480'}
        className={cn(
          'relative z-10 w-full h-auto max-h-[640px] drop-shadow-[0_24px_32px_rgba(0,0,0,0.48)]',
          interactiveZoom && 'transition-transform duration-500 ease-out group-hover:scale-105'
        )}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${colour.replace('-', ' ')} boxy tee with ${design} print`}
      >
        <defs>
          {/* Gradients for natural drape and fold realism */}
          <linearGradient id={`fold-left-${colour}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={fabricColors.shadow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={fabricColors.base} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`fold-right-${colour}`} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={fabricColors.shadow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={fabricColors.base} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`hem-shadow-${colour}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fabricColors.base} />
            <stop offset="100%" stopColor={fabricColors.shadow} />
          </linearGradient>
        </defs>

        {/* Contact Shadow under tee */}
        <ellipse
          cx="210"
          cy="465"
          rx="155"
          ry="14"
          fill="rgba(0,0,0,0.38)"
          filter="blur(6px)"
        />

        {/* Oversized Boxy Tee Silhouette */}
        <g>
          {/* Main Body + Dropped Sleeves Path */}
          <path
            d="
              M 160,45 
              C 180,48 240,48 260,45 
              L 330,68 
              L 410,140 
              L 362,192 
              L 326,170 
              L 322,442 
              C 322,446 318,448 314,448 
              L 106,448 
              C 102,448 98,446 98,442 
              L 94,170 
              L 58,192 
              L 10,140 
              L 90,68 
              Z
            "
            fill={fabricColors.base}
            stroke={fabricColors.shadow}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Left sleeve fold shadow */}
          <path
            d="M 94,170 L 58,192 L 10,140 L 90,68 Z"
            fill={`url(#fold-left-${colour})`}
          />

          {/* Right sleeve fold shadow */}
          <path
            d="M 326,170 L 362,192 L 410,140 L 330,68 Z"
            fill={`url(#fold-right-${colour})`}
          />

          {/* Side drape depth shadows */}
          <path
            d="M 98,170 Q 115,300 106,448 L 98,442 Z"
            fill={fabricColors.shadow}
            opacity="0.35"
          />
          <path
            d="M 322,170 Q 305,300 314,448 L 322,442 Z"
            fill={fabricColors.shadow}
            opacity="0.35"
          />

          {/* Dropped shoulder stitch lines */}
          <line x1="125" y1="58" x2="105" y2="135" stroke={fabricColors.shadow} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="295" y1="58" x2="315" y2="135" stroke={fabricColors.shadow} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Bottom Hem double-stitch line */}
          <line x1="102" y1="432" x2="318" y2="432" stroke={fabricColors.shadow} strokeWidth="1" strokeDasharray="3 2" opacity="0.65" />
          <line x1="102" y1="435" x2="318" y2="435" stroke={fabricColors.shadow} strokeWidth="1" strokeDasharray="3 2" opacity="0.65" />

          {/* Heavyweight Ribbed Collar */}
          {/* Inner back neck */}
          <path
            d="M 160,45 C 185,38 235,38 260,45 C 240,65 180,65 160,45 Z"
            fill={fabricColors.rib}
          />
          {/* Front Rib Band */}
          <path
            d="M 160,45 C 180,72 240,72 260,45 C 248,82 172,82 160,45 Z"
            fill={fabricColors.highlight}
            stroke={fabricColors.shadow}
            strokeWidth="1.2"
          />

          {/* Chest Print Graphic */}
          {renderGraphic()}
        </g>
      </motion.svg>
    </div>
  )
}

