import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBars} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.StackedBar.Skeleton`. */
export type StackedBarChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.StackedBar`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const StackedBarChartSkeleton: FC<StackedBarChartSkeletonProps> = ({orientation = 'horizontal', ...props}) => (
  <ChartSkeletonFrame {...props} orientation={orientation}>
    <SkeletonBars count={props.categories?.length} orientation={orientation} seed={2.9} />
  </ChartSkeletonFrame>
)
