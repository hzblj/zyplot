import type {ChartSelectionMarker} from '../contracts/chart-native'

/**
 * Builders for `interaction.marker`.
 *
 * The two styles read different fields — `span` is how far a `'segment'` reaches
 * along the line and means nothing to a dot, `size` is a dot's diameter and means
 * nothing to a segment. The type allows both at once; these do not.
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
}
