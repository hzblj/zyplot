import type {Chart} from '@hzblj/zyplot'
import {memo} from 'react'
import type {QuoteRange} from './quote-data'
import type {QuoteScheme} from './quote-theme'
import {RevolutCandlestickChart} from './revolut-candlestick-chart'
import {RevolutLineChart} from './revolut-line-chart'

export type RevolutChartProps = {
  height?: number
  /** Caps the event rule with the badge the chart draws. Off where a view of the app's own goes there instead. */
  isEventBadgeVisible?: boolean
  isLoading: boolean
  /** Off on native, where the readout and the overlay card carry the reading instead. */
  isTooltipVisible?: boolean
  onInteraction?: Parameters<typeof Chart.Line>[0]['onInteraction']
  range: QuoteRange
  scheme: QuoteScheme
}

export type RevolutChartSwitchProps = RevolutChartProps & {isCandlestick: boolean}

const ChartSwitch = ({isCandlestick, ...props}: RevolutChartSwitchProps) =>
  isCandlestick ? <RevolutCandlestickChart {...props} /> : <RevolutLineChart {...props} />

export const RevolutChart = memo(ChartSwitch)
