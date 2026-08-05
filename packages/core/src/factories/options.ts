import type {
  ChartGlow,
  ChartHalo,
  ChartSeriesFill,
  NativeChartAnimation,
  NativeChartInteraction,
  NativeChartSeriesStyle,
} from '../contracts/chart-native'
import type {ChartPlotStyle} from '../contracts/chart-presentation'
import type {ChartSurface} from '../contracts/chart-surface'
import type {ChartNumberFormat, ChartTheme} from '../contracts/chart-theme'

// Typed passthroughs for the option groups. They add no safety a prop's own type does not already
// give — what they add is a name to import and hold, so a preset can be declared and reused away
// from the chart that consumes it, and read as one thing rather than as an anonymous object.

/**
 * The entrance and the transition data changes take under a mounted chart.
 *
 * @example
 * const arrival = animation({reveal: reveal.draw({duration: 420})})
 */
export const animation = (options: NativeChartAnimation): NativeChartAnimation => options

/**
 * The whole interaction group, and `interaction.scrub()` for the shape a reading under a finger
 * almost always takes: a vertical crosshair, a tick as it moves, and the nearest mark rather than
 * the axis slice. Anything you pass wins over the preset.
 *
 * What appears for the reading is the `tooltip` prop's to say, not this group's — `tooltip: false`
 * for none, a `tooltip.above({view})` for one of your own.
 *
 * @example
 * const scrubbing = interaction.scrub({dimOpacity: 0.5, marker: marker.trail({dot: true})})
 */
export const interaction = Object.assign((options: NativeChartInteraction): NativeChartInteraction => options, {
  scrub: (overrides: NativeChartInteraction = {}): NativeChartInteraction => ({
    crosshair: 'x',
    haptics: true,
    hover: 'nearest',
    ...overrides,
  }),
})

/** Overrides for one series, as a name a style sheet can hold away from the chart. */
export const seriesStyle = (options: NativeChartSeriesStyle): NativeChartSeriesStyle => options

/** The plot area's own styling: its background, its border, whether it clips its marks. */
export const plot = (options: ChartPlotStyle): ChartPlotStyle => options

/** The card the chart sits on, which a `Chart.Provider` can set for everything below it. */
export const surface = (options: ChartSurface): ChartSurface => options

/** Colours and typography, shared by every chart that is given it. */
export const theme = (options: ChartTheme): ChartTheme => options

/** How numbers read: their decimals, their locale, what sits either side of them. */
export const format = (options: ChartNumberFormat): ChartNumberFormat => options

/** A soft bloom around a mark. Reach for `halo` instead when it needs an edge. */
export const glow = (options: ChartGlow): ChartGlow => options

/** A hard disc behind a point, so a small bright dot can sit in a larger ring. */
export const halo = (options: ChartHalo): ChartHalo => options

/** What fills the area under a trace: a pattern, its spacing, how far it fades out. */
export const fill = (options: ChartSeriesFill): ChartSeriesFill => options
