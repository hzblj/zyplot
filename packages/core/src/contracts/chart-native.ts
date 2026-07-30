import type {
  ChartAnimation,
  ChartAxisOptions,
  ChartAxisPosition,
  ChartInteraction,
  ChartInteractionEvent,
  ChartLineAnnotation,
  ChartPointAnnotation,
  ChartRangeAnnotation,
  ChartSeriesStyle,
  ChartTextAnnotation,
} from './chart-presentation'

/**
 * A bloom drawn behind a mark, in the mark's own colour unless told otherwise.
 * It is a light source, not a shadow, so there is no offset to give.
 */
export type ChartGlow = {
  color?: string
  opacity?: number
  radius?: number
}

/**
 * How the paint under a line is laid down. `'solid'` is one flat wash; `'dots'`
 * lays a grid of them instead, which carries a fill across a pale background
 * without the wash the eye reads as a second, fainter chart behind the first.
 */
export type ChartFillPattern = 'dots' | 'solid'

/**
 * The area under a line, for the forms that draw one. Opacity is still
 * `fillOpacity`, so there is only ever one place to set it — a dot grid usually
 * wants more of it than a wash, because most of what it covers stays bare.
 */
export type ChartSeriesFill = {
  /**
   * The value the fill closes against, instead of the plot's floor. A price
   * chart's opening price belongs here: the fill then reads as distance from
   * where the period started, above the line and below it, rather than as volume.
   */
  baseline?: number
  /** One dot's diameter, in points. Default 1. */
  dotSize?: number
  /**
   * How much of its strength the fill still has at the plot's floor, 0–1. Default 1, which
   * is an even fill. Below that it thins downwards, so the paint gathers under the trace —
   * where the reader is looking — and lets go of the plot's bottom edge instead of stopping
   * dead against it.
   */
  fadeTo?: number
  pattern?: ChartFillPattern
  /** Centre-to-centre distance between dots, in points. Default 4. */
  spacing?: number
}

/** `ChartSeriesStyle` plus the glow and the patterned fill a native surface can draw. */
export type NativeChartSeriesStyle = ChartSeriesStyle & {
  fill?: ChartSeriesFill
  glow?: ChartGlow
}

/** How the marks appear on the first render. */
export type ChartRevealStyle = 'draw' | 'fade' | 'none'

/**
 * The curve a reveal follows. A spring is missing on purpose: an entrance that
 * overshoots would trace past the last data point and come back.
 */
export type ChartRevealEasing = 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear'

/**
 * The first-render entrance. `'draw'` traces the marks along the x axis, so it
 * only suits forms with a direction — radial and hierarchical ones fall back to
 * `'fade'`. Set `flashColor` for a brief brightening as the trace lands.
 */
export type ChartRevealAnimation = {
  duration?: number
  /**
   * The curve the entrance itself follows. Defaults to `'linear'` for `'draw'`, so
   * the trace runs at a steady speed, and to `'ease-out'` for `'fade'`.
   */
  easing?: ChartRevealEasing
  flashColor?: string
  /** How long the flash takes to decay once it has finished holding. */
  flashDuration?: number
  /**
   * The curve the flash decays along once it has finished holding. Defaults to
   * `'ease-out'`, which sheds most of the glow immediately; `'ease-in-out'` keeps it
   * up a moment longer so the bloom reads as leaving in one piece.
   */
  flashEasing?: ChartRevealEasing
  /** How far the glow blooms at the peak of the flash, as a multiple of its resting radius. */
  flashGlow?: number
  /** How long the flash stays at full strength after the trace lands, before decaying. */
  flashHold?: number
  /**
   * How bright the glow gets at the peak of the flash. Separate from `flashGlow`,
   * which is only how far it reaches — a bloom can spread a long way and stay
   * faint, or hug the stroke and be nearly opaque.
   */
  flashOpacity?: number
  /** How dim the stroke starts while it is being traced, as a fraction of its final opacity. */
  startOpacity?: number
  style?: ChartRevealStyle
  /**
   * Draws the whole path in this colour while the trace runs over it, so the
   * shape is legible from the first frame and the trace reads as filling it in
   * rather than as data arriving. Omit and only the traced part is drawn.
   */
  trackColor?: string
  trackOpacity?: number
}

/**
 * How the marks move when the data changes. `'morph'` interpolates between the two datasets;
 * `'crossfade'` dissolves one out and the other in. Read on iOS and Android; the web renderer
 * transitions mark by mark on its own either way.
 */
export type ChartTransition = 'crossfade' | 'morph'

/** `ChartAnimation` plus the entrance and data-change behaviour native can do. */
export type NativeChartAnimation = ChartAnimation & {
  reveal?: ChartRevealAnimation
  transition?: ChartTransition
}

/** The line that follows the finger while scrubbing. */
export type ChartCrosshairStyle = {
  color?: string
  dash?: readonly number[]
  /**
   * What to write above the crosshair, one entry per slot in data order — a time, a date,
   * whatever the reading is called. The app writes the words; the chart places them, because
   * it is the one that knows where the finger is.
   */
  labels?: readonly string[]
  labelColor?: string
  /** Point size of the label. Default 13. */
  labelSize?: number
  width?: number
}

/**
 * How the mark under the finger is picked out. `'point'` puts a dot on it; `'segment'`
 * brightens the stretch of line around it and blooms behind that; `'trail'` brightens
 * everything up to the reading, so the line reads as the story so far.
 */
export type ChartMarkerStyle = 'point' | 'segment' | 'trail'

/**
 * How the data under the finger is picked out. Unlike a tooltip it says only
 * which mark is being read, so use it when the value is shown outside the plot.
 *
 * `'segment'` and `'trail'` are drawn over the line rather than beside it, so
 * they only read once the rest of it has stepped back: give `dimOpacity` too.
 */
export type ChartSelectionMarker = {
  color?: string
  glow?: ChartGlow
  size?: number
  /**
   * How many data steps either side of the touch the `'segment'` style covers.
   * Default 2. `'trail'` reaches back to the first datum, so it ignores this.
   */
  span?: number
  style?: ChartMarkerStyle
}

/** `ChartInteraction` plus the crosshair and marker styling native can draw. */
export type NativeChartInteraction = ChartInteraction & {
  crosshairStyle?: ChartCrosshairStyle
  marker?: ChartSelectionMarker
}

/**
 * What a native chart's `onInteraction` receives. The scrub lifetime, the hit mark
 * and the plot geometry are the same on every platform, so this is `ChartInteractionEvent`
 * itself — kept as a name because that is what the native props are declared with.
 */
export type NativeChartInteractionEvent = ChartInteractionEvent

/**
 * Which side of its mark an annotation's label sits on. `'auto'` keeps the label inside
 * the plot: above a rule sitting in the lower half, below one sitting high.
 */
export type ChartLabelPosition = 'auto' | 'bottom' | 'leading' | 'top' | 'trailing'

/** A reference line, optionally tagged with a badge at the plot edge. */
export type NativeChartLineAnnotation = ChartLineAnnotation & {
  /** A single glyph in a filled circle where the rule meets the plot edge. */
  badge?: string
  /**
   * Drawn by nobody, but still measured: the chart reports where it landed in `geometry`
   * and leaves the pixels to the app. What `annotationViews` sets on the one it replaces.
   */
  hidden?: boolean
  /** Painted behind the label so the marks don't run through the digits. */
  labelBackground?: string
  labelPosition?: ChartLabelPosition
  /** What this annotation fades to while a point is being read. Default 1. */
  scrubOpacity?: number
  /** Diameter of the `badge` circle. Honoured on iOS and the web; Android draws a fixed one. */
  size?: number
}

/**
 * A hard disc drawn behind a point, sized in points. Unlike `ChartGlow` it has
 * an edge, so a small bright dot can sit in a larger ring of the series colour.
 */
export type ChartHalo = {
  color?: string
  opacity?: number
  size?: number
}

/**
 * A ring that blooms out of a point and rests before doing it again, for marking a live
 * reading. Every part of the rhythm is yours: a quick bloom with a long rest reads as a
 * heartbeat, a slow one as breathing.
 */
export type ChartPulse = {
  /** Defaults to the glow's colour, and to the point's own when there is no glow. */
  color?: string
  /** How long one bloom takes, in ms. Default 450. */
  duration?: number
  /** How long the ring rests between blooms, in ms. Default 1550. */
  interval?: number
  /** How opaque the ring starts, before it fades out over the bloom. Default 0.9. */
  opacity?: number
  /** How far it blooms, as a multiple of the point's resting ring. Default 2.2. */
  scale?: number
}

/** A marked point that can glow, and pulse to mark "now". */
export type NativeChartPointAnnotation = ChartPointAnnotation & {
  glow?: ChartGlow
  halo?: ChartHalo
  /**
   * Drawn by nobody, but still measured: the chart reports where it landed in `geometry`
   * and leaves the pixels to the app. What `annotationViews` sets on the one it replaces.
   */
  hidden?: boolean
  labelPosition?: ChartLabelPosition
  /** The bloom that marks a live reading. `true` takes `ChartPulse`'s defaults. */
  pulse?: boolean | ChartPulse
  /** What this annotation fades to while a point is being read. Default 1. */
  scrubOpacity?: number
  /** The dot's diameter. Each renderer rests at a slightly different one, so name it when they have to agree. */
  size?: number
}

/** Anything a native chart draws on top of the data. Discriminated by `type`. */
export type NativeChartAnnotation =
  | ChartRangeAnnotation
  | ChartTextAnnotation
  | NativeChartLineAnnotation
  | NativeChartPointAnnotation

/**
 * Where the axis labels go. `'overlay'` puts them inside the plot against its
 * trailing edge and reserves no gutter, which keeps the full width for the marks.
 */
export type NativeChartAxisPosition = ChartAxisPosition | 'overlay'

/** `ChartAxisOptions` with the overlay position and tick marks native supports. */
export type NativeChartAxisOptions = Omit<ChartAxisOptions, 'position'> & {
  /** How far an `'overlay'` label sits from the plot's trailing edge. */
  labelInset?: number
  /** Point size of the tick labels. */
  labelSize?: number
  /** Free space, in points, kept after the last mark. */
  plotDimensionEndPadding?: number
  /** Free space, in points, kept before the first mark. */
  plotDimensionStartPadding?: number
  position?: NativeChartAxisPosition
  /** Draws the short marks beside each label. Independent of `grid`. */
  ticks?: boolean
}
