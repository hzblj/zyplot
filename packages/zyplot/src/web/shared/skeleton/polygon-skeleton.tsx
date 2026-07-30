import type {FC} from 'react'
import {Skeleton} from '../primitives'

export const SkeletonPolygon: FC = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Skeleton className="aspect-square h-full [clip-path:polygon(50%_0%,95%_35%,78%_90%,22%_90%,5%_35%)]" />
  </div>
)
