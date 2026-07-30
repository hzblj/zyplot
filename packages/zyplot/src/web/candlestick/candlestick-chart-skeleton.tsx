import type {FC} from 'react'

import {ChartSkeletonFrame, SkeletonCandles} from '../shared/skeleton'
import type {ChartSkeletonProps} from '../shared/types'

/** Props for `Chart.Candlestick.Skeleton`. */
export type CandlestickChartSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Candlestick`: floating bodies on their wicks, not bars
 * grown from a baseline, so the shape that lands is the shape that was promised.
 */
export const CandlestickChartSkeleton: FC<CandlestickChartSkeletonProps> = ({
  className,
  height,
  legendCount = 0,
  xAxis = true,
  yAxis = true,
}) => (
  <ChartSkeletonFrame className={className} height={height} legendCount={legendCount} xAxis={xAxis} yAxis={yAxis}>
    <SkeletonCandles />
  </ChartSkeletonFrame>
)
