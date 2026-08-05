import {createContext, type ReactNode, useContext} from 'react'
import type {StepsView} from './use-steps-view'

const StepsReadingContext = createContext<StepsView | null>(null)

/**
 * What is being read, for the cards the chart mounts itself.
 *
 * A slot view is named in the chart's config as a component, so what it shows cannot arrive as a prop
 * from here — it subscribes instead. Which is the point: the card follows the fingers in the chart's
 * own layout, and a reading changing what it says never changes a prop on the chart.
 */
export const StepsReadingProvider = ({children, view}: {children: ReactNode; view: StepsView}) => (
  <StepsReadingContext.Provider value={view}>{children}</StepsReadingContext.Provider>
)

export const useStepsReading = () => useContext(StepsReadingContext)
