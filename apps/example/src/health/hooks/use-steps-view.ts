import {type ChartGeometry, useChartScrub} from '@hzblj/zyplot'
import {type StepsRange, type StepsReadout, stepsReadout} from '@zyplot/feature-charts/health'
import {useMemo} from 'react'

export type StepsView = {
  /** The middle of what is being read, in the chart's own coordinate space. */
  anchor: number | null
  geometry: ChartGeometry | null
  /** True while a bar or a span is held, which is when the card replaces the headline. */
  isReading: boolean
  onInteraction: ReturnType<typeof useChartScrub>['onInteraction']
  readout: StepsReadout
}

/**
 * The headline for whatever is being held: nothing, one bar, or the span between two fingers.
 * A span already knows where both its ends landed, so the card can sit over the middle of it.
 */
export const useStepsView = (range: StepsRange): StepsView => {
  const {geometry, onInteraction, range: span, selection} = useChartScrub()

  return useMemo(() => {
    const held = span ?? (selection ? {endIndex: selection.index, startIndex: selection.index} : null)
    const spanAnchor = span?.startX === undefined || span?.endX === undefined ? null : (span.startX + span.endX) / 2

    return {
      anchor: span ? spanAnchor : (selection?.nativeX ?? null),
      geometry,
      isReading: held !== null,
      onInteraction,
      readout: stepsReadout(range, held),
    }
  }, [geometry, onInteraction, range, selection, span])
}
