import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonLine} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.TimeSeries.Skeleton`. */
export type TimeSeriesChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.TimeSeries`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const TimeSeriesChartSkeleton: FC<TimeSeriesChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonLine count={2} />
  </ChartSkeletonFrame>
)
