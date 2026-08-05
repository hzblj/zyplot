'use client'

import type {EChartsType} from 'echarts/core'
import {useEffect, useRef} from 'react'
import {chartEasing} from '../option'
import type {
  ChartInteractionPhase,
  ChartRendererEvent,
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
  onInteraction?: (event: ChartRendererEvent) => void
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
    let dimFrame: number | null = null
    let dimValue = 1
    let lit: number | null = null

    /**
     * How far the lighting has come up, which is how far the rest of the trace has stepped back. The
     * lit stroke walks to the trace's own colour as the step back comes up, so the reading it belongs
     * to can be let go of at the end of the ramp without anything showing.
     */
    const litStrength = () => {
      const dimOpacity = configRef.current?.interaction?.dimOpacity
      if (dimOpacity === undefined || dimOpacity >= 1) {
        return 1
      }

      return Math.min(1, Math.max(0, (1 - dimValue) / (1 - dimOpacity)))
    }

    const drawn = (isScrubbing: boolean) => {
      const current = configRef.current
      const plot = current ? readPlotRect(instance) : null
      if (!current || !plot) {
        return null
      }

      return {
        annotations: current.annotations ?? [],
        isScrubbing,
        litStrength: litStrength(),
        marks: current.marks,
        plot,
        style: overlayStyle(current),
      }
    }

    /**
     * Ramps the trace towards `dimOpacity` a frame at a time. ECharts does not transition a style
     * merged into a live series, so the steps are made here — from wherever the last one got to,
     * which is what keeps a finger that lands and lifts again from snapping.
     */
    const rampDim = (from: number, to: number, duration: number) => {
      if (dimFrame !== null) {
        cancelAnimationFrame(dimFrame)
        dimFrame = null
      }

      const seriesId = configRef.current?.seriesId
      const started = performance.now()
      const step = () => {
        dimFrame = null
        const elapsed = (performance.now() - started) / duration
        const progress = elapsed >= 1 ? 1 : elapsed
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
        dimValue = from + (to - from) * eased
        instance.setOption({series: [{id: seriesId, lineStyle: {opacity: dimValue}}]})
        const layer = drawn(selectedRef.current !== null)
        if (layer) {
          overlay.drawLighting(selectedRef.current ?? lit, layer)
        }
        if (progress < 1) {
          dimFrame = requestAnimationFrame(step)
        }
      }

      step()
    }

    const patchScrubState = (isScrubbing: boolean) => {
      const current = configRef.current
      if (!current) {
        return
      }

      const patch: Record<string, unknown> = {id: current.seriesId}
      const dimOpacity = current.interaction?.dimOpacity
      const dims = current.markerTarget === 'line' && dimOpacity !== undefined
      const duration = dims ? (current.interaction?.dimDuration ?? 0) : 0
      if (dims && duration <= 0) {
        patch.lineStyle = {opacity: isScrubbing ? dimOpacity : 1}
        dimValue = isScrubbing ? (dimOpacity as number) : 1
      }
      if (current.annotations?.some(item => item.type === 'line' || item.type === 'point')) {
        Object.assign(patch, current.annotationOption?.(isScrubbing) ?? {})
      }
      if (Object.keys(patch).length > 1) {
        instance.setOption({series: [patch]})
      }
      if (dims && duration > 0) {
        rampDim(dimValue, isScrubbing ? (dimOpacity as number) : 1, duration)
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
        lit = index
        // The step back is patched in first, so the lighting drawn under this reading is put up at
        // the strength the trace has actually reached rather than at the one it is leaving.
        if (previous === null) {
          patchScrubState(true)
        }
        const layer = drawn(true)
        if (layer) {
          if (previous === null) {
            overlay.drawAnnotations(layer)
          }
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
      if (dimFrame !== null) {
        window.cancelAnimationFrame(dimFrame)
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
