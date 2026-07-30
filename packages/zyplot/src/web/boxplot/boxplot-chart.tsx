'use client'

import {BoxplotChart as EChartsBoxplotChart, ScatterChart as EChartsScatterChart} from 'echarts/charts'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {
  buildCartesianAxes,
  buildChartBaseOption,
  buildChartGrid,
  buildChartTooltip,
  firstTooltipParam,
  renderChartTooltip,
} from '../shared/option'
import {useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartBoxplotGroup, ChartNumberFormat} from '../shared/types'
import {BoxplotChartSkeleton} from './boxplot-chart-skeleton'

echarts.use([EChartsBoxplotChart, EChartsScatterChart])

/** Props for `Chart.Boxplot`. */
export type BoxplotChartProps = ChartBaseProps & {
  format?: ChartNumberFormat
  groups: readonly ChartBoxplotGroup[]
  labels: {
    max: string
    median: string
    min: string
    q1: string
    q3: string
  }
  orientation?: 'horizontal' | 'vertical'
}

/**
 * The spread of several distributions side by side, not just their averages.
 * Outliers are drawn as individual points rather than folded into the whiskers.
 */
export const BoxplotChart: FC<BoxplotChartProps> = ({
  animation,
  axis,
  className,
  format,
  groups,
  height,
  isLoading,
  labels,
  orientation = 'vertical',
  texture,
  theme,
}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    const isHorizontal = orientation === 'horizontal'
    const categories = groups.map(group => group.label)
    const outliers = groups.flatMap((group, index) =>
      (group.outliers ?? []).map(value => {
        if (isHorizontal) {
          return [value, index]
        }

        return [index, value]
      })
    )

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      ...buildCartesianAxes(tokens, categories, format, isHorizontal, axis),
      grid: buildChartGrid(!isHorizontal),
      series: [
        {
          boxWidth: [8, 34],
          data: groups.map(group => [group.min, group.q1, group.median, group.q3, group.max]),
          itemStyle: {
            borderColor: tokens.categorical[0],
            borderWidth: 1.5,
            color: tokens.track,
          },
          name: 'boxplot',
          type: 'boxplot' as const,
        },
        {
          data: outliers,
          itemStyle: {color: tokens.muted},
          name: 'outliers',
          symbolSize: 5,
          type: 'scatter' as const,
        },
      ],
      tooltip: {
        ...buildChartTooltip(tokens, 'shadow'),
        formatter: (params: any) => {
          const item = firstTooltipParam(params)
          const group = groups[item?.dataIndex ?? 0]
          if (!group || item?.seriesName !== 'boxplot') {
            return renderChartTooltip(undefined, [
              {
                color: tokens.muted,
                label: item?.seriesName ?? '',
                value: formatChartNumber(item?.value?.[1], format),
              },
            ])
          }

          return renderChartTooltip(group.label, [
            {label: labels.max, value: formatChartNumber(group.max, format)},
            {label: labels.q3, value: formatChartNumber(group.q3, format)},
            {
              color: tokens.categorical[0],
              label: labels.median,
              value: formatChartNumber(group.median, format),
            },
            {label: labels.q1, value: formatChartNumber(group.q1, format)},
            {label: labels.min, value: formatChartNumber(group.min, format)},
          ])
        },
        trigger: 'item',
      },
    }
  }, [animation, axis, format, groups, labels, orientation, texture, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      option={option}
      isLoading={isLoading}
      skeleton={
        <BoxplotChartSkeleton height={height} legendCount={0} xAxis={axis?.x !== false} yAxis={axis?.y !== false} />
      }
    />
  )
}
