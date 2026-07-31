import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonArea} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Area.Skeleton`. */
export type AreaChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Area`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const AreaChartSkeleton: FC<AreaChartSkeletonProps> = props => (
  <ChartSkeletonFrame {...props}>
    <SkeletonArea />
  </ChartSkeletonFrame>
)
