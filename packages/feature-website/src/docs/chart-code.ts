export const chartExample = (name: string, body: string) =>
  `import { Chart } from '@hzblj/zyplot'

export function Example() {
  return (
    <Chart.${name}
${body}
    />
  )
}`
