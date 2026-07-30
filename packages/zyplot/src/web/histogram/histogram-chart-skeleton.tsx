import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBars} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Histogram.Skeleton`. */
export type HistogramChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Histogram`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const HistogramChartSkeleton: FC<HistogramChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonBars count={12} seed={0.9} />
  </ChartSkeletonFrame>
)
