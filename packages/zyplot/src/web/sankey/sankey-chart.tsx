'use client'

import {SankeyChart as EChartsSankeyChart} from 'echarts/charts'
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
import {seriesColor, useChartTokens} from '../shared/tokens'
import type {ChartBaseProps, ChartFlowLink, ChartFlowNode, ChartNumberFormat} from '../shared/types'
import {SankeyChartSkeleton} from './sankey-chart-skeleton'

echarts.use([EChartsSankeyChart])

const LINK_OPACITY = 0.35
const NODE_WIDTH = 12

/** Props for `Chart.Sankey`. */
export type SankeyChartProps = ChartBaseProps & {
  format?: ChartNumberFormat
  links: readonly ChartFlowLink[]
  nodes: readonly ChartFlowNode[]
}

/**
 * Where a quantity goes as it moves through stages, and where it is lost on the
 * way. Over two stages it is a bar chart drawn expensively.
 */
export const SankeyChart: FC<SankeyChartProps> = ({
  className,
  format,
  height = 300,
  isLoading,
  links,
  nodes,
  texture,
  theme,
}) => {
  const tokens = useChartTokens(theme)

  const option = useMemo(() => {
    if (!tokens) {
      return null
    }

    const colorById = new Map(nodes.map((node, index) => [node.id, seriesColor(tokens, node, index)]))

    return {
      ...buildChartBaseOption(tokens, texture),
      series: [
        {
          data: nodes.map(node => ({
            itemStyle: {borderWidth: 0, color: colorById.get(node.id)},
            name: node.label,
          })),
          emphasis: {focus: 'adjacency'},
          label: {...buildChartTextStyle(tokens), fontSize: 11},
          lineStyle: {
            color: 'gradient',
            curveness: 0.45,
            opacity: LINK_OPACITY,
          },
          links: links.map(link => ({
            source: nodes.find(node => node.id === link.source)?.label ?? link.source,
            target: nodes.find(node => node.id === link.target)?.label ?? link.target,
            value: link.value,
          })),
          nodeGap: 10,
          nodeWidth: NODE_WIDTH,
          type: 'sankey' as const,
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
  }, [format, links, nodes, texture, tokens])

  return (
    <ChartShell
      className={className}
      height={height}
      option={option}
      isLoading={isLoading}
      skeleton={<SankeyChartSkeleton height={height} legendCount={0} />}
    />
  )
}
