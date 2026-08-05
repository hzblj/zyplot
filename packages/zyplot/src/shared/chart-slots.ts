import type {ChartTooltipAnchor, NativeChartInteraction} from '@hzblj/zyplot-core'
import type {ReactNode} from 'react'
import {type ChartAnnotationViews, type ChartSlotView, hasAnnotationView, slotNode} from './annotation-views'

/**
 * Your own node in place of the chart's own tooltip. The chart keeps its own out of the
 * drawing and puts yours where it would have gone, moving it with the finger itself rather
 * than reporting the position back to you.
 *
 * On iOS and Android the node is mounted inside the chart, so it follows the reading in the
 * same frame the crosshair does. What is inside it is still yours to render from
 * `useChartScrub`, and that part arrives when React gets to it.
 *
 * Every slot takes an element or a component. A component is what a `zyplot` config can hold — it
 * is the same value on every render, so the config is too, and a reading that only changes what the
 * view shows never reaches the chart's props.
 *
 * @example
 * const {onInteraction, selection} = useChartScrub()
 * return (
 *   <Chart.Candlestick
 *     data={candles}
 *     onInteraction={onInteraction}
 *     tooltip={tooltip.beside({view: QuoteCard})}
 *   />
 * )
 */
export type ChartSlotViewProps = {
  /**
   * Your own view where an annotation lands, keyed by its `id`. The chart measures the
   * annotation, keeps its own mark for it out of the drawing, and centres your node on
   * the spot instead — a logo at the live reading, a badge on a rule, a whole card.
   *
   * Everything else about the annotation still applies: it moves with the data, and the
   * ones you leave out keep the dot, glow and pulse the chart draws.
   *
   * @example
   * zyplot(z => ({
   *   annotations: [z.annotation.point({id: 'live', x: live.category, y: live.value})],
   *   annotationViews: {live: LivePrice},
   * }))
   */
  annotationViews?: ChartAnnotationViews
  /**
   * Your own node for the span under two fingers, centred on it and lifted clear of the plot. The
   * chart draws no words for a span of its own, so this one adds rather than replaces.
   *
   * Needs `interaction.range`, and iOS or Android to be the one drawing — a pointer has no second
   * finger, so the web never places it.
   */
  rangeView?: ChartSlotView
  /**
   * What appears for the reading, in one setting. `false` for nothing at all; `true` or left out for
   * the card the chart writes itself; a `tooltip.beside({view})` or `tooltip.above({view})` for one
   * of your own, which the chart mounts and moves in its own layout pass.
   *
   * There is no second switch: a view here is the chart's card not being drawn, and a view placed
   * `above` is the crosshair's own label not being written.
   */
  tooltip?: boolean | ChartTooltip
}

/** The reading's own view, and the box the chart measures to place it. */
export type ChartTooltip = ChartTooltipAnchor & {view?: ChartSlotView}

/**
 * The interaction as the renderers read it: the group the app wrote, with what the `tooltip` prop
 * decided folded back in. `tooltip` is not on the group the app writes — one name for the reading is
 * the whole point — but it is what both renderers and the bridge have always been told.
 */
export type ResolvedChartInteraction = NativeChartInteraction & {tooltip?: boolean}

/** Where a node the app supplied is put, and what it is. */
export type ChartSlot = {
  id: string
  node: ReactNode
}

/** The slot the chart's own reading UI would have filled. */
export const TOOLTIP_SLOT = 'tooltip'

/** The slot for the span under two fingers. */
export const RANGE_SLOT = 'range'

const ANNOTATION_PREFIX = 'annotation:'

/** The slot an annotation's own mark would have filled. */
export const annotationSlot = (id: string): string => `${ANNOTATION_PREFIX}${id}`

/**
 * Every node the app supplied, in the order the chart mounts them. Entries written as
 * `live && <Now />` are left out, so a slot whose node has gone keeps whatever the chart
 * draws for it rather than losing both.
 */
const viewOf = (tooltip: boolean | ChartTooltip | undefined): ChartSlotView =>
  typeof tooltip === 'object' ? tooltip.view : undefined

/**
 * Where the chart is to put the app's own view for the reading, if it was given one.
 *
 * Named field by field rather than spread, because the `view` beside them cannot cross to a renderer.
 * Every field the anchor grows has to be added here too, or it is written and never arrives.
 */
export const tooltipAnchorOf = (tooltip: boolean | ChartTooltip | undefined): ChartTooltipAnchor | undefined =>
  typeof tooltip === 'object'
    ? {align: tooltip.align, gap: tooltip.gap, lift: tooltip.lift, placement: tooltip.placement}
    : undefined

export const chartSlots = ({annotationViews, rangeView, tooltip}: ChartSlotViewProps): readonly ChartSlot[] => {
  const slots: ChartSlot[] = []

  if (annotationViews) {
    for (const id of Object.keys(annotationViews).sort()) {
      const view = annotationViews[id]
      if (hasAnnotationView(view)) {
        slots.push({id: annotationSlot(id), node: slotNode(view)})
      }
    }
  }

  if (hasAnnotationView(viewOf(tooltip))) {
    slots.push({id: TOOLTIP_SLOT, node: slotNode(viewOf(tooltip))})
  }

  if (hasAnnotationView(rangeView)) {
    slots.push({id: RANGE_SLOT, node: slotNode(rangeView)})
  }

  return slots
}

/**
 * The interaction the renderers are handed: what the app asked for, plus what the `tooltip` prop
 * settles. The chart draws its own card unless it was told otherwise, and whatever the app's own view
 * stands in for is taken out — a view placed `'above'` is the rule's chip, so the chip's labels go.
 * Everything else the app asked for — the rule, the marker, the dimming — is untouched.
 */
export const resolveInteraction = (
  interaction: NativeChartInteraction | undefined,
  tooltip: boolean | ChartTooltip | undefined
): ResolvedChartInteraction | undefined => {
  const hasView = hasAnnotationView(viewOf(tooltip))

  if (tooltip === undefined && !hasView) {
    return interaction
  }

  const resolved: ResolvedChartInteraction = {...interaction, tooltip: tooltip !== false && !hasView}

  return hasView && typeof tooltip === 'object' && tooltip.placement === 'above' && resolved.crosshairStyle?.labels
    ? {...resolved, crosshairStyle: {...resolved.crosshairStyle, labels: undefined}}
    : resolved
}
