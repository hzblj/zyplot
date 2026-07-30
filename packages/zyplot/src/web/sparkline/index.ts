import {Sparkline as SparklineRoot} from './sparkline'
import {SparklineSkeleton} from './sparkline-skeleton'

export type {SparklineProps} from './sparkline'
export type {SparklineSkeletonProps} from './sparkline-skeleton'

/** `Chart.Sparkline`, with its loading placeholder at `Chart.Sparkline.Skeleton`. */
export const Sparkline = Object.assign(SparklineRoot, {
  Skeleton: SparklineSkeleton,
})
