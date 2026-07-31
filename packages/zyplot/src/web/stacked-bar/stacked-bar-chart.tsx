'use client'

import {BarChart as EChartsBarChart} from 'echarts/charts'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {ChartShell} from '../shared/frame'
import {
  buildAxisTooltipFormatter,
  buildCartesianAxes,
  buildChartAnnotationOption,
  buildChartBaseOption,
  buildChartGrid,
  buildChartInteraction,
  buildChartLegendItems,
} from '../shared/option'
import {skeletonAxis} from '../shared/skeleton'
import {emphasisSeriesColor, useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartNumberFormat, ChartSeries} from '../shared/types'
import {StackedBarChartSkeleton} from './stacked-bar-chart-skeleton'

echarts.use([EChartsBarChart])

const SEGMENT_GAP = 1

/** Props for `Chart.StackedBar`. */
export type StackedBarChartProps = ChartBaseProps & {
  categories: readonly string[]
  /** Keeps one series in colour and drops the rest to grey. */
  emphasisId?: string
  format?: ChartNumberFormat
  /** Normalises every stack to 100%, so the chart compares shape and not size. */
  isNormalized?: boolean
  orientation?: 'horizontal' | 'vertical'
  series: readonly ChartSeries[]
}

const toPercentSeries = (series: readonly ChartSeries[]): ChartSeries[] => {
  const totals = series[0]?.values.map((_, index) => series.reduce((sum, item) => sum + (item.values[index] ?? 0), 0))

  return series.map(item => ({
    ...item,
    values: item.values.map((value, index) => {
      const total = totals?.[index] ?? 0
      if (total === 0 || value === null) {
        return null
      }

      return (value / total) * 100
    }),
  }))
}

/**
 * Part-to-whole across categories, and the better answer whenever a pie chart
 * would need more than three slices. Horizontal by default, since composition
 * labels are usually words.
 */
export const StackedBarChart: FC<StackedBarChartProps> = ({
  axis,
  animation,
  annotations,
  categories,
  className,
  emphasisId,
  format,
  height,
  isLoading,
  isNormalized = false,
  interaction,
  onInteraction,
  orientation = 'horizontal',
  plot,
  series,
  seriesStyles,
  texture,
  theme,
  xAxis,
  yAxis,
}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    const isHorizontal = orientation === 'horizontal'
    let plotted = series
    let valueFormat = format
    if (isNormalized) {
      plotted = toPercentSeries(series)
      valueFormat = {...format, decimals: 0, prefix: undefined, suffix: '%'}
    }

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      ...buildCartesianAxes(tokens, categories, valueFormat, isHorizontal, axis, xAxis, yAxis),
      grid: buildChartGrid({down: yAxis, hasCategoryGutter: !isHorizontal, plot}),
      series: plotted.map((item, index) => ({
        ...(index === 0 ? buildChartAnnotationOption(annotations) : {}),
        barMaxWidth: 28,
        clip: plot?.clip ?? true,
        data: item.values,
        emphasis: interaction?.hover === 'none' ? {disabled: true} : {focus: 'series'},
        id: item.id,
        itemStyle: {
          borderColor: tokens.surface,
          borderWidth: SEGMENT_GAP,
          color: seriesStyles?.[item.id]?.color ?? emphasisSeriesColor(tokens, item, index, emphasisId),
          opacity: seriesStyles?.[item.id]?.opacity,
        },
        name: item.label,
        stack: 'total',
        type: 'bar' as const,
      })),
      tooltip: {
        ...buildChartInteraction(tokens, {
          crosshair: 'none',
          hover: 'axis',
          ...interaction,
        }),
        formatter: buildAxisTooltipFormatter(valueFormat),
      },
    }
  }, [
    animation,
    annotations,
    axis,
    categories,
    emphasisId,
    format,
    isNormalized,
    interaction,
    orientation,
    plot,
    series,
    seriesStyles,
    texture,
    tokens,
    xAxis,
    yAxis,
  ])

  const legend = useMemo(() => {
    if (!tokens) {
      return []
    }

    return buildChartLegendItems(tokens, series, emphasisId)
  }, [emphasisId, series, tokens])

  return (
    <ChartShell
      annotations={annotations}
      className={className}
      height={height}
      interaction={interaction}
      legend={legend}
      option={option}
      isLoading={isLoading}
      onInteraction={onInteraction}
      skeleton={
        <StackedBarChartSkeleton
          categories={categories}
          format={format}
          height={height}
          legendCount={series.length}
          orientation={orientation}
          xAxis={skeletonAxis(axis?.x, xAxis)}
          yAxis={skeletonAxis(axis?.y, yAxis)}
        />
      }
    />
  )
}
