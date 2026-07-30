import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonDumbbell} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Dumbbell.Skeleton`. */
export type DumbbellChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Dumbbell`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const DumbbellChartSkeleton: FC<DumbbellChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonDumbbell />
  </ChartSkeletonFrame>
)
