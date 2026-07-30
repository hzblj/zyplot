import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonFunnel} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Funnel.Skeleton`. */
export type FunnelChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Funnel`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const FunnelChartSkeleton: FC<FunnelChartSkeletonProps> = ({className, height, legendCount = 0}) => (
  <ChartSkeletonFrame className={className} xAxis={false} yAxis={false} height={height} legendCount={legendCount}>
    <SkeletonFunnel />
  </ChartSkeletonFrame>
)
