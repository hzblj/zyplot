import type {NativeChartSeriesStyle} from '../contracts/chart-native'
import {annotation} from './annotation'
import {axis} from './axis'
import {marker} from './marker'
import {animation, fill, format, glow, halo, interaction, plot, seriesStyle, surface, theme} from './options'
import {reveal} from './reveal'
import {series} from './series'
import {tooltip} from './tooltip'

const factories = {
  animation,
  annotation,
  axis,
  fill,
  format,
  glow,
  halo,
  interaction,
  marker,
  plot,
  reveal,
  series,
  seriesStyle,
  surface,
  theme,
  tooltip,
}

/**
 * Every builder the package exports, gathered as the one argument a `zyplot` builder is given.
 * It is the same set of functions returning the same plain objects — reached as `z.annotation`
 * or `z.reveal.draw` rather than imported one by one.
 */
export type ZyplotFactories = typeof factories

type Without<Item, Key extends string> = Item extends unknown ? Omit<Item, Key> : never

type ValueOf<Item, Key extends string> = Item extends unknown ? (Key extends keyof Item ? Item[Key] : never) : never

type SplitSeries<Settings> = Settings extends {series: readonly (infer Item)[]}
  ? Omit<Settings, 'series' | 'seriesStyles'> & {
      series: readonly Without<Item, 'style'>[]
      seriesStyles: Readonly<Record<string, NativeChartSeriesStyle>>
    }
  : Settings

type SplitAnnotations<Settings> = Settings extends {annotations: readonly (infer Item)[]}
  ? Omit<Settings, 'annotations' | 'annotationViews'> & {
      annotations: readonly Without<Item, 'view'>[]
      annotationViews: Readonly<Record<string, ValueOf<Item, 'view'>>>
    }
  : Settings

/**
 * What `zyplot` hands back: the settings as they were written, with what each series and each
 * annotation carried for itself lifted into the record the chart takes for it — `style` into
 * `seriesStyles`, `view` into `annotationViews`. Settings with neither pass through unchanged.
 */
export type ZyplotChartProps<Settings> = SplitAnnotations<SplitSeries<Settings>>

type Carried = {id: string} & Record<string, unknown>

/**
 * The list with `key` taken off each entry, and what came off it keyed by the entry's own id — so a
 * record whose keys repeat an id declared elsewhere is built rather than written.
 */
const lift = (list: readonly Carried[], key: string) => {
  const carried: Record<string, unknown> = {}
  const rest = list.map(({[key]: value, ...entry}) => {
    if (value !== undefined) {
      carried[entry.id as string] = value
    }

    return entry as Carried
  })

  return {carried, rest}
}

type Settings = {
  annotationViews?: Readonly<Record<string, unknown>>
  annotations?: readonly Carried[]
  series?: readonly Carried[]
  seriesStyles?: Readonly<Record<string, unknown>>
}

const split = (settings: object): object => {
  const built: Settings & Record<string, unknown> = {...settings}

  if (built.series) {
    const {carried, rest} = lift(built.series, 'style')
    built.series = rest
    built.seriesStyles = {...carried, ...built.seriesStyles}
  }

  if (built.annotations) {
    const {carried, rest} = lift(built.annotations, 'view')
    built.annotations = rest
    built.annotationViews = {...carried, ...built.annotationViews}
  }

  return built
}

/**
 * One chart as one object. The builder is handed every factory as `z`, so a whole chart — its data,
 * its axes, its animation, the styling of each series — is one expression with one import behind it,
 * and what comes back is the props that chart takes.
 *
 * What a series or an annotation carries for itself is lifted on the way out: `style` into
 * `seriesStyles`, `view` into `annotationViews`. The id is written once, and an explicit record entry
 * wins over what the series or annotation named. Name the form — `zyplot<LineChartProps>()`, or
 * `Partial<LineChartProps>` for a preset that takes its data at the call site — to have the fields
 * checked where they are written rather than where they are spread.
 *
 * @example
 * const chart = zyplot(z => ({
 *   animation: z.animation({reveal: z.reveal.draw({duration: 420})}),
 *   annotations: [z.annotation.point({id: 'live', view: LivePrice, x: live.category, y: live.value})],
 *   categories,
 *   interaction: z.interaction.scrub({marker: z.marker.trail({dot: true})}),
 *   series: [z.series({id: 'price', label: 'Price', style: {strokeWidth: 2.3}, values})],
 *   tooltip: z.tooltip.above({view: ReadingChip}),
 *   yAxis: z.axis.overlay({format: z.format({decimals: 2})}),
 * }))
 *
 * <Chart.Line {...chart} />
 *
 * The object is rebuilt on every call, so declare it at module scope or hold it in a `useMemo`
 * keyed on the data — a chart whose props change identity re-serialises its whole dataset.
 */
export const zyplot = <const Settings extends object>(
  build: (z: ZyplotFactories) => Settings
): ZyplotChartProps<Settings> => split(build(factories)) as ZyplotChartProps<Settings>
