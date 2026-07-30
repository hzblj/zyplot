import type {ChartGeometry} from '@hzblj/zyplot'
import {useChartScrub} from '@hzblj/zyplot'
import {formatNumber, INTRADAY_OPEN, type QuoteRange, splitPrice} from '@zyplot/feature-charts/revolut'
import {useMemo} from 'react'

export type QuoteReadout = {
  amount: string
  category?: string
  geometry: ChartGeometry | null
  nativeX?: number
  isPreMarket: boolean
  isDown: boolean
  percent: string
  price: {fraction: string; whole: string}
  onInteraction: ReturnType<typeof useChartScrub>['onInteraction']
  subtitle: string
  isScrubbing: boolean
}

const lastKnownValue = (values: readonly (number | null)[]) => {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    const value = values[index]
    if (value !== null) {
      return value
    }
  }
  return 0
}

export const useQuoteReadout = (range: QuoteRange): QuoteReadout => {
  const {geometry, onInteraction, selection} = useChartScrub()

  return useMemo(() => {
    const scrubbed = selection === null ? null : (range.values[selection.index] ?? null)
    const shown = scrubbed ?? lastKnownValue(range.values)
    const change = shown - range.baseline
    const isDown = change < 0

    return {
      amount: `${isDown ? '-' : '+'}${formatNumber(Math.abs(change))}`,
      category: selection?.category,
      geometry,
      isDown,
      isPreMarket: range.id === '1d' && (selection?.index ?? INTRADAY_OPEN) < INTRADAY_OPEN,
      isScrubbing: selection !== null,
      nativeX: selection?.nativeX,
      onInteraction,
      percent: `${formatNumber(Math.abs((change / range.baseline) * 100))}%`,
      price: splitPrice(shown),
      subtitle: selection === null ? range.periodLabel : range.pointLabels[selection.index],
    }
  }, [geometry, onInteraction, range, selection])
}
