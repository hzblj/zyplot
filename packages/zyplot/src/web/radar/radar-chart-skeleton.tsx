import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonPolygon} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Radar.Skeleton`. */
export type RadarChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Radar`: the same shape at the same height, so nothing
 * moves when the data lands.
 */
export const RadarChartSkeleton: FC<RadarChartSkeletonProps> = ({className, height, legendCount = 0}) => (
  <ChartSkeletonFrame className={className} xAxis={false} yAxis={false} height={height} legendCount={legendCount}>
    <SkeletonPolygon />
  </ChartSkeletonFrame>
)
