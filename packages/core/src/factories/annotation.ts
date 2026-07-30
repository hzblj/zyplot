import type {NativeChartLineAnnotation, NativeChartPointAnnotation} from '../contracts/chart-native'
import type {ChartRangeAnnotation, ChartTextAnnotation} from '../contracts/chart-presentation'

type Options<Annotation> = Omit<Annotation, 'type'>

/**
 * Builders for the `annotations` array.
 *
 * `annotations` is a union discriminated by `type`, so writing one by hand means
 * remembering which fields belong to which variant — a `range` takes `start`/`end`,
 * a `point` takes `x`/`y`, and a `line` takes one `value` plus the `axis` it sits on.
 * These set the discriminant for you and let autocomplete offer only the fields that
 * variant actually has.
 *
 * They return plain objects, which is all the props ever were. Compose them, spread
 * them, or build your own presets on top:
 *
 * @example
 * const priceFloor = (value: number) =>
 *   annotation.line({axis: 'y', dash: [1, 4], id: 'floor', value})
 *
 * <Chart.Line annotations={[priceFloor(300), annotation.point({id: 'now', x, y})]} … />
 *
 * A rule, a range and their labels are drawn by every form that takes annotations. The
 * decorations on a point — `badge`, `glow`, `halo`, `pulse`, `size` and `scrubOpacity` —
 * come from the layer that reads the pointer, so they land on `Chart.Line` and
 * `Chart.Candlestick` everywhere, and on the other cartesian forms on iOS and Android.
 */
export const annotation = {
  line: (options: Options<NativeChartLineAnnotation>): NativeChartLineAnnotation => ({
    ...options,
    type: 'line',
  }),
  point: (options: Options<NativeChartPointAnnotation>): NativeChartPointAnnotation => ({
    ...options,
    type: 'point',
  }),
  range: (options: Options<ChartRangeAnnotation>): ChartRangeAnnotation => ({
    ...options,
    type: 'range',
  }),
  text: (options: Options<ChartTextAnnotation>): ChartTextAnnotation => ({
    ...options,
    type: 'text',
  }),
}
