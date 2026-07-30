import type {Chart} from '@hzblj/zyplot'
import {memo} from 'react'
import type {QuoteRange} from '../data/quote-data'
import {RevolutCandlestickChart} from './revolut-candlestick-chart'
import {RevolutLineChart} from './revolut-line-chart'

export type RevolutChartProps = {
  isLoading: boolean
  onInteraction: Parameters<typeof Chart.Line>[0]['onInteraction']
  range: QuoteRange
}

export type RevolutChartSwitchProps = RevolutChartProps & {isCandlestick: boolean}

const ChartSwitch = ({isCandlestick, ...props}: RevolutChartSwitchProps) =>
  isCandlestick ? <RevolutCandlestickChart {...props} /> : <RevolutLineChart {...props} />

export const RevolutChart = memo(ChartSwitch)
