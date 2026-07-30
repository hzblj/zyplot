import {TreemapChart as TreemapChartRoot} from './treemap-chart'
import {TreemapChartSkeleton} from './treemap-chart-skeleton'

export type {TreemapChartProps} from './treemap-chart'
export type {TreemapChartSkeletonProps} from './treemap-chart-skeleton'

/** `Chart.Treemap`, with its loading placeholder at `Chart.Treemap.Skeleton`. */
export const TreemapChart = Object.assign(TreemapChartRoot, {
  Skeleton: TreemapChartSkeleton,
})
