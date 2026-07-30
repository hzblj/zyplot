import type {FC} from 'react'
import {Skeleton} from '../primitives'
import {waveAt} from './helpers'

export const SkeletonBoxplot: FC<{count?: number}> = ({count = 5}) => (
  <div className="flex h-full w-full items-center justify-around gap-2">
    {Array.from({length: count}, (_value, index) => {
      const boxHeight = 34 + waveAt(index, 2.1) * 30
      const whisker = boxHeight + 26

      return (
        <div className="relative flex h-full w-full max-w-9 items-center justify-center" key={index}>
          <Skeleton className="w-0.5 rounded-full" style={{height: `${whisker}%`}} />
          <Skeleton className="absolute w-full rounded-sm" style={{height: `${boxHeight}%`}} />
        </div>
      )
    })}
  </div>
)
