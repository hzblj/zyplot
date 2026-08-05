import {Chart, type ChartInteractionHandler, type ChartSlotViewProps, zyplot} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {isAndroid, isWeb} from '../platform'
import {plotInsets, stepsArrival, stepsChartStyle, stepsFormat, stepsScale} from './steps-chart-style'
import type {StepsRange} from './steps-data'
import {type StepsScheme, stepsColors, stepsLayout} from './steps-theme'

export type StepsChartProps = Pick<ChartSlotViewProps, 'rangeView' | 'tooltip'> & {
  height?: number
  isLoading: boolean
  onInteraction?: ChartInteractionHandler
  range: StepsRange
  scheme: StepsScheme
}

const BarChart = ({
  height = stepsLayout.chartHeight,
  isLoading,
  onInteraction,
  range,
  rangeView,
  scheme,
  tooltip,
}: StepsChartProps) => {
  const chart = useMemo(() => {
    const color = stepsColors[scheme]

    return zyplot(z => ({
      ...stepsArrival,
      categories: range.categories,
      height,
      /**
       * A span is the reading this screen is for, so both fingers and one are on. The crosshair
       * style dresses the single rule and the pair of them alike.
       */
      interaction: z.interaction({
        crosshair: 'x',
        crosshairStyle: {color: color.rule, width: isAndroid ? 1.2 : 1},
        haptics: true,
        range: true,
      }),
      isLoading,
      onInteraction,
      rangeView,
      series: [z.series({id: 'steps', label: 'Steps', style: {color: color.bar}, values: range.values})],
      theme: stepsChartStyle(scheme).theme,
      /**
       * The card of the screen's own, which the chart mounts over the reading and moves itself. The
       * chart's own is what the web gets instead: `Chart.Bar` reports no scrub there, so a card fed
       * from a scrub would have nothing to say.
       */
      tooltip: isWeb ? true : (tooltip ?? false),
      /**
       * The dates are named rather than left to the renderer, and the gap under them is too: each
       * renderer keeps a spacing of its own — Swift Charts is the tightest of the three — so the row
       * sat at a different distance on every platform. Naming it puts all three on the same number.
       */
      xAxis: {
        ...plotInsets,
        grid: false,
        labelInset: 6,
        labelSize: 13,
        ticks: false,
        tickValues: range.ticks,
      },
      yAxis: z.axis.overlay({
        ...stepsScale(range),
        format: stepsFormat,
        grid: true,
        labelInset: 4,
        labelSize: 13,
        ticks: false,
      }),
    }))
  }, [height, isLoading, onInteraction, range, rangeView, scheme, tooltip])

  return <Chart.Bar {...chart} />
}

export const StepsChart = memo(BarChart)
