'use client'

import {SunburstChart as EChartsSunburstChart} from 'echarts/charts'
import {type FC, useMemo} from 'react'
import {echarts} from '../shared/engine'
import {formatChartNumber} from '../shared/format'
import {ChartShell} from '../shared/frame'
import {
  buildChartBaseOption,
  buildChartTextStyle,
  buildChartTooltip,
  firstTooltipParam,
  renderChartTooltip,
} from '../shared/option'
import {type ChartTokens, seriesColor, useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartHierarchyNode, ChartNumberFormat} from '../shared/types'
import {SunburstChartSkeleton} from './sunburst-chart-skeleton'

echarts.use([EChartsSunburstChart])

const MIN_LABEL_ANGLE = 14

/** Props for `Chart.Sunburst`. */
export type SunburstChartProps = ChartBaseProps & {
  format?: ChartNumberFormat
  nodes: readonly ChartHierarchyNode[]
}

type EChartsSunburstNode = {
  children?: EChartsSunburstNode[]
  itemStyle: {color: string}
  name: string
  value?: number
}

const toSunburstData = (
  tokens: ChartTokens,
  nodes: readonly ChartHierarchyNode[],
  inherited?: string
): EChartsSunburstNode[] =>
  nodes.map((node, index) => {
    const color = inherited ?? seriesColor(tokens, node, index)

    return {
      children: node.children && toSunburstData(tokens, node.children, color),
      itemStyle: {color},
      name: node.label,
      value: node.value,
    }
  })

/**
 * The same hierarchy as `Chart.Treemap`, read as rings. Better at showing how
 * deep a taxonomy goes, worse at comparing sizes, and it degrades past three rings.
 */
export const SunburstChart: FC<SunburstChartProps> = ({
  animation,
  className,
  format,
  height,
  isLoading,
  nodes,
  texture,
  theme,
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
          data: toSunburstData(tokens, nodes),
          emphasis: {focus: 'ancestor'},
          itemStyle: {borderColor: tokens.surface, borderWidth: 2},
          label: {
            ...buildChartTextStyle(tokens),
            color: tokens.surface,
            fontSize: 10,
            minAngle: MIN_LABEL_ANGLE,
            rotate: 'tangential',
          },
          levels: [{}, {r: '52%', r0: '18%'}, {label: {position: 'outside'}, r: '78%', r0: '54%'}],
          radius: ['18%', '78%'],
          type: 'sunburst' as const,
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
  }, [animation, format, nodes, texture, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      option={option}
      isLoading={isLoading}
      skeleton={<SunburstChartSkeleton height={height} legendCount={0} />}
    />
  )
}
