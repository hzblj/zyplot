import {Chart, zyplot} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import type {StocksTickerQuote} from './stocks-data'
import {type StocksScheme, stocksColors, stocksLayout} from './stocks-theme'

export type StocksTickerSparkProps = {
  quote: StocksTickerQuote
  scheme: StocksScheme
}

const categories = (count: number) => Array.from({length: count}, (_, index) => String(index))

/** No scale on either side: at this size the shape is the whole reading. */
const hiddenAxis = {plotDimensionEndPadding: 0, plotDimensionStartPadding: 0, visible: false} as const

/**
 * One line on the tape, with the opening level dashed across it. The dash is what makes the
 * shape mean something at this size: the trace is above it or below it, and that is the story.
 *
 * A line rather than `Chart.Sparkline`, because a sparkline's axes cannot be turned off — its
 * web props carry no axis at all, and iOS defaults both to drawn, so it arrives with a scale
 * around it. The rule is an annotation so it lands in the plot's own space, wherever each
 * renderer decides to put that inside the box.
 */
const TickerSpark = ({quote, scheme}: StocksTickerSparkProps) => {
  const chart = useMemo(() => {
    const color = stocksColors[scheme]
    const tint = quote.change < 0 ? color.down : color.up

    return zyplot(z => ({
      animation: z.animation({enabled: false}),
      annotations: [
        z.annotation.line({
          axis: 'y',
          color: tint,
          dash: [3, 3],
          id: 'open',
          value: quote.values[0] as number,
          width: 1,
        }),
      ],
      categories: categories(quote.values.length),
      height: stocksLayout.sparkline.height,
      plot: {clip: false},
      series: [z.series({color: tint, id: 'spark', label: quote.id, style: {strokeWidth: 1.5}, values: quote.values})],
      xAxis: hiddenAxis,
      yAxis: {...hiddenAxis, domain: {padding: 0.12}},
    }))
  }, [quote, scheme])

  return <Chart.Line {...chart} />
}

export const StocksTickerSpark = memo(TickerSpark)
