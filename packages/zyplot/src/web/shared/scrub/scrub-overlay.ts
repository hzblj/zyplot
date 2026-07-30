import type {EChartsType} from 'echarts/core'
import {graphic} from 'echarts/core'
import {isHiddenAnnotation} from '../../../shared/annotation-views'
import {fadeChartColor} from '../color'
import type {
  ChartCrosshairMode,
  ChartCrosshairStyle,
  ChartGlow,
  ChartPulse,
  ChartSelectionMarker,
  NativeChartAnnotation,
} from '../types'
import {type ChartPlotRect, slotWidth} from './scrub-geometry'

/**
 * One slot's reading. `value` is what a crosshair and a line marker follow; `high` and
 * `low` are the band a mark occupies, which is what a candle needs.
 */
export type ChartScrubMark = {
  category?: string
  high?: number
  low?: number
  value: number | null
}

/** Where the read mark is: along a stroke, or a mark of its own the chart already lights. */
export type ChartMarkerTarget = 'line' | 'mark'

export type ScrubOverlayStyle = {
  /** The crosshair's colour when `crosshairStyle` gives none. */
  axisColor: string
  /** The read series' colour: what a glow blooms in unless told otherwise. */
  color: string
  crosshair?: ChartCrosshairMode
  crosshairStyle?: ChartCrosshairStyle
  isSmooth?: boolean
  marker?: ChartSelectionMarker
  markerTarget: ChartMarkerTarget
  /** The surface behind a badge's glyph. */
  surfaceColor: string
  strokeWidth: number
}

export type ScrubOverlayInput = {
  annotations: readonly NativeChartAnnotation[]
  marks: readonly ChartScrubMark[]
  plot: ChartPlotRect
  style: ScrubOverlayStyle
}

const PULSE = {duration: 450, interval: 1550, opacity: 0.9, scale: 2.2}
const DEFAULT_POINT_SIZE = 8
const DEFAULT_BADGE_SIZE = 18
const DEFAULT_SPAN = 2
const FRONT_Z = 20

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

/**
 * A ring that blooms out of a point and rests before doing it again. The shape's radius
 * is animated rather than the element's scale, so it stays centred on the point without
 * a transform origin to keep in step.
 */
const startPulse = (ring: InstanceType<typeof graphic.Circle>, radius: number, pulse: ChartPulse, timers: Timers) => {
  const duration = pulse.duration ?? PULSE.duration
  const interval = pulse.interval ?? PULSE.interval
  const scale = pulse.scale ?? PULSE.scale
  const opacity = pulse.opacity ?? PULSE.opacity

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

const pixelAt = (instance: EChartsType, index: number, value: number): number[] | null => {
  const point = instance.convertToPixel({seriesIndex: 0}, [index, value])
  if (!Array.isArray(point) || point.some(part => !Number.isFinite(part))) {
    return null
  }

  return point as number[]
}

/**
 * Everything drawn over the plot that ECharts has no option for: the crosshair, the lit
 * stretch of line under the pointer and its bloom, and the points, halos and pulses an
 * annotation asks for.
 *
 * Two layers, because they change at different rates. The annotation layer is rebuilt
 * only when the chart lays out — a pulse would restart on every pointer move otherwise —
 * and the selection layer on every move.
 */
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

  const drawPoint = (item: Extract<NativeChartAnnotation, {type: 'point'}>, plot: ChartPlotRect) => {
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
    /** The point's resting ring: its halo when it has one, otherwise the dot itself. */
    const ringRadius = (item.halo?.size ?? item.size ?? DEFAULT_POINT_SIZE) / 2

    if (item.halo) {
      decorations.add(
        new graphic.Circle({
          shape: {cx, cy, r: ringRadius},
          silent: true,
          style: {fill: fadeChartColor(item.halo.color ?? color, item.halo.opacity ?? 1)},
          z: FRONT_Z,
        })
      )
    }

    if (item.pulse) {
      const pulse = item.pulse === true ? {} : item.pulse
      const ring = new graphic.Circle({
        // Blooming from the resting ring rather than from the dot: a bloom that starts
        // inside the halo spends most of its travel underneath it and never reads.
        shape: {cx, cy, r: ringRadius},
        silent: true,
        style: {
          fill: 'transparent',
          lineWidth: 1.5,
          stroke: pulse.color ?? item.glow?.color ?? color,
        },
        z: FRONT_Z,
      })
      decorations.add(ring)
      startPulse(ring, ringRadius, pulse, timers)
    }

    decorations.add(
      new graphic.Circle({
        shape: {cx, cy, r: radius},
        silent: true,
        style: {fill: color, ...glowStyle(item.glow, color)},
        z: FRONT_Z,
      })
    )
  }

  const drawBadge = (
    item: Extract<NativeChartAnnotation, {type: 'line'}>,
    plot: ChartPlotRect,
    style: ScrubOverlayStyle
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
    const cx = item.axis === 'x' ? pixel : plot.x + plot.width
    const cy = item.axis === 'x' ? plot.y : pixel
    const color = item.color ?? style.axisColor

    decorations.add(new graphic.Circle({shape: {cx, cy, r: size / 2}, silent: true, style: {fill: color}, z: FRONT_Z}))
    decorations.add(
      new graphic.Text({
        silent: true,
        style: {
          align: 'center',
          fill: style.surfaceColor,
          fontSize: Math.round(size * 0.58),
          fontWeight: 600,
          text: item.badge,
          verticalAlign: 'middle',
          x: cx,
          y: cy,
        },
        z: FRONT_Z,
      })
    )
  }

  /** The annotations the chart draws itself rather than handing to ECharts. */
  const drawAnnotations = ({annotations, plot, style}: ScrubOverlayInput) => {
    clearTimers()
    decorations.removeAll()

    for (const item of annotations) {
      // Hidden ones are measured and reported like the rest; their pixels are the app's.
      if (isHiddenAnnotation(item)) {
        continue
      }
      if (item.type === 'point') {
        drawPoint(item, plot)
      }
      if (item.type === 'line') {
        drawBadge(item, plot, style)
      }
    }

    zr.refresh()
  }

  const drawCrosshair = (x: number, y: number, plot: ChartPlotRect, style: ScrubOverlayStyle) => {
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
  }

  /**
   * A lit stretch of the line, rather than one more dot on it. The span is drawn over the
   * dimmed stroke in the marker's colour, blooming in the series' own.
   */
  const drawSegment = (index: number, input: ScrubOverlayInput, marker: ChartSelectionMarker) => {
    const span = marker.span ?? DEFAULT_SPAN
    const points: number[][] = []

    for (let step = index - span; step <= index + span; step += 1) {
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

  /**
   * The bloom behind a mark the chart lights itself, such as a candle.
   *
   * A flat fill with a shadow around it reads as a box sitting behind the mark, however
   * soft its edges are. A radial gradient has no edge to read at all, which is what a light
   * source behind something looks like.
   */
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

  /** The crosshair and the marker, redrawn as the pointer moves. `null` clears them. */
  const drawSelection = (index: number | null, input: ScrubOverlayInput) => {
    marks.removeAll()

    const value = index === null ? null : input.marks[index]?.value
    if (index !== null && value !== null && value !== undefined) {
      const point = pixelAt(instance, index, value)
      if (point && point[0] !== undefined && point[1] !== undefined) {
        drawCrosshair(point[0], point[1], input.plot, input.style)
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
