/**
 * The box a chart sits in: its background, border, corners and inset. `theme`
 * says what the marks look like, `surface` says what the container looks like.
 */
export type ChartSurface = {
  background?: string
  border?: {
    color?: string
    width?: number
  }
  cornerRadius?: number
  /** A number applies to all four sides. */
  padding?: number | ChartSurfacePadding
}

/** Per-side inset. The specific sides win over the shorthands. */
export type ChartSurfacePadding = {
  bottom?: number
  horizontal?: number
  left?: number
  right?: number
  top?: number
  vertical?: number
}

/**
 * Flattens any padding shorthand into the four sides. The most specific value
 * wins, as in CSS: single sides beat `horizontal`/`vertical`, which beat a number.
 */
export const resolveChartSurfacePadding = (
  padding: ChartSurface['padding']
): {bottom: number; left: number; right: number; top: number} | undefined => {
  if (padding === undefined) {
    return undefined
  }
  if (typeof padding === 'number') {
    return {bottom: padding, left: padding, right: padding, top: padding}
  }
  const {bottom, horizontal, left, right, top, vertical} = padding
  return {
    bottom: bottom ?? vertical ?? 0,
    left: left ?? horizontal ?? 0,
    right: right ?? horizontal ?? 0,
    top: top ?? vertical ?? 0,
  }
}

/**
 * Merges two surfaces key by key, with `override` winning. Lets one chart round
 * its own corners without restating the background it inherits.
 */
export const mergeChartSurface = (
  base: ChartSurface | undefined,
  override: ChartSurface | undefined
): ChartSurface | undefined => {
  if (!base) {
    return override
  }
  if (!override) {
    return base
  }
  return {
    ...base,
    ...override,
    border: override.border ? {...base.border, ...override.border} : base.border,
  }
}
