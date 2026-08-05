import type {ChartTooltipAnchor} from '../contracts/chart-native'

type Placed = Omit<ChartTooltipAnchor, 'placement'>

/**
 * Builders for `tooltip`: the app's own view for the reading, and where the chart puts it. The two
 * placements measure against different boxes — a card sits inside the plot and flips at its edge, a
 * chip stays centred on the rule and is pinned clear of the plot instead — so they take different
 * fields, and each builder rejects the other's. `align` is the card's: a chip already sits outside the
 * plot, so it has no room to be placed down.
 *
 * `view` is what the chart mounts in place of its own card. Name a component rather than an element
 * and the config that holds it is the same value on every render, so what the view shows can change
 * without a single prop on the chart changing with it.
 *
 * It is optional, so a placement can be declared on its own and the view spread in where it is known —
 * a preset a screen finishes. On its own it changes nothing the chart draws: the card the chart writes
 * itself keeps its own placement, and these fields are read for a view of yours.
 *
 * @example
 * const reading = tooltip.above({lift: 2})
 * zyplot(z => ({tooltip: {...reading, view: ReadingChip}}))
 */
export const tooltip = {
  above: <View = never>(
    options: Omit<Placed, 'align' | 'gap'> & {view?: View} = {}
  ): ChartTooltipAnchor & {view?: View} => ({
    ...options,
    placement: 'above',
  }),
  beside: <View = never>(options: Omit<Placed, 'lift'> & {view?: View} = {}): ChartTooltipAnchor & {view?: View} => ({
    ...options,
    placement: 'beside',
  }),
}
