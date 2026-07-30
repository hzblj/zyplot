import type {ChartSelectionMarker} from '../contracts/chart-native'

/**
 * Builders for `interaction.marker`. The styles read different fields — `span` belongs to a
 * `'segment'`, `size` to a dot, and a `'trail'` takes neither — and the type allows all of
 * them at once where these do not.
 */
export const marker = {
  point: (options: Omit<ChartSelectionMarker, 'span' | 'style'> = {}): ChartSelectionMarker => ({
    ...options,
    style: 'point',
  }),
  segment: (options: Omit<ChartSelectionMarker, 'size' | 'style'> = {}): ChartSelectionMarker => ({
    ...options,
    style: 'segment',
  }),
  trail: (options: Omit<ChartSelectionMarker, 'size' | 'span' | 'style'> = {}): ChartSelectionMarker => ({
    ...options,
    style: 'trail',
  }),
}
