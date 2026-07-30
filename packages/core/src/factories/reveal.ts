import type {ChartRevealAnimation} from '../contracts/chart-native'

/**
 * Builders for `animation.reveal`.
 *
 * Only a traced entrance has a frontier to light, so `flashColor`, `trackColor` and
 * `startOpacity` are `'draw'`'s alone — a fade has nothing to flash. `fade` therefore
 * takes only its duration and easing.
 */
export const reveal = {
  draw: (options: Omit<ChartRevealAnimation, 'style'> = {}): ChartRevealAnimation => ({
    ...options,
    style: 'draw',
  }),
  fade: (options: Pick<ChartRevealAnimation, 'duration' | 'easing'> = {}): ChartRevealAnimation => ({
    ...options,
    style: 'fade',
  }),
  none: (): ChartRevealAnimation => ({style: 'none'}),
}
