'use client'

import type {EChartsType} from 'echarts/core'
import {useEffect, useRef} from 'react'
import type {
  ChartInteractionEvent,
  ChartInteractionPhase,
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

/** What a chart tells the pointer layer about the marks it drew. */
export type ChartScrubConfig = {
  /**
   * The chart's own annotation option, rebuilt when a scrub starts and ends so an
   * annotation that asked to step back while a mark is read can.
   */
  annotationOption?: (isScrubbing: boolean) => Record<string, unknown>
  /** Read for their geometry, and for the parts the overlay draws rather than ECharts. */
  annotations?: readonly NativeChartAnnotation[]
  /** The read series' colour: what a glow blooms in unless told otherwise. */
  color: string
  interaction?: NativeChartInteraction
  isSmooth?: boolean
  /** One entry per slot, in data order. */
  marks: readonly ChartScrubMark[]
  markerTarget: ChartMarkerTarget
  /** The series the dim and annotation patches apply to. */
  seriesId: string
  strokeWidth: number
  /** Token colours the overlay falls back to. */
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
})

/**
 * The pointer over a plot, reported as the same scrub the native renderers do: `'began'`,
 * `'changed'` and `'ended'` around one gesture, the datum's index with every one of them,
 * and the plot's box on `'layout'` so an app can place its own views over the chart.
 *
 * It also draws what a scrub looks like — the crosshair, the lit mark, the dimmed rest —
 * because the chart, not the app, is where that belongs.
 */
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

    const drawn = () => {
      const current = configRef.current
      const plot = current ? readPlotRect(instance) : null
      if (!current || !plot) {
        return null
      }

      return {annotations: current.annotations ?? [], marks: current.marks, plot, style: overlayStyle(current)}
    }

    /**
     * How the plot reads while one mark does: the rest of the data steps back, and any
     * annotation that asked to comes with it. Twice a gesture, not once a frame.
     */
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
        const layer = drawn()
        if (layer) {
          overlay.drawSelection(null, layer)
        }
        if (current.markerTarget === 'mark') {
          instance.dispatchAction({seriesId: current.seriesId, type: 'downplay'})
        }
        patchScrubState(false)
        emitRef.current?.({phase: 'ended'})
        return
      }

      if (previous === null) {
        patchScrubState(true)
      }
      if (index !== previous) {
        selectedRef.current = index
        const layer = drawn()
        if (layer) {
          overlay.drawSelection(index, layer)
        }
        if (current.markerTarget === 'mark') {
          // Downplay first: highlight adds to the set, so every mark the pointer passed
          // would otherwise stay lit behind it.
          instance.dispatchAction({seriesId: current.seriesId, type: 'downplay'})
          instance.dispatchAction({dataIndex: index, seriesId: current.seriesId, type: 'highlight'})
        }
      }

      // Reported in the chart's own space, the one an app's overlay is positioned in.
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
      overlay.dispose()
    }
  }, [instance, isActive])

  useEffect(() => {
    const overlay = overlayRef.current
    // Nothing has been measured before the first option is applied: no grid, no geometry.
    if (!instance || !config || !overlay || layoutVersion === 0) {
      return
    }

    const plot = readPlotRect(instance)
    if (!plot) {
      return
    }

    const layer = {
      annotations: config.annotations ?? [],
      marks: config.marks,
      plot,
      style: overlayStyle(config),
    }
    overlay.drawAnnotations(layer)
    overlay.drawSelection(selectedRef.current, layer)

    emitRef.current?.({
      geometry: chartGeometryEvent(instance, config.annotations ?? [], plot),
      phase: 'layout',
    })
  }, [config, instance, layoutVersion])
}
