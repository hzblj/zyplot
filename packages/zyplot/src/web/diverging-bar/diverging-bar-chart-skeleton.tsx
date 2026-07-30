import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBars} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.DivergingBar.Skeleton`. */
export type DivergingBarChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.DivergingBar`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const DivergingBarChartSkeleton: FC<DivergingBarChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonBars orientation="horizontal" seed={3.1} />
  </ChartSkeletonFrame>
)
