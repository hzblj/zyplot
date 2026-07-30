import {useMemo} from 'react'

/** One reading, with where it sits on the axis. */
export type ChartReading = {
  category: string
  index: number
  value: number
}

/**
 * The last reading a series actually has, and the category it sits on. A series is often
 * shorter than its axis on purpose — a session still in progress, a forecast that has not
 * started — so this walks back to where the data really ends. `null` when it has none.
 *
 * @example
 * const live = useLastReading(range.categories, range.values)
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
