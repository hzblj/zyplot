import {Chart, useLastReading, zyplot} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import type {QuoteRange} from './quote-data'
import {quoteColors, quoteLayout} from './quote-theme'
import type {RevolutChartProps} from './revolut-chart'
import {blooms, plotInsets, priceAxis, quoteChartStyle, rule} from './revolut-chart-style'

const lineDomain = (range: QuoteRange) => {
  const known = range.values.filter((value): value is number => value !== null)
  return {max: Math.max(...known, range.baseline), min: Math.min(...known)}
}

const LineChart = ({
  annotationViews,
  eventView,
  height = quoteLayout.chartHeight,
  isEventBadgeVisible = false,
  isLoading,
  onInteraction,
  range,
  rangeView,
  scheme,
  tooltip,
}: RevolutChartProps) => {
  const live = useLastReading(range.categories, range.values)

  const chart = useMemo(() => {
    const color = quoteColors[scheme]
    const bloom = blooms[scheme]
    const style = quoteChartStyle(scheme)
    const event = range.event

    return zyplot(z => ({
      animation: style.arrival,
      annotations: [
        style.baselineAnnotation(range),
        ...(event
          ? [
              z.annotation.line({
                axis: 'x',
                // Off where a view of the app's own is placed on the rule instead.
                badge: isEventBadgeVisible ? event.badge : undefined,
                color: color.label,
                dash: rule.eventDash,
                id: 'event',
                labelPosition: 'top',
                size: 18,
                value: event.category,
                // The app's own pill on the rule, if it has one: the id is written here, once.
                view: eventView,
                width: rule.width,
              }),
            ]
          : []),
        ...(live && range.id === '1d'
          ? [
              z.annotation.point({
                color: color.chartLive,
                glow: z.glow({color: color.down, ...bloom.live}),
                halo: z.halo({color: color.chartLiveHalo, size: 15}),
                id: 'live',
                pulse: {duration: 520, interval: 1480, ...bloom.pulse},
                size: 6.5,
                x: live.category,
                y: live.value,
              }),
            ]
          : []),
      ],
      annotationViews,
      categories: range.categories,
      height,
      // A window around the reading rather than a dot: the trace is smoothed, so a point on it is
      // somewhere the line passes through and not a price that was ever quoted.
      interaction: {
        ...style.scrubbing,
        marker: z.marker.segment({
          color: color.chartScrub,
          glow: z.glow({color: color.down, ...bloom.scrub}),
          span: 2,
        }),
      },
      isLoading,
      isSmooth: true,
      onInteraction,
      plot: {clip: false},
      rangeView,
      series: [
        z.series({
          color: color.down,
          id: 'price',
          label: range.label,
          style: {glow: z.glow(bloom.trace), strokeWidth: 2.3},
          values: range.values,
        }),
      ],
      theme: style.theme,
      // The readout above the plot is the reading, so no card is drawn unless one is handed over.
      tooltip: tooltip ?? false,
      xAxis: {...plotInsets, visible: false},
      yAxis: priceAxis(lineDomain(range)),
    }))
  }, [
    annotationViews,
    eventView,
    height,
    isEventBadgeVisible,
    isLoading,
    live,
    onInteraction,
    range,
    rangeView,
    scheme,
    tooltip,
  ])

  return <Chart.Line {...chart} />
}

export const RevolutLineChart = memo(LineChart)
