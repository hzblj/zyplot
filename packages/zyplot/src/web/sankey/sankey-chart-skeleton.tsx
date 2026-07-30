import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBlocks} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Sankey.Skeleton`. */
export type SankeyChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Sankey`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const SankeyChartSkeleton: FC<SankeyChartSkeletonProps> = ({className, height, legendCount = 0}) => (
  <ChartSkeletonFrame className={className} xAxis={false} yAxis={false} height={height} legendCount={legendCount}>
    <SkeletonBlocks />
  </ChartSkeletonFrame>
)
