'use client'

import {BarChart as EChartsBarChart} from 'echarts/charts'
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
import {skeletonAxis} from '../shared/skeleton'
import {useChartTokens} from '../shared/tokens'
import type {ChartAxesProps, ChartDatum, ChartNumberFormat, ChartOrientation} from '../shared/types'
import {DivergingBarChartSkeleton} from './diverging-bar-chart-skeleton'

echarts.use([EChartsBarChart])

const BAR_RADIUS = 4

const baselineFor = (isHorizontal: boolean) => {
  if (isHorizontal) {
    return {xAxis: 0}
  }

  return {yAxis: 0}
}

/** Props for `Chart.DivergingBar`. */
export type DivergingBarChartProps = ChartAxesProps & {
  data: readonly ChartDatum[]
  format?: ChartNumberFormat
  orientation?: ChartOrientation
}

/**
 * Values either side of a zero line: above or below target, week over week. The
 * zero line is always drawn, so the sign is never a guess.
 */
export const DivergingBarChart: FC<DivergingBarChartProps> = ({
  animation,
  axis,
  className,
  data,
  format,
  height,
  isLoading,
  orientation = 'horizontal',
  texture,
  theme,
}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    const isHorizontal = orientation === 'horizontal'
    const categories = data.map(entry => entry.label)

    const bars = data.map(entry => {
      let color = tokens.diverging.positive
      let borderRadius = [BAR_RADIUS, BAR_RADIUS, 0, 0]
      if (entry.value < 0) {
        color = tokens.diverging.negative
        borderRadius = [0, 0, BAR_RADIUS, BAR_RADIUS]
      }
      if (isHorizontal) {
        borderRadius = [0, BAR_RADIUS, BAR_RADIUS, 0]
        if (entry.value < 0) {
          borderRadius = [BAR_RADIUS, 0, 0, BAR_RADIUS]
        }
      }

      return {itemStyle: {borderRadius, color}, value: entry.value}
    })

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      ...buildCartesianAxes(tokens, categories, format, isHorizontal, axis),
      grid: buildChartGrid({hasCategoryGutter: !isHorizontal}),
      series: [
        {
          barMaxWidth: 24,
          data: bars,
          markLine: {
            data: [baselineFor(isHorizontal)],
            label: {show: false},
            lineStyle: {
              color: tokens.diverging.neutral,
              type: 'solid',
              width: 1,
            },
            silent: true,
            symbol: 'none',
          },
          type: 'bar' as const,
        },
      ],
      tooltip: {
        ...buildChartTooltip(tokens, 'shadow'),
        formatter: (params: any) => {
          const item = firstTooltipParam(params)

          return renderChartTooltip(undefined, [
            {
              color: item?.color,
              label: item?.name ?? '',
              value: formatChartNumber(item?.value, format),
            },
          ])
        },
        trigger: 'axis',
      },
    }
  }, [animation, axis, data, format, orientation, texture, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      option={option}
      isLoading={isLoading}
      skeleton={
        <DivergingBarChartSkeleton
          height={height}
          legendCount={0}
          xAxis={skeletonAxis(axis?.x)}
          yAxis={skeletonAxis(axis?.y)}
        />
      }
    />
  )
}
