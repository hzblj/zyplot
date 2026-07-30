import {Chart} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import type {QuoteRange} from '../data/quote-data'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import type {RevolutChartProps} from './revolut-chart'
import {plotInsets, plotStyle, priceAxis, priceFormat, quoteChartStyle} from './revolut-chart-style'

const useCandleDomain = (range: QuoteRange) =>
  useMemo(
    () => ({
      max: Math.max(...range.candles.map(candle => candle.high), range.baseline),
      min: Math.min(...range.candles.map(candle => candle.low)),
    }),
    [range]
  )

const CandlestickChart = ({isLoading, onInteraction, range}: RevolutChartProps) => {
  const {color, scheme} = useQuoteTheme()
  const style = quoteChartStyle(scheme)
  const domain = useCandleDomain(range)

  return (
    <Chart.Candlestick
      animation={style.arrival}
      // The event rule and its badge belong to the line chart only.
      annotations={[style.baselineAnnotation(range)]}
      data={range.candles}
      format={{...priceFormat, suffix: ' $'}}
      height={quoteLayout.chartHeight}
      // No native tooltip: the reading card is drawn in RN by quote-chart-overlay.tsx. The
      // marker is what puts the glow on the candle being read.
      interaction={{...style.scrubbing, marker: style.candleMarker, tooltip: false}}
      isLoading={isLoading}
      onInteraction={onInteraction}
      plot={plotStyle}
      style={{
        candleRadius: 2,
        // Measured off the design: a 14 px body at a 51 px pitch, and a 1 pt wick.
        candleWidth: 0.27,
        downColor: color.down,
        upColor: color.up,
        wickWidth: 1.2,
      }}
      theme={style.theme}
      xAxis={{...plotInsets, visible: false}}
      yAxis={priceAxis(domain)}
    />
  )
}

export const RevolutCandlestickChart = memo(CandlestickChart)
