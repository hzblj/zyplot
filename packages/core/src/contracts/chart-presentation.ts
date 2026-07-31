import type {ChartNumberFormat} from './chart-theme'

/** How an axis maps values to positions. `'auto'` picks from the data. */
export type ChartAxisScale = 'auto' | 'category' | 'linear' | 'log' | 'time'

/** Which side of the plot an axis is drawn on. */
export type ChartAxisPosition = 'end' | 'start'

/** Pins an axis extent. Omit either end to keep it computed from the data. */
export type ChartAxisDomain = {
  max?: number
  min?: number
  /**
   * Headroom kept beyond the data, as a fraction of its extent — `0.08` leaves 8%
   * clear at each end. Applies only to an end that is computed, so it can be
   * combined with a single pinned one.
   *
   * Without it a line runs into the top and bottom of its own plot, which reads as
   * clipped rather than as the highest and lowest reading.
   */
  padding?: number
}

/**
 * Full control of one axis. `axis={{x: false}}` is still the short way to hide
 * one; reach for this when you need a pinned domain, a log scale or exact ticks.
 */
export type ChartAxisOptions = {
  domain?: ChartAxisDomain
  format?: ChartNumberFormat
  grid?: boolean
  gridDash?: readonly number[]
  label?: string
  labelRotation?: number
  position?: ChartAxisPosition
  reversed?: boolean
  scale?: ChartAxisScale
  /** A hint. The renderer still picks readable ticks around it. */
  tickCount?: number
  /** Exact ticks, when the reader is looking for specific values. */
  tickValues?: readonly (number | string)[]
  /** Draws the axis at all. Hiding one takes its grid with it — the rules belong to the scale. */
  visible?: boolean
}

/** Inset between the plot area and its container. */
export type ChartPlotPadding = {
  bottom?: number
  left?: number
  right?: number
  top?: number
}

/** Styles the plot area only, not the surface around it. */
export type ChartPlotStyle = {
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  borderWidth?: number
  /** Clips marks to the plot area. Wanted whenever a domain is pinned. */
  clip?: boolean
  padding?: number | ChartPlotPadding
}

/** The shape drawn at a data point. */
export type ChartSymbol = 'circle' | 'diamond' | 'none' | 'square' | 'triangle'

/** Overrides for one series, keyed by `ChartSeries.id`. */
export type ChartSeriesStyle = {
  color?: string
  fillOpacity?: number
  opacity?: number
  strokeDash?: readonly number[]
  strokeWidth?: number
  symbol?: ChartSymbol
  symbolSize?: number
}

/** The curve an animation follows. */
export type ChartAnimationEasing = 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear' | 'spring'

/** Timing for the entrance and for later data changes. */
export type ChartAnimation = {
  /**
   * How long the entrance waits before it starts, in ms. Worth a beat when the chart arrives
   * on a pushed screen: the first part of a trace drawn under a navigation transition is
   * never seen.
   */
  delay?: number
  duration?: number
  easing?: ChartAnimationEasing
  enabled?: boolean
  /** The entrance. Turn it off for a chart that re-renders on every keystroke. */
  initial?: boolean
  /** The transition when data changes under a mounted chart. */
  updates?: boolean
}

/** Which crosshair lines follow the pointer. */
export type ChartCrosshairMode = 'both' | 'none' | 'x' | 'y'

/** What a hover picks up: the whole axis slice, the nearest mark, or one series. */
export type ChartHoverMode = 'axis' | 'nearest' | 'none' | 'series'

/** How many marks can be selected at once. */
export type ChartSelectionMode = 'multiple' | 'none' | 'single'

/** Everything about how a chart responds to a pointer or a finger. */
export type ChartInteraction = {
  crosshair?: ChartCrosshairMode
  /**
   * How long the marks take to step back to `dimOpacity` when a reading starts, and to come back up
   * when it ends, in ms. Default 0, which is instant — give it a beat when the dimming is the whole
   * gesture's feedback, so a finger landing reads as the lights coming down rather than as a cut.
   */
  dimDuration?: number
  /** How far the other marks fade while one is hovered. */
  dimOpacity?: number
  /** Native only. The web has no equivalent. */
  haptics?: boolean
  /**
   * How far the read mark is blended towards `highlightColor`, 0–1. Default 1. Below that
   * the mark's own colour shows through, so a red candle lights up red rather than white.
   */
  highlightBlend?: number
  /**
   * A colour the mark under the pointer is blended towards, so the read one reads as lit
   * rather than merely as the one that was not dimmed.
   */
  highlightColor?: string
  /** How far a hovered mark grows. */
  highlightScale?: number
  hover?: ChartHoverMode
  pan?: boolean
  /**
   * Reads a span rather than a mark: two fingers on the plot report the marks under each of
   * them, and everything between. iOS and Android only — a pointer has no second finger.
   *
   * The span arrives as `range` on the interaction event, beside the single `index` one
   * finger reports, so the same `onInteraction` serves both and the readout decides which
   * of the two it is showing.
   */
  range?: boolean
  selection?: ChartSelectionMode
  tooltip?: boolean
  zoom?: boolean
}

/** A position on an axis: a number, or a category name. */
export type ChartCoordinate = number | string

/**
 * Where in a category's band a rule sits. A band is a width, not a line, so a rule placed on
 * one has to pick: `'center'` runs through the mark, `'start'` and `'end'` run along the band's
 * own edges — which is where a rule that means "up to here" belongs, since the mark it names is
 * inside the span rather than the end of it.
 *
 * Only means anything on a category axis. Default `'center'`.
 */
export type ChartBandAlign = 'center' | 'end' | 'start'

/** A reference line across the plot: a target, a threshold, a launch date. */
export type ChartLineAnnotation = {
  /** Where in a category's band the rule sits. Ignored on a numeric axis. Default `'center'`. */
  align?: ChartBandAlign
  axis: 'x' | 'y'
  color?: string
  /**
   * Dash and gap lengths, in points. Omit for a solid rule — a dash of `[6, 3]` reads as
   * a boundary, `[1, 4]` as a reference the eye can cross.
   */
  dash?: readonly number[]
  id: string
  label?: string
  type: 'line'
  value: ChartCoordinate
  /** How thick the rule is drawn, in points. Default 1. */
  width?: number
}

/** A shaded span: a quarter, an incident window, a tolerance band. */
export type ChartRangeAnnotation = {
  axis: 'x' | 'y'
  color?: string
  end: ChartCoordinate
  id: string
  label?: string
  opacity?: number
  start: ChartCoordinate
  type: 'range'
}

/** A single marked point, placed by coordinate rather than by data. */
export type ChartPointAnnotation = {
  color?: string
  id: string
  label?: string
  symbol?: ChartSymbol
  type: 'point'
  x: ChartCoordinate
  y: number
}

/** Free text placed on the plot. Omit `x`/`y` to let the renderer place it. */
export type ChartTextAnnotation = {
  color?: string
  id: string
  text: string
  type: 'text'
  x?: ChartCoordinate
  y?: number
}

/** Anything drawn on top of the data. Discriminated by `type`. */
export type ChartAnnotation = ChartLineAnnotation | ChartPointAnnotation | ChartRangeAnnotation | ChartTextAnnotation

/**
 * Where a scrub is in its lifetime. `'began'` and `'ended'` bracket one gesture,
 * so a readout outside the plot knows when to return to its resting value.
 */
export type ChartInteractionPhase = 'began' | 'changed' | 'ended' | 'layout'

/** Where one annotation ended up, in the chart's own coordinate space. */
export type ChartAnnotationGeometry = {
  id: string
  x: number
  y: number
}

/**
 * The plot's box and its annotations' positions, in the chart's own coordinate space.
 * Reported on the `'layout'` phase so an app can place its own views over the chart —
 * its own badge on an annotation, its own card at a reading — instead of taking the ones
 * the chart draws.
 */
export type ChartGeometry = {
  annotations: readonly ChartAnnotationGeometry[]
  plot: {height: number; width: number; x: number; y: number}
}

/**
 * The span two fingers are reading, in data order: `startIndex` is always the lower of the
 * two, however the fingers are placed, and both ends are inclusive.
 *
 * The edge positions come with it because the chart is the one that knows where a category
 * landed — a card centred over the span needs them, and an app cannot compute them from the
 * plot's width without also knowing the axis padding and the bar inset.
 */
export type ChartInteractionRange = {
  endCategory?: string
  endIndex: number
  /** Where the mark at `endIndex` sits, in the chart's own coordinate space. */
  endX?: number
  startCategory?: string
  startIndex: number
  /** Where the mark at `startIndex` sits, in the chart's own coordinate space. */
  startX?: number
}

/** What `onInteraction` receives. Fields are filled in as the chart form allows. */
export type ChartInteractionEvent = {
  category?: string
  /** Where the plot and its annotations sit, on the `'layout'` phase. */
  geometry?: ChartGeometry
  /** Position of the selected mark in the chart's own data order. */
  index?: number
  /** Pointer position in the chart's own coordinate space. */
  nativeX?: number
  nativeY?: number
  phase?: ChartInteractionPhase
  /** The span under two fingers, when `interaction.range` is on and both are down. */
  range?: ChartInteractionRange
  seriesId?: string
  /** Unix seconds, on the time-based forms. */
  timestamp?: number
  value?: number
  x?: number
  y?: number
}
