import {Chart, series, seriesProps, useLastReading} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import type {QuoteRange} from './quote-data'
import {quoteColors, quoteLayout} from './quote-theme'
import type {RevolutChartProps} from './revolut-chart'
import {plotInsets, plotStyle, priceAxis, quoteChartStyle} from './revolut-chart-style'

const useLineDomain = (range: QuoteRange) =>
  useMemo(() => {
    const known = range.values.filter((value): value is number => value !== null)
    return {max: Math.max(...known, range.baseline), min: Math.min(...known)}
  }, [range])

const LineChart = ({
  height = quoteLayout.chartHeight,
  isEventBadgeVisible = false,
  isLoading,
  isTooltipVisible = false,
  onInteraction,
  range,
  scheme,
}: RevolutChartProps) => {
  const color = quoteColors[scheme]
  const style = quoteChartStyle(scheme)
  const domain = useLineDomain(range)
  const live = useLastReading(range.categories, range.values)
  const lines = useMemo(
    () =>
      seriesProps([
        series({
          color: color.down,
          id: 'price',
          label: range.label,
          style: style.traceStyle,
          values: range.values,
        }),
      ]),
    [color, range, style]
  )

  return (
    <Chart.Line
      {...lines}
      animation={style.arrival}
      annotations={[
        style.baselineAnnotation(range),
        ...style.eventAnnotations(range, isEventBadgeVisible),
        ...(live && range.id === '1d' ? [style.liveAnnotation(live)] : []),
      ]}
      categories={range.categories}
      height={height}
      interaction={{...style.scrubbing, marker: style.scrubMarker, tooltip: isTooltipVisible}}
      isLoading={isLoading}
      isSmooth
      onInteraction={onInteraction}
      plot={plotStyle}
      theme={style.theme}
      xAxis={{...plotInsets, visible: false}}
      yAxis={priceAxis(domain)}
    />
  )
}

export const RevolutLineChart = memo(LineChart)
