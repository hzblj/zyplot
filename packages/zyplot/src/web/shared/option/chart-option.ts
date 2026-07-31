import {isHiddenAnnotation} from '../../../shared/annotation-views'
import {escapeChartHtml, formatChartNumber} from '../format'
import {isRevealSeriesId} from '../reveal'
import {type ChartTokens, emphasisSeriesColor} from '../tokens'
import type {
  ChartAnimation,
  ChartAxes,
  ChartInteraction,
  ChartLegendItem,
  ChartNumberFormat,
  ChartPlotStyle,
  NativeChartAnnotation,
  NativeChartAxisOptions,
  NativeChartInteraction,
} from '../types'

const AXIS_GUTTER = 26
const AXIS_GUTTER_BARE = 6
/**
 * What the plot keeps clear of the container's sides when the axis asks for nothing. A
 * `plotDimensionStartPadding` or `plotDimensionEndPadding` replaces it rather than adding to it, so
 * a `0` runs the marks to the edge the way it does on native.
 */
const PLOT_SIDE = {end: 8, start: 4} as const
const OVERLAY_LABEL_INSET = 8
/**
 * The dotted axis row: a dot at every category, and the longer mark that caps a named one. The dot
 * is a stroke of almost no length, since a round cap on a short one is a circle of its own width —
 * `0` is dropped before it reaches the canvas, so it has to be a hair longer than nothing.
 *
 * The row hangs from the plot's bottom edge here. An axis `offset` would move it down, but the grid
 * gives up the same height to pay for it, which moves the marks up by as much as the row went down.
 */
const AXIS_ROW = {cap: 6, capWidth: 1.6, dot: 2, dotLength: 0.5, labelGap: 4} as const
const ANNOTATION_LABEL_SIZE = 11
const PLOT_TOP = 8
const UPDATE_DURATION = 320
export const CROSSHAIR_LABEL_SIZE = 13
export const CROSSHAIR_LABEL_LIFT = 8
export const CROSSHAIR_LABEL_PADDING_ACROSS = 10
export const CROSSHAIR_LABEL_PADDING_DOWN = 5

export const crosshairHeadroom = (interaction?: NativeChartInteraction): number => {
  const style = interaction?.crosshairStyle
  if (!style?.labels?.length || interaction?.crosshair === 'none' || interaction?.hover === 'none') {
    return 0
  }

  const padding = typeof style.labelPadding === 'number' ? style.labelPadding : style.labelPadding?.y
  const down = style.labelBackground ? (padding ?? CROSSHAIR_LABEL_PADDING_DOWN) : 0

  return (style.labelSize ?? CROSSHAIR_LABEL_SIZE) + down * 2 + (style.labelLift ?? CROSSHAIR_LABEL_LIFT)
}

export type ChartAxisPointerKind = 'line' | 'none' | 'shadow'

export type ChartTooltipRow = {
  color?: string
  label: string
  value: string
}

export const buildChartTextStyle = (tokens: ChartTokens) => ({
  color: tokens.label,
  fontFamily: tokens.fontFamily,
})

const renderTooltipHeading = (title: string | undefined): string => {
  if (!title) {
    return ''
  }

  return `<span class="text-caption-medium text-content-secondary">${escapeChartHtml(title)}</span>`
}

const renderTooltipSwatch = (color: string | undefined): string => {
  if (!color) {
    return ''
  }

  return `<span class="size-2 shrink-0 rounded-[2px]" style="background:${color}"></span>`
}

const renderTooltipRow = (row: ChartTooltipRow): string =>
  [
    '<span class="flex items-center gap-2">',
    renderTooltipSwatch(row.color),
    `<span class="flex-1 text-footnote text-content-secondary">${escapeChartHtml(row.label)}</span>`,
    `<span class="text-footnote-medium text-content-primary tabular-nums">${escapeChartHtml(row.value)}</span>`,
    '</span>',
  ].join('')

export const renderChartTooltip = (title: string | undefined, rows: ChartTooltipRow[]): string => {
  const heading = renderTooltipHeading(title)
  const body = rows.map(renderTooltipRow).join('')

  return `<span class="flex min-w-36 flex-col gap-1.5 px-3 py-2">${heading}${body}</span>`
}

export const buildChartTooltip = (tokens: ChartTokens, pointer: ChartAxisPointerKind = 'none') => ({
  axisPointer: {
    lineStyle: {color: tokens.axis, width: 1},
    shadowStyle: {color: 'transparent'},
    type: pointer,
  },
  backgroundColor: tokens.surface,
  borderColor: tokens.border,
  borderRadius: 10,
  borderWidth: 1,
  padding: 0,
  shadowBlur: 0,
  shadowColor: 'transparent',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  textStyle: buildChartTextStyle(tokens),
  transitionDuration: 0.15,
})

type ChartDimensionPadding = Pick<NativeChartAxisOptions, 'plotDimensionEndPadding' | 'plotDimensionStartPadding'>

/**
 * Where the plot sits in its container. The x axis' plot-dimension paddings are the room at the
 * sides, the y axis' the room above the highest reading and below the lowest — whichever of the two
 * carries the values. What an axis names replaces the reserve rather than adding to it.
 */
export type ChartGridInsets = {
  across?: ChartDimensionPadding
  down?: ChartDimensionPadding
  hasCategoryGutter?: boolean
  headroom?: number
  plot?: ChartPlotStyle
}

/** The room under the marks: the label row when there is one, and the reserve either way. */
const gridFloor = ({down, hasCategoryGutter = true}: ChartGridInsets) =>
  down?.plotDimensionStartPadding ?? (hasCategoryGutter ? AXIS_GUTTER : AXIS_GUTTER_BARE)

const gridHeadroom = ({down, headroom = 0}: ChartGridInsets) => (down?.plotDimensionEndPadding ?? PLOT_TOP) + headroom

const plotPadding = (plot?: ChartPlotStyle) =>
  typeof plot?.padding === 'number'
    ? {bottom: plot.padding, left: plot.padding, right: plot.padding, top: plot.padding}
    : plot?.padding

export const buildChartGrid = (insets: ChartGridInsets = {}) => {
  const {across, plot} = insets
  const padding = plotPadding(plot)

  return {
    backgroundColor: plot?.backgroundColor,
    borderColor: plot?.borderColor,
    borderWidth: plot?.borderWidth,
    bottom: gridFloor(insets) + (padding?.bottom ?? 0),
    left: (across?.plotDimensionStartPadding ?? PLOT_SIDE.start) + (padding?.left ?? 0),
    outerBoundsContain: 'all' as const,
    outerBoundsMode: 'same' as const,
    right: (across?.plotDimensionEndPadding ?? PLOT_SIDE.end) + (padding?.right ?? 0),
    show: Boolean(plot?.backgroundColor || plot?.borderColor || (plot?.borderWidth ?? 0) > 0),
    top: gridHeadroom(insets) + (padding?.top ?? 0),
  }
}

export const plotInnerHeight = (height: number | undefined, insets: ChartGridInsets = {}) => {
  if (!height) {
    return 0
  }

  const padding = plotPadding(insets.plot)
  const bottom = gridFloor(insets) + (padding?.bottom ?? 0)
  return Math.max(0, height - bottom - gridHeadroom(insets) - (padding?.top ?? 0))
}

const customValues = (options?: NativeChartAxisOptions) =>
  options?.tickValues?.length ? [...options.tickValues] : undefined

/**
 * How far the labels sit off the plot's edge. An overlaid axis has a default of its own because it
 * is reaching back inside the plot; a gutter axis takes ECharts' own spacing unless it was told a
 * distance, so the labels land where `frame-skeleton` already draws its placeholders.
 */
export const axisLabelMargin = (options?: NativeChartAxisOptions) => {
  if (options?.labelInset !== undefined) {
    return {margin: options.labelInset}
  }
  return options?.position === 'overlay' ? {margin: OVERLAY_LABEL_INSET} : undefined
}

export const buildCategoryAxis = (
  tokens: ChartTokens,
  categories: readonly string[],
  isRotated = false,
  options?: NativeChartAxisOptions
) => {
  let rotate = options?.labelRotation ?? 0
  if (isRotated) {
    rotate = 40
  }
  const capsRow = (options?.ticks ?? false) && options?.minorTicks === true
  const edgeAlign = options?.labelEdgeAlign === true

  return {
    axisLabel: {
      // Room for the row of marks, which the default margin is drawn straight through.
      ...(capsRow ? {margin: AXIS_ROW.cap + AXIS_ROW.labelGap} : {}),
      ...axisLabelMargin(options),
      alignMaxLabel: edgeAlign ? ('right' as const) : undefined,
      alignMinLabel: edgeAlign ? ('left' as const) : undefined,
      color: tokens.label,
      customValues: customValues(options),
      fontFamily: tokens.fontFamily,
      fontSize: options?.labelSize ?? 11,
      hideOverlap: true,
      rotate,
    },
    // A domain line is the one thing neither native renderer draws, and the row of marks is the
    // axis where it is asked for.
    axisLine: {lineStyle: {color: tokens.grid}, show: !capsRow},
    axisTick: {
      // Under the label rather than on the seam between two bands, the way both native renderers
      // draw it.
      alignWithLabel: true,
      customValues: customValues(options),
      length: capsRow ? AXIS_ROW.cap : undefined,
      lineStyle: capsRow ? {cap: 'round' as const, color: tokens.axis, width: AXIS_ROW.capWidth} : undefined,
      show: options?.ticks ?? false,
    },
    data: categories,
    inverse: options?.reversed,
    name: options?.label,
    position: options?.position === 'end' ? ('top' as const) : ('bottom' as const),
    splitLine: {
      lineStyle: {
        color: tokens.grid,
        type: options?.gridDash?.length ? options.gridDash : undefined,
      },
      show: options?.grid ?? false,
    },
    type: options?.scale === 'time' ? ('time' as const) : ('category' as const),
  }
}

/**
 * The dense row of dots, which rides a second axis over the same grid: a renderer keeps one tick
 * style per axis, and the row and the longer marks capping it are two. The named ticks stay on the
 * category axis and this one draws nothing but the dots between them. Undefined — nothing to lay
 * out — unless the axis asked for both `ticks` and `minorTicks`.
 */
export const buildMinorTickAxis = (
  tokens: ChartTokens,
  categories: readonly string[],
  options?: NativeChartAxisOptions
) => {
  if (!(options?.ticks ?? false) || options?.minorTicks !== true || !categories.length) {
    return undefined
  }

  return {
    axisLabel: {show: false},
    /**
     * A line of no width, drawn for its end symbol alone: the mark that closes the row sits on the
     * trailing edge of the last band, where a band scale has no category left to hang a tick on.
     */
    axisLine: {
      lineStyle: {color: tokens.axis, width: 0},
      show: true,
      symbol: ['none', 'rect'],
      symbolSize: [AXIS_ROW.cap, AXIS_ROW.capWidth],
    },
    axisPointer: {show: false},
    axisTick: {
      alignWithLabel: true,
      // Every category. Left to itself the axis thins a dense row out to every second one.
      interval: 0,
      length: AXIS_ROW.dotLength,
      lineStyle: {cap: 'round' as const, color: tokens.axis, width: AXIS_ROW.dot},
      show: true,
    },
    data: [...categories],
    // Down onto the middle of the caps, so the row reads as one line of marks and not as two.
    offset: (AXIS_ROW.cap - AXIS_ROW.dotLength) / 2,
    position: 'bottom' as const,
    splitLine: {show: false},
    type: 'category' as const,
  }
}

const axisBound = (domain: NativeChartAxisOptions['domain'], end: 'max' | 'min') => {
  const pinned = domain?.[end]
  if (pinned !== undefined) {
    return pinned
  }
  const padding = domain?.padding
  if (!padding) {
    return undefined
  }
  return ({min, max}: {max: number; min: number}) =>
    end === 'max' ? max + (max - min) * padding : min - (max - min) * padding
}

export const buildValueAxis = (tokens: ChartTokens, format?: ChartNumberFormat, options?: NativeChartAxisOptions) => {
  const isOverlaid = options?.position === 'overlay'

  return {
    axisLabel: {
      ...axisLabelMargin(options),
      color: tokens.label,
      customValues: customValues(options),
      fontFamily: tokens.fontFamily,
      fontSize: options?.labelSize ?? 11,
      formatter: (value: number) => formatChartNumber(value, format),
    },
    axisLine: {show: false},
    axisTick: {customValues: customValues(options), show: options?.ticks ?? false},
    inverse: options?.reversed,
    max: axisBound(options?.domain, 'max'),
    min: axisBound(options?.domain, 'min'),
    name: options?.label,
    position: isOverlaid || options?.position === 'end' ? ('right' as const) : ('left' as const),
    splitLine: {
      lineStyle: {
        color: tokens.grid,
        type: options?.gridDash?.length ? options.gridDash : undefined,
      },
      show: options?.grid ?? true,
    },
    splitNumber: options?.tickCount,
    type: options?.scale === 'log' ? ('log' as const) : ('value' as const),
  }
}

export const buildCartesianAxes = (
  tokens: ChartTokens,
  categories: readonly string[],
  format: ChartNumberFormat | undefined,
  isHorizontal: boolean,
  axes?: ChartAxes,
  xAxis?: NativeChartAxisOptions,
  yAxis?: NativeChartAxisOptions
) => {
  const categoryAxis = {
    ...buildCategoryAxis(tokens, categories, false, isHorizontal ? yAxis : xAxis),
    show: isHorizontal ? (yAxis?.visible ?? axes?.y) !== false : (xAxis?.visible ?? axes?.x) !== false,
  }
  const valueAxis = {
    ...buildValueAxis(tokens, format, isHorizontal ? xAxis : yAxis),
    show: isHorizontal ? (xAxis?.visible ?? axes?.x) !== false : (yAxis?.visible ?? axes?.y) !== false,
  }

  if (isHorizontal) {
    return {xAxis: valueAxis, yAxis: categoryAxis}
  }

  // The dot row is a second axis under the same grid, and only a horizontal category axis has one.
  const minorTicks = buildMinorTickAxis(tokens, categories, xAxis)

  return {xAxis: minorTicks ? [categoryAxis, minorTicks] : categoryAxis, yAxis: valueAxis}
}

export const chartUpdateAnimation = (animation?: ChartAnimation) => ({
  animationDurationUpdate: animation?.updates === false ? 0 : (animation?.duration ?? UPDATE_DURATION),
  animationEasingUpdate: chartEasing(animation?.easing),
})

export const buildChartBaseOption = (tokens: ChartTokens, texture = false, animation?: ChartAnimation) => ({
  animation: animation?.enabled ?? true,
  animationDelay: animation?.delay ?? 0,
  animationDuration: animation?.duration ?? UPDATE_DURATION,
  animationEasing: chartEasing(animation?.easing),
  ...chartUpdateAnimation(animation),
  aria: {decal: {show: texture}, enabled: texture},
  textStyle: buildChartTextStyle(tokens),
})

export const chartEasing = (easing: ChartAnimation['easing'] | undefined) => {
  switch (easing) {
    case 'linear':
      return 'linear' as const
    case 'ease-in':
      return 'cubicIn' as const
    case 'ease-in-out':
      return 'cubicInOut' as const
    case 'spring':
      return 'elasticOut' as const
    default:
      return 'cubicOut' as const
  }
}

export const buildChartInteraction = (tokens: ChartTokens, interaction?: ChartInteraction, drawsCrosshair = false) => {
  let pointer: ChartAxisPointerKind = 'line'
  if (drawsCrosshair || interaction?.crosshair === 'none' || interaction?.hover === 'none') {
    pointer = 'none'
  }
  if (interaction?.hover === 'axis' && interaction?.crosshair === 'none') {
    pointer = 'shadow'
  }

  return {
    ...buildChartTooltip(tokens, pointer),
    show: interaction?.tooltip ?? true,
    trigger: interaction?.hover === 'nearest' ? ('item' as const) : ('axis' as const),
  }
}

export const buildChartEmphasis = (interaction?: ChartInteraction) => ({
  blur: {itemStyle: {opacity: interaction?.dimOpacity}, lineStyle: {opacity: interaction?.dimOpacity}},
  emphasis: {
    focus: interaction?.dimOpacity === undefined ? ('none' as const) : ('self' as const),
    scale: interaction?.highlightScale !== undefined,
  },
})

export type ChartAnnotationContext = {
  drawsPoints?: boolean
  domain?: {max?: number; min?: number}
  isScrubbing?: boolean
  label: string
}

const labelPosition = (
  item: Extract<NativeChartAnnotation, {type: 'line'}>,
  domain?: {max?: number; min?: number}
): string => {
  if (item.axis === 'x') {
    return item.labelPosition === 'bottom' ? 'start' : 'end'
  }

  switch (item.labelPosition) {
    case 'bottom':
      return 'insideEndBottom'
    case 'top':
      return 'insideEndTop'
    case 'leading':
      return 'insideStartTop'
    case 'trailing':
      return 'insideEndTop'
    default: {
      const {max, min} = domain ?? {}
      if (typeof item.value !== 'number' || max === undefined || min === undefined || max === min) {
        return 'insideStartTop'
      }
      return (item.value - min) / (max - min) > 0.6 ? 'insideStartBottom' : 'insideStartTop'
    }
  }
}

const annotationOpacity = (scrubOpacity: number | undefined, isScrubbing: boolean | undefined): number | undefined =>
  isScrubbing ? (scrubOpacity ?? 1) : 1

export const buildChartAnnotationOption = (
  annotations: readonly NativeChartAnnotation[] | undefined,
  context?: ChartAnnotationContext
) => {
  const values = (annotations ?? []).filter(item => !isHiddenAnnotation(item))
  const lines = values.filter(item => item.type === 'line')
  const ranges = values.filter(item => item.type === 'range')
  const points = values.filter((item): item is Extract<NativeChartAnnotation, {type: 'point' | 'text'}> =>
    context?.drawsPoints ? item.type === 'text' : item.type === 'point' || item.type === 'text'
  )
  const labelColor = context?.label

  return {
    markArea: ranges.length
      ? {
          data: ranges.map(item => [
            item.axis === 'x' ? {name: item.label, xAxis: item.start} : {name: item.label, yAxis: item.start},
            item.axis === 'x' ? {xAxis: item.end} : {yAxis: item.end},
          ]),
          itemStyle: {
            color: ranges[0]?.color,
            opacity: ranges[0]?.opacity ?? 0.12,
          },
          silent: true,
        }
      : undefined,
    markLine: lines.length
      ? {
          data: lines.map(item => {
            const opacity = annotationOpacity(item.scrubOpacity, context?.isScrubbing)

            return {
              label: {
                backgroundColor: item.labelBackground,
                borderRadius: item.labelBackground ? 3 : 0,
                color: item.color ?? labelColor,
                fontSize: ANNOTATION_LABEL_SIZE,
                formatter: item.label,
                opacity,
                padding: item.labelBackground ? [2, 4] : 0,
                position: labelPosition(item, context?.domain),
                show: Boolean(item.label),
              },
              lineStyle: {
                color: item.color ?? labelColor,
                opacity,
                type: item.dash?.length ? item.dash : 'solid',
                width: item.width,
              },
              name: item.id,
              ...(item.axis === 'x' ? {xAxis: item.value} : {yAxis: item.value}),
            }
          }),
          silent: true,
          symbol: 'none',
        }
      : undefined,
    markPoint: points.length
      ? {
          data: points.map(item => ({
            coord: [item.x, item.y],
            itemStyle: {color: item.color},
            name: item.type === 'text' ? item.text : item.label,
            value: item.type === 'text' ? item.text : item.label,
          })),
          silent: true,
          symbolSize: 34,
        }
      : undefined,
  }
}

type ChartLegendSource = {
  id: string
  label: string
  slot?: number
}

export const buildChartLegendItems = (
  tokens: ChartTokens,
  entries: readonly ChartLegendSource[],
  emphasisId?: string
): ChartLegendItem[] =>
  entries.map((entry, index) => ({
    color: emphasisSeriesColor(tokens, entry, index, emphasisId),
    id: entry.id,
    label: entry.label,
  }))

const toParamList = (params: any): any[] => {
  if (Array.isArray(params)) {
    return params
  }

  return [params]
}

export const firstTooltipParam = (params: any): any => toParamList(params)[0]
export const buildAxisTooltipFormatter =
  (format?: ChartNumberFormat) =>
  (params: any): string => {
    const items = toParamList(params).filter(item => !isRevealSeriesId(item?.seriesId))
    const rows: ChartTooltipRow[] = items.map(item => ({
      color: item.color,
      label: item.seriesName,
      value: formatChartNumber(item.value, format),
    }))

    return renderChartTooltip(items[0]?.axisValueLabel, rows)
  }
