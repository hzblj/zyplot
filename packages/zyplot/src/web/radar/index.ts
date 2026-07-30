import {RadarChart as RadarChartRoot} from './radar-chart'
import {RadarChartSkeleton} from './radar-chart-skeleton'

export type {RadarChartProps} from './radar-chart'
export type {RadarChartSkeletonProps} from './radar-chart-skeleton'

/** `Chart.Radar`, with its loading placeholder at `Chart.Radar.Skeleton`. */
export const RadarChart = Object.assign(RadarChartRoot, {
  Skeleton: RadarChartSkeleton,
})
