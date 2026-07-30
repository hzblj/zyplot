import {
  type ChartGeometry,
  mergeChartSurface,
  type NativeChartBaseProps,
  type NativeChartInteractionEvent,
} from '@hzblj/zyplot-core'
import {requireNativeView} from 'expo'
import {type ComponentType, memo, type ReactNode, useCallback, useMemo, useRef, useState} from 'react'
import {type LayoutChangeEvent, type NativeSyntheticEvent, StyleSheet, View, type ViewProps} from 'react-native'
import {
  annotationViewIds,
  type ChartAnnotationViewProps,
  hasAnnotationView,
  hideViewedAnnotations,
  sameChartGeometry,
} from '../shared/annotation-views'
import {useChartContext} from './chart-provider'

type NativeViewProps = ViewProps & {
  configuration: string
  onInteraction?: (event: NativeSyntheticEvent<NativeChartInteractionEvent>) => void
}

const NativeChartView: ComponentType<NativeViewProps> = requireNativeView('Zyplot')

const PAYLOAD_RENAMES: Partial<Record<string, readonly [string, string]>> = {
  candlestick: ['data', 'candlesticks'],
  heatmap: ['rows', 'rowLabels'],
  range: ['data', 'ranges'],
  rule: ['data', 'rules'],
  scatter: ['series', 'scatterSeries'],
  sunburst: ['data', 'hierarchy'],
  treemap: ['data', 'hierarchy'],
}

/** One of the app's own views, centred on where the chart put the annotation it replaces. */
const ChartAnnotationView = ({children, x, y}: {children: ReactNode; x: number; y: number}) => {
  const [size, setSize] = useState<{height: number; width: number} | null>(null)

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const {height, width} = event.nativeEvent.layout
    setSize(current => (current?.height === height && current?.width === width ? current : {height, width}))
  }, [])

  return (
    <View
      onLayout={onLayout}
      pointerEvents="none"
      // Centred on the spot rather than hung off it, because that is where a dot, a badge or
      // a price belongs. Held back for the frame before it has been measured: laying it out
      // is what gives it a size to centre by, and it would land off-centre without one.
      style={{
        left: x - (size?.width ?? 0) / 2,
        opacity: size ? 1 : 0,
        position: 'absolute',
        top: y - (size?.height ?? 0) / 2,
      }}
    >
      {children}
    </View>
  )
}

export const createChart = <Props extends NativeChartBaseProps>(type: string) => {
  const NativeChart = ({height = 320, onInteraction, ...props}: Props) => {
    const inherited = useChartContext()
    const configuration: Record<string, unknown> = {
      ...props,
      height,
      surface: mergeChartSurface(inherited.surface, props.surface),
      theme: props.theme ?? inherited.theme,
      type,
    }
    const rename = PAYLOAD_RENAMES[type]
    if (rename) {
      const [from, to] = rename
      configuration[to] = configuration[from]
      delete configuration[from]
    }

    return (
      <NativeChartView
        accessibilityLabel={props.accessibilityLabel}
        configuration={JSON.stringify(configuration)}
        onInteraction={onInteraction ? event => onInteraction(event.nativeEvent) : undefined}
        style={{height, width: '100%'}}
      />
    )
  }

  NativeChart.displayName = `Chart.${type}.Native`

  /**
   * Memoised because rendering this component *is* the serialisation: the whole
   * payload goes through `JSON.stringify` on every pass, data included. A chart
   * beside a scrubbed readout re-renders on every touch report, and without this it
   * would restringify every point of the series to arrive at the same string.
   *
   * Props have to be stable for that to bite — an object literal built in the
   * caller's render is a new object every time, and the comparison fails on it.
   */
  const MemoChart = memo(NativeChart)

  /**
   * The chart, plus the views the app draws on it. It holds the last layout the chart
   * reported and lays each `annotationViews` node over the spot its annotation landed on,
   * which is the whole of what an app used to write by hand around every chart.
   *
   * The chart itself stays memoised behind this: the geometry lives out here, so a layout
   * report moves the app's views without the payload being serialised again.
   */
  const Chart = ({annotationViews, ...props}: Props & ChartAnnotationViewProps) => {
    const [geometry, setGeometry] = useState<ChartGeometry | null>(null)
    const ids = annotationViewIds(annotationViews)
    /** Read inside a handler that must stay stable for the memo above to hold. */
    const listener = useRef(props.onInteraction)
    const wantsGeometry = useRef(false)
    listener.current = props.onInteraction
    wantsGeometry.current = ids !== ''

    const annotations = useMemo(() => hideViewedAnnotations(props.annotations, ids), [props.annotations, ids])

    const onInteraction = useCallback((event: NativeChartInteractionEvent) => {
      const reported = event.geometry
      if (wantsGeometry.current && reported) {
        setGeometry(current => (sameChartGeometry(current, reported) ? current : reported))
      }
      listener.current?.(event)
    }, [])

    // A chart nobody listens to reports nothing: the native side only sends what a listener
    // is attached for, and a scrub with no reader is bridge traffic for nothing.
    const chart = (
      <MemoChart
        {...(props as Props)}
        annotations={annotations}
        onInteraction={ids || props.onInteraction ? onInteraction : undefined}
      />
    )

    if (!ids) {
      return chart
    }

    return (
      <View>
        {chart}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {(geometry?.annotations ?? []).map(spot => {
            const view = annotationViews?.[spot.id]

            return hasAnnotationView(view) ? (
              <ChartAnnotationView key={spot.id} x={spot.x} y={spot.y}>
                {view}
              </ChartAnnotationView>
            ) : null
          })}
        </View>
      </View>
    )
  }

  Chart.displayName = `Chart.${type}`

  return Chart
}
