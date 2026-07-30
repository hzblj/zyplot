/**
 * Every chart for the DOM, rendered by ECharts and uPlot. `Chart` is the only
 * value exported: reach a form through it, as `Chart.Bar` or `Chart.Sankey`.
 *
 * A plain `@hzblj/zyplot` import already resolves here outside React Native, so
 * use this subpath only when a file must be web in a project that has both.
 */

// The built stylesheets themselves, rather than the `style.css` that gathers them: its
// `@import`s are not followed by every bundler in development — Metro leaves them out — and
// a chart with no styles at all loses the layer its skeleton and its plot share, so the two
// stack up and everything an app draws over the plot is measured from the wrong place.
import 'uplot/dist/uPlot.min.css'
import '../charts.css'

export {
  animation,
  annotation,
  axis,
  format,
  glow,
  halo,
  interaction,
  marker,
  plot,
  reveal,
  series,
  seriesProps,
  seriesStyle,
  surface,
  theme,
} from '@hzblj/zyplot-core'
export type {ChartAnnotationViews} from '../shared/annotation-views'
export type {ChartScrub, ChartScrubSelection} from '../shared/use-chart-scrub'
export {useChartScrub} from '../shared/use-chart-scrub'
export type {ChartReading} from '../shared/use-last-reading'
export {useLastReading} from '../shared/use-last-reading'
export type {AreaChartProps, AreaChartSkeletonProps} from './area'
export type {BarChartProps, BarChartSkeletonProps} from './bar'
export type {BoxplotChartProps, BoxplotChartSkeletonProps} from './boxplot'
export type {
  CandlestickChartProps,
  CandlestickChartSkeletonProps,
} from './candlestick'
export {Chart} from './chart'
export type {
  DivergingBarChartProps,
  DivergingBarChartSkeletonProps,
} from './diverging-bar'
export type {
  DumbbellChartProps,
  DumbbellChartSkeletonProps,
} from './dumbbell'
export type {FunnelChartProps, FunnelChartSkeletonProps} from './funnel'
export type {GaugeChartProps, GaugeChartSkeletonProps} from './gauge'
export type {HeatmapChartProps, HeatmapChartSkeletonProps} from './heatmap'
export type {
  HistogramChartProps,
  HistogramChartSkeletonProps,
} from './histogram'
export type {LineChartProps, LineChartSkeletonProps} from './line'
export type {MeterBarProps, MeterBarSkeletonProps} from './meter'
export type {PieChartProps, PieChartSkeletonProps} from './pie'
export type {RadarChartProps, RadarChartSkeletonProps} from './radar'
export type {SankeyChartProps, SankeyChartSkeletonProps} from './sankey'
export type {ScatterChartProps, ScatterChartSkeletonProps} from './scatter'
export type {
  ChartColorMode,
  ChartProviderProps,
  ChartProviderTheme,
} from './shared/theme'
export type * from './shared/types'
export type {SparklineProps, SparklineSkeletonProps} from './sparkline'
export type {
  StackedBarChartProps,
  StackedBarChartSkeletonProps,
} from './stacked-bar'
export type {
  SunburstChartProps,
  SunburstChartSkeletonProps,
} from './sunburst'
export type {
  TimeSeriesChartProps,
  TimeSeriesChartSkeletonProps,
} from './time-series'
export type {TreemapChartProps, TreemapChartSkeletonProps} from './treemap'
