'use client'

import {GaugeChart as EChartsGaugeChart} from 'echarts/charts'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {buildChartBaseOption, buildChartTextStyle} from '../shared/option'
import {useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartNumberFormat} from '../shared/types'
import {GaugeChartSkeleton} from './gauge-chart-skeleton'

echarts.use([EChartsGaugeChart])

const ARC_WIDTH = 12

/** Props for `Chart.Gauge`. */
export type GaugeChartProps = ChartBaseProps & {
  format?: ChartNumberFormat
  max: number
  min?: number
  value: number
}

/**
 * One value against its limit, drawn as an arc with the number in the middle.
 * When there is no meaningful maximum this is a stat tile, not a gauge.
 */
export const GaugeChart: FC<GaugeChartProps> = ({
  animation,
  className,
  format,
  height = 200,
  isLoading,
  max,
  min = 0,
  texture,
  theme,
  value,
}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      series: [
        {
          anchor: {show: false},
          axisLabel: {show: false},
          axisLine: {
            lineStyle: {color: [[1, tokens.track]], width: ARC_WIDTH},
          },
          axisTick: {show: false},
          data: [{value}],
          detail: {
            ...buildChartTextStyle(tokens),
            color: tokens.categorical[0],
            fontSize: 22,
            formatter: () => formatChartNumber(value, format),
            offsetCenter: [0, 0],
          },
          endAngle: -45,
          itemStyle: {color: tokens.categorical[0]},
          max,
          min,
          pointer: {show: false},
          progress: {
            itemStyle: {borderRadius: ARC_WIDTH},
            roundCap: true,
            show: true,
            width: ARC_WIDTH,
          },
          splitLine: {show: false},
          startAngle: 225,
          title: {show: false},
          type: 'gauge' as const,
        },
      ],
    }
  }, [animation, format, max, min, texture, tokens, value])

  return (
    <ChartShell
      className={className}
      height={height}
      option={option}
      isLoading={isLoading}
      skeleton={<GaugeChartSkeleton height={height} legendCount={0} />}
    />
  )
}
