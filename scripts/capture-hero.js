import http from 'http'
import fs from 'fs'
import path from 'path'
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

const PORT = 5193
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  const out1440 = path.join(screensDir, 'hero-1440.png')
  const out390 = path.join(screensDir, 'hero-390.png')

  try {
    console.log('Capturing desktop 1440x900...')
    execSync(
      `"${chromePath}" --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=4800 --screenshot="${out1440}" "http://127.0.0.1:${PORT}/"`,
      { stdio: 'inherit' }
    )
    console.log(`Saved: ${out1440}`)

    console.log('Capturing mobile 390x844...')
    execSync(
      `"${chromePath}" --headless=new --hide-scrollbars --window-size=390,844 --virtual-time-budget=3600 --screenshot="${out390}" "http://127.0.0.1:${PORT}/"`,
      { stdio: 'inherit' }
    )
    console.log(`Saved: ${out390}`)
  } catch (err) {
    console.error('Error capturing screenshot:', err)
  } finally {
    server.close(() => {
      console.log('Server closed.')
      process.exit(0)
    })
  }
})

