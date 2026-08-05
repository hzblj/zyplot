import {type ChartInteractionHandler, useChartScrub} from '@hzblj/zyplot'
import {type StepsRange, type StepsReadout, stepsReadout} from '@zyplot/feature-charts/health'
import {useMemo} from 'react'

export type StepsView = {
  /** True while a bar or a span is held, which is when the card replaces the headline. */
  isReading: boolean
  /** Which of the two is being held, because the chart mounts a card for each. */
  isSpan: boolean
  onInteraction: ChartInteractionHandler
  readout: StepsReadout
}

/**
 * The headline for whatever is being held: nothing, one bar, or the span between two fingers.
 * Where the card for it goes is the chart's answer, not this hook's — see `StepsReadingCard`.
 */
export const useStepsView = (range: StepsRange): StepsView => {
  const {onInteraction, range: span, selection} = useChartScrub()

  return useMemo(() => {
    const held = span ?? (selection ? {endIndex: selection.index, startIndex: selection.index} : null)

    return {
      isReading: held !== null,
      isSpan: span !== null,
      onInteraction,
      readout: stepsReadout(range, held),
    }
  }, [onInteraction, range, selection, span])
}
