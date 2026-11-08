import fs from 'fs'
import path from 'path'

const OUT_DIR = path.resolve(process.cwd(), 'public/images')
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

const fabricDefs = {
  'forest-green': { base: '#1b382b', shadow: '#11251c', rib: '#152c21', highlight: '#264e3c' },
  white: { base: '#f4f3ef', shadow: '#dfded8', rib: '#e7e5dc', highlight: '#ffffff' },
  black: { base: '#161514', shadow: '#0a0909', rib: '#100f0e', highlight: '#2a2826' },
}

function generateSvg(design, colour, isDetail = false) {
  const f = fabricDefs[colour]
  const viewBox = isDetail ? '100 150 220 220' : '0 0 420 480'

  let graphic = ''
  if (design === 'cards') {
    graphic = `
      <g transform="translate(130, 185) scale(0.92)">
        <rect x="-80" y="-30" width="300" height="200" fill="black" opacity="0.15" rx="10" />
        <g transform="translate(0, 15) rotate(-12 18 28)"><rect width="36" height="56" rx="3" fill="#f6f2e9" stroke="#2b2824" stroke-width="1.5"/><text x="18" y="34" text-anchor="middle" font-family="'Instrument Serif', serif" font-size="22" font-weight="bold" fill="#c1211a">R</text></g>
        <g transform="translate(32, 5) rotate(-6 18 28)"><rect width="36" height="56" rx="3" fill="#f6f2e9" stroke="#2b2824" stroke-width="1.5"/><text x="18" y="34" text-anchor="middle" font-family="'Instrument Serif', serif" font-size="22" font-weight="bold" fill="#141312">O</text></g>
        <g transform="translate(64, 0) rotate(0 18 28)"><rect width="36" height="56" rx="3" fill="#f6f2e9" stroke="#2b2824" stroke-width="1.5"/><text x="18" y="34" text-anchor="middle" font-family="'Instrument Serif', serif" font-size="22" font-weight="bold" fill="#c1211a">F</text></g>
        <g transform="translate(96, 5) rotate(6 18 28)"><rect width="36" height="56" rx="3" fill="#f6f2e9" stroke="#2b2824" stroke-width="1.5"/><text x="18" y="34" text-anchor="middle" font-family="'Instrument Serif', serif" font-size="22" font-weight="bold" fill="#141312">R</text></g>
        <g transform="translate(128, 15) rotate(12 18 28)"><rect width="36" height="56" rx="3" fill="#f6f2e9" stroke="#2b2824" stroke-width="1.5"/><text x="18" y="34" text-anchor="middle" font-family="'Instrument Serif', serif" font-size="22" font-weight="bold" fill="#c1211a">G</text></g>
        <g transform="translate(20, 84)"><rect width="22" height="22" rx="4" fill="#c1211a" stroke="#8a140f" stroke-width="1"/><circle cx="6" cy="6" r="2" fill="#fff6ec"/><circle cx="16" cy="6" r="2" fill="#fff6ec"/><circle cx="11" cy="11" r="2" fill="#fff6ec"/><circle cx="6" cy="16" r="2" fill="#fff6ec"/><circle cx="16" cy="16" r="2" fill="#fff6ec"/></g>
        <text x="72" y="126" text-anchor="middle" font-family="'Inter Tight', sans-serif" font-size="9" letter-spacing="0.28em" font-weight="600" fill="#e6dfce">DESTINED FOR RICHES</text>
      </g>
    `
  } else if (design === 'wave') {
    graphic = `
      <g transform="translate(130, 200) scale(0.95)">
        <rect x="135" y="-30" width="16" height="26" rx="2" fill="#d3c0eb" stroke="#9e85be" stroke-width="1" />
        <path d="M 5,20 Q 40,-15 80,18 T 160,15" fill="none" stroke="#e5372d" stroke-width="18" stroke-linecap="round" />
        <path d="M 5,42 Q 40,7 80,40 T 160,37" fill="none" stroke="#7de3c8" stroke-width="12" stroke-linecap="round" opacity="0.9" />
        <text x="80" y="26" text-anchor="middle" font-family="'Instrument Serif', serif" font-style="italic" font-size="34" font-weight="bold" fill="#fff6ec">ROF RAGE</text>
      </g>
    `
  } else {
    graphic = `
      <g transform="translate(135, 195) scale(0.94)">
        <rect x="0" y="0" width="155" height="150" fill="none" stroke="#e86127" stroke-width="2.5" />
        <path d="M 20,110 C 25,60 50,45 75,55 C 95,65 110,40 120,60 C 130,80 135,115 110,120 C 85,125 55,90 40,95 C 25,100 20,110 20,110 Z" fill="none" stroke="${colour === 'white' ? '#1a1816' : '#ece4d4'}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
        <text x="78" y="118" text-anchor="middle" font-family="'Instrument Serif', serif" font-size="24" font-style="italic" fill="${colour === 'white' ? '#c1211a' : '#e5372d'}">ROF Rage</text>
      </g>
    `
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="800" height="900" fill="none">
    <ellipse cx="210" cy="465" rx="155" ry="14" fill="rgba(0,0,0,0.38)"/>
    <path d="M 160,45 C 180,48 240,48 260,45 L 330,68 L 410,140 L 362,192 L 326,170 L 322,442 C 322,446 318,448 314,448 L 106,448 C 102,448 98,446 98,442 L 94,170 L 58,192 L 10,140 L 90,68 Z" fill="${f.base}" stroke="${f.shadow}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M 160,45 C 185,38 235,38 260,45 C 240,65 180,65 160,45 Z" fill="${f.rib}"/>
    <path d="M 160,45 C 180,72 240,72 260,45 C 248,82 172,82 160,45 Z" fill="${f.highlight}" stroke="${f.shadow}" stroke-width="1.2"/>
    ${graphic}
  </svg>`
}

const pieces = [
  { name: 'destined-cards-green', design: 'cards', colour: 'forest-green' },
  { name: 'rage-wave-white', design: 'wave', colour: 'white' },
  { name: 'rage-wave-black', design: 'wave', colour: 'black' },
  { name: 'rage-scribble-white', design: 'scribble', colour: 'white' },
  { name: 'rage-scribble-black', design: 'scribble', colour: 'black' },
]

pieces.forEach((p) => {
  const fullSvg = generateSvg(p.design, p.colour, false)
  const detailSvg = generateSvg(p.design, p.colour, true)

  fs.writeFileSync(path.join(OUT_DIR, `${p.name}.svg`), fullSvg)
  fs.writeFileSync(path.join(OUT_DIR, `${p.name}-detail.svg`), detailSvg)
  // Also write .webp-named SVG files so any request to .webp is satisfied cleanly
  fs.writeFileSync(path.join(OUT_DIR, `${p.name}.webp`), fullSvg)
  fs.writeFileSync(path.join(OUT_DIR, `${p.name}-detail.webp`), detailSvg)
})

console.log('Generated cutout vector assets in public/images/')
