import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonArc} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Gauge.Skeleton`. */
export type GaugeChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Gauge`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const GaugeChartSkeleton: FC<GaugeChartSkeletonProps> = ({className, height, legendCount = 0}) => (
  <ChartSkeletonFrame className={className} xAxis={false} yAxis={false} height={height} legendCount={legendCount}>
    <SkeletonArc />
  </ChartSkeletonFrame>
)
