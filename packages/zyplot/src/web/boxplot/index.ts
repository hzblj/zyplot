import {BoxplotChart as BoxplotChartRoot} from './boxplot-chart'
import {BoxplotChartSkeleton} from './boxplot-chart-skeleton'

export type {BoxplotChartProps} from './boxplot-chart'
export type {BoxplotChartSkeletonProps} from './boxplot-chart-skeleton'

/** `Chart.Boxplot`, with its loading placeholder at `Chart.Boxplot.Skeleton`. */
export const BoxplotChart = Object.assign(BoxplotChartRoot, {
  Skeleton: BoxplotChartSkeleton,
})
