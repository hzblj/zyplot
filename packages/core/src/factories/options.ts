import type {
  ChartGlow,
  ChartHalo,
  NativeChartAnimation,
  NativeChartInteraction,
  NativeChartSeriesStyle,
} from '../contracts/chart-native'
import type {ChartPlotStyle} from '../contracts/chart-presentation'
import type {ChartSurface} from '../contracts/chart-surface'
import type {ChartNumberFormat, ChartTheme} from '../contracts/chart-theme'

/**
 * Typed passthroughs for the option groups that have no variants to get wrong.
 *
 * They add no safety a prop's own type does not already give — what they add is a
 * name to import and hold, so a preset can be declared and reused away from the
 * chart that consumes it, and read as one thing rather than as an anonymous object.
 *
 * @example
 * const scrubbing = interaction({crosshair: 'x', haptics: true, marker: marker.segment({span: 2})})
 * const arrival = animation({reveal: reveal.draw({duration: 420})})
 */
export const animation = (options: NativeChartAnimation): NativeChartAnimation => options

export const interaction = (options: NativeChartInteraction): NativeChartInteraction => options

export const seriesStyle = (options: NativeChartSeriesStyle): NativeChartSeriesStyle => options

export const plot = (options: ChartPlotStyle): ChartPlotStyle => options

export const surface = (options: ChartSurface): ChartSurface => options

export const theme = (options: ChartTheme): ChartTheme => options

export const format = (options: ChartNumberFormat): ChartNumberFormat => options

export const glow = (options: ChartGlow): ChartGlow => options

export const halo = (options: ChartHalo): ChartHalo => options
