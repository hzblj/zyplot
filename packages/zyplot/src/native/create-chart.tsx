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

  const MemoChart = memo(NativeChart)

  const Chart = ({annotationViews, ...props}: Props & ChartAnnotationViewProps) => {
    const [geometry, setGeometry] = useState<ChartGeometry | null>(null)
    const ids = annotationViewIds(annotationViews)
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
