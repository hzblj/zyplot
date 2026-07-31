import type {
  ChartAxes,
  ChartInteractionEvent,
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
  ChartSeriesFill,
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

export const CHART_SERIES_LIMIT = 7
export const CHART_ALL_PAIRS_SERIES_LIMIT = 3

export type ChartLegendItem = {
  color: string
  id: string
  label: string
}

export type ChartBaseProps = {
  animation?: NativeChartAnimation
  annotations?: readonly NativeChartAnnotation[]
  axis?: ChartAxes
  className?: string
  isLoading?: boolean
  height?: number
  interaction?: NativeChartInteraction
  skeleton?: ReactNode
  onInteraction?: (event: ChartInteractionEvent) => void
  plot?: ChartPlotStyle
  seriesStyles?: Readonly<Record<string, NativeChartSeriesStyle>>
  surface?: ChartSurface
  texture?: boolean
  theme?: ChartTheme
  xAxis?: NativeChartAxisOptions
  yAxis?: NativeChartAxisOptions
}

/**
 * What a placeholder is told about an axis: `false` for one the chart hides, or the options the
 * chart itself was given, so the gutter the plot will keep is the gutter the placeholder keeps.
 */
export type ChartSkeletonAxis = boolean | NativeChartAxisOptions

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
