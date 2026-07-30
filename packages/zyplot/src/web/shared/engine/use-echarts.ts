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

    return () => {
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

    const emit = (params: any) => {
      emitRef.current?.({
        category: typeof params?.name === 'string' ? params.name : undefined,
        nativeX: params?.event?.offsetX,
        nativeY: params?.event?.offsetY,
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
