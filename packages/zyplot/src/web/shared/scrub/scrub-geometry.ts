import type {EChartsType} from 'echarts/core'
import type {ChartAnnotationGeometry, ChartGeometry, NativeChartAnnotation} from '../types'

export type ChartPlotRect = {height: number; width: number; x: number; y: number}

type GridModel = {
  coordinateSystem?: {getRect?: () => ChartPlotRect}
}

type ModelHost = {
  getModel?: () => {getComponent?: (mainType: string, index: number) => GridModel | undefined}
}

const resolveInset = (value: unknown, extent: number, fallback: number): number => {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string' && value.endsWith('%')) {
    const share = Number.parseFloat(value)
    return Number.isNaN(share) ? fallback : (share / 100) * extent
  }
  return fallback
}

const rectFromOption = (instance: EChartsType): ChartPlotRect | null => {
  const option = instance.getOption() as {grid?: unknown} | undefined
  const grid = Array.isArray(option?.grid) ? option.grid[0] : option?.grid
  if (!grid || typeof grid !== 'object') {
    return null
  }

  const box = grid as Record<string, unknown>
  const width = instance.getWidth()
  const height = instance.getHeight()
  const left = resolveInset(box.left, width, 0)
  const right = resolveInset(box.right, width, 0)
  const top = resolveInset(box.top, height, 0)
  const bottom = resolveInset(box.bottom, height, 0)

  return {height: height - top - bottom, width: width - left - right, x: left, y: top}
}

export const readPlotRect = (instance: EChartsType): ChartPlotRect | null => {
  const grid = (instance as unknown as ModelHost).getModel?.()?.getComponent?.('grid', 0)
  const rect = grid?.coordinateSystem?.getRect?.()
  if (rect && rect.width > 0 && rect.height > 0) {
    return {height: rect.height, width: rect.width, x: rect.x, y: rect.y}
  }

  return rectFromOption(instance)
}

const pixelOnAxis = (instance: EChartsType, axis: 'x' | 'y', value: number | string): number | null => {
  const finder = axis === 'x' ? {xAxisIndex: 0} : {yAxisIndex: 0}
  const pixel = instance.convertToPixel(finder, value as number)

  return typeof pixel === 'number' && Number.isFinite(pixel) ? pixel : null
}

export const readAnnotationGeometry = (
  instance: EChartsType,
  annotations: readonly NativeChartAnnotation[],
  plot: ChartPlotRect
): ChartAnnotationGeometry[] =>
  annotations.flatMap(item => {
    if (item.type === 'line') {
      const pixel = pixelOnAxis(instance, item.axis, item.value)
      if (pixel === null) {
        return []
      }

      return item.axis === 'x'
        ? [{id: item.id, x: pixel, y: plot.y}]
        : [{id: item.id, x: plot.x + plot.width, y: pixel}]
    }

    if (item.type === 'point') {
      const point = instance.convertToPixel({seriesIndex: 0}, [item.x as number, item.y])
      if (!Array.isArray(point) || point.some(value => !Number.isFinite(value))) {
        return []
      }

      return [{id: item.id, x: point[0] as number, y: point[1] as number}]
    }

    return []
  })

export const slotWidth = (plot: ChartPlotRect, count: number): number => (count > 0 ? plot.width / count : 0)

export const chartRootOffset = (instance: EChartsType): {x: number; y: number} => {
  const canvas = instance.getDom()
  const root = canvas?.closest('[data-zyplot-chart]')
  if (!canvas || !root || root === canvas) {
    return {x: 0, y: 0}
  }

  const from = canvas.getBoundingClientRect()
  const to = root.getBoundingClientRect()

  return {x: from.left - to.left, y: from.top - to.top}
}

export const shiftRect = (rect: ChartPlotRect, offset: {x: number; y: number}): ChartPlotRect => ({
  height: rect.height,
  width: rect.width,
  x: rect.x + offset.x,
  y: rect.y + offset.y,
})

export const chartGeometryEvent = (
  instance: EChartsType,
  annotations: readonly NativeChartAnnotation[],
  plot: ChartPlotRect
): ChartGeometry => {
  const offset = chartRootOffset(instance)

  return {
    annotations: readAnnotationGeometry(instance, annotations, plot).map(item => ({
      id: item.id,
      x: item.x + offset.x,
      y: item.y + offset.y,
    })),
    plot: shiftRect(plot, offset),
  }
}

export const indexFromPixel = (
  instance: EChartsType,
  plot: ChartPlotRect,
  point: {x: number; y: number},
  count: number
): number | null => {
  if (count === 0 || point.x < plot.x || point.x > plot.x + plot.width) {
    return null
  }
  if (point.y < plot.y || point.y > plot.y + plot.height) {
    return null
  }

  const data = instance.convertFromPixel({seriesIndex: 0}, [point.x, point.y])
  const raw = Array.isArray(data) ? data[0] : data
  if (typeof raw !== 'number' || Number.isNaN(raw)) {
    return null
  }

  return Math.min(count - 1, Math.max(0, Math.round(raw)))
}
