import type {FC} from 'react'
import {Skeleton} from '../primitives'
import {LINE_SEEDS, LINE_VERTICES} from './helpers'

const buildJaggedBand = (seed: number, offset: number): string => {
  const vertices = Array.from({length: LINE_VERTICES}, (_value, index) => ({
    x: (index / (LINE_VERTICES - 1)) * 100,
    y: offset + Math.sin(index * seed) * 13 + Math.sin(index * seed * 2.7) * 6,
  }))
  const top = vertices.map(({x, y}) => `${x.toFixed(1)}% ${y.toFixed(1)}%`)
  const bottom = [...vertices].reverse().map(({x, y}) => `${x.toFixed(1)}% ${(y + 3.5).toFixed(1)}%`)

  return `polygon(${[...top, ...bottom].join(', ')})`
}

export const SkeletonLine: FC<{count?: number}> = ({count = 3}) => (
  <div className="relative h-full w-full">
    {Array.from({length: count}, (_value, index) => (
      <Skeleton
        className="absolute inset-0 rounded-none"
        key={index}
        style={{
          clipPath: buildJaggedBand(LINE_SEEDS[index % LINE_SEEDS.length] ?? 1, 24 + index * 22),
          opacity: 1 - index * 0.16,
        }}
      />
    ))}
  </div>
)
