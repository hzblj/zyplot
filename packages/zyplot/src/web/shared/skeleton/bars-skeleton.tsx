import type {FC} from 'react'
import {Skeleton} from '../primitives'
import {waveAt} from './helpers'

type SkeletonBarsProps = {
  count?: number
  orientation?: 'horizontal' | 'vertical'
  seed?: number
}

const BAR_FLOOR = 20
const BAR_SWING = 42

/**
 * How far up the plot a bar reaches. Kept well under the top of it, since an axis rounds its domain
 * up past the tallest bar — a placeholder that fills the plot is taller than the data that lands.
 */
const barLengthAt = (index: number, seed: number): number => BAR_FLOOR + Math.round(waveAt(index, seed) * BAR_SWING)

/**
 * One band per category, each holding a bar of the four fifths of it the category gap leaves and no
 * wider than `barMaxWidth` — which is how the bars that land are spaced, however many there are.
 */
export const SkeletonBars: FC<SkeletonBarsProps> = ({count = 8, orientation = 'vertical', seed = 1.7}) => {
  if (orientation === 'horizontal') {
    return (
      <div className="flex h-full w-full flex-col">
        {Array.from({length: count}, (_value, index) => (
          <div className="flex min-h-0 flex-1 items-center" key={index}>
            <Skeleton
              className="h-4/5 max-h-7 min-h-1 rounded-r-sm rounded-l-none"
              style={{width: `${barLengthAt(index, seed)}%`}}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-end">
      {Array.from({length: count}, (_value, index) => (
        <div className="flex h-full min-w-0 flex-1 items-end justify-center" key={index}>
          <Skeleton
            className="w-4/5 max-w-7 min-w-1 rounded-t-sm rounded-b-none"
            style={{height: `${barLengthAt(index, seed)}%`}}
          />
        </div>
      ))}
    </div>
  )
}
