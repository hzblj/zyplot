import type {FC} from 'react'
import {Skeleton} from '../shared/primitives'
import type {ChartSkeletonProps} from '../shared/types'
import {cn} from '../shared/utils'

/** Props for `Chart.Meter.Skeleton`. */
export type MeterBarSkeletonProps = ChartSkeletonProps & {
  /** How many rows to draw, since meters usually appear as a list. */
  count?: number
}

/** The placeholder for `Chart.Meter`: the label line above, the track below. */
export const MeterBarSkeleton: FC<MeterBarSkeletonProps> = ({className, count = 1}) => (
  <div aria-hidden className={cn('flex w-full flex-col gap-3', className)}>
    {Array.from({length: count}, (_value, index) => (
      <div className="flex w-full flex-col gap-1.5" key={index}>
        <div className="flex items-baseline justify-between gap-3">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    ))}
  </div>
)
