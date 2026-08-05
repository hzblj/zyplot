import {Chart, zyplot} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import type {QuoteRange} from './quote-data'
import {quoteColors, quoteLayout} from './quote-theme'
import type {RevolutChartProps} from './revolut-chart'
import {blooms, plotInsets, priceAxis, priceFormat, quoteChartStyle} from './revolut-chart-style'

const candleDomain = (range: QuoteRange) => ({
  max: Math.max(...range.candles.map(candle => candle.high), range.baseline),
  min: Math.min(...range.candles.map(candle => candle.low)),
})

const CandlestickChart = ({
  annotationViews,
  height = quoteLayout.chartHeight,
  isLoading,
  onInteraction,
  range,
  rangeView,
  scheme,
  tooltip,
}: RevolutChartProps) => {
  const chart = useMemo(() => {
    const color = quoteColors[scheme]
    const bloom = blooms[scheme]
    const style = quoteChartStyle(scheme)

    return zyplot(z => ({
      animation: style.arrival,
      annotations: [style.baselineAnnotation(range)],
      annotationViews,
      data: range.candles,
      format: {...priceFormat, suffix: ' $'},
      height,
      // One candle wide, because here a mark is a period that was actually traded.
      interaction: {
        ...style.scrubbing,
        marker: z.marker.segment({
          color: color.chartMark,
          glow: z.glow({color: color.down, ...bloom.candle}),
          span: 1,
        }),
      },
      isLoading,
      onInteraction,
      plot: {clip: false},
      rangeView,
      style: {
        candleRadius: 2,
        candleWidth: 0.27,
        downColor: color.down,
        upColor: color.up,
        wickWidth: 1.2,
      },
      theme: style.theme,
      // The readout above the plot is the reading, so no card is drawn unless one is handed over.
      tooltip: tooltip ?? false,
      xAxis: {...plotInsets, visible: false},
      yAxis: priceAxis(candleDomain(range)),
    }))
  }, [annotationViews, height, isLoading, onInteraction, range, rangeView, scheme, tooltip])

  return <Chart.Candlestick {...chart} />
}

export const RevolutCandlestickChart = memo(CandlestickChart)
