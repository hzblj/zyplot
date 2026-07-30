'use client'

import {RadarChart as EChartsRadarChart} from 'echarts/charts'
import {RadarComponent} from 'echarts/components'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {
  buildChartBaseOption,
  buildChartLegendItems,
  buildChartTextStyle,
  buildChartTooltip,
  firstTooltipParam,
  renderChartTooltip,
} from '../shared/option'
import {seriesColor, useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartNumberFormat, ChartRadarAxis, ChartSeries} from '../shared/types'
import {RadarChartSkeleton} from './radar-chart-skeleton'

echarts.use([EChartsRadarChart, RadarComponent])

const FILL_OPACITY = 0.14
const MAX_USEFUL_SERIES = 3

/** Props for `Chart.Radar`. */
export type RadarChartProps = ChartBaseProps & {
  axes: readonly ChartRadarAxis[]
  format?: ChartNumberFormat
  series: readonly ChartSeries[]
}

/**
 * Compares the shape of two or three profiles across several axes. It cannot
 * answer "how much" — for that use a grouped bar chart.
 */
export const RadarChart: FC<RadarChartProps> = ({
  animation,
  axes,
  className,
  format,
  height,
  isLoading,
  series,
  texture,
  theme,
}) => {
  const tokens = useChartTokens(theme)
  const plotted = useMemo(() => series.slice(0, MAX_USEFUL_SERIES), [series])

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      radar: {
        axisLine: {lineStyle: {color: tokens.grid}},
        axisName: {...buildChartTextStyle(tokens), fontSize: 11},
        indicator: axes.map(axis => ({max: axis.max, name: axis.label})),
        radius: '68%',
        splitArea: {show: false},
        splitLine: {lineStyle: {color: tokens.grid}},
      },
      series: [
        {
          data: plotted.map((item, index) => {
            const color = seriesColor(tokens, item, index)

            return {
              areaStyle: {color, opacity: FILL_OPACITY},
              itemStyle: {color},
              lineStyle: {color, width: 2},
              name: item.label,
              value: item.values,
            }
          }),
          symbolSize: 5,
          type: 'radar' as const,
        },
      ],
      tooltip: {
        ...buildChartTooltip(tokens),
        formatter: (params: any) => {
          const item = firstTooltipParam(params)
          const values: (number | null)[] = item?.value ?? []

          return renderChartTooltip(
            item?.name,
            axes.map((axis, index) => ({
              label: axis.label,
              value: formatChartNumber(values[index], format),
            }))
          )
        },
        trigger: 'item',
      },
    }
  }, [animation, axes, format, plotted, texture, tokens])

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
      skeleton={<RadarChartSkeleton height={height} legendCount={plotted.length} />}
    />
  )
}
