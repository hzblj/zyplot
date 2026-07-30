import {AreaChart as AreaChartRoot} from './area-chart'
import {AreaChartSkeleton} from './area-chart-skeleton'

export type {AreaChartProps} from './area-chart'
export type {AreaChartSkeletonProps} from './area-chart-skeleton'

/** `Chart.Area`, with its loading placeholder at `Chart.Area.Skeleton`. */
export const AreaChart = Object.assign(AreaChartRoot, {
  Skeleton: AreaChartSkeleton,
})
