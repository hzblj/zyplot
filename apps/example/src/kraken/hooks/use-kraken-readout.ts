import type {ChartGeometry, ChartInteractionHandler} from '@hzblj/zyplot'
import {useChartScrub} from '@hzblj/zyplot'
import {
  formatPercent,
  formatSigned,
  type KrakenCoin,
  type KrakenRange,
  krakenReading,
  splitPrice,
} from '@zyplot/feature-charts/kraken'
import {useMemo} from 'react'

export type KrakenReadout = {
  amount: string
  geometry: ChartGeometry | null
  isDown: boolean
  isOnLatest: boolean
  isScrubbing: boolean
  onInteraction: ChartInteractionHandler
  percent: string
  price: {fraction: string; whole: string}
  /** The label the rule's own chip would have shown, or `null` when nothing is read. */
  stamp: string | null
  subtitle: string
  value: number
}

export const useKrakenReadout = (coin: KrakenCoin, range: KrakenRange): KrakenReadout => {
  const {geometry, onInteraction, selection} = useChartScrub()

  return useMemo(() => {
    const reading = krakenReading(range)
    const shown = selection === null ? reading.last : (range.values[selection.index] ?? reading.last)
    const change = shown - range.open
    const isDown = change < 0

    return {
      amount: formatSigned(change),
      geometry,
      isDown,
      isOnLatest: selection === null || selection.index === range.values.length - 1,
      isScrubbing: selection !== null,
      onInteraction,
      percent: formatPercent(range.open === 0 ? 0 : (change / range.open) * 100),
      price: splitPrice(shown, coin.precision),
      stamp: selection === null ? null : (range.pointLabels[selection.index] ?? null),
      subtitle: selection === null ? range.periodLabel : '',
      value: shown,
    }
  }, [coin, geometry, onInteraction, range, selection])
}
