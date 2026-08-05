'use client'

import {LineChart as EChartsLineChart} from 'echarts/charts'
import {type FC, useCallback, useMemo, useState} from 'react'
import {fadeChartColor} from '../shared/color'
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
  buildMinorTickAxis,
  buildValueAxis,
  chartUpdateAnimation,
  crosshairHeadroom,
  plotInnerHeight,
} from '../shared/option'
import {buildChartReveal} from '../shared/reveal'
import type {ChartScrubConfig} from '../shared/scrub'
import {skeletonAxis} from '../shared/skeleton'
import {emphasisSeriesColor, useChartTokens} from '../shared/tokens'
import type {ChartNumberFormat, ChartSeries, ChartSeriesPlotProps, NativeChartInteraction} from '../shared/types'
import {LineChartSkeleton} from './line-chart-skeleton'

echarts.use([EChartsLineChart])

/** Props for `Chart.Line`. */
export type LineChartProps = ChartSeriesPlotProps & {
  categories: readonly string[]
  /** Keeps one series in colour and drops the rest to grey. */
  emphasisId?: string
  format?: ChartNumberFormat
  /** Rounds the line. Off by default: a curve implies data between the points. */
  isSmooth?: boolean
  series: readonly ChartSeries[]
}

const DEFAULT_STROKE = 2

const focusMode = (interaction?: NativeChartInteraction) => {
  if (interaction?.dimOpacity !== undefined) {
    return 'none' as const
  }

  return interaction?.hover === 'series' ? ('series' as const) : ('self' as const)
}

/**
 * A trend over time, one line per series. Gaps in the data are drawn as gaps,
 * never bridged, and symbols appear only on hover.
 */
export const LineChart: FC<LineChartProps> = ({
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
  const isScrubbable = interaction?.hover !== 'none'
  const [hasRevealed, setHasRevealed] = useState(false)
  const onRevealed = useCallback(() => setHasRevealed(true), [])

  const read = series[0]
  const readColor = useMemo(
    () =>
      tokens && read ? (seriesStyles?.[read.id]?.color ?? emphasisSeriesColor(tokens, read, 0, emphasisId)) : undefined,
    [emphasisId, read, seriesStyles, tokens]
  )
  const readStroke = read ? (seriesStyles?.[read.id]?.strokeWidth ?? DEFAULT_STROKE) : DEFAULT_STROKE

  const reveal = useMemo(() => {
    if (!read || !readColor) {
      return null
    }

    return buildChartReveal({
      animation,
      clip: plot?.clip,
      color: readColor,
      glowRadius: seriesStyles?.[read.id]?.glow?.radius,
      hasPlayed: hasRevealed,
      isSmooth,
      seriesId: read.id,
      strokeWidth: readStroke,
      values: read.values,
    })
  }, [animation, hasRevealed, isSmooth, plot, read, readColor, readStroke, seriesStyles])

  const annotationOption = useMemo(
    () =>
      tokens
        ? (isScrubbing: boolean) =>
            buildChartAnnotationOption(annotations, {
              domain: yAxis?.domain,
              drawsPoints: true,
              isScrubbing,
              label: tokens.label,
            })
        : undefined,
    [annotations, tokens, yAxis]
  )

  const option = useMemo(() => {
    if (!tokens || !reveal) {
      return null
    }

    const hasCategoryAxis = (xAxis?.visible ?? axis?.x) !== false
    const headroom = crosshairHeadroom(interaction)
    const minorTicks = hasCategoryAxis ? buildMinorTickAxis(tokens, categories, xAxis) : undefined

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      grid: buildChartGrid({across: xAxis, down: yAxis, hasCategoryGutter: hasCategoryAxis, headroom, plot}),
      series: [
        ...reveal.extraSeries,
        ...series.map((item, index) => {
          const style = seriesStyles?.[item.id]
          const color = style?.color ?? emphasisSeriesColor(tokens, item, index, emphasisId)
          const glow = style?.glow

          return {
            ...(index === 0
              ? {
                  ...annotationOption?.(false),
                  animationDelay: reveal.main.animationDelay,
                  animationDuration: reveal.main.animationDuration,
                  animationEasing: reveal.main.animationEasing,
                  ...chartUpdateAnimation(animation),
                }
              : {}),
            areaStyle: buildSeriesAreaStyle(
              style?.fill,
              color,
              style?.fillOpacity,
              plotInnerHeight(height, {down: yAxis, hasCategoryGutter: hasCategoryAxis, headroom, plot})
            ),
            clip: plot?.clip ?? true,
            connectNulls: false,
            data: item.values,
            emphasis: interaction?.hover === 'none' ? {disabled: true} : {focus: focusMode(interaction)},
            id: item.id,
            itemStyle: {color, opacity: style?.opacity},
            lineStyle: {
              color,
              opacity: index === 0 ? reveal.main.opacity : style?.opacity,
              shadowBlur: glow?.radius,
              shadowColor: glow ? fadeChartColor(glow.color ?? color, glow.opacity ?? 0.35) : undefined,
              type: style?.strokeDash?.length ? style.strokeDash : undefined,
              width: style?.strokeWidth ?? DEFAULT_STROKE,
            },
            name: item.label,
            showSymbol: style?.symbol !== undefined && style.symbol !== 'none',
            smooth: isSmooth,
            symbol: style?.symbol,
            symbolSize: style?.symbolSize ?? 8,
            type: 'line' as const,
            z: 2,
          }
        }),
      ],
      tooltip: {
        ...buildChartInteraction(tokens, interaction, isScrubbable),
        formatter: buildAxisTooltipFormatter(format),
      },
      xAxis: [
        {
          ...buildCategoryAxis(tokens, categories, false, xAxis),
          show: hasCategoryAxis,
        },
        ...(minorTicks ? [minorTicks] : []),
      ],
      yAxis: {
        ...buildValueAxis(tokens, yAxis?.format ?? format, yAxis),
        show: (yAxis?.visible ?? axis?.y) !== false,
      },
    }
  }, [
    animation,
    annotationOption,
    axis,
    categories,
    emphasisId,
    format,
    height,
    interaction,
    isScrubbable,
    isSmooth,
    plot,
    reveal,
    series,
    seriesStyles,
    texture,
    tokens,
    xAxis,
    yAxis,
  ])

  const scrub = useMemo((): ChartScrubConfig | undefined => {
    if (!tokens || !read || !readColor || !isScrubbable) {
      return undefined
    }

    return {
      animation,
      annotationOption,
      annotations,
      color: readColor,
      interaction,
      isSmooth,
      markerTarget: 'line',
      marks: categories.map((category, index) => ({category, value: read.values[index] ?? null})),
      seriesId: read.id,
      strokeWidth: readStroke,
      tokens: {axis: tokens.axis, surface: tokens.surface},
    }
  }, [
    animation,
    annotationOption,
    annotations,
    categories,
    interaction,
    isScrubbable,
    isSmooth,
    read,
    readColor,
    readStroke,
    tokens,
  ])

  const legend = useMemo(() => {
    if (!tokens) {
      return []
    }

    return buildChartLegendItems(tokens, series, emphasisId)
  }, [emphasisId, series, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      interaction={interaction}
      legend={legend}
      option={option}
      isLoading={isLoading}
      onInteraction={onInteraction}
      onRevealed={onRevealed}
      reveal={reveal?.plan}
      scrub={scrub}
      skeleton={
        <LineChartSkeleton
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
