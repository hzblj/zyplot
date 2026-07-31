import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonLine} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Line.Skeleton`. */
export type LineChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Line`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const LineChartSkeleton: FC<LineChartSkeletonProps> = props => (
  <ChartSkeletonFrame {...props}>
    <SkeletonLine />
  </ChartSkeletonFrame>
)
