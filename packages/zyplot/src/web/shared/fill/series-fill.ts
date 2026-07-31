import {fadeChartColor, toCanvasColor} from '../color'
import type {ChartSeriesFill} from '../types'

const DEFAULT_DOT_SIZE = 1
const DEFAULT_SPACING = 4

/**
 * A wash that thins downwards, from full strength at the top of the area to `fadeTo` of it at
 * the bottom. The ramp is a gradient over the filled shape, so the paint gathers under the
 * trace and lets go of the plot's floor instead of stopping dead against it.
 */
const fadingWash = (color: string, fadeTo: number) => ({
  colorStops: [
    {color: toCanvasColor(color), offset: 0},
    {color: fadeChartColor(color, fadeTo), offset: 1},
  ],
  type: 'linear' as const,
  x: 0,
  x2: 0,
  y: 0,
  y2: 1,
})
const tiles = new Map<string, HTMLCanvasElement>()

const dot = (paint: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  paint.beginPath()
  paint.arc(x, y, radius, 0, Math.PI * 2)
  paint.fill()
}

const dotTile = ({
  color,
  dotSize,
  fadeTo,
  height,
  ratio,
  spacing,
}: {
  color: string
  dotSize: number
  fadeTo: number
  height: number
  ratio: number
  spacing: number
}) => {
  const key = `${color}|${spacing}|${dotSize}|${fadeTo}|${height}|${ratio}`
  const cached = tiles.get(key)
  if (cached) {
    return cached
  }

  const step = Math.max(1, Math.round(spacing * ratio))
  const radius = Math.max(0.5, (dotSize * ratio) / 2)
  const canvas = document.createElement('canvas')
  canvas.width = step
  canvas.height = height > 0 ? Math.max(1, Math.round(height * ratio)) : step
  const paint = canvas.getContext('2d')

  if (paint) {
    paint.fillStyle = color
    if (height > 0) {
      for (let y = step / 2; y <= canvas.height; y += step) {
        paint.globalAlpha = 1 + (fadeTo - 1) * (y / canvas.height)
        dot(paint, step / 2, y, radius)
      }
    } else {
      dot(paint, step / 2, step / 2, radius)
    }
  }

  tiles.set(key, canvas)
  return canvas
}

export const buildSeriesAreaStyle = (
  fill: ChartSeriesFill | undefined,
  color: string,
  fillOpacity: number | undefined,
  plotHeight = 0
) => {
  if (!fill) {
    return undefined
  }

  const opacity = fillOpacity ?? 0.16
  const origin = fill.baseline
  const fadeTo = fill.fadeTo ?? 1

  if (fill.pattern !== 'dots') {
    return fadeTo >= 1 ? {color, opacity, origin} : {color: fadingWash(color, fadeTo), opacity, origin}
  }

  if (typeof document === 'undefined') {
    return {color, opacity, origin}
  }

  const ratio = typeof window === 'undefined' ? 1 : (window.devicePixelRatio ?? 1)
  const height = fadeTo < 1 ? plotHeight : 0
  const image = dotTile({
    color: toCanvasColor(color),
    dotSize: fill.dotSize ?? DEFAULT_DOT_SIZE,
    fadeTo,
    height,
    ratio,
    spacing: fill.spacing ?? DEFAULT_SPACING,
  })

  return {
    color: {
      image,
      repeat: (height > 0 ? 'repeat-x' : 'repeat') as 'repeat' | 'repeat-x',
      scaleX: 1 / ratio,
      scaleY: 1 / ratio,
    },
    opacity,
    origin,
  }
}
