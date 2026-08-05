export const chartExample = (name: string, body: string, setup = '', entryPoint = '@hzblj/zyplot') =>
  `import { Chart, zyplot } from '${entryPoint}'

${setup ? `${setup}\n\n` : ''}const chart = zyplot(z => ({
${body}
}))

export function Example() {
  return <Chart.${name} {...chart} />
}`
