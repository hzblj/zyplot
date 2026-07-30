import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBars} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Bar.Skeleton`. */
export type BarChartSkeletonProps = ChartSkeletonProps & {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * The placeholder for `Chart.Bar`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const BarChartSkeleton: FC<BarChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  orientation = 'vertical',
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonBars orientation={orientation} />
  </ChartSkeletonFrame>
)
