import type {ChartGeometry} from '@hzblj/zyplot'
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
  nativeX?: number
  onInteraction: ReturnType<typeof useChartScrub>['onInteraction']
  percent: string
  price: {fraction: string; whole: string}
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
      nativeX: selection?.nativeX,
      onInteraction,
      percent: formatPercent(range.open === 0 ? 0 : (change / range.open) * 100),
      price: splitPrice(shown, coin.precision),
      subtitle: selection === null ? range.periodLabel : '',
      value: shown,
    }
  }, [coin, geometry, onInteraction, range, selection])
}
