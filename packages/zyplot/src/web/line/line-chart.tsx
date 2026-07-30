'use client'

import {LineChart as EChartsLineChart} from 'echarts/charts'
import {type FC, useCallback, useMemo, useState} from 'react'
import {fadeChartColor} from '../shared/color'
import {echarts} from '../shared/engine'
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
} from '../shared/option'
import {buildChartReveal} from '../shared/reveal'
import type {ChartScrubConfig} from '../shared/scrub'
import {emphasisSeriesColor, useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartNumberFormat, ChartSeries} from '../shared/types'
import {LineChartSkeleton} from './line-chart-skeleton'

echarts.use([EChartsLineChart])

/** Props for `Chart.Line`. */
export type LineChartProps = ChartBaseProps & {
  categories: readonly string[]
  /** Keeps one series in colour and drops the rest to grey. */
  emphasisId?: string
  format?: ChartNumberFormat
  /** Rounds the line. Off by default: a curve implies data between the points. */
  isSmooth?: boolean
  series: readonly ChartSeries[]
}

const DEFAULT_STROKE = 2

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
  /** An entrance happens once. After that its flash has no business being built again. */
  const [hasRevealed, setHasRevealed] = useState(false)
  const onRevealed = useCallback(() => setHasRevealed(true), [])

  /** The read series is the first one: the one a scrub and a traced entrance follow. */
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

  /**
   * The annotation option is a function of whether a mark is being read, because
   * `scrubOpacity` steps a reference line back while one is. The pointer layer calls it
   * again when a scrub starts and ends.
   */
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

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      grid: buildChartGrid(hasCategoryAxis, plot, xAxis),
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
                }
              : {}),
            clip: plot?.clip ?? true,
            connectNulls: false,
            data: item.values,
            emphasis:
              interaction?.hover === 'none'
                ? {disabled: true}
                : {focus: interaction?.hover === 'series' ? 'series' : 'self'},
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
            // A dot on every reading is a mark the reader did not ask for, and the native
            // renderers draw none. Give a `symbol` and they appear; otherwise, on hover only.
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
      xAxis: {
        ...buildCategoryAxis(tokens, categories, false, xAxis),
        show: hasCategoryAxis,
      },
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
      legend={legend}
      option={option}
      isLoading={isLoading}
      onInteraction={onInteraction}
      onRevealed={onRevealed}
      reveal={reveal?.plan}
      scrub={scrub}
      skeleton={
        <LineChartSkeleton
          height={height}
          legendCount={series.length}
          xAxis={(xAxis?.visible ?? axis?.x) !== false}
          yAxis={(yAxis?.visible ?? axis?.y) !== false}
        />
      }
    />
  )
}
