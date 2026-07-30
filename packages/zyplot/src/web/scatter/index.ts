import {ScatterChart as ScatterChartRoot} from './scatter-chart'
import {ScatterChartSkeleton} from './scatter-chart-skeleton'

export type {ScatterChartProps} from './scatter-chart'
export type {ScatterChartSkeletonProps} from './scatter-chart-skeleton'

/** `Chart.Scatter`, with its loading placeholder at `Chart.Scatter.Skeleton`. */
export const ScatterChart = Object.assign(ScatterChartRoot, {
  Skeleton: ScatterChartSkeleton,
})
