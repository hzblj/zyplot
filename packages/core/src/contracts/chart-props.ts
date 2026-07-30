import type {
  ChartBoxplotGroup,
  ChartDatum,
  ChartDumbbellRow,
  ChartFlowLink,
  ChartFlowNode,
  ChartHeatmapCell,
  ChartHierarchyNode,
  ChartRadarAxis,
  ChartScatterSeries,
  ChartSeries,
  ChartTimePoints,
} from './chart-data'
import type {ChartCandlestickDatum, ChartCandlestickLabels, ChartCandlestickStyle} from './chart-finance'
import type {NativeChartKind} from './chart-kinds'
import type {
  NativeChartAnimation,
  NativeChartAnnotation,
  NativeChartAxisOptions,
  NativeChartInteraction,
  NativeChartInteractionEvent,
  NativeChartSeriesStyle,
} from './chart-native'
import type {ChartPlotStyle} from './chart-presentation'
import type {ChartSurface} from './chart-surface'
import type {ChartAxes, ChartColorMode, ChartNumberFormat, ChartOrientation, NativeChartTheme} from './chart-theme'

/**
 * What every native chart accepts on top of its own data props. It is not the
 * same set as the web's `ChartBaseProps`: there is no `className`, `skeleton` or
 * `texture` here, and the presentation props are the wider `Native*` ones.
 */
export type NativeChartBaseProps = {
  accessibilityLabel?: string
  animation?: NativeChartAnimation
  annotations?: readonly NativeChartAnnotation[]
  axis?: ChartAxes
  colorMode?: ChartColorMode
  format?: ChartNumberFormat
  /** Plot height in points. The chart never measures its own content. */
  height?: number
  interaction?: NativeChartInteraction
  /** Hold true while the data is in flight to show the placeholder. */
  isLoading?: boolean
  onInteraction?: (event: NativeChartInteractionEvent) => void
  plot?: ChartPlotStyle
  /** Keyed by `ChartSeries.id`. */
  seriesStyles?: Readonly<Record<string, NativeChartSeriesStyle>>
  surface?: ChartSurface
  theme?: NativeChartTheme
  xAxis?: NativeChartAxisOptions
  yAxis?: NativeChartAxisOptions
}

/** Shared by every form plotted as series against a category axis. */
export type CartesianSeriesChartProps = NativeChartBaseProps & {
  categories: readonly string[]
  /** Keeps one series in colour and drops the rest to grey. */
  emphasisId?: string
  series: readonly ChartSeries[]
}

/** Props for `Chart.Line`. Set `isSmooth` for a curved stroke. */
export type LineChartProps = CartesianSeriesChartProps & {isSmooth?: boolean}

/** Props for `Chart.Area`. Stack the series to show a total as well as the parts. */
export type AreaChartProps = CartesianSeriesChartProps & {
  isSmooth?: boolean
  isStacked?: boolean
}

/** Props for `Chart.Bar`. Go horizontal when the category names are long. */
export type BarChartProps = CartesianSeriesChartProps & {
  orientation?: ChartOrientation
}

/** Props for `Chart.StackedBar`. Same shape as a grouped bar chart. */
export type StackedBarChartProps = BarChartProps

/** Props for `Chart.Pie`. Give `innerRadius` to make it a donut. */
export type PieChartProps = NativeChartBaseProps & {
  data: readonly ChartDatum[]
  innerRadius?: number
}

/** Props for `Chart.Gauge`. One value against a range, drawn as an arc. */
export type GaugeChartProps = NativeChartBaseProps & {
  label?: string
  max?: number
  min?: number
  value: number
}

/** Props for `Chart.Meter`. The same reading as a gauge, drawn as a bar. */
export type MeterChartProps = GaugeChartProps

/** Props for `Chart.Histogram`. Raw values in, bins computed for you. */
export type HistogramChartProps = NativeChartBaseProps & {
  binCount?: number
  values: readonly number[]
}

/** Props for `Chart.Boxplot`. `labels` is required, because "Q1" is jargon. */
export type BoxplotChartProps = NativeChartBaseProps & {
  groups: readonly ChartBoxplotGroup[]
  labels: {max: string; median: string; min: string; q1: string; q3: string}
  orientation?: ChartOrientation
}

/** Props for `Chart.Candlestick`, with an optional volume histogram below. */
export type CandlestickChartProps = NativeChartBaseProps & {
  data: readonly ChartCandlestickDatum[]
  labels?: ChartCandlestickLabels
  showVolume?: boolean
  style?: ChartCandlestickStyle
}

/** Props for `Chart.DivergingBar`. Bars run either side of a zero line. */
export type DivergingBarChartProps = NativeChartBaseProps & {
  data: readonly ChartDatum[]
}

/** Props for `Chart.Dumbbell`. One row per before/after pair. */
export type DumbbellChartProps = NativeChartBaseProps & {
  rows: readonly ChartDumbbellRow[]
}

/** Props for `Chart.Funnel`. Give the stages in the order they are passed through. */
export type FunnelChartProps = NativeChartBaseProps & {
  data: readonly ChartDatum[]
}

/** Props for `Chart.Heatmap`. Cells address the axes by index. */
export type HeatmapChartProps = NativeChartBaseProps & {
  cells: readonly ChartHeatmapCell[]
  columns: readonly string[]
  rows: readonly string[]
}

/** Props for `Chart.Radar`. Every series is scored against all the axes. */
export type RadarChartProps = NativeChartBaseProps & {
  axes: readonly ChartRadarAxis[]
  series: readonly ChartSeries[]
}

/** Props for `Chart.Scatter`. Both axes are measures, so both take a label. */
export type ScatterChartProps = NativeChartBaseProps & {
  series: readonly ChartScatterSeries[]
  xFormat?: ChartNumberFormat
  xLabel?: string
  yFormat?: ChartNumberFormat
  yLabel?: string
}

/** Props for `Chart.Sankey`. Links reference nodes by `id`. */
export type SankeyChartProps = NativeChartBaseProps & {
  links: readonly ChartFlowLink[]
  nodes: readonly ChartFlowNode[]
}

/** Props for `Chart.Treemap` and `Chart.Sunburst`. */
export type HierarchyChartProps = NativeChartBaseProps & {
  data: readonly ChartHierarchyNode[]
}

/** Props for `Chart.TimeSeries`. Values live in `points`, names in `series`. */
export type TimeSeriesChartProps = NativeChartBaseProps & {
  points: ChartTimePoints
  series: readonly Omit<ChartSeries, 'values'>[]
}

/** Props for `Chart.Sparkline`. One line, no axes, no chrome. */
export type SparklineChartProps = NativeChartBaseProps & {
  color?: string
  values: readonly (number | null)[]
}

/** Looks up a form's props by its `NativeChartKind`. */
export type NativeChartPropsByKind = {
  area: AreaChartProps
  bar: BarChartProps
  boxplot: BoxplotChartProps
  candlestick: CandlestickChartProps
  'diverging-bar': DivergingBarChartProps
  dumbbell: DumbbellChartProps
  funnel: FunnelChartProps
  gauge: GaugeChartProps
  heatmap: HeatmapChartProps
  histogram: HistogramChartProps
  line: LineChartProps
  meter: MeterChartProps
  pie: PieChartProps
  radar: RadarChartProps
  sankey: SankeyChartProps
  scatter: ScatterChartProps
  sparkline: SparklineChartProps
  'stacked-bar': StackedBarChartProps
  sunburst: HierarchyChartProps
  'time-series': TimeSeriesChartProps
  treemap: HierarchyChartProps
}

/** Any native chart's props tagged with its `type`, for passing charts as data. */
export type NativeChartConfiguration = {
  [K in NativeChartKind]: NativeChartPropsByKind[K] & {type: K}
}[NativeChartKind]
