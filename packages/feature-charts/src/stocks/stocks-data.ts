export type StocksRangeId = '1d' | '1w' | '1m' | '3m' | '6m' | 'ytd' | '1y' | '2y' | '5y' | '10y' | 'max'

type Waypoint = readonly [at: number, value: number]

export type StocksRange = {
  /** Index into `categories` for each x-axis tick, with the label to write there. */
  axisTicks: readonly {index: number; label: string}[]
  id: StocksRangeId
  label: string
  open: number
  periodLabel: string
  /** One per slot, for the date above the crosshair. */
  pointLabels: readonly string[]
  values: readonly number[]
  volumes: readonly number[]
}

export type StocksReading = {
  high: number
  last: number
  low: number
}

const SLOTS = 120
export const stocksCategories = Array.from({length: SLOTS}, (_, index) => String(index))

const seeded = (seed: number) => {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

const round = (value: number) => Math.round(value * 100) / 100

const target = (waypoints: readonly Waypoint[], position: number) => {
  const next = waypoints.findIndex(([at]) => at >= position)
  if (next <= 0) {
    return (waypoints[next === 0 ? 0 : waypoints.length - 1] ?? [0, 0])[1]
  }
  const [fromAt, fromValue] = waypoints[next - 1] as Waypoint
  const [toAt, toValue] = waypoints[next] as Waypoint
  const span = toAt - fromAt || 1
  return fromValue + (toValue - fromValue) * ((position - fromAt) / span)
}

const walk = ({seed, volatility, waypoints}: {seed: number; volatility: number; waypoints: readonly Waypoint[]}) => {
  const random = seeded(seed)
  const chop = volatility * 0.55
  const values: number[] = []
  let current = waypoints[0]?.[1] ?? 0
  for (let index = 0; index < SLOTS; index += 1) {
    const level = target(waypoints, index / (SLOTS - 1))
    if (index === 0) {
      values.push(round(level))
      continue
    }
    current = current + (level - current) * 0.42 + (random() - 0.5) * 2 * volatility * level
    values.push(round(current + (random() - 0.5) * 2 * chop * level))
  }
  const last = waypoints[waypoints.length - 1]?.[1]
  if (last !== undefined) {
    values[SLOTS - 1] = round(last)
  }
  return values
}

/** Mostly quiet, with the occasional session that clears its neighbours by a mile. */
const volumes = (seed: number) => {
  const random = seeded(seed)
  return Array.from({length: SLOTS}, () => {
    const base = 0.18 + random() * 0.34
    return round(random() > 0.94 ? base + 0.42 + random() * 0.4 : base)
  })
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const NOW = new Date(2026, 6, 30, 16, 0)
const MINUTE = 60_000
const DAY = 24 * 60

const clockLabel = (at: Date) => {
  const hour = at.getHours()
  const shown = hour % 12 === 0 ? 12 : hour % 12
  return `${shown}:${String(at.getMinutes()).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
}

const dateLabel = (at: Date) => `${MONTHS[at.getMonth()]} ${at.getDate()}, ${at.getFullYear()}`

const at = (minutes: number, index: number) =>
  new Date(NOW.getTime() - (SLOTS - 1 - index) * (minutes / (SLOTS - 1)) * MINUTE)

const pointLabels = (minutes: number, format: (moment: Date) => string) =>
  Array.from({length: SLOTS}, (_, index) => format(at(minutes, index)))

/**
 * Four ticks across the plot, the first on its left edge. With four rules down and four
 * across, the grid behind the trace is a mesh of cells rather than a set of stripes.
 */
const axisTicks = (minutes: number, format: (moment: Date) => string) =>
  Array.from({length: 4}, (_, step) => {
    const index = Math.round((step / 4) * (SLOTS - 1))
    return {index, label: format(at(minutes, index))}
  })

const hourTick = (moment: Date) => {
  const hour = moment.getHours()
  return `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'AM' : 'PM'}`
}
const dayTick = (moment: Date) => String(moment.getDate())
const monthTick = (moment: Date) => MONTHS[moment.getMonth()] as string
const yearTick = (moment: Date) => String(moment.getFullYear())

const SESSION = 390

const ranges: StocksRange[] = [
  {
    axisTicks: axisTicks(SESSION, hourTick),
    id: '1d',
    label: '1D',
    open: 228.41,
    periodLabel: 'At close',
    pointLabels: pointLabels(SESSION, clockLabel),
    values: walk({
      seed: 20260730,
      volatility: 0.0016,
      waypoints: [
        [0, 228.41],
        [0.12, 229.84],
        [0.26, 229.1],
        [0.42, 230.66],
        [0.58, 230.02],
        [0.74, 231.48],
        [0.9, 231.06],
        [1, 232.15],
      ],
    }),
    volumes: volumes(9301),
  },
  {
    axisTicks: axisTicks(7 * DAY, dayTick),
    id: '1w',
    label: '1W',
    open: 224.9,
    periodLabel: 'Past week',
    pointLabels: pointLabels(7 * DAY, dateLabel),
    values: walk({
      seed: 4471,
      volatility: 0.004,
      waypoints: [
        [0, 224.9],
        [0.22, 227.6],
        [0.44, 222.85],
        [0.66, 228.3],
        [0.84, 230.9],
        [1, 232.15],
      ],
    }),
    volumes: volumes(1182),
  },
  {
    axisTicks: axisTicks(30 * DAY, dayTick),
    id: '1m',
    label: '1M',
    open: 241.73,
    periodLabel: 'Past month',
    pointLabels: pointLabels(30 * DAY, dateLabel),
    values: walk({
      seed: 3271,
      volatility: 0.007,
      waypoints: [
        [0, 241.73],
        [0.14, 236.2],
        [0.26, 248.4],
        [0.38, 244.1],
        [0.52, 251.6],
        [0.64, 243.8],
        [0.78, 234.2],
        [0.9, 229.4],
        [1, 232.15],
      ],
    }),
    volumes: volumes(5540),
  },
  {
    axisTicks: axisTicks(91 * DAY, monthTick),
    id: '3m',
    label: '3M',
    open: 213.06,
    periodLabel: 'Past 3 months',
    pointLabels: pointLabels(91 * DAY, dateLabel),
    values: walk({
      seed: 8817,
      volatility: 0.011,
      waypoints: [
        [0, 213.06],
        [0.18, 206.4],
        [0.34, 221.9],
        [0.5, 232.7],
        [0.68, 251.6],
        [0.86, 236.4],
        [1, 232.15],
      ],
    }),
    volumes: volumes(7714),
  },
  {
    axisTicks: axisTicks(182 * DAY, monthTick),
    id: '6m',
    label: '6M',
    open: 196.42,
    periodLabel: 'Past 6 months',
    pointLabels: pointLabels(182 * DAY, dateLabel),
    values: walk({
      seed: 5106,
      volatility: 0.015,
      waypoints: [
        [0, 196.42],
        [0.12, 188.7],
        [0.28, 204.3],
        [0.46, 213.9],
        [0.62, 229.4],
        [0.78, 251.6],
        [0.92, 236.1],
        [1, 232.15],
      ],
    }),
    volumes: volumes(2288),
  },
  {
    axisTicks: axisTicks(211 * DAY, monthTick),
    id: 'ytd',
    label: 'YTD',
    open: 189.55,
    periodLabel: 'Year to date',
    pointLabels: pointLabels(211 * DAY, dateLabel),
    values: walk({
      seed: 20260101,
      volatility: 0.016,
      waypoints: [
        [0, 189.55],
        [0.1, 182.4],
        [0.24, 199.8],
        [0.4, 207.2],
        [0.56, 218.6],
        [0.72, 234.8],
        [0.86, 251.6],
        [1, 232.15],
      ],
    }),
    volumes: volumes(6624),
  },
  {
    axisTicks: axisTicks(365 * DAY, monthTick),
    id: '1y',
    label: '1Y',
    open: 172.88,
    periodLabel: 'Past year',
    pointLabels: pointLabels(365 * DAY, dateLabel),
    values: walk({
      seed: 1990,
      volatility: 0.019,
      waypoints: [
        [0, 172.88],
        [0.14, 165.3],
        [0.3, 186.9],
        [0.46, 178.4],
        [0.62, 204.7],
        [0.78, 226.3],
        [0.9, 251.6],
        [1, 232.15],
      ],
    }),
    volumes: volumes(1907),
  },
  {
    axisTicks: axisTicks(730 * DAY, yearTick),
    id: '2y',
    label: '2Y',
    open: 148.2,
    periodLabel: 'Past 2 years',
    pointLabels: pointLabels(730 * DAY, dateLabel),
    values: walk({
      seed: 2024,
      volatility: 0.024,
      waypoints: [
        [0, 148.2],
        [0.16, 161.4],
        [0.32, 142.8],
        [0.5, 174.6],
        [0.68, 193.2],
        [0.84, 228.4],
        [0.94, 251.6],
        [1, 232.15],
      ],
    }),
    volumes: volumes(3345),
  },
  {
    axisTicks: axisTicks(1826 * DAY, yearTick),
    id: '5y',
    label: '5Y',
    open: 74.36,
    periodLabel: 'Past 5 years',
    pointLabels: pointLabels(1826 * DAY, dateLabel),
    values: walk({
      seed: 2021,
      volatility: 0.031,
      waypoints: [
        [0, 74.36],
        [0.14, 116.8],
        [0.3, 152.4],
        [0.44, 128.6],
        [0.6, 168.9],
        [0.76, 186.4],
        [0.92, 251.6],
        [1, 232.15],
      ],
    }),
    volumes: volumes(4062),
  },
  {
    axisTicks: axisTicks(3652 * DAY, yearTick),
    id: '10y',
    label: '10Y',
    open: 24.16,
    periodLabel: 'Past 10 years',
    pointLabels: pointLabels(3652 * DAY, dateLabel),
    values: walk({
      seed: 2016,
      volatility: 0.038,
      waypoints: [
        [0, 24.16],
        [0.18, 41.9],
        [0.34, 68.4],
        [0.48, 118.2],
        [0.62, 142.6],
        [0.74, 128.4],
        [0.88, 186.9],
        [1, 232.15],
      ],
    }),
    volumes: volumes(8850),
  },
  {
    axisTicks: axisTicks(16_800 * DAY, yearTick),
    id: 'max',
    label: 'ALL',
    open: 0.1,
    periodLabel: 'All time',
    pointLabels: pointLabels(16_800 * DAY, dateLabel),
    values: walk({
      seed: 1980,
      volatility: 0.09,
      waypoints: [
        [0, 0.1],
        [0.24, 0.36],
        [0.44, 1.28],
        [0.6, 9.4],
        [0.72, 28.6],
        [0.84, 78.4],
        [0.94, 174.2],
        [1, 232.15],
      ],
    }),
    volumes: volumes(1980),
  },
]

export const stocksRanges = ranges
export const stocksRange = (id: StocksRangeId) => ranges.find(range => range.id === id) ?? (ranges[0] as StocksRange)

export const stocksReading = (range: StocksRange): StocksReading => ({
  high: Math.max(...range.values),
  last: range.values[range.values.length - 1] as number,
  low: Math.min(...range.values),
})

export type StocksQuote = {
  currency: string
  exchange: string
  name: string
  symbol: string
}

export const stocksQuote: StocksQuote = {
  currency: 'USD',
  exchange: 'NASDAQ',
  name: 'Apple Inc.',
  symbol: 'AAPL',
}

/** The after-hours reading, shown beside the close on the intraday range only. */
export const stocksAfterHours = {change: 0.62, price: 232.77}

export type StocksStat = {
  id: string
  label: string
  value: string
}

/** Three per column, the way the grid is read; the columns scroll sideways. */
export const stocksStatColumns: readonly (readonly StocksStat[])[] = [
  [
    {id: 'open', label: 'Open', value: '228.41'},
    {id: 'high', label: 'High', value: '232.86'},
    {id: 'low', label: 'Low', value: '227.94'},
  ],
  [
    {id: 'vol', label: 'Vol', value: '48.7M'},
    {id: 'pe', label: 'P/E', value: '34.28'},
    {id: 'mkt', label: 'Mkt Cap', value: '3.47T'},
  ],
  [
    {id: '52high', label: '52W H', value: '253.10'},
    {id: '52low', label: '52W L', value: '164.08'},
    {id: 'avgvol', label: 'Avg Vol', value: '54.2M'},
  ],
  [
    {id: 'yield', label: 'Yield', value: '0.43%'},
    {id: 'beta', label: 'Beta', value: '1.21'},
    {id: 'eps', label: 'EPS', value: '6.77'},
  ],
]

export type StocksTickerQuote = {
  change: number
  id: string
  name: string
  open: number
  price: number
  values: readonly number[]
}

const SPARK = 44

const spark = (seed: number, drift: number) => {
  const random = seeded(seed)
  let current = 100
  return Array.from({length: SPARK}, (_, index) => {
    current = current + drift * (100 / SPARK) + (random() - 0.5) * 3.6
    return round(index === 0 ? 100 : current)
  })
}

/** The tape above the sheet. Each one carries its own line, and its own direction. */
export const stocksTicker: readonly StocksTickerQuote[] = [
  {change: 3.74, id: 'AAPL', name: 'Apple Inc.', open: 228.41, price: 232.15, values: spark(101, 0.06)},
  {change: -2.08, id: 'GOOG', name: 'Alphabet Inc.', open: 335.76, price: 333.68, values: spark(202, -0.04)},
  {change: 11.59, id: 'NVDA', name: 'NVIDIA Corp.', open: 178.4, price: 189.99, values: spark(303, 0.08)},
  {change: -46.58, id: 'META', name: 'Meta Platforms', open: 585.61, price: 539.03, values: spark(404, -0.09)},
  {change: 8.42, id: 'MSFT', name: 'Microsoft Corp.', open: 512.18, price: 520.6, values: spark(505, 0.05)},
]

const grouped = (value: number, decimals: number) => {
  const [whole = '0', fraction] = Math.abs(value).toFixed(decimals).split('.')
  const digits = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return fraction ? `${digits}.${fraction}` : digits
}

export const formatPrice = (value: number, decimals = 2) => grouped(value, decimals)
export const formatSigned = (value: number, decimals = 2) => `${value < 0 ? '-' : '+'}${grouped(value, decimals)}`
export const formatPercent = (value: number) => `${value < 0 ? '-' : '+'}${grouped(Math.abs(value), 2)}%`

export const percentChange = (from: number, to: number) => (from === 0 ? 0 : ((to - from) / from) * 100)
