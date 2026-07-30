import {Chart, series, seriesProps} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {krakenChartStyle, plotInsets, plotStyle, priceAxis, priceDomain} from './kraken-chart-style'
import {type KrakenRange, krakenCategories, krakenReading} from './kraken-data'
import {type KrakenScheme, krakenColors, krakenLayout} from './kraken-theme'

export type KrakenChartProps = {
  height?: number
  isLoading: boolean
  isLatestRead: boolean
  onInteraction?: Parameters<typeof Chart.Line>[0]['onInteraction']
  range: KrakenRange
  scheme: KrakenScheme
}

const LAST = krakenCategories[krakenCategories.length - 1] as string

const PriceChart = ({
  height = krakenLayout.chartHeight,
  isLoading,
  isLatestRead,
  onInteraction,
  range,
  scheme,
}: KrakenChartProps) => {
  const color = krakenColors[scheme]
  const style = krakenChartStyle(scheme)
  const reading = useMemo(() => krakenReading(range), [range])
  const domain = useMemo(() => priceDomain(reading), [reading])

  const lines = useMemo(
    () =>
      seriesProps([
        series({
          color: color.trace,
          id: 'price',
          label: range.label,
          style: style.traceStyle,
          values: range.values,
        }),
      ]),
    [color, range, style]
  )

  const scrubbing = useMemo(() => style.scrubbing(range.pointLabels), [range, style])

  const annotations = useMemo(
    () => [
      style.axisRule(domain.min),
      style.latestAnnotation(reading),
      style.latestPoint(LAST, reading.last, isLatestRead),
    ],
    [domain, isLatestRead, reading, style]
  )

  return (
    <Chart.Line
      {...lines}
      animation={style.arrival}
      annotations={annotations}
      categories={krakenCategories}
      height={height}
      interaction={scrubbing}
      isLoading={isLoading}
      onInteraction={onInteraction}
      plot={plotStyle}
      xAxis={{...plotInsets, visible: false}}
      yAxis={priceAxis(domain)}
    />
  )
}

export const KrakenChart = memo(PriceChart)
