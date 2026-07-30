import type {ChartGeometry, ChartInteractionEvent} from '@hzblj/zyplot-core'
import {useCallback, useMemo, useState} from 'react'

/** The datum being read. `index` is its position in the chart's data. */
export type ChartScrubSelection = {
  category?: string
  index: number
  /** Where the finger or pointer is, in the chart's own coordinate space. */
  nativeX?: number
  nativeY?: number
  value?: number
}

/** What `useChartScrub` returns. */
export type ChartScrub = {
  /**
   * Where the plot and its annotations sit, once the chart has laid out. Position your own
   * views over the chart with it — your own badge on an annotation, your own card at a
   * reading — when the ones the chart draws are not the ones you want.
   */
  geometry: ChartGeometry | null
  /** Hand this straight to a chart's `onInteraction`. */
  onInteraction: (event: ChartInteractionEvent) => void
  /** Drops the selection, for a caller that has its own reason to. */
  reset: () => void
  /** What is being read, or `null` when nothing is being scrubbed. */
  selection: ChartScrubSelection | null
}

/**
 * Tracks which datum is being read, for a readout that lives outside the plot. The
 * selection goes back to `null` when the finger lifts or the pointer leaves the plot.
 *
 * The same hook on all three platforms: a finger on iOS and Android, a pointer on the web.
 *
 * @example
 * const {onInteraction, selection} = useChartScrub()
 * const shown = selection ? prices[selection.index] : prices.at(-1)
 * return <Chart.Line ... onInteraction={onInteraction} />
 */
export const useChartScrub = (): ChartScrub => {
  const [selection, setSelection] = useState<ChartScrubSelection | null>(null)
  const [geometry, setGeometry] = useState<ChartGeometry | null>(null)

  const onInteraction = useCallback((event: ChartInteractionEvent) => {
    if (event.phase === 'layout') {
      if (event.geometry) {
        setGeometry(event.geometry)
      }
      return
    }
    if (event.phase === 'ended') {
      setSelection(null)
      return
    }
    if (event.index === undefined) {
      return
    }
    setSelection(current =>
      current?.index === event.index && current?.nativeX === event.nativeX
        ? current
        : {
            category: event.category,
            index: event.index as number,
            nativeX: event.nativeX,
            nativeY: event.nativeY,
            value: event.value,
          }
    )
  }, [])

  const reset = useCallback(() => setSelection(null), [])

  return useMemo(() => ({geometry, onInteraction, reset, selection}), [geometry, onInteraction, reset, selection])
}
