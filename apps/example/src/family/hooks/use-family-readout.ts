import {useChartScrub} from '@hzblj/zyplot'
import {type FamilyRange, familyToken, formatAmount} from '@zyplot/feature-charts/family'
import {useMemo} from 'react'

export type FamilyReadout = {
  amount: string
  isDown: boolean
  isScrubbing: boolean
  onInteraction: ReturnType<typeof useChartScrub>['onInteraction']
  percent: string
  price: string
  subtitle: string
  value: number
}

/**
 * The header, and nothing the finger drags: the crosshair, its chip and the dot on the reading are
 * all the chart's, so the only thing crossing back into JavaScript is a price a thumb never touches.
 */
export const useFamilyReadout = (range: FamilyRange): FamilyReadout => {
  const {onInteraction, selection} = useChartScrub()
  const last = range.values.length - 1
  const index = selection === null ? last : Math.min(Math.max(selection.index, 0), last)

  return useMemo(() => {
    const shown = range.values[index] ?? 0
    const change = shown - range.baseline
    const isDown = change < 0

    return {
      amount: `${isDown ? '-' : '+'}${familyToken.currency}${formatAmount(Math.abs(change))}`,
      isDown,
      isScrubbing: selection !== null,
      onInteraction,
      percent: `${formatAmount(Math.abs((change / range.baseline) * 100))}%`,
      price: formatAmount(shown),
      subtitle: range.periodLabel,
      value: shown,
    }
  }, [index, onInteraction, range, selection])
}
