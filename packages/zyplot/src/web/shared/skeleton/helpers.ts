import type {ChartSkeletonAxis, NativeChartAxisOptions} from '../types'

export const LINE_SEEDS = [1.15, 0.78, 1.62, 0.94, 1.37]
export const LINE_VERTICES = 9
export const waveAt = (index: number, seed: number): number => Math.sin((index + 1) * seed) * 0.5 + 0.5

/**
 * What to tell a placeholder about an axis: `false` for one the chart hides, and otherwise the
 * options themselves, so it can keep the same gutter and write the same labels.
 */
export const skeletonAxis = (isShown: boolean | undefined, options?: NativeChartAxisOptions): ChartSkeletonAxis =>
  (options?.visible ?? isShown) === false ? false : (options ?? true)
