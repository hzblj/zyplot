import {BarChartSkeleton} from '../bar/bar-chart-skeleton'
import {CandlestickChart as CandlestickChartRoot} from './candlestick-chart'

export type {
  CandlestickChartProps,
  CandlestickChartSkeletonProps,
} from './candlestick-chart'

/** `Chart.Candlestick`, with its loading placeholder at `Chart.Candlestick.Skeleton`. */
export const CandlestickChart = Object.assign(CandlestickChartRoot, {
  Skeleton: BarChartSkeleton,
})
