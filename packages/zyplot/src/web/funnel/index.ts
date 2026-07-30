import {FunnelChart as FunnelChartRoot} from './funnel-chart'
import {FunnelChartSkeleton} from './funnel-chart-skeleton'

export type {FunnelChartProps} from './funnel-chart'
export type {FunnelChartSkeletonProps} from './funnel-chart-skeleton'

/** `Chart.Funnel`, with its loading placeholder at `Chart.Funnel.Skeleton`. */
export const FunnelChart = Object.assign(FunnelChartRoot, {
  Skeleton: FunnelChartSkeleton,
})
