import {SankeyChart as SankeyChartRoot} from './sankey-chart'
import {SankeyChartSkeleton} from './sankey-chart-skeleton'

export type {SankeyChartProps} from './sankey-chart'
export type {SankeyChartSkeletonProps} from './sankey-chart-skeleton'

/** `Chart.Sankey`, with its loading placeholder at `Chart.Sankey.Skeleton`. */
export const SankeyChart = Object.assign(SankeyChartRoot, {
  Skeleton: SankeyChartSkeleton,
})
