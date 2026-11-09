import { Product } from './types'

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    slug: 'destined-cards-tee',
    name: 'Destined Cards Tee',
    colour: 'Forest green',
    colourKey: 'green',
    swatch: '#1b382b',
    print: 'Five cracked playing cards spelling ROF RAGE, red dice, Destined for riches print',
    price: 30000,
    blurb:
      'Forest green tee featuring five cracked playing cards spelling ROF RAGE, high-gloss red dice graphic, and Destined for riches print.',
    ground: 'bone', // Green sits on Bone where it reads best
    zoomOrigin: '50% 45%',
    images: ['/images/destined-cards-green.webp', '/images/destined-cards-green.webp'],
    position: 1,
    published: true,
    variants: [
      { size: 'S', stock: 12 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 24 },
      { size: 'XL', stock: 16 },
      { size: 'XXL', stock: 8 },
    ],
  },
  {
    id: 'prod-2',
    slug: 'rage-wave-tee-white',
    name: 'Rage Wave Tee',
    colour: 'White',
    colourKey: 'white',
    swatch: '#f4f3ef',
    print: 'Warped ROF RAGE wordmark in red and mint, lilac tag',
    price: 25000,
    blurb:
      'White tee featuring the warped ROF RAGE wordmark across the chest in red and mint, with a lilac brand tag.',
    ground: 'ink', // White sits on Ink where it reads best
    zoomOrigin: '50% 40%',
    images: ['/images/rage-wave-white.webp', '/images/rage-wave-white.webp'],
    pairId: 'prod-3',
    position: 2,
    published: true,
    variants: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 22 },
      { size: 'L', stock: 30 },
      { size: 'XL', stock: 18 },
      { size: 'XXL', stock: 10 },
    ],
  },
  {
    id: 'prod-3',
    slug: 'rage-wave-tee-black',
    name: 'Rage Wave Tee',
    colour: 'Black',
    colourKey: 'black',
    swatch: '#141312',
    print: 'Warped ROF RAGE wordmark in red and mint, lilac tag',
    price: 25000,
    blurb:
      'Black tee featuring the warped ROF RAGE wave graphic across the chest in red and mint, with a lilac brand tag.',
    ground: 'bone', // Black sits on Bone where it reads best
    zoomOrigin: '50% 40%',
    images: ['/images/rage-wave-black.webp', '/images/rage-wave-black.webp'],
    pairId: 'prod-2',
    position: 3,
    published: true,
    variants: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 28 },
      { size: 'XL', stock: 14 },
      { size: 'XXL', stock: 6 },
    ],
  },
  {
    id: 'prod-4',
    slug: 'rage-scribble-tee-white',
    name: 'Rage Scribble Tee',
    colour: 'White',
    colourKey: 'white',
    swatch: '#f4f3ef',
    print: 'Continuous line drawing in an orange frame, ROF Rage worked into the lines',
    price: 28000,
    blurb:
      'White tee featuring an intricate continuous line drawing contained within a burnt orange architectural frame, with ROF Rage worked into the lines.',
    ground: 'ink', // White sits on Ink
    zoomOrigin: '50% 45%',
    images: ['/images/rage-scribble-white.webp', '/images/rage-scribble-white.webp'],
    pairId: 'prod-5',
    position: 4,
    published: true,
    variants: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 12 },
      { size: 'XXL', stock: 4 },
    ],
  },
  {
    id: 'prod-5',
    slug: 'rage-scribble-tee-black',
    name: 'Rage Scribble Tee',
    colour: 'Black',
    colourKey: 'black',
    swatch: '#141312',
    print: 'Continuous line drawing in an orange frame, ROF Rage worked into the lines',
    price: 28000,
    blurb:
      'Black tee featuring a burnt orange continuous line artwork contained in an architectural frame, with ROF Rage worked into the lines.',
    ground: 'bone', // Black sits on Bone
    zoomOrigin: '50% 45%',
    images: ['/images/rage-scribble-black.webp', '/images/rage-scribble-black.webp'],
    pairId: 'prod-4',
    position: 5,
    published: true,
    variants: [
      { size: 'S', stock: 14 },
      { size: 'M', stock: 19 },
      { size: 'L', stock: 26 },
      { size: 'XL', stock: 15 },
      { size: 'XXL', stock: 7 },
    ],
  },
]

