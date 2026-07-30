import {useColorScheme} from './color-scheme'
import {type ColorScheme, type ColorTokens, chartThemes, colors} from './tokens'

export type Theme = {
  chart: (typeof chartThemes)[ColorScheme]
  color: ColorTokens
  scheme: ColorScheme
}

const themes: Record<ColorScheme, Theme> = {
  dark: {chart: chartThemes.dark, color: colors.dark, scheme: 'dark'},
  light: {chart: chartThemes.light, color: colors.light, scheme: 'light'},
}

export const useTheme = (): Theme => themes[useColorScheme()]
