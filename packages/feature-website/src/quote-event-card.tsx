'use client'

import type {ChartGeometry} from '@hzblj/zyplot'
import type {QuoteEvent} from '@zyplot/feature-charts/revolut'
import {marketingStyles} from './marketing-styles'
import {cn} from './utils'

const styles = marketingStyles()

const CARD_WIDTH = 168
const CARD_GAP = 14

export type QuoteEventCardProps = {
  /** What the pointer is reading, straight from `useChartScrub`. */
  category?: string
  event: QuoteEvent
  geometry: ChartGeometry | null
}

/**
 * The card the stock demo pops beside its event rule, the DOM twin of the one the example app
 * lays over the plot. `geometry` says where the rule landed, so the card follows it on a resize.
 */
export const QuoteEventCard = ({category, event, geometry}: QuoteEventCardProps) => {
  const plot = geometry?.plot
  const spot = geometry?.annotations.find(annotation => annotation.id === 'event')
  if (!plot || !spot) {
    return null
  }

  const room = plot.x + plot.width - CARD_WIDTH
  const trailing = spot.x + CARD_GAP
  const left = trailing <= room ? trailing : spot.x - CARD_GAP - CARD_WIDTH
  const isVisible = category === event.category

  return (
    <div
      className={cn(styles.eventCard(), isVisible ? 'opacity-100' : 'opacity-0')}
      style={{
        left: Math.max(plot.x, Math.min(left, room)),
        top: plot.y + plot.height / 2,
        width: CARD_WIDTH,
      }}
    >
      <p className={styles.eventCardTitle()}>{event.title}</p>
      {event.rows.map(row => (
        <div className={styles.eventCardRow()} key={row.label}>
          <span className={styles.eventCardLabel()}>{row.label}</span>
          <span className={styles.eventCardValue()}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}
