'use client'

import {BarChart as EChartsBarChart} from 'echarts/charts'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {
  buildCategoryAxis,
  buildChartBaseOption,
  buildChartGrid,
  buildChartTooltip,
  buildValueAxis,
  firstTooltipParam,
  renderChartTooltip,
} from '../shared/option'
import {useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartNumberFormat} from '../shared/types'
import {HistogramChartSkeleton} from './histogram-chart-skeleton'

echarts.use([EChartsBarChart])

const DEFAULT_BIN_COUNT = 12

/** Props for `Chart.Histogram`. */
export type HistogramChartProps = ChartBaseProps & {
  binCount?: number
  /** Raw observations. Binning happens here. */
  values: readonly number[]
  valueFormat?: ChartNumberFormat
}

type HistogramBin = {
  count: number
  label: string
}

const buildBins = (
  values: readonly number[],
  binCount: number,
  format: ChartNumberFormat | undefined
): HistogramBin[] => {
  if (values.length === 0) {
    return []
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const width = (max - min) / binCount

  if (width === 0) {
    return [{count: values.length, label: formatChartNumber(min, format)}]
  }

  const counts = new Array<number>(binCount).fill(0)
  for (const value of values) {
    const index = Math.min(binCount - 1, Math.floor((value - min) / width))
    counts[index] = (counts[index] ?? 0) + 1
  }

  return counts.map((count, index) => ({
    count,
    label: formatChartNumber(min + index * width, format),
  }))
}

/**
 * The shape of a distribution: where the values actually cluster. Pass raw
 * observations and the bins are worked out here.
 */
export const HistogramChart: FC<HistogramChartProps> = ({
  axis,
  binCount = DEFAULT_BIN_COUNT,
  className,
  height,
  isLoading,
  texture,
  theme,
  values,
  valueFormat,
}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    const bins = buildBins(values, binCount, valueFormat)

    return {
      ...buildChartBaseOption(tokens, texture),
      grid: buildChartGrid(),
      series: [
        {
          barCategoryGap: 0,
          data: bins.map(bin => bin.count),
          itemStyle: {
            borderColor: tokens.surface,
            borderRadius: [2, 2, 0, 0],
            borderWidth: 1,
            color: tokens.categorical[0],
          },
          type: 'bar' as const,
        },
      ],
      tooltip: {
        ...buildChartTooltip(tokens, 'shadow'),
        formatter: (params: any) => {
          const item = firstTooltipParam(params)

          return renderChartTooltip(item?.name, [
            {
              color: item?.color,
              label: item?.name ?? '',
              value: formatChartNumber(item?.value),
            },
          ])
        },
        trigger: 'axis',
      },
      xAxis: {
        ...buildCategoryAxis(
          tokens,
          bins.map(bin => bin.label)
        ),
        show: axis?.x !== false,
      },
      yAxis: {...buildValueAxis(tokens), show: axis?.y !== false},
    }
  }, [axis, binCount, texture, tokens, valueFormat, values])

  return (
    <ChartShell
      className={className}
      height={height}
      option={option}
      isLoading={isLoading}
      skeleton={
        <HistogramChartSkeleton height={height} legendCount={0} xAxis={axis?.x !== false} yAxis={axis?.y !== false} />
      }
    />
  )
}
