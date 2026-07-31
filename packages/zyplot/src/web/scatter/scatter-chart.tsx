'use client'

import {ScatterChart as EChartsScatterChart} from 'echarts/charts'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {
  buildChartBaseOption,
  buildChartGrid,
  buildChartLegendItems,
  buildChartTooltip,
  buildValueAxis,
  firstTooltipParam,
  renderChartTooltip,
} from '../shared/option'
import {skeletonAxis} from '../shared/skeleton'
import {seriesColor, useChartTokens} from '../shared/tokens'
import {
  CHART_ALL_PAIRS_SERIES_LIMIT,
  type ChartBaseProps,
  type ChartNumberFormat,
  type ChartScatterSeries,
} from '../shared/types'
import {ScatterChartSkeleton} from './scatter-chart-skeleton'

echarts.use([EChartsScatterChart])

const DEFAULT_SYMBOL_SIZE = 9
const MAX_SYMBOL_SIZE = 28
const PROGRESSIVE_THRESHOLD = 3000

/** Props for `Chart.Scatter`. */
export type ScatterChartProps = ChartBaseProps & {
  series: readonly ChartScatterSeries[]
  xFormat?: ChartNumberFormat
  xLabel?: string
  yFormat?: ChartNumberFormat
  yLabel?: string
}

const symbolSizeFor = (maxSize: number) => (value: number[]) => {
  const size = value[2]
  if (size === undefined || maxSize === 0) {
    return DEFAULT_SYMBOL_SIZE
  }

  return DEFAULT_SYMBOL_SIZE + (size / maxSize) * (MAX_SYMBOL_SIZE - DEFAULT_SYMBOL_SIZE)
}

/**
 * Two measures plotted against each other. It caps at three series: in a cloud of
 * points every series sits beside every other, and a fourth colour stops being
 * tellable apart. Past three, split it into small multiples.
 */
export const ScatterChart: FC<ScatterChartProps> = ({
  animation,
  axis,
  className,
  height,
  isLoading,
  series,
  texture,
  theme,
  xFormat,
  xLabel,
  yFormat,
  yLabel,
}) => {
  const tokens = useChartTokens(theme)
  const plotted = useMemo(() => series.slice(0, CHART_ALL_PAIRS_SERIES_LIMIT), [series])

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    const maxSize = Math.max(0, ...plotted.flatMap(item => item.points.map(point => point.size ?? 0)))

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      grid: buildChartGrid({}),
      series: plotted.map((item, index) => ({
        data: item.points.map(point => [point.x, point.y, point.size ?? 0, point.label ?? '']),
        emphasis: {focus: 'series'},
        itemStyle: {
          borderColor: tokens.surface,
          borderWidth: 1,
          color: seriesColor(tokens, item, index),
          opacity: 0.9,
        },
        name: item.label,
        progressive: PROGRESSIVE_THRESHOLD,
        progressiveThreshold: PROGRESSIVE_THRESHOLD,
        symbolSize: symbolSizeFor(maxSize),
        type: 'scatter' as const,
      })),
      tooltip: {
        ...buildChartTooltip(tokens),
        formatter: (params: any) => {
          const item = firstTooltipParam(params)
          const value = item?.value ?? []

          return renderChartTooltip(value[3] || item?.seriesName, [
            {
              color: item?.color,
              label: xLabel ?? '',
              value: formatChartNumber(value[0], xFormat),
            },
            {
              label: yLabel ?? '',
              value: formatChartNumber(value[1], yFormat),
            },
          ])
        },
        trigger: 'item',
      },
      xAxis: {
        ...buildValueAxis(tokens, xFormat),
        show: axis?.x !== false,
        splitLine: {lineStyle: {color: tokens.grid}},
      },
      yAxis: {...buildValueAxis(tokens, yFormat), show: axis?.y !== false},
    }
  }, [animation, axis, plotted, texture, tokens, xFormat, xLabel, yFormat, yLabel])

  const legend = useMemo(() => {
    if (!tokens) {
      return []
    }

    return buildChartLegendItems(tokens, plotted)
  }, [plotted, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      legend={legend}
      option={option}
      isLoading={isLoading}
      skeleton={
        <ScatterChartSkeleton
          height={height}
          legendCount={plotted.length}
          xAxis={skeletonAxis(axis?.x)}
          yAxis={skeletonAxis(axis?.y)}
        />
      }
    />
  )
}
