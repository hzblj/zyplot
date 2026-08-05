import type {NativeChartLineAnnotation, NativeChartPointAnnotation} from '../contracts/chart-native'
import type {ChartRangeAnnotation, ChartTextAnnotation} from '../contracts/chart-presentation'

/**
 * What an annotation is written as: everything the variant takes except its `type`, which the builder
 * sets, plus `view` for the app's own node in place of the mark the chart would draw.
 *
 * `view` is lifted out into `annotationViews` by `zyplot`, keyed by this annotation's `id` — so the
 * id is written once and the view sits beside the thing it is anchored to.
 */
type Options<Annotation, View> = Omit<Annotation, 'type'> & {view?: View}

/**
 * Builders for the `annotations` array, which is a union discriminated by `type`. These set
 * the discriminant for you, so autocomplete offers only the fields that variant has. They
 * return plain objects — compose them, spread them, or build your own presets on top.
 *
 * @example
 * const priceFloor = (value: number) =>
 *   annotation.line({axis: 'y', dash: [1, 4], id: 'floor', value})
 */
export const annotation = {
  line: <View = never>(
    options: Options<NativeChartLineAnnotation, View>
  ): NativeChartLineAnnotation & {
    view?: View
  } => ({
    ...options,
    type: 'line',
  }),
  /**
   * A point the chart measures and nobody draws. It reports where it landed in `geometry` and
   * leaves the pixels to you, which is how a view of your own lines up with the data exactly: a
   * grid, a row of labels, a box around a stretch.
   *
   * Reach for it rather than `geometry.plot` whenever the answer has to be the same on all three
   * renderers. A mark lands where its data lands everywhere; the plot rect is the box around the
   * marks, and each renderer puts the axis padding on its own side of that box.
   *
   * @example
   * const ticks = prices.map((value, index) => annotation.measure({id: `row-${index}`, x: first, y: value}))
   * const rows = geometry?.annotations.filter(item => item.id.startsWith('row-')).map(item => item.y)
   */
  measure: (options: Pick<NativeChartPointAnnotation, 'id' | 'x' | 'y'>): NativeChartPointAnnotation => ({
    ...options,
    hidden: true,
    size: 0,
    type: 'point',
  }),
  point: <View = never>(
    options: Options<NativeChartPointAnnotation, View>
  ): NativeChartPointAnnotation & {
    view?: View
  } => ({
    ...options,
    type: 'point',
  }),
  range: <View = never>(options: Options<ChartRangeAnnotation, View>): ChartRangeAnnotation & {view?: View} => ({
    ...options,
    type: 'range',
  }),
  text: <View = never>(options: Options<ChartTextAnnotation, View>): ChartTextAnnotation & {view?: View} => ({
    ...options,
    type: 'text',
  }),
}
