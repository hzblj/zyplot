import type {NativeChartLineAnnotation, NativeChartPointAnnotation} from '../contracts/chart-native'
import type {ChartRangeAnnotation, ChartTextAnnotation} from '../contracts/chart-presentation'

type Options<Annotation> = Omit<Annotation, 'type'>

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
