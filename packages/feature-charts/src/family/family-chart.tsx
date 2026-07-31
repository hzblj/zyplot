import {Chart, series, seriesProps, useLastReading} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {
  familyChartStyle,
  familyStamps,
  hasLiveDot,
  plotInsets,
  plotStyle,
  priceDomain,
  waveValues,
} from './family-chart-style'
import type {FamilyRange} from './family-data'
import {type FamilyScheme, familyColors, familyLayout} from './family-theme'

export type FamilyChartProps = {
  height?: number
  /**
   * Draws the resting wave instead of the window. Nothing unmounts while it is held: the wave is
   * the same line with other values, so the data arrives as a morph rather than as a new chart.
   */
  isLoading: boolean
  onInteraction?: Parameters<typeof Chart.Line>[0]['onInteraction']
  range: FamilyRange
  scheme: FamilyScheme
}

const PriceChart = ({height = familyLayout.chartHeight, isLoading, onInteraction, range, scheme}: FamilyChartProps) => {
  const color = familyColors[scheme]
  const style = familyChartStyle(scheme)
  const domain = useMemo(() => priceDomain(range.values), [range])
  const live = useLastReading(range.categories, range.values)
  const values = useMemo(() => (isLoading ? waveValues(domain) : range.values), [domain, isLoading, range])
  const lines = useMemo(
    () =>
      seriesProps([
        series({
          color: color.trace,
          id: 'price',
          label: range.label,
          style: style.traceStyle,
          values,
        }),
      ]),
    [color, range, style, values]
  )
  const annotations = useMemo(
    // Only the windows that end at now get the pulse, and only they keep room for it.
    () => (isLoading || !live || !hasLiveDot(range.id) ? [] : [style.liveAnnotation(live)]),
    [isLoading, live, range, style]
  )
  const scrubbing = useMemo(() => style.scrubbing(familyStamps(range.stamps)), [range, style])

  return (
    <Chart.Line
      {...lines}
      animation={style.arrival}
      annotations={annotations}
      categories={range.categories}
      height={height}
      interaction={isLoading ? {hover: 'none'} : scrubbing}
      isLoading={false}
      isSmooth
      onInteraction={onInteraction}
      plot={plotStyle}
      theme={style.theme}
      xAxis={{...plotInsets, visible: false}}
      yAxis={{domain, visible: false}}
    />
  )
}

export const FamilyChart = memo(PriceChart)
