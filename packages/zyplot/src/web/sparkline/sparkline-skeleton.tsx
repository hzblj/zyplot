import type {FC} from 'react'
import {Skeleton} from '../shared/primitives'
import type {ChartSkeletonProps} from '../shared/types'
import {cn} from '../shared/utils'

const DEFAULT_HEIGHT = 32

/** Props for `Chart.Sparkline.Skeleton`. */
export type SparklineSkeletonProps = ChartSkeletonProps

/**
 * The placeholder for `Chart.Sparkline`: a hairline, not a block, so the tile
 * around it does not jump when the trend arrives.
 */
export const SparklineSkeleton: FC<SparklineSkeletonProps> = ({className, height = DEFAULT_HEIGHT}) => (
  <div aria-hidden className={cn('flex w-full items-center', className)} style={{height}}>
    <Skeleton className="h-0.5 w-full rounded-full" />
  </div>
)
