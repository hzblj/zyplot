import type {FC} from 'react'
import {Skeleton} from '../primitives'

const SWEEP_MASK = 'conic-gradient(from 225deg, #000 0deg 270deg, transparent 270deg)'
const RING_MASK =
  'radial-gradient(circle farthest-side at center, transparent calc(100% - 12px), #000 calc(100% - 12px))'

export const SkeletonArc: FC = () => (
  <div className="relative flex h-full w-full items-center justify-center">
    <div className="relative aspect-square" style={{height: '75%'}}>
      <div className="size-full" style={{maskImage: SWEEP_MASK}}>
        <Skeleton className="size-full rounded-full" style={{maskImage: RING_MASK}} />
      </div>
      <Skeleton className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-6 w-14" />
    </div>
  </div>
)
