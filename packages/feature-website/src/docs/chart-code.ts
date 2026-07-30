/**
 * The source shown under a chart's preview, wrapped in the component a reader
 * would actually paste.
 *
 * It lives here rather than in `docs-page.tsx` so the highlighter script can
 * import the real template instead of restating it — the script reads the
 * `chartExample(name, body)` calls out of the docs source and re-applies this
 * function, so the shown source and the highlighted source cannot drift.
 *
 * Deliberately free of imports and JSX: the script transpiles this module and
 * imports it directly.
 */
export const chartExample = (name: string, body: string) =>
  `import { Chart } from '@hzblj/zyplot'

export function Example() {
  return (
    <Chart.${name}
${body}
    />
  )
}`
