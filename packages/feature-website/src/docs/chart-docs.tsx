'use client'

import {Chart} from '@hzblj/zyplot'
import {docsStyles} from '../docs-styles'
import {chartExample} from './chart-code'
import {groupCharts} from './chart-groups'
import type {ChartDoc, PropRow} from './types'

const styles = docsStyles()
const everywhere = ['web', 'ios', 'android'] as const

const height: PropRow = {
  defaultValue: '240 web / 320 native',
  description: 'Chart height in pixels or native points.',
  name: 'height',
  type: 'number',
}

const loading: PropRow = {
  defaultValue: 'false',
  description: 'Shows the built-in placeholder while data loads.',
  name: 'isLoading',
  type: 'boolean',
}

const theme: PropRow = {
  description: 'Colors and typography for this chart.',
  name: 'theme',
  type: 'ChartTheme',
}

const format: PropRow = {
  description: 'Number prefix, suffix, decimals, and locale.',
  name: 'format',
  type: 'ChartNumberFormat',
}

const categories: PropRow = {
  description: 'Labels on the category axis.',
  name: 'categories',
  required: true,
  type: 'string[]',
}

const series: PropRow = {
  description: 'Named series aligned with the categories.',
  name: 'series',
  required: true,
  type: 'ChartSeries[]',
}

const axes: PropRow[] = [
  {
    defaultValue: '{ x: true, y: true }',
    description: 'Show or hide each axis.',
    name: 'axis',
    type: 'ChartAxes',
  },
  {
    description: 'Horizontal scale, domain, ticks, grid, and labels.',
    name: 'xAxis',
    type: 'NativeChartAxisOptions',
  },
  {
    description: 'Vertical scale, domain, ticks, grid, and labels.',
    name: 'yAxis',
    type: 'NativeChartAxisOptions',
  },
]

const shared = (...rows: PropRow[]) => [...rows, height, loading, theme]
const cartesian = (...rows: PropRow[]) => shared(...rows, ...axes)

const categorySetup = `const categories = ['Jan', 'Feb', 'Mar', 'Apr']

const series = [
  { id: 'revenue', label: 'Revenue', values: [42, 56, 51, 72] },
  { id: 'costs', label: 'Costs', values: [28, 34, 38, 41] },
]`

const previewCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const previewSeries = [
  {id: 'revenue', label: 'Revenue', values: [42, 56, 51, 72, 84, 91]},
  {id: 'costs', label: 'Costs', values: [28, 34, 38, 41, 48, 53]},
]

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

const hierarchySetup = `const data = [
  {
    id: 'product',
    label: 'Product',
    children: [
      { id: 'web', label: 'Web', value: 48 },
      { id: 'ios', label: 'iOS', value: 31 },
      { id: 'android', label: 'Android', value: 21 },
    ],
  },
  {
    id: 'growth',
    label: 'Growth',
    children: [
      { id: 'search', label: 'Search', value: 28 },
      { id: 'social', label: 'Social', value: 18 },
    ],
  },
]`

const candles = [
  {category: 'Mon', close: 132, high: 136, id: 'mon', low: 124, open: 126, volume: 18_400},
  {category: 'Tue', close: 128, high: 138, id: 'tue', low: 127, open: 133, volume: 22_100},
  {category: 'Wed', close: 141, high: 144, id: 'wed', low: 128, open: 129, volume: 31_700},
  {category: 'Thu', close: 139, high: 147, id: 'thu', low: 137, open: 142, volume: 25_300},
  {category: 'Fri', close: 152, high: 154, id: 'fri', low: 138, open: 140, volume: 40_900},
]

const timePoints = {
  timestamps: Array.from({length: 36}, (_, index) => 1_735_689_600 + index * 86_400),
  values: [
    Array.from({length: 36}, (_, index) => 42 + index * 1.4 + Math.sin(index / 2) * 8),
    Array.from({length: 36}, (_, index) => 31 + index * 0.8 + Math.cos(index / 3) * 6),
  ],
}

export const chartDocs: ChartDoc[] = [
  {
    code: chartExample(
      'Line',
      `  categories,
  series,
  format: z.format({ prefix: '$' }),`,
      categorySetup
    ),
    description: 'Show a trend across ordered categories.',
    id: 'line',
    name: 'Line',
    platforms: everywhere,
    preview: <Chart.Line categories={previewCategories} format={{prefix: '$'}} height={300} series={previewSeries} />,
    props: cartesian(
      categories,
      series,
      format,
      {description: 'Draw a curved line.', name: 'isSmooth', type: 'boolean'},
      {description: 'Keep one series in color and mute the rest.', name: 'emphasisId', type: 'string'}
    ),
    when: 'Use it for trends. Keep the line straight when values between points are unknown.',
  },
  {
    code: chartExample(
      'Area',
      `  categories,
  series,
  isStacked: true,`,
      categorySetup
    ),
    description: 'Show a trend and the magnitude below it.',
    id: 'area',
    name: 'Area',
    platforms: everywhere,
    preview: <Chart.Area categories={previewCategories} height={300} isStacked series={previewSeries} />,
    props: cartesian(
      categories,
      series,
      format,
      {description: 'Stack series on top of each other.', name: 'isStacked', type: 'boolean'},
      {description: 'Draw a curved line.', name: 'isSmooth', type: 'boolean'}
    ),
    when: 'Use it when both direction and volume matter.',
  },
  {
    code: chartExample(
      'Bar',
      `  categories,
  series,
  orientation: 'vertical',`,
      categorySetup
    ),
    description: 'Compare values across categories.',
    id: 'bar',
    name: 'Bar',
    platforms: everywhere,
    preview: <Chart.Bar categories={previewCategories} height={300} series={previewSeries} />,
    props: cartesian(categories, series, format, {
      defaultValue: '"vertical"',
      description: 'Direction in which the bars grow.',
      name: 'orientation',
      type: '"horizontal" | "vertical"',
    }),
    when: 'Use horizontal bars when category labels are long.',
  },
  {
    code: chartExample(
      'StackedBar',
      `  categories,
  series,`,
      categorySetup
    ),
    description: 'Compare totals and their composition.',
    id: 'stacked-bar',
    name: 'Stacked bar',
    platforms: everywhere,
    preview: <Chart.StackedBar categories={previewCategories} height={300} isNormalized series={previewSeries} />,
    props: cartesian(
      categories,
      series,
      format,
      {
        description: 'Normalize every stack to 100%. Web only.',
        name: 'isNormalized',
        type: 'boolean',
      },
      {
        defaultValue: '"vertical"',
        description: 'Direction in which the bars grow.',
        name: 'orientation',
        type: '"horizontal" | "vertical"',
      }
    ),
    when: 'Use it when the parts inside each total matter.',
  },
  {
    code: chartExample(
      'Pie',
      `  data,`,
      `const data = [
  { id: 'direct', label: 'Direct', value: 46 },
  { id: 'search', label: 'Search', value: 31 },
  { id: 'social', label: 'Social', value: 23 },
]`
    ),
    description: 'Show a small part-to-whole split.',
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
    props: shared(
      {description: 'Slices in display order.', name: 'data', required: true, type: 'ChartDatum[]'},
      format,
      {description: 'Fill the center. Web only.', name: 'isSolid', type: 'boolean'},
      {description: 'Maximum visible slices before folding the tail. Web only.', name: 'maxSlices', type: 'number'},
      {description: 'Inner radius for a donut. Native only.', name: 'innerRadius', type: 'number'}
    ),
    when: 'Use two to five slices. Use bars when exact comparison matters.',
  },
  {
    code: chartExample(
      'Gauge',
      `  value: 72,
  max: 100,
  format: z.format({ suffix: '%' }),`
    ),
    description: 'Show one value inside a fixed range.',
    id: 'gauge',
    name: 'Gauge',
    platforms: everywhere,
    preview: <Chart.Gauge format={{suffix: '%'}} height={240} max={100} value={72} />,
    props: shared(
      {description: 'Current value.', name: 'value', required: true, type: 'number'},
      {description: 'Upper bound.', name: 'max', required: true, type: 'number'},
      {defaultValue: '0', description: 'Lower bound.', name: 'min', type: 'number'},
      format
    ),
    when: 'Use it only when the maximum has a clear meaning.',
  },
  {
    code: chartExample(
      'Meter',
      `  label: 'Storage used',
  value: 72,
  max: 100,`
    ),
    description: 'Show one bounded value in a compact row.',
    id: 'meter',
    name: 'Meter',
    platforms: everywhere,
    preview: <Chart.Meter label="Storage used" max={100} value={72} />,
    props: shared(
      {description: 'Accessible label.', name: 'label', required: true, type: 'string'},
      {description: 'Current value.', name: 'value', required: true, type: 'number'},
      {description: 'Upper bound.', name: 'max', required: true, type: 'number'},
      format,
      {
        defaultValue: 'true',
        description: 'Show the value next to the label. Web only.',
        name: 'showValue',
        type: 'boolean',
      }
    ),
    when: 'Use it instead of a gauge when space is tight.',
  },
  {
    code: chartExample(
      'Histogram',
      `  values,
  binCount: 8,`,
      `const values = [12, 18, 21, 21, 24, 27, 29, 31, 31, 32, 34, 35, 39, 42, 47, 57]`
    ),
    description: 'Group raw values into bins.',
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
    props: cartesian(
      {description: 'Raw observations.', name: 'values', required: true, type: 'number[]'},
      {defaultValue: '10 web / 12 native', description: 'Number of bins.', name: 'binCount', type: 'number'},
      {description: 'Format for bin labels.', name: 'valueFormat', type: 'ChartNumberFormat'}
    ),
    when: 'Use it to inspect the shape and spread of a distribution.',
  },
  {
    code: chartExample(
      'Boxplot',
      `  groups,
  labels: { min: 'Min', q1: 'Q1', median: 'Median', q3: 'Q3', max: 'Max' },`,
      `const groups = [
  { id: 'starter', label: 'Starter', min: 12, q1: 34, median: 54, q3: 72, max: 91 },
  { id: 'pro', label: 'Pro', min: 24, q1: 45, median: 61, q3: 74, max: 84 },
]`
    ),
    description: 'Compare distribution summaries.',
    id: 'boxplot',
    name: 'Boxplot',
    platforms: everywhere,
    preview: (
      <Chart.Boxplot
        groups={[
          {id: 'starter', label: 'Starter', max: 91, median: 54, min: 12, outliers: [98], q1: 34, q3: 72},
          {id: 'pro', label: 'Pro', max: 84, median: 61, min: 24, q1: 45, q3: 74},
        ]}
        height={300}
        labels={{max: 'Max', median: 'Median', min: 'Min', q1: 'Q1', q3: 'Q3'}}
      />
    ),
    props: cartesian(
      {
        description: 'Five-number summaries and optional outliers.',
        name: 'groups',
        required: true,
        type: 'ChartBoxplotGroup[]',
      },
      {description: 'Labels for the five summary values.', name: 'labels', required: true, type: 'BoxplotLabels'},
      format,
      {description: 'Direction of the value axis.', name: 'orientation', type: '"horizontal" | "vertical"'}
    ),
    when: 'Use it to compare distributions without plotting every observation.',
  },
  {
    code: chartExample(
      'Candlestick',
      `  data: candles,
  showVolume: true,
  format: z.format({ prefix: '$' }),`,
      `const candles = [
  { id: 'mon', category: 'Mon', open: 126, high: 136, low: 124, close: 132, volume: 18400 },
  { id: 'tue', category: 'Tue', open: 133, high: 138, low: 127, close: 128, volume: 22100 },
  { id: 'wed', category: 'Wed', open: 129, high: 144, low: 128, close: 141, volume: 31700 },
]`
    ),
    description: 'Plot open, high, low, and close values.',
    id: 'candlestick',
    name: 'Candlestick',
    platforms: everywhere,
    preview: <Chart.Candlestick data={candles} format={{prefix: '$'}} height={320} showVolume />,
    props: cartesian(
      {
        description: 'OHLC values in chronological order.',
        name: 'data',
        required: true,
        type: 'ChartCandlestickDatum[]',
      },
      format,
      {description: 'Add a volume plot below the candles.', name: 'showVolume', type: 'boolean'},
      {description: 'Candle colors, widths, and rendering.', name: 'style', type: 'ChartCandlestickStyle'}
    ),
    when: 'Use it for market OHLC data, not for a single value over time.',
  },
  {
    code: chartExample(
      'DivergingBar',
      `  data,
  format: z.format({ suffix: '%' }),`,
      `const data = [
  { id: 'north', label: 'North', value: 18 },
  { id: 'south', label: 'South', value: -12 },
  { id: 'east', label: 'East', value: 9 },
  { id: 'west', label: 'West', value: -7 },
]`
    ),
    description: 'Compare positive and negative values around zero.',
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
    props: cartesian({description: 'Signed values.', name: 'data', required: true, type: 'ChartDatum[]'}, format, {
      description: 'Direction of the bars. Web only.',
      name: 'orientation',
      type: '"horizontal" | "vertical"',
    }),
    when: 'Use it for gains and losses, variance, or change from a baseline.',
  },
  {
    code: {
      android: chartExample(
        'Dumbbell',
        `  rows,`,
        `const rows = [
  { id: 'activation', label: 'Activation', before: 54, after: 72 },
  { id: 'retention', label: 'Retention', before: 68, after: 61 },
]`
      ),
      ios: chartExample(
        'Dumbbell',
        `  rows,`,
        `const rows = [
  { id: 'activation', label: 'Activation', before: 54, after: 72 },
  { id: 'retention', label: 'Retention', before: 68, after: 61 },
]`
      ),
      web: chartExample(
        'Dumbbell',
        `  rows,
  beforeLabel: '2025',
  afterLabel: '2026',`,
        `const rows = [
  { id: 'activation', label: 'Activation', before: 54, after: 72 },
  { id: 'retention', label: 'Retention', before: 68, after: 61 },
]`
      ),
    },
    description: 'Compare a before and after value for each item.',
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
    props: cartesian(
      {description: 'Before and after values.', name: 'rows', required: true, type: 'ChartDumbbellRow[]'},
      {description: 'Label for the first value. Web only.', name: 'beforeLabel', type: 'string'},
      {description: 'Label for the second value. Web only.', name: 'afterLabel', type: 'string'},
      format
    ),
    when: 'Use it when the change between two known states is the main point.',
  },
  {
    code: {
      android: chartExample(
        'Funnel',
        `  data,`,
        `const data = [
  { id: 'visit', label: 'Visited', value: 1200 },
  { id: 'trial', label: 'Started trial', value: 740 },
  { id: 'paid', label: 'Paid', value: 210 },
]`
      ),
      ios: chartExample(
        'Funnel',
        `  data,`,
        `const data = [
  { id: 'visit', label: 'Visited', value: 1200 },
  { id: 'trial', label: 'Started trial', value: 740 },
  { id: 'paid', label: 'Paid', value: 210 },
]`
      ),
      web: chartExample(
        'Funnel',
        `  stages: data,`,
        `const data = [
  { id: 'visit', label: 'Visited', value: 1200 },
  { id: 'trial', label: 'Started trial', value: 740 },
  { id: 'paid', label: 'Paid', value: 210 },
]`
      ),
    },
    description: 'Show drop-off through ordered stages.',
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
    props: shared(
      {description: 'Ordered stages on web.', name: 'stages', required: true, type: 'ChartDatum[]'},
      {description: 'Ordered stages on iOS and Android.', name: 'data', required: true, type: 'ChartDatum[]'},
      format
    ),
    when: 'Use it only when every stage is a subset of the previous one.',
  },
  {
    code: chartExample(
      'Heatmap',
      `  columns,
  rows,
  cells,`,
      `const columns = ['Mon', 'Tue', 'Wed']
const rows = ['Morning', 'Evening']
const cells = [
  { columnIndex: 0, rowIndex: 0, value: 24 },
  { columnIndex: 1, rowIndex: 0, value: 61 },
  { columnIndex: 2, rowIndex: 0, value: 42 },
  { columnIndex: 0, rowIndex: 1, value: 78 },
  { columnIndex: 1, rowIndex: 1, value: 54 },
  { columnIndex: 2, rowIndex: 1, value: 89 },
]`
    ),
    description: 'Map values across a two-dimensional grid.',
    id: 'heatmap',
    name: 'Heatmap',
    platforms: everywhere,
    preview: (
      <Chart.Heatmap
        cells={Array.from({length: 24}, (_, index) => ({
          columnIndex: index % 6,
          rowIndex: Math.floor(index / 6),
          value: 18 + ((index * 17) % 76),
        }))}
        columns={previewCategories}
        height={300}
        rows={['Morning', 'Noon', 'Evening', 'Night']}
      />
    ),
    props: cartesian(
      {
        description: 'Cells addressed by row and column index.',
        name: 'cells',
        required: true,
        type: 'ChartHeatmapCell[]',
      },
      {description: 'Column labels.', name: 'columns', required: true, type: 'string[]'},
      {description: 'Row labels.', name: 'rows', required: true, type: 'string[]'},
      format
    ),
    when: 'Use it to find clusters and patterns in a matrix.',
  },
  {
    code: chartExample(
      'Radar',
      `  axes,
  series,`,
      `const axes = [
  { label: 'Speed', max: 100 },
  { label: 'Quality', max: 100 },
  { label: 'Value', max: 100 },
]

const series = [
  { id: 'starter', label: 'Starter', values: [72, 61, 88] },
  { id: 'pro', label: 'Pro', values: [91, 84, 74] },
]`
    ),
    description: 'Compare profiles across bounded dimensions.',
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
    props: shared(
      {description: 'Labels and maximums for each dimension.', name: 'axes', required: true, type: 'ChartRadarAxis[]'},
      series,
      format
    ),
    when: 'Use it for overall profile shape, not exact value lookup.',
  },
  {
    code: chartExample(
      'Scatter',
      `  series,
  xLabel: 'Spend',
  yLabel: 'Revenue',`,
      `const series = [
  {
    id: 'accounts',
    label: 'Accounts',
    points: [
      { label: 'A', x: 12, y: 42 },
      { label: 'B', x: 24, y: 61 },
      { label: 'C', x: 38, y: 68 },
    ],
  },
]`
    ),
    description: 'Plot the relationship between two measures.',
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
    props: cartesian(
      {description: 'Named groups of points.', name: 'series', required: true, type: 'ChartScatterSeries[]'},
      {description: 'Horizontal axis label.', name: 'xLabel', type: 'string'},
      {description: 'Horizontal number format.', name: 'xFormat', type: 'ChartNumberFormat'},
      {description: 'Vertical axis label.', name: 'yLabel', type: 'string'},
      {description: 'Vertical number format.', name: 'yFormat', type: 'ChartNumberFormat'}
    ),
    when: 'Use it for correlation, clusters, and outliers.',
  },
  {
    code: chartExample(
      'Sankey',
      `  nodes,
  links,`,
      `const nodes = [
  { id: 'visits', label: 'Visits' },
  { id: 'trial', label: 'Trial' },
  { id: 'paid', label: 'Paid' },
  { id: 'exit', label: 'Exit' },
]

const links = [
  { source: 'visits', target: 'trial', value: 72 },
  { source: 'visits', target: 'exit', value: 28 },
  { source: 'trial', target: 'paid', value: 44 },
]`
    ),
    description: 'Show weighted flow between named nodes.',
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
    props: shared(
      {description: 'Nodes referenced by links.', name: 'nodes', required: true, type: 'ChartFlowNode[]'},
      {description: 'Weighted source-to-target links.', name: 'links', required: true, type: 'ChartFlowLink[]'},
      format
    ),
    when: 'Use it when the amount moving between states is the story.',
  },
  {
    code: {
      android: chartExample('Sunburst', `  data,`, hierarchySetup),
      ios: chartExample('Sunburst', `  data,`, hierarchySetup),
      web: chartExample('Sunburst', `  nodes: data,`, hierarchySetup),
    },
    description: 'Show hierarchical values in concentric rings.',
    id: 'sunburst',
    name: 'Sunburst',
    platforms: everywhere,
    preview: <Chart.Sunburst height={320} nodes={hierarchy} />,
    props: shared(
      {description: 'Hierarchy on web.', name: 'nodes', required: true, type: 'ChartHierarchyNode[]'},
      {description: 'Hierarchy on iOS and Android.', name: 'data', required: true, type: 'ChartHierarchyNode[]'},
      format
    ),
    when: 'Use it when hierarchy depth and part-to-whole structure both matter.',
  },
  {
    code: {
      android: chartExample('Treemap', `  data,`, hierarchySetup),
      ios: chartExample('Treemap', `  data,`, hierarchySetup),
      web: chartExample('Treemap', `  nodes: data,`, hierarchySetup),
    },
    description: 'Pack hierarchical values into a rectangle.',
    id: 'treemap',
    name: 'Treemap',
    platforms: everywhere,
    preview: <Chart.Treemap height={320} nodes={hierarchy} />,
    props: shared(
      {description: 'Hierarchy on web.', name: 'nodes', required: true, type: 'ChartHierarchyNode[]'},
      {description: 'Hierarchy on iOS and Android.', name: 'data', required: true, type: 'ChartHierarchyNode[]'},
      format
    ),
    when: 'Use it when compact use of space matters more than hierarchy depth.',
  },
  {
    code: chartExample(
      'TimeSeries',
      `  points,
  series,`,
      `const points = {
  timestamps: [1735689600, 1735776000, 1735862400, 1735948800],
  values: [
    [42, 51, 48, 64],
    [3, 5, 4, 7],
  ],
}

const series = [
  { id: 'requests', label: 'Requests' },
  { id: 'errors', label: 'Errors' },
]`
    ),
    description: 'Render dense time data from parallel arrays.',
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
    props: cartesian(
      {
        description: 'Unix timestamps and matching value arrays.',
        name: 'points',
        required: true,
        type: 'ChartTimePoints',
      },
      {
        description: 'Identity and label for each values array.',
        name: 'series',
        required: true,
        type: 'Omit<ChartSeries, "values">[]',
      },
      format
    ),
    when: 'Use it for dense telemetry. Use Line for a small number of points.',
  },
  {
    code: chartExample(
      'Sparkline',
      `  values: [12, 18, 14, 24, 31, 29],
  height: 48,`
    ),
    description: 'Show a tiny trend without axes or a legend.',
    id: 'sparkline',
    name: 'Sparkline',
    platforms: everywhere,
    preview: (
      <div className={styles.compactPreview()}>
        <Chart.Sparkline height={72} slot={1} values={[12, 18, 14, 24, 31, 29, 38]} />
      </div>
    ),
    props: shared(
      {description: 'Ordered values.', name: 'values', required: true, type: '(number | null)[]'},
      {description: 'Explicit line color.', name: 'color', type: 'string'},
      {description: 'Palette slot. Web only.', name: 'slot', type: 'number'}
    ),
    when: 'Use it as context inside a row or card, not for exact values.',
  },
  {
    code: chartExample(
      'Range',
      `  data,`,
      `const data = [
  { id: 'mon', category: 'Mon', low: 12, high: 24 },
  { id: 'tue', category: 'Tue', low: 18, high: 31 },
  { id: 'wed', category: 'Wed', low: 15, high: 28 },
]`,
      '@hzblj/zyplot/ios'
    ),
    description: 'Plot a low-to-high interval for each category.',
    id: 'ios-range',
    name: 'Range',
    platforms: ['ios'],
    preview: null,
    props: shared({
      description: 'Low and high values for each category.',
      name: 'data',
      required: true,
      type: 'ChartRangeDatumIos[]',
    }),
    when: 'Use it for confidence intervals, forecasts, or min/max ranges. iOS only.',
  },
  {
    code: chartExample(
      'Rule',
      `  data,
  orientation: 'horizontal',`,
      `const data = [
  { id: 'target', label: 'Target', value: 80 },
  { id: 'limit', label: 'Limit', value: 95 },
]`,
      '@hzblj/zyplot/ios'
    ),
    description: 'Draw standalone reference rules.',
    id: 'ios-rule',
    name: 'Rule',
    platforms: ['ios'],
    preview: null,
    props: shared(
      {
        description: 'Rules with optional start and end positions.',
        name: 'data',
        required: true,
        type: 'ChartRuleDatumIos[]',
      },
      {description: 'Direction of the rules.', name: 'orientation', type: '"horizontal" | "vertical"'}
    ),
    when: 'Use it for thresholds or reference lines without a main series. iOS only.',
  },
  {
    code: chartExample(
      'Waterfall',
      `  data,`,
      `const data = [
  { id: 'revenue', label: 'Revenue', value: 120 },
  { id: 'costs', label: 'Costs', value: -48 },
  { id: 'tax', label: 'Tax', value: -18 },
  { id: 'profit', label: 'Profit', value: 54 },
]`,
      '@hzblj/zyplot/android'
    ),
    description: 'Show how positive and negative steps build a total.',
    id: 'android-waterfall',
    name: 'Waterfall',
    platforms: ['android'],
    preview: null,
    props: cartesian({
      description: 'Ordered positive and negative steps.',
      name: 'data',
      required: true,
      type: 'ChartWaterfallDatumAndroid[]',
    }),
    when: 'Use it to explain how a starting value changes into a final value. Android only.',
  },
  {
    code: chartExample(
      'Lollipop',
      `  data,
  orientation: 'horizontal',`,
      `const data = [
  { id: 'alpha', label: 'Alpha', value: 42 },
  { id: 'beta', label: 'Beta', value: 68 },
  { id: 'gamma', label: 'Gamma', value: 53 },
]`,
      '@hzblj/zyplot/android'
    ),
    description: 'Compare categories with a stem and dot.',
    id: 'android-lollipop',
    name: 'Lollipop',
    platforms: ['android'],
    preview: null,
    props: cartesian(
      {description: 'Values to compare.', name: 'data', required: true, type: 'ChartDatum[]'},
      {description: 'Direction of the stems.', name: 'orientation', type: '"horizontal" | "vertical"'}
    ),
    when: 'Use it as a lighter alternative to bars. Android only.',
  },
]

export const chartGroups = groupCharts(chartDocs)
export const chartIds = chartGroups.flatMap(group => group.charts.map(chart => chart.id))
