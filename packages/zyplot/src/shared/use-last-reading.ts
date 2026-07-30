import {useMemo} from 'react'

/** One reading, with where it sits on the axis. */
export type ChartReading = {
  category: string
  index: number
  value: number
}

/**
 * The last reading a series actually has, and the category it sits on.
 *
 * A series is often shorter than its axis on purpose — a trading session still in
 * progress, a forecast that has not started — so its last *slot* is not its last
 * reading. This walks back to where the data really ends, which is where a "now"
 * marker belongs and what the native renderers stop a scrub at.
 *
 * `null` when the series has no readings at all.
 *
 * @example
 * const live = useLastReading(range.categories, range.values)
 * const annotations = live
 *   ? [annotation.point({id: 'live', pulse: true, x: live.category, y: live.value})]
 *   : []
 */
export const useLastReading = (
  categories: readonly string[],
  values: readonly (number | null)[]
): ChartReading | null =>
  useMemo(() => {
    for (let index = values.length - 1; index >= 0; index -= 1) {
      const value = values[index]
      const category = categories[index]
      if (value !== null && value !== undefined && category !== undefined) {
        return {category, index, value}
      }
    }
    return null
  }, [categories, values])
