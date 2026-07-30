'use client'

import {type FC, type ReactNode, useEffect, useRef, useState} from 'react'

import {cn} from '../utils'

type ChartRevealProps = {
  children: ReactNode
  className?: string
  isPending: boolean
  skeleton?: ReactNode
}

const useSettledReveal = (isPending: boolean): boolean => {
  const [hasSettled, setHasSettled] = useState(false)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (isPending) {
      setHasSettled(false)

      return
    }

    frameRef.current = requestAnimationFrame(() => setHasSettled(true))

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [isPending])

  return hasSettled
}

const FADE = 'motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out'

export const ChartReveal: FC<ChartRevealProps> = ({children, className, isPending, skeleton}) => {
  const hasSettled = useSettledReveal(isPending)
  let skeletonState = 'pointer-events-none opacity-0'
  if (isPending) {
    skeletonState = 'opacity-100'
  }

  let plotState = 'opacity-0'
  if (hasSettled) {
    plotState = 'opacity-100'
  }

  return (
    <div aria-busy={isPending} className={cn('grid w-full grid-cols-1 grid-rows-1', className)} data-zyplot-chart="">
      {skeleton && <div className={cn('col-start-1 row-start-1', FADE, skeletonState)}>{skeleton}</div>}
      <div className={cn('col-start-1 row-start-1 flex w-full flex-col gap-3', FADE, plotState)}>{children}</div>
    </div>
  )
}
