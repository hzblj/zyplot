import type {
  ChartGeometry,
  ChartInteractionEvent,
  ChartInteractionHandler,
  ChartInteractionRange,
} from '@hzblj/zyplot-core'
import {useCallback, useMemo, useState} from 'react'

/**
 * The datum being read. `index` is its position in the chart's data.
 *
 * What is being read, and never where the finger is: a view that follows a reading is one the chart
 * mounts and moves itself, through `tooltip` or `rangeView`. A position reported out here would be
 * laid out a render later than the crosshair it belongs beside, and every reading would trail.
 */
export type ChartScrubSelection = {
  category?: string
  index: number
  value?: number
}

/** What `useChartScrub` returns. */
export type ChartScrub = {
  /**
   * Where the plot and its annotations sit, once the chart has laid out. Lay your own views against
   * the plot with it — a grid behind the marks, a row of labels under them, a badge on an
   * annotation — when the ones the chart draws are not the ones you want.
   *
   * A layout report, and reported once: it moves when the chart does, not when a finger does.
   */
  geometry: ChartGeometry | null
  /** Hand this straight to a chart's `onInteraction`. */
  onInteraction: ChartInteractionHandler
  /**
   * The span under two fingers, or `null` when one finger is reading and when nothing is.
   * Needs `interaction.range`, and iOS or Android to be the one drawing.
   */
  range: ChartInteractionRange | null
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
 * A second finger on native moves the reading from `selection` to `range`, so only ever one
 * of the two is set and a readout can show a value or a total without deciding which arrived
 * last.
 *
 * @example
 * const {onInteraction, range, selection} = useChartScrub()
 * const shown = range ? total(steps.slice(range.startIndex, range.endIndex + 1)) : selection ? prices[selection.index] : prices.at(-1)
 * return <Chart.Line ... onInteraction={onInteraction} />
 */
export const useChartScrub = (): ChartScrub => {
  const [selection, setSelection] = useState<ChartScrubSelection | null>(null)
  const [range, setRange] = useState<ChartInteractionRange | null>(null)
  const [geometry, setGeometry] = useState<ChartGeometry | null>(null)

  const onInteraction = useCallback((event: ChartInteractionEvent) => {
    if (event.phase === 'layout') {
      setGeometry(event.geometry)
      return
    }
    if (event.phase === 'ended') {
      setSelection(null)
      setRange(null)
      return
    }
    // Both are read out here rather than off `event` inside the updaters below, where narrowing a
    // property of a parameter does not survive the closure.
    const {index, range} = event
    if (range) {
      setSelection(null)
      setRange(current =>
        current?.startIndex === range.startIndex && current?.endIndex === range.endIndex ? current : range
      )
      return
    }
    if (index === undefined) {
      return
    }
    setRange(null)
    /**
     * The mark, and only the mark. A finger reports many times a mark and every one of those used to
     * be a new selection, because the position it carried had changed — so a screen re-rendered for a
     * reading that had not. What moves within a mark now moves in the chart's own layout.
     */
    setSelection(current =>
      current?.index === index && current?.value === event.value
        ? current
        : {category: event.category, index, value: event.value}
    )
  }, [])

  const reset = useCallback(() => {
    setSelection(null)
    setRange(null)
  }, [])

  return useMemo(
    () => ({geometry, onInteraction, range, reset, selection}),
    [geometry, onInteraction, range, reset, selection]
  )
}
