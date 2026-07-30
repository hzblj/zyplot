import type {EChartsType} from 'echarts/core'
import {graphic} from 'echarts/core'
import {isHiddenAnnotation} from '../../../shared/annotation-views'
import {fadeChartColor} from '../color'
import {CROSSHAIR_LABEL_LIFT, CROSSHAIR_LABEL_SIZE} from '../option'
import type {
  ChartCrosshairMode,
  ChartCrosshairStyle,
  ChartGlow,
  ChartPulse,
  ChartSelectionMarker,
  NativeChartAnnotation,
} from '../types'
import {type ChartPlotRect, slotWidth} from './scrub-geometry'

export type ChartScrubMark = {
  category?: string
  high?: number
  low?: number
  value: number | null
}

export type ChartMarkerTarget = 'line' | 'mark'

export type ScrubOverlayStyle = {
  axisColor: string
  color: string
  crosshair?: ChartCrosshairMode
  crosshairStyle?: ChartCrosshairStyle
  isSmooth?: boolean
  marker?: ChartSelectionMarker
  markerTarget: ChartMarkerTarget
  surfaceColor: string
  strokeWidth: number
  transition?: {duration: number; easing: OverlayEasing}
}

export type OverlayEasing = 'cubicIn' | 'cubicInOut' | 'cubicOut' | 'elasticOut' | 'linear'

export type ScrubOverlayInput = {
  annotations: readonly NativeChartAnnotation[]
  isScrubbing?: boolean
  marks: readonly ChartScrubMark[]
  plot: ChartPlotRect
  style: ScrubOverlayStyle
}

const PULSE = {duration: 450, interval: 1550, opacity: 0.9, scale: 2.2}
const DEFAULT_POINT_SIZE = 8
const DEFAULT_BADGE_SIZE = 18
const DEFAULT_SPAN = 2
const FRONT_Z = 20
/** Over the crosshair and the marks, so a rule reads as starting under its badge, not through it. */
const BADGE_Z = FRONT_Z + 2

type Timers = Set<number>

const glowStyle = (glow: ChartGlow | undefined, fallback: string) => {
  if (!glow) {
    return {}
  }

  return {
    shadowBlur: glow.radius ?? 6,
    shadowColor: fadeChartColor(glow.color ?? fallback, glow.opacity ?? 0.35),
  }
}

const startPulse = (
  ring: InstanceType<typeof graphic.Circle>,
  radius: number,
  pulse: ChartPulse,
  timers: Timers,
  fade = 1
) => {
  const duration = pulse.duration ?? PULSE.duration
  const interval = pulse.interval ?? PULSE.interval
  const scale = pulse.scale ?? PULSE.scale
  const opacity = (pulse.opacity ?? PULSE.opacity) * fade

  const bloom = () => {
    ring.stopAnimation()
    ring.attr({shape: {r: radius}, style: {opacity}})
    ring.animateTo(
      {shape: {r: radius * scale}, style: {opacity: 0}},
      {
        done: () => {
          const timer = window.setTimeout(() => {
            timers.delete(timer)
            bloom()
          }, interval)
          timers.add(timer)
        },
        duration,
        easing: 'cubicOut',
      }
    )
  }

  bloom()
}

const annotationFade = (scrubOpacity: number | undefined, isScrubbing: boolean | undefined): number =>
  isScrubbing ? (scrubOpacity ?? 1) : 1

const pinnedLabelCentre = (centre: number, labelWidth: number, extent: number): number => {
  const half = labelWidth / 2

  return Math.min(Math.max(centre, half), Math.max(half, extent - half))
}

const pixelAt = (instance: EChartsType, index: number, value: number): number[] | null => {
  const point = instance.convertToPixel({seriesIndex: 0}, [index, value])
  if (!Array.isArray(point) || point.some(part => !Number.isFinite(part))) {
    return null
  }

  return point as number[]
}

export const createScrubOverlay = (instance: EChartsType) => {
  const marks = new graphic.Group({silent: true})
  const decorations = new graphic.Group({silent: true})
  const timers: Timers = new Set()
  const zr = instance.getZr()
  zr.add(decorations)
  zr.add(marks)

  const clearTimers = () => {
    for (const timer of timers) {
      window.clearTimeout(timer)
    }
    timers.clear()
  }

  const placed = new Map<string, {cx: number; cy: number; plot: string}>()
  const plotKey = (plot: ChartPlotRect) => `${plot.x}|${plot.y}|${plot.width}|${plot.height}`

  const travelling = (id: string, cx: number, cy: number, plot: ChartPlotRect, style: ScrubOverlayStyle) => {
    const group = new graphic.Group({silent: true})
    decorations.add(group)
    const from = placed.get(id)
    const key = plotKey(plot)
    placed.set(id, {cx, cy, plot: key})

    const travel = style.transition
    if (!travel || travel.duration <= 0 || !from || from.plot !== key) {
      return group
    }
    if (from.cx === cx && from.cy === cy) {
      return group
    }
    group.x = from.cx - cx
    group.y = from.cy - cy
    group.animateTo({x: 0, y: 0}, {duration: travel.duration, easing: travel.easing})

    return group
  }

  const drawPoint = (
    item: Extract<NativeChartAnnotation, {type: 'point'}>,
    plot: ChartPlotRect,
    style: ScrubOverlayStyle,
    fade: number
  ) => {
    const point = instance.convertToPixel({seriesIndex: 0}, [item.x as number, item.y])
    if (!Array.isArray(point) || point.some(part => !Number.isFinite(part))) {
      return
    }

    const [cx, cy] = point as number[]
    if (cx === undefined || cy === undefined || cx < plot.x - 1 || cx > plot.x + plot.width + 1) {
      return
    }

    const color = item.color ?? '#ffffff'
    const radius = (item.size ?? DEFAULT_POINT_SIZE) / 2
    const ringRadius = (item.halo?.size ?? item.size ?? DEFAULT_POINT_SIZE) / 2
    const target = travelling(item.id, cx, cy, plot, style)

    if (item.halo) {
      target.add(
        new graphic.Circle({
          shape: {cx, cy, r: ringRadius},
          silent: true,
          style: {fill: fadeChartColor(item.halo.color ?? color, item.halo.opacity ?? 1), opacity: fade},
          z: FRONT_Z,
        })
      )
    }

    if (item.pulse) {
      const pulse = item.pulse === true ? {} : item.pulse
      const ring = new graphic.Circle({
        shape: {cx, cy, r: ringRadius},
        silent: true,
        style: {
          fill: 'transparent',
          lineWidth: 1.5,
          stroke: pulse.color ?? item.glow?.color ?? color,
        },
        z: FRONT_Z,
      })
      target.add(ring)
      startPulse(ring, ringRadius, pulse, timers, fade)
    }

    target.add(
      new graphic.Circle({
        shape: {cx, cy, r: radius},
        silent: true,
        style: {fill: color, opacity: fade, ...glowStyle(item.glow, color)},
        z: FRONT_Z,
      })
    )
  }

  const drawBadge = (
    item: Extract<NativeChartAnnotation, {type: 'line'}>,
    plot: ChartPlotRect,
    style: ScrubOverlayStyle,
    fade: number
  ) => {
    if (!item.badge) {
      return
    }

    const finder = item.axis === 'x' ? {xAxisIndex: 0} : {yAxisIndex: 0}
    const pixel = instance.convertToPixel(finder, item.value as number)
    if (typeof pixel !== 'number' || !Number.isFinite(pixel)) {
      return
    }

    const size = item.size ?? DEFAULT_BADGE_SIZE
    // Held a radius inside the plot edge, the way iOS and Android hold it: centred on the edge
    // itself, half the circle would fall outside the canvas and the glyph would read as clipped.
    const cx = item.axis === 'x' ? pixel : plot.x + plot.width - size / 2
    const cy = item.axis === 'x' ? plot.y + size / 2 : pixel
    const color = item.color ?? style.axisColor
    const target = travelling(item.id, cx, cy, plot, style)

    target.add(
      new graphic.Circle({shape: {cx, cy, r: size / 2}, silent: true, style: {fill: color, opacity: fade}, z: BADGE_Z})
    )
    target.add(
      new graphic.Text({
        silent: true,
        style: {
          align: 'center',
          fill: style.surfaceColor,
          fontSize: Math.round(size * 0.58),
          fontWeight: 600,
          opacity: fade,
          text: item.badge,
          verticalAlign: 'middle',
          x: cx,
          y: cy,
        },
        z: BADGE_Z,
      })
    )
  }

  const drawAnnotations = ({annotations, isScrubbing, plot, style}: ScrubOverlayInput) => {
    clearTimers()
    decorations.removeAll()

    for (const item of annotations) {
      if (isHiddenAnnotation(item)) {
        continue
      }
      if (item.type === 'point') {
        drawPoint(item, plot, style, annotationFade(item.scrubOpacity, isScrubbing))
      }
      if (item.type === 'line') {
        drawBadge(item, plot, style, annotationFade(item.scrubOpacity, isScrubbing))
      }
    }

    zr.refresh()
  }

  const drawCrosshair = (x: number, y: number, plot: ChartPlotRect, style: ScrubOverlayStyle, index: number) => {
    const mode = style.crosshair ?? 'x'
    if (mode === 'none') {
      return
    }

    const line = {
      lineDash: style.crosshairStyle?.dash as number[] | undefined,
      lineWidth: style.crosshairStyle?.width ?? 1,
      stroke: style.crosshairStyle?.color ?? style.axisColor,
    }

    if (mode === 'x' || mode === 'both') {
      marks.add(
        new graphic.Line({
          shape: {x1: x, x2: x, y1: plot.y, y2: plot.y + plot.height},
          silent: true,
          style: line,
          z: FRONT_Z,
        })
      )
    }
    if (mode === 'y' || mode === 'both') {
      marks.add(
        new graphic.Line({
          shape: {x1: plot.x, x2: plot.x + plot.width, y1: y, y2: y},
          silent: true,
          style: line,
          z: FRONT_Z,
        })
      )
    }

    const label = style.crosshairStyle?.labels?.[index]
    if (label === undefined) {
      return
    }

    const size = style.crosshairStyle?.labelSize ?? CROSSHAIR_LABEL_SIZE
    const text = new graphic.Text({
      silent: true,
      style: {
        align: 'center',
        fill: style.crosshairStyle?.labelColor ?? style.axisColor,
        fontSize: size,
        fontWeight: 500,
        text: label,
        verticalAlign: 'top',
        x,
        y: Math.max(0, plot.y - CROSSHAIR_LABEL_LIFT - size),
      },
      z: FRONT_Z,
    })
    const centre = pinnedLabelCentre(x, text.getBoundingRect().width, instance.getWidth())
    if (centre !== x) {
      text.attr({style: {x: centre}})
    }
    marks.add(text)
  }

  const drawSegment = (index: number, input: ScrubOverlayInput, marker: ChartSelectionMarker) => {
    const isTrail = marker.style === 'trail'
    const from = isTrail ? 0 : index - (marker.span ?? DEFAULT_SPAN)
    const to = isTrail ? index : index + (marker.span ?? DEFAULT_SPAN)
    const points: number[][] = []

    for (let step = from; step <= to; step += 1) {
      const value = input.marks[step]?.value
      if (value === undefined || value === null) {
        continue
      }
      const point = pixelAt(instance, step, value)
      if (point) {
        points.push(point)
      }
    }

    if (points.length < 2) {
      return
    }

    marks.add(
      new graphic.Polyline({
        shape: {points, smooth: input.style.isSmooth ? 0.35 : 0},
        silent: true,
        style: {
          fill: 'none',
          lineCap: 'round',
          lineWidth: input.style.strokeWidth,
          stroke: marker.color ?? input.style.color,
          ...glowStyle(marker.glow, input.style.color),
        },
        z: FRONT_Z,
      })
    )
  }

  const drawMarkGlow = (index: number, input: ScrubOverlayInput, marker: ChartSelectionMarker) => {
    const mark = input.marks[index]
    const high = mark?.high ?? mark?.value
    const low = mark?.low ?? mark?.value
    if (high === undefined || high === null || low === undefined || low === null || !marker.glow) {
      return
    }

    const top = pixelAt(instance, index, high)
    const bottom = pixelAt(instance, index, low)
    if (!top || !bottom || top[0] === undefined || top[1] === undefined || bottom[1] === undefined) {
      return
    }

    const color = marker.glow.color ?? input.style.color
    const spread = marker.glow.radius ?? 6
    const half = (slotWidth(input.plot, input.marks.length) * (marker.span ?? 1)) / 2 + spread
    const height = Math.max(1, bottom[1] - top[1]) + spread * 2

    marks.add(
      new graphic.Rect({
        shape: {height, width: half * 2, x: top[0] - half, y: top[1] - spread},
        silent: true,
        style: {
          fill: new graphic.RadialGradient(0.5, 0.5, 0.5, [
            {color: fadeChartColor(color, marker.glow.opacity ?? 0.3), offset: 0},
            {color: fadeChartColor(color, 0), offset: 1},
          ]),
        },
        z: FRONT_Z - 1,
      })
    )
  }

  const drawSelection = (index: number | null, input: ScrubOverlayInput) => {
    marks.removeAll()

    const value = index === null ? null : input.marks[index]?.value
    if (index !== null && value !== null && value !== undefined) {
      const point = pixelAt(instance, index, value)
      if (point && point[0] !== undefined && point[1] !== undefined) {
        drawCrosshair(point[0], point[1], input.plot, input.style, index)
      }

      const marker = input.style.marker
      if (marker && marker.style !== 'point') {
        if (input.style.markerTarget === 'line') {
          drawSegment(index, input, marker)
        } else {
          drawMarkGlow(index, input, marker)
        }
      }
    }

    zr.refresh()
  }

  const dispose = () => {
    clearTimers()
    decorations.removeAll()
    marks.removeAll()
    zr.remove(decorations)
    zr.remove(marks)
  }

  return {dispose, drawAnnotations, drawSelection}
}

export type ScrubOverlay = ReturnType<typeof createScrubOverlay>
