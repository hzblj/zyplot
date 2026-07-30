'use client'

import {TreemapChart as EChartsTreemapChart} from 'echarts/charts'
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
import {TreemapChartSkeleton} from './treemap-chart-skeleton'

echarts.use([EChartsTreemapChart])

/** Props for `Chart.Treemap`. */
export type TreemapChartProps = ChartBaseProps & {
  format?: ChartNumberFormat
  nodes: readonly ChartHierarchyNode[]
}

type EChartsTreeNode = {
  children?: EChartsTreeNode[]
  itemStyle: {color: string}
  name: string
  value?: number
}

const toTreeData = (tokens: ChartTokens, nodes: readonly ChartHierarchyNode[], inherited?: string): EChartsTreeNode[] =>
  nodes.map((node, index) => {
    const color = inherited ?? seriesColor(tokens, node, index)

    return {
      children: node.children && toTreeData(tokens, node.children, color),
      itemStyle: {color},
      name: node.label,
      value: node.value,
    }
  })

/**
 * A hierarchy sized by value. Good for "these three dominate and the rest is a
 * long tail", bad for exact shares, so put the numbers in a table underneath.
 */
export const TreemapChart: FC<TreemapChartProps> = ({className, format, height, isLoading, nodes, texture, theme}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    return {
      ...buildChartBaseOption(tokens, texture),
      series: [
        {
          breadcrumb: {show: false},
          data: toTreeData(tokens, nodes),
          itemStyle: {
            borderColor: tokens.surface,
            borderWidth: 2,
            gapWidth: 2,
          },
          label: {
            ...buildChartTextStyle(tokens),
            color: tokens.surface,
            fontSize: 11,
            overflow: 'truncate',
          },
          levels: [
            {
              itemStyle: {
                borderColor: tokens.surface,
                borderWidth: 3,
                gapWidth: 3,
              },
            },
            {
              colorSaturation: [0.4, 0.7],
              itemStyle: {
                borderColorSaturation: 0.6,
                borderWidth: 1,
                gapWidth: 1,
              },
            },
          ],
          roam: false,
          type: 'treemap' as const,
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
  }, [format, nodes, texture, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      option={option}
      isLoading={isLoading}
      skeleton={<TreemapChartSkeleton height={height} legendCount={0} />}
    />
  )
}
