import type {FC} from 'react'
import {Skeleton} from '../primitives'

export const SkeletonDots: FC<{count?: number}> = ({count = 32}) => (
  <div className="relative h-full w-full">
    {Array.from({length: count}, (_value, index) => (
      <Skeleton
        className="absolute size-2.5 rounded-full"
        key={index}
        style={{
          left: `${((index * 37) % 92) + 2}%`,
          opacity: 0.35 + ((index * 23) % 50) / 100,
          top: `${((index * 61) % 86) + 4}%`,
        }}
      />
    ))}
  </div>
)
