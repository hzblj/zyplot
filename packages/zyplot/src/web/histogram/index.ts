import {HistogramChart as HistogramChartRoot} from './histogram-chart'
import {HistogramChartSkeleton} from './histogram-chart-skeleton'

export type {HistogramChartProps} from './histogram-chart'
export type {HistogramChartSkeletonProps} from './histogram-chart-skeleton'

/** `Chart.Histogram`, with its loading placeholder at `Chart.Histogram.Skeleton`. */
export const HistogramChart = Object.assign(HistogramChartRoot, {
  Skeleton: HistogramChartSkeleton,
})
