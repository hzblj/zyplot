import type {
  ChartAxes,
  ChartInteractionEvent,
  ChartInteractionHandler,
  ChartNumberFormat,
  ChartOrientation,
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
import type {ChartSlotViewProps} from '../../shared/chart-slots'

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
  ChartBandAlign,
  ChartBoxplotGroup,
  ChartCandlestickDatum,
  ChartCandlestickLabels,
  ChartCandlestickStyle,
  ChartColorMode,
  ChartCoordinate,
  ChartCrosshairMode,
  ChartCrosshairStyle,
  ChartDatum,
  ChartDumbbellRow,
  ChartFillPattern,
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
  ChartInteractionHandler,
  ChartInteractionPhase,
  ChartInteractionRange,
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
  ChartRangeStyle,
  ChartRevealAnimation,
  ChartRevealEasing,
  ChartRevealStyle,
  ChartScatterPoint,
  ChartScatterSeries,
  ChartSelectionMarker,
  ChartSelectionMode,
  ChartSeries,
  ChartSeriesFill,
  ChartSeriesStyle,
  ChartSurface,
  ChartSurfacePadding,
  ChartSymbol,
  ChartTextAnnotation,
  ChartTheme,
  ChartThemeColors,
  ChartTimePoints,
  ChartTooltipAnchor,
  ChartTooltipPlacement,
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
  ZyplotChartProps,
  ZyplotFactories,
} from '@hzblj/zyplot-core'

/** One swatch in a legend: the colour drawn, and the series it names. */
export type ChartLegendItem = {
  color: string
  id: string
  label: string
}

/**
 * The event as this renderer makes it: the app's event, plus where the pointer is.
 *
 * The position is not on the app's event and never reaches it — a reading crossing into an app to be
 * laid out again is what lags. It is here because on the DOM the renderer is JavaScript too, and the
 * one thing that reads it is the wrapper that places the app's own nodes over the plot. That wrapper
 * takes it off the event before passing it on; see `withAnnotationViews`.
 */
export type ChartRendererEvent = ChartInteractionEvent & {
  nativeX?: number
  nativeY?: number
}

/**
 * What every chart on the DOM takes, whichever form it is.
 *
 * The wider prop groups are split off below rather than gathered here, because a form that
 * cannot draw an axis has nothing to do with `xAxis` and a form with no scrub layer has nothing
 * to do with `interaction`. Accepting them anyway made the type say yes to options the renderer
 * would quietly drop.
 */
export type ChartBaseProps = {
  animation?: NativeChartAnimation
  className?: string
  height?: number
  isLoading?: boolean
  skeleton?: ReactNode
  surface?: ChartSurface
  texture?: boolean
  theme?: ChartTheme
}

/** `ChartBaseProps` plus the switch that hides a pair of axes, for the forms that draw them. */
export type ChartAxesProps = ChartBaseProps & {
  axis?: ChartAxes
}

/**
 * The forms that read the pointer: a plot to style, axes to pin, annotations over the marks and
 * your own nodes in their place. The slots are declared here rather than added by the wrapper, so
 * they survive every other wrapper the chart is built from — an intersection of call signatures is
 * what a props type bolted on outside collapses into.
 */
export type ChartPlotProps = ChartAxesProps &
  ChartSlotViewProps & {
    annotations?: readonly NativeChartAnnotation[]
    interaction?: NativeChartInteraction
    onInteraction?: ChartInteractionHandler
    plot?: ChartPlotStyle
    xAxis?: NativeChartAxisOptions
    yAxis?: NativeChartAxisOptions
  }

/** `ChartPlotProps` for the forms plotted as named series, which can be styled one by one. */
export type ChartSeriesPlotProps = ChartPlotProps & {
  /** Keyed by `ChartSeries.id`. */
  seriesStyles?: Readonly<Record<string, NativeChartSeriesStyle>>
}

/**
 * What a placeholder is told about an axis: `false` for one the chart hides, or the options the
 * chart itself was given, so the gutter the plot will keep is the gutter the placeholder keeps.
 */
export type ChartSkeletonAxis = boolean | NativeChartAxisOptions

/**
 * What the built-in placeholder is told, so the box it holds while the data is in flight is the
 * box the chart will fill: the same gutters, the same number of marks, the same legend.
 */
export type ChartSkeletonProps = {
  /** The names the category axis will write, which is also how many marks the plot will hold. */
  categories?: readonly string[]
  className?: string
  /** How the value labels will read, since what they will need is what their gutter has to be. */
  format?: ChartNumberFormat
  height?: number
  legendCount?: number
  orientation?: ChartOrientation
  xAxis?: ChartSkeletonAxis
  yAxis?: ChartSkeletonAxis
}
