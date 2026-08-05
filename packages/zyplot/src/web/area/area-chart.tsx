'use client'

import {LineChart as EChartsLineChart} from 'echarts/charts'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {buildSeriesAreaStyle} from '../shared/fill'
import {ChartShell} from '../shared/frame'
import {
  buildAxisTooltipFormatter,
  buildCategoryAxis,
  buildChartAnnotationOption,
  buildChartBaseOption,
  buildChartGrid,
  buildChartInteraction,
  buildChartLegendItems,
  buildValueAxis,
  plotInnerHeight,
} from '../shared/option'
import {skeletonAxis} from '../shared/skeleton'
import {emphasisSeriesColor, useChartTokens} from '../shared/tokens'
import type {ChartNumberFormat, ChartSeries, ChartSeriesPlotProps} from '../shared/types'
import {AreaChartSkeleton} from './area-chart-skeleton'

echarts.use([EChartsLineChart])

const SINGLE_SERIES_FILL_OPACITY = 0.16
const STACKED_FILL_OPACITY = 0.85

/** Props for `Chart.Area`. */
export type AreaChartProps = ChartSeriesPlotProps & {
  categories: readonly string[]
  /** Keeps one series in colour and drops the rest to grey. */
  emphasisId?: string
  format?: ChartNumberFormat
  isSmooth?: boolean
  /** Shows composition over time. Without it, series overlap and hide each other. */
  isStacked?: boolean
  series: readonly ChartSeries[]
}

/**
 * Volume over time, drawn as a filled line. One series reads most clearly, because
 * the fill itself is the quantity. Set `isStacked` to show composition instead.
 */
export const AreaChart: FC<AreaChartProps> = ({
  axis,
  animation,
  annotations,
  categories,
  className,
  emphasisId,
  format,
  height,
  isLoading,
  isSmooth = false,
  isStacked = false,
  interaction,
  onInteraction,
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

    let fillOpacity = SINGLE_SERIES_FILL_OPACITY
    let stack: string | undefined
    if (isStacked) {
      fillOpacity = STACKED_FILL_OPACITY
      stack = 'total'
    }

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      grid: buildChartGrid({down: yAxis, hasCategoryGutter: true, plot}),
      series: series.map((item, index) => {
        const style = seriesStyles?.[item.id]
        const color = style?.color ?? emphasisSeriesColor(tokens, item, index, emphasisId)

        return {
          ...(index === 0 ? buildChartAnnotationOption(annotations) : {}),
          areaStyle: buildSeriesAreaStyle(
            style?.fill,
            color,
            style?.fillOpacity ?? fillOpacity,
            plotInnerHeight(height, {down: yAxis, hasCategoryGutter: true, plot})
          ) ?? {opacity: style?.fillOpacity ?? fillOpacity},
          clip: plot?.clip ?? true,
          connectNulls: false,
          data: item.values,
          emphasis: interaction?.hover === 'none' ? {disabled: true} : {focus: 'series'},
          id: item.id,
          itemStyle: {
            color,
            opacity: style?.opacity,
          },
          lineStyle: {
            type: style?.strokeDash?.length ? style.strokeDash : undefined,
            width: style?.strokeWidth ?? 2,
          },
          name: item.label,
          showSymbol: style?.symbol !== 'none',
          smooth: isSmooth,
          stack,
          symbol: style?.symbol,
          symbolSize: style?.symbolSize ?? 8,
          type: 'line' as const,
        }
      }),
      tooltip: {
        ...buildChartInteraction(tokens, interaction),
        formatter: buildAxisTooltipFormatter(format),
      },
      xAxis: {
        ...buildCategoryAxis(tokens, categories, false, xAxis),
        boundaryGap: false,
        show: (xAxis?.visible ?? axis?.x) !== false,
      },
      yAxis: {
        ...buildValueAxis(tokens, yAxis?.format ?? format, yAxis),
        show: (yAxis?.visible ?? axis?.y) !== false,
      },
    }
  }, [
    animation,
    annotations,
    axis,
    categories,
    emphasisId,
    format,
    height,
    interaction,
    isSmooth,
    isStacked,
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
        <AreaChartSkeleton
          categories={categories}
          format={format}
          height={height}
          legendCount={series.length}
          xAxis={skeletonAxis(axis?.x, xAxis)}
          yAxis={skeletonAxis(axis?.y, yAxis)}
        />
      }
    />
  )
}
