'use client'

import type {ChartTheme} from '@hzblj/zyplot-core'
import {useContext, useEffect, useMemo, useState} from 'react'

import {toCanvasColor} from '../color'
import {ChartThemeContext} from '../theme'

export type ChartDivergingTokens = {
  negative: string
  negativeSoft: string
  neutral: string
  positive: string
  positiveSoft: string
}

export type ChartTokens = {
  axis: string
  border: string
  categorical: string[]
  diverging: ChartDivergingTokens
  fontFamily: string
  grid: string
  label: string
  muted: string
  sequential: string[]
  surface: string
  track: string
}

const CATEGORICAL_SLOTS = [1, 2, 3, 4, 5, 6, 7]
const SEQUENTIAL_STEPS = [1, 2, 3, 4, 5]
const SYSTEM_FONT_STACK =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

const readVariable = (styles: CSSStyleDeclaration, name: string): string =>
  toCanvasColor(styles.getPropertyValue(name).trim())

let untouchedFontFamily: string | null = null

const uaFontFamily = (): string => {
  if (untouchedFontFamily !== null) {
    return untouchedFontFamily
  }

  const probe = document.createElement('div')
  probe.style.setProperty('all', 'initial')
  document.documentElement.append(probe)
  untouchedFontFamily = getComputedStyle(probe).fontFamily
  probe.remove()

  return untouchedFontFamily
}

const readFontFamily = (styles: CSSStyleDeclaration): string => {
  const inherited = styles.fontFamily.trim()

  return !inherited || inherited === uaFontFamily() ? SYSTEM_FONT_STACK : inherited
}

export const readChartTokens = (element: Element = document.documentElement): ChartTokens => {
  const styles = getComputedStyle(element)

  return {
    axis: readVariable(styles, '--color-chart-axis'),
    border: readVariable(styles, '--color-border-tertiary'),
    categorical: CATEGORICAL_SLOTS.map(slot => readVariable(styles, `--color-chart-${slot}`)),
    diverging: {
      negative: readVariable(styles, '--color-chart-diverging-negative'),
      negativeSoft: readVariable(styles, '--color-chart-diverging-negative-soft'),
      neutral: readVariable(styles, '--color-chart-diverging-neutral'),
      positive: readVariable(styles, '--color-chart-diverging-positive'),
      positiveSoft: readVariable(styles, '--color-chart-diverging-positive-soft'),
    },
    fontFamily: readFontFamily(styles),
    grid: readVariable(styles, '--color-chart-grid'),
    label: readVariable(styles, '--color-chart-label'),
    muted: readVariable(styles, '--color-chart-muted'),
    sequential: SEQUENTIAL_STEPS.map(step => readVariable(styles, `--color-chart-sequential-${step}`)),
    surface: readVariable(styles, '--color-chart-surface'),
    track: readVariable(styles, '--color-chart-track'),
  }
}

const withChartTheme = (tokens: ChartTokens, theme: ChartTheme): ChartTokens => {
  const colors = theme.colors

  return {
    ...tokens,
    axis: colors?.axis ? toCanvasColor(colors.axis) : tokens.axis,
    categorical: colors?.categorical?.length ? colors.categorical.map(toCanvasColor) : tokens.categorical,
    diverging: {
      ...tokens.diverging,
      negative: colors?.negative ? toCanvasColor(colors.negative) : tokens.diverging.negative,
      positive: colors?.positive ? toCanvasColor(colors.positive) : tokens.diverging.positive,
    },
    fontFamily: theme.typography?.fontFamily ?? tokens.fontFamily,
    grid: colors?.grid ? toCanvasColor(colors.grid) : tokens.grid,
    label: colors?.label ? toCanvasColor(colors.label) : tokens.label,
    surface: colors?.surface ? toCanvasColor(colors.surface) : tokens.surface,
    track: colors?.track ? toCanvasColor(colors.track) : tokens.track,
  }
}

export const useChartTokens = (chartTheme?: ChartTheme): ChartTokens | null => {
  const [tokens, setTokens] = useState<ChartTokens | null>(null)
  const theme = useContext(ChartThemeContext)

  useEffect(() => {
    const sync = () => setTokens(readChartTokens(theme?.rootRef.current ?? document.body ?? document.documentElement))
    sync()

    const observer = new MutationObserver(sync)
    const attributeFilter = ['class', 'data-theme', 'data-zyplot-color-mode', 'style']
    observer.observe(document.documentElement, {
      attributeFilter,
      attributes: true,
    })

    const themeRoot = theme?.rootRef.current
    if (themeRoot && themeRoot !== document.documentElement) {
      observer.observe(themeRoot, {
        attributeFilter,
        attributes: true,
      })
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', sync)

    return () => {
      media.removeEventListener('change', sync)
      observer.disconnect()
    }
  }, [theme])

  return useMemo(() => (tokens && chartTheme ? withChartTheme(tokens, chartTheme) : tokens), [chartTheme, tokens])
}

export const seriesColor = (tokens: ChartTokens, entry: {color?: string; slot?: number}, index: number): string => {
  if (entry.color) {
    return toCanvasColor(entry.color)
  }

  const resolved = entry.slot ?? index + 1
  const offset = (resolved - 1) % tokens.categorical.length

  return tokens.categorical[offset] ?? tokens.muted
}

export const emphasisSeriesColor = (
  tokens: ChartTokens,
  entry: {id: string; slot?: number},
  index: number,
  emphasisId?: string
): string => {
  if (emphasisId && entry.id !== emphasisId) {
    return tokens.muted
  }

  return seriesColor(tokens, entry, index)
}
