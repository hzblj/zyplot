import type {NativeChartAxisOptions} from '../contracts/chart-native'

/**
 * Builders for `xAxis`/`yAxis`, one per position.
 *
 * `labelInset` is how far an overlaid label sits off the plot's trailing edge, which
 * only means something when the labels are inside the plot — a gutter axis has no
 * edge to sit off. So it is `overlay`'s alone.
 */
export const axis = {
  end: (options: Omit<NativeChartAxisOptions, 'labelInset' | 'position'> = {}): NativeChartAxisOptions => ({
    ...options,
    position: 'end',
  }),
  overlay: (options: Omit<NativeChartAxisOptions, 'position'> = {}): NativeChartAxisOptions => ({
    ...options,
    position: 'overlay',
  }),
  start: (options: Omit<NativeChartAxisOptions, 'labelInset' | 'position'> = {}): NativeChartAxisOptions => ({
    ...options,
    position: 'start',
  }),
}
