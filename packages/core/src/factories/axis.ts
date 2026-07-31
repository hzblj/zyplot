import type {NativeChartAxisOptions} from '../contracts/chart-native'

/**
 * Builders for `xAxis`/`yAxis`, one per position.
 *
 * `labelInset` is how far the labels sit off the plot's edge, whichever side of it they
 * are on: an overlaid label steps in from the trailing edge, a gutter one steps out and
 * the gutter widens to keep it.
 */
export const axis = {
  end: (options: Omit<NativeChartAxisOptions, 'position'> = {}): NativeChartAxisOptions => ({
    ...options,
    position: 'end',
  }),
  overlay: (options: Omit<NativeChartAxisOptions, 'position'> = {}): NativeChartAxisOptions => ({
    ...options,
    position: 'overlay',
  }),
  start: (options: Omit<NativeChartAxisOptions, 'position'> = {}): NativeChartAxisOptions => ({
    ...options,
    position: 'start',
  }),
}
