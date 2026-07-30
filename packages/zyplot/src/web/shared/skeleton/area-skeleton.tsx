import type {FC} from 'react'
import {Skeleton} from '../primitives'
import {LINE_SEEDS, LINE_VERTICES} from './helpers'

export const SkeletonArea: FC<{count?: number}> = ({count = 1}) => (
  <div className="relative h-full w-full">
    {Array.from({length: count}, (_value, index) => {
      const seed = LINE_SEEDS[index % LINE_SEEDS.length] ?? 1
      const vertices = Array.from({length: LINE_VERTICES}, (_v, vertexIndex) => {
        const x = (vertexIndex / (LINE_VERTICES - 1)) * 100
        const y = 30 + index * 16 + Math.sin(vertexIndex * seed) * 13
        return `${x.toFixed(1)}% ${y.toFixed(1)}%`
      })

      return (
        <Skeleton
          className="absolute inset-0 rounded-none"
          key={index}
          style={{
            clipPath: `polygon(${[...vertices, '100% 100%', '0% 100%'].join(', ')})`,
            opacity: 0.55 - index * 0.12,
          }}
        />
      )
    })}
  </div>
)
