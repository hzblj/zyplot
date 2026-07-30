export type QuoteRangeId = '1d' | '1w' | '1m' | '6m' | '1y' | '5y' | 'max'

export type QuoteCandle = {
  category: string
  close: number
  high: number
  id: string
  low: number
  open: number
}

export type QuoteEvent = {
  badge: string
  category: string
  rows: {label: string; value: string}[]
  title: string
}

export type QuoteRange = {
  event?: QuoteEvent
  candles: QuoteCandle[]
  categories: string[]
  baseline: number
  baselineLabel: string
  id: QuoteRangeId
  label: string
  periodLabel: string
  pointLabels: string[]
  values: (number | null)[]
}

const seeded = (seed: number) => {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

const round = (value: number) => Math.round(value * 100) / 100

const walk = ({
  count,
  end,
  seed,
  start,
  volatility,
}: {
  count: number
  end: number
  seed: number
  start: number
  volatility: number
}) => {
  const random = seeded(seed)
  const values: number[] = [start]
  for (let index = 1; index < count; index += 1) {
    const remaining = count - 1 - index
    const previous = values[index - 1]
    const pull = remaining === 0 ? 1 : 1 / (remaining + 1)
    const drift = (end - previous) * pull
    const shock = (random() - 0.5) * 2 * volatility * previous
    values.push(previous + drift + shock)
  }
  values[count - 1] = end
  return values.map(round)
}

const bucket = (values: number[], labels: string[], size: number, seed: number) => {
  const random = seeded(seed)
  const candles: QuoteCandle[] = []
  for (let start = 0; start < values.length; start += size) {
    const slice = values.slice(start, start + size)
    if (slice.length === 0) {
      continue
    }
    const open = slice[0]
    const close = slice[slice.length - 1]
    const middle = (open + close) / 2
    const bodyFloor = middle * 0.012
    const spread = Math.max(Math.abs(close - open), bodyFloor) / 2
    const isUp = close >= open
    const bodyLow = round(middle - spread)
    const bodyHigh = round(middle + spread)
    const wick = middle * 0.006
    candles.push({
      category: labels[start],
      close: isUp ? bodyHigh : bodyLow,
      high: round(Math.max(...slice, bodyHigh) + wick * (0.4 + random())),
      id: `candle-${start}`,
      low: round(Math.min(...slice, bodyLow) - wick * (0.4 + random())),
      open: isUp ? bodyLow : bodyHigh,
    })
  }
  return candles
}

const intradayLabels = (count: number) => {
  const labels: string[] = []
  for (let index = 0; index < count; index += 1) {
    const minutes = 9 * 60 + 30 + index * 5
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    labels.push(`${hour}:${String(minute).padStart(2, '0')}`)
  }
  return labels
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const dayLabels = (count: number, stepDays: number, endDay: number) => {
  const labels: string[] = []
  const start = new Date(2026, 6, endDay)
  for (let index = count - 1; index >= 0; index -= 1) {
    const day = new Date(start)
    day.setDate(start.getDate() - index * stepDays)
    labels.push(`${months[day.getMonth()]} ${day.getDate()}`)
  }
  return labels
}

const monthLabels = (count: number, stepMonths: number) => {
  const labels: string[] = []
  const start = new Date(2026, 6, 1)
  for (let index = count - 1; index >= 0; index -= 1) {
    const month = new Date(start)
    month.setMonth(start.getMonth() - index * stepMonths)
    labels.push(`${months[month.getMonth()]} ${String(month.getFullYear()).slice(2)}`)
  }
  return labels
}

const INTRADAY_SLOTS = 114
const INTRADAY_ELAPSED = 48
export const INTRADAY_OPEN = 24

const intradayPrices = [
  305.24, 305.17, 304.96, 304.9, 305.2, 305.5, 305.61, 305.67, 305.7, 305.71, 305.62, 305.45, 305.25, 305.05, 304.77,
  304.49, 304.5, 304.78, 304.9, 304.81, 304.6, 304.23, 304, 304.17, 304.3, 304.1, 303.86, 304.14, 304.61, 304.95,
  305.22, 305.72, 306.43, 306.86, 307.11, 307.38, 307.51, 306.67, 305.19, 304.63, 305.24, 305.69, 304.66, 302.43,
  301.14, 301.62, 301.96, 301.97,
]

const weekPrices = walk({
  count: 56,
  end: 301.96,
  seed: 731,
  start: 373.2,
  volatility: 0.0075,
})

const monthPrices = walk({
  count: 44,
  end: 301.96,
  seed: 4409,
  start: 418.4,
  volatility: 0.011,
})

const halfYearPrices = walk({
  count: 60,
  end: 301.96,
  seed: 66,
  start: 248.5,
  volatility: 0.019,
})

const yearPrices = walk({
  count: 64,
  end: 301.96,
  seed: 1988,
  start: 219.4,
  volatility: 0.024,
})

const fiveYearPrices = walk({
  count: 60,
  end: 301.96,
  seed: 5150,
  start: 22.4,
  volatility: 0.09,
})

const maxPrices = walk({
  count: 66,
  end: 301.96,
  seed: 2010,
  start: 1.59,
  volatility: 0.11,
})

const intradayCategories = intradayLabels(INTRADAY_SLOTS)

const ranges: QuoteRange[] = [
  {
    baseline: 309.22,
    baselineLabel: '309.22',
    candles: bucket(intradayPrices, intradayCategories.slice(0, INTRADAY_ELAPSED), 2, 439),
    categories: intradayCategories,
    id: '1d',
    label: '1D',
    periodLabel: 'Today',
    pointLabels: intradayCategories.map(label => `Today, ${label}`),
    values: [...intradayPrices, ...Array<null>(INTRADAY_SLOTS - INTRADAY_ELAPSED).fill(null)],
  },
  {
    baseline: 373.2,
    baselineLabel: '373.20',
    candles: bucket(weekPrices, dayLabels(56, 1, 28), 4, 662),
    categories: dayLabels(56, 1, 28),
    event: {
      badge: 'P',
      category: dayLabels(56, 1, 28)[46],
      rows: [{label: 'Dividend', value: '0.26 $'}],
      title: 'Events',
    },
    id: '1w',
    label: '1W',
    periodLabel: 'Past week',
    pointLabels: dayLabels(56, 1, 28),
    values: weekPrices,
  },
  {
    baseline: 382.2,
    baselineLabel: '382.20',
    candles: bucket(monthPrices, dayLabels(44, 1, 28), 2, 134),
    categories: dayLabels(44, 1, 28),
    event: {
      badge: 'P',
      category: dayLabels(44, 1, 28)[30],
      rows: [{label: 'Dividend', value: '0.26 $'}],
      title: 'Events',
    },
    id: '1m',
    label: '1M',
    periodLabel: 'Past month',
    pointLabels: dayLabels(44, 1, 28),
    values: monthPrices,
  },
  {
    baseline: 248.5,
    baselineLabel: '248.50',
    candles: bucket(halfYearPrices, dayLabels(60, 3, 28), 3, 147),
    categories: dayLabels(60, 3, 28),
    id: '6m',
    label: '6M',
    periodLabel: 'Past 6 months',
    pointLabels: dayLabels(60, 3, 28),
    values: halfYearPrices,
  },
  {
    baseline: 219.4,
    baselineLabel: '219.40',
    candles: bucket(yearPrices, dayLabels(64, 6, 28), 4, 685),
    categories: dayLabels(64, 6, 28),
    id: '1y',
    label: '1Y',
    periodLabel: 'Past year',
    pointLabels: dayLabels(64, 6, 28),
    values: yearPrices,
  },
  {
    baseline: 22.4,
    baselineLabel: '22.40',
    candles: bucket(fiveYearPrices, monthLabels(60, 1), 3, 496),
    categories: monthLabels(60, 1),
    id: '5y',
    label: '5Y',
    periodLabel: 'Past 5 years',
    pointLabels: monthLabels(60, 1),
    values: fiveYearPrices,
  },
  {
    baseline: 1.59,
    baselineLabel: '1.59',
    candles: bucket(maxPrices, monthLabels(66, 3), 3, 499),
    categories: monthLabels(66, 3),
    id: 'max',
    label: 'Max',
    periodLabel: 'Since IPO',
    pointLabels: monthLabels(66, 3),
    values: maxPrices,
  },
]

export const quoteRanges = ranges

export const quoteRange = (id: QuoteRangeId) => ranges.find(range => range.id === id) ?? ranges[0]

export const quote = {
  currency: '$',
  industry: 'Electric Vehicles',
  mark: 'T',
  markColor: '#e31937',
  name: 'Tesla',
  symbol: 'TSLA',
} as const

export const quoteTabs = ['Overview', 'Financials'] as const

export type QuoteTabId = (typeof quoteTabs)[number]

export const formatNumber = (value: number, decimals = 2) => {
  const fixed = Math.abs(value).toFixed(decimals)
  const [whole, fraction] = fixed.split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const sign = value < 0 ? '-' : ''
  return fraction ? `${sign}${grouped}.${fraction}` : `${sign}${grouped}`
}

export const splitPrice = (value: number) => {
  const parts = formatNumber(value).split('.')
  return {fraction: parts[1] ?? '00', whole: parts[0]}
}

export const lastKnown = (values: readonly (number | null)[]) => {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    const value = values[index]
    if (value !== null) {
      return {index, value}
    }
  }
  return {index: 0, value: 0}
}
