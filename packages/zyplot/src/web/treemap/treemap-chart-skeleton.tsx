import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBlocks} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Treemap.Skeleton`. */
export type TreemapChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Treemap`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const TreemapChartSkeleton: FC<TreemapChartSkeletonProps> = ({className, height, legendCount = 0}) => (
  <ChartSkeletonFrame className={className} xAxis={false} yAxis={false} height={height} legendCount={legendCount}>
    <SkeletonBlocks count={6} />
  </ChartSkeletonFrame>
)
