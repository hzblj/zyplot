import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBoxplot} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Boxplot.Skeleton`. */
export type BoxplotChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Boxplot`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const BoxplotChartSkeleton: FC<BoxplotChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonBoxplot />
  </ChartSkeletonFrame>
)
