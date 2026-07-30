import type {
  ChartAxes,
  ChartInteractionEvent,
  ChartPlotStyle,
  ChartSurface,
  ChartTheme,
  NativeChartAnimation,
  NativeChartAnnotation,
  NativeChartAxisOptions,
  NativeChartInteraction,
  NativeChartSeriesStyle,
} from '@hzblj/zyplot-core'
import type {ReactNode} from 'react'

/**
 * The data shapes and the presentation vocabulary are the cross-platform contract,
 * so they live in `@hzblj/zyplot-core` and are re-exported here rather than
 * redeclared. What stays below is web-only: the DOM props, and the skeletons.
 *
 * The `Native*` presentation types are the full vocabulary — a glow, a traced
 * entrance, a selection marker, an overlaid axis. The web renderer honours all of
 * it, so the props below take those rather than the smaller sets they extend.
 */
export type {
  ChartAnimation,
  ChartAnimationEasing,
  ChartAnnotation,
  ChartAnnotationGeometry,
  ChartAxes,
  ChartAxisDomain,
  ChartAxisOptions,
  ChartAxisPosition,
  ChartAxisScale,
  ChartBoxplotGroup,
  ChartCandlestickDatum,
  ChartCandlestickLabels,
  ChartCandlestickStyle,
  ChartCoordinate,
  ChartCrosshairMode,
  ChartCrosshairStyle,
  ChartDatum,
  ChartDumbbellRow,
  ChartFlowLink,
  ChartFlowNode,
  ChartGeometry,
  ChartGlow,
  ChartHalo,
  ChartHeatmapCell,
  ChartHierarchyNode,
  ChartHoverMode,
  ChartInteraction,
  ChartInteractionEvent,
  ChartInteractionPhase,
  ChartLabelPosition,
  ChartLineAnnotation,
  ChartMarkerStyle,
  ChartNumberFormat,
  ChartOrientation,
  ChartPlotPadding,
  ChartPlotStyle,
  ChartPointAnnotation,
  ChartPulse,
  ChartRadarAxis,
  ChartRangeAnnotation,
  ChartRevealAnimation,
  ChartRevealEasing,
  ChartRevealStyle,
  ChartScatterPoint,
  ChartScatterSeries,
  ChartSelectionMarker,
  ChartSelectionMode,
  ChartSeries,
  ChartSeriesStyle,
  ChartSurface,
  ChartSurfacePadding,
  ChartSymbol,
  ChartTextAnnotation,
  ChartTheme,
  ChartThemeColors,
  ChartTimePoints,
  ChartTransition,
  ChartTypography,
  NativeChartAnimation,
  NativeChartAnnotation,
  NativeChartAxisOptions,
  NativeChartAxisPosition,
  NativeChartInteraction,
  NativeChartLineAnnotation,
  NativeChartPointAnnotation,
  NativeChartSeriesStyle,
  NativeChartTheme,
  StyledChartSeries,
} from '@hzblj/zyplot-core'

/**
 * How many series the palette has colours for. Past seven, fold the rest into an
 * "other" bucket or split the chart, rather than generating a colour.
 */
export const CHART_SERIES_LIMIT = 7

/**
 * The limit for forms where any two series can end up side by side, such as
 * scatter. Only the first three slots stay apart for colour-blind readers there.
 */
export const CHART_ALL_PAIRS_SERIES_LIMIT = 3

/** One legend entry: a colour swatch and the already-translated series name. */
export type ChartLegendItem = {
  color: string
  id: string
  label: string
}

/** What every web chart accepts on top of its own data props. */
export type ChartBaseProps = {
  /** Mark entrance, traced reveal and data-update animation. */
  animation?: NativeChartAnimation
  /** Reference lines, highlighted ranges, points and text anchored to the plot. */
  annotations?: readonly NativeChartAnnotation[]
  /** Controls the visible axes on cartesian chart forms. */
  axis?: ChartAxes
  className?: string
  /**
   * Hold true while the data is in flight. The chart shows its own `Skeleton` at
   * the same height, then cross-fades into the plot, so nothing on the page moves.
   */
  isLoading?: boolean
  /** Plot height in px. The chart never measures its own content. */
  height?: number
  /** Hover, crosshair, marker, tooltip, selection, pan and zoom behavior. */
  interaction?: NativeChartInteraction
  /** Replaces the built-in loading state. Shown only while `isLoading` is true. */
  skeleton?: ReactNode
  /**
   * Receives normalized pointer and selection data in client components. Scrubbing
   * arrives as `'began'`, `'changed'` and `'ended'` phases, and the plot's box as a
   * `'layout'` one — `useChartScrub` turns all of it into a selection for you.
   */
  onInteraction?: (event: ChartInteractionEvent) => void
  /** Plot-only surface, border, clipping and inset. */
  plot?: ChartPlotStyle
  /** Stable per-series styling keyed by `ChartSeries.id`. */
  seriesStyles?: Readonly<Record<string, NativeChartSeriesStyle>>
  /**
   * The box the chart sits in: background, padding, corners, border. Merges over
   * whatever `Chart.Provider` set, key by key.
   */
  surface?: ChartSurface
  /**
   * Draws patterns over the fills, so the series stay apart without relying on
   * colour. Useful for print and for full colour-vision deficiency. Off by default.
   */
  texture?: boolean
  /** Colours and fonts for this chart alone. Merges over `Chart.Provider`'s, key by key. */
  theme?: ChartTheme
  /** Detailed horizontal-axis configuration. */
  xAxis?: NativeChartAxisOptions
  /** Detailed vertical-axis configuration. */
  yAxis?: NativeChartAxisOptions
}

/** What every chart's `Skeleton` accepts. The same shape for all of them. */
export type ChartSkeletonProps = {
  className?: string
  height?: number
  /** Series the real chart will show, so the legend row is reserved at the right width. */
  legendCount?: number
  /** Reserves the horizontal-axis label row. */
  xAxis?: boolean
  /** Reserves the vertical-axis label column. */
  yAxis?: boolean
}
