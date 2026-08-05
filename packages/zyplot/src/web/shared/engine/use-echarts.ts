'use client'

import type {EChartsCoreOption, EChartsType} from 'echarts/core'
import {type RefObject, useEffect, useRef, useState} from 'react'
import type {ChartInteractionEvent} from '../types'

import {echarts, ensureEchartsRuntime} from './echarts-core'

export type ChartEngine = {
  containerRef: RefObject<HTMLDivElement | null>
  instance: EChartsType | null
  layoutVersion: number
}

/**
 * Raises the `globalout` a lifted finger never sends. ZRender turns `touchend` into a `mouseup`
 * alone — no `mouseout` behind it, and `touchcancel` it does not listen for at all — so a reading
 * taken by touch has no event to close it and the tooltip, the axis pointer and the scrub overlay
 * all stay up. Each of them already watches `globalout`, so one leave closes the lot.
 */
const watchTouchRelease = (instance: EChartsType, dom: HTMLElement) => {
  let frame: number | null = null

  /**
   * Next frame rather than now: a touch under the click delay makes ZRender fire a synthetic
   * `click` of its own, which would put the tooltip straight back up if the leave landed first.
   */
  const release = () => {
    frame ??= window.requestAnimationFrame(() => {
      frame = null
      if (!instance.isDisposed()) {
        instance.getZr().trigger('globalout', {zrByTouch: true})
      }
    })
  }

  // Captured on the way down, so nothing the canvas does to the event can keep it from arriving.
  dom.addEventListener('touchcancel', release, {capture: true})
  dom.addEventListener('touchend', release, {capture: true})

  return () => {
    dom.removeEventListener('touchcancel', release, {capture: true})
    dom.removeEventListener('touchend', release, {capture: true})
    if (frame !== null) {
      window.cancelAnimationFrame(frame)
    }
  }
}

export const useECharts = (option: EChartsCoreOption | null): ChartEngine => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<EChartsType | null>(null)
  const [instance, setInstance] = useState<EChartsType | null>(null)
  const [layoutVersion, setLayoutVersion] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    ensureEchartsRuntime()
    const created = echarts.init(container, undefined, {renderer: 'canvas'})
    instanceRef.current = created
    setInstance(created)

    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry || entry.contentRect.width === 0 || entry.contentRect.height === 0) {
        return
      }
      created.resize()
      setLayoutVersion(version => version + 1)
    })
    observer.observe(container)
    const stopTouchRelease = watchTouchRelease(created, container)

    return () => {
      stopTouchRelease()
      observer.disconnect()
      created.dispose()
      instanceRef.current = null
      setInstance(null)
    }
  }, [])

  useEffect(() => {
    const current = instanceRef.current
    if (!current || !option) {
      return
    }

    current.setOption(option, {replaceMerge: ['series']})
    setLayoutVersion(version => version + 1)
  }, [option])

  return {containerRef, instance, layoutVersion}
}

export const useChartHoverEvents = (
  instance: EChartsType | null,
  onInteraction?: (event: ChartInteractionEvent) => void,
  enabled = true
) => {
  const emitRef = useRef(onInteraction)
  emitRef.current = onInteraction

  useEffect(() => {
    if (!instance || !enabled) {
      return
    }

    /**
     * What was hit, and nothing about where. A form with no scrub layer reports no mark either, so
     * there was never a reading for a position to belong to — a view placed off one would have had
     * somewhere to sit and nothing to say.
     */
    const emit = (params: any) => {
      emitRef.current?.({
        category: typeof params?.name === 'string' ? params.name : undefined,
        seriesId: params?.seriesId,
        value: Array.isArray(params?.value) ? params.value.at(-1) : params?.value,
      })
    }

    instance.on('click', emit)
    instance.on('mouseover', emit)

    return () => {
      instance.off('click', emit)
      instance.off('mouseover', emit)
    }
  }, [enabled, instance])
}
