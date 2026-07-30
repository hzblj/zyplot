import type {ChartSurface, NativeChartTheme} from '@hzblj/zyplot-core'
import {createContext, type ReactNode, useContext, useMemo} from 'react'

type ChartContextValue = {
  surface?: ChartSurface
  theme?: NativeChartTheme
}

const ChartContext = createContext<ChartContextValue>({})

export const useChartContext = () => useContext(ChartContext)

/** Props for `Chart.Provider`. */
export type ChartProviderProps = ChartContextValue & {
  children: ReactNode
}

/**
 * Sets the default `surface` and `theme` for every chart below it. Anything a
 * chart passes itself wins, key by key.
 */
export const ChartProvider = ({children, surface, theme}: ChartProviderProps) => {
  const value = useMemo(() => ({surface, theme}), [surface, theme])
  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
}
