'use client'

import {HeatmapChart as EChartsHeatmapChart} from 'echarts/charts'
import {VisualMapComponent} from 'echarts/components'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {
  buildCategoryAxis,
  buildChartBaseOption,
  buildChartGrid,
  buildChartTooltip,
  firstTooltipParam,
  renderChartTooltip,
} from '../shared/option'
import {skeletonAxis} from '../shared/skeleton'
import {useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartHeatmapCell, ChartNumberFormat} from '../shared/types'
import {HeatmapChartSkeleton} from './heatmap-chart-skeleton'

echarts.use([EChartsHeatmapChart, VisualMapComponent])

const CELL_GAP = 1

/** Props for `Chart.Heatmap`. */
export type HeatmapChartProps = ChartBaseProps & {
  cells: readonly ChartHeatmapCell[]
  columns: readonly string[]
  format?: ChartNumberFormat
  rows: readonly string[]
}

/**
 * Amounts across a grid, such as product by week. Colour is one hue running light
 * to dark, because a heatmap encodes size and never identity.
 */
export const HeatmapChart: FC<HeatmapChartProps> = ({
  animation,
  axis,
  cells,
  className,
  columns,
  format,
  height,
  isLoading,
  rows,
  texture,
  theme,
}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    const present = cells.filter(cell => cell.value !== null)
    const values = present.map(cell => cell.value as number)
    const min = Math.min(...values)
    const max = Math.max(...values)

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      grid: buildChartGrid({}),
      series: [
        {
          data: present.map(cell => [cell.columnIndex, cell.rowIndex, cell.value]),
          itemStyle: {borderColor: tokens.surface, borderWidth: CELL_GAP},
          type: 'heatmap' as const,
        },
      ],
      tooltip: {
        ...buildChartTooltip(tokens),
        formatter: (params: any) => {
          const item = firstTooltipParam(params)
          const value = item?.value ?? []
          const heading = `${rows[value[1]] ?? ''} · ${columns[value[0]] ?? ''}`

          return renderChartTooltip(heading, [
            {
              color: item?.color,
              label: columns[value[0]] ?? '',
              value: formatChartNumber(value[2], format),
            },
          ])
        },
        trigger: 'item',
      },
      visualMap: {
        calculable: false,
        inRange: {color: tokens.sequential},
        max,
        min,
        show: false,
        type: 'continuous' as const,
      },
      xAxis: {
        ...buildCategoryAxis(tokens, columns),
        show: axis?.x !== false,
        splitArea: {show: false},
      },
      yAxis: {
        ...buildCategoryAxis(tokens, rows),
        show: axis?.y !== false,
        splitArea: {show: false},
      },
    }
  }, [animation, axis, cells, columns, format, rows, texture, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      option={option}
      isLoading={isLoading}
      skeleton={
        <HeatmapChartSkeleton
          height={height}
          legendCount={0}
          xAxis={skeletonAxis(axis?.x)}
          yAxis={skeletonAxis(axis?.y)}
        />
      }
    />
  )
}
