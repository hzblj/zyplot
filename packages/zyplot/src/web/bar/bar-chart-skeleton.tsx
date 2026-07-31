import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonBars} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Bar.Skeleton`. */
export type BarChartSkeletonProps = ChartSkeletonProps & {
  /** How many bars. Taken from `categories` when they are given. */
  count?: number
}

/**
 * The placeholder for `Chart.Bar`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const BarChartSkeleton: FC<BarChartSkeletonProps> = ({
  categories,
  className,
  count,
  format,
  height,
  legendCount = 0,
  orientation = 'vertical',
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame
    categories={categories}
    className={className}
    format={format}
    height={height}
    legendCount={legendCount}
    orientation={orientation}
    xAxis={xAxis}
    yAxis={yAxis}
  >
    <SkeletonBars count={count ?? categories?.length} orientation={orientation} />
  </ChartSkeletonFrame>
)
