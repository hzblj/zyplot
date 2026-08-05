import Link from 'next/link'
import {docsStyles} from '../docs-styles'
import {HERO_HEADLINE, HERO_LEDE} from '../hero-copy'
import {REPOSITORY_URL} from '../links'
import {ChangelogList} from './components/changelog-list'
import {CodeBlock} from './components/code-block'
import {PackageInstall} from './components/package-install'
import {PropsTable} from './components/props-table'

const styles = docsStyles()

const AppGuide = ({
  code,
  id,
  name,
  summary,
  uses,
}: {
  code: string
  id: 'family' | 'health' | 'kraken' | 'revolut' | 'stocks'
  name: string
  summary: string
  uses: string
}) => (
  <section className={styles.section()} id={id}>
    <p className={styles.kicker()}>Complete example</p>
    <h2>{name}</h2>
    <p>{summary}</p>
    <figure className={styles.screenshot()}>
      <img alt={`${name} example`} className={styles.screenshotLight()} src={`/apps/${id}/light.png`} />
      <img alt="" className={styles.screenshotDark()} src={`/apps/${id}/dark.png`} />
    </figure>
    <p>{uses}</p>
    <h3>Build the chart</h3>
    <CodeBlock>{code}</CodeBlock>
    <p>
      <a href={`${REPOSITORY_URL}/tree/main/packages/feature-charts/src/${id}`}>Chart source</a>
      {' · '}
      <a href={`${REPOSITORY_URL}/tree/main/apps/example/src/${id}`}>Screen source</a>
    </p>
  </section>
)

export const GuideContent = ({page}: {page: string}) => {
  switch (page) {
    case 'introduction':
      return (
        <>
          <section className={styles.hero()} id="getting-started">
            <p className={styles.kicker()}>Getting started</p>
            <h1>{HERO_HEADLINE}</h1>
            <p>{HERO_LEDE}</p>
          </section>
          <section className={styles.section()} id="first-chart">
            <h2>First chart</h2>
            <CodeBlock>{`import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar', 'Apr'],
  series: [
    z.series({ id: 'revenue', label: 'Revenue', values: [42, 56, 51, 72] }),
  ],
  format: z.format({ prefix: '$' }),
}))

export function RevenueChart() {
  return <Chart.Line {...chart} />
}`}</CodeBlock>
            <p>
              Pick a chart from the menu for a complete example and its props. Start with{' '}
              <Link href="/docs/charts/line">Line</Link>, <Link href="/docs/charts/bar">Bar</Link>, or{' '}
              <Link href="/docs/charts/pie">Pie</Link>.
            </p>
          </section>
        </>
      )

    case 'installation':
      return (
        <section className={styles.section()} id="installation">
          <h2>Installation</h2>
          <PackageInstall />
          <p>No stylesheet import or Tailwind setup is required. Native modules are included in the package.</p>
          <h3 id="entry-points">Entry points</h3>
          <PropsTable
            rows={[
              {
                description: 'Automatic web or native renderer. Use this for shared charts.',
                name: '@hzblj/zyplot',
                type: 'web, iOS, Android',
              },
              {
                description: 'Web charts plus Frame, Legend, and Skeleton components.',
                name: '@hzblj/zyplot/web',
                type: 'web',
              },
              {description: 'Shared charts plus Range and Rule.', name: '@hzblj/zyplot/ios', type: 'iOS'},
              {
                description: 'Shared charts plus Waterfall and Lollipop.',
                name: '@hzblj/zyplot/android',
                type: 'Android',
              },
            ]}
          />
          <CodeBlock>{`import { Chart, zyplot } from '@hzblj/zyplot'

// Use explicit entry points only in platform files:
import { Chart as IosChart, zyplot as iosZyplot } from '@hzblj/zyplot/ios'
import { Chart as AndroidChart, zyplot as androidZyplot } from '@hzblj/zyplot/android'`}</CodeBlock>
        </section>
      )

    case 'data-types':
      return (
        <section className={styles.section()} id="data-types">
          <h2>Data types</h2>
          <p>
            All chart data is plain serializable data. Import types from the same entry point as <code>Chart</code>.
          </p>
          <h3 id="common-data">Common data</h3>
          <CodeBlock>{`import type { ChartDatum, ChartSeries } from '@hzblj/zyplot'

const revenue: ChartSeries = {
  id: 'revenue',
  label: 'Revenue',
  values: [42, 56, null, 72], // null creates a gap
}

const slice: ChartDatum = {
  id: 'direct',
  label: 'Direct',
  value: 46,
}`}</CodeBlock>
          <PropsTable
            rows={[
              {
                description: 'Named values aligned with categories.',
                name: 'ChartSeries',
                type: '{ id, label, values, color?, slot? }',
              },
              {description: 'One labeled value.', name: 'ChartDatum', type: '{ id, label, value, color?, slot? }'},
              {
                description: 'Number formatting shared by labels and tooltips.',
                name: 'ChartNumberFormat',
                type: '{ locale?, decimals?, prefix?, suffix? }',
              },
            ]}
          />
          <h3 id="specialized-data">Specialized data</h3>
          <PropsTable
            rows={[
              {description: 'Five-number summary and outliers.', name: 'ChartBoxplotGroup', type: 'Boxplot'},
              {description: 'Open, high, low, close, and volume.', name: 'ChartCandlestickDatum', type: 'Candlestick'},
              {description: 'Row and column indexes with a value.', name: 'ChartHeatmapCell', type: 'Heatmap'},
              {
                description: 'Nested nodes with values on leaves.',
                name: 'ChartHierarchyNode',
                type: 'Sunburst, Treemap',
              },
              {description: 'Timestamps and parallel value arrays.', name: 'ChartTimePoints', type: 'TimeSeries'},
            ]}
          />
          <h3 id="presentation-data">Presentation</h3>
          <p>
            Axes, annotations, interaction, animation, series styles, themes, and surfaces are typed objects. Use the{' '}
            <Link href="/docs/builders">builders</Link> when you want autocomplete for a specific variant.
          </p>
        </section>
      )

    case 'builders':
      return (
        <section className={styles.section()} id="builders">
          <h2>Builders</h2>
          <p>Builders add type-safe defaults and discriminants. They return plain objects.</p>
          <CodeBlock>{`import { Chart, zyplot } from '@hzblj/zyplot'

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
  animation: z.animation({ reveal: z.reveal.draw({ duration: 400 }) }),
}))

export function RevenueChart() {
  return <Chart.Line {...chart} />
}`}</CodeBlock>
          <h3 id="builder-list">Available builders</h3>
          <PropsTable
            rows={[
              {description: 'Build a complete props object.', name: 'zyplot', type: 'chart config'},
              {description: 'Build a styled series.', name: 'series', type: 'ChartSeries'},
              {
                description: 'Build line, point, range, text, or measure annotations.',
                name: 'annotation',
                type: 'annotation variants',
              },
              {description: 'Place an axis at start, end, or over the plot.', name: 'axis', type: 'axis variants'},
              {
                description: 'Build draw, fade, or disabled reveal animation.',
                name: 'reveal',
                type: 'animation variants',
              },
              {
                description: 'Build point, segment, or trail selection markers.',
                name: 'marker',
                type: 'interaction variants',
              },
              {
                description: 'Create typed theme, surface, plot, fill, format, and interaction objects.',
                name: 'options',
                type: 'plain objects',
              },
            ]}
          />
        </section>
      )

    case 'loading-states':
      return (
        <section className={styles.section()} id="loading-states">
          <h2>Loading states</h2>
          <p>
            Set <code>isLoading</code> while data is being fetched. The placeholder keeps the chart height stable.
          </p>
          <CodeBlock>{`const chart = zyplot(z => ({
  categories,
  series,
  height: 280,
  isLoading: query.isLoading,
}))

return <Chart.Line {...chart} />`}</CodeBlock>
          <h3 id="custom-skeleton">Custom skeleton</h3>
          <p>The web renderer accepts a custom element. Native charts always use their built-in placeholder.</p>
          <CodeBlock>{`const chart = zyplot(z => ({
  categories,
  series,
  isLoading,
  skeleton: <div className="h-[280px] animate-pulse rounded-xl bg-gray-100" />,
}))

return <Chart.Line {...chart} />`}</CodeBlock>
        </section>
      )

    case 'theming':
      return (
        <section className={styles.section()} id="theming">
          <h2>Theming</h2>
          <p>
            Use <code>Chart.Provider</code> for shared defaults or pass <code>theme</code> to one chart.
          </p>
          <CodeBlock>{`import { Chart } from '@hzblj/zyplot'
import type { ReactNode } from 'react'

const theme = {
  colors: {
    categorical: ['#6d28d9', '#0284c7', '#ea580c'],
    grid: '#e4e4e7',
    label: '#71717a',
    positive: '#16a34a',
    negative: '#dc2626',
  },
  typography: { fontFamily: 'Inter' },
}

export function Dashboard({ children }: { children: ReactNode }) {
  return <Chart.Provider theme={theme}>{children}</Chart.Provider>
}`}</CodeBlock>
          <h3 id="theme-keys">Theme keys</h3>
          <PropsTable
            rows={[
              {description: 'Series colors in order.', name: 'categorical', type: 'string[]'},
              {description: 'Axis and grid colors.', name: 'axis / grid', type: 'string'},
              {description: 'Labels and tooltip text.', name: 'label', type: 'string'},
              {description: 'Positive and negative values.', name: 'positive / negative', type: 'string'},
              {description: 'Tooltip background and gauge track.', name: 'surface / track', type: 'string'},
              {description: 'Font family available on the target platform.', name: 'fontFamily', type: 'string'},
            ]}
          />
          <h3 id="surface">Surface</h3>
          <CodeBlock>{`const chart = zyplot(z => ({
  ...data,
  surface: z.surface({
    background: '#0b0b0b',
    border: { color: '#27272a', width: 1 },
    cornerRadius: 16,
    padding: 16,
  }),
}))

return <Chart.Line {...chart} />`}</CodeBlock>
          <h3 id="dark-mode">Light and dark mode</h3>
          <p>The web provider can inherit the page mode, follow the system, or use a fixed mode.</p>
          <CodeBlock>{`<Chart.Provider colorMode="system">
  <Dashboard />
</Chart.Provider>

// Other values: "light", "dark", "inherit"`}</CodeBlock>
          <p>
            On native, pass <code>colorMode</code> inside the chart builder when you need to override the OS setting.
          </p>
          <CodeBlock>{`const chart = zyplot(z => ({
  ...data,
  colorMode: 'dark',
}))

return <Chart.Line {...chart} />`}</CodeBlock>
          <h3 id="css-variables">CSS variables</h3>
          <p>
            Web themes map to <code>--zyplot-*</code> variables. You can override them in CSS.
          </p>
          <CodeBlock language="css">{`.brand-charts {
  --zyplot-color-categorical-1: #6d28d9;
  --zyplot-color-grid: #e4e4e7;
  --zyplot-color-label: #71717a;
  --zyplot-font-family: Inter, sans-serif;
}`}</CodeBlock>
        </section>
      )

    case 'dark-mode':
      return (
        <section className={styles.section()} id="dark-mode">
          <h2>Light and dark mode</h2>
          <p>The web provider can inherit the page mode, follow the system, or use a fixed mode.</p>
          <CodeBlock>{`<Chart.Provider colorMode="system">
  <Dashboard />
</Chart.Provider>

// Other values: "light", "dark", "inherit"`}</CodeBlock>
          <p>
            On native, pass <code>colorMode</code> to an individual chart when you need to override the OS setting.
          </p>
          <h3 id="css-variables">CSS variables</h3>
          <p>
            Web themes map to <code>--zyplot-*</code> variables. You can override them in CSS.
          </p>
          <CodeBlock language="css">{`.brand-charts {
  --zyplot-color-categorical-1: #6d28d9;
  --zyplot-color-grid: #e4e4e7;
  --zyplot-color-label: #71717a;
  --zyplot-font-family: Inter, sans-serif;
}`}</CodeBlock>
        </section>
      )

    case 'web-package':
      return (
        <section className={styles.section()} id="web-package">
          <h2>Web renderer</h2>
          <p>
            <code>@hzblj/zyplot</code> resolves to the web renderer outside React Native. Use <code>/web</code> only
            when you need an explicit browser import.
          </p>
          <CodeBlock>{`import { Chart } from '@hzblj/zyplot/web'`}</CodeBlock>
          <p>Charts include their styles. You do not need to import CSS.</p>
          <h3 id="web-engines">Rendering engines</h3>
          <PropsTable
            rows={[
              {
                description: 'Line, area, bars, radial, hierarchy, statistical, and finance charts.',
                name: 'ECharts',
                type: 'canvas',
              },
              {description: 'Dense time series and sparklines.', name: 'uPlot', type: 'canvas'},
              {description: 'Meter, Frame, Legend, and accessible labels.', name: 'React', type: 'DOM'},
            ]}
          />
          <div className={styles.note()}>
            <strong>Server components</strong>
            Render chart components from a client boundary. Types, data, and builders can be created in server code
            because they are serializable.
          </div>
        </section>
      )

    case 'composition':
      return (
        <section className={styles.section()} id="composition">
          <h2>Frame and legend</h2>
          <p>
            <code>Chart.Frame</code> and <code>Chart.Legend</code> are available from the web entry point.
          </p>
          <CodeBlock>{`import { Chart, zyplot } from '@hzblj/zyplot/web'

const legend = [
  { id: 'revenue', label: 'Revenue', color: '#6d28d9' },
  { id: 'costs', label: 'Costs', color: '#0284c7' },
]

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar'],
  series: [
    z.series({ id: 'revenue', label: 'Revenue', values: [42, 56, 72] }),
    z.series({ id: 'costs', label: 'Costs', values: [28, 34, 41] }),
  ],
}))

export function RevenueCard() {
  return (
    <Chart.Frame title="Revenue" description="Last 6 months" caption="Updated today">
      <Chart.Line {...chart} />
      <Chart.Legend items={legend} />
    </Chart.Frame>
  )
}`}</CodeBlock>
          <h3 id="frame-props">Frame props</h3>
          <PropsTable
            rows={[
              {description: 'Main heading.', name: 'title', type: 'string'},
              {description: 'Text below the heading.', name: 'description', type: 'string'},
              {description: 'Controls placed in the header.', name: 'actions', type: 'ReactNode'},
              {description: 'Small text below the chart.', name: 'caption', type: 'string'},
              {description: 'Chart and optional legend.', name: 'children', required: true, type: 'ReactNode'},
            ]}
          />
          <h3 id="legend-props">Legend props</h3>
          <PropsTable
            rows={[
              {
                description: 'Stable id, visible label, and color for each item.',
                name: 'items',
                required: true,
                type: 'ChartLegendItem[]',
              },
              {description: 'CSS class on the list.', name: 'className', type: 'string'},
            ]}
          />
        </section>
      )

    case 'native-package':
      return (
        <section className={styles.section()} id="native-package">
          <h2>Native setup</h2>
          <p>
            Zyplot ships an Expo module. Install the package, rebuild the native app, and use the shared entry point.
          </p>
          <CodeBlock language="bash">{`npm install @hzblj/zyplot
npx expo prebuild
npx expo run:ios
# or: npx expo run:android`}</CodeBlock>
          <CodeBlock>{`import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar'],
  series: [z.series({ id: 'revenue', label: 'Revenue', values: [42, 56, 72] })],
  height: 280,
}))

export function Revenue() {
  return <Chart.Line {...chart} />
}`}</CodeBlock>
          <h3 id="platform-files">Platform files</h3>
          <p>Use platform files only for platform-specific charts or axis options.</p>
          <CodeBlock>{`// Forecast.ios.tsx
import { Chart, zyplot } from '@hzblj/zyplot/ios'

// Forecast.android.tsx
import { Chart, zyplot } from '@hzblj/zyplot/android'`}</CodeBlock>
          <h3 id="native-differences">Platform differences</h3>
          <PropsTable
            rows={[
              {description: 'Web uses stages; native uses data.', name: 'Funnel data prop', type: 'stages / data'},
              {
                description: 'Web uses nodes; native uses data.',
                name: 'Sunburst and Treemap data prop',
                type: 'nodes / data',
              },
              {
                description: 'Required on web and omitted on native.',
                name: 'Dumbbell labels',
                type: 'beforeLabel / afterLabel',
              },
              {
                description: 'DOM-only styling and placeholders.',
                name: 'Web-only props',
                type: 'className / skeleton / texture',
              },
              {
                description: 'Native accessibility and fixed color mode.',
                name: 'Native-only props',
                type: 'accessibilityLabel / colorMode',
              },
            ]}
          />
        </section>
      )

    case 'native-ios':
      return (
        <section className={styles.section()} id="native-ios">
          <h2>iOS</h2>
          <p>
            The iOS renderer uses Swift Charts and SwiftUI Canvas. Put explicit iOS imports in <code>*.ios.tsx</code>{' '}
            files.
          </p>
          <CodeBlock>{`import { Chart, zyplot } from '@hzblj/zyplot/ios'

const chart = zyplot(z => ({
  categories: ['Jan', 'Feb', 'Mar'],
  series: [z.series({ id: 'price', label: 'Price', values: [42, 56, 72] })],
  xAxis: { visibleDomain: 30 },
}))

export function Price() {
  return <Chart.Line {...chart} />
}`}</CodeBlock>
          <h3 id="ios-only">iOS-only charts</h3>
          <p>
            <Link href="/docs/charts/ios-range">Range</Link> plots low-to-high intervals.{' '}
            <Link href="/docs/charts/ios-rule">Rule</Link> draws standalone reference lines.
          </p>
        </section>
      )

    case 'native-android':
      return (
        <section className={styles.section()} id="native-android">
          <h2>Android</h2>
          <p>
            The Android renderer draws on a Jetpack Compose Canvas. Put explicit Android imports in{' '}
            <code>*.android.tsx</code> files.
          </p>
          <CodeBlock>{`import { Chart, zyplot } from '@hzblj/zyplot/android'

const chart = zyplot(z => ({
  categories: ['Basic', 'Pro', 'Team'],
  series: [z.series({ id: 'spend', label: 'Spend', values: [42, 68, 53] })],
  xAxis: { labelOverflow: 'ellipsis' },
}))

export function Spend() {
  return <Chart.Bar {...chart} />
}`}</CodeBlock>
          <h3 id="android-only">Android-only charts</h3>
          <p>
            <Link href="/docs/charts/android-waterfall">Waterfall</Link> explains a running total.{' '}
            <Link href="/docs/charts/android-lollipop">Lollipop</Link> is a lighter category comparison.
          </p>
        </section>
      )

    case 'use-chart-scrub':
      return (
        <section className={styles.section()} id="use-chart-scrub">
          <h2>useChartScrub</h2>
          <p>
            Connect the hook to <code>onInteraction</code> and read the current selection outside the plot.
          </p>
          <CodeBlock>{`import { Chart, useChartScrub, zyplot } from '@hzblj/zyplot'

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
}`}</CodeBlock>
          <h3 id="scrub-result">Returned values</h3>
          <PropsTable
            rows={[
              {
                description: 'Current datum index, category, and value.',
                name: 'selection',
                type: 'ChartScrubSelection | null',
              },
              {description: 'Two-finger range on native.', name: 'range', type: 'ChartInteractionRange | null'},
              {description: 'Measured plot and annotation positions.', name: 'geometry', type: 'ChartGeometry | null'},
              {description: 'Pass directly to the chart.', name: 'onInteraction', type: 'ChartInteractionHandler'},
              {description: 'Clear the current selection.', name: 'reset', type: '() => void'},
            ]}
          />
        </section>
      )

    case 'use-last-reading':
      return (
        <section className={styles.section()} id="use-last-reading">
          <h2>useLastReading</h2>
          <p>
            Returns the last non-null value and its matching category. Returns <code>null</code> when the series has no
            value.
          </p>
          <CodeBlock>{`import { useLastReading } from '@hzblj/zyplot'

export function LatestPrice({ categories, values }) {
  const reading = useLastReading(categories, values)

  if (!reading) return null
  return <span>{reading.category}: {reading.value}</span>
}`}</CodeBlock>
        </section>
      )

    case 'revolut':
      return (
        <AppGuide
          code={`import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories,
  series: [
    z.series({
      id: 'price',
      label: 'Price',
      values: prices,
      style: { color: '#0066ff', glow: z.glow({ opacity: 0.2, radius: 12 }), strokeWidth: 2.3 },
    }),
  ],
  animation: z.animation({ reveal: z.reveal.draw({ duration: 520 }) }),
  annotations: [
    z.annotation.point({ id: 'live', x: categories.at(-1), y: prices.at(-1), pulse: true }),
  ],
  interaction: z.interaction.scrub({ marker: z.marker.point({ size: 14 }) }),
  format: z.format({ decimals: 2, prefix: '$' }),
}))

export function PriceChart() {
  return <Chart.Line {...chart} />
}`}
          id="revolut"
          name="Revolut"
          summary="A stock-detail screen with a scrubbed price, line/candlestick switch, annotations, and a native tooltip view."
          uses="Uses Line, Candlestick, useChartScrub, annotations, reveal animation, and custom tooltip placement."
        />
      )
    case 'kraken':
      return (
        <AppGuide
          code={`import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories,
  series: [
    z.series({
      id: 'price',
      label: 'Price',
      values: prices,
      style: {
        color: '#7b61ff',
        fill: z.fill({ baseline: openingPrice, pattern: 'dots', spacing: 5, fadeTo: 0.15 }),
        strokeWidth: 2,
      },
    }),
  ],
  axis: { x: false, y: false },
  interaction: z.interaction.scrub({
    dimOpacity: 0.28,
    marker: z.marker.trail({ dot: true, glow: z.glow({ opacity: 0.3, radius: 10 }) }),
  }),
}))

export function PriceChart() {
  return <Chart.Line {...chart} />
}`}
          id="kraken"
          name="Kraken"
          summary="A crypto-price screen with a dotted fill, opening-price baseline, and trail selection."
          uses="Uses Line, a patterned series fill, rule and point annotations, and a trail marker."
        />
      )
    case 'family':
      return (
        <AppGuide
          code={`import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories,
  series: [
    z.series({
      id: 'price',
      label: 'Price',
      values: prices,
      style: { color: '#ff4d8d', fill: z.fill({ fadeTo: 0 }), strokeWidth: 2.4 },
    }),
  ],
  animation: z.animation({
    reveal: z.reveal.draw({ duration: 650, flashColor: '#ffffff', flashGlow: 1.8 }),
    transition: 'morph',
  }),
  annotations: [
    z.annotation.point({ id: 'live', x: categories.at(-1), y: prices.at(-1), pulse: true }),
  ],
  interaction: z.interaction.scrub({ marker: z.marker.segment({ dot: true, span: 2 }) }),
}))

export function PriceChart() {
  return <Chart.Line {...chart} />
}`}
          id="family"
          name="Family"
          summary="A token-detail screen with an animated placeholder, range changes, and a persistent reading chip."
          uses="Uses Line, a custom web skeleton, reveal animation, annotations, and custom tooltip placement."
        />
      )
    case 'health':
      return (
        <AppGuide
          code={`import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories: days,
  series: [
    z.series({ id: 'steps', label: 'Steps', values: steps, style: { color: '#ff3b30' } }),
  ],
  yAxis: z.axis.overlay({ grid: true, tickCount: 2 }),
  plot: z.plot({ padding: { top: 20 } }),
  interaction: z.interaction.scrub({
    range: true,
    rangeStyle: { color: '#ff3b30', dimOpacity: 0.3, dot: true },
  }),
  format: z.format({ locale: 'en-US' }),
}))

export function StepsChart() {
  return <Chart.Bar {...chart} />
}`}
          id="health"
          name="Health"
          summary="A steps screen with value labels, a minimal grid, and two-finger range totals."
          uses="Uses Bar, measured annotations, useChartScrub, and native range interaction."
        />
      )
    case 'stocks':
      return (
        <AppGuide
          code={`import { Chart, zyplot } from '@hzblj/zyplot'

const chart = zyplot(z => ({
  categories,
  series: [
    z.series({
      id: 'price',
      label: 'Price',
      values: prices,
      style: { color: isUp ? '#34c759' : '#ff3b30', fill: z.fill({ fadeTo: 0 }), strokeWidth: 2 },
    }),
  ],
  annotations: prices.map((value, index) =>
    z.annotation.measure({ id: 'grid-' + index, x: categories[index], y: value })
  ),
  interaction: z.interaction.scrub({
    range: true,
    rangeStyle: { color: '#34c759', downColor: '#ff3b30', dimOpacity: 0.32, dot: true },
  }),
  axis: { x: false, y: false },
}))

export function QuoteChart() {
  return <Chart.Line {...chart} />
}`}
          id="stocks"
          name="Stocks"
          summary="A quote sheet with a plot-aligned grid, date labels, volume tape, and a highlighted range."
          uses="Uses Line, Candlestick, useChartScrub geometry, measured annotations, and native range styling."
        />
      )

    case 'releases':
      return (
        <section className={styles.section()} id="releases">
          <p className={styles.kicker()}>Versions</p>
          <h2>Releases</h2>
          <p>Install the latest package from npm or open GitHub for tags, notes, and source changes.</p>
          <p>
            <a href="https://www.npmjs.com/package/@hzblj/zyplot">npm package</a> ·{' '}
            <a href={`${REPOSITORY_URL}/releases`}>GitHub releases</a>
          </p>
        </section>
      )

    case 'changelog':
      return (
        <section className={styles.section()} id="changelog">
          <p className={styles.kicker()}>Versions</p>
          <h2>Changelog</h2>
          <ChangelogList />
        </section>
      )

    default:
      return null
  }
}
