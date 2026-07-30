export type DocsRoute = {
  isGuide: boolean
  description: string
  href: string
  title: string
}

const guideRoutes: Omit<DocsRoute, 'isGuide'>[] = [
  {
    description:
      'Native-feeling charts for React and Expo from one API. Twenty-one chart forms that render through ECharts and uPlot on the web, Swift Charts on iOS and Compose on Android.',
    href: '/docs',
    title: 'Documentation',
  },
  {
    description:
      'Install @hzblj/zyplot with npm, yarn, pnpm or bun. One package covers web, iOS and Android, ships its own compiled styles, and needs no Tailwind CSS in your app.',
    href: '/docs/installation',
    title: 'Installation',
  },
  {
    description:
      'The serializable data contracts every Zyplot chart takes — ChartSeries, ChartDatum, axis options, number formatting, annotations and interaction events.',
    href: '/docs/data-types',
    title: 'Data types',
  },
  {
    description:
      'Typed builders for the props that are easy to get wrong — annotation, axis, marker, reveal and series set the discriminant for you and return plain objects.',
    href: '/docs/builders',
    title: 'Builders',
  },
  {
    description:
      'Hold isLoading while data is in flight and a Zyplot chart shows a placeholder matched to its own shape and height, then cross-fades in with no layout shift.',
    href: '/docs/loading-states',
    title: 'Loading states',
  },
  {
    description:
      'Theme Zyplot charts with CSS custom properties. The colour, surface and palette contract every renderer implements, and how Chart.Provider scopes it.',
    href: '/docs/theming',
    title: 'Theming',
  },
  {
    description:
      'How Zyplot resolves light and dark mode, why canvas colours are read off the document, and the --zyplot-* custom properties that drive both.',
    href: '/docs/dark-mode',
    title: 'Light and dark mode',
  },
  {
    description:
      'The DOM renderer: ECharts draws eighteen forms, uPlot handles dense series and sparklines, and legends stay real HTML that a screen reader can read.',
    href: '/docs/web',
    title: 'Web renderer',
  },
  {
    description:
      'Chart.Frame gives a chart a titled card with a caption row, and Chart.Legend places series identity yourself for small multiples or a legend that filters.',
    href: '/docs/composition',
    title: 'Frame and legend',
  },
  {
    description:
      'Zyplot ships an Expo module that draws with Swift Charts on iOS and a Jetpack Compose Canvas on Android — the same Chart namespace, and no WebView.',
    href: '/docs/native',
    title: 'iOS and Android',
  },
  {
    description:
      'Charts drawn with SwiftUI and Swift Charts. Chart.Range and Chart.Rule are iOS-only, and xAxis takes the Swift Charts scrolling options on top of the shared ones.',
    href: '/docs/native/ios',
    title: 'iOS renderer',
  },
  {
    description:
      'Charts drawn on a Jetpack Compose Canvas. Chart.Waterfall and Chart.Lollipop are Android-only, and the axes take Compose overflow handling on top of the shared options.',
    href: '/docs/native/android',
    title: 'Android renderer',
  },
  {
    description:
      'Tracks the datum being read on all three platforms, so a price, a date and a delta can be real text above the plot while the chart draws no tooltip at all.',
    href: '/docs/hooks/use-chart-scrub',
    title: 'useChartScrub',
  },
  {
    description:
      'Finds the last reading a series actually has, and the category it sits on — where a "now" marker belongs when the axis runs past the data.',
    href: '/docs/hooks/use-last-reading',
    title: 'useLastReading',
  },
  {
    description:
      'A Revolut-style quote screen built with Zyplot: a scrubbed price readout, a candlestick toggle, glow and pulse annotations, and the same screen on iOS, Android and the web.',
    href: '/docs/apps/revolut',
    title: 'Revolut',
  },
  {
    description:
      'A Kraken-style crypto price screen built with Zyplot: a full-bleed trace with no axes, a dotted area fill closed against the latest price, and a scrub that lights the line up to the finger.',
    href: '/docs/apps/kraken',
    title: 'Kraken',
  },
  {
    description: 'Where to find every published Zyplot version, its notes and the commits behind it.',
    href: '/docs/releases',
    title: 'Releases',
  },
  {
    description: 'New updates and improvements to Zyplot, version by version.',
    href: '/docs/changelog',
    title: 'Changelog',
  },
]

const chartRoutes: {description: string; id: string; name: string}[] = [
  {
    description:
      'Plot continuous trends over an ordered category or time axis, with optional smoothing, annotations and a second series to compare against.',
    id: 'line',
    name: 'Line',
  },
  {
    description:
      'Show a trend and its magnitude together, stacked to read composition over time or plain to emphasise the volume under one series.',
    id: 'area',
    name: 'Area',
  },
  {
    description:
      'Compare exact values across a small set of categories, vertically or turned horizontal when the labels are too long to fit under an axis.',
    id: 'bar',
    name: 'Bar',
  },
  {
    description:
      'Compare category totals and the composition inside each one, normalized to 100 percent when the mix matters more than the absolute total.',
    id: 'stacked-bar',
    name: 'Stacked bar',
  },
  {
    description:
      'A part-to-whole split for two to five slices, with a folded Other tail so a long list cannot turn into a ring of unreadable slivers.',
    id: 'pie',
    name: 'Pie',
  },
  {
    description:
      'One current value against a fixed range — capacity, progress or utilisation where the maximum means something to the reader.',
    id: 'gauge',
    name: 'Gauge',
  },
  {
    description:
      'A compact accessible scalar for table rows, settings and summaries. Two elements, role="meter" and no charting engine, so its final markup is painted on the server.',
    id: 'meter',
    name: 'Meter',
  },
  {
    description:
      'Bin raw numeric observations to expose the shape of a distribution — its spread, its skew and the outliers at either end.',
    id: 'histogram',
    name: 'Histogram',
  },
  {
    description:
      'Compare five-number summaries and outliers across groups, with the median, quartile and whisker labels in your own wording.',
    id: 'boxplot',
    name: 'Boxplot',
  },
  {
    description:
      'Open, high, low and close per session with an optional volume histogram beneath, plus hollow-up candles for price data.',
    id: 'candlestick',
    name: 'Candlestick',
  },
  {
    description:
      'Positive and negative values around a shared zero — variance, sentiment, gain and loss, or change from a baseline.',
    id: 'diverging-bar',
    name: 'Diverging bar',
  },
  {
    description:
      'Movement between exactly two measurements per row, when the story is the change between two known states rather than the trend between them.',
    id: 'dumbbell',
    name: 'Dumbbell',
  },
  {
    description:
      'Ordered attrition through a sequence of stages, for the case where each stage really is a subset of the one before it.',
    id: 'funnel',
    name: 'Funnel',
  },
  {
    description:
      'Magnitude across two categorical dimensions, to expose the clusters and the patterns a dense matrix of numbers hides.',
    id: 'heatmap',
    name: 'Heatmap',
  },
  {
    description:
      'Compare multivariate profiles on a shared set of bounded axes, for reading the shape of a profile rather than looking up a value.',
    id: 'radar',
    name: 'Radar',
  },
  {
    description:
      'Relationships, clusters and outliers between two measures, with an optional third encoded as point size.',
    id: 'scatter',
    name: 'Scatter',
  },
  {
    description:
      'Weighted flow between named nodes and stages, for when the volume moving between states is the story.',
    id: 'sankey',
    name: 'Sankey',
  },
  {
    description:
      'Hierarchical part-to-whole relationships in concentric rings, for when both the depth of the hierarchy and the split inside it matter.',
    id: 'sunburst',
    name: 'Sunburst',
  },
  {
    description:
      'Hierarchical part-to-whole data packed into a rectangle, for when screen efficiency matters more than reading the depth.',
    id: 'treemap',
    name: 'Treemap',
  },
  {
    description:
      'Tens of thousands of ordered time points, rendered through uPlot for dense telemetry that would drop frames on a scene graph.',
    id: 'time-series',
    name: 'Time series',
  },
  {
    description:
      'A tiny trend shape with no axes, tooltip or legend, for a table row or a card where the chart is context rather than the subject.',
    id: 'sparkline',
    name: 'Sparkline',
  },
]

export const DOCS_ROUTES: DocsRoute[] = [
  ...guideRoutes.map(route => ({...route, isGuide: true})),
  ...chartRoutes.map(chart => ({
    description: chart.description,
    href: `/docs/charts/${chart.id}`,
    isGuide: false,
    title: `${chart.name} chart`,
  })),
]

export const docsRouteFor = (href: string) => DOCS_ROUTES.find(route => route.href === href)

const GUIDE_HREFS: Record<string, string> = {
  introduction: '/docs',
  kraken: '/docs/apps/kraken',
  'native-android': '/docs/native/android',
  'native-ios': '/docs/native/ios',
  'native-package': '/docs/native',
  revolut: '/docs/apps/revolut',
  'use-chart-scrub': '/docs/hooks/use-chart-scrub',
  'use-last-reading': '/docs/hooks/use-last-reading',
  'web-package': '/docs/web',
}

export const docsHrefForPage = (page: string, chartIds: readonly string[]) =>
  GUIDE_HREFS[page] ?? (chartIds.includes(page) ? `/docs/charts/${page}` : `/docs/${page}`)
