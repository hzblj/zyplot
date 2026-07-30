import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBars} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.StackedBar.Skeleton`. */
export type StackedBarChartSkeletonProps = ChartSkeletonProps & {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * The placeholder for `Chart.StackedBar`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const StackedBarChartSkeleton: FC<StackedBarChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  orientation = 'horizontal',
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonBars orientation={orientation} seed={2.9} />
  </ChartSkeletonFrame>
)
