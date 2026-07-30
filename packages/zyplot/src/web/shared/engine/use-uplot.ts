'use client'

import {type RefObject, useEffect, useRef} from 'react'
import uPlot from 'uplot'

export type UPlotSetup = {
  data: uPlot.AlignedData
  options: uPlot.Options
}

export const useUplot = (setup: UPlotSetup | null): RefObject<HTMLDivElement | null> => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<uPlot | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !setup) {
      return
    }

    const measured = container.getBoundingClientRect()
    const instance = new uPlot(
      {
        ...setup.options,
        height: Math.round(measured.height),
        width: Math.round(measured.width),
      },
      setup.data,
      container
    )
    instanceRef.current = instance

    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry || entry.contentRect.width === 0) {
        return
      }
      instance.setSize({
        height: Math.round(entry.contentRect.height),
        width: Math.round(entry.contentRect.width),
      })
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      instance.destroy()
      instanceRef.current = null
    }
  }, [setup])

  return containerRef
}
