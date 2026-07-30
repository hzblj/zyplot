'use client'

import {FunnelChart as EChartsFunnelChart} from 'echarts/charts'
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
import {FunnelChartSkeleton} from './funnel-chart-skeleton'

echarts.use([EChartsFunnelChart])

const SEGMENT_GAP = 2

/** Props for `Chart.Funnel`. */
export type FunnelChartProps = ChartBaseProps & {
  format?: ChartNumberFormat
  /** Widest to narrowest. Each stage must be a subset of the previous one. */
  stages: readonly ChartDatum[]
}

/**
 * Stages that shrink as things drop out. Each stage must be a subset of the one
 * above it; when the stages are merely ordered, use a bar chart instead.
 */
export const FunnelChart: FC<FunnelChartProps> = ({className, format, height, isLoading, stages, texture, theme}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    return {
      ...buildChartBaseOption(tokens, texture),
      series: [
        {
          data: stages.map((stage, index) => ({
            itemStyle: {
              borderColor: tokens.surface,
              borderWidth: SEGMENT_GAP,
              color: seriesColor(tokens, stage, index),
            },
            name: stage.label,
            value: stage.value,
          })),
          gap: 2,
          label: {show: false},
          sort: 'none',
          type: 'funnel' as const,
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
  }, [format, stages, texture, tokens])

  const legend = useMemo(() => {
    if (!tokens) {
      return []
    }

    return buildChartLegendItems(tokens, stages)
  }, [stages, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      legend={legend}
      option={option}
      isLoading={isLoading}
      skeleton={<FunnelChartSkeleton height={height} legendCount={stages.length} />}
    />
  )
}
