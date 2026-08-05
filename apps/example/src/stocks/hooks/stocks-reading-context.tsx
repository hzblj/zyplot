import {createContext, type ReactNode, useContext} from 'react'
import type {StocksReadout} from './use-stocks-readout'

const StocksReadingContext = createContext<StocksReadout | null>(null)

/**
 * The reading, for the views the chart mounts itself.
 *
 * A slot view is named in the chart's config as a component, so what it shows cannot arrive as a
 * prop from here — it subscribes instead. That is the point: a scrub changes what the price over the
 * finger says without changing a single prop on the chart, and where it says it never leaves the
 * chart's own layout.
 */
export const StocksReadingProvider = ({children, readout}: {children: ReactNode; readout: StocksReadout}) => (
  <StocksReadingContext.Provider value={readout}>{children}</StocksReadingContext.Provider>
)

export const useStocksReading = () => useContext(StocksReadingContext)
