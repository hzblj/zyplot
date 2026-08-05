# Zyplot

Zyplot is a typed React chart library for web, iOS, and Android.

- Package: '@hzblj/zyplot'
- Web: ECharts, uPlot, and DOM components
- iOS: Swift Charts and SwiftUI Canvas
- Android: Jetpack Compose Canvas

## Install

~~~sh
npm install @hzblj/zyplot
~~~

No stylesheet import is required. Rebuild the native app after installation.

Build every chart configuration with `zyplot(z => ({ ... }))`, then spread the result into the chart component. Direct chart prop construction is not part of the documented API.

## Entry points

- '@hzblj/zyplot': shared charts, resolved for the current target
- '@hzblj/zyplot/web': web charts plus Frame, Legend, and Skeleton
- '@hzblj/zyplot/ios': shared charts plus Range and Rule
- '@hzblj/zyplot/android': shared charts plus Waterfall and Lollipop

## Quick start

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar', 'Apr'],
  series: [z.series({ id: 'revenue', label: 'Revenue', values: [42, 56, 51, 72] })],
  format: z.format({ prefix: '$' }),
}))

export function RevenueChart() {
  return <Chart.Line {...chart} />
}
~~~

## Shared data

~~~ts
type ChartSeries = {
  id: string
  label: string
  values: readonly (number | null)[]
  color?: string
  slot?: number
}

type ChartDatum = {
  id: string
  label: string
  value: number
  color?: string
  slot?: number
}

type ChartNumberFormat = {
  decimals?: number
  locale?: string
  prefix?: string
  suffix?: string
}
~~~

A null series value creates a gap.

## Charts

Every chart below has its own minimal example.

### Line

Use for trends.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar'],
  series: [z.series({ id: 'revenue', label: 'Revenue', values: [42, 56, 72] })],
}))

export function Example() {
  return <Chart.Line {...chart} />
}
~~~

### Area

Use when both trend and magnitude matter.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar'],
  series: [z.series({ id: 'revenue', label: 'Revenue', values: [42, 56, 72] })],
}))

export function Example() {
  return <Chart.Area {...chart} />
}
~~~

### Bar

Use for category comparison.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Basic', 'Pro', 'Team'],
  series: [z.series({ id: 'accounts', label: 'Accounts', values: [42, 68, 53] })],
}))

export function Example() {
  return <Chart.Bar {...chart} />
}
~~~

### Stacked bar

Use for totals and their composition.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Q1', 'Q2'],
  series: [
    z.series({ id: 'web', label: 'Web', values: [42, 51] }),
    z.series({ id: 'mobile', label: 'Mobile', values: [28, 37] }),
  ],
}))

export function Example() {
  return <Chart.StackedBar {...chart} />
}
~~~

### Pie

Use for two to five parts of a whole.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  data: [
    { id: 'direct', label: 'Direct', value: 46 },
    { id: 'search', label: 'Search', value: 31 },
    { id: 'social', label: 'Social', value: 23 },
  ],
}))

export function Example() {
  return <Chart.Pie {...chart} />
}
~~~

### Gauge

Use for one value with a meaningful maximum.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({ value: 72, max: 100, format: z.format({ suffix: '%' }) }))

export function Example() {
  return <Chart.Gauge {...chart} />
}
~~~

### Meter

Use for one bounded value in a compact row.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({ label: 'Storage used', value: 72, max: 100 }))

export function Example() {
  return <Chart.Meter {...chart} />
}
~~~

### Histogram

Pass raw observations. Zyplot computes the bins.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({ values: [12, 18, 21, 24, 27, 31, 35, 42], binCount: 6 }))

export function Example() {
  return <Chart.Histogram {...chart} />
}
~~~

### Boxplot

Use for distribution summaries.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  groups: [
    { id: 'a', label: 'Starter', min: 12, q1: 34, median: 54, q3: 72, max: 91 },
  ],
  labels: { min: 'Min', q1: 'Q1', median: 'Median', q3: 'Q3', max: 'Max' },
}))

export function Example() {
  return <Chart.Boxplot {...chart} />
}
~~~

### Candlestick

Use for open, high, low, and close data.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  data: [
    { id: 'mon', category: 'Mon', open: 126, high: 136, low: 124, close: 132 },
    { id: 'tue', category: 'Tue', open: 133, high: 138, low: 127, close: 128 },
  ],
}))

export function Example() {
  return <Chart.Candlestick {...chart} />
}
~~~

### Diverging bar

Use for positive and negative values around zero.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  data: [
    { id: 'north', label: 'North', value: 18 },
    { id: 'south', label: 'South', value: -12 },
  ],
}))

export function Example() {
  return <Chart.DivergingBar {...chart} />
}
~~~

### Dumbbell

Web requires beforeLabel and afterLabel. Native uses rows only.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  rows: [{ id: 'activation', label: 'Activation', before: 54, after: 72 }],
  beforeLabel: '2025',
  afterLabel: '2026',
}))

export function Example() {
  return <Chart.Dumbbell {...chart} />
}
~~~

### Funnel

Web uses the stages prop. Native uses data.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  stages: [
    { id: 'visit', label: 'Visited', value: 1200 },
    { id: 'trial', label: 'Trial', value: 740 },
    { id: 'paid', label: 'Paid', value: 210 },
  ],
}))

export function Example() {
  return <Chart.Funnel {...chart} />
}
~~~

### Heatmap

Cells address rows and columns by index.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  columns: ['Mon', 'Tue'],
  rows: ['Morning', 'Evening'],
  cells: [
    { columnIndex: 0, rowIndex: 0, value: 24 },
    { columnIndex: 1, rowIndex: 0, value: 61 },
    { columnIndex: 0, rowIndex: 1, value: 78 },
    { columnIndex: 1, rowIndex: 1, value: 54 },
  ],
}))

export function Example() {
  return <Chart.Heatmap {...chart} />
}
~~~

### Radar

Use for overall profile shape.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  axes: [
    { label: 'Speed', max: 100 },
    { label: 'Quality', max: 100 },
    { label: 'Value', max: 100 },
  ],
  series: [z.series({ id: 'pro', label: 'Pro', values: [91, 84, 74] })],
}))

export function Example() {
  return <Chart.Radar {...chart} />
}
~~~

### Scatter

Use for correlation, clusters, and outliers.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  xLabel: 'Spend',
  yLabel: 'Revenue',
  series: [
    {
      id: 'accounts',
      label: 'Accounts',
      points: [{ label: 'A', x: 12, y: 42 }, { label: 'B', x: 24, y: 61 }],
    },
  ],
}))

export function Example() {
  return <Chart.Scatter {...chart} />
}
~~~

### Sankey

Links reference nodes by id.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  nodes: [
    { id: 'visits', label: 'Visits' },
    { id: 'trial', label: 'Trial' },
    { id: 'paid', label: 'Paid' },
  ],
  links: [
    { source: 'visits', target: 'trial', value: 72 },
    { source: 'trial', target: 'paid', value: 44 },
  ],
}))

export function Example() {
  return <Chart.Sankey {...chart} />
}
~~~

### Sunburst

Web uses nodes. Native uses data.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  nodes: [
    {
      id: 'product',
      label: 'Product',
      children: [
        { id: 'web', label: 'Web', value: 48 },
        { id: 'ios', label: 'iOS', value: 31 },
      ],
    },
  ],
}))

export function Example() {
  return <Chart.Sunburst {...chart} />
}
~~~

### Treemap

Web uses nodes. Native uses data.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  nodes: [
    {
      id: 'product',
      label: 'Product',
      children: [
        { id: 'web', label: 'Web', value: 48 },
        { id: 'ios', label: 'iOS', value: 31 },
      ],
    },
  ],
}))

export function Example() {
  return <Chart.Treemap {...chart} />
}
~~~

### Time series

Timestamps are Unix seconds. Each values array matches one series.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  points: {
    timestamps: [1735689600, 1735776000, 1735862400],
    values: [[42, 51, 48]],
  },
  series: [{ id: 'requests', label: 'Requests' }],
}))

export function Example() {
  return <Chart.TimeSeries {...chart} />
}
~~~

### Sparkline

Use inside a row or card.

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({ values: [12, 18, 14, 24, 31, 29], height: 48 }))

export function Example() {
  return <Chart.Sparkline {...chart} />
}
~~~

### Range (iOS only)

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot/ios'

const chart = zyplot(z => ({
  data: [
    { id: 'mon', category: 'Mon', low: 12, high: 24 },
    { id: 'tue', category: 'Tue', low: 18, high: 31 },
  ],
}))

export function Example() {
  return <Chart.Range {...chart} />
}
~~~

### Rule (iOS only)

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot/ios'

const chart = zyplot(z => ({
  data: [
    { id: 'target', label: 'Target', value: 80 },
    { id: 'limit', label: 'Limit', value: 95 },
  ],
  orientation: 'horizontal',
}))

export function Example() {
  return <Chart.Rule {...chart} />
}
~~~

### Waterfall (Android only)

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot/android'

const chart = zyplot(z => ({
  data: [
    { id: 'revenue', label: 'Revenue', value: 120 },
    { id: 'costs', label: 'Costs', value: -48 },
    { id: 'profit', label: 'Profit', value: 72 },
  ],
}))

export function Example() {
  return <Chart.Waterfall {...chart} />
}
~~~

### Lollipop (Android only)

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot/android'

const chart = zyplot(z => ({
  data: [
    { id: 'alpha', label: 'Alpha', value: 42 },
    { id: 'beta', label: 'Beta', value: 68 },
  ],
  orientation: 'horizontal',
}))

export function Example() {
  return <Chart.Lollipop {...chart} />
}
~~~

## Loading

~~~tsx
const chart = zyplot(z => ({
  categories,
  series,
  height: 280,
  isLoading: query.isLoading,
}))

return <Chart.Line {...chart} />
~~~

Web charts also accept a custom skeleton element.

## Theming

~~~tsx
const theme = {
  colors: {
    categorical: ['#6d28d9', '#0284c7'],
    grid: '#e4e4e7',
    label: '#71717a',
    positive: '#16a34a',
    negative: '#dc2626',
  },
  typography: { fontFamily: 'Inter' },
}

<Chart.Provider theme={theme}>
  <Dashboard />
</Chart.Provider>
~~~

A chart can override the provider with its own theme and surface.

## Interaction

~~~tsx
import { Chart, useChartScrub, zyplot } from '@hzblj/zyplot'

export function PriceChart({ categories, values }) {
  const { onInteraction, selection } = useChartScrub()
  const value = selection ? values[selection.index] : values.at(-1)
  const chart = zyplot(z => ({
    categories,
    series: [z.series({ id: 'price', label: 'Price', values })],
    interaction: z.interaction.scrub({ selection: 'single' }),
    onInteraction,
  }))

  return (
    <>
      <strong>{value}</strong>
      <Chart.Line {...chart} />
    </>
  )
}
~~~

useChartScrub returns selection, range, geometry, onInteraction, and reset.

## Builders

~~~tsx
import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar'],
  series: [
    z.series({
      id: 'revenue',
      label: 'Revenue',
      values: [42, 56, 72],
      style: { strokeWidth: 2 },
    }),
  ],
  yAxis: z.axis.end({ format: z.format({ prefix: '$' }) }),
}))

export function Example() {
  return <Chart.Line {...chart} />
}
~~~

Builders return plain serializable objects.

## Native setup

~~~sh
npm install @hzblj/zyplot
npx expo prebuild
npx expo run:ios
# or: npx expo run:android
~~~

Use explicit '/ios' and '/android' imports only in platform files.

## Complete examples

The repository includes complete Revolut, Kraken, Family, Health, and Stocks screens under 'packages/feature-charts/src' and 'apps/example/src'.

## Links

- Documentation: https://www.zyplot.janblazej.dev/docs
- Repository: https://github.com/hzblj/zyplot
- npm: https://www.npmjs.com/package/@hzblj/zyplot
