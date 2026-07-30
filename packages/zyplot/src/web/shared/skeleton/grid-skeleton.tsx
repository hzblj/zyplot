import type {FC} from 'react'
import {Skeleton} from '../primitives'

export const SkeletonGrid: FC<{columns?: number; rows?: number}> = ({columns = 8, rows = 5}) => (
  <div className="grid h-full w-full gap-[2px]" style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
    {Array.from({length: columns * rows}, (_value, index) => (
      <Skeleton className="size-full rounded-[2px]" key={index} style={{opacity: 0.35 + ((index * 37) % 60) / 100}} />
    ))}
  </div>
)
