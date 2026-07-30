import type {FC} from 'react'
import {Skeleton} from '../primitives'

export const SkeletonFunnel: FC<{count?: number}> = ({count = 5}) => (
  <div className="flex h-full w-full flex-col items-center justify-between gap-1.5">
    {Array.from({length: count}, (_value, index) => (
      <Skeleton className="h-full rounded-sm" key={index} style={{width: `${100 - index * 15}%`}} />
    ))}
  </div>
)
