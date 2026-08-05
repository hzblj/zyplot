import type {ChartInteractionHandler, ChartSlotView, ChartSlotViewProps} from '@hzblj/zyplot'
import {memo} from 'react'
import type {QuoteRange} from './quote-data'
import type {QuoteScheme} from './quote-theme'
import {RevolutCandlestickChart} from './revolut-candlestick-chart'
import {RevolutLineChart} from './revolut-line-chart'

export type RevolutChartProps = ChartSlotViewProps & {
  /**
   * Your own view on the event rule. It goes on the annotation itself, so the id the two agree on is
   * the chart's to know — and the chart's own mark for it steps aside wherever one is given.
   */
  eventView?: ChartSlotView
  height?: number
  /** Caps the event rule with the badge the chart draws. Off where a view of the app's own goes there instead. */
  isEventBadgeVisible?: boolean
  isLoading: boolean
  onInteraction?: ChartInteractionHandler
  range: QuoteRange
  scheme: QuoteScheme
}

export type RevolutChartSwitchProps = RevolutChartProps & {isCandlestick: boolean}

const ChartSwitch = ({isCandlestick, ...props}: RevolutChartSwitchProps) =>
  isCandlestick ? <RevolutCandlestickChart {...props} /> : <RevolutLineChart {...props} />

export const RevolutChart = memo(ChartSwitch)
