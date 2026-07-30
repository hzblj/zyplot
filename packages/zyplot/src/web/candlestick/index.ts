import {CandlestickChart as CandlestickChartRoot} from './candlestick-chart'
import {CandlestickChartSkeleton} from './candlestick-chart-skeleton'

export type {CandlestickChartProps} from './candlestick-chart'
export type {CandlestickChartSkeletonProps} from './candlestick-chart-skeleton'

/** `Chart.Candlestick`, with its loading placeholder at `Chart.Candlestick.Skeleton`. */
export const CandlestickChart = Object.assign(CandlestickChartRoot, {
  Skeleton: CandlestickChartSkeleton,
})
