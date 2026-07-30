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
const OVERLAY_LABEL_INSET = 8
const ANNOTATION_LABEL_SIZE = 11
const PLOT_TOP = 8
const UPDATE_DURATION = 320
export const CROSSHAIR_LABEL_SIZE = 13
export const CROSSHAIR_LABEL_LIFT = 8

export const crosshairHeadroom = (interaction?: NativeChartInteraction): number => {
  const labels = interaction?.crosshairStyle?.labels
  if (!labels?.length || interaction?.crosshair === 'none' || interaction?.hover === 'none') {
    return 0
  }

  return (interaction?.crosshairStyle?.labelSize ?? CROSSHAIR_LABEL_SIZE) + CROSSHAIR_LABEL_LIFT
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

export const buildChartGrid = (
  hasCategoryGutter = true,
  plot?: ChartPlotStyle,
  dimension?: Pick<NativeChartAxisOptions, 'plotDimensionEndPadding' | 'plotDimensionStartPadding'>,
  headroom = 0
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
    top: PLOT_TOP + (padding?.top ?? 0) + headroom,
  }
}

export const plotInnerHeight = (height?: number, hasCategoryGutter = true, plot?: ChartPlotStyle, headroom = 0) => {
  if (!height) {
    return 0
  }

  const padding = typeof plot?.padding === 'number' ? {bottom: plot.padding, top: plot.padding} : plot?.padding
  const bottom = (hasCategoryGutter ? AXIS_GUTTER : AXIS_GUTTER_BARE) + (padding?.bottom ?? 0)
  return Math.max(0, height - bottom - PLOT_TOP - (padding?.top ?? 0) - headroom)
}

const customValues = (options?: NativeChartAxisOptions) =>
  options?.tickValues?.length ? [...options.tickValues] : undefined

export const axisLabelMargin = (options?: NativeChartAxisOptions) =>
  options?.position === 'overlay' ? {margin: options.labelInset ?? OVERLAY_LABEL_INSET} : undefined

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

  return {
    axisLabel: {
      ...axisLabelMargin(options),
      color: tokens.label,
      customValues: customValues(options),
      fontFamily: tokens.fontFamily,
      fontSize: options?.labelSize ?? 11,
      hideOverlap: true,
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

  return {xAxis: categoryAxis, yAxis: valueAxis}
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
