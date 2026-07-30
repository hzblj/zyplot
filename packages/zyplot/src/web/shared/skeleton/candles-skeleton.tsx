import type {FC} from 'react'
import {Skeleton} from '../primitives'
import {waveAt} from './helpers'

const BODY_MIN = 14
const BODY_SWING = 20
const WICK_MARGIN = 16
const EDGE = 8

export const SkeletonCandles: FC<{count?: number}> = ({count = 12}) => (
  <div className="flex h-full w-full items-center justify-around gap-1.5">
    {Array.from({length: count}, (_value, index) => {
      const body = BODY_MIN + waveAt(index, 1.9) * BODY_SWING
      const wick = body + WICK_MARGIN
      const top = EDGE + waveAt(index, 0.85) * Math.max(0, 100 - wick - EDGE * 2)

      return (
        <div className="relative h-full w-full max-w-5" key={index}>
          <Skeleton
            className="absolute left-1/2 w-0.5 -translate-x-1/2 rounded-full"
            style={{height: `${wick}%`, top: `${top}%`}}
          />
          <Skeleton
            className="absolute left-0 w-full rounded-sm"
            style={{height: `${body}%`, top: `${top + WICK_MARGIN / 2}%`}}
          />
        </div>
      )
    })}
  </div>
)
