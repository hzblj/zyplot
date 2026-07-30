'use client'

import type {EChartsType} from 'echarts/core'
import {useEffect, useRef} from 'react'
import {type ChartRevealPlan, REVEAL_FLASH_ID} from './reveal-series'
import {runChartTween} from './reveal-tween'

const LIFT = 220

export const useChartReveal = (
  instance: EChartsType | null,
  plan: ChartRevealPlan | null,
  isReady = true,
  onSettled?: () => void
) => {
  const planRef = useRef(plan)
  const settledRef = useRef(onSettled)
  const hasRunRef = useRef(false)
  planRef.current = plan
  settledRef.current = onSettled

  useEffect(() => {
    const current = planRef.current
    if (!instance || !current || !isReady || hasRunRef.current || current.style === 'none') {
      return
    }
    hasRunRef.current = true

    const stops: (() => void)[] = []
    const timers: number[] = []
    const patch = (series: Record<string, unknown>) =>
      instance.setOption({series: [{animationDurationUpdate: 0, ...series}]})

    const after = (wait: number, run: () => void) => timers.push(window.setTimeout(run, Math.max(0, wait)))

    if (current.style === 'fade') {
      after(current.delay, () => {
        stops.push(
          runChartTween(current.duration, current.easing, progress => {
            patch({id: current.mainId, lineStyle: {opacity: progress}})
            if (progress === 1) {
              settledRef.current?.()
            }
          })
        )
      })
    }

    if (current.style === 'draw') {
      const landed = current.delay + current.duration
      const start = current.startOpacity

      if (start !== undefined && start < 1) {
        after(landed, () => {
          stops.push(
            runChartTween(LIFT, 'ease-out', progress =>
              patch({id: current.mainId, lineStyle: {opacity: start + (1 - start) * progress}})
            )
          )
        })
      }

      const flash = current.flash
      if (flash) {
        after(landed + flash.hold, () => {
          stops.push(
            runChartTween(flash.decay, flash.easing, progress => {
              patch({
                id: REVEAL_FLASH_ID,
                lineStyle: {
                  opacity: flash.opacity * (1 - progress),
                  shadowBlur: flash.peak + (flash.rest - flash.peak) * progress,
                },
              })
              if (progress === 1) {
                settledRef.current?.()
              }
            })
          )
        })
      } else {
        after(landed + LIFT, () => settledRef.current?.())
      }
    }

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer)
      }
      for (const stop of stops) {
        stop()
      }
    }
  }, [instance, isReady])
}
