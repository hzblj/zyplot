import type {CSSProperties, FC, ReactNode} from 'react'
import {formatChartNumber} from '../format'
import {Skeleton} from '../primitives'
import type {ChartNumberFormat, ChartSkeletonAxis, ChartSkeletonProps, NativeChartAxisOptions} from '../types'
import {cn} from '../utils'

/**
 * What `buildChartGrid` keeps clear of the container. The labels come out of the plot on top of
 * that: the grid holds them inside the box those insets leave, so the plot gives up the row the
 * category labels hang in, the width the value labels need, and half a label wherever one is
 * centred on an edge of it. Reserving the same here is what keeps a mark still when the data lands.
 */
const PLOT_TOP = 8
const PLOT_SIDE = {end: 8, start: 4} as const
const CATEGORY_GUTTER = 26
const BARE_GUTTER = 6
const LABEL_MARGIN = 8
const LABEL_SIZE = 11
const LABEL_COUNT = 6
/** A character's share of the label's point size, near enough to reserve what the axis will measure. */
const LABEL_CHAR = 0.55
/** How near an edge of the plot a label has to be for its own half to hang over it. */
const EDGE = 0.001
const SPREAD_WIDTHS = [20, 24, 16, 24, 20, 24]
const LEGEND_WIDTHS = ['w-14', 'w-11', 'w-16', 'w-12', 'w-14', 'w-10', 'w-13']
const legendWidthAt = (index: number): string => LEGEND_WIDTHS[index % LEGEND_WIDTHS.length] ?? 'w-14'

type SkeletonLabel = {
  /**
   * Where along the axis the label belongs: 0 at the plot's floor or its leading edge, 1 at the
   * other end. Null when the placeholder knows how many there will be but not where, and so has
   * nothing better to do than spread them.
   */
  offset: number | null
  width: number
}

type ChartSkeletonFrameProps = ChartSkeletonProps & {children: ReactNode}

const axisOptions = (axis: ChartSkeletonAxis | undefined): NativeChartAxisOptions | null => {
  if (axis === false) {
    return null
  }
  if (axis === undefined || axis === true) {
    return {}
  }

  return axis.visible === false ? null : axis
}

const labelWidth = (text: string, size: number): number => Math.round(text.length * size * LABEL_CHAR)

const spreadLabels = (count: number): SkeletonLabel[] =>
  Array.from({length: count}, (_value, index) => ({
    offset: null,
    width: SPREAD_WIDTHS[index % SPREAD_WIDTHS.length] ?? 20,
  }))

const spreadCount = (options: NativeChartAxisOptions): number => {
  if (options.tickValues?.length) {
    return options.tickValues.length
  }

  return options.tickCount === undefined ? LABEL_COUNT : options.tickCount + 1
}

/** The readings the axis was pinned to, placed by where they fall in a domain that was pinned too. */
const valueLabels = (options: NativeChartAxisOptions | null, format?: ChartNumberFormat): SkeletonLabel[] => {
  if (!options) {
    return []
  }

  const ticks = options.tickValues?.filter((tick): tick is number => typeof tick === 'number') ?? []
  if (!ticks.length || ticks.length !== options.tickValues?.length) {
    return spreadLabels(spreadCount(options))
  }

  const size = options.labelSize ?? LABEL_SIZE
  const {max, min} = options.domain ?? {}
  const span = min === undefined || max === undefined ? 0 : max - min

  return ticks.map(tick => ({
    offset: span > 0 && min !== undefined ? (tick - min) / span : null,
    width: labelWidth(formatChartNumber(tick, format), size),
  }))
}

/** The named categories, each on the middle of its own band the way the axis writes them. */
const categoryLabels = (
  options: NativeChartAxisOptions | null,
  categories: readonly string[] = []
): SkeletonLabel[] => {
  if (!options) {
    return []
  }

  const named = options.tickValues?.filter((tick): tick is string => typeof tick === 'string') ?? []
  if (options.tickValues?.length ? named.length !== options.tickValues.length : categories.length > LABEL_COUNT) {
    return spreadLabels(spreadCount(options))
  }

  const size = options.labelSize ?? LABEL_SIZE
  const written = named.length ? named : categories
  if (!written.length) {
    return spreadLabels(LABEL_COUNT)
  }

  return written.map(name => {
    const band = categories.indexOf(name)

    return {
      offset: categories.length && band >= 0 ? (band + 0.5) / categories.length : null,
      width: labelWidth(name, size),
    }
  })
}

const isPinned = (labels: SkeletonLabel[]): boolean => labels.every(label => label.offset !== null)

const labelHeight = (options: NativeChartAxisOptions | null): number => options?.labelSize ?? LABEL_SIZE

/**
 * Half a value label, for the edge of the plot it is centred on. An axis left to pick its own ticks
 * writes one at each end of the domain, so both edges pay it.
 */
const edgeOverflow = (options: NativeChartAxisOptions | null, labels: SkeletonLabel[], edge: 0 | 1): number => {
  if (!options || !labels.length) {
    return 0
  }

  const isOnEdge = isPinned(labels)
    ? labels.some(label => Math.abs((label.offset ?? 0) - edge) < EDGE)
    : options.tickValues === undefined

  return isOnEdge ? labelHeight(options) / 2 : 0
}

/**
 * Where the axis will rule the plot. A value axis rules by default and a category axis does not, so
 * `grid` is read against the one it is on. An axis left to pick its own ticks rules evenly.
 */
const gridOffsets = (options: NativeChartAxisOptions | null, labels: SkeletonLabel[], isValue: boolean): number[] => {
  if (!options || !labels.length || (options.grid ?? isValue) === false) {
    return []
  }
  if (isPinned(labels)) {
    return labels.map(label => label.offset ?? 0)
  }

  return isValue ? labels.map((_label, index) => index / Math.max(1, labels.length - 1)) : []
}

/**
 * The axis without its data: the rules the value axis lays across the plot and the line the category
 * axis draws along it. Light, and never pulsing — a rule is the chart's own furniture, not a mark
 * that is still to come.
 */
const SkeletonRules: FC<{
  down: number[]
  hasAxisLine: boolean
  isAxisLineTrailing: boolean
  isHorizontal: boolean
  across: number[]
}> = ({across, down, hasAxisLine, isAxisLineTrailing, isHorizontal}) => (
  <div aria-hidden className="pointer-events-none absolute inset-0">
    {down.map(offset => (
      <div
        className="absolute inset-x-0 h-px translate-y-1/2 bg-fill-tertiary"
        key={offset}
        style={{bottom: `${offset * 100}%`}}
      />
    ))}
    {across.map(offset => (
      <div
        className="absolute inset-y-0 w-px -translate-x-1/2 bg-fill-tertiary"
        key={offset}
        style={{left: `${offset * 100}%`}}
      />
    ))}
    {hasAxisLine && isHorizontal && (
      <div className={cn('absolute inset-y-0 w-px bg-fill-tertiary', isAxisLineTrailing ? 'right-0' : 'left-0')} />
    )}
    {hasAxisLine && !isHorizontal && <div className="absolute inset-x-0 bottom-0 h-px bg-fill-tertiary" />}
  </div>
)

/**
 * `Skeleton` carries its own `relative` for the pulse it holds, and `cn` only joins — so a label
 * that has to be placed is placed by a wrapper rather than by classes the primitive would win.
 */
const SkeletonPlacedLabel: FC<{className: string; style: CSSProperties}> = ({className, style}) => (
  <div className={cn('absolute h-2.5', className)} style={style}>
    <Skeleton className="size-full" />
  </div>
)

/** The stack beside the plot, each label centred on its own reading. */
const SkeletonLabelColumn: FC<{isTrailing: boolean; labels: SkeletonLabel[]}> = ({isTrailing, labels}) => {
  if (!isPinned(labels)) {
    return (
      <div className={cn('flex h-full flex-col justify-between py-px', isTrailing ? 'items-start' : 'items-end')}>
        {labels.map((label, index) => (
          <Skeleton className="h-2.5" key={index} style={{width: label.width}} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative h-full">
      {labels.map((label, index) => (
        <SkeletonPlacedLabel
          className={cn('translate-y-1/2', isTrailing ? 'left-0' : 'right-0')}
          key={index}
          style={{bottom: `${(label.offset ?? 0) * 100}%`, width: label.width}}
        />
      ))}
    </div>
  )
}

/** The row under the plot, each label centred on its own band. */
const SkeletonLabelRow: FC<{labels: SkeletonLabel[]}> = ({labels}) => {
  if (!isPinned(labels)) {
    return (
      <div className="flex h-full items-center justify-between">
        {labels.map((label, index) => (
          <Skeleton className="h-2.5" key={index} style={{width: label.width}} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative h-full">
      {labels.map((label, index) => (
        <SkeletonPlacedLabel
          className="top-1/2 -translate-x-1/2 -translate-y-1/2"
          key={index}
          style={{left: `${(label.offset ?? 0) * 100}%`, width: label.width}}
        />
      ))}
    </div>
  )
}

/**
 * The plot the chart is about to draw, minus the data: the same insets, the same gutter on the same
 * side of it, and a label for every one the axis will write, so nothing moves when the data lands.
 */
export const ChartSkeletonFrame: FC<ChartSkeletonFrameProps> = ({
  categories,
  children,
  className,
  format,
  height = 240,
  legendCount = 0,
  orientation = 'vertical',
  xAxis = true,
  yAxis = true,
}) => {
  const isHorizontal = orientation === 'horizontal'
  const across = axisOptions(xAxis)
  const down = axisOptions(yAxis)
  const rowLabels = isHorizontal ? valueLabels(across, format) : categoryLabels(across, categories)
  const columnLabels = isHorizontal ? categoryLabels(down, categories) : valueLabels(down, format)
  const inset = down?.labelInset ?? LABEL_MARGIN
  const rowInset = across?.labelInset ?? LABEL_MARGIN
  const gutter = columnLabels.length ? Math.max(...columnLabels.map(label => label.width)) + inset : 0
  const isTrailing = down?.position === 'end' || down?.position === 'overlay'
  const sides = {
    paddingLeft: across?.plotDimensionStartPadding ?? PLOT_SIDE.start,
    paddingRight: across?.plotDimensionEndPadding ?? PLOT_SIDE.end,
  }
  /** The row the category labels hang in, under everything the grid keeps clear anyway. */
  const labelRow = across ? rowInset + labelHeight(across) : 0
  const reserve = down?.plotDimensionStartPadding ?? (across ? CATEGORY_GUTTER : BARE_GUTTER)
  const headroom = down?.plotDimensionEndPadding ?? PLOT_TOP
  const floor = reserve + Math.max(labelRow, edgeOverflow(down, columnLabels, 0))
  const column = gutter > 0 && (
    <div
      className="shrink-0"
      style={{paddingLeft: isTrailing ? inset : 0, paddingRight: isTrailing ? 0 : inset, width: gutter}}
    >
      <SkeletonLabelColumn isTrailing={isTrailing} labels={columnLabels} />
    </div>
  )
  const spacer = gutter > 0 && <div className="shrink-0" style={{width: gutter}} />

  return (
    <div aria-hidden className={cn('flex w-full flex-col gap-3', className)}>
      {legendCount > 1 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {Array.from({length: legendCount}, (_value, index) => (
            <div className="flex h-4.5 items-center gap-1.5" key={index}>
              <Skeleton className="size-2 shrink-0 rounded-[2px]" />
              <Skeleton className={cn('h-3', legendWidthAt(index))} />
            </div>
          ))}
        </div>
      )}
      <div className="flex w-full flex-col" style={{height}}>
        <div
          className="flex min-h-0 flex-1"
          style={{...sides, paddingTop: headroom + edgeOverflow(down, columnLabels, 1)}}
        >
          {!isTrailing && column}
          <div className="relative min-w-0 flex-1">
            <SkeletonRules
              across={gridOffsets(across, rowLabels, isHorizontal)}
              down={gridOffsets(down, columnLabels, !isHorizontal)}
              hasAxisLine={Boolean(isHorizontal ? down : across)}
              isAxisLineTrailing={isTrailing}
              isHorizontal={isHorizontal}
            />
            {children}
          </div>
          {isTrailing && column}
        </div>
        <div className="flex shrink-0" style={{...sides, height: floor}}>
          {!isTrailing && spacer}
          <div className="min-w-0 flex-1">
            {across && (
              <div style={{height: labelHeight(across), marginTop: rowInset}}>
                <SkeletonLabelRow labels={rowLabels} />
              </div>
            )}
          </div>
          {isTrailing && spacer}
        </div>
      </div>
    </div>
  )
}
