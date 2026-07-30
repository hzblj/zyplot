# Zyplot

> High-performance, natively rendered graphs for web, iOS, and Android, designed for developers and coding agents.

One npm package, one serializable props contract, four renderers: ECharts and uPlot in the
DOM, Swift Charts on iOS, and a Jetpack Compose `Canvas` on Android. There is no WebView on
native. Twenty-one chart forms exist on all three platforms, and each native platform adds
two of its own.

- Documentation: https://zyplot.janblazej.dev/docs
- Page index for models: https://zyplot.janblazej.dev/llms.txt
- Repository: https://github.com/hzblj/zyplot
- npm: `@hzblj/zyplot`

This file is the whole documentation in one place. It is maintained by hand alongside the
site, so it stays prose rather than a scrape.

## Installation

```bash
npm install @hzblj/zyplot
# or: yarn add @hzblj/zyplot · pnpm add @hzblj/zyplot · bun add @hzblj/zyplot
```

One package covers every platform. There is nothing else to add for iOS or Android — the
native modules ship inside it.

**No stylesheet import.** Zyplot includes its compiled styles through the JavaScript entry
point. Your application does not need Tailwind CSS.

For iOS and Android, autolinking picks the native code up; rebuild the native project after
adding it. These are native modules, so Expo Go cannot load them — use a development build.

```bash
yarn add @hzblj/zyplot

npx expo prebuild
npx expo run:ios
npx expo run:android
```

**iOS 17 and newer.** Swift Charts features used by the renderer require a deployment
target of 17.0. Set it with `expo-build-properties` if your app targets something lower.

### Entry points

A plain `@hzblj/zyplot` import resolves to the renderer the current target needs, and gives
you the chart forms that exist everywhere. The three subpaths name a platform outright, and
are how you reach forms only one renderer has.

| Entry | Target | What it is |
| --- | --- | --- |
| `@hzblj/zyplot` | any | Resolves per target: ECharts and uPlot on the web, the native module under React Native. Exposes the twenty-one shared forms. |
| `@hzblj/zyplot/web` | web | The DOM renderer, and the only entry with `Chart.Frame`, `Chart.Legend` and a `.Skeleton` on every form. |
| `@hzblj/zyplot/ios` | iOS | Shared forms plus `Chart.Range` and `Chart.Rule`, and the Swift Charts scrolling options on `xAxis`. |
| `@hzblj/zyplot/android` | Android | Shared forms plus `Chart.Lollipop` and `Chart.Waterfall`, and Compose label overflow on both axes. |

All four carry the builders and `useLastReading`, so a helper that assembles chart props is
not tied to a platform. `useChartScrub` is on all four too: a finger on the native entries,
a pointer on the web one, reported as the same phases.

### Quick start

```tsx
import { Chart } from '@hzblj/zyplot'

const series = [
  { id: 'revenue', label: 'Revenue', values: [42, 56, 51, 72] },
  { id: 'costs', label: 'Costs', values: [28, 34, 38, 41] },
]

export function Example() {
  return (
    <Chart.Line
      categories={['Jan', 'Feb', 'Mar', 'Apr']}
      format={{ prefix: '$' }}
      series={series}
    />
  )
}
```

## Data

Chart data is plain serializable objects — no formatter callbacks and no render props, which
is what lets a server component render a chart. Labels are already translated: this package
never resolves an i18n key.

**One contract, and every list is read-only.** These types live in the shared contract and
are re-exported by all four entry points, so a value typed once can be handed to a web chart
and a native one. Every prop that takes a list — `series`, `categories`, `data`, `nodes`,
`cells`, `groups`, `rows`, `values` — accepts a `readonly` array, so an `as const` value or a
`readonly`-returning selector needs no cast. The shapes below are written as plain arrays for
legibility.

### ChartSeries

Used by line, area, bar, stacked bar, radar and every other multi-series form. Each `values`
entry aligns with the category at the same index, so the array is as long as `categories`.

```ts
type ChartSeries = {
  /** Stable identity: the React key, and how hover correlates across charts. */
  id: string
  /** Already-translated display name, used by the legend and the tooltip. */
  label: string
  /** One value per category. null is a genuine gap, drawn as one, never as zero. */
  values: (number | null)[]
  /** Palette slot, 1-based. Pin it when the caller can hide series. */
  slot?: number
  /** Overrides the active palette for this series. */
  color?: string
}
```

An explicit `color` wins over the provider palette and the CSS variables. Omit `slot` and a
series takes its index — correct for a fixed list, wrong the moment the list can be
filtered, because the survivors get repainted and the reader has to re-learn the chart.

### ChartDatum

A labelled scalar — the shape part-to-whole and ranked forms consume: pie, funnel, gauge
segments, diverging bars.

```ts
type ChartDatum = {
  id: string
  label: string
  value: number
  slot?: number
  color?: string
}
```

### Axes and number formatting

`axis` is the on/off switch both cartesian axes share; `format` is one description of a
number, applied to axis ticks, tooltips and direct labels alike, so they can never disagree.

```ts
type ChartAxes = {
  x?: boolean
  y?: boolean
}

type ChartNumberFormat = {
  /** Fraction digits. Defaults to 0. */
  decimals?: number
  /** BCP 47 tag for grouping and decimal separators. Defaults to the runtime locale. */
  locale?: string
  /** Rendered before the number — a currency symbol, typically. */
  prefix?: string
  /** Rendered after the number — a unit or a percent sign. */
  suffix?: string
}
```

### ChartLegendItem

What `Chart.Legend` takes when you place identity yourself. The color is already resolved —
a swatch is a color, not a slot to look up.

```ts
type ChartLegendItem = {
  id: string
  label: string
  color: string
}
```

### Specialized chart data

Some forms take a shape-specific contract instead of `ChartSeries`, because their encoding
is not "one value per category".

```ts
/** Chart.Radar — one axis per row. Axes are scaled independently. */
type ChartRadarAxis = {
  label: string
  max: number
}

/** Chart.Heatmap — addressed by axis index; null renders empty, not as the ramp's low end. */
type ChartHeatmapCell = {
  columnIndex: number
  rowIndex: number
  value: number | null
}

/** Chart.Dumbbell — a before → after pair per row. */
type ChartDumbbellRow = {
  id: string
  label: string
  before: number
  after: number
}

/** Chart.Boxplot — the five-number summary, plus outliers you have already picked. */
type ChartBoxplotGroup = {
  id: string
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers?: number[]
}

/** Required, because "Q1" is not a word every reader of your product knows. */
type BoxplotLabels = {
  min: string
  q1: string
  median: string
  q3: string
  max: string
}

/** Chart.Sankey — nodes, and the weighted edges that address them by id. */
type ChartFlowNode = {
  id: string
  label: string
  slot?: number
  color?: string
}

type ChartFlowLink = {
  source: string
  target: string
  value: number
}

/** Chart.Treemap and Chart.Sunburst — leaves carry a value, parents sum their children. */
type ChartHierarchyNode = {
  id: string
  label: string
  value?: number
  children?: ChartHierarchyNode[]
  slot?: number
  color?: string
}

/** Chart.Scatter — an unordered two-measure space. size turns points into bubbles. */
type ChartScatterSeries = {
  id: string
  label: string
  points: Array<{
    x: number
    y: number
    size?: number
    label?: string
  }>
  slot?: number
  color?: string
}

/** Chart.TimeSeries — parallel arrays, because that is what uPlot consumes. */
type ChartTimePoints = {
  /** Unix seconds, strictly ascending. */
  timestamps: number[]
  /** One entry per series, each as long as timestamps. */
  values: (number | null)[][]
}
```

### Candlestick data

One entry per session. `volume` is what `showVolume` draws, and `timestamp` is only needed
when something outside the chart has to line up with the session.

```ts
type ChartCandlestickDatum = {
  id: string
  category: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
  /** Unix seconds. */
  timestamp?: number
}

type ChartCandlestickStyle = {
  upColor?: string
  downColor?: string
  neutralColor?: string
  /** Draws rising candles as outlines — the convention on most trading desks. */
  hollowUp?: boolean
  /** Corner radius on the candle body. Rounds the wick's caps with it. */
  candleRadius?: number
  /** Body width as a share of the slot a candle sits in. */
  candleWidth?: number
  wickWidth?: number
  volumeUpColor?: string
  volumeDownColor?: string
  /** Share of the plot height the volume histogram takes. */
  volumeHeightRatio?: number
}
```

### Axis options

`axis` switches an axis off; `xAxis` and `yAxis` describe one. Both are read by line, area,
bar, stacked bar and candlestick — the forms whose readers pin a domain, change the scale or
annotate a value. The other forms take the visibility switch only.

```ts
type ChartAxisOptions = {
  visible?: boolean
  label?: string
  /** "auto" | "category" | "linear" | "log" | "time" */
  scale?: ChartAxisScale
  domain?: ChartAxisDomain
  format?: ChartNumberFormat
  grid?: boolean
  gridDash?: number[]
  labelRotation?: number
  /** Which side the axis is drawn on: "start" | "end". */
  position?: ChartAxisPosition
  reversed?: boolean
  /** A hint, not a guarantee — the engine still picks readable ticks. */
  tickCount?: number
  /** Exact ticks, when the reader is looking for specific ones. */
  tickValues?: (number | string)[]
}

type ChartAxisDomain = {
  /** Pins the extent. Omit either end to keep it computed from the data. */
  min?: number
  max?: number
  /**
   * Headroom kept beyond the data, as a fraction of its extent — 0.08 leaves 8%
   * clear at each end. Applies only to an end that is computed, so it combines
   * with a single pinned one.
   */
  padding?: number
}
```

**Reach for `padding` before pinning a domain.** Without it a line runs into the top and
bottom of its own plot, which reads as clipped rather than as the highest and lowest
reading. A pinned `min`/`max` fixes that too, but it has to be recomputed every time the
data changes; a fraction does not.

### Annotations

A union discriminated on `type`. Coordinates are `number | string`: a category name on a
category axis, a value on a linear or time one.

```ts
type ChartAnnotation =
  | ChartLineAnnotation
  | ChartRangeAnnotation
  | ChartPointAnnotation
  | ChartTextAnnotation

/** A target, a threshold, a launch date. */
type ChartLineAnnotation = {
  type: 'line'
  id: string
  axis: 'x' | 'y'
  value: number | string
  label?: string
  color?: string
  /** Dash and gap lengths. Omit for a solid rule. */
  dash?: number[]
  /** Rule thickness. Default 1. */
  width?: number
}

/** A shaded span — a quarter, an incident window, a tolerance band. */
type ChartRangeAnnotation = {
  type: 'range'
  id: string
  axis: 'x' | 'y'
  start: number | string
  end: number | string
  label?: string
  color?: string
  opacity?: number
}

type ChartPointAnnotation = {
  type: 'point'
  id: string
  x: number | string
  y: number
  label?: string
  color?: string
  symbol?: ChartSymbol
}

type ChartTextAnnotation = {
  type: 'text'
  id: string
  text: string
  x?: number | string
  y?: number
  color?: string
}
```

### Interaction

`interaction` is what the chart does on its own; `onInteraction` is how your code hears
about it. The event is one flat serializable shape for every form, so a handler written for
a bar chart works on a line chart.

```ts
type ChartInteraction = {
  /** "axis" | "nearest" | "series" | "none" */
  hover?: ChartHoverMode
  /** "both" | "x" | "y" | "none" */
  crosshair?: ChartCrosshairMode
  tooltip?: boolean
  /** "single" | "multiple" | "none" */
  selection?: ChartSelectionMode
  pan?: boolean
  zoom?: boolean
  /** How far a hovered mark grows. */
  highlightScale?: number
  /** How far the rest fades while one mark is hovered. */
  dimOpacity?: number
  /** A colour the read mark is lifted towards, so it reads as lit rather than as undimmed. */
  highlightColor?: string
  /** How far towards it, 0–1. Below 1 the mark's own colour still reads. Default 1. */
  highlightBlend?: number
  /** Native only — the web has no honest equivalent. */
  haptics?: boolean
}

type ChartInteractionEvent = {
  seriesId?: string
  category?: string
  value?: number
  x?: number
  y?: number
  /** Unix seconds, on the time-based forms. */
  timestamp?: number
  /** Pointer position in the chart's own coordinate space. */
  nativeX?: number
  nativeY?: number
  /** Position of the read mark in the chart's own data order. */
  index?: number
  /** "began" | "changed" | "ended" | "layout" */
  phase?: ChartInteractionPhase
  /** Where the plot and its annotations sit, on the "layout" phase. */
  geometry?: ChartGeometry
}
```

**A handler is a client boundary.** Everything else on a chart is serializable data, so a
server component can render it — `onInteraction` is the one prop that cannot cross, and the
file that passes it needs `"use client"`.

### Plot, series style and animation

`surface` is the box the chart sits in; `plot` is the drawing area inside it. `seriesStyles`
is keyed by `ChartSeries.id`, so a style survives reordering and filtering the way `slot`
does for color.

**These are the floor, not the ceiling.** The `animation`, `seriesStyles`, `interaction`,
`annotations`, `xAxis` and `yAxis` props are all declared with the wider `Native*` shapes
described under "The presentation vocabulary" — on every entry point, the web one included.

```ts
type ChartPlotStyle = {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  /** Clips marks to the plot area — the honest choice when a domain is pinned. */
  clip?: boolean
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
}

type ChartSeriesStyle = {
  color?: string
  strokeWidth?: number
  strokeDash?: number[]
  fillOpacity?: number
  opacity?: number
  /** "circle" | "diamond" | "square" | "triangle" | "none" */
  symbol?: ChartSymbol
  symbolSize?: number
}

type ChartAnimation = {
  enabled?: boolean
  /** The entrance. Turn it off for a chart that re-renders on every keystroke. */
  initial?: boolean
  /** The transition when data changes under a mounted chart. */
  updates?: boolean
  duration?: number
  /** How long the entrance waits before it starts. */
  delay?: number
  /** "linear" | "ease-in" | "ease-out" | "ease-in-out" | "spring" */
  easing?: ChartAnimationEasing
}
```

## Theming

`Chart.Provider` scopes a palette to a subtree. It writes what you pass as `--zyplot-*`
custom properties on its own wrapper, and the charts inside read the resolved values back
off the DOM. A key you leave out keeps the stylesheet's value, including that value's dark
variant.

**A theme key holds in both modes.** The provider writes inline custom properties, which
outrank the stylesheet's light and dark rules alike — so a color passed here is the color in
both. When a palette has to change with the mode, set it in CSS instead.

```tsx
<Chart.Provider
  theme={{
    colors: {
      categorical: ['#7c3aed', '#0284c7', '#ea580c'],
      grid: '#e5e7eb',
    },
    typography: {
      fontFamily: 'Geist, sans-serif',
    },
  }}
>
  <Dashboard />
</Chart.Provider>
```

### The theme contract

Every key is optional and takes any color the browser can resolve. There is no `background`
here — the box a chart sits in is `surface`.

```ts
type ChartProviderTheme = {
  colors?: {
    /** Slots 1…7, in order. A series takes one by index or by its own slot. */
    categorical?: readonly string[]
    /** Low → high, five steps. Heatmap, treemap, sunburst. */
    sequential?: readonly string[]
    /** Signed scales: diverging bars, and any positive/negative encoding. */
    diverging?: {
      negative?: string
      negativeSoft?: string
      neutral?: string
      positive?: string
      positiveSoft?: string
    }
    /** The de-emphasis grey — every series that is context rather than subject. */
    muted?: string
    axis?: string
    grid?: string
    /** Axis and data labels. */
    label?: string
    negative?: string
    positive?: string
    /** Tooltip fill. */
    surface?: string
    /** Tooltip hairline. */
    border?: string
    /** The unfilled part of a gauge or a meter. */
    track?: string
  }
  typography?: {
    /** A resolved family name. A canvas cannot read var(--font-sans). */
    fontFamily?: string
  }
}
```

**The provider's shape is `ChartProviderTheme`.** It is the full palette, because the provider
writes CSS variables and the stylesheet has one for each of these. It is also a superset of
the `ChartTheme` a single chart takes, so one object can be passed to both.

**Seven and five.** Only the first seven `categorical` entries and the first five
`sequential` steps are ever read. An eighth series color is one no color-blind reader can
separate from a slot that already exists, so the eighth series is an "other" bucket, a small
multiple, or a second encoding through `texture` — not a longer palette.

### A theme on one chart

Every chart also takes a `theme` of its own, on all four entry points. This one is
`ChartTheme`, the portable subset: every key on it is a key each of the four renderers draws
with, so a theme written against it works unchanged on the web, on iOS and on Android.

**How it meets the provider's is not the same on both.** On the web the provider's keys are
CSS variables the chart has already resolved, so a chart's own `theme` lands over them key by
key — one colour here does not drop the rest. On native there are no variables to resolve
against: a chart that passes a `theme` replaces the provider's outright, so restate the keys
you still want, or leave the theme to the provider and style the chart with `seriesStyles` and
`surface` instead. `surface` does merge key by key on both.

```ts
import type { ChartTheme } from '@hzblj/zyplot'

type ChartTheme = {
  colors?: ChartThemeColors
  typography?: ChartTypography
}

type ChartThemeColors = {
  axis?: string
  /** Series colours, in the order series take them. */
  categorical?: readonly string[]
  grid?: string
  label?: string
  /** The negative half of a signed scale: a losing bar, a falling candle. */
  negative?: string
  positive?: string
  /** Tooltip fill. */
  surface?: string
  /** The unfilled part of a gauge or a meter. */
  track?: string
}

/** The one colour only a native chart paints for itself. */
type NativeChartTheme = {
  colors?: ChartThemeColors & { background?: string }
  typography?: ChartTypography
}
```

The two wider shapes build on that subset rather than beside it. `ChartProviderTheme` adds the
palettes and greys only a CSS variable can carry; `NativeChartTheme`, which the native charts
and the native provider take, adds the chart's own `background`. Both are supersets, so one
`ChartTheme` value satisfies all three props.

**A chart background is a surface, not a theme, on the web.** There is no
`--zyplot-color-background`: in the DOM the box a chart sits on is `surface.background`, which
exists on native too. Reach for that when one object has to dress a chart on every platform.

**`typography.fontFamily` takes a resolved family name.** Each platform looks it up the way
its own text does: the DOM through `--zyplot-font-family`, iOS through the registered-font
lookup behind `UIFont(name:)`, Android through React Native's font manager — which covers
`assets/fonts`, `res/font` and anything `expo-font` loaded at runtime. A family that works in a
`<Text>` works in a chart; one the app never shipped falls back to the platform font on all
three.

### The chart surface

`theme` answers "what colour is this series"; `surface` answers "what does the container
look like". A chart's own `surface` merges over the provider's key by key.

```tsx
<Chart.Provider surface={{ background: '#fff', cornerRadius: 16, padding: 12 }}>
  <Chart.Line categories={categories} series={series} />
  <Chart.Bar surface={{ cornerRadius: 24 }} categories={categories} series={series} />
</Chart.Provider>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `background` | `string` | — | Fill behind the plot. Any CSS or hex colour. |
| `border` | `{ color?: string; width?: number }` | — | Outline around the container. |
| `cornerRadius` | `number` | `0` | Corner rounding, in px on web and points on native. |
| `padding` | `number \| ChartSurfacePadding` | — | A number applies to all four sides; the object form takes horizontal, vertical and the individual sides, most specific winning. |

**The same four keys everywhere.** Only properties that mean the same thing to a `div`, a
SwiftUI view and a Compose `Canvas` live here.

### Provider props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` * | `ReactNode` | — | Charts rendered inside the scope. |
| `theme` | `ChartProviderTheme` | — | Scoped color and typography overrides. A superset of a chart's own `ChartTheme`. |
| `surface` | `ChartSurface` | — | Container treatment every chart in the subtree inherits, merged key by key with the chart's own. |
| `colorMode` | `"inherit" \| "light" \| "dark" \| "system"` | `"inherit"` | How the light/dark palette is resolved for the subtree. |
| `className` | `string` | — | CSS class on the wrapper element the provider renders. |

**The provider renders an element.** The custom properties have to land somewhere, so the
scope is a real `div` in your layout rather than context alone.

## Light and dark mode

Both palettes ship in the stylesheet. The dark one is keyed off `.dark` or
`data-theme="dark"` on the document root — the two conventions Tailwind and next-themes
already write — and a root that pins neither falls back to `prefers-color-scheme`. A project
doing either needs no chart-specific wiring.

### Resolution

`Chart.Provider` pins a subtree instead. Its `colorMode` lands as `data-zyplot-color-mode`
on the wrapper, and the stylesheet resolves the palette from there.

| Value | Resolves from | Description |
| --- | --- | --- |
| `"inherit"` (default) | document root | Takes whatever the document root resolved to, including the OS fallback. Charts outside a provider behave this way too. |
| `"light"` | pinned | The light palette regardless of the root, plus `color-scheme: light`. |
| `"dark"` | pinned | The dark palette regardless of the root, plus `color-scheme: dark`. |
| `"system"` | media query | Follows the OS through `prefers-color-scheme`, ignoring the document root. |

On native, `colorMode` is per chart: there is no cascade to inherit through, so
`Chart.Provider` scopes `surface` and `theme` but not the color mode. Its default there is
`"system"`.

**Switching repaints in place.** Because canvas colors are read off the DOM, every mounted
chart watches `class`, `data-theme`, `data-zyplot-color-mode` and `style` on the root — plus
the `prefers-color-scheme` query — and repaints from the new values. No remount.

### The CSS contract

These names are the public API; the Tailwind tokens behind them are not. The values below
are the light defaults, and every color among them has a dark counterpart in the stylesheet.

```css
:root {
  /* Categorical: slots 1…7, in the order series take them. */
  --zyplot-color-categorical-1: #4400fc;
  --zyplot-color-categorical-2: #0092de;
  --zyplot-color-categorical-3: #ff5700;
  --zyplot-color-categorical-4: #9c74ff;
  --zyplot-color-categorical-5: #00a546;
  --zyplot-color-categorical-6: #006fac;
  --zyplot-color-categorical-7: #ff133c;

  /* Sequential: low → high. Heatmap, treemap, sunburst. */
  --zyplot-color-sequential-1: #b89bff;
  --zyplot-color-sequential-2: #9c74ff;
  --zyplot-color-sequential-3: #7135ff;
  --zyplot-color-sequential-4: #4400fc;
  --zyplot-color-sequential-5: #2f00ae;

  /* Diverging: signed scales. */
  --zyplot-color-diverging-negative: #d23100;
  --zyplot-color-diverging-negative-soft: #ff7d4f;
  --zyplot-color-diverging-neutral: #d9d9d9;
  --zyplot-color-diverging-positive-soft: #59c4fd;
  --zyplot-color-diverging-positive: #006fac;

  /* Chrome. */
  --zyplot-color-axis: #a6a6a6;
  --zyplot-color-grid: #f5f5f5;
  --zyplot-color-label: #666666;
  --zyplot-color-muted: #808080;
  --zyplot-color-surface: #fcfcfc;
  --zyplot-color-border: #f5f5f5;
  --zyplot-color-track: #ebebeb;

  --zyplot-font-family: inherit;
}

/* Only the keys you actually change need restating per mode. */
[data-theme='dark'] {
  --zyplot-color-categorical-1: #7135ff;
  --zyplot-color-grid: #212121;
}
```

The font is inherited from the page. Set `--zyplot-font-family` only when charts should use
a different stack, and give it a resolved family name — a canvas cannot read another
variable.

**A page with no font of its own gets a system stack.** Inheritance is the mechanism, so when
nothing up the tree declares a font the browser answers with its own serif, and a chart has no
business painting Times beside text that is not. Zyplot compares what it inherited against
that untouched default and falls back to `system-ui` and the platform stack behind it. React
Native Web is the case this exists for: its reset puts no font on the document and styles each
`<Text>` on its own, so a chart has nothing to inherit however deeply it looks.

**Wide-gamut values are safe.** On a P3 display these resolve to `color(display-p3 …)`,
which ECharts' own parser rejects. Every color is normalized to sRGB on the way to the
canvas.

## Builders

Every prop is a plain object, and writing one by hand stays supported. The builders exist
for the handful of shapes where hand-writing is genuinely error-prone: a union you have to
remember the discriminant for, a record whose key repeats an id declared elsewhere, a type
that permits two fields only one variant reads. They return the same plain objects, so they
compose, spread and serialize.

```ts
import {
  // Builders with variants, one function per variant.
  annotation,
  axis,
  marker,
  reveal,
  // A series and its styling, declared together.
  series,
  seriesProps,
  // Typed passthroughs for the groups with nothing to get wrong.
  animation,
  format,
  glow,
  halo,
  interaction,
  plot,
  seriesStyle,
  surface,
  theme,
} from '@hzblj/zyplot'
```

They are on every entry point, and every renderer draws what they describe: `glow`, `halo`,
`badge`, `pulse` and `scrubOpacity` all land in the DOM as well as on a native canvas. That
includes the `axis` builders — `NativeChartAxisOptions` is what `xAxis` and `yAxis` take
everywhere, so an overlaid axis works on a web chart too.

### series and seriesProps

`seriesStyles` is a record keyed by `ChartSeries.id`, which means styling a series normally
spells its id twice, with nothing checking the two agree. A typo does not fail: it silently
drops the styling. `series` declares both in one place and `seriesProps` splits the list
into the two props the chart takes.

```tsx
const lines = useMemo(
  () =>
    seriesProps([
      series({
        color: '#ff3b4a',
        id: 'price',
        label: 'Price',
        style: { glow: glow({ opacity: 0.16, radius: 7 }), strokeWidth: 2.3 },
        values: range.values,
      }),
    ]),
  [range]
)

<Chart.Line {...lines} categories={range.categories} />
```

**Hold the result across renders.** `seriesProps` rebuilds both props on every call, and a
chart whose props change identity re-serializes its whole dataset — over the bridge, on
native. Wrap it in `useMemo` keyed on the data.

### annotation

| Builder | Returns | Description |
| --- | --- | --- |
| `annotation.line` | `NativeChartLineAnnotation` | A reference line: a target, a threshold, a launch date. Takes `axis` and `value`, plus `dash` and `width`. |
| `annotation.range` | `ChartRangeAnnotation` | A shaded span. Takes `start` and `end`. |
| `annotation.point` | `NativeChartPointAnnotation` | A single marked point, placed by coordinate. Takes `x` and `y`. |
| `annotation.text` | `ChartTextAnnotation` | Free text on the plot. Omit `x` and `y` and the renderer places it. |

```tsx
const baseline = (value: number, label: string) =>
  annotation.line({
    axis: 'y',
    dash: [1, 4],
    id: 'baseline',
    label,
    labelBackground: '#000000',
    labelPosition: 'auto',
    scrubOpacity: 0,
    value,
    width: 1.5,
  })

const marketOpen = (category: string) =>
  annotation.line({ axis: 'x', badge: '↑', dash: [2, 4], id: 'open', size: 18, value: category })
```

### axis

One builder per axis position. `start` and `end` put the labels in a gutter on that side;
`overlay` puts them inside the plot against its trailing edge and reserves no gutter, which
keeps the full width for the marks. `labelInset` is `overlay`'s alone.

| Builder | Description |
| --- | --- |
| `axis.start` | Labels in a gutter on the leading side — the left of a y axis, the bottom of an x axis. |
| `axis.end` | Labels in a gutter on the trailing side. |
| `axis.overlay` | Labels inside the plot, no gutter reserved. The only position that takes `labelInset`. |

```tsx
const priceAxis = (domain: { max: number; min: number }) =>
  axis.overlay({
    domain,
    format: { decimals: 2 },
    grid: false,
    labelInset: 22,
    labelSize: 13,
    ticks: false,
    tickValues: [domain.min, domain.max],
  })
```

**They describe the wider axis, and it is not native-only.** What these return is a
`NativeChartAxisOptions`, which is what `xAxis` and `yAxis` take on every entry point — so
the overlaid position, `labelInset`, `labelSize` and `ticks` all work on a web chart too.
Plain `ChartAxisOptions` objects stay valid everywhere, because the wider type is a superset.

### reveal

The first-render entrance, passed as `animation.reveal`. Only a traced entrance has a
frontier to light, so `flashColor`, `trackColor` and `startOpacity` are `draw`'s alone.

| Builder | Description |
| --- | --- |
| `reveal.draw` | Traces the marks along the x axis. Takes the flash, track and easing fields. Forms with no direction fall back to a fade. |
| `reveal.fade` | Fades the marks in. Takes duration and easing only. |
| `reveal.none` | No entrance. Takes nothing. |

```tsx
const arrival = animation({
  reveal: reveal.draw({
    duration: 420,
    flashColor: '#ffe3e8',
    flashDuration: 480,
    flashEasing: 'ease-in-out',
    flashHold: 220,
    trackColor: '#8a8a8a',
    trackOpacity: 0.4,
  }),
  updates: false,
})
```

### marker

How the mark under the finger is picked out, passed as `interaction.marker`. `span` is how
far a segment reaches along the line and means nothing to a dot; `size` is a dot's diameter
and means nothing to a segment.

| Builder | Description |
| --- | --- |
| `marker.point` | A dot on the mark. Takes `size`; rejects `span`. |
| `marker.segment` | Brightens the stretch of line around the mark and blooms behind it. Takes `span`; rejects `size`. |

```tsx
const scrubbing = interaction({
  crosshair: 'x',
  crosshairStyle: { color: '#ffffff', width: 1 },
  dimOpacity: 0.38,
  haptics: true,
  hover: 'nearest',
  marker: marker.segment({
    color: '#ffffff',
    glow: glow({ color: '#ff3b4a', opacity: 0.32, radius: 42 }),
    span: 2,
  }),
})
```

**A marker is not a tooltip.** It says only which mark is being read, never what it says —
so use it when the value is shown outside the plot, and pair it with `useChartScrub`.

### The passthroughs

Identity functions for the option groups with no variants to get wrong. What they add is a
name to import and hold, so a preset can be declared away from the chart that consumes it.

```ts
// chart-style.ts — declared once, imported by both the line and the candlestick chart.
export const chartTheme = theme({ colors: { label: '#8a8a8a' } })
export const priceFormat = format({ decimals: 2, locale: 'en-US' })
export const card = surface({ background: '#0b0b0b', cornerRadius: 16, padding: 12 })
export const priceLine = seriesStyle({ glow: glow({ opacity: 0.16, radius: 7 }), strokeWidth: 2.3 })
```

`animation`, `interaction`, `seriesStyle`, `plot`, `surface`, `theme` and `format` all take
their own option group. `glow` is a bloom behind a mark, in the mark's own colour unless told
otherwise; `halo` is a hard disc behind a point, so a small bright dot can sit in a larger
ring. Both are drawn on every platform.

**There is no builder for a pulse.** It is the one nested object that also takes a `boolean`:
`pulse: true` is the whole of what most live points want, and `annotation.point` already types
the object form for the ones that tune the rhythm.

## The web renderer

`@hzblj/zyplot/web` draws in the DOM. A plain `@hzblj/zyplot` import already resolves here on
every target except React Native. It is the only entry point that carries `Chart.Frame`,
`Chart.Legend` and a `.Skeleton` on every form. `Chart.Provider` exists on every entry point,
but only here does it take `colorMode` and a `className`.

### What draws what

Component names are the form, not the engine. `Chart.Line` and `Chart.TimeSeries` both draw
a line — you pick between them on point count, never on renderer.

| Engine | Kind | Covers |
| --- | --- | --- |
| ECharts | canvas | Eighteen of the twenty-one forms, Line through Treemap. Series types are registered per chart file, so a page with one line chart does not ship the sankey, sunburst and boxplot code. |
| uPlot | canvas | `Chart.TimeSeries` and `Chart.Sparkline`. Tens of thousands of points, or forty sparklines in a table. |
| Plain DOM | no engine | `Chart.Meter` is a filled track — two elements, `role="meter"` and no engine, so it is the only form whose final markup is painted on the server instead of after a first read off the document. |

### Text stays in the DOM

Only marks and axis ticks are painted into the canvas. The legend is React: every chart with
two or more series renders one on its own, a single series never does, and the labels stay
selectable, translatable and reachable by a screen reader.

### Server components

Chart props stay serializable — no formatter callbacks, no render props — so a server
component can render a chart without a client boundary of its own. Anything that would have
been a callback is expressed as data instead, which is what `ChartNumberFormat` is for.

**Colors are read off the document.** A canvas takes color as a string, so each chart reads
the resolved `--zyplot-*` values from the DOM after mounting and repaints when they change.
Until that first read there is nothing honest to paint, so a chart shows its skeleton for a
frame even with `isLoading` false.

## Frame and legend

`Chart.Frame` is the card a chart can sit in: a title, a description, one row for filters,
and a caption underneath for the source or the caveat. Web only.

```tsx
<Chart.Frame
  title="Revenue"
  description="Monthly recurring revenue"
  caption="Source: billing ledger"
>
  <Chart.Line categories={categories} series={series} />
</Chart.Frame>
```

The header only exists when at least one of `title`, `description` and `actions` is set.

**Frame is not `surface`.** The frame is a card with type in it, rendered around the chart;
`surface` is the box the plot itself is painted on, and it exists on native too.

| Frame prop | Type | Description |
| --- | --- | --- |
| `children` * | `ReactNode` | Chart or composed visualization content. |
| `title` | `string` | Heading rendered above the chart. |
| `description` | `string` | Supporting text below the title. |
| `actions` | `ReactNode` | Filters and controls aligned with the heading. |
| `caption` | `string` | Source, method or caveat below the chart. |

A chart renders its own legend from two series up, and none for a single one, so
`Chart.Legend` is for the surface that places identity itself — one legend above a row of
small multiples, or a legend that doubles as a series filter. It takes `items`
(`ChartLegendItem[]`, required) and `className`.

## iOS and Android

Zyplot ships an Expo module that draws with the platform's own graphics stack — Swift Charts
on iOS, Jetpack Compose `Canvas` on Android — behind the same `Chart` namespace the web
renderer exposes. There is no WebView.

### Platform-specific files

A few forms exist on one platform only, because the underlying renderer has a mark the other
has no honest equivalent for. They are not on the shared namespace. Instead, give the
component one file per platform and let Metro choose.

```text
forecast.ios.tsx      imports @hzblj/zyplot/ios
forecast.android.tsx  imports @hzblj/zyplot/android
forecast.tsx          optional web or fallback version
```

```tsx
// forecast.ios.tsx
import { Chart } from '@hzblj/zyplot/ios'

export const Forecast = ({ bands }: ForecastProps) => (
  <Chart.Range data={bands} height={300} />
)
```

**Keep a base file for TypeScript.** `tsc` does not know about platform extensions, so
`./forecast` needs a plain `forecast.tsx` to resolve to. It doubles as the web version, or
returns `null` if the component is native-only.

### Chart coverage

| Group | Platforms | Forms |
| --- | --- | --- |
| Cartesian | web · iOS · Android | Line, Area, Bar, StackedBar, TimeSeries, Sparkline, Scatter, Histogram |
| Radial and flow | web · iOS · Android | Pie, Gauge, Meter, Radar, Sunburst, Treemap, Funnel, Sankey |
| Statistical and finance | web · iOS · Android | Candlestick, Boxplot, DivergingBar, Dumbbell, Heatmap |
| iOS extensions | iOS only | `Chart.Range`, `Chart.Rule` |
| Android extensions | Android only | `Chart.Waterfall`, `Chart.Lollipop` |

Most forms take exactly the props documented under Charts. Eleven differ, and the compiler says
so — these are separate prop types, not one type with fields the native renderer drops.

| Form | On native | Note |
| --- | --- | --- |
| `Chart.Funnel` | `stages` → `data` | Same `ChartDatum[]`, same order. |
| `Chart.Sunburst` · `Chart.Treemap` | `nodes` → `data` | The hierarchy is `data` on both forms natively. |
| `Chart.Pie` | `innerRadius` | Instead of the web `isSolid`, `maxSlices` and `otherLabel`. Fold the tail yourself before passing the data. |
| `Chart.Gauge` | adds `label`, `max` optional | `max` defaults to 100 there. |
| `Chart.Meter` | takes the gauge props | `value`, `max`, `min`, `label` — so no `showValue`, and `label` is optional. |
| `Chart.Dumbbell` | no `beforeLabel` / `afterLabel` | Label the two ends in your own view. |
| `Chart.Histogram` | no `valueFormat` | Use `format`, which is on every native chart. |
| `Chart.DivergingBar` | no `orientation` | Bars always run horizontally. |
| `Chart.Sparkline` | no `slot` | Takes an explicit `color` instead of a palette slot. |
| `Chart.Candlestick` | adds `labels` | Your five words for the readings; the tooltip then lists all of them. |

### The presentation vocabulary

Five of the option groups take a wider shape than the plain contract: `seriesStyles`,
`animation`, `interaction`, `annotations` and the two axes. The wider shapes are the `Native*`
types, they are supersets, and they are what *every* renderer takes — the web one included. A
glow, a traced entrance, a selection marker and a pulsing point are all drawn in the DOM too.

| Prop | Type | What it adds |
| --- | --- | --- |
| `seriesStyles` | `NativeChartSeriesStyle` | `glow` — a bloom behind the stroke, in the series colour unless told otherwise. |
| `animation` | `NativeChartAnimation` | `reveal`, the first-render entrance, and `transition`, how marks move when data changes. |
| `interaction` | `NativeChartInteraction` | `crosshairStyle` and `marker` — how the reading under the finger is picked out. |
| `annotations` | `NativeChartAnnotation[]` | `badge`, `glow`, `halo`, `pulse`, `hidden`, `labelBackground`, `labelPosition` and `scrubOpacity`. |
| `xAxis` · `yAxis` | `NativeChartAxisOptions` | The `overlay` position, `labelInset`, `labelSize`, `ticks` and the two plot-dimension paddings. |

**The names are historical.** The vocabulary was built for the platform graphics stacks and
landed on the web renderer afterwards, so the types still read `Native*`. Four fields are still
native alone: `interaction.haptics`, which the web has no honest equivalent for,
`style.candleRadius`, which the web candlestick engine cannot round, and `style.neutralColor`
and `style.volumeHeightRatio` — the web candlestick colours a flat session as a rising one and
gives the volume histogram a fixed share of the plot.

**A decorated point is drawn by the layer that reads the pointer.** So `glow`, `halo`, `pulse`,
`badge` and `size` on an annotation land on `Chart.Line` and `Chart.Candlestick` on every
platform, and on the rest of the cartesian forms on iOS and Android. On a web `Chart.Area`,
`Chart.Bar` or `Chart.StackedBar` a point annotation is a plain mark and a rule carries no
badge — the rules, ranges, labels and `labelBackground` those forms do draw are the engine's
own, and `annotationViews` works on all five, so your own node is the way to put a head on a
mark there.

```ts
type ChartGlow = {
  /** Defaults to the mark's own colour. */
  color?: string
  opacity?: number
  radius?: number
}

/** A hard disc behind a point. Unlike a glow it has an edge. */
type ChartHalo = {
  color?: string
  opacity?: number
  size?: number
}

type ChartPulse = {
  /** Defaults to the glow's colour, then to the point's own. */
  color?: string
  /** One bloom, in ms. Default 450. */
  duration?: number
  /** The rest between blooms, in ms. Default 1550. */
  interval?: number
  /** How opaque the ring starts, before fading out over the bloom. Default 0.9. */
  opacity?: number
  /** How far it blooms, as a multiple of the point's resting ring. Default 2.2. */
  scale?: number
}

type ChartRevealAnimation = {
  /** "draw" | "fade" | "none" */
  style?: ChartRevealStyle
  duration?: number
  /** "ease-in" | "ease-in-out" | "ease-out" | "linear". Defaults to "linear" for a trace. */
  easing?: ChartRevealEasing
  /** A brief brightening as the trace lands. "draw" only. */
  flashColor?: string
  flashDuration?: number
  /** The curve the flash decays along once it has held. Defaults to "ease-out". */
  flashEasing?: ChartRevealEasing
  /** How far the glow blooms at the peak, as a multiple of its resting radius. */
  flashGlow?: number
  /** How long the flash holds at full strength before decaying. */
  flashHold?: number
  flashOpacity?: number
  /** How dim the stroke starts while being traced, as a fraction of its final opacity. */
  startOpacity?: number
  /** Draws the whole path in this colour under the trace, so the shape reads from frame one. */
  trackColor?: string
  trackOpacity?: number
}

/** How marks move when the data changes under a mounted chart. */
type ChartTransition = 'crossfade' | 'morph'
```

**`crossfade` is the honest one when the axis changed.** `morph` interpolates between the two
datasets, which reads as the data moving. If the categories underneath are not the same
categories, nothing moved — dissolve instead.

### Scrubbing

Three fields carry a scrub: `index`, the mark's position in the data you passed, `phase`,
where the gesture is in its lifetime, and `geometry`. One phase is not a gesture at all:
`'layout'` fires once the chart has measured itself and carries the geometry, which is what
you position your own views over the plot with. All three are reported on the web too, from
the pointer — `NativeChartInteractionEvent` is an alias of `ChartInteractionEvent`, kept as a
name because that is what the native props are declared with.

Every coordinate in an event — `geometry` and the pointer's `nativeX`/`nativeY` — is in the
unit the platform lays views out in: points on iOS, dp on Android, px on the web. So a view
positioned from one lands where the chart drew, with no density arithmetic in between.

```ts
type ChartInteractionPhase = 'began' | 'changed' | 'ended' | 'layout'

type ChartInteractionEvent = {
  /** Position of the selected mark in the chart's own data order. */
  index?: number
  phase?: ChartInteractionPhase
  /** Where the plot and its annotations sit, on the "layout" phase. */
  geometry?: ChartGeometry
  // … plus category, value, seriesId and the pointer position
}

type ChartGeometry = {
  annotations: readonly { id: string; x: number; y: number }[]
  plot: { height: number; width: number; x: number; y: number }
}

/** How the mark under the finger is picked out. */
type ChartSelectionMarker = {
  /** "point" | "segment" */
  style?: ChartMarkerStyle
  color?: string
  glow?: ChartGlow
  /** A dot's diameter. "point" only. */
  size?: number
  /** How many data steps either side of the touch a segment covers. "segment" only. */
  span?: number
}

type ChartCrosshairStyle = {
  color?: string
  dash?: number[]
  width?: number
}
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `marker.style` | `"point" \| "segment"` | `"point"` | A dot on the mark, or a lit stretch of the line around it. |
| `marker.size` | `number` | `9` | Dot diameter, in points. |
| `marker.span` | `number` | `2` | Data steps either side of the touch. |
| `glow.opacity` | `number` | `0.55` | Glow opacity at rest. |
| `glow.radius` | `number` | `6` | Glow radius, in points. |
| `halo.size` | `number` | `12` | Halo diameter, in points. |
| `crosshairStyle.width` | `number` | `1` | Crosshair line width. |
| `annotation.pulse` | `boolean \| ChartPulse` | `false` | A ring blooming out of a point annotation and resting before it does it again. `true` takes 450 ms out, 1550 ms at rest, 2.2× the point's ring. |
| `annotation.labelBackground` | `string` | — | Painted behind an annotation's label, so its value stays legible where the marks run through it. |
| `annotation.labelPosition` | `"auto" \| "bottom" \| "leading" \| "top" \| "trailing"` | — | Which side of the rule its label sits on. `"auto"` keeps it inside the plot: above a rule sitting low, below one sitting high. Omit it and each renderer keeps its own default side, so name one when the three have to agree. |
| `annotation.scrubOpacity` | `number` | `1` | What an annotation fades to while a point is being read. Set `0` to hide it entirely. |
| `annotation.badge` | `string` | — | A single glyph in a filled circle capping a rule at the plot edge; the rule starts below it. Leave it off and the chart draws only the rule. |
| `annotation.size` | `number` | — | A point annotation's dot diameter, or a badge circle's. Each renderer rests at a slightly different dot size, so name it when the three have to agree; a badge takes it on iOS and the web, and Android draws a fixed one. |
| `annotation.hidden` | `boolean` | `false` | Measured and reported in `geometry` as usual, but drawn by nobody — for an annotation that is only an anchor for a view of your own. |
| `annotationViews` | `Record<string, ReactNode>` | — | Your own node where an annotation lands, keyed by its `id`. The chart centres it on the spot and leaves out the mark it would have drawn there. |
| `interaction.highlightColor` | `string` | — | A colour the mark under the finger is lifted towards. |
| `interaction.highlightBlend` | `number` | `1` | How far towards it. Below 1 the mark's own colour still reads through the lift. |
| `style.candleRadius` | `number` | `0` | Corner radius on a candle body. Rounds the wick's caps with it. |

### Native axis options

`xAxis` and `yAxis` take everything `ChartAxisOptions` defines, plus these — on every entry
point, the web one included.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `"start" \| "end" \| "overlay"` | `"start"` | `overlay` puts the labels inside the plot against its trailing edge and reserves no gutter. Build it with `axis.overlay`. |
| `labelInset` | `number` | `2` | How far an overlaid label sits from the plot's trailing edge. Only read when `position` is `overlay`. |
| `labelSize` | `number` | `11` | Point size of the tick labels. |
| `ticks` | `boolean` | `true` | Draws the short marks beside each label. Independent of `grid`, and coloured by `theme.colors.axis` — the only thing any renderer draws with it, since none of them draws a domain line. |
| `plotDimensionStartPadding` | `number` | `0` | Free space, in points, kept before the first mark. |
| `plotDimensionEndPadding` | `number` | `0` | Free space, in points, kept after the last mark. |

### Differences from web

| Prop | Where | Note |
| --- | --- | --- |
| `className` | web only | Native charts have no DOM node to style. Use `height` and `plot` instead. |
| `texture` | web only | Pattern fills answer forced-colors and print, which a native chart never meets. Not part of the native props — the compiler rejects it. |
| `skeleton` | web only | Both native renderers draw a shimmering placeholder matched to the form — a ring, a column row or a curve — but there is no slot to put your own in, and no `.Skeleton` component to mount on its own. |
| `annotationViews` | wider on native | On every native form's props, and it lands on the ones that anchor an annotation to a plot — the cartesian forms. On the web it is `Chart.Line`, `Chart.Area`, `Chart.Bar`, `Chart.StackedBar` and `Chart.Candlestick`, the forms that report where their annotations landed. |
| `colorMode` | native chart · web provider | Per chart on native, defaulting to `"system"`: there is no cascade to inherit through. On the web `Chart.Provider` takes it, and it has an `"inherit"` the native prop does not. |
| `accessibilityLabel` | native only | The accessibility name of the chart view, since there is no DOM node to label. |
| `format` | every native form | On the base props natively. On the web only the forms that write numbers take it, and a few take a second one — `valueFormat` on the histogram, `xFormat`/`yFormat` on the scatter. |
| `height` | different default | 320 points on native, 240 px on the web — and 200 for the gauge, 300 for the sankey, 32 for the sparkline. |
| `labels` | wider on native | Boxplot terminology is honoured natively too. `Chart.Candlestick` takes `labels` only here — pass your five words and the tooltip lists every reading instead of just the close. |
| `interaction.haptics` | native only | The web has no honest equivalent. |
| `style.candleRadius` | native only | The web candlestick engine cannot round a candle body. |
| `style.neutralColor` | native only | The web candlestick colours a session that closed where it opened as a rising one. |
| `style.volumeHeightRatio` | native only | The web volume histogram takes a fixed share of the plot height. |

Nothing else in the presentation vocabulary is platform-specific: `glow`, `reveal`, `marker`,
`badge`, `pulse`, `halo`, `annotationViews` and the overlaid axis all render in the DOM as
well. Eleven forms do take different data props, though — see the table under "Chart coverage".

```ts
type ChartCandlestickLabels = {
  open: string
  high: string
  low: string
  close: string
  change: string
}
```

### iOS

`@hzblj/zyplot/ios` renders with SwiftUI and Swift Charts. Chart configuration crosses the
bridge as JSON and is decoded into native models, so every prop stays serializable. Importing
it commits a file to iOS, so name that file `*.ios.tsx`.

```tsx
// price.ios.tsx
import { Chart } from '@hzblj/zyplot/ios'

export function Price() {
  return (
    <Chart.Candlestick
      data={candles}
      format={{ prefix: '$' }}
      onInteraction={(event) => console.log(event.category, event.value)}
      showVolume
    />
  )
}
```

iOS-only forms — two marks Swift Charts has that neither other renderer does:

- `Chart.Range` (`ChartRangePropsIos`) — shaded band between a low and a high per category:
  forecast ranges, confidence intervals.
- `Chart.Rule` (`ChartRulePropsIos`) — reference rules at a value, optionally spanning a
  start and end.

iOS axis extras, on the x axis alone:

- `xAxis.visibleDomain` (`number`) — length of the visible x domain. Setting it makes the
  plot horizontally scrollable.
- `xAxis.scrollPosition` (`number | string`) — initial scroll offset along the x axis.

### Android

`@hzblj/zyplot/android` draws on a Jetpack Compose `Canvas`. Marks, axis text, grid,
annotations and the tooltip are all drawn by the module, so a chart is one view rather than a
tree of them. Importing it commits a file to Android, so name that file `*.android.tsx`.

```tsx
// spend.android.tsx
import { Chart } from '@hzblj/zyplot/android'

export function Spend() {
  return (
    <Chart.Waterfall
      data={movements}
      format={{ prefix: '$', decimals: 0 }}
      interaction={{ haptics: true, tooltip: true }}
    />
  )
}
```

Android-only forms:

- `Chart.Waterfall` (`ChartWaterfallPropsAndroid`) — running total across signed movements,
  colored by direction.
- `Chart.Lollipop` (`ChartLollipopPropsAndroid`) — a stem and a dot per category: a bar chart
  with the ink of a dot plot.

Android axis extras — overflow handling for long tick labels, the one control Compose needs
that Swift Charts resolves on its own:

- `xAxis.labelOverflow` (`"clip" | "ellipsis" | "visible"`, default `"ellipsis"`) — how a tick
  label that exceeds its band is cut.
- `yAxis.labelOverflow` (`"clip" | "ellipsis" | "visible"`, default `"ellipsis"`) — how a tick
  label that exceeds the gutter is cut.

## Hooks

### useChartScrub

Tracks which datum is being read, for a readout that lives outside the plot. The same hook on
all three platforms: a finger on iOS and Android, a pointer on the web. The selection returns
to `null` when the finger lifts or the pointer leaves the plot, which is the signal a readout
needs to go back to its resting value.

**A scrub is a continuous reading, so not every form has one.** On the web it is `Chart.Line`
and `Chart.Candlestick` that turn the pointer into one; the other forms report the mark the
pointer landed on instead, which carries no `index` and so leaves the selection alone. On
native a finger is read by its position along the category axis, so the forms that have one —
the line, area, bar and candlestick families — are the forms a scrub means something on. The
radial and flow ones have no ordered axis to walk, and nothing usable comes back from them.

```tsx
'use client'

import { Chart, marker, useChartScrub } from '@hzblj/zyplot'

export const Price = ({ prices, categories }: PriceProps) => {
  const { onInteraction, selection } = useChartScrub()
  const shown = selection ? prices[selection.index] : prices.at(-1)

  return (
    <>
      <Text>{shown}</Text>
      <Text>{selection ? categories[selection.index] : 'Today'}</Text>
      <Chart.Line
        categories={categories}
        interaction={{ crosshair: 'x', haptics: true, marker: marker.segment(), tooltip: false }}
        onInteraction={onInteraction}
        series={[{ id: 'price', label: 'Price', values: prices }]}
      />
    </>
  )
}
```

| Returns | Type | Description |
| --- | --- | --- |
| `selection` | `ChartScrubSelection \| null` | What is being read, or `null` when nothing is being scrubbed. |
| `onInteraction` | `(event) => void` | Hand this straight to the chart's `onInteraction`. |
| `reset` | `() => void` | Drops the selection, for a caller that has its own reason to. |
| `geometry` | `ChartGeometry \| null` | Where the plot and its annotations sit in the chart view, for drawing your own views over them. |

```ts
type ChartScrubSelection = {
  /** Position of the mark in the chart's own data order. */
  index: number
  category?: string
  /** Where the finger is, in the chart view's own coordinate space. */
  nativeX?: number
  nativeY?: number
  value?: number
}
```

**For a view on an annotation, reach for `annotationViews` first.** Key your own node by the
annotation's `id` and the chart centres it on the spot, keeps its own mark for it out of the
drawing, and moves it with the data — no geometry to hold, no positioning to write. A logo at
the live reading, a letter on a rule, a price that stays with the last point. Every native form
takes it, and on the web it is the five that report where an annotation landed — `Chart.Line`,
`Chart.Area`, `Chart.Bar`, `Chart.StackedBar` and `Chart.Candlestick`.

```tsx
import { annotation, Chart, useLastReading } from '@hzblj/zyplot'

export const Price = ({ prices, categories }: PriceProps) => {
  const live = useLastReading(categories, prices)

  return (
    <Chart.Line
      annotations={live ? [annotation.point({ id: 'live', x: live.category, y: live.value })] : []}
      annotationViews={{ live: <LiveBadge value={live?.value} /> }}
      categories={categories}
      series={[{ id: 'price', label: 'Price', values: prices }]}
    />
  )
}
```

**`geometry` is the way down when a view is not on an annotation.** It reports the plot's box
and every annotation's `x`/`y` in the chart's own coordinates, so a card can follow the finger
with `selection.nativeX` — which is the one thing `annotationViews` cannot place for you. An
annotation that is only an anchor for such a view takes `hidden: true`: measured and reported as
usual, drawn by nobody.

```tsx
'use client'

import { annotation, Chart, useChartScrub } from '@hzblj/zyplot'

export const Price = ({ prices, categories }: PriceProps) => {
  const { geometry, onInteraction, selection } = useChartScrub()
  const dividend = geometry?.annotations.find((mark) => mark.id === 'dividend')

  return (
    <View>
      <Chart.Line
        annotations={[
          // No badge: the rule is the chart's, the head is yours.
          annotation.line({ axis: 'x', dash: [2, 4], id: 'dividend', value: '12 Jul' }),
        ]}
        categories={categories}
        interaction={{ crosshair: 'x', haptics: true, tooltip: false }}
        onInteraction={onInteraction}
        series={[{ id: 'price', label: 'Price', values: prices }]}
      />

      {dividend ? (
        <Pressable
          onPress={openDividend}
          style={[styles.badge, { left: dividend.x - 9, top: dividend.y - 9 }]}
        >
          <Text>D</Text>
        </Pressable>
      ) : null}

      {selection ? (
        <Card left={selection.nativeX} rows={events[selection.index]} />
      ) : null}
    </View>
  )
}
```

**The identity is stable.** `onInteraction` and `reset` keep the same identity across
renders, and the returned object only changes when the selection does — so a `memo`'d chart
is not re-rendered by the readout updating above it.

### useLastReading

A series is often shorter than its axis on purpose — a trading session still in progress, a
forecast that has not started — so its last *slot* is not its last reading. This walks back
to where the data really ends, which is where a "now" marker belongs. It returns `null` when
the series has no readings at all, and it reads nothing but the arrays you pass it, so it is
on every entry point.

```tsx
const live = useLastReading(range.categories, range.values)

<Chart.Line
  annotations={
    live
      ? [
          annotation.point({
            color: '#ffffff',
            glow: glow({ color: '#ff3b4a', opacity: 0.25, radius: 3 }),
            halo: halo({ color: '#ff3b4a', size: 11 }),
            id: 'live',
            pulse: true,
            size: 4.7,
            x: live.category,
            y: live.value,
          }),
        ]
      : []
  }
  categories={range.categories}
  series={[{ id: 'price', label: 'Price', values: range.values }]}
/>
```

| Argument | Type | Description |
| --- | --- | --- |
| `categories` * | `readonly string[]` | The categories the series is plotted against. |
| `values` * | `readonly (number \| null)[]` | The series values. Trailing `null` entries are skipped, as are gaps. |

```ts
type ChartReading = {
  category: string
  index: number
  value: number
}
```

**The native renderers already agree with it.** A scrub stops at the same point this returns,
so a "now" marker placed here is exactly where the finger can no longer go.

## Loading states

Hold `isLoading` true while the data is in flight. The chart shows the shape it is about to
be, at the height it will occupy, and cross-fades into the plot when the flag drops — same
grid cell, same size, so nothing on the page moves when the marks land.

```tsx
<Chart.Line
  categories={categories}
  height={320}
  isLoading={revenue.isPending}
  series={series}
/>
```

The placeholder is derived from the props the chart already has: one legend row per series,
and axis rows only where an axis is visible.

**The first frame is a loading state too.** A chart has to read its colors off the document
before it can paint, so the built-in placeholder also covers that frame — with `isLoading`
false and data in hand. The wrapper carries `aria-busy` while either is true, and the
placeholder itself is `aria-hidden`.

**Native draws one too, in its own way.** `isLoading` means the same thing on iOS and Android,
and both draw a shimmering placeholder shaped like the form they stand in for — a ring for the
radial ones, a row of columns for the bar family, a curve for everything else. What they do not
have is a `skeleton` slot or a `.Skeleton` component to mount on its own: those are DOM
composition, and the placeholder there is one view the renderer draws.

### Skeleton props

Every form also exposes its placeholder on its own, as `Chart.Line.Skeleton` — for when the
chart is not mounted yet at all. Web only.

```tsx
<Suspense fallback={<Chart.Line.Skeleton height={320} legendCount={2} />}>
  <Revenue />
</Suspense>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `number` | `240` | Reserved height. Match the chart it stands in for. |
| `legendCount` | `number` | `0` | Legend rows to reserve. Drawn from two up — a single series gets no legend. |
| `xAxis` | `boolean` | `true` | Reserves the horizontal-axis label row. |
| `yAxis` | `boolean` | `true` | Reserves the vertical-axis label column. |
| `className` | `string` | — | CSS class applied to the skeleton root. |

### Custom skeleton

`skeleton` takes a rendered element, not a component, and replaces the built-in one while
`isLoading` is true. Keep its height equal to the chart's so the swap still costs no layout
shift. It covers `isLoading` only — the frame before the first paint still uses the built-in
placeholder.

## Charts

### Shared props

Every form takes these, so they are listed once rather than twenty-one times.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | — | CSS class applied to the chart root. Web only — a native chart has no DOM node. |
| `height` | `number` | `240` | Plot height. A chart never measures its own content, so this is what reserves the space. Px on the web (240), points on native (320). |
| `isLoading` | `boolean` | `false` | Held true while the data is in flight. Shows the matching skeleton, then cross-fades into the plot. |
| `skeleton` | `ReactNode` | — | Replaces the built-in placeholder while `isLoading` is true. Web only. |
| `surface` | `ChartSurface` | — | The container the plot sits in. Merges over `Chart.Provider`, key by key. |
| `theme` | `ChartTheme` | — | Colours and fonts for this chart alone. The portable subset; native charts take `NativeChartTheme`, which adds `background`. Merges over `Chart.Provider` key by key on the web; replaces it outright on native. |
| `texture` | `boolean` | `false` | Draws decal patterns over fills — a second encoding on top of hue, for full colour-vision deficiency, print and forced-colors. Web only. |
| `accessibilityLabel` | `string` | — | Native only: the accessibility name of the chart view. |

The cartesian forms — line, area, bar, stacked bar and candlestick — additionally take the
**plot controls**. The `Native*` types here are what every renderer takes, web included.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `axis` | `ChartAxes` | `{ x: true, y: true }` | Horizontal and vertical axis visibility. |
| `animation` | `NativeChartAnimation` | — | Mark entrance, traced reveal and data-update animation. |
| `annotations` | `NativeChartAnnotation[]` | — | Reference lines, highlighted ranges, points and text anchored to the plot. |
| `annotationViews` | `Record<string, ReactNode>` | — | Your own node where an annotation lands, keyed by its `id`. The chart centres it on the spot and draws no mark of its own there. |
| `interaction` | `NativeChartInteraction` | — | Hover, crosshair, marker, tooltip, selection, pan and zoom behaviour. |
| `onInteraction` | `(event: ChartInteractionEvent) => void` | — | Receives normalized pointer and selection data. Needs a client component. |
| `plot` | `ChartPlotStyle` | — | The plot area alone — its own background, border, clipping and padding, inside the surface. |
| `xAxis` | `NativeChartAxisOptions` | — | Scale, domain, ticks, grid, position and label for the horizontal axis. |
| `yAxis` | `NativeChartAxisOptions` | — | The same for the vertical axis. |

Forms that read `series` also take `emphasisId` (`string`) to keep one series colored and
mute the others, and `seriesStyles` (`Record<string, NativeChartSeriesStyle>`) for per-series
stroke, fill, dash, symbol and glow keyed by `ChartSeries.id`. A line draws no symbol per
reading unless one is named there — a dot per datum is a mark the reader did not ask for, and
the native renderers draw none. Forms that show numbers take `format` (`ChartNumberFormat`) —
on native every form does.

The props below are the web ones. Eleven forms take different data props on native; those are
listed under "Chart coverage".

### Line

Compare continuous trends across an ordered category or time axis. Use for trends; do not
smooth data when intermediate values are unknown. web · iOS · Android.

```tsx
<Chart.Line
  categories={['Jan', 'Feb', 'Mar', 'Apr']}
  series={series}
  format={{ prefix: '$' }}
/>
```

Own props: `categories` (`string[]`, required), `series` (`ChartSeries[]`, required),
`isSmooth` (`boolean`, default `false`) draws rounded interpolation between observations.
Plus `format`, `emphasisId`, `seriesStyles`, the plot controls and the shared props.

### Area

Show a trend while emphasizing magnitude or composition over time. Use when magnitude
matters in addition to direction. web · iOS · Android.

```tsx
<Chart.Area categories={categories} series={series} isStacked />
```

Own props: `categories` (required), `series` (required), `isSmooth` (`boolean`, `false`),
`isStacked` (`boolean`, `false`) stacks series to show their combined composition. Plus
`format`, `emphasisId`, `seriesStyles`, the plot controls and the shared props.

### Bar

Compare discrete values across a small set of categories. Switch to horizontal for long
labels. web · iOS · Android.

```tsx
<Chart.Bar categories={categories} series={series} orientation="vertical" />
```

Own props: `categories` (required), `series` (required), `orientation`
(`"horizontal" | "vertical"`, default `"vertical"`). Plus `format`, `emphasisId`,
`seriesStyles`, the plot controls and the shared props.

### Stacked bar

Compare category totals and the composition inside each total. Normalize when composition
matters more than the absolute total. web · iOS · Android.

```tsx
<Chart.StackedBar categories={categories} series={series} isNormalized />
```

Own props: `categories` (required), `series` (required), `isNormalized` (`boolean`, `false`)
normalizes every stack to 100 percent, `orientation` (`"horizontal" | "vertical"`,
`"vertical"`). Plus `format`, `emphasisId`, `seriesStyles`, the plot controls and the shared
props.

### Histogram

Reveal the distribution of raw numeric observations. Use when shape, spread and outliers
matter more than individual values. web · iOS · Android.

```tsx
<Chart.Histogram values={observations} binCount={8} />
```

Own props: `values` (`number[]`, required — binning is handled by the component), `binCount`
(`number`, default `10`), `valueFormat` (`ChartNumberFormat`) for bin boundaries, `axis`.
Plus the shared props. Native has no `valueFormat` — use `format`.

### Scatter

Reveal relationships, clusters and outliers between two measures. web · iOS · Android.

```tsx
<Chart.Scatter series={series} xLabel="Spend" yLabel="Revenue" />
```

Own props: `series` (`ChartScatterSeries[]`, required), `xLabel`, `yLabel` (`string`),
`xFormat`, `yFormat` (`ChartNumberFormat`), `axis`. Plus the shared props.

### Time series

Render tens of thousands of ordered time points efficiently. Prefer Line for small
human-scale datasets. web · iOS · Android.

```tsx
<Chart.TimeSeries points={points} series={series} height={320} />
```

Own props: `points` (`ChartTimePoints`, required — parallel timestamp and value arrays),
`series` (`Omit<ChartSeries, "values">[]`, required — identity and colour only), `format`,
`axis`. Plus the shared props.

### Sparkline

A tiny trend shape without axes, tooltip or legend. Use inside a table row or card as
context, never for exact lookup. web · iOS · Android.

```tsx
<Chart.Sparkline values={[12, 18, 14, 24, 31, 29]} slot={1} />
```

Own props: `values` (`number[]`, required), `slot` (`number`) palette slot for the stroke,
`color` (`string`) explicit stroke color overriding the palette, `height` (default `32`),
`className`, `isLoading`, `surface`. Native has no `slot` — pass `color`.

### Pie

Show a simple part-to-whole relationship with a short tail. Use for two to five parts; prefer
bars when precise comparison matters. web · iOS · Android.

```tsx
<Chart.Pie data={data} otherLabel="Other" maxSlices={4} />
```

Own props: `data` (`ChartDatum[]`, required, ordered by importance), `format`, `isSolid`
(`boolean`, `false`) fills the center to render a full pie, `maxSlices` (`number`, default
`3`) slices retained before folding the tail, `otherLabel` (`string`) translated label for
the folded tail. Plus the shared props. Native takes `innerRadius` instead of these three.

### Gauge

Show one current value against a fixed bounded range. Use for capacity and progress with a
meaningful maximum. web · iOS · Android.

```tsx
<Chart.Gauge value={72} max={100} />
```

Own props: `value` (`number`, required), `max` (`number`, required), `min` (`number`, default
`0`), `format`. Plus the shared props. Height defaults to `200` here. On native `max` is
optional and defaults to 100, and there is an extra `label`.

### Meter

A compact accessible scalar for rows, settings and summaries. Use instead of a gauge when
vertical space is limited. Two elements, `role="meter"` and no charting engine, so its final
markup is painted on the server. web · iOS · Android.

```tsx
<Chart.Meter label="Storage used" value={72} max={100} />
```

Own props: `label` (`string`, required — rendered above the meter), `value` (required), `max`
(required), `format`, `showValue` (`boolean`, default `true`), `className`, `surface`. Native
takes the gauge props instead: `value`, `max`, `min`, `label`, with no `showValue`.

### Funnel

Show ordered attrition through a sequence of stages. Use only when each stage is a subset of
the previous stage. web · iOS · Android.

```tsx
<Chart.Funnel stages={stages} format={{ suffix: ' users' }} />
```

Own props: `stages` (`ChartDatum[]`, required, ordered widest to narrowest), `format`. Plus
the shared props. Natively the prop is called `data`.

### Radar

Compare multivariate profiles on a shared set of bounded axes. Use for profile shape, not
precise lookup; keep dimensions limited. web · iOS · Android.

```tsx
<Chart.Radar axes={axes} series={series} />
```

Own props: `axes` (`ChartRadarAxis[]`, required — labels and upper bounds per dimension),
`series` (`ChartSeries[]`, required), `format`. Plus the shared props.

### Sankey

Trace weighted flow between named nodes and stages. Use when flow volume between states is
the primary story. web · iOS · Android.

```tsx
<Chart.Sankey nodes={nodes} links={links} />
```

Own props: `nodes` (`ChartFlowNode[]`, required), `links` (`ChartFlowLink[]`, required),
`format`. Plus the shared props. Height defaults to `300` here.

### Sunburst

Show hierarchical part-to-whole relationships in concentric rings. Use when both hierarchy
depth and part-to-whole structure matter. web · iOS · Android.

```tsx
<Chart.Sunburst nodes={hierarchy} />
```

Own props: `nodes` (`ChartHierarchyNode[]`, required — leaf nodes carry values), `format`.
Plus the shared props. Natively the prop is called `data`.

### Treemap

Fit hierarchical part-to-whole data into a compact rectangle. Use when screen efficiency
matters more than reading hierarchy depth. web · iOS · Android.

```tsx
<Chart.Treemap nodes={hierarchy} />
```

Own props: `nodes` (`ChartHierarchyNode[]`, required), `format`. Plus the shared props.
Natively the prop is called `data`.

### Candlestick

Show open, high, low and close for each session, with optional volume. For a single measure
over time reach for Line or Time series instead — a candlestick spends four values of ink on
one. web · iOS · Android.

```tsx
<Chart.Candlestick data={candles} format={{ prefix: '$' }} showVolume />
```

Own props: `data` (`ChartCandlestickDatum[]`, required, chronological), `format`, `showVolume`
(`boolean`, `false`) adds a volume histogram beneath the price plot and needs `volume` on each
datum, `style` (`ChartCandlestickStyle`) candle body, wick and volume colors plus hollow-up
rendering. Plus the plot controls and the shared props. On native it also takes `labels`
(`ChartCandlestickLabels`).

### Boxplot

Compare five-number summaries and outliers across groups. Use to compare distributions when
raw observations are not required. web · iOS · Android.

```tsx
<Chart.Boxplot groups={groups} labels={labels} />
```

Own props: `groups` (`ChartBoxplotGroup[]`, required), `labels` (`BoxplotLabels`, required —
translated labels for the summary statistics), `format`, `orientation`
(`"horizontal" | "vertical"`, `"vertical"`), `axis`. Plus the shared props.

### Diverging bar

Compare positive and negative values around a shared zero. Use for variance, sentiment,
gain/loss and change from baseline. web · iOS · Android.

```tsx
<Chart.DivergingBar data={changes} format={{ suffix: '%' }} />
```

Own props: `data` (`ChartDatum[]`, required, signed values), `format`, `orientation`
(`"horizontal" | "vertical"`, default `"horizontal"`), `axis`. Plus the shared props. Native
has no `orientation`; the bars always run horizontally.

### Dumbbell

Show movement between exactly two measurements per item. Use when the story is change between
two known states. web · iOS · Android.

```tsx
<Chart.Dumbbell rows={rows} beforeLabel="2025" afterLabel="2026" />
```

Own props: `rows` (`ChartDumbbellRow[]`, required), `beforeLabel` (`string`, required),
`afterLabel` (`string`, required), `format`, `axis`. Plus the shared props. Native takes
`rows` alone — label the two ends in your own view.

### Heatmap

Display magnitude across two categorical dimensions. Use to expose clusters and patterns in a
dense matrix. web · iOS · Android.

```tsx
<Chart.Heatmap columns={days} rows={hours} cells={cells} />
```

Own props: `cells` (`ChartHeatmapCell[]`, required, addressed by row and column index),
`columns` (`string[]`, required), `rows` (`string[]`, required), `format`, `axis`. Plus the
shared props.

## Example app

`apps/example` in the repository runs every chart on a device, plus a full Revolut-style stock
quote screen: a headline price that follows the finger, a smoothed intraday line that stops
where the session does, a range selector, a candlestick toggle, and native tabs and headers
above it all. It is the reference for what the native renderers are for — everything on the
screen except the plot itself is ordinary React Native.

- `revolut-line-chart.tsx` — the intraday price: smoothed, glowing, with a dashed baseline
  rule, an event badge, and a pulsing point at the last reading that `useLastReading` finds.
- `revolut-candlestick-chart.tsx` — the same screen switched to OHLC, with the candle width
  and radius measured off the design.
- `use-quote-readout.ts` — turns the scrub into the price, the delta and the date above the
  plot. No tooltip is drawn by either chart.
- `quote-chart-overlay.tsx` — the reading card and the event badge are React Native views
  placed over the plot from the `geometry` the `'layout'` phase reports.
- `revolut.ios.tsx` / `revolut.android.tsx` — one screen per platform: SwiftUI through
  `@expo/ui` on iOS, Compose on Android, sharing the data, the theme and both charts.

Source: https://github.com/hzblj/zyplot/tree/main/apps/example/src/revolut

It is a design study on generated data, not affiliated with or endorsed by Revolut.

## Releases

Versions are cut with changesets and published from CI with npm provenance, so the git tag,
the GitHub release and the version on npm are always the same number.

- Releases: https://github.com/hzblj/zyplot/releases
- Changelog: https://zyplot.janblazej.dev/docs/changelog
