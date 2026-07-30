'use client'

import type {EChartsType} from 'echarts/core'
import {useEffect, useRef} from 'react'
import {chartEasing} from '../option'
import type {
  ChartInteractionEvent,
  ChartInteractionPhase,
  NativeChartAnimation,
  NativeChartAnnotation,
  NativeChartInteraction,
} from '../types'
import {chartGeometryEvent, chartRootOffset, indexFromPixel, readPlotRect} from './scrub-geometry'
import {
  type ChartMarkerTarget,
  type ChartScrubMark,
  createScrubOverlay,
  type ScrubOverlay,
  type ScrubOverlayStyle,
} from './scrub-overlay'

export type ChartScrubConfig = {
  animation?: NativeChartAnimation
  annotationOption?: (isScrubbing: boolean) => Record<string, unknown>
  annotations?: readonly NativeChartAnnotation[]
  color: string
  interaction?: NativeChartInteraction
  isSmooth?: boolean
  marks: readonly ChartScrubMark[]
  markerTarget: ChartMarkerTarget
  seriesId: string
  strokeWidth: number
  tokens: {axis: string; surface: string}
}

const lastReadable = (marks: readonly ChartScrubMark[]): number => {
  for (let index = marks.length - 1; index >= 0; index -= 1) {
    const value = marks[index]?.value
    if (value !== null && value !== undefined) {
      return index
    }
  }

  return -1
}

const overlayStyle = (config: ChartScrubConfig): ScrubOverlayStyle => ({
  axisColor: config.tokens.axis,
  color: config.color,
  crosshair: config.interaction?.crosshair,
  crosshairStyle: config.interaction?.crosshairStyle,
  isSmooth: config.isSmooth,
  marker: config.interaction?.marker,
  markerTarget: config.markerTarget,
  strokeWidth: config.strokeWidth,
  surfaceColor: config.tokens.surface,
  transition: {
    duration:
      config.animation?.enabled === false || config.animation?.updates === false
        ? 0
        : (config.animation?.duration ?? 320),
    easing: chartEasing(config.animation?.easing),
  },
})

export const useChartScrubLayer = (
  instance: EChartsType | null,
  layoutVersion: number,
  config: ChartScrubConfig | undefined,
  onInteraction?: (event: ChartInteractionEvent) => void
) => {
  const configRef = useRef(config)
  const emitRef = useRef(onInteraction)
  const selectedRef = useRef<number | null>(null)
  const overlayRef = useRef<ScrubOverlay | null>(null)
  const patchRef = useRef<((isScrubbing: boolean) => void) | null>(null)

  configRef.current = config
  emitRef.current = onInteraction
  const isActive = Boolean(config)

  useEffect(() => {
    if (!instance || !isActive) {
      return
    }

    const overlay = createScrubOverlay(instance)
    overlayRef.current = overlay
    let frame: number | null = null
    let pending: {x: number; y: number} | null = null

    const drawn = (isScrubbing: boolean) => {
      const current = configRef.current
      const plot = current ? readPlotRect(instance) : null
      if (!current || !plot) {
        return null
      }

      return {
        annotations: current.annotations ?? [],
        isScrubbing,
        marks: current.marks,
        plot,
        style: overlayStyle(current),
      }
    }

    const patchScrubState = (isScrubbing: boolean) => {
      const current = configRef.current
      if (!current) {
        return
      }

      const patch: Record<string, unknown> = {id: current.seriesId}
      const dimOpacity = current.interaction?.dimOpacity
      if (current.markerTarget === 'line' && dimOpacity !== undefined) {
        patch.lineStyle = {opacity: isScrubbing ? dimOpacity : 1}
      }
      if (current.annotations?.some(item => item.type === 'line' || item.type === 'point')) {
        Object.assign(patch, current.annotationOption?.(isScrubbing) ?? {})
      }
      if (Object.keys(patch).length > 1) {
        instance.setOption({series: [patch]})
      }
    }

    patchRef.current = patchScrubState

    const select = (index: number | null, point: {x: number; y: number} | null) => {
      const current = configRef.current
      const previous = selectedRef.current
      if (!current) {
        return
      }

      if (index === null) {
        if (previous === null) {
          return
        }
        selectedRef.current = null
        const layer = drawn(false)
        if (layer) {
          overlay.drawSelection(null, layer)
          overlay.drawAnnotations(layer)
        }
        if (current.markerTarget === 'mark') {
          instance.dispatchAction({seriesId: current.seriesId, type: 'downplay'})
        }
        patchScrubState(false)
        emitRef.current?.({phase: 'ended'})
        return
      }

      if (index !== previous) {
        selectedRef.current = index
        const layer = drawn(true)
        if (previous === null) {
          patchScrubState(true)
          if (layer) {
            overlay.drawAnnotations(layer)
          }
        }
        if (layer) {
          overlay.drawSelection(index, layer)
        }
        if (current.markerTarget === 'mark') {
          instance.dispatchAction({seriesId: current.seriesId, type: 'downplay'})
          instance.dispatchAction({dataIndex: index, seriesId: current.seriesId, type: 'highlight'})
        }
      }

      const offset = chartRootOffset(instance)
      const phase: ChartInteractionPhase = previous === null ? 'began' : 'changed'
      emitRef.current?.({
        category: current.marks[index]?.category,
        index,
        nativeX: point === null ? undefined : point.x + offset.x,
        nativeY: point === null ? undefined : point.y + offset.y,
        phase,
        value: current.marks[index]?.value ?? undefined,
      })
    }

    const read = () => {
      frame = null
      const current = configRef.current
      const plot = readPlotRect(instance)
      if (!current || !plot || !pending) {
        return
      }

      const found = indexFromPixel(instance, plot, pending, current.marks.length)
      const stop = lastReadable(current.marks)
      if (found === null || stop < 0) {
        select(null, null)
        return
      }

      select(Math.min(found, stop), pending)
    }

    const onMove = (event: {offsetX?: number; offsetY?: number}) => {
      pending = {x: event.offsetX ?? 0, y: event.offsetY ?? 0}
      frame ??= window.requestAnimationFrame(read)
    }

    const onLeave = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
        frame = null
      }
      pending = null
      select(null, null)
    }

    const zr = instance.getZr()
    zr.on('mousemove', onMove)
    zr.on('globalout', onLeave)

    return () => {
      zr.off('mousemove', onMove)
      zr.off('globalout', onLeave)
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
      selectedRef.current = null
      overlayRef.current = null
      patchRef.current = null
      overlay.dispose()
    }
  }, [instance, isActive])

  useEffect(() => {
    const overlay = overlayRef.current
    if (!instance || !config || !overlay || layoutVersion === 0) {
      return
    }

    const plot = readPlotRect(instance)
    if (!plot) {
      return
    }

    const layer = {
      annotations: config.annotations ?? [],
      isScrubbing: selectedRef.current !== null,
      marks: config.marks,
      plot,
      style: overlayStyle(config),
    }
    overlay.drawAnnotations(layer)
    overlay.drawSelection(selectedRef.current, layer)

    if (selectedRef.current !== null) {
      patchRef.current?.(true)
    }

    emitRef.current?.({
      geometry: chartGeometryEvent(instance, config.annotations ?? [], plot),
      phase: 'layout',
    })
  }, [config, instance, layoutVersion])
}
