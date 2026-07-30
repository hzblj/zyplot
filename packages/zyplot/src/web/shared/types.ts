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

export type ChartSkeletonProps = {
  className?: string
  height?: number
  legendCount?: number
  xAxis?: boolean
  yAxis?: boolean
}
