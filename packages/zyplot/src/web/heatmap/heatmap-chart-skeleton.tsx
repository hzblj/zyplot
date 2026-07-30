import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonGrid} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Heatmap.Skeleton`. */
export type HeatmapChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Heatmap`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const HeatmapChartSkeleton: FC<HeatmapChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonGrid />
  </ChartSkeletonFrame>
)
