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
} from '../types'

const AXIS_GUTTER = 26
const AXIS_GUTTER_BARE = 6
const OVERLAY_LABEL_INSET = 8
const ANNOTATION_LABEL_SIZE = 11

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

/**
 * Room kept around the marks. `plotDimensionStartPadding` and `plotDimensionEndPadding`
 * are free space along the category axis — what stops a trace from running into an
 * overlaid label, which `labelInset` cannot do because it only moves the label inwards.
 */
export const buildChartGrid = (
  hasCategoryGutter = true,
  plot?: ChartPlotStyle,
  dimension?: Pick<NativeChartAxisOptions, 'plotDimensionEndPadding' | 'plotDimensionStartPadding'>
) => {
  let bottom = AXIS_GUTTER_BARE
  if (hasCategoryGutter) {
    bottom = AXIS_GUTTER
  }

  const padding =
    typeof plot?.padding === 'number'
      ? {
          bottom: plot.padding,
          left: plot.padding,
          right: plot.padding,
          top: plot.padding,
        }
      : plot?.padding

  return {
    backgroundColor: plot?.backgroundColor,
    borderColor: plot?.borderColor,
    borderWidth: plot?.borderWidth,
    bottom: bottom + (padding?.bottom ?? 0),
    left: 4 + (padding?.left ?? 0) + (dimension?.plotDimensionStartPadding ?? 0),
    outerBoundsContain: 'all' as const,
    outerBoundsMode: 'same' as const,
    right: 8 + (padding?.right ?? 0) + (dimension?.plotDimensionEndPadding ?? 0),
    show: Boolean(plot?.backgroundColor || plot?.borderColor || (plot?.borderWidth ?? 0) > 0),
    top: 8 + (padding?.top ?? 0),
  }
}

/** Exact ticks, when the reader is looking for specific values rather than a scale. */
const customValues = (options?: NativeChartAxisOptions) =>
  options?.tickValues?.length ? [...options.tickValues] : undefined

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

  const isOverlaid = options?.position === 'overlay'

  return {
    axisLabel: {
      color: tokens.label,
      customValues: customValues(options),
      fontFamily: tokens.fontFamily,
      fontSize: options?.labelSize ?? 11,
      hideOverlap: true,
      margin: isOverlaid ? (options?.labelInset ?? OVERLAY_LABEL_INSET) : undefined,
      rotate,
    },
    axisLine: {lineStyle: {color: tokens.grid}},
    axisTick: {customValues: customValues(options), show: options?.ticks ?? false},
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
 * One end of a value axis. A pinned end is passed through; an end that is computed
 * becomes a function, which is how ECharts hands back the data extent so `padding`
 * can be taken as a fraction of it.
 */
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

/**
 * `'overlay'` sets its labels against the plot's trailing edge, `labelInset` away from it,
 * in a band the marks stop short of — the same treatment the native renderers give it. They
 * are not drawn over the marks: a reading hanging in the middle of the plot reads as a
 * value on the data rather than as the scale it belongs to.
 */
export const buildValueAxis = (tokens: ChartTokens, format?: ChartNumberFormat, options?: NativeChartAxisOptions) => {
  const isOverlaid = options?.position === 'overlay'

  return {
    axisLabel: {
      color: tokens.label,
      customValues: customValues(options),
      fontFamily: tokens.fontFamily,
      fontSize: options?.labelSize ?? 11,
      formatter: (value: number) => formatChartNumber(value, format),
      margin: isOverlaid ? (options?.labelInset ?? OVERLAY_LABEL_INSET) : undefined,
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

  return {xAxis: categoryAxis, yAxis: valueAxis}
}

export const buildChartBaseOption = (tokens: ChartTokens, texture = false, animation?: ChartAnimation) => ({
  animation: animation?.enabled ?? true,
  animationDelay: animation?.delay ?? 0,
  animationDuration: animation?.duration ?? 320,
  animationDurationUpdate: animation?.updates === false ? 0 : (animation?.duration ?? 320),
  animationEasing: chartEasing(animation?.easing),
  aria: {decal: {show: texture}, enabled: texture},
  textStyle: buildChartTextStyle(tokens),
})

const chartEasing = (easing: ChartAnimation['easing'] | undefined) => {
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

/**
 * `drawsCrosshair` is for a chart that tracks the pointer itself: it draws the crosshair
 * over the plot, styled the way it was asked to, so ECharts must not draw a second one.
 */
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

/**
 * How the mark being read is picked out, as the states ECharts already has: `emphasis`
 * for the one under the pointer, `blur` for everything else.
 *
 * `highlightBlend` is why the emphasis colour is computed per mark rather than set once —
 * at anything below 1 the mark's own colour still has to read through.
 */
export const buildChartEmphasis = (interaction?: ChartInteraction) => ({
  blur: {itemStyle: {opacity: interaction?.dimOpacity}, lineStyle: {opacity: interaction?.dimOpacity}},
  emphasis: {
    focus: interaction?.dimOpacity === undefined ? ('none' as const) : ('self' as const),
    scale: interaction?.highlightScale !== undefined,
  },
})

export type ChartAnnotationContext = {
  /**
   * Where a `'point'` annotation is drawn. The overlay honours its glow, halo and pulse,
   * so a chart that has one leaves points out of the option.
   */
  drawsPoints?: boolean
  /** The value axis' extent, for a label that places itself. */
  domain?: {max?: number; min?: number}
  /** True while a mark is being read, which is when `scrubOpacity` applies. */
  isScrubbing?: boolean
  /** The token colour an annotation that names none falls back to. */
  label: string
}

/**
 * Which side of its rule a label sits on. `'auto'` keeps it inside the plot: above a rule
 * sitting low, below one sitting high.
 *
 * It also keeps it at the rule's leading end, because the trailing end is where an
 * `'overlay'` axis draws its own labels — a rule on a round number would otherwise print
 * that number twice, one on top of the other.
 */
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
  // A hidden annotation is still measured and still reported; it is only the drawing that
  // the app has taken over.
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
                // The label as it was written. Left to itself ECharts formats the value it
                // sits on, which drops a trailing zero the reader asked for.
                formatter: item.label,
                opacity,
                padding: item.labelBackground ? [2, 4] : 0,
                position: labelPosition(item, context?.domain),
                show: Boolean(item.label),
              },
              lineStyle: {
                color: item.color ?? labelColor,
                opacity,
                type: item.dash?.length ? item.dash : undefined,
                width: item.width,
              },
              name: item.label,
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
    // The strokes a traced entrance adds are the same data twice over, so they are the
    // reader's series only in the option, never in a tooltip.
    const items = toParamList(params).filter(item => !isRevealSeriesId(item?.seriesId))
    const rows: ChartTooltipRow[] = items.map(item => ({
      color: item.color,
      label: item.seriesName,
      value: formatChartNumber(item.value, format),
    }))

    return renderChartTooltip(items[0]?.axisValueLabel, rows)
  }
