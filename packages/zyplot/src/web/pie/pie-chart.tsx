'use client'

import {PieChart as EChartsPieChart} from 'echarts/charts'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {
  buildChartBaseOption,
  buildChartLegendItems,
  buildChartTooltip,
  firstTooltipParam,
  renderChartTooltip,
} from '../shared/option'
import {seriesColor, useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartDatum, ChartNumberFormat} from '../shared/types'
import {PieChartSkeleton} from './pie-chart-skeleton'

echarts.use([EChartsPieChart])

const DEFAULT_MAX_SLICES = 3
const SEGMENT_GAP = 2

/** Props for `Chart.Pie`. */
export type PieChartProps = ChartBaseProps & {
  data: readonly ChartDatum[]
  format?: ChartNumberFormat
  /** Fills the centre. A full pie invites angle comparisons it cannot support. */
  isSolid?: boolean
  /** Slices kept before the tail is folded into `otherLabel`. Defaults to three. */
  maxSlices?: number
  /** Name for the folded tail, already translated. Required once folding can happen. */
  otherLabel?: string
}

const foldTail = (
  data: readonly ChartDatum[],
  maxSlices: number,
  otherLabel: string | undefined
): readonly ChartDatum[] => {
  if (data.length <= maxSlices || !otherLabel) {
    return data
  }

  const kept = data.slice(0, maxSlices)
  const tail = data.slice(maxSlices)
  const total = tail.reduce((sum, entry) => sum + entry.value, 0)

  return [...kept, {id: 'other', label: otherLabel, slot: kept.length + 1, value: total}]
}

/**
 * Part-to-whole for two or three slices, drawn as a donut. Anything past
 * `maxSlices` is folded into one "other" slice; when the tail is the point, use
 * `Chart.StackedBar`.
 */
export const PieChart: FC<PieChartProps> = ({
  animation,
  className,
  data,
  format,
  height,
  isLoading,
  isSolid = false,
  maxSlices = DEFAULT_MAX_SLICES,
  otherLabel,
  texture,
  theme,
}) => {
  const tokens = useChartTokens(theme)
  const slices = useMemo(() => foldTail(data, maxSlices, otherLabel), [data, maxSlices, otherLabel])

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    let radius = ['58%', '82%']
    if (isSolid) {
      radius = ['0%', '82%']
    }

    return {
      ...buildChartBaseOption(tokens, texture, animation),
      series: [
        {
          avoidLabelOverlap: true,
          data: slices.map((entry, index) => ({
            itemStyle: {
              borderColor: tokens.surface,
              borderWidth: SEGMENT_GAP,
              color: seriesColor(tokens, entry, index),
            },
            name: entry.label,
            value: entry.value,
          })),
          label: {show: false},
          radius,
          type: 'pie' as const,
        },
      ],
      tooltip: {
        ...buildChartTooltip(tokens),
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
        trigger: 'item',
      },
    }
  }, [animation, format, isSolid, slices, texture, tokens])

  const legend = useMemo(() => {
    if (!tokens) {
      return []
    }

    return buildChartLegendItems(tokens, slices)
  }, [slices, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      legend={legend}
      option={option}
      isLoading={isLoading}
      skeleton={<PieChartSkeleton height={height} legendCount={slices.length} />}
    />
  )
}
