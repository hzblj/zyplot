import type {QuoteCandle, QuoteEvent} from '@zyplot/feature-charts/revolut'
import {createContext, type ReactNode, useContext} from 'react'
import type {QuoteReadout} from './use-quote-readout'

/** What the card and the badge read: the reading, and the period they are reading it in. */
export type QuoteReading = {
  candles?: readonly QuoteCandle[]
  event?: QuoteEvent
  readout: QuoteReadout
}

const QuoteReadingContext = createContext<QuoteReading | null>(null)

/**
 * The reading, for the views the chart mounts itself — the card beside the touch and the badge on
 * the event rule.
 *
 * Both are named in the chart's config as components, so what they show cannot arrive as a prop
 * from here: they subscribe instead, and a scrub changes the card without changing a prop on the
 * chart.
 */
export const QuoteReadingProvider = ({children, reading}: {children: ReactNode; reading: QuoteReading}) => (
  <QuoteReadingContext.Provider value={reading}>{children}</QuoteReadingContext.Provider>
)

export const useQuoteReading = () => useContext(QuoteReadingContext)
