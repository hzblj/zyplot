/** Follow the OS setting, or pin the chart to one mode. */
export type ChartColorMode = 'dark' | 'light' | 'system'

/** Which way the bars of a bar-like chart run. */
export type ChartOrientation = 'horizontal' | 'vertical'

/** Which axes a cartesian chart shows. Both default to visible. */
export type ChartAxes = {
  x?: boolean
  y?: boolean
}

/** How numbers are written in axis labels, tooltips and direct labels. */
export type ChartNumberFormat = {
  /** Fraction digits. Defaults to 0. */
  decimals?: number
  /** BCP 47 tag, e.g. `'en-US'`. Defaults to the runtime locale. */
  locale?: string
  /** Goes before the number, usually a currency symbol. */
  prefix?: string
  /** Goes after the number, usually a unit or a percent sign. */
  suffix?: string
}

/**
 * The colours one chart is drawn with, on any platform. Every renderer reads all
 * of them, so a theme built from these is portable as it stands.
 */
export type ChartThemeColors = {
  axis?: string
  /** Series colours, in the order series take them. */
  categorical?: readonly string[]
  grid?: string
  label?: string
  /** The negative half of a signed scale: a losing bar, a falling candle. */
  negative?: string
  positive?: string
  /** Tooltip fill. */
  surface?: string
  /** The unfilled part of a gauge or a meter. */
  track?: string
}

export type ChartTypography = {
  /**
   * A resolved family name — a canvas cannot read a CSS variable, and neither can a
   * native renderer.
   *
   * Every platform resolves it the way its own text does: the DOM through
   * `--zyplot-font-family`, iOS through the registered-font lookup behind
   * `UIFont(name:)`, Android through React Native's font manager, which covers
   * `assets/fonts`, `res/font` and anything `expo-font` loaded at runtime. A family
   * the app never shipped falls back to the platform font on all three.
   */
  fontFamily?: string
}

/**
 * Colours and fonts one chart draws with, whichever renderer it lands on. Pass it
 * as a chart's own `theme`, where it merges over what the provider set.
 *
 * Two wider shapes build on this one, and both are supersets of it, so a value of
 * this type is valid wherever either is asked for: `NativeChartTheme` adds the
 * chart background a native surface can paint, and the web `ChartProviderTheme`
 * adds the palettes and greys only CSS variables can carry.
 */
export type ChartTheme = {
  colors?: ChartThemeColors
  typography?: ChartTypography
}

/** `ChartTheme` plus the one colour only a native chart paints for itself. */
export type NativeChartTheme = {
  colors?: ChartThemeColors & {
    /**
     * The chart's own background. Web charts take theirs as `surface.background`,
     * which exists on native too — reach for that when one theme has to do both.
     */
    background?: string
  }
  typography?: ChartTypography
}

/** The theme used when none is given. Spread it to change only a few keys. */
export const defaultChartTheme = {
  colors: {
    axis: '#71717a',
    background: 'transparent',
    categorical: ['#6d28d9', '#0284c7', '#ea580c', '#16a34a', '#db2777', '#ca8a04', '#7c3aed'],
    grid: '#e4e4e7',
    label: '#71717a',
    negative: '#dc2626',
    positive: '#16a34a',
    surface: '#ffffff',
    track: '#f4f4f5',
  },
} satisfies NativeChartTheme
