import {HeatmapChart as HeatmapChartRoot} from './heatmap-chart'
import {HeatmapChartSkeleton} from './heatmap-chart-skeleton'

export type {HeatmapChartProps} from './heatmap-chart'
export type {HeatmapChartSkeletonProps} from './heatmap-chart-skeleton'

/** `Chart.Heatmap`, with its loading placeholder at `Chart.Heatmap.Skeleton`. */
export const HeatmapChart = Object.assign(HeatmapChartRoot, {
  Skeleton: HeatmapChartSkeleton,
})
