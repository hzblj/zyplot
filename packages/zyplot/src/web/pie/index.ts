import {PieChart as PieChartRoot} from './pie-chart'
import {PieChartSkeleton} from './pie-chart-skeleton'

export type {PieChartProps} from './pie-chart'
export type {PieChartSkeletonProps} from './pie-chart-skeleton'

/** `Chart.Pie`, with its loading placeholder at `Chart.Pie.Skeleton`. */
export const PieChart = Object.assign(PieChartRoot, {
  Skeleton: PieChartSkeleton,
})
