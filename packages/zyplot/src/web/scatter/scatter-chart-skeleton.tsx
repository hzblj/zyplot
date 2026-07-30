import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonDots} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Scatter.Skeleton`. */
export type ScatterChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Scatter`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const ScatterChartSkeleton: FC<ScatterChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonDots />
  </ChartSkeletonFrame>
)
