'use client'

import {Chart} from '@hzblj/zyplot'
import Link from 'next/link'
import type {ReactNode} from 'react'
import {CoffeeMark} from '../coffee-mark'
import {docsStyles} from '../docs-styles'
import {GithubMark} from '../github-mark'
import {HERO_HEADLINE, HERO_LEDE} from '../hero-copy'
import {COFFEE_URL, REPOSITORY_URL} from '../links'
import {MobileNav} from '../mobile-nav'
import {ThemeToggle} from '../theme-toggle'
import {cn} from '../utils'
import {Wordmark} from '../wordmark'
import {chartExample} from './chart-code'
import {groupCharts} from './chart-groups'
import {ChangelogList} from './components/changelog-list'
import {ChartSection} from './components/chart-section'
import {CodeBlock} from './components/code-block'
import {DocsNav} from './components/docs-nav'
import {DocsToc} from './components/docs-toc'
import {PackageInstall} from './components/package-install'
import {PlatformBadges} from './components/platform-badges'
import {PropsTable} from './components/props-table'
import {DEFAULT_PREFERENCES, type DocsPreferences} from './preferences'
import {docsHrefForPage} from './routes'
import type {ChartDoc, PropRow} from './types'

const styles = docsStyles()
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const series = [
  {
    id: 'revenue',
    label: 'Revenue',
    values: [42, 56, 51, 72, 84, 91],
  },
  {
    id: 'costs',
    label: 'Costs',
    values: [28, 34, 38, 41, 48, 53],
  },
]

const classNameProp: PropRow = {
  description: 'CSS class applied to the chart root. Web only — a native chart has no DOM node.',
  name: 'className',
  type: 'string',
}

const heightProp: PropRow = {
  defaultValue: '240',
  description:
    'Plot height. A chart never measures its own content, so this is what reserves the space. In px on the web, where it defaults to 240; in points on native, where it defaults to 320.',
  name: 'height',
  type: 'number',
}

const isLoadingProp: PropRow = {
  defaultValue: 'unset',
  description:
    'Held true while the data is in flight. Shows the matching skeleton, then cross-fades into the plot. Passed false from the first render it also skips the placeholder the first frame would otherwise draw.',
  name: 'isLoading',
  type: 'boolean',
}

const skeletonProp: PropRow = {
  description:
    'Replaces the built-in placeholder while isLoading is true. Takes a rendered element. Web only — a native chart draws its own placeholder and has no slot to put yours in.',
  name: 'skeleton',
  type: 'ReactNode',
}

const surfaceProp: PropRow = {
  description:
    'The container the plot sits in — background, border, corner radius, padding. Merges over Chart.Provider, key by key.',
  name: 'surface',
  type: 'ChartSurface',
}

const themeProp: PropRow = {
  description:
    'Colours and fonts for this chart alone. The portable subset of the three theme shapes. On the web it merges over Chart.Provider key by key; on native a chart that passes one replaces the provider’s outright.',
  name: 'theme',
  type: 'ChartTheme',
}

const baseProps: PropRow[] = [classNameProp, heightProp, isLoadingProp, skeletonProp, surfaceProp, themeProp]

const axisProp: PropRow = {
  defaultValue: '{ x: true, y: true }',
  description: 'Horizontal and vertical axis visibility.',
  name: 'axis',
  type: 'ChartAxes',
}

const textureProp: PropRow = {
  defaultValue: 'false',
  description:
    'Draws decal patterns over fills — a second encoding on top of hue, for full colour-vision deficiency, print and forced-colors. Web only: those are conditions a native chart never meets.',
  name: 'texture',
  type: 'boolean',
}

const seriesStylesProp: PropRow = {
  description:
    'Per-series stroke, dash, symbol, glow and fill — a wash or a dot grid, closed against the plot floor or a value — keyed by ChartSeries.id. A line draws no symbol per reading unless one is named here: a dot per datum is a mark the reader did not ask for, and the native renderers draw none.',
  name: 'seriesStyles',
  type: 'Record<string, NativeChartSeriesStyle>',
}

const plotProps: PropRow[] = [
  {
    description: 'Mark entrance, traced reveal and data-update animation.',
    name: 'animation',
    type: 'NativeChartAnimation',
  },
  {
    description: 'Reference lines, highlighted ranges, points and text anchored to the plot.',
    name: 'annotations',
    type: 'NativeChartAnnotation[]',
  },
  {
    description:
      'Your own view where an annotation lands, keyed by its id. A point with one is not drawn at all — the view is the mark. A rule keeps its line and loses the badge and label it would have worn, since the view caps it. A rule’s view runs from the plot’s edge, centred only across the rule. Written as view on the annotation itself in a zyplot config.',
    name: 'annotationViews',
    type: 'Record<string, ChartSlotView>',
  },
  {
    description:
      'What appears for the reading, in one setting. Left out or true, the chart writes its own card. false draws nothing. A tooltip.beside({view}) or tooltip.above({view}) is your own view instead, mounted in the plot and moved with the finger by the chart itself — and it takes the place of the card, or of the rule’s own label when placed above.',
    name: 'tooltip',
    type: 'boolean | ChartTooltip',
  },
  {
    description:
      'Your own view for the span under two fingers, centred on it and lifted clear of the plot. iOS and Android only.',
    name: 'rangeView',
    type: 'ChartSlotView',
  },
  {
    description: 'Hover, crosshair, marker, tooltip, selection and zoom behaviour.',
    name: 'interaction',
    type: 'NativeChartInteraction',
  },
  {
    description: 'Receives normalized pointer and selection data. Needs a client component.',
    name: 'onInteraction',
    type: 'ChartInteractionHandler',
  },
  {
    description: 'The plot area alone — its own background, border, clipping and padding, inside the surface.',
    name: 'plot',
    type: 'ChartPlotStyle',
  },
  {
    description: 'Scale, domain, ticks, grid, position and label for the horizontal axis — everything axis cannot say.',
    name: 'xAxis',
    type: 'NativeChartAxisOptions',
  },
  {
    description: 'The same for the vertical axis.',
    name: 'yAxis',
    type: 'NativeChartAxisOptions',
  },
]

const formatProp: PropRow = {
  description: 'Number formatting shared by axes, labels and tooltips.',
  name: 'format',
  type: 'ChartNumberFormat',
}

const seriesProp: PropRow = {
  description: 'Named data series aligned with the category axis.',
  name: 'series',
  required: true,
  type: 'ChartSeries[]',
}

const categoriesProp: PropRow = {
  description: 'Labels for the shared category axis.',
  name: 'categories',
  required: true,
  type: 'string[]',
}

const emphasisProp: PropRow = {
  description: 'Keeps one series colored and mutes the others.',
  name: 'emphasisId',
  type: 'string',
}

const animationProp: PropRow = {
  description:
    'Entrance and data-change timing — duration, delay, easing, and enabled to turn both off. No traced reveal here: that needs a line to draw along.',
  name: 'animation',
  type: 'NativeChartAnimation',
}

const withBase = (...props: PropRow[]) => [...props, animationProp, textureProp, ...baseProps]
const withPlotControls = (...props: PropRow[]) => [...props, axisProp, ...plotProps, textureProp, ...baseProps]
const withHeight = (props: PropRow[], defaultValue: string) =>
  props.map(prop => (prop.name === 'height' ? {...prop, defaultValue} : prop))

const everywhere = ['web', 'ios', 'android'] as const
const code = chartExample

const heatCells = Array.from({length: 24}, (_, index) => ({
  columnIndex: index % 6,
  rowIndex: Math.floor(index / 6),
  value: 18 + ((index * 17) % 76),
}))

const hierarchy = [
  {
    children: [
      {id: 'web', label: 'Web', value: 48},
      {id: 'ios', label: 'iOS', value: 31},
      {id: 'android', label: 'Android', value: 21},
    ],
    id: 'product',
    label: 'Product',
  },
  {
    children: [
      {id: 'search', label: 'Search', value: 28},
      {id: 'social', label: 'Social', value: 18},
    ],
    id: 'growth',
    label: 'Growth',
  },
]

const timePoints = {
  timestamps: Array.from({length: 36}, (_, index) => 1_735_689_600 + index * 86_400),
  values: [
    Array.from({length: 36}, (_, index) => 42 + index * 1.4 + Math.sin(index / 2) * 8),
    Array.from({length: 36}, (_, index) => 31 + index * 0.8 + Math.cos(index / 3) * 6),
  ],
}

const candles = [
  {
    category: 'Mon',
    close: 132,
    high: 136,
    id: 'mon',
    low: 124,
    open: 126,
    volume: 18_400,
  },
  {
    category: 'Tue',
    close: 128,
    high: 138,
    id: 'tue',
    low: 127,
    open: 133,
    volume: 22_100,
  },
  {
    category: 'Wed',
    close: 141,
    high: 144,
    id: 'wed',
    low: 128,
    open: 129,
    volume: 31_700,
  },
  {
    category: 'Thu',
    close: 139,
    high: 147,
    id: 'thu',
    low: 137,
    open: 142,
    volume: 25_300,
  },
  {
    category: 'Fri',
    close: 152,
    high: 154,
    id: 'fri',
    low: 138,
    open: 140,
    volume: 40_900,
  },
]

const chartDocs: ChartDoc[] = [
  {
    code: code(
      'Line',
      `      categories={['Jan', 'Feb', 'Mar', 'Apr']}
      series={series}
      format={{ prefix: '$' }}`
    ),
    description: 'Compare continuous trends across an ordered category or time axis.',
    id: 'line',
    name: 'Line',
    platforms: everywhere,
    preview: <Chart.Line categories={categories} format={{prefix: '$'}} height={300} series={series} />,
    props: withPlotControls(
      categoriesProp,
      seriesProp,
      formatProp,
      emphasisProp,
      {
        defaultValue: 'false',
        description: 'Draws rounded interpolation between observations.',
        name: 'isSmooth',
        type: 'boolean',
      },
      seriesStylesProp
    ),
    when: 'Use for trends. Do not smooth data when intermediate values are unknown.',
  },
  {
    code: code(
      'Area',
      `      categories={categories}
      series={series}
      isStacked`
    ),
    description: 'Show a trend while emphasizing magnitude or composition over time.',
    id: 'area',
    name: 'Area',
    platforms: everywhere,
    preview: <Chart.Area categories={categories} height={300} isStacked series={series} />,
    props: withPlotControls(
      categoriesProp,
      seriesProp,
      formatProp,
      emphasisProp,
      {
        defaultValue: 'false',
        description: 'Rounds the line interpolation.',
        name: 'isSmooth',
        type: 'boolean',
      },
      {
        defaultValue: 'false',
        description: 'Stacks series to show their combined composition.',
        name: 'isStacked',
        type: 'boolean',
      },
      seriesStylesProp
    ),
    when: 'Use when magnitude matters in addition to direction.',
  },
  {
    code: code(
      'Bar',
      `      categories={categories}
      series={series}
      orientation="vertical"`
    ),
    description: 'Compare discrete values across a small set of categories.',
    id: 'bar',
    name: 'Bar',
    platforms: everywhere,
    preview: <Chart.Bar categories={categories} height={300} series={series} />,
    props: withPlotControls(
      categoriesProp,
      seriesProp,
      formatProp,
      emphasisProp,
      {
        defaultValue: '"vertical"',
        description: 'Direction in which bars grow.',
        name: 'orientation',
        type: '"horizontal" | "vertical"',
      },
      seriesStylesProp
    ),
    when: 'Use for exact category comparison; switch to horizontal for long labels.',
  },
  {
    code: code(
      'StackedBar',
      `      categories={categories}
      series={series}
      isNormalized`
    ),
    description: 'Compare category totals and the composition inside each total.',
    id: 'stacked-bar',
    name: 'Stacked bar',
    platforms: everywhere,
    preview: <Chart.StackedBar categories={categories} height={300} isNormalized series={series} />,
    props: withPlotControls(
      categoriesProp,
      seriesProp,
      formatProp,
      emphasisProp,
      {
        defaultValue: 'false',
        description: 'Normalizes every stack to 100 percent.',
        name: 'isNormalized',
        type: 'boolean',
      },
      {
        defaultValue: '"vertical"',
        description: 'Direction in which stacks grow.',
        name: 'orientation',
        type: '"horizontal" | "vertical"',
      },
      seriesStylesProp
    ),
    when: 'Normalize when composition matters more than absolute total.',
  },
  {
    code: code(
      'Pie',
      `      data={data}
      otherLabel="Other"
      maxSlices={4}`
    ),
    description: 'Show a simple part-to-whole relationship with a short tail.',
    id: 'pie',
    name: 'Pie',
    platforms: everywhere,
    preview: (
      <Chart.Pie
        data={[
          {id: 'direct', label: 'Direct', value: 46},
          {id: 'search', label: 'Search', value: 31},
          {id: 'social', label: 'Social', value: 15},
          {id: 'other', label: 'Other', value: 8},
        ]}
        height={300}
      />
    ),
    props: withBase(
      {
        description: 'Part-to-whole values ordered by importance.',
        name: 'data',
        required: true,
        type: 'ChartDatum[]',
      },
      formatProp,
      {
        defaultValue: 'false',
        description: 'Fills the center to render a full pie.',
        name: 'isSolid',
        type: 'boolean',
      },
      {
        defaultValue: '3',
        description: 'Number of slices retained before folding the tail.',
        name: 'maxSlices',
        type: 'number',
      },
      {
        description: 'Translated label used for the folded tail.',
        name: 'otherLabel',
        type: 'string',
      }
    ),
    when: 'Use for two to five parts. Prefer bars when precise comparison matters.',
  },
  {
    code: code('Gauge', `      value={72}\n      max={100}`),
    description: 'Show one current value against a fixed bounded range.',
    id: 'gauge',
    name: 'Gauge',
    platforms: everywhere,
    preview: <Chart.Gauge height={240} max={100} value={72} />,
    props: withHeight(
      withBase(
        {
          description: 'Current measured value.',
          name: 'value',
          required: true,
          type: 'number',
        },
        {
          description: 'Upper bound of the range. Optional on native, where it defaults to 100.',
          name: 'max',
          required: true,
          type: 'number',
        },
        {
          defaultValue: '0',
          description: 'Lower bound of the range.',
          name: 'min',
          type: 'number',
        },
        formatProp
      ),
      '200'
    ),
    when: 'Use for capacity and progress with a meaningful maximum.',
  },
  {
    code: code(
      'Meter',
      `      label="Storage used"
      value={72}
      max={100}`
    ),
    description: 'A compact accessible scalar for rows, settings and summaries.',
    id: 'meter',
    name: 'Meter',
    platforms: everywhere,
    preview: <Chart.Meter label="Storage used" max={100} value={72} />,
    props: [
      {
        description: 'Accessible label rendered above the meter.',
        name: 'label',
        required: true,
        type: 'string',
      },
      {
        description: 'Current measured value.',
        name: 'value',
        required: true,
        type: 'number',
      },
      {
        description: 'Upper bound of the meter.',
        name: 'max',
        required: true,
        type: 'number',
      },
      formatProp,
      {
        defaultValue: 'true',
        description: 'Displays the numeric value next to the label.',
        name: 'showValue',
        type: 'boolean',
      },
      classNameProp,
      surfaceProp,
    ],
    when: 'Use instead of a gauge when vertical space is limited.',
  },
  {
    code: code('Histogram', `      values={observations}\n      binCount={8}`),
    description: 'Reveal the distribution of raw numeric observations.',
    id: 'histogram',
    name: 'Histogram',
    platforms: everywhere,
    preview: (
      <Chart.Histogram
        binCount={8}
        height={300}
        values={[12, 18, 21, 21, 24, 27, 29, 31, 31, 32, 34, 35, 35, 36, 39, 42, 44, 47, 51, 57, 62, 69]}
      />
    ),
    props: withBase(
      {
        description: 'Raw observations; binning is handled by the component.',
        name: 'values',
        required: true,
        type: 'number[]',
      },
      {
        defaultValue: '10',
        description: 'Number of equal-width bins.',
        name: 'binCount',
        type: 'number',
      },
      {
        description: 'Formatting used for bin boundaries.',
        name: 'valueFormat',
        type: 'ChartNumberFormat',
      },
      axisProp
    ),
    when: 'Use when shape, spread and outliers matter more than individual values.',
  },
  {
    code: code('Boxplot', `      groups={groups}\n      labels={labels}`),
    description: 'Compare five-number summaries and outliers across groups.',
    id: 'boxplot',
    name: 'Boxplot',
    platforms: everywhere,
    preview: (
      <Chart.Boxplot
        groups={[
          {
            id: 'a',
            label: 'Starter',
            max: 91,
            median: 54,
            min: 12,
            outliers: [98],
            q1: 34,
            q3: 72,
          },
          {
            id: 'b',
            label: 'Pro',
            max: 84,
            median: 61,
            min: 24,
            outliers: [],
            q1: 45,
            q3: 74,
          },
        ]}
        height={300}
        labels={{
          max: 'Max',
          median: 'Median',
          min: 'Min',
          q1: 'Q1',
          q3: 'Q3',
        }}
      />
    ),
    props: withBase(
      {
        description: 'Five-number summaries and optional outliers.',
        name: 'groups',
        required: true,
        type: 'ChartBoxplotGroup[]',
      },
      {
        description: 'Translated labels for summary statistics.',
        name: 'labels',
        required: true,
        type: 'BoxplotLabels',
      },
      formatProp,
      {
        defaultValue: '"vertical"',
        description: 'Direction of the value axis.',
        name: 'orientation',
        type: '"horizontal" | "vertical"',
      },
      axisProp
    ),
    when: 'Use to compare distributions when raw observations are not required.',
  },
  {
    code: code(
      'Candlestick',
      `      data={candles}
      format={{ prefix: '$' }}
      showVolume`
    ),
    description: 'Show open, high, low and close for each session, with optional volume.',
    id: 'candlestick',
    name: 'Candlestick',
    platforms: everywhere,
    preview: <Chart.Candlestick data={candles} format={{prefix: '$'}} height={320} showVolume />,
    props: withPlotControls(
      {
        description: 'One entry per session, in chronological order.',
        name: 'data',
        required: true,
        type: 'ChartCandlestickDatum[]',
      },
      formatProp,
      {
        defaultValue: 'false',
        description: 'Adds a volume histogram beneath the price plot. Needs `volume` on each datum.',
        name: 'showVolume',
        type: 'boolean',
      },
      {
        description: 'Candle body, wick and volume colors, plus hollow-up rendering.',
        name: 'style',
        type: 'ChartCandlestickStyle',
      }
    ),
    when: 'Use for OHLC price data. For a single measure over time reach for Line or Time series instead — a candlestick spends four values of ink on one.',
  },
  {
    code: code('DivergingBar', `      data={changes}\n      format={{ suffix: '%' }}`),
    description: 'Compare positive and negative values around a shared zero.',
    id: 'diverging-bar',
    name: 'Diverging bar',
    platforms: everywhere,
    preview: (
      <Chart.DivergingBar
        data={[
          {id: 'north', label: 'North', value: 18},
          {id: 'south', label: 'South', value: -12},
          {id: 'east', label: 'East', value: 9},
          {id: 'west', label: 'West', value: -7},
        ]}
        format={{suffix: '%'}}
        height={300}
      />
    ),
    props: withBase(
      {
        description: 'Signed values positioned around zero.',
        name: 'data',
        required: true,
        type: 'ChartDatum[]',
      },
      formatProp,
      {
        defaultValue: '"horizontal"',
        description: 'Direction in which values diverge.',
        name: 'orientation',
        type: '"horizontal" | "vertical"',
      },
      axisProp
    ),
    when: 'Use for variance, sentiment, gain/loss and change from baseline.',
  },
  {
    code: code(
      'Dumbbell',
      `      rows={rows}
      beforeLabel="2025"
      afterLabel="2026"`
    ),
    description: 'Show movement between exactly two measurements per item.',
    id: 'dumbbell',
    name: 'Dumbbell',
    platforms: everywhere,
    preview: (
      <Chart.Dumbbell
        afterLabel="2026"
        beforeLabel="2025"
        height={300}
        rows={[
          {after: 72, before: 54, id: 'activation', label: 'Activation'},
          {after: 61, before: 68, id: 'retention', label: 'Retention'},
          {after: 84, before: 63, id: 'quality', label: 'Quality'},
        ]}
      />
    ),
    props: withBase(
      {
        description: 'Paired before and after values.',
        name: 'rows',
        required: true,
        type: 'ChartDumbbellRow[]',
      },
      {
        description: 'Translated label for the first measurement.',
        name: 'beforeLabel',
        required: true,
        type: 'string',
      },
      {
        description: 'Translated label for the second measurement.',
        name: 'afterLabel',
        required: true,
        type: 'string',
      },
      formatProp,
      axisProp
    ),
    when: 'Use when the story is change between two known states.',
  },
  {
    code: code('Funnel', `      stages={stages}\n      format={{ suffix: ' users' }}`),
    description: 'Show ordered attrition through a sequence of stages.',
    id: 'funnel',
    name: 'Funnel',
    platforms: everywhere,
    preview: (
      <Chart.Funnel
        height={300}
        stages={[
          {id: 'visit', label: 'Visited', value: 1200},
          {id: 'trial', label: 'Started trial', value: 740},
          {id: 'active', label: 'Activated', value: 460},
          {id: 'paid', label: 'Paid', value: 210},
        ]}
      />
    ),
    props: withBase(
      {
        description: 'Stages ordered from widest to narrowest.',
        name: 'stages',
        required: true,
        type: 'ChartDatum[]',
      },
      formatProp
    ),
    when: 'Use only when each stage is a subset of the previous stage.',
  },
  {
    code: code(
      'Heatmap',
      `      columns={days}
      rows={hours}
      cells={cells}`
    ),
    description: 'Display magnitude across two categorical dimensions.',
    id: 'heatmap',
    name: 'Heatmap',
    platforms: everywhere,
    preview: (
      <Chart.Heatmap
        cells={heatCells}
        columns={categories}
        height={300}
        rows={['Morning', 'Noon', 'Evening', 'Night']}
      />
    ),
    props: withBase(
      {
        description: 'Grid cells addressed by row and column index.',
        name: 'cells',
        required: true,
        type: 'ChartHeatmapCell[]',
      },
      {
        description: 'Column axis labels.',
        name: 'columns',
        required: true,
        type: 'string[]',
      },
      {
        description: 'Row axis labels.',
        name: 'rows',
        required: true,
        type: 'string[]',
      },
      formatProp,
      axisProp
    ),
    when: 'Use to expose clusters and patterns in a dense matrix.',
  },
  {
    code: code('Radar', `      axes={axes}\n      series={series}`),
    description: 'Compare multivariate profiles on a shared set of bounded axes.',
    id: 'radar',
    name: 'Radar',
    platforms: everywhere,
    preview: (
      <Chart.Radar
        axes={[
          {label: 'Speed', max: 100},
          {label: 'Quality', max: 100},
          {label: 'Reach', max: 100},
          {label: 'Value', max: 100},
          {label: 'Ease', max: 100},
        ]}
        height={320}
        series={[
          {id: 'starter', label: 'Starter', values: [72, 61, 88, 79, 92]},
          {id: 'pro', label: 'Pro', values: [91, 84, 74, 88, 68]},
        ]}
      />
    ),
    props: withBase(
      {
        description: 'Labels and upper bounds for each dimension.',
        name: 'axes',
        required: true,
        type: 'ChartRadarAxis[]',
      },
      seriesProp,
      formatProp
    ),
    when: 'Use for profile shape, not precise lookup; keep dimensions limited.',
  },
  {
    code: code(
      'Scatter',
      `      series={series}
      xLabel="Spend"
      yLabel="Revenue"`
    ),
    description: 'Reveal relationships, clusters and outliers between two measures.',
    id: 'scatter',
    name: 'Scatter',
    platforms: everywhere,
    preview: (
      <Chart.Scatter
        height={300}
        series={[
          {
            id: 'accounts',
            label: 'Accounts',
            points: [
              {label: 'A', size: 24, x: 12, y: 42},
              {label: 'B', size: 48, x: 24, y: 61},
              {label: 'C', size: 32, x: 38, y: 68},
              {label: 'D', size: 62, x: 54, y: 89},
              {label: 'E', size: 28, x: 68, y: 78},
            ],
          },
        ]}
        xLabel="Spend"
        yLabel="Revenue"
      />
    ),
    props: withBase(
      {
        description: 'Named groups of points in a two-measure space.',
        name: 'series',
        required: true,
        type: 'ChartScatterSeries[]',
      },
      {
        description: 'Label shown for the horizontal measure.',
        name: 'xLabel',
        type: 'string',
      },
      {
        description: 'Number formatting for horizontal values.',
        name: 'xFormat',
        type: 'ChartNumberFormat',
      },
      {
        description: 'Label shown for the vertical measure.',
        name: 'yLabel',
        type: 'string',
      },
      {
        description: 'Number formatting for vertical values.',
        name: 'yFormat',
        type: 'ChartNumberFormat',
      },
      axisProp
    ),
    when: 'Use for correlation and distribution across two numeric dimensions.',
  },
  {
    code: code('Sankey', `      nodes={nodes}\n      links={links}`),
    description: 'Trace weighted flow between named nodes and stages.',
    id: 'sankey',
    name: 'Sankey',
    platforms: everywhere,
    preview: (
      <Chart.Sankey
        height={320}
        links={[
          {source: 'visits', target: 'trial', value: 72},
          {source: 'visits', target: 'exit', value: 28},
          {source: 'trial', target: 'paid', value: 44},
          {source: 'trial', target: 'churn', value: 28},
        ]}
        nodes={[
          {id: 'visits', label: 'Visits'},
          {id: 'trial', label: 'Trial'},
          {id: 'exit', label: 'Exit'},
          {id: 'paid', label: 'Paid'},
          {id: 'churn', label: 'Churn'},
        ]}
      />
    ),
    props: withHeight(
      withBase(
        {
          description: 'Named nodes referenced by links.',
          name: 'nodes',
          required: true,
          type: 'ChartFlowNode[]',
        },
        {
          description: 'Weighted source-to-target relationships.',
          name: 'links',
          required: true,
          type: 'ChartFlowLink[]',
        },
        formatProp
      ),
      '300'
    ),
    when: 'Use when flow volume between states is the primary story.',
  },
  {
    code: code('Sunburst', `      nodes={hierarchy}`),
    description: 'Show hierarchical part-to-whole relationships in concentric rings.',
    id: 'sunburst',
    name: 'Sunburst',
    platforms: everywhere,
    preview: <Chart.Sunburst height={320} nodes={hierarchy} />,
    props: withBase(
      {
        description: 'Nested hierarchy; leaf nodes carry values.',
        name: 'nodes',
        required: true,
        type: 'ChartHierarchyNode[]',
      },
      formatProp
    ),
    when: 'Use when both hierarchy depth and part-to-whole structure matter.',
  },
  {
    code: code('Treemap', `      nodes={hierarchy}`),
    description: 'Fit hierarchical part-to-whole data into a compact rectangle.',
    id: 'treemap',
    name: 'Treemap',
    platforms: everywhere,
    preview: <Chart.Treemap height={320} nodes={hierarchy} />,
    props: withBase(
      {
        description: 'Nested hierarchy; leaf nodes carry values.',
        name: 'nodes',
        required: true,
        type: 'ChartHierarchyNode[]',
      },
      formatProp
    ),
    when: 'Use when screen efficiency matters more than reading hierarchy depth.',
  },
  {
    code: code(
      'TimeSeries',
      `      points={points}
      series={series}
      height={320}`
    ),
    description: 'Render tens of thousands of ordered time points efficiently.',
    id: 'time-series',
    name: 'Time series',
    platforms: everywhere,
    preview: (
      <Chart.TimeSeries
        height={300}
        points={timePoints}
        series={[
          {id: 'requests', label: 'Requests'},
          {id: 'errors', label: 'Errors'},
        ]}
      />
    ),
    props: [
      {
        description: 'Parallel timestamp and value arrays optimized for density.',
        name: 'points',
        required: true,
        type: 'ChartTimePoints',
      },
      {
        description: 'Series identity and colour only — the values live in points.',
        name: 'series',
        required: true,
        type: 'Omit<ChartSeries, "values">[]',
      },
      formatProp,
      axisProp,
      ...baseProps,
    ],
    when: 'Use for dense telemetry. Prefer Line for small human-scale datasets.',
  },
  {
    code: code('Sparkline', `      values={[12, 18, 14, 24, 31, 29]}\n      slot={1}`),
    description: 'A tiny trend shape without axes, tooltip or legend.',
    id: 'sparkline',
    name: 'Sparkline',
    platforms: everywhere,
    preview: (
      <div className={styles.compactPreview()}>
        <Chart.Sparkline height={72} slot={1} values={[12, 18, 14, 24, 31, 29, 38]} />
      </div>
    ),
    props: [
      {
        description: 'Ordered values used to draw the trend.',
        name: 'values',
        required: true,
        type: 'number[]',
      },
      {
        description: 'Palette slot used for the stroke.',
        name: 'slot',
        type: 'number',
      },
      {
        description: 'Explicit stroke color overriding the palette.',
        name: 'color',
        type: 'string',
      },
      classNameProp,
      {...heightProp, defaultValue: '32'},
      isLoadingProp,
      surfaceProp,
    ],
    when: 'Use inside a table row or card as context, never for exact lookup.',
  },
]

const chartGroups = groupCharts(chartDocs)
const chartIds = chartGroups.flatMap(group => group.charts.map(chart => chart.id))

const guidePages = [
  'introduction',
  'installation',
  'data-types',
  'builders',
  'loading-states',
  'theming',
  'dark-mode',
  'web-package',
  'composition',
  'native-package',
  'native-ios',
  'native-android',
  ...chartIds,
  'use-chart-scrub',
  'use-last-reading',
  'revolut',
  'kraken',
  'family',
  'health',
  'stocks',
  'releases',
  'changelog',
]

const guidePageHeadings: Record<string, {id: string; label: string}[]> = {
  builders: [
    {id: 'builders', label: 'Builders'},
    {id: 'builder-zyplot', label: 'zyplot'},
    {id: 'builder-series', label: 'series and seriesProps'},
    {id: 'builder-annotation', label: 'annotation'},
    {id: 'builder-axis', label: 'axis'},
    {id: 'builder-reveal', label: 'reveal'},
    {id: 'builder-marker', label: 'marker'},
    {id: 'builder-passthroughs', label: 'The passthroughs'},
  ],
  changelog: [{id: 'changelog', label: 'Changelog'}],
  composition: [
    {id: 'composition', label: 'Frame and legend'},
    {id: 'frame-props', label: 'Frame props'},
    {id: 'legend-props', label: 'Legend props'},
  ],
  'dark-mode': [
    {id: 'dark-mode', label: 'Light and dark mode'},
    {id: 'color-modes', label: 'Resolution'},
    {id: 'css-variables', label: 'The CSS contract'},
  ],
  'data-types': [
    {id: 'data-types', label: 'Data'},
    {id: 'chart-series', label: 'ChartSeries'},
    {id: 'chart-datum', label: 'ChartDatum'},
    {id: 'chart-options', label: 'Axes and number formatting'},
    {id: 'chart-legend', label: 'ChartLegendItem'},
    {id: 'specialized-data', label: 'Specialized data'},
    {id: 'finance-data', label: 'Candlestick data'},
    {id: 'axis-options', label: 'Axis options'},
    {id: 'annotations', label: 'Annotations'},
    {id: 'interaction', label: 'Interaction'},
    {id: 'plot-style', label: 'Plot and series style'},
  ],
  family: [
    {id: 'family', label: 'Family'},
    {id: 'family-arrival', label: 'The wave that becomes the price'},
    {id: 'family-scrub', label: 'A step back with a beat'},
    {id: 'family-source', label: 'What it uses'},
  ],
  health: [
    {id: 'health', label: 'Health'},
    {id: 'health-overlay', label: 'The scale inside the plot'},
    {id: 'health-span', label: 'Two fingers, one total'},
    {id: 'health-source', label: 'What it uses'},
  ],
  installation: [
    {id: 'installation', label: 'Installation'},
    {id: 'entry-points', label: 'Entry points'},
  ],
  introduction: [{id: 'getting-started', label: 'Getting started'}],
  kraken: [
    {id: 'kraken', label: 'Kraken'},
    {id: 'kraken-fill', label: 'The dotted fill'},
    {id: 'kraken-trail', label: 'The trail scrub'},
    {id: 'kraken-source', label: 'What it uses'},
  ],
  'loading-states': [
    {id: 'loading-states', label: 'Loading'},
    {id: 'skeleton-props', label: 'Skeleton props'},
    {id: 'custom-skeleton', label: 'Custom skeleton'},
  ],
  'native-android': [
    {id: 'native-android', label: 'Android'},
    {id: 'native-android-extensions', label: 'Android-only charts'},
    {id: 'native-android-axis', label: 'Android axis options'},
  ],
  'native-ios': [
    {id: 'native-ios', label: 'iOS'},
    {id: 'native-ios-extensions', label: 'iOS-only charts'},
    {id: 'native-ios-axis', label: 'iOS axis options'},
  ],
  'native-package': [
    {id: 'native-package', label: 'Native overview'},
    {id: 'native-install', label: 'Installation'},
    {id: 'native-platform-files', label: 'Platform-specific files'},
    {id: 'native-coverage', label: 'Chart coverage'},
    {id: 'native-presentation', label: 'The presentation vocabulary'},
    {id: 'native-scrubbing', label: 'Scrubbing'},
    {id: 'native-axes', label: 'Native axis options'},
    {id: 'native-differences', label: 'Differences from web'},
  ],
  releases: [{id: 'releases', label: 'Releases'}],
  revolut: [
    {id: 'revolut', label: 'Revolut'},
    {id: 'revolut-source', label: 'What it uses'},
  ],
  stocks: [
    {id: 'stocks', label: 'Stocks'},
    {id: 'stocks-grid', label: 'Measuring the plot box'},
    {id: 'stocks-span', label: 'A span the chart paints'},
    {id: 'stocks-source', label: 'What it uses'},
  ],
  theming: [
    {id: 'theming', label: 'Theming'},
    {id: 'theme-keys', label: 'The theme contract'},
    {id: 'chart-theme', label: 'A theme on one chart'},
    {id: 'surface', label: 'The chart surface'},
    {id: 'provider-props', label: 'Provider props'},
  ],
  'use-chart-scrub': [
    {id: 'use-chart-scrub', label: 'useChartScrub'},
    {id: 'scrub-returns', label: 'What it returns'},
    {id: 'scrub-overlay', label: 'Drawing your own overlay'},
  ],
  'use-last-reading': [
    {id: 'use-last-reading', label: 'useLastReading'},
    {id: 'reading-arguments', label: 'Arguments'},
  ],
  'web-package': [
    {id: 'web-package', label: 'The web renderer'},
    {id: 'web-engines', label: 'What draws what'},
    {id: 'web-legend', label: 'Text stays in the DOM'},
    {id: 'web-server-components', label: 'Server components'},
  ],
}

const supportLinks = (
  <>
    <a
      className={styles.sidebarFooterLink()}
      data-analytics="github_click"
      data-analytics-placement="docs"
      href={REPOSITORY_URL}
    >
      <GithubMark className={styles.sidebarFooterMark()} />
      GitHub
    </a>
    <a
      className={styles.sidebarFooterLink()}
      data-analytics="coffee_click"
      data-analytics-placement="docs"
      href={COFFEE_URL}
    >
      <CoffeeMark className={styles.sidebarFooterMark()} />
      Buy me a coffee
    </a>
  </>
)

export const DocsLayout = ({children}: {children: ReactNode}) => (
  <div className={styles.site()}>
    <header className={styles.mobileHeader()}>
      <div className={styles.mobileHeaderBrand()}>
        <Link className={styles.brandLink()} href="/">
          <Wordmark className={styles.wordmark()} />
        </Link>
        <span className={styles.brandLabel()}>Docs</span>
      </div>
      <div className={styles.mobileHeaderActions()}>
        <ThemeToggle />
        <MobileNav>
          <DocsNav chartGroups={chartGroups} label="Documentation menu" />
          <div className={styles.sidebarFooter()}>{supportLinks}</div>
        </MobileNav>
      </div>
    </header>
    <div className={styles.themeCorner()}>
      <div className={styles.themeCornerInner()}>
        <ThemeToggle />
      </div>
    </div>

    <aside className={styles.sidebar()}>
      <div className={styles.sidebarTop()}>
        <div className={styles.sidebarBrand()}>
          <Link className={styles.brandLink()} href="/">
            <Wordmark className={styles.wordmark()} />
          </Link>
          <span className={styles.brandLabel()}>Docs</span>
        </div>
      </div>
      <DocsNav chartGroups={chartGroups} label="Documentation" />
      <div className={styles.sidebarFooter()}>{supportLinks}</div>
    </aside>
    {children}
  </div>
)

export const DocsPage = ({
  page = 'introduction',
  preferences = DEFAULT_PREFERENCES,
}: {
  page?: string
  preferences?: DocsPreferences
}) => {
  const pageIndex = Math.max(0, guidePages.indexOf(page))
  const previousPage = guidePages[pageIndex - 1]
  const nextPage = guidePages[pageIndex + 1]
  const currentChart = chartDocs.find(chart => chart.id === page)
  const pageHeadings = currentChart
    ? [
        {id: currentChart.id, label: currentChart.name},
        {id: `${currentChart.id}-props`, label: 'Props'},
      ]
    : (guidePageHeadings[page] ?? guidePageHeadings.introduction)

  return (
    <>
      <main className={styles.content()}>
        <section className={cn(styles.hero(), page !== 'introduction' && 'hidden')} id="getting-started">
          <p className={styles.kicker()}>Getting started</p>
          <h1>{HERO_HEADLINE}</h1>
          <p>{HERO_LEDE}</p>
        </section>

        <section className={cn(styles.section(), page !== 'installation' && 'hidden')} id="installation">
          <h2>Installation</h2>
          <p>
            One package covers every platform. There is nothing else to add for iOS or Android — the native modules ship
            inside it.
          </p>
          <PackageInstall />
          <div className={styles.note()}>
            <strong>No stylesheet import.</strong> Zyplot includes its compiled styles through the same import that
            reaches a chart, so there is no CSS path to remember and nothing a tree shake can drop. Your application
            does not need Tailwind CSS — and if it has its own, ours arrives in the <code>base</code> cascade layer,
            where it loses to everything your app writes. Two builds of the same utility names would otherwise collide,
            with the one a chart pulled in coming second.
          </div>
          <h3 id="entry-points">Entry points</h3>
          <p>
            A plain <code>@hzblj/zyplot</code> import resolves to the renderer the current target needs, and gives you
            the chart forms that exist everywhere. The three subpaths name a platform outright, and are how you reach
            forms only one renderer has.
          </p>
          <PropsTable
            rows={[
              {
                description:
                  'Resolves per target: ECharts and uPlot on the web, the native module under React Native. Exposes the twenty-one shared forms.',
                name: '@hzblj/zyplot',
                type: 'any target',
              },
              {
                description:
                  'The DOM renderer, and the only entry with Chart.Frame, Chart.Legend and a .Skeleton on every form.',
                name: '@hzblj/zyplot/web',
                type: 'web',
              },
              {
                description:
                  'Shared forms plus Chart.Range and Chart.Rule, and the Swift Charts scrolling options on xAxis.',
                name: '@hzblj/zyplot/ios',
                type: 'iOS',
              },
              {
                description:
                  'Shared forms plus Chart.Lollipop and Chart.Waterfall, and Compose label overflow on both axes.',
                name: '@hzblj/zyplot/android',
                type: 'Android',
              },
            ]}
          />
          <p>
            All four carry <Link href="/docs/builders">zyplot</Link>, the builders it hands out and{' '}
            <Link href="/docs/hooks/use-last-reading">
              <code>useLastReading</code>
            </Link>
            , so a helper that assembles chart props is not tied to a platform.{' '}
            <Link href="/docs/hooks/use-chart-scrub">
              <code>useChartScrub</code>
            </Link>{' '}
            is on all four: a finger on the native entries, a pointer on the web one, reported as the same phases.
          </p>
        </section>

        <section className={cn(styles.section(), page !== 'web-package' && 'hidden')} id="web-package">
          <p className={styles.kicker()}>Web</p>
          <h2>The web renderer</h2>
          <p>
            <code>@hzblj/zyplot/web</code> draws in the DOM. A plain <code>@hzblj/zyplot</code> import already resolves
            here on every target except React Native, so naming the subpath only matters in a project that has both. It
            is also the only entry point that carries <code>Chart.Frame</code>, <code>Chart.Legend</code> and a{' '}
            <code>.Skeleton</code> on every form — all three are DOM composition with no native counterpart.{' '}
            <code>Chart.Provider</code> exists on every entry point, but only here does it take <code>colorMode</code>{' '}
            and a <code>className</code>.
          </p>

          <h3 id="web-engines">What draws what</h3>
          <p>
            Component names are the form, not the engine. <code>Chart.Line</code> and <code>Chart.TimeSeries</code> both
            draw a line — you pick between them on point count, never on renderer.
          </p>
          <PropsTable
            rows={[
              {
                description:
                  'Eighteen of the twenty-one forms, Line through Treemap. Series types are registered per chart file, so a page with one line chart does not ship the sankey, sunburst and boxplot code.',
                name: 'ECharts',
                type: 'canvas',
              },
              {
                description:
                  'Chart.TimeSeries and Chart.Sparkline. Tens of thousands of points, or forty sparklines in a table, where one scene graph per row would drop frames.',
                name: 'uPlot',
                type: 'canvas',
              },
              {
                description:
                  'Chart.Meter is a filled track — two elements, role="meter" and no engine, so it is the only form whose final markup is painted on the server instead of after a first read off the document.',
                name: 'Plain DOM',
                type: 'no engine',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>The engine is also what animates.</strong> Every ECharts form reads <code>animation</code> — its{' '}
            <code>duration</code>, <code>delay</code>, <code>easing</code>, and <code>enabled: false</code> to turn the
            whole thing off — so one animation set on a page is one animation for every chart on it. The two uPlot forms
            and the meter draw their marks in one pass instead: <code>Chart.Sparkline</code> and{' '}
            <code>Chart.Meter</code> do not declare the prop, and <code>Chart.TimeSeries</code> accepts it with the rest
            of the base props and times nothing by it. <code>animation.transition</code> is not read here either: a data
            change moves the marks that are on both sides and fades the ones that are not, which is a better answer to a
            changed axis than dissolving the plot, so the web does it whichever name the prop is given.
          </div>

          <h3 id="web-legend">Text stays in the DOM</h3>
          <p>
            Only marks and axis ticks are painted into the canvas. The legend is React: every chart with two or more
            series renders one on its own, a single series never does, and the labels stay selectable, translatable and
            reachable by a screen reader.
          </p>

          <h3 id="web-server-components">Server components</h3>
          <p>
            Chart props stay serializable — no formatter callbacks, no render props — so a server component can render a
            chart without a client boundary of its own. Anything that would have been a callback is expressed as data
            instead, which is what <code>ChartNumberFormat</code> is for.
          </p>
          <div className={styles.note()}>
            <strong>Colors are read off the document.</strong> A canvas takes color as a string, so each chart reads the
            resolved <code>--zyplot-*</code> values from the DOM after mounting and repaints when they change. Until
            that first read there is nothing honest to paint, so a chart that says nothing about <code>isLoading</code>{' '}
            covers that frame with its placeholder — which is what a server-rendered page wants, markup to paint before
            hydration. A chart mounted with its data already in hand can say <code>isLoading={'{false}'}</code> and{' '}
            <Link href="/docs/loading-states">have the plot fade in instead</Link>.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'native-package' && 'hidden')} id="native-package">
          <p className={styles.kicker()}>Native</p>
          <h2>iOS and Android</h2>
          <p>
            Zyplot ships an Expo module that draws with the platform's own graphics stack — Swift Charts on iOS, Jetpack
            Compose Canvas on Android — behind the same <code>Chart</code> namespace the web renderer exposes. There is
            no WebView.
          </p>

          <h3 id="native-install">Installation</h3>
          <p>
            The same single package you installed for the web carries the native code; autolinking picks it up. Rebuild
            the native project after adding it. These are native modules, so Expo Go cannot load them: use a development
            build.
          </p>
          <CodeBlock language="bash">{`yarn add @hzblj/zyplot

npx expo prebuild
npx expo run:ios
npx expo run:android`}</CodeBlock>
          <div className={styles.note()}>
            <strong>iOS 17 and newer.</strong> Swift Charts features used by the renderer require a deployment target of
            17.0. Set it with <code>expo-build-properties</code> if your app targets something lower.
          </div>
          <p>
            Import from <code>@hzblj/zyplot</code> and the correct renderer is picked per platform — the same source
            builds for web, iOS and Android.
          </p>
          <CodeBlock>{`import { Chart } from '@hzblj/zyplot'

export function Revenue() {
  return (
    <Chart.Line
      categories={['Jan', 'Feb', 'Mar']}
      format={{ prefix: '$' }}
      series={[{ id: 'revenue', label: 'Revenue', values: [42, 56, 51] }]}
    />
  )
}`}</CodeBlock>

          <h3 id="native-platform-files">Platform-specific files</h3>
          <p>
            A few forms exist on one platform only, because the underlying renderer has a mark the other has no honest
            equivalent for. They are not on the shared namespace — reaching for one would type-check and then render
            nothing on the platform that lacks it.
          </p>
          <p>
            Instead, give the component one file per platform and let Metro choose. Write the shared parts once, import
            the platform entry point in the file that is already committed to that platform, and drop the{' '}
            <code>Platform.OS</code> branches entirely.
          </p>
          <CodeBlock language="text">{`forecast.ios.tsx      imports @hzblj/zyplot/ios
forecast.android.tsx  imports @hzblj/zyplot/android
forecast.tsx          optional web or fallback version`}</CodeBlock>
          <CodeBlock>{`// forecast.ios.tsx
import { Chart } from '@hzblj/zyplot/ios'

export const Forecast = ({ bands }: ForecastProps) => (
  <Chart.Range data={bands} height={300} />
)`}</CodeBlock>
          <CodeBlock>{`// forecast.android.tsx
import { Chart } from '@hzblj/zyplot/android'

export const Forecast = ({ bands }: ForecastProps) => (
  <Chart.Lollipop data={bands.map(toPoint)} height={300} />
)`}</CodeBlock>
          <p>
            The call site imports <code>./forecast</code> with no extension and never learns which one it got. This is
            the same convention Expo's own UI packages use.
          </p>
          <div className={styles.note()}>
            <strong>Keep a base file for TypeScript.</strong> <code>tsc</code> does not know about platform extensions,
            so <code>./forecast</code> needs a plain <code>forecast.tsx</code> to resolve to. It doubles as the web
            version, or returns <code>null</code> if the component is native-only.
          </div>

          <h3 id="native-coverage">Chart coverage</h3>
          <p>
            All twenty-one shared chart kinds render on both native platforms, and each platform adds two of its own.
            Most take exactly the props documented under Charts; eleven differ, and they are listed below the coverage
            table.
          </p>
          <PropsTable
            rows={[
              {
                description: 'Line, Area, Bar, StackedBar, TimeSeries, Sparkline, Scatter, Histogram.',
                name: 'Cartesian',
                type: 'web · iOS · Android',
              },
              {
                description: 'Pie, Gauge, Meter, Radar, Sunburst, Treemap, Funnel, Sankey.',
                name: 'Radial and flow',
                type: 'web · iOS · Android',
              },
              {
                description: 'Candlestick, Boxplot, DivergingBar, Dumbbell, Heatmap.',
                name: 'Statistical and finance',
                type: 'web · iOS · Android',
              },
              {
                description: 'Chart.Range and Chart.Rule, built on Swift Charts marks with no web equivalent.',
                name: 'iOS extensions',
                type: 'iOS only',
              },
              {
                description: 'Chart.Waterfall and Chart.Lollipop, with no web equivalent.',
                name: 'Android extensions',
                type: 'Android only',
              },
            ]}
          />
          <p>
            Where a form's data prop is named differently, or a web-only option has no native counterpart, the compiler
            says so — these are separate prop types, not one type with fields the native renderer drops.
          </p>
          <PropsTable
            rows={[
              {
                description: 'The stages are data on native. Same ChartDatum[], same order.',
                name: 'Chart.Funnel',
                type: 'stages → data',
              },
              {
                description: 'The hierarchy is data on both forms natively.',
                name: 'Chart.Sunburst · Chart.Treemap',
                type: 'nodes → data',
              },
              {
                description:
                  'Native takes innerRadius, a fraction that hollows the middle, instead of the web isSolid, maxSlices and otherLabel. Fold the tail yourself before passing the data.',
                name: 'Chart.Pie',
                type: 'innerRadius',
              },
              {
                description: 'Native adds label, and max is optional there — it defaults to 100.',
                name: 'Chart.Gauge',
                type: 'label, optional max',
              },
              {
                description:
                  'Native takes the gauge props — value, max, min, label — so there is no showValue, and label is optional.',
                name: 'Chart.Meter',
                type: 'gauge props',
              },
              {
                description:
                  'Native takes rows alone; label the two ends in your own view. Both platforms read the pair off each row.',
                name: 'Chart.Dumbbell',
                type: 'no beforeLabel / afterLabel',
              },
              {
                description: 'Use format for the bin boundaries on native — it is on every native chart.',
                name: 'Chart.Histogram',
                type: 'no valueFormat',
              },
              {
                description: 'Bars always run horizontally on native.',
                name: 'Chart.DivergingBar',
                type: 'no orientation',
              },
              {
                description: 'Native takes an explicit color instead of a palette slot.',
                name: 'Chart.Sparkline',
                type: 'no slot',
              },
              {
                description:
                  'Native takes labels — your five words for open, high, low, close and change — and the tooltip then lists every reading instead of just the close.',
                name: 'Chart.Candlestick',
                type: 'adds labels',
              },
            ]}
          />

          <h3 id="native-presentation">The presentation vocabulary</h3>
          <p>
            Five of the option groups take a wider shape than the plain contract: <code>seriesStyles</code>,{' '}
            <code>animation</code>, <code>interaction</code>, <code>annotations</code> and the two axes. The wider
            shapes are the <code>Native*</code> types, they are supersets, and they are what <em>every</em> renderer
            takes — the web one included. A glow, a traced entrance, a selection marker and a pulsing point are all
            drawn in the DOM too.
          </p>
          <PropsTable
            rows={[
              {
                description:
                  'Adds glow — a bloom behind the stroke, in the series colour unless told otherwise — and fill, the area under a trace: a wash or a grid of dots, closed against the plot floor or against a value.',
                name: 'seriesStyles',
                type: 'NativeChartSeriesStyle',
              },
              {
                description:
                  'Adds reveal, the first-render entrance, and transition, how marks move when data changes.',
                name: 'animation',
                type: 'NativeChartAnimation',
              },
              {
                description:
                  'Adds marker — how the reading under the finger is picked out — and crosshairStyle, including the labels the crosshair carries above the plot.',
                name: 'interaction',
                type: 'NativeChartInteraction',
              },
              {
                description:
                  'Adds badge, glow, halo, hidden, pulse, labelBackground, labelPosition and scrubOpacity to lines and points.',
                name: 'annotations',
                type: 'NativeChartAnnotation[]',
              },
              {
                description:
                  'Adds the overlay position, labelInset, labelSize, ticks and the two plot-dimension paddings. Listed below under axis options.',
                name: 'xAxis · yAxis',
                type: 'NativeChartAxisOptions',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>The names are historical.</strong> The vocabulary was built for the platform graphics stacks and
            landed on the web renderer afterwards, so the types still read <code>Native*</code>. Six of its fields are
            still native alone: <code>animation.transition</code>, which the web renderer answers its own way — mark by
            mark, whichever name it is given — <code>interaction.haptics</code>, which the web has no honest equivalent
            for, <code>interaction.rangeStyle</code>, which draws a span the web has no second finger to hold,{' '}
            <code>style.candleRadius</code>, which the web candlestick engine cannot round, and{' '}
            <code>style.neutralColor</code> and <code>style.volumeHeightRatio</code> — the web candlestick colours a
            flat session as a rising one and gives the volume histogram a fixed share of the plot. Two fields on the
            plain contract are native alone as well: <code>interaction.range</code>, which needs a second finger, and{' '}
            <code>annotation.align</code>, which the web still centres.
          </div>
          <div className={styles.note()}>
            <strong>
              A series' own <code>glow</code> and <code>fill</code> are drawn where a trace is.
            </strong>{' '}
            Both ride the canvas that strokes the series, so they land on <code>Chart.Line</code> and{' '}
            <code>Chart.Area</code> on iOS and Android — iOS carries them to <code>Chart.Sparkline</code> and{' '}
            <code>Chart.TimeSeries</code> as well — and on the web on <code>Chart.Line</code>, plus the fill on{' '}
            <code>Chart.Area</code>, where the area is the quantity rather than decoration. A <code>glow</code> set on a
            bar or a scatter is accepted by the type and drawn by nobody.
          </div>
          <div className={styles.note()}>
            <strong>A decorated point is drawn by the layer that reads the pointer.</strong> So <code>glow</code>,{' '}
            <code>halo</code>, <code>pulse</code>, <code>badge</code> and <code>size</code> on an annotation land on{' '}
            <code>Chart.Line</code> and <code>Chart.Candlestick</code> on every platform, and on the rest of the
            cartesian forms on iOS and Android. On a web <code>Chart.Area</code>, <code>Chart.Bar</code> or{' '}
            <code>Chart.StackedBar</code> a point annotation is a plain mark and a rule carries no badge — the rules,
            ranges, labels and <code>labelBackground</code> those forms do draw are the engine's own, and{' '}
            <code>annotationViews</code> works on all five, so your own node is the way to put a head on a mark there.
          </div>
          <CodeBlock>{`type ChartGlow = {
  /** Defaults to the mark’s own colour. */
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

/** The area under a trace. Opacity stays fillOpacity, so there is one place to set it. */
type ChartSeriesFill = {
  /** The value the fill closes against instead of the plot's floor, filling either side of it. */
  baseline?: number
  /** One dot's diameter, in points. Default 1. */
  dotSize?: number
  /**
   * How much of its strength the fill still has at the plot's floor, 0–1. Default 1,
   * which is an even fill. A dotted fill on the web also needs an explicit height: the
   * ramp is baked into a tile before the chart is measured, and a chart that has not
   * said how tall it is keeps an even fill rather than guessing at one.
   */
  fadeTo?: number
  /** "dots" | "solid" */
  pattern?: ChartFillPattern
  /** Centre-to-centre distance between dots, in points. Default 4. */
  spacing?: number
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
type ChartTransition = 'crossfade' | 'morph'`}</CodeBlock>
          <div className={styles.note()}>
            <strong>
              <code>crossfade</code> is the honest one when the axis changed.
            </strong>{' '}
            <code>morph</code> interpolates between the two datasets, which reads as the data moving. If the categories
            underneath are not the same categories, nothing moved — dissolve instead. It is a choice iOS and Android
            give you: on the web the renderer transitions a data change mark by mark on its own, moving the ones that
            are on both sides and fading the ones that are not, so neither name changes what you get.
          </div>
          <div className={styles.note()}>
            <strong>A morph needs the two sides to correspond.</strong> Both platforms blend the readings, the pinned
            domain and the value a rule or a point sits at, and match annotations by <code>id</code> — one that exists
            on both sides slides, one that does not simply arrives. Where the series count or the reading count differs
            there is nothing to interpolate, so the new dataset is shown as it is: a screen switching between a day and
            a year has to sample both into the same number of slots to be morphed between.{' '}
            <code>animation.duration</code> and <code>animation.easing</code> time it — 320 ms and{' '}
            <code>ease-in-out</code> by default, and <code>'spring'</code> resolves to that curve, since a transition
            that overshot would carry the marks past their new values and back. A morph cut short sets off from what is
            on screen rather than from the dataset the last one was heading for.
          </div>
          <div className={styles.note()}>
            <strong>A fill is drawn by the forms that have an area to fill.</strong> <code>Chart.Line</code> and{' '}
            <code>Chart.Area</code>, on all three renderers — a clipped dot grid on the SwiftUI and Compose canvases, a
            repeating canvas pattern on ECharts. Giving a <code>Chart.Line</code> a <code>fill</code> is what paints an
            area under it, where the fill is decoration; <code>Chart.Area</code> fills by default because there it is
            the quantity, and a <code>fill</code> only changes its pattern and its baseline. Opacity stays{' '}
            <code>fillOpacity</code> for both, and a dot grid usually wants more of it than a wash, since most of what
            it covers stays bare.
          </div>
          <p>
            These are the fields the <Link href="/docs/builders">builders</Link> exist for. <code>reveal.draw</code> and{' '}
            <code>reveal.fade</code> accept only the fields their own style reads, and <code>glow</code> and{' '}
            <code>halo</code> give the nested objects a name you can declare once and reuse.
          </p>

          <h3 id="native-scrubbing">Scrubbing</h3>
          <p>
            Three fields carry a scrub: <code>index</code>, the mark's position in the data you passed,{' '}
            <code>phase</code>, where the gesture is in its lifetime, and <code>geometry</code>. Together they are what
            lets a readout outside the plot follow a finger and then return to rest. One phase is not a gesture at all:{' '}
            <code>'layout'</code> fires once the chart has measured itself and carries the geometry, which is what you
            position your own views over the plot with. All three are reported on the web too, from the pointer.
          </p>
          <p>
            An event says what is being read, never where the finger is. A reading moves many times a mark, and a
            position that crossed into your code to be laid out again would always land a render after the crosshair it
            belongs beside — so views that follow a reading are ones the chart mounts and moves itself, through{' '}
            <code>tooltip</code> and <code>rangeView</code>.
          </p>
          <p>
            <code>geometry</code> is the exception, and it is a layout report rather than a reading: it arrives once the
            chart has measured itself and moves when the chart does, not when a finger does. Its coordinates are in the
            unit the platform lays views out in — points on iOS, dp on Android, px on the web — so a grid or a row of
            labels laid against the plot lands where the chart drew, with no density arithmetic in between.
          </p>
          <CodeBlock>{`type ChartInteractionPhase = 'began' | 'changed' | 'ended' | 'layout'

/** Discriminated by phase: test it and the field that phase is about stops being optional. */
type ChartInteractionEvent =
  | (Fields & { phase: 'layout'; geometry: ChartGeometry })
  | (Fields & { phase: 'ended' })
  | (Fields & { phase: 'began' | 'changed'; index: number })
  | (Fields & { phase: 'began' | 'changed'; range: ChartInteractionRange })
  /** A click or hover on a form with no scrub layer, which the web reports without a phase. */
  | (Fields & { phase?: undefined })

/** Every field an event can carry — index, category, value, seriesId, the pointer position. */
type Fields = { index?: number; category?: string; /* … */ }

type ChartInteractionHandler = (event: ChartInteractionEvent) => void

type ChartGeometry = {
  annotations: readonly { id: string; x: number; y: number }[]
  plot: { height: number; width: number; x: number; y: number }
}

/** How the mark under the finger is picked out. */
type ChartSelectionMarker = {
  /** "point" | "segment" | "trail" */
  style?: ChartMarkerStyle
  color?: string
  /** Puts the dot of "point" on the reading as well, so a lit stretch can name its head. */
  dot?: boolean
  glow?: ChartGlow
  /** A dot’s diameter. "point", and the other two once dot is set. */
  size?: number
  /** How many data steps either side of the touch a segment covers. "segment" only. */
  span?: number
}

/** How the stretch between two fingers is picked out. Native only, like the span itself. */
type ChartRangeStyle = {
  /** The held stretch’s colour, and the rules at its ends. Defaults to the trace’s own. */
  color?: string
  /** Its colour when the span closed below where it opened. Defaults to color. */
  downColor?: string
  /** How far the rest of the trace steps back, 0–1, the fill with it. Default 1. */
  dimOpacity?: number
  /** A dot at each end of the span, in the stretch’s colour. Default true. */
  dot?: boolean
}

type ChartCrosshairStyle = {
  color?: string
  dash?: number[]
  /**
   * What to write above the crosshair: one string per slot, in data order. Drawn in the theme’s
   * label colour. To make it anything else, hand the chart your own view with tooltip.view.
   */
  labels?: string[]
  width?: number
}`}</CodeBlock>
          <PropsTable
            rows={[
              {
                defaultValue: '"point"',
                description:
                  'A dot on the mark, a lit stretch of the line around it, or a lit stretch from the first reading up to it.',
                name: 'marker.style',
                type: '"point" | "segment" | "trail"',
              },
              {defaultValue: '9', description: 'Dot diameter, in points.', name: 'marker.size', type: 'number'},
              {
                defaultValue: '2',
                description:
                  'Data steps either side of the touch. A trail reaches back to the first datum, so it reads no span — only size, and only once it has been asked for a dot.',
                name: 'marker.span',
                type: 'number',
              },
              {
                description:
                  'The held stretch of a two-finger span, painted in the direction the span itself went: downColor when it closed below where it opened, color otherwise. The rules at its ends take the same colour over crosshairStyle.color, since they are the ends of the stretch. Both default to the trace’s own colour, which reads as no split at all.',
                name: 'rangeStyle.color · rangeStyle.downColor',
                type: 'string',
              },
              {
                defaultValue: '1',
                description:
                  'How far the trace outside the span steps back, and the fill under it with it — a span picks out a stretch of the period rather than one mark out of many. Separate from interaction.dimOpacity, so one finger can read a whole trace and two can still spotlight part of it.',
                name: 'rangeStyle.dimOpacity',
                type: 'number',
              },
              {
                defaultValue: 'true',
                description:
                  'A dot on each end of the span, in the stretch’s colour and at the marker’s own size. Drawn from the fingers, so both ends keep up with them.',
                name: 'rangeStyle.dot',
                type: 'boolean',
              },
              {
                defaultValue: '0.55 native · 0.35 web',
                description:
                  'Glow opacity at rest. The web’s own blooms are fainter: 0.35 behind a stroke or a selection marker, 0.3 for the bloom on a read mark.',
                name: 'glow.opacity',
                type: 'number',
              },
              {
                defaultValue: '6',
                description:
                  'Glow radius, in points — on both native renderers and on the web’s scrub chrome. A series glow on the web takes no default: leave radius out and the stroke gets no bloom at all.',
                name: 'glow.radius',
                type: 'number',
              },
              {
                defaultValue: '12 native',
                description:
                  'Halo diameter, in points. On the web a halo with no size is drawn at the point’s own diameter, which is a ring you cannot see — name it there.',
                name: 'halo.size',
                type: 'number',
              },
              {defaultValue: '1', description: 'Crosshair line width.', name: 'crosshairStyle.width', type: 'number'},
              {
                description:
                  'What the crosshair writes above the plot: one string per slot, in data order, and the chart draws the one for the mark being read. Your words — a time, a date, whatever the reading is called.',
                name: 'crosshairStyle.labels',
                type: 'string[]',
              },
              {
                defaultValue: 'false',
                description:
                  'Puts the dot of "point" on the reading as well, so a "segment" or a "trail" can light the line and still mark where the finger is. Sized by marker.size and blooming by marker.glow.',
                name: 'marker.dot',
                type: 'boolean',
              },
              {
                defaultValue: 'false',
                description:
                  'A ring blooming out of a point annotation and resting before it does it again, to mark "now". true takes 450 ms out, 1550 ms at rest, 2.2× the point’s ring.',
                name: 'annotation.pulse',
                type: 'boolean | ChartPulse',
              },
              {
                description:
                  'Painted behind an annotation’s label, so its value stays legible where the marks run through it.',
                name: 'annotation.labelBackground',
                type: 'string',
              },
              {
                description:
                  'Which side of the rule its label sits on. "auto" keeps it inside the plot: above a rule sitting low, below one sitting high. Omit it and each renderer keeps its own default side, so name one when the three have to agree.',
                name: 'annotation.labelPosition',
                type: '"auto" | "bottom" | "leading" | "top" | "trailing"',
              },
              {
                description:
                  'A colour the mark under the finger is lifted towards, so the read one reads as lit. Chart.Candlestick alone reads it, on all three renderers — the other forms are lit by marker and dimOpacity.',
                name: 'interaction.highlightColor',
                type: 'string',
              },
              {
                defaultValue: '1',
                description:
                  'How far towards it. Below 1 the mark’s own colour still reads through the lift. Candlestick only, like the colour it blends.',
                name: 'interaction.highlightBlend',
                type: 'number',
              },
              {
                defaultValue: '0',
                description:
                  'How long the marks take to step back to dimOpacity when a reading starts, and to come back up when it ends, in ms. 0 is the cut every chart has always had; a beat is worth it where the dimming is the whole feedback for the gesture. The lit stretch of a segment or a trail is held until the ramp is all the way up, so the part of the trace that was never dimmed has nothing to flash against.',
                name: 'interaction.dimDuration',
                type: 'number',
              },
              {
                defaultValue: 'false',
                description:
                  'Reads a span rather than a mark: two fingers report the marks under each of them and everything between, as range on the event. A rule is drawn at each end of the span instead of a crosshair through one. iOS and Android only.',
                name: 'interaction.range',
                type: 'boolean',
              },
              {
                description:
                  'How the held stretch is picked out, beside the rules at its ends: color and downColor paint it in the span’s own direction, dimOpacity steps the rest of the trace back behind it, and dot puts the reading marker on each end. Drawn by the chart from the fingers themselves, so the ends keep up with them — a masked second series fed back through a scrub handler arrives a render late. iOS and Android only.',
                name: 'interaction.rangeStyle',
                type: '{color?, downColor?, dimOpacity?, dot?}',
              },
              {
                defaultValue: '0',
                description: 'Corner radius on a candle body. Rounds the wick’s caps with it.',
                name: 'style.candleRadius',
                type: 'number',
              },
              {
                defaultValue: '1',
                description: 'What an annotation fades to while a point is being read. Set 0 to hide it entirely.',
                name: 'annotation.scrubOpacity',
                type: 'number',
              },
              {
                description:
                  'A single glyph in a filled circle capping a rule at the plot edge; the rule starts below it. Leave it off and the chart draws only the rule, so your own view can sit there instead.',
                name: 'annotation.badge',
                type: 'string',
              },
              {
                description:
                  'A point annotation’s dot diameter, or a badge circle’s. Each renderer rests at a slightly different dot size, so name it when the three have to agree; a badge takes it on iOS and the web, and Android draws a fixed one.',
                name: 'annotation.size',
                type: 'number',
              },
              {
                description:
                  'Your own view where an annotation lands, keyed by its id. A point with one is not drawn at all, because the view is the mark; a rule keeps its line and loses the badge and label it would have worn, because the view caps it. A rule’s view runs from the plot’s edge, centred only across the rule — size it from geometry.plot, which arrives on layout rather than on every step of the finger. In a zyplot config it is written as view on the annotation, and lifted in here for you.',
                name: 'annotationViews',
                type: 'Record<string, ChartSlotView>',
              },
              {
                defaultValue: 'true',
                description:
                  'What appears for the reading, in one setting — there is no second switch anywhere. Left out or true, the chart writes its own card. false draws nothing, which is the answer whenever a readout of your own is above the plot. A tooltip.beside({view}) or tooltip.above({view}) hands over your own view, which the chart mounts inside itself and moves in its own layout pass, so it keeps up with the crosshair instead of trailing a render behind it: beside() sets it next to the reading inside the plot and flips it at the edge, which is what a card of rows wants, and its align says where down the plot it sits — top by the gap, center for halfway, bottom against the floor; above() centres it on the reading and lifts it clear of the plot, which is where the rule’s chip goes and where it takes the place of crosshairStyle.labels, so it takes a lift rather than an align. The view is optional, so a placement can be declared on its own as a preset and the view spread in where it is known — on its own it changes nothing the chart draws, since the card the chart writes itself keeps its own placement.',
                name: 'tooltip',
                type: 'boolean | ChartTooltip',
              },
              {
                description:
                  'Your own view for the span under two fingers, centred on it and lifted clear of the plot. The chart writes nothing for a span of its own, so this adds rather than replaces. Needs interaction.range, and a second finger — the web never places it.',
                name: 'rangeView',
                type: 'ChartSlotView',
              },
              {
                defaultValue: 'false',
                description:
                  'Measured and reported in geometry as usual, but drawn by nobody — for an annotation that is only an anchor for a view of your own.',
                name: 'annotation.hidden',
                type: 'boolean',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>Anything that follows the finger belongs to the chart.</strong> Everything else you put over a plot
            sits still long enough for <code>onInteraction</code> to place it — a card against a rule, a badge on an
            annotation. A label or a dot that has to move <em>with</em> the line cannot: a position that reaches
            JavaScript through a bridge and comes back as a re-render is a frame or two behind the line it belongs to,
            and read against the crosshair beside it the thing visibly drags — tens of points behind on a fast drag, not
            a shimmer. So <code>crosshairStyle.labels</code> hands the words to whoever is drawing the line, and{' '}
            <code>marker.dot</code> does the same for the dot on the reading. All three renderers keep the label whole
            against both edges of the chart, so the first and last readings of a series are worth a full label rather
            than half of one, and on the web the plot gives up room at the top to draw it in — only when labels were
            given and a crosshair is drawn at all, and whether or not a pointer is over the plot: marks that changed
            height the moment one arrived would be worse than either.
          </div>
          <div className={styles.note()}>
            <strong>The chip is yours to draw, and it costs nothing to.</strong> That round trip is what{' '}
            <code>tooltip.view</code> is for: hand the chart a view and the chart mounts it inside itself and moves it
            there, so it keeps up with the crosshair the way the crosshair keeps up with the finger. Which is why the
            built-in label has no chip fields — styling it is styling a view, and there is no reason to describe a pill
            twice.
          </div>
          <div className={styles.note()}>
            <strong>A slot takes an element or a component.</strong> An element is a new value on every render, so a{' '}
            <Link href="/docs/builders#builder-zyplot">
              <code>zyplot</code>
            </Link>{' '}
            config holding one is rebuilt on every render with it. Name a component instead —{' '}
            <code>
              tooltip: z.tooltip.above({'{'}view: ReadingChip{'}'})
            </code>{' '}
            — and the config is the same value for the life of the module: the chart is rendered with no props of its
            own, and what the chip says comes from its own hooks. That is the difference between a reading that
            re-renders the chart and one that re-renders a chip.
          </div>
          <div className={styles.note()}>
            <strong>
              Reach for{' '}
              <Link href="/docs/hooks/use-chart-scrub">
                <code>useChartScrub</code>
              </Link>{' '}
              before writing a handler.
            </strong>{' '}
            It already turns these events into a selection that clears itself on <code>'ended'</code>, which is the
            whole of what a readout above the plot needs.
          </div>

          <h3 id="native-axes">Native axis options</h3>
          <p>
            <code>xAxis</code> and <code>yAxis</code> take everything <code>ChartAxisOptions</code> defines, plus the
            controls below on both platforms. Each renderer then adds its own — see{' '}
            <Link href="/docs/native/ios#native-ios-axis">iOS</Link> and{' '}
            <Link href="/docs/native/android#native-android-axis">Android</Link>.
          </p>
          <PropsTable
            rows={[
              {
                defaultValue: '"start"',
                description:
                  'overlay puts the labels inside the plot against its trailing edge and reserves no gutter, keeping the full width for the marks. Build it with axis.overlay.',
                name: 'position',
                type: '"start" | "end" | "overlay"',
              },
              {
                defaultValue: '—',
                description:
                  'How far the labels sit off the plot’s edge, in points: inside it for overlay, out in the gutter for start and end, which widens to keep them. Left out, each renderer keeps a few points of its own.',
                name: 'labelInset',
                type: 'number',
              },
              {defaultValue: '11', description: 'Point size of the tick labels.', name: 'labelSize', type: 'number'},
              {
                defaultValue: 'true native · false web',
                description:
                  'Draws the short marks beside each label, independently of grid. iOS and Android draw them in theme.colors.axis; the web takes ECharts’ own colour, which follows the axis line — theme.colors.grid on a category axis, the engine’s own grey on a value one. The web category axis also draws that line along the plot, which is the one piece of axis furniture neither Swift Charts nor a Compose canvas has; minorTicks takes it off and puts the row of marks there instead.',
                name: 'ticks',
                type: 'boolean',
              },
              {
                defaultValue: 'false',
                description:
                  'A shorter mark at every category, not only at the named ones. When two categories out of twenty-four are labelled, the row of these is what reads as the axis — a rule inside the plot only looks like one until a line rests on it. The named ticks become the longer marks that cap the row, and one more closes it on the trailing edge of the last band. Needs ticks, and a category axis along the bottom: Chart.Line, Chart.Bar and Chart.StackedBar on the web, any kind on native.',
                name: 'minorTicks',
                type: 'boolean',
              },
              {
                defaultValue: 'false',
                description:
                  'Pins the first and last labels to the ends of the axis instead of centring each on its own mark, so a pair of bookends — 0:00 and 23:00 — squares up with the row of ticks they bracket. Read on the x axis, and on iOS only for the labels a tickValues named.',
                name: 'labelEdgeAlign',
                type: 'boolean',
              },
              {
                description:
                  'Free space, in points, kept before the first mark. What you give is the whole gutter, so 0 puts the first mark on the plot’s leading edge; left out, a renderer keeps a few points of its own so a mark that sits at the edge is not cut in half. On the x axis this is the room at the plot’s sides, on the y axis the air under the lowest reading.',
                name: 'plotDimensionStartPadding',
                type: 'number',
              },
              {
                description:
                  'Free space, in points, kept after the last mark. Read like plotDimensionStartPadding — on the y axis, the headroom over the highest reading. The label row under the plot is not part of it and keeps whatever it needs.',
                name: 'plotDimensionEndPadding',
                type: 'number',
              },
            ]}
          />

          <h3 id="native-differences">Differences from web</h3>
          <PropsTable
            rows={[
              {
                description: 'Native charts have no DOM node to style. Use height and plot instead.',
                name: 'className',
                type: 'web only',
              },
              {
                description:
                  'Pattern fills answer forced-colors and print, which a native chart never meets. Not part of the native props — the compiler rejects it rather than the renderer ignoring it.',
                name: 'texture',
                type: 'web only',
              },
              {
                description:
                  'Both native renderers draw a shimmering placeholder matched to the form — a ring, a column row or a curve — but there is no slot to put your own in, and no .Skeleton component to mount on its own.',
                name: 'skeleton',
                type: 'web only',
              },
              {
                description:
                  'On every native form’s props, and it lands on the ones that anchor an annotation to a plot — the cartesian forms. On the web it is Chart.Line, Chart.Area, Chart.Bar, Chart.StackedBar and Chart.Candlestick, the forms that report where their annotations landed.',
                name: 'annotationViews',
                type: 'wider on native',
              },
              {
                defaultValue: '"system"',
                description:
                  'Per chart on native: there is no cascade to inherit through, so Chart.Provider scopes surface and theme but not the color mode. On the web it is the provider that takes it, and it has an "inherit" the native prop does not.',
                name: 'colorMode',
                type: 'native chart · web provider',
              },
              {
                description:
                  'The accessibility name of the chart view, since there is no DOM node to label. On the web, use className and the surrounding markup.',
                name: 'accessibilityLabel',
                type: 'native only',
              },
              {
                description:
                  'On the base props natively, so every form takes it. On the web only the forms that write numbers do, and a few take a second one — valueFormat on the histogram, xFormat and yFormat on the scatter.',
                name: 'format',
                type: 'every native form',
              },
              {
                defaultValue: '320',
                description:
                  'Points on native, px on the web, where it defaults to 240 — and to 200 for the gauge and 300 for the sankey.',
                name: 'height',
                type: 'different default',
              },
              {
                description:
                  'Boxplot terminology is honoured natively too. Chart.Candlestick takes labels only here — pass your five words and the tooltip lists every reading instead of just the close.',
                name: 'labels',
                type: 'wider on native',
              },
              {
                description:
                  'Two fingers report the span between them, and the chart draws a rule at each end rather than a crosshair through one. A pointer has no second finger, so on the web the flag changes nothing and range stays null on every event.',
                name: 'interaction.range',
                type: 'native only',
              },
              {
                description:
                  'How that span is drawn: its stretch in the direction it went, the rest of the trace stepped back behind it, a dot on each end. Nothing to answer on the web, where there is no span to draw.',
                name: 'interaction.rangeStyle',
                type: 'native only',
              },
              {
                description:
                  'Which edge of a category’s band a rule sits on. iOS and Android place it where they place every other category position, so the reported geometry agrees with the pixels; the web renderer still centres every rule on its mark.',
                name: 'annotation.align',
                type: 'native only',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>The presentation props are not on this list.</strong> <code>glow</code>, <code>reveal</code>,{' '}
            <code>marker</code> — <code>dot</code> and all — <code>badge</code>, <code>pulse</code>, <code>halo</code>,{' '}
            <code>crosshairStyle</code>’s chip, <code>minorTicks</code> and the overlaid axis all render in the DOM as
            well — see <a href="#native-presentation">the presentation vocabulary</a> above. Only{' '}
            <code>interaction.haptics</code>, <code>interaction.range</code>, <code>interaction.rangeStyle</code>,{' '}
            <code>annotation.align</code>, <code>style.candleRadius</code>, <code>style.neutralColor</code> and{' '}
            <code>style.volumeHeightRatio</code> are native alone, and <code>animation.transition</code> is answered its
            own way in the DOM rather than read. Eleven forms do take different data props, though: those are in{' '}
            <a href="#native-coverage">chart coverage</a>.
          </div>
          <CodeBlock>{`type ChartCandlestickLabels = {
  open: string
  high: string
  low: string
  close: string
  change: string
}`}</CodeBlock>
        </section>

        <section className={cn(styles.section(), page !== 'native-ios' && 'hidden')} id="native-ios">
          <p className={styles.kicker()}>Native</p>
          <h2>iOS</h2>
          <p>
            <code>@hzblj/zyplot/ios</code> renders with SwiftUI and Swift Charts. Chart configuration crosses the bridge
            as JSON and is decoded into native models, so every prop stays serializable. Importing it commits a file to
            iOS, so name that file <code>*.ios.tsx</code>.
          </p>
          <CodeBlock>{`// price.ios.tsx
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
}`}</CodeBlock>

          <h3 id="native-ios-extensions">iOS-only charts</h3>
          <div className={styles.chartTitleRow()}>
            <p>Two marks Swift Charts has that neither other renderer does.</p>
            <PlatformBadges platforms={['ios']} />
          </div>
          <PropsTable
            rows={[
              {
                description:
                  'Shaded band between a low and a high per category — forecast ranges, confidence intervals.',
                name: 'Chart.Range',
                required: true,
                type: 'ChartRangePropsIos',
              },
              {
                description: 'Reference rules at a value, optionally spanning a start and end.',
                name: 'Chart.Rule',
                required: true,
                type: 'ChartRulePropsIos',
              },
            ]}
          />

          <h3 id="native-ios-axis">iOS axis options</h3>
          <p>
            <code>xAxis</code> and <code>yAxis</code> accept everything{' '}
            <Link href="/docs/native#native-axes">the shared native axis</Link> defines — the <code>overlay</code>{' '}
            position, <code>labelInset</code>, <code>labelSize</code>, <code>ticks</code> and the two{' '}
            <code>plotDimension</code> paddings among them — plus these Swift Charts scrolling controls, which belong to
            the x axis alone.
          </p>
          <PropsTable
            rows={[
              {
                description: 'Length of the visible x domain. Setting it makes the plot horizontally scrollable.',
                name: 'xAxis.visibleDomain',
                type: 'number',
              },
            ]}
          />
        </section>

        <section className={cn(styles.section(), page !== 'native-android' && 'hidden')} id="native-android">
          <p className={styles.kicker()}>Native</p>
          <h2>Android</h2>
          <p>
            <code>@hzblj/zyplot/android</code> draws on a Jetpack Compose <code>Canvas</code>. Marks, axis text, grid,
            annotations and the tooltip are all drawn by the module, so a chart is one view rather than a tree of them.
            Importing it commits a file to Android, so name that file <code>*.android.tsx</code>.
          </p>
          <CodeBlock>{`// spend.android.tsx
import { Chart } from '@hzblj/zyplot/android'

export function Spend() {
  return (
    <Chart.Waterfall
      data={movements}
      format={{ prefix: '$', decimals: 0 }}
      interaction={{ haptics: true }}
    />
  )
}`}</CodeBlock>

          <h3 id="native-android-extensions">Android-only charts</h3>
          <div className={styles.chartTitleRow()}>
            <p>Two forms the Compose Canvas draws that neither other renderer does.</p>
            <PlatformBadges platforms={['android']} />
          </div>
          <PropsTable
            rows={[
              {
                description: 'Running total across signed movements, colored by direction.',
                name: 'Chart.Waterfall',
                required: true,
                type: 'ChartWaterfallPropsAndroid',
              },
              {
                description: 'A stem and a dot per category — a bar chart with the ink of a dot plot.',
                name: 'Chart.Lollipop',
                required: true,
                type: 'ChartLollipopPropsAndroid',
              },
            ]}
          />

          <h3 id="native-android-axis">Android axis options</h3>
          <p>
            <code>xAxis</code> and <code>yAxis</code> accept everything{' '}
            <Link href="/docs/native#native-axes">the shared native axis</Link> defines, plus overflow handling for long
            tick labels — the one control Compose needs that Swift Charts resolves on its own.
          </p>
          <PropsTable
            rows={[
              {
                defaultValue: '"ellipsis"',
                description: 'How a tick label that exceeds its band is cut.',
                name: 'xAxis.labelOverflow',
                type: '"clip" | "ellipsis" | "visible"',
              },
              {
                defaultValue: '"ellipsis"',
                description: 'How a tick label that exceeds the gutter is cut.',
                name: 'yAxis.labelOverflow',
                type: '"clip" | "ellipsis" | "visible"',
              },
            ]}
          />
        </section>

        <section className={cn(styles.section(), page !== 'theming' && 'hidden')} id="theming">
          <h2>Theming</h2>
          <p>
            <code>Chart.Provider</code> scopes a palette to a subtree. It writes what you pass as{' '}
            <code>--zyplot-*</code> custom properties on its own wrapper, and the charts inside read the resolved values
            back off the DOM. A key you leave out keeps the stylesheet's value, including that value's dark variant.
          </p>
          <div className={styles.note()}>
            <strong>A theme key holds in both modes.</strong> The provider writes inline custom properties, which
            outrank the stylesheet's light and dark rules alike — so a color passed here is the color in both. When a
            palette has to change with the mode, set it in CSS instead.
          </div>
          <CodeBlock>{`<Chart.Provider
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
</Chart.Provider>`}</CodeBlock>

          <h3 id="theme-keys">The theme contract</h3>
          <p>
            Every key is optional and takes any color the browser can resolve. There is no <code>background</code> here
            — the box a chart sits in is <code>surface</code>, below.
          </p>
          <div className={styles.note()}>
            <strong>
              The provider's shape is <code>ChartProviderTheme</code>.
            </strong>{' '}
            It is the full palette, because the provider writes CSS variables and the stylesheet has one for each of
            these. It is also a superset of the <code>ChartTheme</code> a single chart takes, so one object can be
            passed to both — see <a href="#chart-theme">below</a>.
          </div>
          <CodeBlock>{`type ChartProviderTheme = {
  colors?: {
    /** Slots 1…7, in order. A series takes one by index or by its own slot. */
    categorical?: readonly string[]
    /** Low → high, five steps. Heatmap, treemap, sunburst. */
    sequential?: readonly string[]
    /** A signed scale in full. The flat negative/positive below are its shorthand. */
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
}`}</CodeBlock>
          <div className={styles.note()}>
            <strong>Seven and five.</strong> Only the first seven <code>categorical</code> entries and the first five{' '}
            <code>sequential</code> steps are ever read. An eighth series color is one no color-blind reader can
            separate from a slot that already exists, so the eighth series is an "other" bucket, a small multiple, or a
            second encoding through <code>texture</code> — not a longer palette.
          </div>

          <h3 id="chart-theme">A theme on one chart</h3>
          <p>
            Every chart also takes a <code>theme</code> of its own, on all four entry points. This one is{' '}
            <code>ChartTheme</code>, and it is the portable subset: every key on it is a key each of the four renderers
            draws with, so a theme written against it works unchanged on the web, on iOS and on Android.
          </p>
          <div className={styles.note()}>
            <strong>How it meets the provider's is not the same on both.</strong> On the web the provider's keys are CSS
            variables the chart has already resolved, so a chart's own <code>theme</code> lands over them key by key —
            one colour here does not drop the rest. On native there are no variables to resolve against: a chart that
            passes a <code>theme</code> replaces the provider's outright, so restate the keys you still want, or leave
            the theme to the provider and style the chart with <code>seriesStyles</code> and <code>surface</code>{' '}
            instead. <code>surface</code> does merge key by key on both.
          </div>
          <CodeBlock>{`import type { ChartTheme } from '@hzblj/zyplot'

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
}`}</CodeBlock>
          <p>
            The two wider shapes build on that subset rather than beside it. <code>ChartProviderTheme</code> adds the
            palettes and greys only a CSS variable can carry; <code>NativeChartTheme</code>, which the native charts and
            the native provider take, adds the chart's own <code>background</code>. Both are supersets, so one{' '}
            <code>ChartTheme</code> value satisfies all three props.
          </p>
          <div className={styles.note()}>
            <strong>A chart background is a surface, not a theme, on the web.</strong> There is no{' '}
            <code>--zyplot-color-background</code>: in the DOM the box a chart sits on is{' '}
            <a href="#surface">
              <code>surface.background</code>
            </a>
            , which exists on native too. Reach for that when one object has to dress a chart on every platform.
          </div>
          <div className={styles.note()}>
            <strong>
              <code>typography.fontFamily</code> takes a resolved family name.
            </strong>{' '}
            Each platform looks it up the way its own text does: the DOM through <code>--zyplot-font-family</code>, iOS
            through the registered-font lookup behind <code>UIFont(name:)</code>, Android through React Native's font
            manager — which covers <code>assets/fonts</code>, <code>res/font</code> and anything <code>expo-font</code>{' '}
            loaded at runtime. So a family that works in a <code>&lt;Text&gt;</code> works in a chart. One the app never
            shipped falls back to the platform font on all three.
          </div>

          <h3 id="surface">The chart surface</h3>
          <p>
            <code>theme</code> answers "what colour is this series"; <code>surface</code> answers "what does the
            container look like". Keeping them apart is what lets a design system set one card treatment for every chart
            while each chart keeps its own palette.
          </p>
          <CodeBlock>{`<Chart.Provider surface={{ background: '#fff', cornerRadius: 16, padding: 12 }}>
  <Chart.Line categories={categories} series={series} />
  <Chart.Bar surface={{ cornerRadius: 24 }} categories={categories} series={series} />
</Chart.Provider>`}</CodeBlock>
          <p>
            A chart's own <code>surface</code> merges over the provider's key by key, so the bar above rounds its
            corners without restating the background it inherits.
          </p>
          <PropsTable
            rows={[
              {
                description: 'Fill behind the plot. Any CSS or hex colour.',
                name: 'background',
                type: 'string',
              },
              {
                description: 'Outline around the container.',
                name: 'border',
                type: '{ color?: string; width?: number }',
              },
              {
                defaultValue: '0',
                description: 'Corner rounding, in px on web and points on native.',
                name: 'cornerRadius',
                type: 'number',
              },
              {
                description:
                  'A number applies to all four sides; the object form takes horizontal, vertical and the individual sides, most specific winning.',
                name: 'padding',
                type: 'number | ChartSurfacePadding',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>The same four keys everywhere.</strong> Only properties that mean the same thing to a{' '}
            <code>div</code>, a SwiftUI view and a Compose <code>Canvas</code> live here. Anything that would have to be
            approximated on one of the three is deliberately absent.
          </div>

          <h3 id="provider-props">Provider props</h3>
          <PropsTable
            rows={[
              {
                description: 'Charts rendered inside the scope.',
                name: 'children',
                required: true,
                type: 'ReactNode',
              },
              {
                description: 'Scoped color and typography overrides. A superset of a chart’s own ChartTheme.',
                name: 'theme',
                type: 'ChartProviderTheme',
              },
              {
                description:
                  "Container treatment every chart in the subtree inherits, merged key by key with the chart's own.",
                name: 'surface',
                type: 'ChartSurface',
              },
              {
                defaultValue: '"inherit"',
                description: 'How the light/dark palette is resolved for the subtree.',
                name: 'colorMode',
                type: '"inherit" | "light" | "dark" | "system"',
              },
              {
                description: 'CSS class on the wrapper element the provider renders.',
                name: 'className',
                type: 'string',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>The provider renders an element.</strong> The custom properties have to land somewhere, so the scope
            is a real <code>div</code> in your layout rather than context alone. It carries <code>className</code> for
            that reason.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'dark-mode' && 'hidden')} id="dark-mode">
          <h2>Light and dark mode</h2>
          <p>
            Both palettes ship in the stylesheet. The dark one is keyed off <code>.dark</code> or{' '}
            <code>data-theme="dark"</code> on the document root — the two conventions Tailwind and next-themes already
            write — and a root that pins neither falls back to <code>prefers-color-scheme</code>. A project doing either
            needs no chart-specific wiring.
          </p>
          <div className={styles.note()}>
            <strong>Light is a state, not the absence of one.</strong> A toggle that only removes <code>.dark</code>{' '}
            leaves the root pinning nothing, so a reader on a dark OS keeps the dark palette while the rest of the page
            turns light. Write <code>.light</code> — or <code>data-theme="light"</code> — as the other half of the
            toggle.
          </div>

          <h3 id="color-modes">Resolution</h3>
          <p>
            <code>Chart.Provider</code> pins a subtree instead. Its <code>colorMode</code> lands as{' '}
            <code>data-zyplot-color-mode</code> on the wrapper, and the stylesheet resolves the palette from there.
          </p>
          <PropsTable
            rows={[
              {
                defaultValue: 'default',
                description:
                  'Takes whatever the document root resolved to, including the OS fallback. Charts outside a provider behave this way too.',
                name: '"inherit"',
                type: 'document root',
              },
              {
                description: 'The light palette regardless of the root, plus color-scheme: light.',
                name: '"light"',
                type: 'pinned',
              },
              {
                description: 'The dark palette regardless of the root, plus color-scheme: dark.',
                name: '"dark"',
                type: 'pinned',
              },
              {
                description: 'Follows the OS through prefers-color-scheme, ignoring the document root.',
                name: '"system"',
                type: 'media query',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>Switching repaints in place.</strong> Because canvas colors are read off the DOM, every mounted
            chart watches <code>class</code>, <code>data-theme</code>, <code>data-zyplot-color-mode</code> and{' '}
            <code>style</code> on the root — plus the <code>prefers-color-scheme</code> query — and repaints from the
            new values. No remount, and no chart left painting light-mode series on a dark canvas.
          </div>

          <h3 id="css-variables">The CSS contract</h3>
          <p>
            These names are the public API; the Tailwind tokens behind them are not. Override them wherever you set the
            rest of your theme — the values below are the light defaults, and every color among them has a dark
            counterpart in the stylesheet.
          </p>
          <CodeBlock language="css">{`:root {
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
}`}</CodeBlock>
          <p>
            The font is inherited from the page. Set <code>--zyplot-font-family</code> only when charts should use a
            different stack, and give it a resolved family name — a canvas cannot read another variable.
          </p>
          <div className={styles.note()}>
            <strong>A page with no font of its own gets a system stack.</strong> Inheritance is the mechanism, so when
            nothing up the tree declares a font the browser answers with its own serif, and a chart has no business
            painting Times beside text that is not. Zyplot compares what it inherited against that untouched default and
            falls back to <code>system-ui</code> and the platform stack behind it. React Native Web is the case this
            exists for: its reset puts no font on the document and styles each <code>&lt;Text&gt;</code> on its own, so
            a chart has nothing to inherit however deeply it looks — with the fallback it matches the text beside it
            instead.
          </div>
          <div className={styles.note()}>
            <strong>Wide-gamut values are safe.</strong> On a P3 display these resolve to{' '}
            <code>color(display-p3 …)</code>, which ECharts' own parser rejects. Every color is normalized to sRGB on
            the way to the canvas, so the variable can hold whatever your design tokens hold.
          </div>
          <div className={styles.note()}>
            <strong>Two data attributes on the chart's own wrapper are public too.</strong>{' '}
            <code>data-zyplot-chart</code> marks every chart root, and <code>data-zyplot-interactive</code> marks one
            whose plot answers a pointer — the forms that read <code>interaction</code> (<code>Chart.Line</code>,{' '}
            <code>Chart.Area</code>, <code>Chart.Bar</code>, <code>Chart.StackedBar</code>,{' '}
            <code>Chart.Candlestick</code>) unless <code>interaction.hover</code> is <code>"none"</code>, plus{' '}
            <code>Chart.TimeSeries</code>. The stylesheet uses the second one for the pointer cursor, which it puts on
            the canvas itself rather than the wrapper: zrender writes <code>cursor: default</code> inline on the div it
            owns and uPlot lays a bare overlay over its canvas, so a rule on the container would lose to both. Selectors
            of your own can hang off either.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'data-types' && 'hidden')} id="data-types">
          <h2>Data</h2>
          <p>
            Chart data is plain serializable objects — no formatter callbacks and no render props, which is what lets a
            server component render a chart. Labels are already translated: this package never resolves an i18n key.
            Type names in the props tables link here.
          </p>
          <div className={styles.note()}>
            <strong>One contract, and every list is read-only.</strong> These types live in the shared contract and are
            re-exported by all four entry points, so a value typed once can be handed to a web chart and a native one.
            Every prop that takes a list — <code>series</code>, <code>categories</code>, <code>data</code>,{' '}
            <code>nodes</code>, <code>cells</code>, <code>groups</code>, <code>rows</code>, <code>values</code> —
            accepts a <code>readonly</code> array, so an <code>as const</code> value or a <code>readonly</code>
            -returning selector needs no cast. The shapes below are written as plain arrays for legibility.
          </div>
          <h3 id="chart-series">ChartSeries</h3>
          <p>
            Used by line, area, bar, stacked bar, radar and every other multi-series form. Each <code>values</code>{' '}
            entry aligns with the category at the same index, so the array is as long as <code>categories</code>.
          </p>
          <CodeBlock>{`type ChartSeries = {
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
}`}</CodeBlock>
          <p>
            An explicit <code>color</code> wins over the provider palette and the CSS variables. Omit <code>slot</code>{' '}
            and a series takes its index — correct for a fixed list, wrong the moment the list can be filtered, because
            the survivors get repainted and the reader has to re-learn the chart.
          </p>
          <CodeBlock>{`const series: ChartSeries[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    values: [42, 56, null, 72],
    slot: 1,
    color: '#16a34a',
  },
]`}</CodeBlock>
          <h3 id="chart-datum">ChartDatum</h3>
          <p>
            A labelled scalar — the shape part-to-whole and ranked forms consume: pie, funnel, gauge segments, diverging
            bars.
          </p>
          <CodeBlock>{`type ChartDatum = {
  id: string
  label: string
  value: number
  slot?: number
  color?: string
}`}</CodeBlock>
          <h3 id="chart-options">Axes and number formatting</h3>
          <p>
            <code>axis</code> is the on/off switch both cartesian axes share; <code>format</code> is one description of
            a number, applied to axis ticks, tooltips and direct labels alike, so they can never disagree.
          </p>
          <CodeBlock>{`type ChartAxes = {
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
}`}</CodeBlock>
          <h3 id="chart-legend">ChartLegendItem</h3>
          <p>
            What <code>Chart.Legend</code> takes when you place identity yourself. The color is already resolved — a
            swatch is a color, not a slot to look up.
          </p>
          <CodeBlock>{`type ChartLegendItem = {
  id: string
  label: string
  color: string
}`}</CodeBlock>
          <h3 id="specialized-data">Specialized chart data</h3>
          <p>
            Some forms take a shape-specific contract instead of <code>ChartSeries</code>, because their encoding is not
            "one value per category". The field names describe the marks directly.
          </p>
          <CodeBlock>{`/** Chart.Radar — one axis per row. Axes are scaled independently. */
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
}`}</CodeBlock>

          <h3 id="finance-data">Candlestick data</h3>
          <p>
            One entry per session. <code>volume</code> is what <code>showVolume</code> draws, and <code>timestamp</code>{' '}
            is only needed when something outside the chart has to line up with the session.
          </p>
          <CodeBlock>{`type ChartCandlestickDatum = {
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
}`}</CodeBlock>

          <h3 id="axis-options">Axis options</h3>
          <p>
            <code>axis</code> switches an axis off; <code>xAxis</code> and <code>yAxis</code> describe one. Both are
            read by line, area, bar, stacked bar and candlestick — the forms whose readers pin a domain, change the
            scale or annotate a value. The other forms take the visibility switch only, which is why their props tables
            list <code>axis</code> alone.
          </p>
          <CodeBlock>{`type ChartAxisOptions = {
  /** Draws the axis at all. Switching one off takes its grid with it — the rules belong to the scale. */
  visible?: boolean
  label?: string
  /** "auto" | "category" | "linear" | "log" | "time" */
  scale?: ChartAxisScale
  domain?: ChartAxisDomain
  format?: ChartNumberFormat
  /** The rules across the plot. Turn them off on their own for an axis you still want labelled. */
  grid?: boolean
  gridDash?: number[]
  labelRotation?: number
  /** Which side the axis is drawn on: "start" | "end". */
  position?: ChartAxisPosition
  reversed?: boolean
  /** A hint, not a guarantee — the engine still picks readable ticks. */
  tickCount?: number
  /** Exact ticks, when the reader is looking for specific ones: a number, or a category name. */
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
}`}</CodeBlock>
          <div className={styles.note()}>
            <strong>
              Reach for <code>padding</code> before pinning a domain.
            </strong>{' '}
            Without it a line runs into the top and bottom of its own plot, which reads as clipped rather than as the
            highest and lowest reading. A pinned <code>min</code>/<code>max</code> fixes that too, but it has to be
            recomputed every time the data changes; a fraction does not.
          </div>
          <div className={styles.note()}>
            <strong>
              <code>tickValues</code> pins the labels; the rules are a separate question.
            </strong>{' '}
            Every renderer names exactly the ticks it is given — numbers on a value axis, category names on a category
            one, and a category with no label still has its mark. The gridlines only follow them on iOS, where each
            Swift Charts mark carries its own rule; the web and Android space theirs evenly off <code>tickCount</code>{' '}
            instead, wherever the named readings happen to fall. So a plot that leans on exactly two rules asks for them
            with <code>tickCount</code>, or switches <code>grid</code> off and draws them as annotations.
          </div>
          <div className={styles.note()}>
            <strong>Four of these are the web renderer&rsquo;s alone.</strong> <code>scale</code> and{' '}
            <code>reversed</code> are read on the web and nowhere else; <code>gridDash</code> is read on the web and
            iOS, and Android draws a solid rule whatever it is given; <code>position: &apos;end&apos;</code> moves the
            web and iOS axes, while Android honours it on the y axis alone. Going the other way,{' '}
            <code>plot.borderRadius</code> rounds a native plot and does nothing on the web, and <code>plot.clip</code>{' '}
            is read on iOS and by the web&rsquo;s line, area, bar and stacked bar &mdash; not by Android. The type
            accepts all of them everywhere; these are the places it is writing a cheque the renderer does not cash.
          </div>

          <h3 id="annotations">Annotations</h3>
          <p>
            A union discriminated on <code>type</code>. Coordinates are <code>number | string</code>: a category name on
            a category axis, a value on a linear or time one.
          </p>
          <CodeBlock>{`type ChartAnnotation =
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
  /**
   * Where in a category's band the rule sits: "center" through the mark, "start" or "end" along
   * the band's own edges — which is where a rule meaning "up to here" belongs. Ignored on a
   * numeric axis. Read on iOS and Android. Default "center".
   */
  align?: 'center' | 'end' | 'start'
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
}

type ChartTextAnnotation = {
  type: 'text'
  id: string
  text: string
  x?: number | string
  y?: number
  color?: string
}`}</CodeBlock>

          <h3 id="interaction">Interaction</h3>
          <p>
            <code>interaction</code> is what the chart does on its own; <code>onInteraction</code> is how your code
            hears about it. The event is one flat serializable shape for every form, so a handler written for a bar
            chart works on a line chart.
          </p>
          <CodeBlock>{`type ChartInteraction = {
  /** "axis" | "nearest" | "series" | "none" */
  hover?: ChartHoverMode
  /** "both" | "x" | "y" | "none" */
  crosshair?: ChartCrosshairMode
  /** "single" | "multiple" | "none" */
  selection?: ChartSelectionMode
  zoom?: boolean
  /** Whether a hovered mark grows. Read on the web candlestick, which scales by its own amount. */
  highlightScale?: number
  /**
   * How far the rest fades while one mark is hovered. It reaches the strokes and the marks,
   * never the area fill under a trace: that is the ground the trace is drawn on, not one of
   * the things being compared, and greying it dims the page rather than pointing at anything.
   */
  dimOpacity?: number
  /**
   * How long that fade takes, in ms, in both directions. Default 0, which is instant. Give it a
   * beat where the dimming is the whole feedback for the gesture, so a finger landing reads as the
   * lights coming down rather than as a cut.
   */
  dimDuration?: number
  /** A colour the read mark is lifted towards, so it reads as lit rather than as undimmed. */
  highlightColor?: string
  /** How far towards it, 0–1. Below 1 the mark's own colour still reads. Default 1. */
  highlightBlend?: number
  /** Native only — the web has no honest equivalent. */
  haptics?: boolean
  /**
   * Reads a span rather than a mark: two fingers report the marks under each of them and
   * everything between, as "range" on the event. iOS and Android only — a pointer has no
   * second finger.
   */
  range?: boolean
  /**
   * How that span is drawn, on the wider NativeChartInteraction: "color" and "downColor" paint the
   * held stretch in the direction it went, "dimOpacity" steps the rest of the trace back behind it
   * — the fill with it, because a span is a spotlight rather than one mark picked out of many —
   * and "dot" puts the reading marker on each end.
   */
  rangeStyle?: ChartRangeStyle
}

/** Every field an event can carry. Each is optional, so one can be read without narrowing first. */
type ChartInteractionFields = {
  seriesId?: string
  category?: string
  value?: number
  /** Position of the read mark in the chart's own data order. */
  index?: number
  /** Where the plot and its annotations sit, on the "layout" phase. */
  geometry?: ChartGeometry
  /** The span under two fingers, when interaction.range is on and both are down. */
  range?: ChartInteractionRange
}

/**
 * Discriminated by phase: test it and the field that phase is about stops being optional.
 * The phase is absent on one path alone — a click or a hover on a form with no scrub layer.
 */
type ChartInteractionEvent =
  | (ChartInteractionFields & { phase: 'layout'; geometry: ChartGeometry })
  | (ChartInteractionFields & { phase: 'ended' })
  | (ChartInteractionFields & { phase: 'began' | 'changed'; index: number })
  | (ChartInteractionFields & { phase: 'began' | 'changed'; range: ChartInteractionRange })
  | (ChartInteractionFields & { phase?: undefined })

type ChartInteractionHandler = (event: ChartInteractionEvent) => void`}</CodeBlock>
          <div className={styles.note()}>
            <strong>A handler is a client boundary.</strong> Everything else on a chart is serializable data, so a
            server component can render it — <code>onInteraction</code> is the one prop that cannot cross, and the file
            that passes it needs <code>"use client"</code>.
          </div>
          <p>
            <strong>Not every field is read by every renderer, and the type does not say so.</strong> What each does
            today:
          </p>
          <PropsTable
            rows={[
              {
                description: 'Web and Android draw x, y and both; iOS draws the vertical rule only.',
                name: 'crosshair',
                type: 'all three',
              },
              {
                description:
                  'The reading itself is the tooltip prop, not part of this group. The web and Android draw a card by default; iOS draws one once the chart has asked for a gesture at all. Pass tooltip: false whenever a readout of your own is the answer, or the chart draws a card next to it.',
                name: 'tooltip (prop)',
                type: 'all three',
              },
              {
                description:
                  'The web picks the tooltip’s trigger and the emphasis from it. iOS and Android read only whether it is "none", which switches the whole gesture off — nothing else the chart passes turns one back on.',
                name: 'hover',
                type: 'web · native as on/off',
              },
              {
                description:
                  'The same off switch on native, and nothing on the web: no renderer tells "single" from "multiple" yet.',
                name: 'selection',
                type: 'native as on/off',
              },
              {
                description: 'All three, on every form that reads a pointer at all.',
                name: 'dimOpacity · dimDuration · marker · crosshairStyle',
                type: 'all three',
              },
              {
                description: 'Chart.Candlestick alone, on all three. Every other form is lit by marker and dimOpacity.',
                name: 'highlightColor · highlightBlend',
                type: 'candlestick only',
              },
              {
                description:
                  'The web candlestick, as an on/off — the number is not a factor, and the engine scales by its own amount. Native decodes it and draws nothing.',
                name: 'highlightScale',
                type: 'web candlestick, as a flag',
              },
              {
                description:
                  'Chart.Candlestick on the web, through ECharts’ inside zoom. Native decodes it and does nothing.',
                name: 'zoom',
                type: 'web candlestick',
              },
              {
                description: 'iOS and Android. The web has no honest equivalent.',
                name: 'haptics',
                type: 'native only',
              },
              {
                description: 'iOS and Android. A pointer has no second finger, so the web keeps range at null.',
                name: 'range',
                type: 'native only',
              },
              {
                description:
                  'iOS and Android, wherever a span can be held: the stretch between the fingers in its own direction, the trace stepped back around it, a dot on each end.',
                name: 'rangeStyle',
                type: 'native only',
              },
            ]}
          />

          <h3 id="plot-style">Plot, series style and animation</h3>
          <p>
            <code>surface</code> is the box the chart sits in; <code>plot</code> is the drawing area inside it.{' '}
            <code>seriesStyles</code> is keyed by <code>ChartSeries.id</code>, so a style survives reordering and
            filtering the way <code>slot</code> does for color.
          </p>
          <div className={styles.note()}>
            <strong>These three are the floor, not the ceiling.</strong> <code>animation</code>,{' '}
            <code>seriesStyles</code> and <code>interaction</code> props are declared with the wider{' '}
            <Link href="/docs/native#native-presentation">
              <code>Native*</code>
            </Link>{' '}
            shapes, which add a traced <code>reveal</code>, a <code>glow</code>, a patterned <code>fill</code> and a
            selection <code>marker</code> on top of what is below — on every entry point, the web one included. The same
            goes for <code>annotations</code> and the two axes.
          </div>
          <CodeBlock>{`type ChartPlotStyle = {
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

/** On NativeChartSeriesStyle, so every entry point takes it — the web one included. */
type ChartSeriesFill = {
  /** Closes the fill against a value instead of the plot's floor, filling either side of it. */
  baseline?: number
  /** One dot's diameter, in points. Default 1. */
  dotSize?: number
  /**
   * How much strength the fill still has at the plot's floor, 0–1. Default 1, an even fill.
   * A dotted one on the web also needs an explicit height — the ramp is baked into a tile
   * before the chart is measured, and one that has not said how tall it is keeps an even fill.
   */
  fadeTo?: number
  /** "dots" | "solid" */
  pattern?: ChartFillPattern
  /** Centre-to-centre distance between dots, in points. Default 4. */
  spacing?: number
}

type ChartAnimation = {
  enabled?: boolean
  /** The entrance. Turn it off for a chart that re-renders on every keystroke. */
  initial?: boolean
  /** The transition when data changes under a mounted chart. */
  updates?: boolean
  duration?: number
  /** How long the entrance waits before it starts. A beat here keeps a trace from being
   * drawn under a navigation transition, where its first part is never seen. */
  delay?: number
  /** "linear" | "ease-in" | "ease-out" | "ease-in-out" | "spring" */
  easing?: ChartAnimationEasing
}`}</CodeBlock>
        </section>

        <section className={cn(styles.section(), page !== 'builders' && 'hidden')} id="builders">
          <h2>Builders</h2>
          <p>
            Every prop on this page is a plain object, and writing one by hand stays supported. The builders exist for
            the handful of shapes where hand-writing is genuinely error-prone: a union you have to remember the
            discriminant for, a record whose key repeats an id declared elsewhere, a type that permits two fields only
            one variant reads.
          </p>
          <p>
            They return the same plain objects the props always were — no wrapper, no class, nothing to unwrap. So they
            compose, spread and serialize, and you can build your own presets on top of them.
          </p>
          <CodeBlock>{`import {
  // A whole chart as one object, with every builder below handed to it.
  zyplot,
  // Builders with variants, one function per variant.
  annotation,
  axis,
  marker,
  reveal,
  tooltip,
  // A series and its styling, declared together.
  series,
  seriesProps,
  // Typed passthroughs for the groups with nothing to get wrong.
  animation,
  fill,
  format,
  glow,
  halo,
  interaction,
  plot,
  seriesStyle,
  surface,
  theme,
} from '@hzblj/zyplot'`}</CodeBlock>
          <div className={styles.note()}>
            <strong>They are on every entry point.</strong> The builders live in the shared contract, so the same import
            works from <code>@hzblj/zyplot</code>, <code>/web</code>, <code>/ios</code> and <code>/android</code>, and
            every renderer draws what they describe: <code>glow</code>, <code>halo</code>, <code>badge</code>,{' '}
            <code>pulse</code>, <code>fill</code> and <code>scrubOpacity</code> all land in the DOM as well as on a
            native canvas.
          </div>

          <h3 id="builder-zyplot">zyplot</h3>
          <p>
            <code>zyplot</code> takes a builder and hands it every one of these functions as <code>z</code>, so a whole
            chart — its data, its axes, its arrival, the styling of each series — is one object with one import behind
            it. What comes back is the props that chart takes, ready to spread, which is what makes a sample something
            you can lift into an app as it stands.
          </p>
          <CodeBlock>{`import {Chart, zyplot} from '@hzblj/zyplot'

const chart = zyplot(z => ({
  animation: z.animation({ duration: 420, reveal: z.reveal.draw({ duration: 240 }) }),
  annotations: [
    z.annotation.line({ axis: 'y', dash: [1, 4], id: 'close', value: range.previousClose }),
    // The app's own view for a mark goes on the mark, so its id is written once.
    z.annotation.point({ id: 'live', view: LivePrice, x: live.category, y: live.value }),
  ],
  categories: range.categories,
  interaction: z.interaction.scrub({ dimOpacity: 0.66, marker: z.marker.trail({ dot: true }) }),
  series: [
    z.series({
      color: '#ff3b4a',
      id: 'price',
      label: 'Price',
      style: { fill: z.fill({ fadeTo: 0.12, pattern: 'dots' }), strokeWidth: 2.3 },
      values: range.values,
    }),
  ],
  // The reading's own view, and where the chart puts it.
  tooltip: z.tooltip.above({ lift: 2, view: ReadingChip }),
  yAxis: z.axis.overlay({ format: z.format({ decimals: 2 }) }),
}))

<Chart.Line {...chart} />`}</CodeBlock>
          <p>
            What a series or an annotation carries for itself is lifted on the way out: <code>style</code> into{' '}
            <code>seriesStyles</code>, <code>view</code> into <code>annotationViews</code>. Both of those props are
            records keyed by an id declared elsewhere, which is a spelling of that id nothing checks — so the config
            writes it once, beside the thing it belongs to, and the record is built for you. An explicit entry in either
            record still wins over what the series or annotation named.
          </p>
          <p>
            Nothing has to be in there. A config that leaves the data out is a preset, and the props you spread it under
            fill in the rest — which is how several charts share one look, or a range switch keeps the styling and
            changes only the values.
          </p>
          <CodeBlock>{`const scrubbing = zyplot(z => ({
  interaction: z.interaction.scrub({ dimOpacity: 0.5, marker: z.marker.trail({ dot: true }) }),
  plot: { clip: false },
}))

<Chart.Line {...scrubbing} categories={categories} series={series} />`}</CodeBlock>
          <PropsTable
            rows={[
              {
                description:
                  'Calls the builder once and returns the props to spread onto a chart, with the series styling split out.',
                name: 'zyplot(build)',
                type: 'ZyplotChartProps',
              },
              {
                description:
                  'Every builder on this page, reached as z.annotation or z.reveal.draw: annotation, axis, marker, reveal, series and tooltip, plus the passthroughs animation, fill, format, glow, halo, interaction, plot, seriesStyle, surface and theme.',
                name: 'z',
                type: 'ZyplotFactories',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>Name the form to be checked where you write it.</strong> Left plain, a config is checked where it is
            spread — the same error, one file later. <code>zyplot&lt;LineChartProps&gt;(…)</code> checks it against that
            form as you type and offers its fields to autocomplete, and{' '}
            <code>zyplot&lt;Partial&lt;LineChartProps&gt;&gt;(…)</code> does the same for a preset that expects its data
            at the call site.
          </div>
          <div className={styles.note()}>
            <strong>Build it once.</strong> The object is rebuilt on every call, and a chart whose props change identity
            re-serializes its whole dataset — over the bridge, on native. Declare it at module scope where nothing in it
            depends on state, and wrap it in <code>useMemo</code> keyed on the data where it does.
          </div>

          <h3 id="builder-series">series and seriesProps</h3>
          <p>
            <code>seriesStyles</code> is a record keyed by <code>ChartSeries.id</code>, which means styling a series
            normally spells its id twice — once on the series, once as the key — with nothing checking the two agree. A
            typo does not fail: it silently drops the styling. <code>series</code> declares both in one place and{' '}
            <code>seriesProps</code> splits the list into the two props the chart takes — the same split{' '}
            <code>zyplot</code> does, on its own, for a chart whose other props are already where you want them.
          </p>
          <CodeBlock>{`const lines = useMemo(
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

<Chart.Line {...lines} categories={range.categories} />`}</CodeBlock>
          <PropsTable
            rows={[
              {
                description:
                  'One series with its styling attached. Everything ChartSeries takes, plus style for the per-series overrides.',
                name: 'series(options)',
                type: 'StyledChartSeries',
              },
              {
                description:
                  'Splits a list of styled series into { series, seriesStyles }, keying each style by the id it was declared with.',
                name: 'seriesProps(list)',
                type: '{ series, seriesStyles }',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>Hold the result across renders.</strong> <code>seriesProps</code> rebuilds both props on every call,
            and a chart whose props change identity re-serializes its whole dataset — over the bridge, on native. Wrap
            it in <code>useMemo</code> keyed on the data, as above.
          </div>

          <h3 id="builder-annotation">annotation</h3>
          <p>
            <code>annotations</code> is a union discriminated by <code>type</code>, so writing one by hand means
            remembering which fields belong to which variant: a <code>range</code> takes <code>start</code>/
            <code>end</code>, a <code>point</code> takes <code>x</code>/<code>y</code>, and a <code>line</code> takes
            one <code>value</code> plus the <code>axis</code> it sits on. These set the discriminant and let
            autocomplete offer only the fields that variant actually has.
          </p>
          <PropsTable
            rows={[
              {
                description:
                  'A reference line: a target, a threshold, a launch date. Takes axis and value, plus dash and width for how it is drawn — omit dash for a solid rule — and align, where in a category’s band it sits.',
                name: 'annotation.line',
                type: 'NativeChartLineAnnotation',
              },
              {
                description: 'A shaded span: a quarter, an incident window, a tolerance band. Takes start and end.',
                name: 'annotation.range',
                type: 'ChartRangeAnnotation',
              },
              {
                description: 'A single marked point, placed by coordinate. Takes x and y.',
                name: 'annotation.point',
                type: 'NativeChartPointAnnotation',
              },
              {
                description: 'Free text on the plot. Omit x and y and the renderer places it.',
                name: 'annotation.text',
                type: 'ChartTextAnnotation',
              },
              {
                description:
                  'A point the chart measures and nobody draws, reported in geometry.annotations under its id. Takes id, x and y — for a view of your own that has to line up with the data exactly.',
                name: 'annotation.measure',
                type: 'NativeChartPointAnnotation',
              },
              {
                description:
                  'Your own view in place of the mark this annotation would have drawn, on any of them. zyplot lifts it into annotationViews keyed by this id, so the id is written once — and the chart keeps measuring the annotation and moving your view with the data. A point with a view is not drawn at all; a rule keeps its line and gives up its badge and label to the view that caps it.',
                name: 'view',
                type: 'ChartSlotView',
              },
            ]}
          />
          <p>
            Because they are functions returning objects, a project's own vocabulary is a one-line wrapper — and the
            place to put the decision once rather than at each call site.
          </p>
          <CodeBlock>{`const baseline = (value: number, label: string) =>
  annotation.line({
    axis: 'y',
    // Omit dash for a solid rule; width is in points on both platforms.
    dash: [1, 4],
    id: 'baseline',
    label,
    // A dark chip behind the digits, and the side that keeps them inside the plot.
    labelBackground: '#000000',
    labelPosition: 'auto',
    // Fade the rule out entirely while a price is being read.
    scrubOpacity: 0,
    value,
    width: 1.5,
  })

const marketOpen = (category: string) =>
  annotation.line({ axis: 'x', badge: '↑', dash: [2, 4], id: 'open', size: 18, value: category })

<Chart.Line annotations={[baseline(range.baseline, 'Prev close'), marketOpen('09:30')]} … />`}</CodeBlock>
          <div className={styles.note()}>
            <strong>A rule on a category has to pick a side of it.</strong> A category is a band, a width rather than a
            line, so <code>align: 'end'</code> runs the rule along the band's trailing edge — where a rule meaning{' '}
            <em>up to here</em> belongs, since the mark it names is inside the span rather than at the end of it —{' '}
            <code>'start'</code> along its leading one, and the default <code>'center'</code> through the mark. It means
            nothing on a numeric axis, where a value is already a position, and it is read on iOS and Android: the web
            renderer centres every rule for now.
          </div>

          <h3 id="builder-axis">axis</h3>
          <p>
            One builder per axis position. <code>start</code> and <code>end</code> put the labels in a gutter on that
            side; <code>overlay</code> puts them inside the plot against its trailing edge and reserves no gutter, which
            keeps the full width for the marks.
          </p>
          <p>
            <code>labelInset</code> is how far the labels sit off the plot's edge, whichever side of it they are on: an
            overlaid label steps back inside from the trailing edge, a gutter one steps out and the gutter widens to
            keep it. Left out, each renderer keeps a few points of its own — the same few the loading placeholder draws
            its labels at, so nothing moves when the data lands.
          </p>
          <CodeBlock>{`const priceAxis = (domain: { max: number; min: number }) =>
  axis.overlay({
    domain,
    format: { decimals: 2 },
    grid: false,
    labelInset: 22,
    labelSize: 13,
    ticks: false,
    // Only the two prices a reader is actually looking for.
    tickValues: [domain.min, domain.max],
  })

<Chart.Line xAxis={axis.start({ grid: false })} yAxis={priceAxis(domain)} … />`}</CodeBlock>
          <PropsTable
            rows={[
              {
                description: 'Labels in a gutter on the leading side — the left of a y axis, the bottom of an x axis.',
                name: 'axis.start',
                type: 'NativeChartAxisOptions',
              },
              {
                description: 'Labels in a gutter on the trailing side.',
                name: 'axis.end',
                type: 'NativeChartAxisOptions',
              },
              {
                description: 'Labels inside the plot, no gutter reserved.',
                name: 'axis.overlay',
                type: 'NativeChartAxisOptions',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>They describe the wider axis, and it is not native-only.</strong> What these return is a{' '}
            <Link href="/docs/native#native-axes">
              <code>NativeChartAxisOptions</code>
            </Link>
            , which is what <code>xAxis</code> and <code>yAxis</code> take on every entry point — so the overlaid
            position, <code>labelInset</code>, <code>labelSize</code> and <code>ticks</code> all work on a web chart
            too. Plain{' '}
            <Link href="/docs/data-types#axis-options">
              <code>ChartAxisOptions</code>
            </Link>{' '}
            objects stay valid everywhere, because the wider type is a superset of them.
          </div>

          <h3 id="builder-reveal">reveal</h3>
          <p>
            The first-render entrance, passed as <code>animation.reveal</code>. Only a traced entrance has a frontier to
            light, so <code>flashColor</code>, <code>trackColor</code> and <code>startOpacity</code> are{' '}
            <code>draw</code>'s alone — a fade has nothing to flash, and therefore takes only its duration and easing.
          </p>
          <CodeBlock>{`const arrival = animation({
  reveal: reveal.draw({
    duration: 420,
    // A brief brightening as the trace lands.
    flashColor: '#ffe3e8',
    flashDuration: 480,
    // Hold the glow a beat, then let it leave in one piece.
    flashEasing: 'ease-in-out',
    flashHold: 220,
    // Draw the whole path faintly first, so the shape reads from frame one.
    trackColor: '#8a8a8a',
    trackOpacity: 0.4,
  }),
  updates: false,
})

<Chart.Line animation={arrival} … />`}</CodeBlock>
          <PropsTable
            rows={[
              {
                description:
                  'Traces the marks along the x axis. Takes the flash, track and easing fields. Forms with no direction — radial and hierarchical ones — fall back to a fade.',
                name: 'reveal.draw',
                type: 'ChartRevealAnimation',
              },
              {
                description: 'Fades the marks in. Takes duration and easing only.',
                name: 'reveal.fade',
                type: 'ChartRevealAnimation',
              },
              {
                description: 'No entrance. Takes nothing.',
                name: 'reveal.none',
                type: 'ChartRevealAnimation',
              },
            ]}
          />

          <h3 id="builder-marker">marker</h3>
          <p>
            How the mark under the finger is picked out, passed as <code>interaction.marker</code>. The styles read
            different fields: <code>span</code> is how far a segment reaches along the line and means nothing to a dot,{' '}
            <code>size</code> is a dot's diameter and means nothing to a stretch of stroke. The type permits all of them
            at once; these do not.
          </p>
          <CodeBlock>{`const scrubbing = interaction({
  crosshair: 'x',
  crosshairStyle: { color: '#ffffff', width: 1 },
  // Dim the rest of the line so the lit segment reads as the reading.
  dimOpacity: 0.38,
  haptics: true,
  hover: 'nearest',
  marker: marker.segment({
    color: '#ffffff',
    glow: glow({ color: '#ff3b4a', opacity: 0.32, radius: 42 }),
    span: 2,
  }),
})

<Chart.Line interaction={scrubbing} tooltip={false} … />`}</CodeBlock>
          <PropsTable
            rows={[
              {
                description: 'A dot on the mark. Takes size; rejects span.',
                name: 'marker.point',
                type: 'ChartSelectionMarker',
              },
              {
                description:
                  'Brightens the stretch of line around the mark and blooms behind it, which reads as light moving along the data. Takes span; rejects size unless dot is set.',
                name: 'marker.segment',
                type: 'ChartSelectionMarker',
              },
              {
                description:
                  'Brightens everything up to the mark instead of a window around it, so the line reads as the story so far and the rest as yet to come. Rejects span.',
                name: 'marker.trail',
                type: 'ChartSelectionMarker',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>Both stroke styles need a dim to read against.</strong> <code>marker.segment</code> and{' '}
            <code>marker.trail</code> are drawn over the line rather than beside it, so without <code>dimOpacity</code>{' '}
            there is nothing for the lit stretch to stand out from.
          </div>
          <div className={styles.note()}>
            <strong>
              Pass <code>dot</code> to mark the reading as well as light it.
            </strong>{' '}
            A segment or a trail with <code>dot: true</code> puts a <code>size</code> dot on the mark under the finger,
            drawn by the chart — a dot you place yourself from a scrub handler lands a frame or two after the finger has
            moved on.
          </div>
          <div className={styles.note()}>
            <strong>A marker is not a tooltip.</strong> It says only which mark is being read, never what it says — so
            use it when the value is shown outside the plot, and pair it with{' '}
            <Link href="/docs/hooks/use-chart-scrub">
              <code>useChartScrub</code>
            </Link>{' '}
            to drive that readout.
          </div>

          <h3 id="builder-passthroughs">The passthroughs</h3>
          <p>
            The option groups with no variants to get wrong get a plain identity function each. They add no safety a
            prop's own type does not already give. What they add is a name to import and hold, so a preset can be
            declared and reused away from the chart that consumes it, and read as one thing rather than as an anonymous
            object literal.
          </p>
          <CodeBlock>{`// chart-style.ts — declared once, imported by both the line and the candlestick chart.
export const chartTheme = theme({ colors: { label: '#8a8a8a' } })
export const priceFormat = format({ decimals: 2, locale: 'en-US' })
export const card = surface({ background: '#0b0b0b', cornerRadius: 16, padding: 12 })
export const priceLine = seriesStyle({
  fill: fill({ fadeTo: 0.12, pattern: 'dots', spacing: 3.4 }),
  fillOpacity: 0.32,
  glow: glow({ opacity: 0.16, radius: 7 }),
  strokeWidth: 2.3,
})`}</CodeBlock>
          <PropsTable
            rows={[
              {description: 'Entrance and data-change timing.', name: 'animation', type: 'NativeChartAnimation'},
              {description: 'Pointer and finger behaviour.', name: 'interaction', type: 'NativeChartInteraction'},
              {
                description:
                  'The same group, preset for a reading under a finger: an x crosshair, haptics and the nearest mark rather than the axis slice. Anything you pass wins. What appears for the reading is the tooltip prop’s to say.',
                name: 'interaction.scrub',
                type: 'NativeChartInteraction',
              },
              {description: 'Per-series overrides.', name: 'seriesStyle', type: 'NativeChartSeriesStyle'},
              {description: 'The drawing area inside the surface.', name: 'plot', type: 'ChartPlotStyle'},
              {description: 'The box the chart sits in.', name: 'surface', type: 'ChartSurface'},
              {description: 'Colours and fonts.', name: 'theme', type: 'ChartTheme'},
              {description: 'How numbers are written.', name: 'format', type: 'ChartNumberFormat'},
              {
                description: 'A bloom behind a mark, in the mark’s own colour unless told otherwise.',
                name: 'glow',
                type: 'ChartGlow',
              },
              {
                description:
                  'A hard disc behind a point — unlike a glow it has an edge, so a small bright dot can sit in a larger ring.',
                name: 'halo',
                type: 'ChartHalo',
              },
              {
                description:
                  'The area under a trace: a wash or a grid of dots, thinning towards the plot floor or closed against a value. Goes on a series style beside glow.',
                name: 'fill',
                type: 'ChartSeriesFill',
              },
            ]}
          />
          <div className={styles.note()}>
            <strong>They are drawn on every platform, on the forms that have the mark they decorate.</strong> A series'{' '}
            <code>glow</code> and <code>fill</code> ride the canvas that strokes a trace, so they need a form that has
            one; a <code>halo</code> or a <code>pulse</code> needs a point to sit behind. Which forms those are is in{' '}
            <Link href="/docs/native#native-presentation">the presentation vocabulary</Link>.
          </div>
          <div className={styles.note()}>
            <strong>There is no builder for a pulse.</strong> It is the one nested object that also takes a{' '}
            <code>boolean</code>: <code>pulse: true</code> is the whole of what most live points want, and{' '}
            <code>annotation.point</code> already types the object form for the ones that tune the rhythm.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'use-chart-scrub' && 'hidden')} id="use-chart-scrub">
          <p className={styles.kicker()}>Hook</p>
          <h2>useChartScrub</h2>
          <p>
            One of the two things a chart cannot answer from inside its own box: which datum is being read. It is for
            the pattern where a price, a date and a delta are real text above the plot, with the chart itself drawing no
            tooltip at all. The same hook on all three platforms — a finger on iOS and Android, a pointer on the web,
            reported as the same phases.
          </p>
          <p>
            Hand its <code>onInteraction</code> straight to a chart and read <code>selection</code> for what is being
            read. The selection returns to <code>null</code> when the finger lifts or the pointer leaves the plot, which
            is the signal a readout needs to go back to its resting value.
          </p>
          <div className={styles.note()}>
            <strong>
              A second finger moves the reading from <code>selection</code> to <code>range</code>.
            </strong>{' '}
            Turn on{' '}
            <Link href="/docs/data-types#interaction">
              <code>interaction.range</code>
            </Link>{' '}
            and two fingers report the span between them — <code>startIndex</code> and <code>endIndex</code> in data
            order, plus where each end's mark landed, so a total can sit over the bars it covers. Only ever one of the
            two is set, so a headline can show a value or a total without deciding which arrived last. iOS and Android
            only: a pointer has no second finger, and the web keeps <code>range</code> at <code>null</code>.
          </div>
          <div className={styles.note()}>
            <strong>A scrub is a continuous reading, so not every form has one.</strong> On the web it is{' '}
            <code>Chart.Line</code> and <code>Chart.Candlestick</code> that turn the pointer into one; the other forms
            report the mark the pointer landed on instead, which carries no <code>index</code> and so leaves the
            selection alone. On native a finger is read by its position along the category axis, so the forms that have
            one — the line, area, bar and candlestick families — are the forms a scrub means something on. The radial
            and flow ones have no ordered axis to walk, and nothing usable comes back from them.
          </div>
          <div className={styles.note()}>
            <strong>Text that has to keep up with the line is the chart's job, not the hook's.</strong> A readout above
            the plot sits still, so a re-render places it fine. A label pinned to the crosshair moves with the finger,
            and a position that comes back through this hook is a frame or two behind the line it belongs to — which
            reads as the label dragging. Pass those words as{' '}
            <Link href="/docs/native#native-scrubbing">
              <code>crosshairStyle.labels</code>
            </Link>{' '}
            instead and whoever draws the line draws them, and ask for the dot on the reading with{' '}
            <code>marker.dot</code> for the same reason. A held span is the same story twice over: hand it to{' '}
            <code>interaction.rangeStyle</code> rather than feeding the two indices back as a masked series, or the
            chart is rebuilt on every step of both fingers and the ends trail them.
          </div>
          <CodeBlock>{`'use client'

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
        interaction={{ crosshair: 'x', haptics: true, marker: marker.segment() }}
        onInteraction={onInteraction}
        series={[{ id: 'price', label: 'Price', values: prices }]}
        tooltip={false}
      />
    </>
  )
}`}</CodeBlock>
          <h3 id="scrub-returns">What it returns</h3>
          <PropsTable
            rows={[
              {
                description: 'What the finger is on, or null when nothing is being scrubbed.',
                name: 'selection',
                type: 'ChartScrubSelection | null',
              },
              {
                description:
                  'The span under two fingers, or null when one finger is reading and when nothing is. Needs interaction.range, and iOS or Android to be the one drawing.',
                name: 'range',
                type: 'ChartInteractionRange | null',
              },
              {
                description: 'Hand this straight to the chart’s onInteraction.',
                name: 'onInteraction',
                type: '(event) => void',
              },
              {
                description: 'Drops the selection, for a caller that has its own reason to.',
                name: 'reset',
                type: '() => void',
              },
              {
                description:
                  'Where the plot and its annotations sit in the chart view, for drawing your own views over them.',
                name: 'geometry',
                type: 'ChartGeometry | null',
              },
            ]}
          />
          <CodeBlock>{`type ChartScrubSelection = {
  /** Position of the mark in the chart’s own data order. */
  index: number
  category?: string
  value?: number
}

type ChartInteractionRange = {
  /** Always the lower of the two, however the fingers are placed. Both ends inclusive. */
  startIndex: number
  endIndex: number
  startCategory?: string
  endCategory?: string
}

type ChartGeometry = {
  annotations: readonly { id: string; x: number; y: number }[]
  plot: { height: number; width: number; x: number; y: number }
}`}</CodeBlock>
          <h3 id="scrub-overlay">Drawing your own overlay</h3>
          <div className={styles.note()}>
            <strong>For a view that has to line up with the data, measure a mark rather than the plot.</strong>{' '}
            <code>plot</code> is the box around the marks, and each renderer puts the axis padding on its own side of
            it: the web&rsquo;s grid rect has the padding inside, the native ones keep the marks against the frame. So a
            grid or a label row placed off <code>plot</code> alone lands a few points out on one of the three.{' '}
            <code>annotation.measure()</code> is the exact answer instead &mdash; a point the chart measures and nobody
            draws, reported in <code>geometry.annotations</code> under the <code>id</code> you gave it. A mark lands
            where its data lands on every platform.
          </div>
          <div className={styles.note()}>
            <strong>
              For a view on an annotation, reach for <code>annotationViews</code> first.
            </strong>{' '}
            Key your own node by the annotation's <code>id</code> and the chart centres it on the spot, keeps its own
            mark for it out of the drawing, and moves it with the data — no geometry to hold, no positioning to write. A
            logo at the live reading, a letter on a rule, a price that stays with the last point. Every native form
            takes it, and on the web it is the five that report where an annotation landed — <code>Chart.Line</code>,{' '}
            <code>Chart.Area</code>, <code>Chart.Bar</code>, <code>Chart.StackedBar</code> and{' '}
            <code>Chart.Candlestick</code>.
          </div>
          <div className={styles.note()}>
            <strong>
              Write <code>{'{align, view}'}</code> when the default place is not the one you want.
            </strong>{' '}
            A rule that runs down the plot is a mark with a height of its own, so <code>'top'</code>,{' '}
            <code>'center'</code> and <code>'bottom'</code> are its head, its middle and its foot — and its head is what
            a view gets unless it asks, because that is where the chart's own badge goes. A point and a rule that runs
            across are spots rather than runs, so the three read as on the mark, above it and below it, and{' '}
            <code>'center'</code> is what they get unasked.
          </div>
          <CodeBlock>{`annotationViews={{
  // Halfway down the rule rather than capping it.
  earnings: { align: 'center', view: EarningsChip },
  // Sitting on the point rather than centred over it.
  live: { align: 'top', view: LiveBadge },
}}`}</CodeBlock>
          <CodeBlock>{`import { annotation, Chart, useLastReading } from '@hzblj/zyplot'

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
}`}</CodeBlock>
          <div className={styles.note()}>
            <strong>
              <code>geometry</code> is the way down for a view that stays put.
            </strong>{' '}
            It reports the plot's box and every annotation's <code>x</code>/<code>y</code> in the chart's own
            coordinates, which is what a grid behind the marks, a row of labels under them or a button on a rule is laid
            out from. An annotation that is only an anchor for such a view takes <code>hidden: true</code>: measured and
            reported as usual, drawn by nobody.
          </div>
          <div className={styles.note()}>
            <strong>For a view that follows the finger, it is the wrong tool.</strong> Nothing reports where a reading
            is, because a position laid out from your own render arrives after the crosshair it belongs beside.{' '}
            <code>tooltip</code> and <code>rangeView</code> are the way: the chart mounts your node and moves it in the
            pass it draws the reading in.
          </div>
          <CodeBlock>{`'use client'

import { annotation, Chart, tooltip, useChartScrub } from '@hzblj/zyplot'

// A component, so the config holding it is the same value on every render: what the card says can
// change without a single prop on the chart changing with it. The align says where down the plot it
// sits — left out it goes against the top, where a card read as belonging to the reading belongs.
const reading = tooltip.beside({ align: 'center', view: EventCard })

export const Price = ({ prices, categories }: PriceProps) => {
  const { geometry, onInteraction, selection } = useChartScrub()
  const dividend = geometry?.annotations.find((mark) => mark.id === 'dividend')

  return (
    <View>
      <ReadingProvider selection={selection}>
        <Chart.Line
          annotations={[
            // No badge: the rule is the chart's, the head is yours.
            annotation.line({ axis: 'x', dash: [2, 4], id: 'dividend', value: '12 Jul' }),
          ]}
          categories={categories}
          interaction={{ crosshair: 'x', haptics: true }}
          onInteraction={onInteraction}
          series={[{ id: 'price', label: 'Price', values: prices }]}
          tooltip={reading}
        />
      </ReadingProvider>

      {dividend ? (
        <Pressable
          onPress={openDividend}
          style={[styles.badge, { left: dividend.x - 9, top: dividend.y - 9 }]}
        >
          <Text>D</Text>
        </Pressable>
      ) : null}
    </View>
  )
}`}</CodeBlock>
          <div className={styles.note()}>
            <strong>
              <code>index</code> is what makes it useful.
            </strong>{' '}
            A native interaction event carries the mark's position in your data, so the readout indexes your own arrays
            rather than reading numbers back off the chart. That is how a scrub can show a formatted price, a label and
            a percentage the chart never knew about.
          </div>
          <div className={styles.note()}>
            <strong>The identity is stable.</strong> <code>onInteraction</code> and <code>reset</code> keep the same
            identity across renders, and the returned object only changes when the selection does — so a{' '}
            <code>memo</code>'d chart is not re-rendered by the readout updating above it.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'use-last-reading' && 'hidden')} id="use-last-reading">
          <p className={styles.kicker()}>Hook</p>
          <h2>useLastReading</h2>
          <p>
            A series is often shorter than its axis on purpose — a trading session still in progress, a forecast that
            has not started — so its last <em>slot</em> is not its last reading. This walks back to where the data
            really ends, which is where a "now" marker belongs. It returns <code>null</code> when the series has no
            readings at all. Unlike{' '}
            <Link href="/docs/hooks/use-chart-scrub">
              <code>useChartScrub</code>
            </Link>{' '}
            it reads nothing but the arrays you pass it, so it is on every entry point, web included.
          </p>
          <CodeBlock>{`const live = useLastReading(range.categories, range.values)

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
/>`}</CodeBlock>
          <h3 id="reading-arguments">Arguments</h3>
          <PropsTable
            rows={[
              {
                description: 'The categories the series is plotted against.',
                name: 'categories',
                required: true,
                type: 'readonly string[]',
              },
              {
                description: 'The series values. Trailing null entries are skipped, as are gaps.',
                name: 'values',
                required: true,
                type: 'readonly (number | null)[]',
              },
            ]}
          />
          <CodeBlock>{`type ChartReading = {
  category: string
  index: number
  value: number
}`}</CodeBlock>
          <div className={styles.note()}>
            <strong>The native renderers already agree with it.</strong> A scrub stops at the same point this returns,
            so a "now" marker placed here is exactly where the finger can no longer go — the chart and the marker cannot
            disagree about where the data ends.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'loading-states' && 'hidden')} id="loading-states">
          <h2>Loading</h2>
          <p>
            Hold <code>isLoading</code> true while the data is in flight. The chart shows the shape it is about to be,
            at the height it will occupy, and cross-fades into the plot when the flag drops — same grid cell, same size,
            so nothing on the page moves when the marks land.
          </p>
          <CodeBlock>{`<Chart.Line
  categories={categories}
  height={320}
  isLoading={revenue.isPending}
  series={series}
/>`}</CodeBlock>
          <p>
            The placeholder is derived from the props the chart already has: one legend row per series, and axis rows
            only where an axis is visible. There is nothing to configure and nothing to keep in sync when the chart
            changes.
          </p>
          <p>
            Its marks are the form's own, not a generic block: on the web, bars grown off the baseline for the bar
            family, candles floating on their wicks for <code>Chart.Candlestick</code>, a ring for the radial forms,
            dots for the scatter, a curve for the lines. A placeholder shaped like something else moves every mark on
            the plot when it is swapped out, which is the layout shift the reserved height exists to prevent.
          </p>
          <div className={styles.note()}>
            <strong>It is drawn in the plot the chart is about to use.</strong> The axis options themselves are what the
            placeholder works its geometry out of: the gutter on the side the labels are on and no wider than the widest
            of them — none at all for an <code>overlay</code> axis, which draws its labels inside the plot — a mark for
            each <code>tickValue</code> at the reading it was pinned to, the categories on the middle of their own
            bands, and the plot's own <code>plotDimension</code> paddings. The axis furniture is laid down once in the
            grid colour and left to sit; only the marks shimmer, since a rule the chart is about to draw in the same
            place is not a value still to come. All three renderers keep the same gutters, so nothing moves on any of
            them when the data lands.
          </div>
          <div className={styles.note()}>
            <strong>The first frame is a loading state too.</strong> A chart has to read its colors off the document
            before it can paint, so the built-in placeholder also covers that frame for a chart that says nothing about
            loading. Pass <code>isLoading={'{false}'}</code> from the first render and it stays out of the way: the plot
            fades in on its own, which is what a chart holding its data already wants. The wrapper carries{' '}
            <code>aria-busy</code> while either is true, and the placeholder itself is <code>aria-hidden</code>.
          </div>
          <div className={styles.note()}>
            <strong>Native draws one too, in its own way.</strong> <code>isLoading</code> means the same thing on iOS
            and Android, and both draw a shimmering placeholder shaped like the form they stand in for — a ring for the
            radial ones, a row of columns for the bar family, a curve for everything else. They group a little more
            coarsely than the web does: the candlestick and the boxplot take that column row, where the DOM renderer
            draws candles and boxes. What they do not have is a <code>skeleton</code> slot or a <code>.Skeleton</code>{' '}
            component to mount on its own: those are DOM composition, and the placeholder there is one view the renderer
            draws.
          </div>
          <h3 id="skeleton-props">Skeleton props</h3>
          <p>
            Every form also exposes its placeholder on its own, as <code>Chart.Line.Skeleton</code> — for when the chart
            is not mounted yet at all: a Suspense fallback, a route placeholder, a dashboard slot whose query has not
            started. These props apply only there; a chart driven by <code>isLoading</code> fills them in itself.
          </p>
          <CodeBlock>{`<Suspense fallback={<Chart.Line.Skeleton height={320} legendCount={2} />}>
  <Revenue />
</Suspense>`}</CodeBlock>
          <PropsTable
            rows={[
              {
                defaultValue: '240',
                description: 'Reserved height. Match the chart it stands in for.',
                name: 'height',
                type: 'number',
              },
              {
                defaultValue: '0',
                description:
                  'Legend rows to reserve. Drawn from two up — a single series gets no legend, so reserving a row for one would leave a gap the chart never fills.',
                name: 'legendCount',
                type: 'number',
              },
              {
                defaultValue: 'true',
                description:
                  'The horizontal axis: false for one the chart hides, true for the label row alone, or the same options object the chart is given — which is what lets the placeholder keep the gutter, the labels and the plot paddings the chart is about to keep.',
                name: 'xAxis',
                type: 'boolean | NativeChartAxisOptions',
              },
              {
                defaultValue: 'true',
                description:
                  'The vertical axis, read the same way. Given the options, the gutter goes on the side the labels are on — an overlay axis reserves none — and a pill is drawn at each tickValue the chart pinned.',
                name: 'yAxis',
                type: 'boolean | NativeChartAxisOptions',
              },
              {
                description:
                  'The names the category axis will write, which is also how many marks the plot will hold: a week of seven bars and a month of thirty are spaced the way they will land.',
                name: 'categories',
                type: 'readonly string[]',
              },
              {
                description:
                  'How the value labels will read. What they will need is what their gutter has to be, so a prefixed or long format is reserved for rather than guessed at.',
                name: 'format',
                type: 'ChartNumberFormat',
              },
              {
                description:
                  'Which way the marks run, for the forms that can be turned. Defaults to vertical, and to horizontal on Chart.StackedBar.Skeleton.',
                name: 'orientation',
                type: '"horizontal" | "vertical"',
              },
              {
                defaultValue: '8',
                description:
                  'How many bars, on Chart.Bar.Skeleton alone. Taken from categories when they are given, so it is for a standalone fallback that has none.',
                name: 'count',
                type: 'number',
              },
              {
                description: 'CSS class applied to the skeleton root.',
                name: 'className',
                type: 'string',
              },
            ]}
          />
          <h3 id="custom-skeleton">Custom skeleton</h3>
          <p>
            <code>skeleton</code> takes a rendered element, not a component, and replaces the built-in one while{' '}
            <code>isLoading</code> is true. Keep its height equal to the chart's so the swap still costs no layout
            shift.
          </p>
          <CodeBlock>{`function RevenueSkeleton({ height = 320 }) {
  return (
    <div
      aria-label="Loading revenue chart"
      aria-busy="true"
      role="status"
      style={{ height }}
    >
      <div className="skeleton-title" />
      <div className="skeleton-plot" />
    </div>
  )
}

<Chart.Line
  isLoading
  skeleton={<RevenueSkeleton height={320} />}
  height={320}
  axis={{ x: false, y: true }}
  categories={categories}
  series={series}
/>`}</CodeBlock>
          <div className={styles.note()}>
            <strong>
              It covers <code>isLoading</code> only.
            </strong>{' '}
            The frame before the first paint uses the built-in placeholder, because that one is derived from the chart
            and always matches it — and an explicit <code>isLoading={'{false}'}</code> skips that frame altogether.
            Legend rows and axis gutters are yours to mirror here — <code>axis</code> shapes the built-in placeholder,
            not this one.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'composition' && 'hidden')} id="composition">
          <h2>Frame and legend</h2>
          <p>
            <code>Chart.Frame</code> is the card a chart can sit in: a title, a description, one row for filters, and a
            caption underneath for the source or the caveat. It is optional — a chart dropped straight into a dashboard
            grid needs no card — and when it is used it is the standard card recipe, so a chart never invents its own
            container.
          </p>
          <CodeBlock>{`<Chart.Frame
  title="Revenue"
  description="Monthly recurring revenue"
  caption="Source: billing ledger"
>
  <Chart.Line categories={categories} series={series} />
</Chart.Frame>`}</CodeBlock>
          <p>
            The header only exists when at least one of <code>title</code>, <code>description</code> and{' '}
            <code>actions</code> is set, so a frame with none of them is a plain card around the plot.
          </p>
          <div className={styles.note()}>
            <strong>
              Frame is not <code>surface</code>.
            </strong>{' '}
            The frame is a card with type in it, rendered around the chart; <code>surface</code> is the box the plot
            itself is painted on, and it exists on native too. Use the frame for a titled dashboard card,{' '}
            <code>surface</code> when the chart needs its own background or padding.
          </div>
          <h3 id="frame-props">Frame props</h3>
          <PropsTable
            rows={[
              {
                description: 'Chart or composed visualization content.',
                name: 'children',
                required: true,
                type: 'ReactNode',
              },
              {
                description: 'Heading rendered above the chart.',
                name: 'title',
                type: 'string',
              },
              {
                description: 'Supporting text below the title.',
                name: 'description',
                type: 'string',
              },
              {
                description: 'Filters and controls aligned with the heading.',
                name: 'actions',
                type: 'ReactNode',
              },
              {
                description: 'Source, method or caveat below the chart.',
                name: 'caption',
                type: 'string',
              },
              {
                description: 'CSS class applied to the frame.',
                name: 'className',
                type: 'string',
              },
            ]}
          />
          <h3 id="legend-props">Legend props</h3>
          <p>
            A chart renders its own legend from two series up, and none for a single one, so <code>Chart.Legend</code>{' '}
            is for the surface that places identity itself — one legend above a row of small multiples, or a legend that
            doubles as a series filter. Colors come in already resolved, so pin <code>slot</code> or <code>color</code>{' '}
            on the series and both agree by construction.
          </p>
          <PropsTable
            rows={[
              {
                description: 'Stable IDs, labels and resolved swatch colors.',
                name: 'items',
                required: true,
                type: 'ChartLegendItem[]',
              },
              {
                description: 'CSS class applied to the legend.',
                name: 'className',
                type: 'string',
              },
            ]}
          />
        </section>

        <section className={cn(styles.section(), page !== 'revolut' && 'hidden')} id="revolut">
          <p className={styles.kicker()}>App</p>
          <h2>Revolut</h2>
          <p>
            The example app ships a full stock quote screen in the shape Revolut's has: a headline price that follows
            the finger, a smoothed intraday line that stops where the session does, a range selector, a candlestick
            toggle, and native tabs and headers above it all. It is the reference for what the native renderers are for
            — everything on the screen except the plot itself is ordinary React Native.
          </p>
          <figure className={styles.screenshot()}>
            <img
              alt="The Revolut-style quote screen running on the web, on Android and on iOS, side by side"
              className={styles.screenshotLight()}
              loading="lazy"
              src="/apps/revolut/light.png"
            />
            <img alt="" className={styles.screenshotDark()} loading="lazy" src="/apps/revolut/dark.png" />
            <figcaption className={styles.galleryMeta()}>
              One screen, three renderers — the web build, Compose on Android, SwiftUI on iOS — in the appearance you
              are reading this page in.
            </figcaption>
          </figure>
          <h3 id="revolut-source">What it uses</h3>
          <PropsTable
            rows={[
              {
                description:
                  'The intraday price: smoothed, glowing, with a dashed baseline rule, an event badge, and a pulsing point at the last reading that useLastReading finds.',
                name: 'Chart.Line',
                type: 'feature-charts/revolut-line-chart.tsx',
              },
              {
                description:
                  'The same screen switched to OHLC, with the candle width and radius measured off the design and the volume histogram left off.',
                name: 'Chart.Candlestick',
                type: 'feature-charts/revolut-candlestick-chart.tsx',
              },
              {
                description:
                  'Turns the scrub into the price, the delta and the date above the plot, and back to the resting reading when the finger lifts. No tooltip is drawn by either chart.',
                name: 'useChartScrub',
                type: 'apps/example/use-quote-readout.ts',
              },
              {
                description:
                  'The reading card and the event badge are React Native views placed over the plot from the geometry the layout phase reports — not something the library draws.',
                name: 'geometry',
                type: 'apps/example/quote-chart-overlay.tsx',
              },
              {
                description:
                  'One screen per platform: SwiftUI through @expo/ui on iOS, Compose on Android, sharing the data, the theme and both charts.',
                name: 'Platform files',
                type: 'revolut.ios.tsx · revolut.android.tsx',
              },
            ]}
          />
          <p>
            The study is split where the library's job ends. The charts, their styling, the theme and the generated
            quotes are a shared package —{' '}
            <a href={`${REPOSITORY_URL}/tree/main/packages/feature-charts/src/revolut`}>
              <code>packages/feature-charts</code>
            </a>{' '}
            — so the three screens render the same <code>Chart.Line</code> rather than three copies of it. Everything
            around the plot is <a href={`${REPOSITORY_URL}/tree/main/apps/example/src/revolut`}>in the example app</a>,
            one file per platform, and <code>apps/example</code> runs it on a device with <code>yarn ios:example</code>{' '}
            or <code>yarn android:example</code>.
          </p>
          <div className={styles.note()}>
            <strong>A study, not a product.</strong> The screen is built to test the library against a design people
            already know by heart. It uses generated data, and it is not affiliated with or endorsed by Revolut.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'kraken' && 'hidden')} id="kraken">
          <p className={styles.kicker()}>App</p>
          <h2>Kraken</h2>
          <p>
            A crypto price screen in the shape Kraken's has: a trace that runs off both edges of the window with no axes
            at all, a readout that follows the finger, and the two numbers the plot reaches under it. Where the Revolut
            study is about chrome — native tabs, headers and pickers around a plot — this one is about the plot itself,
            and it is the reason two things exist in the presentation vocabulary.
          </p>
          <figure className={styles.screenshot()}>
            <img
              alt="The Kraken-style coin screen running on the web, on Android and on iOS, side by side"
              className={styles.screenshotLight()}
              loading="lazy"
              src="/apps/kraken/light.png"
            />
            <img alt="" className={styles.screenshotDark()} loading="lazy" src="/apps/kraken/dark.png" />
            <figcaption className={styles.galleryMeta()}>
              One trace, three renderers — a repeating canvas pattern on the web, a clipped dot grid on Compose and on
              SwiftUI — in the appearance you are reading this page in.
            </figcaption>
          </figure>

          <h3 id="kraken-fill">The dotted fill</h3>
          <p>
            The area under the trace is a grid of dots rather than a wash, and it thins on the way down instead of
            stopping dead at the bottom of the plot — so the fill has one edge to read, the trace, and the grey rule on
            the floor is left to be the axis. Both come from one <code>fill</code> on the series style, and all three
            renderers draw it: a clipped dot grid on the SwiftUI and Compose canvases, a repeating canvas pattern on the
            web.
          </p>
          <CodeBlock>{`z.series({
  color: '#f48415',
  id: 'price',
  label: '24H',
  style: {
    fill: z.fill({
      // A tenth of its strength by the floor, so the paint gathers under the trace.
      fadeTo: 0.12,
      pattern: 'dots',
      spacing: 3.4,
    }),
    // A dot grid wants more opacity than a wash — most of what it covers stays bare.
    fillOpacity: 0.32,
    strokeWidth: 2.4,
  },
  values: range.values,
})`}</CodeBlock>
          <div className={styles.note()}>
            <strong>A fill is not a form.</strong> <code>Chart.Area</code> still fills by default, because there the
            fill is the quantity. A <code>fill</code> on the series style is what puts one under a{' '}
            <code>Chart.Line</code>, where it is decoration — which is what let this screen keep the line chart's scrub,
            reveal and annotations.
          </div>

          <h3 id="kraken-trail">The trail scrub</h3>
          <p>
            Dragging across the plot lights the trace from its first reading up to the finger and leaves the rest
            dimmed, so the line reads as the story so far. That is <code>marker.trail</code> — the third selection
            marker, next to the dot and the window-around-the-reading segment.
          </p>
          <CodeBlock>{`interaction: z.interaction.scrub({
  // labels is one time per reading, in data order. The chart draws the one being read.
  crosshairStyle: { color: '#f8b877', labels: range.pointLabels, width: 1 },
  // What the trace fades to past the finger. Everything before it is redrawn at full
  // strength by the trail, so this is only ever seen ahead of the reading.
  dimOpacity: 0.66,
  marker: z.marker.trail({ color: '#f48415' }),
})`}</CodeBlock>
          <p>
            The time above the crosshair <em>is</em> drawn by the chart, through <code>crosshairStyle.labels</code> —
            one string per slot, placed by whichever renderer is drawing the line. It is the one piece of scrub chrome
            the app hands back: a label pinned to the crosshair has to move with it, and a position that reaches
            JavaScript through a bridge and returns as a re-render is a frame behind the line beside it. The reading
            card on the Revolut screen has no such problem, because it sits still.
          </p>

          <h3 id="kraken-source">What it uses</h3>
          <PropsTable
            rows={[
              {
                description:
                  'The price trace: a dotted fill fading to the floor, a grey rule on that floor standing in for the axis, a dashed rule at the latest price, and a haloed point on the last reading.',
                name: 'Chart.Line',
                type: 'feature-charts/kraken-chart.tsx',
              },
              {
                description:
                  'Lights the stretch of trace up to the reading and dims the rest, paired with dimOpacity so there is something for it to stand out from.',
                name: 'marker.trail',
                type: 'feature-charts/kraken-chart.tsx',
              },
              {
                description:
                  'The dot grid and its fade, resolved per scheme: ink on paper carries at a fraction of what light on black needs, so dark asks for roughly twice the opacity.',
                name: 'fill',
                type: 'feature-charts/kraken-chart.tsx',
              },
              {
                description:
                  'The times above the crosshair, one per reading, handed over with the interaction so the label is drawn by whoever draws the line.',
                name: 'crosshairStyle.labels',
                type: 'feature-charts/kraken-chart.tsx',
              },
              {
                description:
                  'Turns the scrub into the price and the delta above the plot. The change is measured from the window open; the dashed rule sits at the latest price. Two different questions.',
                name: 'useChartScrub',
                type: 'apps/example/use-kraken-readout.ts',
              },
              {
                description:
                  'One screen per platform: SwiftUI through @expo/ui on iOS, Compose on Android, React Native on the web — sharing the data, the theme and the chart.',
                name: 'Platform files',
                type: 'kraken-coin.ios.tsx · kraken-coin.android.tsx',
              },
            ]}
          />
          <p>
            Split the same way the Revolut study is: the chart, its style, the theme and the generated prices are the
            shared{' '}
            <a href={`${REPOSITORY_URL}/tree/main/packages/feature-charts/src/kraken`}>
              <code>packages/feature-charts</code>
            </a>{' '}
            package, and the screen around it —{' '}
            <a href={`${REPOSITORY_URL}/tree/main/apps/example/src/kraken`}>in the example app</a> — is one file per
            platform. <code>apps/example</code> runs it on a device with <code>yarn ios:example</code> or{' '}
            <code>yarn android:example</code>.
          </p>
          <div className={styles.note()}>
            <strong>A study, not a product.</strong> The screen is built to test the library against a design people
            already know by heart. It uses generated data, and it is not affiliated with or endorsed by Kraken.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'family' && 'hidden')} id="family">
          <p className={styles.kicker()}>App</p>
          <h2>Family</h2>
          <p>
            A token screen in the shape Family's has: a trace edge to edge with no axes, a price above it that follows
            the finger, and a window picker under it. Where the Revolut study is about the chrome around a plot and the
            Kraken one about the plot itself, this one is about time — nothing on the screen is allowed to cut. The data
            arrives as a morph, the reading is lit over a beat rather than at the touch, and both of those exist in the
            library because this screen asked for them.
          </p>
          <figure className={styles.screenshot()}>
            <img
              alt="The Family-style token screen running on the web, on Android and on iOS, side by side"
              className={styles.screenshotLight()}
              loading="lazy"
              src="/apps/family/light.png"
            />
            <img alt="" className={styles.screenshotDark()} loading="lazy" src="/apps/family/dark.png" />
            <figcaption className={styles.galleryMeta()}>
              One trace, three renderers, in the appearance you are reading this page in — the resting wave already
              handed over to the window it morphed into.
            </figcaption>
          </figure>

          <h3 id="family-arrival">The wave that becomes the price</h3>
          <p>
            While the price is loading the plot is not a skeleton but the same chart with other values: a resting curve
            laid in the window's own domain. When the data lands the marks are interpolated to it, so nothing unmounts
            and nothing is swapped — which is also the only way to do it on a device, because a custom{' '}
            <code>skeleton</code> is a web-only prop. <code>isLoading</code> stays <code>false</code> throughout for the
            same reason: the chart's own placeholder is the thing being replaced.
          </p>
          <CodeBlock>{`// The wave is the placeholder, so the chart is never told it is loading.
const values = isLoading ? waveValues(domain) : range.values

const chart = zyplot(z => ({
  animation: z.animation({
    // What 'morph' interpolates over: the wave's values towards the window's.
    duration: 360,
    easing: 'ease-in-out',
    reveal: z.reveal.draw({ duration: 620, easing: 'ease-in-out' }),
    transition: 'morph',
    updates: true,
  }),
  isLoading: false,
  series: [z.series({ id: 'price', label: range.label, values })],
}))

<Chart.Line {...chart} />`}</CodeBlock>
          <div className={styles.note()}>
            <strong>The domain is the trick.</strong> The wave is built inside the price window's own{' '}
            <code>yAxis.domain</code>, not in a range of its own. A placeholder drawn somewhere else has to travel as
            well as change shape, and a curve that slides up the plot on arrival reads as the chart moving rather than
            as the numbers landing.
          </div>

          <h3 id="family-scrub">A step back with a beat</h3>
          <p>
            Everything the finger drags is drawn by whoever draws the line — the crosshair, the time above it, the dot
            at the head of the trail — because a position that crosses into JavaScript and returns as a re-render
            arrives after the finger has gone. What the app keeps is the price in the header, which sits still.
          </p>
          <p>
            The rest of the trace steps back to <code>dimOpacity</code> over <code>dimDuration</code> rather than at the
            touch, so a finger landing reads as the lights coming down. The lighting on the reading is put down with
            that ramp and not with the touch: dropped when the finger lifts, the stretch of trace it was lighting would
            come back up with everything else, and the part that was never dimmed would flash along with the part that
            was.
          </p>
          <CodeBlock>{`interaction: z.interaction.scrub({
  crosshairStyle: {
    color: color.crosshair,
    // One stamp per reading, in data order. The last one says LIVE. The chart
    // places the words; the pill around them is the screen's own view, handed
    // named in tooltip.
    labels: familyStamps(range.stamps),
    width: 1,
  },
  // The step back takes a beat in both directions instead of cutting.
  dimDuration: 420,
  dimOpacity: 0.34,
  highlightColor: color.trace,
  // dot: true puts the reading's own dot at the head of the lit stretch.
  marker: z.marker.trail({ color: color.trace, dot: true, size: 11 }),
})`}</CodeBlock>

          <h3 id="family-source">What it uses</h3>
          <PropsTable
            rows={[
              {
                description:
                  'The price trace: full-bleed with both axes hidden, a pulsing point on the latest reading, and room kept at the end for it on the two windows that close on now.',
                name: 'Chart.Line',
                type: 'feature-charts/family-chart.tsx',
              },
              {
                description:
                  'Interpolates the resting wave into the window that lands, so the arrival is one curve changing shape rather than a placeholder being replaced.',
                name: "animation({transition: 'morph'})",
                type: 'feature-charts/family-chart.tsx',
              },
              {
                description:
                  'How long the marks take to step back for a reading, and to come back up when it ends. The lit stretch of trace is held until that ramp is finished.',
                name: 'interaction.dimDuration',
                type: 'feature-charts/family-chart.tsx',
              },
              {
                description:
                  'Lights the trace up to the reading, with the dot on the reading drawn by the chart rather than fed back through annotations, so it keeps up with the finger.',
                name: 'marker.trail({dot: true})',
                type: 'feature-charts/family-chart.tsx',
              },
              {
                description:
                  'The time above the crosshair as a chip: one stamp per slot, a background and padding around the one being read, placed by whoever draws the line.',
                name: 'crosshairStyle.labels',
                type: 'feature-charts/family-chart.tsx',
              },
              {
                description:
                  'The live dot and its bloom, stepped back while a reading is in progress through scrubOpacity so the finger has the plot to itself.',
                name: 'annotation.point({pulse})',
                type: 'feature-charts/family-chart.tsx',
              },
              {
                description:
                  'Turns the scrub into the price, the delta and the percentage above the plot, and finds the last reading the window actually has for the live dot to sit on.',
                name: 'useChartScrub · useLastReading',
                type: 'apps/example/use-family-readout.ts',
              },
              {
                description:
                  'One screen per platform: SwiftUI through @expo/ui on iOS, Compose on Android, React Native on the web — sharing the data, the theme and the chart.',
                name: 'Platform files',
                type: 'family.ios.tsx · family.android.tsx',
              },
            ]}
          />
          <p>
            Split the way the other two studies are: the chart, its style, the theme and the generated prices are the
            shared{' '}
            <a href={`${REPOSITORY_URL}/tree/main/packages/feature-charts/src/family`}>
              <code>packages/feature-charts</code>
            </a>{' '}
            package, and the screen around it —{' '}
            <a href={`${REPOSITORY_URL}/tree/main/apps/example/src/family`}>in the example app</a> — is one file per
            platform. <code>apps/example</code> runs it on a device with <code>yarn ios:example</code> or{' '}
            <code>yarn android:example</code>.
          </p>
          <div className={styles.note()}>
            <strong>A study, not a product.</strong> The screen is built to test the library against a design people
            already know by heart. It uses generated data, and it is not affiliated with or endorsed by Family.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'health' && 'hidden')} id="health">
          <p className={styles.kicker()}>App</p>
          <h2>Health</h2>
          <p>
            A steps screen in the shape Health's has: a bar per day under a headline that becomes a card when a finger
            lands, a window picker above it, and cards below that are charts in their own right. The three studies
            before this one are traces. This is the bar chart's turn, and a bar chart asks different questions — it has
            no direction to be drawn along, no pairs to morph between when the window changes, and a scale that would
            rather sit inside the plot than beside it.
          </p>
          <figure className={styles.screenshot()}>
            <img
              alt="The Health-style steps screen running on the web, on Android and on iOS, side by side"
              className={styles.screenshotLight()}
              loading="lazy"
              src="/apps/health/light.png"
            />
            <img alt="" className={styles.screenshotDark()} loading="lazy" src="/apps/health/dark.png" />
            <figcaption className={styles.galleryMeta()}>
              One bar chart, three renderers, in the appearance you are reading this page in — two gridlines, the counts
              written inside the plot, and the dates named rather than left to the renderer.
            </figcaption>
          </figure>

          <h3 id="health-overlay">The scale inside the plot</h3>
          <p>
            Two gridlines and nothing else, at round numbers above the tallest bar, with the counts written inside the
            plot against its trailing edge rather than in a gutter beside it. The reader is comparing bars with each
            other, so a third rule only adds ink — and an overlaid label reserves no gutter, which leaves the full width
            to the bars.
          </p>
          <CodeBlock>{`// A round number above the tallest bar: 10 000 over a week of 8 400s.
const stepsScale = (range: StepsRange) => {
  const tallest = Math.max(...range.values, 1)
  const step = Math.pow(10, Math.floor(Math.log10(tallest)))
  const top = Math.ceil(tallest / step) * step

  return { domain: { max: top, min: 0 }, tickValues: [top / 2, top] }
}

yAxis: z.axis.overlay({
  ...stepsScale(range),
  format: { decimals: 0, locale: 'en-US' },
  grid: true,
  // How far inside the trailing edge the counts sit.
  labelInset: 4,
  labelSize: 13,
  ticks: false,
})`}</CodeBlock>
          <p>
            The dates underneath are named for a different reason. Each renderer keeps a gap of its own under the label
            row — Swift Charts is the tightest of the three — so the row sat at a different distance on every platform
            until <code>labelInset</code> put all three on one number. The air at the ends of the plot is named too: the
            overlaid counts give the trailing edge room of its own, so an equal inset on the leading edge reads as less
            than one.
          </p>
          <CodeBlock>{`xAxis: {
  grid: false,
  labelInset: 6,
  // Room for the overlaid counts, and more before the first bar than after the last.
  plotDimensionEndPadding: 6,
  plotDimensionStartPadding: 16,
  ticks: false,
  // Which days are named — a month names four of thirty.
  tickValues: range.ticks,
}`}</CodeBlock>
          <div className={styles.note()}>
            <strong>Bars grow, they do not trace.</strong> The arrival is a <code>reveal.fade</code> with no{' '}
            <code>transition</code>, so a window switch simply draws the new bars: thirty of them and seven have no
            pairs to morph between, and holding the outgoing set on screen to dissolve it reads as two charts at once
            rather than as one changing. No <code>delay</code> either — a window switch is a tap being answered, and the
            wait that suits a screen being pushed reads as a stall here.
          </div>

          <h3 id="health-span">Two fingers, one total</h3>
          <p>
            A day is worth reading on its own, and a week is a number the bars cannot be added up by eye. So the reading
            is both: one finger names a bar, two name everything between them, and the card over the plot totals
            whichever arrived. That is <code>interaction.range</code>, and it is a native gesture — a pointer has no
            second finger — so the web keeps the chart's own tooltip instead.
          </p>
          <CodeBlock>{`interaction: z.interaction({
  crosshair: 'x',
  // One style dresses the single rule and the pair at a span's ends alike.
  crosshairStyle: { color: color.rule, width: isAndroid ? 1.2 : 1 },
  haptics: true,
  range: true,
}),
// On the web Chart.Bar reports no scrub for a card of ours to follow, so the card stays the chart's.
tooltip: isWeb ? true : reading,`}</CodeBlock>
          <p>
            Only ever one of the two is set, so the screen never has to work out which reading is newer. Where the card
            goes is not the screen's answer at all: the chart takes a view for one bar and a view for a span, and puts
            each over what is held — centred on the middle of a span rather than on one edge of it, and kept inside the
            plot at either end.
          </p>
          <CodeBlock>{`const { onInteraction, range: span, selection } = useChartScrub()

// One bar is a span of one, so the readout below has a single shape to total.
const held = span ?? (selection ? { endIndex: selection.index, startIndex: selection.index } : null)

// The card for one bar and the card for a span, both mounted and moved by the chart. Each reads what
// it shows from the screen's own context, so a finger moving changes no prop on the chart.
<StepsChart onInteraction={onInteraction} rangeView={SpanCard} tooltip={reading} />`}</CodeBlock>

          <h3 id="health-source">What it uses</h3>
          <PropsTable
            rows={[
              {
                description:
                  'The bars: two gridlines at round numbers, the counts overlaid inside the plot, the dates named rather than left to the renderer, and a fade on arrival instead of a trace.',
                name: 'Chart.Bar',
                type: 'feature-charts/steps-chart.tsx',
              },
              {
                description:
                  'Puts the counts inside the plot against its trailing edge and reserves no gutter, so the bars keep the full width. Works on the web as well as on native.',
                name: 'axis.overlay',
                type: 'feature-charts/steps-chart.tsx',
              },
              {
                description:
                  'Two fingers report the marks under each of them and everything between, which is what the card totals. iOS and Android only.',
                name: 'interaction.range',
                type: 'feature-charts/steps-chart.tsx',
              },
              {
                description:
                  'The air before the first bar and after the last, named rather than left to each renderer, so the same gutter is kept on all three.',
                name: 'plotDimensionStartPadding',
                type: 'feature-charts/steps-chart.tsx',
              },
              {
                description:
                  'The highlight card underneath: the day so far against a usual day, smoothed, with no axes of its own, a floor below zero for air under the flat start, and clip off so the end dots sit astride the last reading.',
                name: 'Chart.Line',
                type: 'feature-charts/steps-cumulative-chart.tsx',
              },
              {
                description:
                  'Turns one finger or two into the headline card, and reports the plot box the card is kept inside.',
                name: 'useChartScrub',
                type: 'apps/example/use-steps-view.ts',
              },
            ]}
          />
          <p>
            Split the way the other studies are: the charts, their style, the theme and the generated counts are the
            shared{' '}
            <a href={`${REPOSITORY_URL}/tree/main/packages/feature-charts/src/health`}>
              <code>packages/feature-charts</code>
            </a>{' '}
            package, and the screen around them is{' '}
            <a href={`${REPOSITORY_URL}/tree/main/apps/example/src/health`}>in the example app</a>. This is the one
            study that is not one file per platform — its chrome is a segmented picker and a column of cards, which
            plain React Native draws the same on all three.
          </p>
          <div className={styles.note()}>
            <strong>A study, not a product.</strong> The screen is built to test the library against a design people
            already know by heart. It uses generated data, and it is not affiliated with or endorsed by Apple.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'stocks' && 'hidden')} id="stocks">
          <p className={styles.kicker()}>App</p>
          <h2>Stocks</h2>
          <p>
            A quote sheet in the shape Stocks' has: a ticker tape above it, a price ladder down the trailing edge, and a
            plot with a grid behind it, a row of dates under it and a volume tape under those. Where the other studies
            put chrome around a plot, this one puts chrome <em>on</em> one — and every piece of it has to line up with
            the marks to the pixel while none of it is drawn by the chart.
          </p>
          <figure className={styles.screenshot()}>
            <img
              alt="The Stocks-style quote sheet running on the web, on Android and on iOS, side by side"
              className={styles.screenshotLight()}
              loading="lazy"
              src="/apps/stocks/light.png"
            />
            <img alt="" className={styles.screenshotDark()} loading="lazy" src="/apps/stocks/dark.png" />
            <figcaption className={styles.galleryMeta()}>
              One trace, three renderers, in the appearance you are reading this page in — the grid, the dates and the
              volume tape all placed off marks the chart measured and nobody drew.
            </figcaption>
          </figure>

          <h3 id="stocks-grid">Measuring the plot box</h3>
          <p>
            Everything laid against the plot needs to know where the plot is, and the reported rect is not the same
            number on every renderer: the web bakes the axis padding into it, the native ones keep it inside the frame.
            The price ladder makes it worse — it takes a gutter off the trailing edge whose width depends on how many
            digits a price has.
          </p>
          <p>
            So the chart carries a handful of marks nobody draws. A <code>hidden</code> annotation is still measured and
            still reported in <code>geometry</code>, and an annotation lands where its <em>data</em> lands on all three
            renderers — which makes a mark at a known coordinate the one exact answer to where that coordinate is on
            screen.
          </p>
          <CodeBlock>{`// One at each dated tick along the floor, one at each price rule on the leading edge,
// and one in the far corner that closes the box. annotation.measure is the point
// builder with hidden and size: 0 already set.
annotations: [
  ...range.axisTicks.map((tick, index) =>
    z.annotation.measure({ id: 'col-' + index, x: categories[tick.index], y: domain.min })
  ),
  ...priceTicks(domain).map((value, index) =>
    z.annotation.measure({ id: 'row-' + index, x: categories[0], y: value })
  ),
  z.annotation.measure({ id: 'col-end', x: categories[categories.length - 1], y: domain.min }),
]`}</CodeBlock>
          <CodeBlock>{`// Read back off the layout the chart reports, and the grid is exact on all three.
export const plotGrid = (geometry: ChartGeometry | null) => {
  const at = (id: string) => geometry?.annotations.find(item => item.id === id)
  const columns = [0, 1, 2, 3].map(index => at('col-' + index)?.x)
  const rows = [0, 1, 2, 3].map(index => at('row-' + index)?.y)
  const corner = at('col-end')
  if (!corner || columns.some(value => value === undefined) || rows.some(value => value === undefined)) {
    return null
  }
  return { columns: [...columns, corner.x], rows: [...rows, corner.y] }
}`}</CodeBlock>
          <div className={styles.note()}>
            <strong>Those numbers are in the chart's space, not the screen's.</strong> The view the rules are placed in
            has to be the chart's own box — put the screen's gutters on its parent instead, or every offset is a gutter
            out. It is the same calibration the{' '}
            <Link href="/docs/hooks/use-chart-scrub#scrub-overlay">scrub overlay</Link> needs, for the same reason.
          </div>
          <p>
            The rules themselves are views rather than annotations, twice over: an annotation is drawn <em>over</em> the
            marks, and a grid over a trace reads as a cage around it — and the columns carry on past the plot's floor to
            divide the dates underneath, which is not a thing a chart can be asked for. The volume tape below is views
            for a third reason: it has to line up with the plot to the pixel, and two charts never do, since each
            renderer insets its own plot by a different amount.
          </p>
          <p>
            What the chart is asked for is the box itself. Both axes name their plot-dimension paddings as{' '}
            <code>0</code>, which replaces each renderer's own reserve with the same number and runs the trace corner to
            corner the way a quote chart's does; the price ladder is an <code>axis.end</code> that draws no rules,
            because the rules are the screen's; and <code>plot.clip</code> is off, so the trace reaches the floor and
            the dot under a finger can hang past it.
          </p>

          <h3 id="stocks-span">A span the chart paints</h3>
          <p>
            One finger takes the trace whole: it turns the reading colour, and nothing steps back — a dimmed line under
            a crosshair reads as disabled when there is only one line to dim. Two fingers are a different reading, and
            that one the chart paints itself: the stretch between them in its own direction, green if it closed up and
            red if it closed down, with the rest of the period behind it.
          </p>
          <CodeBlock>{`interaction: z.interaction.scrub({
  crosshairStyle: { color: color.scrub, width: 1 },
  // One trace takes the reading colour whole, so there is nothing for a dim to mean.
  dimOpacity: 1,
  marker: z.marker.point({ color: color.scrub, size: 15 }),
  range: true,
  // The held stretch: its own direction, its own dim for everything outside it, a dot at each end.
  rangeStyle: { color: color.up, dimOpacity: 0.32, dot: true, downColor: color.down },
})`}</CodeBlock>
          <p>
            Nothing about a held span reaches the props, so a span moving costs no chart at all — the ends are drawn
            from the fingers by whoever is drawing the line. What crosses into JavaScript is only what the row above the
            plot writes: the two dates, the delta and the percentage, which sit still.
          </p>
          <div className={styles.note()}>
            <strong>The dot under one finger is web-only here.</strong> The web's scrub overlay draws the crosshair and
            skips a <code>'point'</code> marker, so the reading would have a line and no mark. It gets an{' '}
            <code>annotation.point</code> with a <code>halo</code> instead, on the web alone — on iOS and Android{' '}
            <code>marker.point</code> is already drawing it.
          </div>
          <p>
            Nothing else moves. The animation is off in all three of its parts: the sheet opens on a price that is
            already true, and a tap on another range is a request to see that range, not to watch a month become a year.
          </p>
          <CodeBlock>{`animation: z.animation({ enabled: false, initial: false, updates: false })`}</CodeBlock>

          <h3 id="stocks-source">What it uses</h3>
          <PropsTable
            rows={[
              {
                description:
                  'The price trace: a fill that gathers under the line and lets go of the floor, no time axis at all, both plot-dimension paddings named 0, and the marks allowed out of the plot.',
                name: 'Chart.Line',
                type: 'feature-charts/stocks-chart.tsx',
              },
              {
                description:
                  'Marks nobody draws, measured and reported in geometry. The grid, the row of dates and the volume tape are all placed off where they landed.',
                name: 'annotation.measure',
                type: 'feature-charts/stocks-chart.tsx',
              },
              {
                description:
                  'The price ladder in a gutter on the trailing edge, four rules down from the high and evenly across the data — a ladder is read as distance from the extremes, not as a decimal scale. It draws no grid of its own.',
                name: 'axis.end',
                type: 'feature-charts/stocks-chart-style.ts',
              },
              {
                description:
                  'The held stretch in its own direction with the rest of the period stepped back behind it, drawn from the fingers so a span moving costs no re-render. Separate from dimOpacity, and it reaches the area fill too.',
                name: 'interaction.rangeStyle',
                type: 'feature-charts/stocks-chart.tsx',
              },
              {
                description:
                  'The dot under one finger: the marker on iOS and Android, and a haloed annotation on the web, whose scrub overlay draws the crosshair but skips a point marker.',
                name: 'marker.point · halo',
                type: 'feature-charts/stocks-chart.tsx',
              },
              {
                description:
                  'One line per row of the tape with the opening level dashed across it. A line rather than Chart.Sparkline, whose axes cannot be turned off — its web props carry none at all and iOS defaults both to drawn.',
                name: 'Chart.Line',
                type: 'feature-charts/stocks-ticker-spark.tsx',
              },
              {
                description:
                  "One finger's price and date, two fingers' delta and percentage, and the plot geometry everything on the plot is placed from.",
                name: 'useChartScrub',
                type: 'apps/example/use-stocks-readout.ts',
              },
              {
                description:
                  'One screen per platform: SwiftUI through @expo/ui on iOS, Compose on Android, React Native on the web — sharing the data, the theme and the chart.',
                name: 'Platform files',
                type: 'stocks.ios.tsx · stocks.android.tsx',
              },
            ]}
          />
          <p>
            Split the way the other studies are: the chart, its style, the theme and the generated prices are the shared{' '}
            <a href={`${REPOSITORY_URL}/tree/main/packages/feature-charts/src/stocks`}>
              <code>packages/feature-charts</code>
            </a>{' '}
            package, and the screen around it —{' '}
            <a href={`${REPOSITORY_URL}/tree/main/apps/example/src/stocks`}>in the example app</a> — is one file per
            platform. <code>apps/example</code> runs it on a device with <code>yarn ios:example</code> or{' '}
            <code>yarn android:example</code>.
          </p>
          <div className={styles.note()}>
            <strong>A study, not a product.</strong> The screen is built to test the library against a design people
            already know by heart. It uses generated data, and it is not affiliated with or endorsed by Apple.
          </div>
        </section>

        <section className={cn(styles.section(), page !== 'releases' && 'hidden')} id="releases">
          <p className={styles.kicker()}>More</p>
          <h2>Releases</h2>
          <p>
            Every published version, its notes and the diff behind it are on GitHub:{' '}
            <a href={`${REPOSITORY_URL}/releases`}>github.com/hzblj/zyplot/releases</a>.
          </p>
          <p>
            Versions are cut with changesets and published from CI with npm provenance, so the git tag, the GitHub
            release and the version on npm are always the same number. What changed in each one is also{' '}
            <Link href="/docs/changelog">on this site</Link>.
          </p>
        </section>

        <section className={cn(styles.section(), page !== 'changelog' && 'hidden')} id="changelog">
          <p className={styles.kicker()}>More</p>
          <h2>Changelog</h2>
          <p>
            New updates and improvements to Zyplot. The notes are read straight out of the package's own{' '}
            <code>CHANGELOG.md</code> at build time, so this page, npm and the GitHub release cannot disagree about what
            shipped.
          </p>
          <ChangelogList />
        </section>

        {currentChart && <ChartSection chart={currentChart} preferences={preferences} />}

        <nav aria-label="Documentation pagination" className={styles.pager()}>
          {previousPage ? (
            <Link className={styles.pagerLink()} href={docsHrefForPage(previousPage, chartIds)}>
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          {nextPage && (
            <Link className={styles.pagerLink()} href={docsHrefForPage(nextPage, chartIds)}>
              Continue →
            </Link>
          )}
        </nav>
      </main>

      <DocsToc headings={pageHeadings} />
    </>
  )
}
