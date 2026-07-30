import {TimeSeriesChart as TimeSeriesChartRoot} from './time-series-chart'
import {TimeSeriesChartSkeleton} from './time-series-chart-skeleton'

export type {TimeSeriesChartProps} from './time-series-chart'
export type {TimeSeriesChartSkeletonProps} from './time-series-chart-skeleton'

/** `Chart.TimeSeries`, with its loading placeholder at `Chart.TimeSeries.Skeleton`. */
export const TimeSeriesChart = Object.assign(TimeSeriesChartRoot, {
  Skeleton: TimeSeriesChartSkeleton,
})
