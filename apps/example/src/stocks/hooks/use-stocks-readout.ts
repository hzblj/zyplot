import type {ChartGeometry} from '@hzblj/zyplot'
import {useChartScrub} from '@hzblj/zyplot'
import {
  formatPercent,
  formatPrice,
  formatSigned,
  percentChange,
  rose,
  type StocksRange,
  stocksReading,
} from '@zyplot/feature-charts/stocks'
import {useMemo} from 'react'

/** One finger: the mark under it, and where it is. */
export type StocksScrubLabel = {
  date: string
  value: string
  x?: number
}

/** Two fingers: what the stretch between them did, and where its edges are. */
export type StocksSpanLabel = {
  dates: string
  delta: string
  endX?: number
  isDown: boolean
  percent: string
  startX?: number
}

export type StocksReadout = {
  /** The period's own change, which the header keeps showing while a finger reads the plot. */
  change: string
  geometry: ChartGeometry | null
  isDown: boolean
  isReading: boolean
  onInteraction: ReturnType<typeof useChartScrub>['onInteraction']
  percent: string
  price: string
  scrub: StocksScrubLabel | null
  /** The mark one finger is on, for the chart, beside the words `scrub` carries for the screen. */
  scrubIndex: number | null
  span: StocksSpanLabel | null
}

export const useStocksReadout = (range: StocksRange): StocksReadout => {
  const {geometry, onInteraction, range: held, selection} = useChartScrub()

  return useMemo(() => {
    const reading = stocksReading(range)
    const change = reading.last - range.open

    const scrub =
      selection === null
        ? null
        : {
            date: range.pointLabels[selection.index] ?? '',
            value: formatPrice(range.values[selection.index] ?? reading.last),
            x: selection.nativeX,
          }

    const span = (() => {
      if (held === null) {
        return null
      }
      const from = range.values[held.startIndex] as number
      const to = range.values[held.endIndex] as number
      return {
        dates: `${range.pointLabels[held.startIndex] ?? ''} – ${range.pointLabels[held.endIndex] ?? ''}`,
        delta: formatSigned(to - from),
        endX: held.endX,
        isDown: !rose(range.values, held.startIndex, held.endIndex),
        percent: formatPercent(percentChange(from, to)),
        startX: held.startX,
      }
    })()

    return {
      change: formatSigned(change),
      geometry,
      isDown: change < 0,
      isReading: scrub !== null || span !== null,
      onInteraction,
      percent: formatPercent(percentChange(range.open, reading.last)),
      price: formatPrice(reading.last),
      scrub,
      scrubIndex: selection?.index ?? null,
      span,
    }
  }, [geometry, held, onInteraction, range, selection])
}
