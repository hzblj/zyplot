/** Every chart form the native renderers can draw. */
export const NATIVE_CHART_KINDS = [
  'line',
  'area',
  'bar',
  'stacked-bar',
  'pie',
  'gauge',
  'meter',
  'histogram',
  'boxplot',
  'candlestick',
  'diverging-bar',
  'dumbbell',
  'funnel',
  'heatmap',
  'radar',
  'scatter',
  'sankey',
  'sunburst',
  'treemap',
  'time-series',
  'sparkline',
] as const

/** The name of one native chart form, e.g. `'line'` or `'candlestick'`. */
export type NativeChartKind = (typeof NATIVE_CHART_KINDS)[number]
