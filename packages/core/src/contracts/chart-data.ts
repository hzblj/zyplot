/** One named line of values, aligned to the chart's shared category axis. */
export type ChartSeries = {
  /** Overrides the palette colour for this series. */
  color?: string
  /** Stable identity, used as the React key and for hover correlation. */
  id: string
  /** Display name, already translated. */
  label: string
  /** Palette slot, 1-based. Omit and the series takes its index. */
  slot?: number
  /** `null` is a gap and is drawn as one, never as zero. */
  values: readonly (number | null)[]
}

/** A labelled single value. Used by pie, funnel and other ranked forms. */
export type ChartDatum = {
  color?: string
  id: string
  label: string
  slot?: number
  value: number
}

/** One point in a scatter plot. */
export type ChartScatterPoint = {
  label?: string
  /** Bubble size. Omit and every point draws the same. */
  size?: number
  x: number
  y: number
}

/** A named group of scatter points. */
export type ChartScatterSeries = {
  color?: string
  id: string
  label: string
  points: readonly ChartScatterPoint[]
  slot?: number
}

/** One cell of a heatmap grid, addressed by row and column index. */
export type ChartHeatmapCell = {
  columnIndex: number
  rowIndex: number
  /** `null` draws an empty cell instead of the low end of the ramp. */
  value: number | null
}

/** A before/after pair for one row of a dumbbell chart. */
export type ChartDumbbellRow = {
  after: number
  before: number
  id: string
  label: string
}

/** The five-number summary of one distribution, plus its outliers. */
export type ChartBoxplotGroup = {
  id: string
  label: string
  max: number
  median: number
  min: number
  outliers?: readonly number[]
  q1: number
  q3: number
}

/** One node of a hierarchy. Leaves carry a value, parents sum their children. */
export type ChartHierarchyNode = {
  children?: readonly ChartHierarchyNode[]
  color?: string
  id: string
  label: string
  slot?: number
  value?: number
}

/** A weighted edge between two flow nodes, referenced by their `id`. */
export type ChartFlowLink = {
  source: string
  target: string
  value: number
}

/** One node of a flow diagram. */
export type ChartFlowNode = {
  color?: string
  id: string
  label: string
  slot?: number
}

/** One axis of a radar chart. Each axis is scaled on its own. */
export type ChartRadarAxis = {
  label: string
  /** Upper bound for this axis. */
  max: number
}

/** A dense time series, held as parallel arrays. */
export type ChartTimePoints = {
  /** Unix seconds, ascending. */
  timestamps: readonly number[]
  /** One entry per series, each as long as `timestamps`. */
  values: readonly (readonly (number | null)[])[]
}
