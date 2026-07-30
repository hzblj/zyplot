import {LineChart as LineChartRoot} from './line-chart'
import {LineChartSkeleton} from './line-chart-skeleton'

export type {LineChartProps} from './line-chart'
export type {LineChartSkeletonProps} from './line-chart-skeleton'

/** `Chart.Line`, with its loading placeholder at `Chart.Line.Skeleton`. */
export const LineChart = Object.assign(LineChartRoot, {
  Skeleton: LineChartSkeleton,
})
