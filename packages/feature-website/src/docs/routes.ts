export type DocsRoute = {
  isGuide: boolean
  description: string
  href: string
  title: string
}

const guideRoutes: Omit<DocsRoute, 'isGuide'>[] = [
  {
    description: 'Install Zyplot and render your first chart on web, iOS, or Android.',
    href: '/docs',
    title: 'Zyplot documentation',
  },
  {
    description: 'Install the package and choose the right entry point.',
    href: '/docs/installation',
    title: 'Installation',
  },
  {
    description: 'The shared data types used by Zyplot charts.',
    href: '/docs/data-types',
    title: 'Data types',
  },
  {
    description: 'Typed helpers for building chart props.',
    href: '/docs/builders',
    title: 'Builders',
  },
  {
    description: 'Show built-in or custom placeholders while data loads.',
    href: '/docs/loading-states',
    title: 'Loading states',
  },
  {
    description: 'Set chart colors, typography, surfaces, and shared defaults.',
    href: '/docs/theming',
    title: 'Theming',
  },
  {
    description: 'Follow the system color scheme or select a fixed mode.',
    href: '/docs/dark-mode',
    title: 'Light and dark mode',
  },
  {
    description: 'How Zyplot renders charts in the browser.',
    href: '/docs/web',
    title: 'Web renderer',
  },
  {
    description: 'Compose web charts with a frame and legend.',
    href: '/docs/composition',
    title: 'Frame and legend',
  },
  {
    description: 'Set up native charts in an Expo or React Native app.',
    href: '/docs/native',
    title: 'iOS and Android',
  },
  {
    description: 'Use Swift Charts and the iOS-only Range and Rule charts.',
    href: '/docs/native/ios',
    title: 'iOS renderer',
  },
  {
    description: 'Use the Compose renderer and Android-only Waterfall and Lollipop charts.',
    href: '/docs/native/android',
    title: 'Android renderer',
  },
  {
    description: 'Track the chart value under the pointer or finger.',
    href: '/docs/hooks/use-chart-scrub',
    title: 'useChartScrub',
  },
  {
    description: 'Read the last non-null value in a series.',
    href: '/docs/hooks/use-last-reading',
    title: 'useLastReading',
  },
  {
    description: 'A complete stock-detail screen built with Zyplot.',
    href: '/docs/apps/revolut',
    title: 'Revolut example',
  },
  {
    description: 'A complete crypto-price screen built with Zyplot.',
    href: '/docs/apps/kraken',
    title: 'Kraken example',
  },
  {
    description: 'A complete token-detail screen built with Zyplot.',
    href: '/docs/apps/family',
    title: 'Family example',
  },
  {
    description: 'A complete steps screen built with Zyplot.',
    href: '/docs/apps/health',
    title: 'Health example',
  },
  {
    description: 'A complete quote sheet built with Zyplot.',
    href: '/docs/apps/stocks',
    title: 'Stocks example',
  },
  {
    description: 'Published Zyplot versions and release notes.',
    href: '/docs/releases',
    title: 'Releases',
  },
  {
    description: 'Changes in each Zyplot version.',
    href: '/docs/changelog',
    title: 'Changelog',
  },
]

const chartRoutes: {description: string; id: string; name: string}[] = [
  {description: 'Show a trend across ordered categories.', id: 'line', name: 'Line'},
  {description: 'Show a trend and the magnitude below it.', id: 'area', name: 'Area'},
  {description: 'Compare values across categories.', id: 'bar', name: 'Bar'},
  {description: 'Compare totals and their composition.', id: 'stacked-bar', name: 'Stacked bar'},
  {description: 'Show a small part-to-whole split.', id: 'pie', name: 'Pie'},
  {description: 'Show one value inside a fixed range.', id: 'gauge', name: 'Gauge'},
  {description: 'Show one bounded value in a compact row.', id: 'meter', name: 'Meter'},
  {description: 'Group raw values into bins.', id: 'histogram', name: 'Histogram'},
  {description: 'Compare distribution summaries.', id: 'boxplot', name: 'Boxplot'},
  {description: 'Plot open, high, low, and close values.', id: 'candlestick', name: 'Candlestick'},
  {description: 'Compare positive and negative values around zero.', id: 'diverging-bar', name: 'Diverging bar'},
  {description: 'Compare a before and after value for each item.', id: 'dumbbell', name: 'Dumbbell'},
  {description: 'Show drop-off through ordered stages.', id: 'funnel', name: 'Funnel'},
  {description: 'Map values across a two-dimensional grid.', id: 'heatmap', name: 'Heatmap'},
  {description: 'Compare profiles across bounded dimensions.', id: 'radar', name: 'Radar'},
  {description: 'Plot the relationship between two measures.', id: 'scatter', name: 'Scatter'},
  {description: 'Show weighted flow between named nodes.', id: 'sankey', name: 'Sankey'},
  {description: 'Show hierarchical values in concentric rings.', id: 'sunburst', name: 'Sunburst'},
  {description: 'Pack hierarchical values into a rectangle.', id: 'treemap', name: 'Treemap'},
  {description: 'Render dense time data from parallel arrays.', id: 'time-series', name: 'Time series'},
  {description: 'Show a tiny trend without axes or a legend.', id: 'sparkline', name: 'Sparkline'},
  {description: 'Plot a low-to-high interval for each category on iOS.', id: 'ios-range', name: 'Range'},
  {description: 'Draw standalone reference rules on iOS.', id: 'ios-rule', name: 'Rule'},
  {
    description: 'Show how positive and negative steps build a total on Android.',
    id: 'android-waterfall',
    name: 'Waterfall',
  },
  {
    description: 'Compare categories with a stem and dot on Android.',
    id: 'android-lollipop',
    name: 'Lollipop',
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
  family: '/docs/apps/family',
  health: '/docs/apps/health',
  introduction: '/docs',
  kraken: '/docs/apps/kraken',
  'native-android': '/docs/native/android',
  'native-ios': '/docs/native/ios',
  'native-package': '/docs/native',
  revolut: '/docs/apps/revolut',
  stocks: '/docs/apps/stocks',
  'use-chart-scrub': '/docs/hooks/use-chart-scrub',
  'use-last-reading': '/docs/hooks/use-last-reading',
  'web-package': '/docs/web',
}

export const docsHrefForPage = (page: string, chartIds: readonly string[]) =>
  GUIDE_HREFS[page] ?? (chartIds.includes(page) ? `/docs/charts/${page}` : `/docs/${page}`)
