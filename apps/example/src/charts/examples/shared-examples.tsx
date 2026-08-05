import {Chart, zyplot} from '@hzblj/zyplot'
import {useMemo} from 'react'
import {Text, View} from 'react-native'
import {alpha, borderWidth, chartHeight, radius, space} from '../../theme/tokens'
import {useTheme} from '../../theme/use-theme'

const PeakTag = ({background, label}: {background: string; label: string}) => (
  <View
    style={{backgroundColor: background, borderRadius: radius.full, paddingHorizontal: space.sm, paddingVertical: 2}}
  >
    <Text style={{color: '#ffffff', fontSize: 11, fontWeight: '600'}}>{label}</Text>
  </View>
)

const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const revenue = {id: 'revenue', label: 'Revenue', values: [42, 56, 51, 72, 84, 91]}
const costs = {id: 'costs', label: 'Costs', values: [28, 34, 38, 41, 48, 53]}
const series = [revenue, costs]

const data = [
  {id: 'web', label: 'Web', value: 48},
  {id: 'ios', label: 'iOS', value: 31},
  {id: 'android', label: 'Android', value: 21},
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

const lineChart = zyplot(() => ({categories, height: chartHeight.lg, series}))
const areaChart = zyplot(() => ({categories, height: chartHeight.lg, series}))
const barChart = zyplot(() => ({categories, height: chartHeight.lg, series}))
const stackedBarChart = zyplot(() => ({categories, height: chartHeight.lg, series}))

const divergingBarChart = zyplot(() => ({
  data: [
    {id: 'north', label: 'North', value: 34},
    {id: 'south', label: 'South', value: -22},
    {id: 'east', label: 'East', value: 18},
    {id: 'west', label: 'West', value: -12},
  ],
  height: chartHeight.lg,
}))

const histogramChart = zyplot(() => ({
  height: chartHeight.lg,
  values: [12, 14, 15, 18, 19, 22, 23, 24, 24, 26, 28, 31, 34, 38, 42],
}))

const scatterChart = zyplot(() => ({
  height: chartHeight.lg,
  series: [
    {
      id: 'accounts',
      label: 'Accounts',
      points: [
        {size: 8, x: 12, y: 42},
        {size: 11, x: 24, y: 61},
        {size: 7, x: 38, y: 68},
        {size: 13, x: 54, y: 89},
      ],
    },
  ],
}))

const timeSeriesChart = zyplot(() => ({
  height: chartHeight.lg,
  points: {
    timestamps: categories.map((_, index) => 1_735_689_600 + index * 86_400),
    values: series.map(item => item.values),
  },
  series: series.map(({values: _, ...item}) => item),
}))

const sparklineChart = zyplot(() => ({height: chartHeight.sm, values: revenue.values}))

/** The one line with everything on it: a target, a campaign window, a peak wearing the app's own tag. */
const advancedLineChart = (color: ReturnType<typeof useTheme>['color']) =>
  zyplot(z => ({
    animation: z.animation({duration: 520, easing: 'spring'}),
    annotations: [
      z.annotation.line({
        axis: 'y',
        color: color.chart.categorical[2],
        dash: [6, 4],
        id: 'target',
        label: 'Target',
        value: 75,
      }),
      z.annotation.range({
        axis: 'x',
        color: color.content.accent,
        end: 'Apr',
        id: 'campaign',
        label: 'Campaign',
        opacity: 0.1,
        start: 'Mar',
      }),
      // The view goes on the annotation, so the id is written once and the chart's own dot for it
      // steps aside.
      z.annotation.point({
        color: color.content.accent,
        id: 'peak',
        view: <PeakTag background={color.content.accent} label="$91" />,
        x: 'Jun',
        y: 91,
      }),
    ],
    categories,
    height: chartHeight.lg,
    interaction: z.interaction({crosshair: 'both', haptics: true, hover: 'nearest', selection: 'single'}),
    plot: z.plot({
      backgroundColor: alpha(color.content.accent, 0.04),
      borderColor: alpha(color.content.accent, 0.2),
      borderRadius: radius.md,
      borderWidth: borderWidth.thin,
      padding: space.sm,
    }),
    series: [
      z.series({...revenue, style: {strokeWidth: 3, symbol: 'circle', symbolSize: 4}}),
      z.series({...costs, style: {strokeDash: [6, 4], strokeWidth: 2}}),
    ],
    // The chart's own card for the reading, which is the default and worth naming in a gallery.
    tooltip: true,
    xAxis: {grid: false, label: 'Month'},
    yAxis: {domain: {max: 100, min: 0}, format: z.format({prefix: '$'}), label: 'Revenue', tickCount: 5},
  }))

export const CartesianExample = ({id}: {id: string}) => {
  const {color} = useTheme()
  const advanced = useMemo(() => advancedLineChart(color), [color])

  switch (id) {
    case 'line':
      return <Chart.Line {...lineChart} />
    case 'advanced-line':
      return <Chart.Line {...advanced} />
    case 'area':
      return <Chart.Area {...areaChart} />
    case 'bar':
      return <Chart.Bar {...barChart} />
    case 'stacked-bar':
      return <Chart.StackedBar {...stackedBarChart} />
    case 'diverging-bar':
      return <Chart.DivergingBar {...divergingBarChart} />
    case 'histogram':
      return <Chart.Histogram {...histogramChart} />
    case 'scatter':
      return <Chart.Scatter {...scatterChart} />
    case 'time-series':
      return <Chart.TimeSeries {...timeSeriesChart} />
    case 'sparkline':
      return <Chart.Sparkline {...sparklineChart} />
    default:
      return null
  }
}

const pieChart = zyplot(() => ({data, height: chartHeight.lg, innerRadius: 0.52}))
const gaugeChart = zyplot(() => ({height: chartHeight.md, label: 'Adoption', value: 72}))

const meterChart = zyplot(z => ({
  format: z.format({suffix: '%'}),
  height: chartHeight.md,
  label: 'Capacity',
  value: 64,
}))

const radarChart = zyplot(() => ({
  axes: [
    {label: 'Speed', max: 100},
    {label: 'Ease', max: 100},
    {label: 'Value', max: 100},
    {label: 'Reach', max: 100},
    {label: 'Quality', max: 100},
  ],
  height: chartHeight.lg,
  series: [
    {id: 'starter', label: 'Starter', values: [72, 84, 68, 79, 64]},
    {id: 'pro', label: 'Pro', values: [85, 72, 76, 66, 81]},
  ],
}))

const sunburstChart = zyplot(() => ({data: hierarchy, height: chartHeight.lg}))

export const RadialExample = ({id}: {id: string}) => {
  switch (id) {
    case 'pie':
      return <Chart.Pie {...pieChart} />
    case 'gauge':
      return <Chart.Gauge {...gaugeChart} />
    case 'meter':
      return <Chart.Meter {...meterChart} />
    case 'radar':
      return <Chart.Radar {...radarChart} />
    case 'sunburst':
      return <Chart.Sunburst {...sunburstChart} />
    default:
      return null
  }
}

const boxplotChart = zyplot(() => ({
  groups: [
    {
      id: 'starter',
      label: 'Starter',
      max: 92,
      median: 61,
      min: 22,
      q1: 44,
      q3: 76,
    },
    {
      id: 'pro',
      label: 'Pro',
      max: 98,
      median: 72,
      min: 31,
      q1: 56,
      q3: 84,
    },
  ],
  height: chartHeight.lg,
  labels: {
    max: 'Max',
    median: 'Median',
    min: 'Min',
    q1: 'Q1',
    q3: 'Q3',
  },
}))

const dumbbellChart = zyplot(() => ({
  height: chartHeight.lg,
  rows: [
    {after: 72, before: 42, id: 'web', label: 'Web'},
    {after: 64, before: 51, id: 'ios', label: 'iOS'},
    {after: 58, before: 34, id: 'android', label: 'Android'},
  ],
}))

const funnelChart = zyplot(() => ({data, height: chartHeight.lg}))

const heatmapChart = zyplot(() => ({
  cells: Array.from({length: 18}, (_, index) => ({
    columnIndex: index % 6,
    rowIndex: Math.floor(index / 6),
    value: 18 + ((index * 17) % 76),
  })),
  columns: categories,
  height: chartHeight.md,
  rows: ['Web', 'iOS', 'Android'],
}))

const sankeyChart = zyplot(() => ({
  height: chartHeight.lg,
  links: [
    {source: 'visits', target: 'trial', value: 72},
    {source: 'visits', target: 'exit', value: 28},
    {source: 'trial', target: 'paid', value: 44},
  ],
  nodes: [
    {id: 'visits', label: 'Visits'},
    {id: 'trial', label: 'Trial'},
    {id: 'exit', label: 'Exit'},
    {id: 'paid', label: 'Paid'},
  ],
}))

const treemapChart = zyplot(() => ({data: hierarchy, height: chartHeight.md}))

/** Four periods with a price alert across them, hollow candles up and the volume plot below. */
const candlestickChart = (color: ReturnType<typeof useTheme>['color']) =>
  zyplot(z => ({
    animation: z.animation({duration: 560, easing: 'ease-out'}),
    annotations: [
      z.annotation.line({
        axis: 'y',
        color: color.content.destructive,
        dash: [5, 4],
        id: 'alert',
        label: 'Price alert',
        value: 62,
      }),
    ],
    data: [
      {
        category: 'Mon',
        close: 48,
        high: 54,
        id: 'mon',
        low: 39,
        open: 42,
        volume: 820,
      },
      {
        category: 'Tue',
        close: 44,
        high: 51,
        id: 'tue',
        low: 41,
        open: 48,
        volume: 620,
      },
      {
        category: 'Wed',
        close: 57,
        high: 61,
        id: 'wed',
        low: 43,
        open: 45,
        volume: 1_120,
      },
      {
        category: 'Thu',
        close: 64,
        high: 69,
        id: 'thu',
        low: 55,
        open: 58,
        volume: 980,
      },
    ],
    height: chartHeight.lg,
    interaction: z.interaction({crosshair: 'both', haptics: true, hover: 'nearest', selection: 'single', zoom: true}),
    showVolume: true,
    style: {
      candleWidth: 0.56,
      downColor: color.chart.negative,
      hollowUp: true,
      upColor: color.chart.positive,
      volumeHeightRatio: 0.2,
      wickWidth: 1.5,
    },
    tooltip: true,
    yAxis: {format: z.format({prefix: '$'}), tickCount: 6},
  }))

export const SpecializedExample = ({id}: {id: string}) => {
  const {color} = useTheme()
  const candlestick = useMemo(() => candlestickChart(color), [color])

  switch (id) {
    case 'boxplot':
      return <Chart.Boxplot {...boxplotChart} />
    case 'dumbbell':
      return <Chart.Dumbbell {...dumbbellChart} />
    case 'funnel':
      return <Chart.Funnel {...funnelChart} />
    case 'heatmap':
      return <Chart.Heatmap {...heatmapChart} />
    case 'sankey':
      return <Chart.Sankey {...sankeyChart} />
    case 'treemap':
      return <Chart.Treemap {...treemapChart} />
    case 'candlestick':
    case 'finance':
      return <Chart.Candlestick {...candlestick} />
    default:
      return null
  }
}
