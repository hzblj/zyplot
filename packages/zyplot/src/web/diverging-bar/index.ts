import {DivergingBarChart as DivergingBarChartRoot} from './diverging-bar-chart'
import {DivergingBarChartSkeleton} from './diverging-bar-chart-skeleton'

export type {DivergingBarChartProps} from './diverging-bar-chart'
export type {DivergingBarChartSkeletonProps} from './diverging-bar-chart-skeleton'

/** `Chart.DivergingBar`, with its loading placeholder at `Chart.DivergingBar.Skeleton`. */
export const DivergingBarChart = Object.assign(DivergingBarChartRoot, {
  Skeleton: DivergingBarChartSkeleton,
})
