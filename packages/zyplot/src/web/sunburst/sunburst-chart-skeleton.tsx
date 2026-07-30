import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonRing} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Sunburst.Skeleton`. */
export type SunburstChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Sunburst`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const SunburstChartSkeleton: FC<SunburstChartSkeletonProps> = ({className, height, legendCount = 0}) => (
  <ChartSkeletonFrame className={className} xAxis={false} yAxis={false} height={height} legendCount={legendCount}>
    <SkeletonRing holeRatio={0.23} sizePercent={78} />
  </ChartSkeletonFrame>
)
