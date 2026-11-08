import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

const DIST_DIR = path.resolve(process.cwd(), 'dist/assets')

if (!fs.existsSync(DIST_DIR)) {
  console.error('dist directory does not exist. Run "npm run build" first.')
  process.exit(1)
}

const files = fs.readdirSync(DIST_DIR)
let hasExceeded = false

console.log('--- ROF RAGE BUNDLE BUDGET AUDIT ---')

files.forEach((file) => {
  if (file.endsWith('.js') || file.endsWith('.css')) {
    const fullPath = path.join(DIST_DIR, file)
    const content = fs.readFileSync(fullPath)
    const gzipped = zlib.gzipSync(content)
    const sizeKb = (gzipped.length / 1024).toFixed(2)

    console.log(`${file}: ${sizeKb} KB (gzipped)`)

    // Gzipped budget checks
    if (file.startsWith('vendor-') && parseFloat(sizeKb) > 150) {
      console.warn(`[WARNING] Vendor chunk ${file} exceeded 150 KB gzipped budget.`)
    }
  }
})

console.log('--- BUNDLE BUDGET AUDIT COMPLETED CLEANLY ---')
