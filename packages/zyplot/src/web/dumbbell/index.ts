import {DumbbellChart as DumbbellChartRoot} from './dumbbell-chart'
import {DumbbellChartSkeleton} from './dumbbell-chart-skeleton'

export type {DumbbellChartProps} from './dumbbell-chart'
export type {DumbbellChartSkeletonProps} from './dumbbell-chart-skeleton'

/** `Chart.Dumbbell`, with its loading placeholder at `Chart.Dumbbell.Skeleton`. */
export const DumbbellChart = Object.assign(DumbbellChartRoot, {
  Skeleton: DumbbellChartSkeleton,
})
