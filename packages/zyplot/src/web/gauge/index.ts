import {GaugeChart as GaugeChartRoot} from './gauge-chart'
import {GaugeChartSkeleton} from './gauge-chart-skeleton'

export type {GaugeChartProps} from './gauge-chart'
export type {GaugeChartSkeletonProps} from './gauge-chart-skeleton'

/** `Chart.Gauge`, with its loading placeholder at `Chart.Gauge.Skeleton`. */
export const GaugeChart = Object.assign(GaugeChartRoot, {
  Skeleton: GaugeChartSkeleton,
})
