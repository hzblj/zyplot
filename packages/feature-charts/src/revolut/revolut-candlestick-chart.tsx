import {Chart} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import type {QuoteRange} from './quote-data'
import {quoteColors, quoteLayout} from './quote-theme'
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

const CandlestickChart = ({
  height = quoteLayout.chartHeight,
  isLoading,
  isTooltipVisible = false,
  onInteraction,
  range,
  scheme,
}: RevolutChartProps) => {
  const color = quoteColors[scheme]
  const style = quoteChartStyle(scheme)
  const domain = useCandleDomain(range)

  return (
    <Chart.Candlestick
      animation={style.arrival}
      annotations={[style.baselineAnnotation(range)]}
      data={range.candles}
      format={{...priceFormat, suffix: ' $'}}
      height={height}
      interaction={{...style.scrubbing, marker: style.candleMarker, tooltip: isTooltipVisible}}
      isLoading={isLoading}
      onInteraction={onInteraction}
      plot={plotStyle}
      style={{
        candleRadius: 2,
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
