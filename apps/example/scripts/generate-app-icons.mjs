#!/usr/bin/env node
// Rasterizes every app icon variant from assets/zyplot-mark.svg. Needs librsvg (`brew install librsvg`).
// Run it after the mark or the brand colors change, then `expo prebuild` to push the icons into the
// native projects: yarn workspace @zyplot/example icons

import {execFileSync} from 'node:child_process'
import {readFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const assets = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')
const mark = {height: 963, width: 1061}
const markPath = readFileSync(join(assets, 'zyplot-mark.svg'), 'utf8').match(/<path d="([^"]+)"/)?.[1]

if (!markPath) throw new Error('No <path d="…"> found in assets/zyplot-mark.svg')

const size = 1024

// The square variants repeat the website favicon: the mark at 65.8% of the canvas width.
const squareWidth = 0.658

// Android composes the icon on a 108dp canvas but only the inner 72dp is guaranteed visible, so the
// mark takes the same share of that square as it does on iOS. Its corners are inked and the launcher
// mask may be a circle, so the box has to stay inside the inscribed one.
const adaptiveWidth = squareWidth * (72 / 108)
const safeDiameter = size * (72 / 108)
const markDiagonal = size * Math.hypot(adaptiveWidth, (adaptiveWidth * mark.height) / mark.width)

if (markDiagonal > safeDiameter) throw new Error('The adaptive foreground reaches past a circular mask')

const variants = [
  // iOS light + the base icon every other platform falls back to.
  {background: '#4400fc', file: 'icon.png', fill: '#ffffff', width: squareWidth},
  // iOS 18 dark: the same composition on a purple field deep enough to sit in a dark home screen.
  {background: '#170036', file: 'icon-dark.png', fill: '#ffffff', width: squareWidth},
  // iOS 18 tinted: grayscale, because the system maps luminance onto the user's tint.
  {background: '#000000', file: 'icon-tinted.png', fill: '#ffffff', width: squareWidth},
  // Android adaptive foreground, layered over @color/iconBackground.
  {file: 'adaptive-icon.png', fill: '#ffffff', width: adaptiveWidth},
  // Android 13+ themed icons: a silhouette the launcher recolors.
  {file: 'adaptive-icon-monochrome.png', fill: '#ffffff', width: adaptiveWidth},
  {background: '#4400fc', file: 'favicon.png', fill: '#ffffff', size: 512, width: squareWidth},
]

const compose = ({background, fill, width}) => {
  const scale = (width * size) / mark.width
  const x = (size - mark.width * scale) / 2
  const y = (size - mark.height * scale) / 2

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    background ? `<rect width="${size}" height="${size}" fill="${background}" />` : '',
    `<g transform="translate(${x} ${y}) scale(${scale})"><path d="${markPath}" fill="${fill}" /></g>`,
    '</svg>',
  ].join('')
}

for (const variant of variants) {
  const output = variant.size ?? size
  const args = ['-w', String(output), '-h', String(output), '-o', join(assets, variant.file)]

  execFileSync('rsvg-convert', args, {input: compose(variant)})
  console.log(`${variant.file} — ${output}×${output}`)
}
