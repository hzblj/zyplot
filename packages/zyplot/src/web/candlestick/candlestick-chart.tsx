'use client'

import type {ChartCandlestickDatum, ChartCandlestickStyle} from '@hzblj/zyplot-core'
import {BarChart as EChartsBarChart, CandlestickChart as EChartsCandlestickChart} from 'echarts/charts'
import {DataZoomComponent} from 'echarts/components'
import {type FC, useMemo} from 'react'
import {blendChartColor} from '../shared/color'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {
  axisLabelMargin,
  buildChartAnnotationOption,
  buildChartBaseOption,
  buildChartEmphasis,
  buildChartGrid,
  buildChartInteraction,
  buildValueAxis,
  crosshairHeadroom,
  renderChartTooltip,
} from '../shared/option'
import type {ChartScrubConfig} from '../shared/scrub'
import {skeletonAxis} from '../shared/skeleton'
import {useChartTokens} from '../shared/tokens'
import type {ChartNumberFormat, ChartPlotProps} from '../shared/types'
import {CandlestickChartSkeleton} from './candlestick-chart-skeleton'

echarts.use([DataZoomComponent, EChartsBarChart, EChartsCandlestickChart])

/** Props for `Chart.Candlestick`. */
export type CandlestickChartProps = ChartPlotProps & {
  data: readonly ChartCandlestickDatum[]
  format?: ChartNumberFormat
  showVolume?: boolean
  style?: ChartCandlestickStyle
}

const PRICE_ID = 'price'
const VOLUME_ID = 'volume'

const CANDLE_STEP = 220
const DEFAULT_SWEEP = 520

/**
 * Open, high, low and close for each period, with an optional volume histogram
 * below the price.
 */
export const CandlestickChart: FC<CandlestickChartProps> = ({
  animation,
  annotations,
  axis,
  className,
  data,
  format,
  height,
  interaction,
  isLoading,
  onInteraction,
  plot,
  showVolume = false,
  style,
  texture,
  theme,
  xAxis,
  yAxis,
}) => {
  const tokens = useChartTokens(theme)
  const isScrubbable = interaction?.hover !== 'none'

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
    if (!tokens) {
      return null
    }

    const upColor = style?.upColor ?? tokens.diverging.positive
    const downColor = style?.downColor ?? tokens.diverging.negative
    const hasCategoryAxis = (xAxis?.visible ?? axis?.x) !== false
    const categories = data.map(item => item.category)

    const lit = (base: string) =>
      interaction?.highlightColor
        ? blendChartColor(base, interaction.highlightColor, interaction.highlightBlend ?? 1)
        : base

    const categoryAxis = {
      axisLabel: {
        ...axisLabelMargin(xAxis),
        color: tokens.label,
        fontFamily: tokens.fontFamily,
        fontSize: xAxis?.labelSize ?? 11,
        hideOverlap: true,
      },
      axisLine: {lineStyle: {color: tokens.grid}},
      axisTick: {show: xAxis?.ticks ?? false},
      data: categories,
      show: hasCategoryAxis,
      type: 'category' as const,
    }
    const priceAxis = {
      ...buildValueAxis(tokens, yAxis?.format ?? format, yAxis),
      scale: true,
      show: (yAxis?.visible ?? axis?.y) !== false,
    }

    const sweep = animation?.reveal?.style === 'draw' ? (animation.reveal.duration ?? DEFAULT_SWEEP) : 0
    const candleSeries = {
      ...annotationOption?.(false),
      ...buildChartEmphasis(interaction),
      animationDelay: (index: number) =>
        (animation?.delay ?? 0) + (sweep && data.length > 0 ? (index / data.length) * sweep : 0),
      animationDuration: sweep > 0 ? Math.min(CANDLE_STEP, sweep) : undefined,
      barWidth: style?.candleWidth === undefined ? undefined : `${style.candleWidth * 100}%`,
      data: data.map(item => {
        const isUp = item.close >= item.open

        return {
          emphasis: {
            itemStyle: {
              borderColor: lit(isUp ? upColor : downColor),
              color: style?.hollowUp && isUp ? 'transparent' : lit(isUp ? upColor : downColor),
            },
          },
          name: item.category,
          value: [item.open, item.close, item.low, item.high],
        }
      }),
      id: PRICE_ID,
      itemStyle: {
        borderColor: upColor,
        borderColor0: downColor,
        borderWidth: style?.wickWidth,
        color: style?.hollowUp ? 'transparent' : upColor,
        color0: downColor,
      },
      name: 'Price',
      type: 'candlestick' as const,
    }

    const series: unknown[] = [candleSeries]
    if (showVolume) {
      series.push({
        barMaxWidth: 18,
        data: data.map(item => ({
          itemStyle: {
            color: item.close >= item.open ? (style?.volumeUpColor ?? upColor) : (style?.volumeDownColor ?? downColor),
            opacity: 0.45,
          },
          value: item.volume ?? 0,
        })),
        id: VOLUME_ID,
        name: 'Volume',
        type: 'bar' as const,
        xAxisIndex: 1,
        yAxisIndex: 1,
      })
    }

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      dataZoom: interaction?.zoom ? [{type: 'inside' as const, xAxisIndex: showVolume ? [0, 1] : [0]}] : undefined,
      grid: showVolume
        ? [
            {
              ...buildChartGrid({
                across: xAxis,
                down: yAxis,
                hasCategoryGutter: false,
                headroom: crosshairHeadroom(interaction),
                plot,
              }),
              bottom: '28%',
            },
            {...buildChartGrid({hasCategoryGutter: true}), height: '16%', top: '76%'},
          ]
        : buildChartGrid({
            across: xAxis,
            down: yAxis,
            hasCategoryGutter: hasCategoryAxis,
            headroom: crosshairHeadroom(interaction),
            plot,
          }),
      series,
      tooltip: {
        ...buildChartInteraction(tokens, interaction, isScrubbable),
        formatter: (params: any) => {
          const list = Array.isArray(params) ? params : [params]
          const candle = list.find(item => item.seriesId === PRICE_ID)
          const volume = list.find(item => item.seriesId === VOLUME_ID)
          const values = candle?.value ?? []
          return renderChartTooltip(candle?.name, [
            {label: 'Open', value: formatChartNumber(values[1], format)},
            {label: 'High', value: formatChartNumber(values[4], format)},
            {label: 'Low', value: formatChartNumber(values[3], format)},
            {label: 'Close', value: formatChartNumber(values[2], format)},
            ...(volume
              ? [
                  {
                    label: 'Volume',
                    value: formatChartNumber(volume.value, {
                      decimals: 0,
                    }),
                  },
                ]
              : []),
          ])
        },
        trigger: 'axis' as const,
      },
      xAxis: showVolume
        ? [
            {...categoryAxis, axisLabel: {show: false}, gridIndex: 0},
            {...categoryAxis, gridIndex: 1},
          ]
        : categoryAxis,
      yAxis: showVolume
        ? [
            {...priceAxis, gridIndex: 0},
            {
              ...buildValueAxis(tokens, undefined),
              axisLabel: {show: false},
              gridIndex: 1,
              show: false,
            },
          ]
        : priceAxis,
    }
  }, [
    animation,
    annotationOption,
    axis,
    data,
    format,
    interaction,
    isScrubbable,
    plot,
    showVolume,
    style,
    texture,
    tokens,
    xAxis,
    yAxis,
  ])

  const scrub = useMemo((): ChartScrubConfig | undefined => {
    if (!tokens || !isScrubbable) {
      return undefined
    }

    return {
      animation,
      annotationOption,
      annotations,
      color: style?.downColor ?? tokens.diverging.negative,
      interaction,
      markerTarget: 'mark',
      marks: data.map(item => ({category: item.category, high: item.high, low: item.low, value: item.close})),
      seriesId: PRICE_ID,
      strokeWidth: style?.wickWidth ?? 1,
      tokens: {axis: tokens.axis, surface: tokens.surface},
    }
  }, [animation, annotationOption, annotations, data, interaction, isScrubbable, style, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      interaction={interaction}
      isLoading={isLoading}
      onInteraction={onInteraction}
      option={option}
      scrub={scrub}
      skeleton={
        <CandlestickChartSkeleton
          height={height}
          legendCount={0}
          xAxis={skeletonAxis(axis?.x, xAxis)}
          yAxis={skeletonAxis(axis?.y, yAxis)}
        />
      }
    />
  )
}
