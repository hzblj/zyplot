import {mergeChartSurface, type NativeChartBaseProps, type NativeChartInteractionEvent} from '@hzblj/zyplot-core'
import {requireNativeView} from 'expo'
import {type ComponentType, memo, type ReactNode, useMemo} from 'react'
import {type NativeSyntheticEvent, StyleSheet, type ViewProps} from 'react-native'
import {annotationViewAligns, annotationViewIds, hideViewedAnnotations} from '../shared/annotation-views'
import {type ChartSlotViewProps, chartSlots, resolveInteraction, tooltipAnchorOf} from '../shared/chart-slots'
import {useChartContext} from './chart-provider'

type NativeViewProps = ViewProps & {
  children?: ReactNode
  configuration: string
  onInteraction?: (event: NativeSyntheticEvent<NativeChartInteractionEvent>) => void
}

type NativeSlotViewProps = ViewProps & {
  children?: ReactNode
  slot: string
}

const NativeChartView: ComponentType<NativeViewProps> = requireNativeView('Zyplot')
const NativeSlotView: ComponentType<NativeSlotViewProps> = requireNativeView('Zyplot', 'ZyplotSlot')

const PAYLOAD_RENAMES: Partial<Record<string, readonly [string, string]>> = {
  candlestick: ['data', 'candlesticks'],
  heatmap: ['rows', 'rowLabels'],
  range: ['data', 'ranges'],
  rule: ['data', 'rules'],
  scatter: ['series', 'scatterSeries'],
  sunburst: ['data', 'hierarchy'],
  treemap: ['data', 'hierarchy'],
}

/**
 * Laid out at the origin at its own size, because the chart moves it by translating the
 * container it is mounted in and never by the frame React Native gave it.
 */
const styles = StyleSheet.create({
  slot: {left: 0, position: 'absolute', top: 0},
})

export const createChart = <Props extends NativeChartBaseProps>(type: string) => {
  const NativeChart = ({
    annotationViews,
    height = 320,
    onInteraction,
    rangeView,
    tooltip,
    ...props
  }: Props & ChartSlotViewProps) => {
    const inherited = useChartContext()
    const viewedIds = annotationViewIds(annotationViews)
    const slots = chartSlots({annotationViews, rangeView, tooltip})
    const annotations = useMemo(
      () => hideViewedAnnotations(props.annotations, viewedIds),
      [props.annotations, viewedIds]
    )

    const configuration: Record<string, unknown> = {
      ...props,
      annotations,
      // Where each of the app's own annotation views sits on its mark. The views themselves cannot
      // cross the bridge; this is the part of them the native side has to be told.
      annotationViewAlign: annotationViewAligns(annotationViews),
      height,
      interaction: resolveInteraction(props.interaction, tooltip),
      surface: mergeChartSurface(inherited.surface, props.surface),
      theme: props.theme ?? inherited.theme,
      // The view itself cannot cross the bridge; where to put it is all the native side is told.
      tooltipAnchor: tooltipAnchorOf(tooltip),
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
      >
        {slots.map(slot => (
          <NativeSlotView key={slot.id} pointerEvents="none" slot={slot.id} style={styles.slot}>
            {slot.node}
          </NativeSlotView>
        ))}
      </NativeChartView>
    )
  }

  NativeChart.displayName = `Chart.${type}`

  // Left callable rather than widened to `ComponentType`, because apps read a chart's own props
  // back off it with `Parameters<typeof Chart.Line>[0]`.
  return memo(NativeChart)
}
