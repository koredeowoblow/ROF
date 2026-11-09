import http from 'http'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')
const screensDir = path.join(root, 'audit', 'screens')

if (!fs.existsSync(screensDir)) {
  fs.mkdirSync(screensDir, { recursive: true })
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0]
  if (reqPath === '/') reqPath = '/index.html'

  let filePath = path.join(dist, reqPath)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(dist, 'index.html')
  }

  const ext = path.extname(filePath)
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
})

const PORT = 5991
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-prof-'))

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '1920', width: 1920, height: 950 },
    { name: '390', width: 390, height: 844 },
  ]

  try {
    for (const vp of viewports) {
      for (let look = 0; look < 5; look++) {
        const lookNum = String(look + 1).padStart(2, '0')
        const outFile = path.join(screensDir, `hero-${vp.name}-look${lookNum}.png`)
        console.log(`Capturing ${vp.name}x${vp.height} Look ${lookNum}...`)
        
        execSync(
          `"${chromePath}" --headless=new --no-sandbox --disable-gpu --disable-background-networking --disable-sync --no-first-run --no-default-browser-check --user-data-dir="${tempProfileDir}" --hide-scrollbars --window-size=${vp.width},${vp.height} --virtual-time-budget=1200 --screenshot="${outFile}" "http://127.0.0.1:${PORT}/?card=${look}&dealt=1"`,
          { stdio: 'inherit', timeout: 15000 }
        )
      }
    }

    // Copy primary screenshots (Look 01)
    fs.copyFileSync(path.join(screensDir, 'hero-390-look01.png'), path.join(screensDir, 'hero-390.png'))
    fs.copyFileSync(path.join(screensDir, 'hero-1440-look01.png'), path.join(screensDir, 'hero-1440.png'))
    fs.copyFileSync(path.join(screensDir, 'hero-1920-look01.png'), path.join(screensDir, 'hero-1920.png'))

    // Capture intro sequence frame
    const introFile = path.join(screensDir, 'hero-intro-deck.png')
    console.log('Capturing intro deck spread...')
    execSync(
      `"${chromePath}" --headless=new --no-sandbox --disable-gpu --disable-background-networking --disable-sync --no-first-run --no-default-browser-check --user-data-dir="${tempProfileDir}" --hide-scrollbars --window-size=1440,900 --virtual-time-budget=300 --screenshot="${introFile}" "http://127.0.0.1:${PORT}/?dealt=0"`,
      { stdio: 'pipe', timeout: 15000 }
    )

    console.log('All screenshots captured successfully!')
  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    try {
      fs.rmSync(tempProfileDir, { recursive: true, force: true })
    } catch {}
    server.close(() => {
      console.log('Server closed.')
      process.exit(0)
    })
  }
})


