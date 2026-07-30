/**
 * Pre-highlights every code sample in the docs, at build time.
 *
 * The docs page is a client component — it builds the chart previews, and those
 * are client components themselves — so Shiki cannot run where the samples are
 * written. Highlighting here instead keeps the highlighter and its grammars out
 * of the browser bundle entirely: what ships is coloured markup and nothing else.
 *
 * Both Night Owl variants are baked into one payload. The light colours land in
 * each span's inline `style` and the dark ones in `--shiki-dark`, so switching
 * theme only changes which of the two the stylesheet reads — no re-highlight, no
 * flash, no second request. `styles.css` holds the `html.dark` half.
 *
 * Samples are keyed by their own source text, so nothing has to be labelled or
 * kept in sync by hand: `CodeBlock` looks itself up by the string it was given,
 * and a sample with no entry falls back to plain text rather than breaking.
 */
import {readFileSync, writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {createHighlighter} from 'shiki'
import ts from 'typescript'

const DOCS_PAGE = fileURLToPath(new URL('../src/docs/docs-page.tsx', import.meta.url))
const CHART_CODE = fileURLToPath(new URL('../src/docs/chart-code.ts', import.meta.url))
const INSTALL_COMMANDS = fileURLToPath(new URL('../src/install-commands.ts', import.meta.url))
const OUTPUT = fileURLToPath(new URL('../src/docs/highlighted-samples.generated.ts', import.meta.url))

const THEMES = {dark: 'night-owl', light: 'night-owl-light'}
const LANGUAGES = ['bash', 'css', 'json', 'ts', 'tsx']

/** Imports a plain-TS module by transpiling it — no loader flags, no build step of its own. */
const importPlainModule = async path => {
  const {outputText} = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext},
  })
  const encoded = Buffer.from(outputText).toString('base64')
  return import(`data:text/javascript;base64,${encoded}`)
}

const literalText = node =>
  node && (ts.isNoSubstitutionTemplateLiteral(node) || ts.isStringLiteral(node)) ? node.text : undefined

/**
 * Walks the docs source for the two ways a sample is written: inline inside a
 * `<CodeBlock>`, and as a `chartExample(name, body)` call under a chart preview.
 */
const collectSamples = (source, chartExample) => {
  const tree = ts.createSourceFile(DOCS_PAGE, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const samples = []

  const visit = node => {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText() === 'CodeBlock') {
      const language =
        node.openingElement.attributes.properties
          .filter(ts.isJsxAttribute)
          .find(attribute => attribute.name.getText() === 'language')?.initializer?.text ?? 'tsx'

      for (const child of node.children) {
        const code = ts.isJsxExpression(child) ? literalText(child.expression) : undefined
        if (code !== undefined) {
          samples.push({code, language, origin: 'CodeBlock'})
        }
      }
    }

    if (ts.isCallExpression(node) && ['chartExample', 'code'].includes(node.expression.getText())) {
      const [name, body] = node.arguments.map(literalText)
      if (name !== undefined && body !== undefined) {
        samples.push({code: chartExample(name, body), language: 'tsx', origin: `chartExample(${name})`})
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(tree)
  return samples
}

const {chartExample} = await importPlainModule(CHART_CODE)
const {INSTALL_COMMANDS: installCommands} = await importPlainModule(INSTALL_COMMANDS)

const samples = [
  ...collectSamples(readFileSync(DOCS_PAGE, 'utf8'), chartExample),
  // The install block is a shell command per package manager, switched client-side.
  ...Object.entries(installCommands).map(([manager, code]) => ({
    code,
    language: 'bash',
    origin: `install(${manager})`,
  })),
]

if (samples.length === 0) {
  throw new Error('No code samples found in docs-page.tsx — the extractor is out of step with the source.')
}

/** A sample is keyed by its text alone, so the same text must not want two grammars. */
const languageFor = new Map()
for (const {code, language, origin} of samples) {
  const existing = languageFor.get(code)
  if (existing && existing.language !== language) {
    throw new Error(
      `The same sample is used as both ${existing.language} and ${language} ` +
        `(${existing.origin} vs ${origin}). Keying by source text cannot represent that.`
    )
  }
  languageFor.set(code, {language, origin})
}

const highlighter = await createHighlighter({langs: LANGUAGES, themes: [THEMES.dark, THEMES.light]})

const entries = [...languageFor].map(([code, {language}]) => {
  const html = highlighter.codeToHtml(code, {
    defaultColor: 'light',
    lang: LANGUAGES.includes(language) ? language : 'text',
    themes: THEMES,
  })
  return `  ${JSON.stringify(code)}: ${JSON.stringify(html)},`
})

writeFileSync(
  OUTPUT,
  `// Generated by scripts/highlight-samples.mjs. Do not edit.
// Every docs code sample, tokenised by Shiki into Night Owl light and dark at once.
// Keyed by the sample's own source text — see CodeBlock and Example.

export const HIGHLIGHTED_SAMPLES: Record<string, string> = {
${entries.join('\n')}
}
`
)

const KINDS = {chartExample: 'chart examples', install: 'install commands'}

const byOrigin = samples.reduce((counts, {origin}) => {
  const kind = Object.entries(KINDS).find(([prefix]) => origin.startsWith(prefix))?.[1] ?? 'inline blocks'
  return {...counts, [kind]: (counts[kind] ?? 0) + 1}
}, {})

console.log(`highlighted ${languageFor.size} samples (${JSON.stringify(byOrigin)}) → ${OUTPUT.split('/').pop()}`)
