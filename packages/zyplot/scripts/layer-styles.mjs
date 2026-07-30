import {readFileSync, writeFileSync} from 'node:fs'

const [target] = process.argv.slice(2)
if (!target) {
  throw new Error('layer-styles: pass the stylesheet to wrap')
}

const css = readFileSync(target, 'utf8').trim()
const LAYER = '@layer base{'

if (css.startsWith(LAYER)) {
  process.exit(0)
}

writeFileSync(target, `${LAYER}${css}}\n`)
