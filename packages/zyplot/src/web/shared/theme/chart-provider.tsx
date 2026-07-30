'use client'

import type {ChartSurface, ChartThemeColors, ChartTypography} from '@hzblj/zyplot-core'
import {
  type CSSProperties,
  createContext,
  type FC,
  type ReactNode,
  type RefObject,
  useContext,
  useMemo,
  useRef,
} from 'react'

export type ChartColorMode = 'dark' | 'inherit' | 'light' | 'system'

export type ChartProviderTheme = {
  colors?: ChartThemeColors & {
    border?: string
    diverging?: {
      negative?: string
      negativeSoft?: string
      neutral?: string
      positive?: string
      positiveSoft?: string
    }
    muted?: string
    sequential?: readonly string[]
  }
  typography?: ChartTypography
}

export type ChartProviderProps = {
  children: ReactNode
  className?: string
  colorMode?: ChartColorMode
  surface?: ChartSurface
  theme?: ChartProviderTheme
}

const ChartSurfaceContext = createContext<ChartSurface | undefined>(undefined)
export const useChartSurface = () => useContext(ChartSurfaceContext)

type ChartThemeContextValue = {
  rootRef: RefObject<HTMLDivElement | null>
}

export const ChartThemeContext = createContext<ChartThemeContextValue | null>(null)

type ChartCSSProperties = CSSProperties & Record<`--zyplot-${string}`, string>

const setPalette = (
  style: ChartCSSProperties,
  name: 'categorical' | 'sequential',
  values: readonly string[] | undefined
) => {
  values?.forEach((value, index) => {
    style[`--zyplot-color-${name}-${index + 1}`] = value
  })
}

const createThemeStyle = (theme: ChartProviderTheme | undefined): ChartCSSProperties => {
  const style = {} as ChartCSSProperties
  const colors = theme?.colors

  setPalette(style, 'categorical', colors?.categorical)
  setPalette(style, 'sequential', colors?.sequential)

  const values = {
    '--zyplot-color-axis': colors?.axis,
    '--zyplot-color-border': colors?.border,
    '--zyplot-color-diverging-negative': colors?.diverging?.negative ?? colors?.negative,
    '--zyplot-color-diverging-negative-soft': colors?.diverging?.negativeSoft,
    '--zyplot-color-diverging-neutral': colors?.diverging?.neutral,
    '--zyplot-color-diverging-positive': colors?.diverging?.positive ?? colors?.positive,
    '--zyplot-color-diverging-positive-soft': colors?.diverging?.positiveSoft,
    '--zyplot-color-grid': colors?.grid,
    '--zyplot-color-label': colors?.label,
    '--zyplot-color-muted': colors?.muted,
    '--zyplot-color-surface': colors?.surface,
    '--zyplot-color-track': colors?.track,
    '--zyplot-font-family': theme?.typography?.fontFamily,
  } as const

  for (const [name, value] of Object.entries(values)) {
    if (value !== undefined) {
      style[name as `--zyplot-${string}`] = value
    }
  }

  return style
}

export const ChartProvider: FC<ChartProviderProps> = ({children, className, colorMode = 'inherit', surface, theme}) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const context = useMemo(() => ({rootRef}), [])
  const style = useMemo(() => createThemeStyle(theme), [theme])

  return (
    <ChartThemeContext.Provider value={context}>
      <ChartSurfaceContext.Provider value={surface}>
        <div className={className} data-zyplot-color-mode={colorMode} ref={rootRef} style={style}>
          {children}
        </div>
      </ChartSurfaceContext.Provider>
    </ChartThemeContext.Provider>
  )
}
