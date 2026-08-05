import {createContext, type ReactNode, useContext} from 'react'
import type {KrakenReadout} from './use-kraken-readout'

const KrakenReadingContext = createContext<KrakenReadout | null>(null)

/**
 * The reading, for the views the chart mounts itself.
 *
 * A slot view is named in the chart's config as a component, so what it shows cannot arrive as a
 * prop from here — it subscribes instead. That is the point: a scrub changes what the chip says
 * without changing a single prop on the chart, so the chart never re-renders while a finger moves.
 */
export const KrakenReadingProvider = ({children, readout}: {children: ReactNode; readout: KrakenReadout}) => (
  <KrakenReadingContext.Provider value={readout}>{children}</KrakenReadingContext.Provider>
)

export const useKrakenReading = () => useContext(KrakenReadingContext)
