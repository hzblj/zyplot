import type {ChartNumberFormat} from '../types'

const DEFAULT_LOCALE = 'en-US'

const formatters = new Map<string, Intl.NumberFormat>()

const formatterFor = (locale: string | undefined, decimals: number): Intl.NumberFormat => {
  const key = `${locale ?? DEFAULT_LOCALE}:${decimals}`
  const cached = formatters.get(key)
  if (cached) {
    return cached
  }

  const formatter = new Intl.NumberFormat(locale ?? DEFAULT_LOCALE, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })
  formatters.set(key, formatter)

  return formatter
}

export const CHART_EMPTY_VALUE = '–'

export const formatChartNumber = (value: number | null | undefined, format?: ChartNumberFormat): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return CHART_EMPTY_VALUE
  }

  const formatted = formatterFor(format?.locale, format?.decimals ?? 0).format(value)

  return `${format?.prefix ?? ''}${formatted}${format?.suffix ?? ''}`
}

export const escapeChartHtml = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
