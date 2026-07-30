#!/usr/bin/env node
//
// Screenshots one route of the example app's web build, in one appearance.
//
// Chrome is driven over the DevTools protocol rather than through Playwright:
// the repo carries no browser dependency, and the protocol needs nothing but
// `fetch` and the WebSocket that Node ships as a global. The browser binary is
// whichever of the usual installs is present — a plain Chrome answers as well
// as a Chrome for Testing left behind by some other tool's cache.
//
// Usage: capture-web-screen.mjs --url <url> --out <file.png> [options]
//
//   --scheme light|dark   what to report for prefers-color-scheme (light)
//   --width, --height     viewport in CSS pixels (860x1040)
//   --dpr                 device pixel ratio, so the PNG is oversampled (2)
//   --settle              ms to wait after the plot appears, for its reveal
//                         animation to finish (4500)
//   --ready               selector to wait for before settling (canvas)

import {spawn} from 'node:child_process'
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {homedir, tmpdir} from 'node:os'
import {dirname, join} from 'node:path'

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  join(
    homedir(),
    'Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64',
    'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
  ),
].filter(Boolean)

const options = {
  dpr: 2,
  height: 1040,
  out: '',
  ready: 'canvas',
  scheme: 'light',
  settle: 4500,
  url: '',
  width: 860,
}

for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index].replace(/^--/, '')
  const value = process.argv[index + 1]
  if (!(key in options)) {
    console.error(`unknown option: ${process.argv[index]}`)
    process.exit(2)
  }
  options[key] = typeof options[key] === 'number' ? Number(value) : value
}
if (!options.url || !options.out) {
  console.error('usage: capture-web-screen.mjs --url <url> --out <file.png>')
  process.exit(2)
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const findChrome = async () => {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await readFile(candidate)
      return candidate
    } catch (error) {
      // A directory read fails with EISDIR, which still means it is there.
      if (error.code === 'EISDIR') return candidate
    }
  }
  throw new Error(
    `no Chrome found. Install Google Chrome, or point CHROME at a binary:\n  ${CHROME_CANDIDATES.join('\n  ')}`
  )
}

/** The port Chrome picked, which it writes into its profile once it is up. */
const readDebuggerPort = async profile => {
  const portFile = join(profile, 'DevToolsActivePort')
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port] = (await readFile(portFile, 'utf8')).split('\n')
      if (port) return Number(port)
    } catch {
      // Not written yet.
    }
    await sleep(100)
  }
  throw new Error('Chrome never opened a debugging port')
}

/**
 * A DevTools connection. One socket carries the browser session and every page
 * session on it, told apart by `sessionId` — the flattened mode the protocol
 * has had since it stopped nesting page traffic inside browser messages.
 *
 * Only replies are dispatched. Nothing here waits on a protocol event: the load
 * event says nothing useful about a dev-server bundle, so readiness is polled
 * off the page itself instead.
 */
const connect = async endpoint => {
  const socket = new WebSocket(endpoint)
  const pending = new Map()
  let nextId = 0

  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    const settle = pending.get(message.id)
    if (!settle) return
    pending.delete(message.id)
    if (message.error) settle.reject(new Error(`${message.error.message} (${JSON.stringify(message.error.data)})`))
    else settle.resolve(message.result)
  })

  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, {once: true})
    socket.addEventListener('error', () => reject(new Error(`cannot reach ${endpoint}`)), {once: true})
  })

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = (nextId += 1)
      pending.set(id, {reject, resolve})
      socket.send(JSON.stringify({id, method, params, ...(sessionId ? {sessionId} : {})}))
    })

  return {close: () => socket.close(), send}
}

const chrome = await findChrome()
const profile = join(tmpdir(), `zyplot-shot-${process.pid}`)
await mkdir(profile, {recursive: true})

const browser = spawn(
  chrome,
  [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    // Deterministic pixels: no scrollbar over the plot, no subpixel colour
    // fringing on the text, and the colours the CSS asked for.
    '--hide-scrollbars',
    '--disable-lcd-text',
    '--force-color-profile=srgb',
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  {stdio: 'ignore'}
)
browser.unref()

let session
try {
  const port = await readDebuggerPort(profile)
  const {webSocketDebuggerUrl} = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()
  session = await connect(webSocketDebuggerUrl)

  const {targetId} = await session.send('Target.createTarget', {url: 'about:blank'})
  const {sessionId} = await session.send('Target.attachToTarget', {flatten: true, targetId})

  await session.send(
    'Emulation.setDeviceMetricsOverride',
    {deviceScaleFactor: options.dpr, height: options.height, mobile: false, width: options.width},
    sessionId
  )
  // What the app reads to pick its palette: react-native-web resolves
  // useColorScheme() straight off this media query.
  await session.send(
    'Emulation.setEmulatedMedia',
    {features: [{name: 'prefers-color-scheme', value: options.scheme}]},
    sessionId
  )
  await session.send('Page.enable', {}, sessionId)
  await session.send('Runtime.enable', {}, sessionId)

  await session.send('Page.navigate', {url: options.url}, sessionId)

  // A cold Metro builds the web bundle on this first request, which takes far
  // longer than any load event, so wait on the plot itself rather than the
  // document.
  const deadline = Date.now() + 240_000
  for (;;) {
    const {result} = await session.send(
      'Runtime.evaluate',
      {expression: `!!document.querySelector(${JSON.stringify(options.ready)})`, returnByValue: true},
      sessionId
    )
    if (result.value) break
    if (Date.now() > deadline) throw new Error(`no ${options.ready} appeared at ${options.url}`)
    await sleep(400)
  }

  await sleep(options.settle)

  const {data} = await session.send('Page.captureScreenshot', {format: 'png'}, sessionId)
  await mkdir(dirname(options.out), {recursive: true})
  await writeFile(options.out, Buffer.from(data, 'base64'))
} finally {
  session?.close()
  browser.kill('SIGKILL')
  await rm(profile, {force: true, recursive: true})
}
