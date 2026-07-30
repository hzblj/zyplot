import {toCanvasColor} from '../color'
import type {ChartSeriesFill} from '../types'

const DEFAULT_DOT_SIZE = 1
const DEFAULT_SPACING = 4
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

  if (fill.pattern !== 'dots' || typeof document === 'undefined') {
    return {color, opacity, origin}
  }

  const ratio = typeof window === 'undefined' ? 1 : (window.devicePixelRatio ?? 1)
  const fadeTo = fill.fadeTo ?? 1
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
