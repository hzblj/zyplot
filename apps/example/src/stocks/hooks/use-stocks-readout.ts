import type {ChartGeometry, ChartInteractionHandler} from '@hzblj/zyplot'
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

/**
 * What one finger is reading. Words only — where the reading sits is the chart's answer, and the
 * views it mounts for it are placed in its own layout pass rather than from anything here.
 */
export type StocksScrubLabel = {
  date: string
  value: string
}

/** Two fingers: what the stretch between them did. Where it reaches is the chart's, as above. */
export type StocksSpanLabel = {
  dates: string
  delta: string
  isDown: boolean
  percent: string
}

export type StocksReadout = {
  /** The period's own change, which the header keeps showing while a finger reads the plot. */
  change: string
  geometry: ChartGeometry | null
  isDown: boolean
  isReading: boolean
  /** Whether the reading is one finger's, which is the only one the trace takes a colour for. */
  isScrubbing: boolean
  onInteraction: ChartInteractionHandler
  percent: string
  price: string
  scrub: StocksScrubLabel | null
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
        isDown: !rose(range.values, held.startIndex, held.endIndex),
        percent: formatPercent(percentChange(from, to)),
      }
    })()

    return {
      change: formatSigned(change),
      geometry,
      isDown: change < 0,
      isReading: scrub !== null || span !== null,
      isScrubbing: scrub !== null,
      onInteraction,
      percent: formatPercent(percentChange(range.open, reading.last)),
      price: formatPrice(reading.last),
      scrub,
      span,
    }
  }, [geometry, held, onInteraction, range, selection])
}
