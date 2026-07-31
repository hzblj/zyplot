import type {ChartSelectionMarker} from '../contracts/chart-native'

/**
 * Builders for `interaction.marker`. The styles read different fields — `span` belongs to a
 * `'segment'`, a `'point'` is a dot already — and the type allows all of them at once where
 * these do not.
 */
export const marker = {
  point: (options: Omit<ChartSelectionMarker, 'dot' | 'span' | 'style'> = {}): ChartSelectionMarker => ({
    ...options,
    style: 'point',
  }),
  segment: (options: Omit<ChartSelectionMarker, 'style'> = {}): ChartSelectionMarker => ({
    ...options,
    style: 'segment',
  }),
  trail: (options: Omit<ChartSelectionMarker, 'span' | 'style'> = {}): ChartSelectionMarker => ({
    ...options,
    style: 'trail',
  }),
}
