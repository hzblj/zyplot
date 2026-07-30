import {BarChart as BarChartRoot} from './bar-chart'
import {BarChartSkeleton} from './bar-chart-skeleton'

export type {BarChartProps} from './bar-chart'
export type {BarChartSkeletonProps} from './bar-chart-skeleton'

/** `Chart.Bar`, with its loading placeholder at `Chart.Bar.Skeleton`. */
export const BarChart = Object.assign(BarChartRoot, {
  Skeleton: BarChartSkeleton,
})
