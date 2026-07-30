import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonRing} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Pie.Skeleton`. */
export type PieChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Pie`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const PieChartSkeleton: FC<PieChartSkeletonProps> = ({className, height, legendCount = 0}) => (
  <ChartSkeletonFrame className={className} xAxis={false} yAxis={false} height={height} legendCount={legendCount}>
    <SkeletonRing />
  </ChartSkeletonFrame>
)
