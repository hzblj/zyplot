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

/** `'inherit'` reads the surrounding page's mode. The rest pin the charts. */
export type ChartColorMode = 'dark' | 'inherit' | 'light' | 'system'

/**
 * Colours and fonts a subtree of charts draws with, applied as CSS variables.
 *
 * A superset of `ChartTheme`, the shape a single chart takes: the provider writes
 * variables rather than painting, so it can set the two palettes and the greys
 * that no single chart has a variable of its own to override. Anything valid on a
 * chart is valid here, which is what lets one object serve both.
 */
export type ChartProviderTheme = {
  colors?: ChartThemeColors & {
    /** Tooltip hairline. */
    border?: string
    /** A signed scale in full. The flat negative and positive above are its shorthand. */
    diverging?: {
      negative?: string
      negativeSoft?: string
      neutral?: string
      positive?: string
      positiveSoft?: string
    }
    /** The grey a de-emphasised series drops to. */
    muted?: string
    /** Low to high. Heatmap, treemap, sunburst. */
    sequential?: readonly string[]
  }
  typography?: ChartTypography
}

/** Props for `Chart.Provider`. */
export type ChartProviderProps = {
  children: ReactNode
  className?: string
  colorMode?: ChartColorMode
  /** Container treatment inherited by every chart in the subtree. */
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
    // The five-key form wins over the shorthand, so passing both is not ambiguous.
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

/**
 * Sets the theme, colour mode and surface for every chart below it. Anything a
 * chart passes itself wins, key by key.
 */
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
