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
import type {ChartNumberFormat, ChartOrientation, ChartSeries, ChartSeriesPlotProps} from '../shared/types'
import {BarChartSkeleton} from './bar-chart-skeleton'

echarts.use([EChartsBarChart])

const BAR_RADIUS = 4

/** Props for `Chart.Bar`. */
export type BarChartProps = ChartSeriesPlotProps & {
  categories: readonly string[]
  /** Keeps one series in colour and drops the rest to grey. */
  emphasisId?: string
  format?: ChartNumberFormat
  /** Which way the bars run. Vertical by default. */
  orientation?: ChartOrientation
  series: readonly ChartSeries[]
}

const barRadiusFor = (orientation: ChartOrientation): number[] => {
  if (orientation === 'horizontal') {
    return [0, BAR_RADIUS, BAR_RADIUS, 0]
  }

  return [BAR_RADIUS, BAR_RADIUS, 0, 0]
}

/**
 * Compares amounts across categories, grouped when there is more than one series.
 * Go `horizontal` when the category names are long enough to rotate.
 */
export const BarChart: FC<BarChartProps> = ({
  axis,
  animation,
  annotations,
  categories,
  className,
  emphasisId,
  format,
  height,
  isLoading,
  interaction,
  onInteraction,
  orientation = 'vertical',
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

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      ...buildCartesianAxes(tokens, categories, format, isHorizontal, axis, xAxis, yAxis),
      grid: buildChartGrid({across: xAxis, down: yAxis, hasCategoryGutter: !isHorizontal, plot}),
      series: series.map((item, index) => ({
        ...(index === 0 ? buildChartAnnotationOption(annotations) : {}),
        barGap: '12%',
        barMaxWidth: 28,
        clip: plot?.clip ?? true,
        data: item.values,
        emphasis: interaction?.hover === 'none' ? {disabled: true} : {focus: 'series'},
        id: item.id,
        itemStyle: {
          borderRadius: barRadiusFor(orientation),
          color: seriesStyles?.[item.id]?.color ?? emphasisSeriesColor(tokens, item, index, emphasisId),
          opacity: seriesStyles?.[item.id]?.opacity,
        },
        name: item.label,
        type: 'bar' as const,
      })),
      tooltip: {
        ...buildChartInteraction(tokens, {
          crosshair: 'none',
          hover: 'axis',
          ...interaction,
        }),
        formatter: buildAxisTooltipFormatter(format),
      },
    }
  }, [
    animation,
    annotations,
    axis,
    categories,
    emphasisId,
    format,
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
        <BarChartSkeleton
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
