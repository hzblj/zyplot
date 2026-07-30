export type KrakenRangeId = '24h' | '1w' | '1m' | '6m' | '1y' | '5y' | 'max'

type Waypoint = readonly [at: number, value: number]

export type KrakenRange = {
  id: KrakenRangeId
  label: string
  open: number
  periodLabel: string
  pointLabels: string[]
  values: number[]
}

export type KrakenReading = {
  high: number
  last: number
  low: number
}

const SLOTS = 96
export const krakenCategories = Array.from({length: SLOTS}, (_, index) => String(index))

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

const walk = ({
  detail,
  seed,
  volatility,
  waypoints,
}: {
  detail?: number
  seed: number
  volatility: number
  waypoints: readonly Waypoint[]
}) => {
  const random = seeded(seed)
  const chop = detail ?? volatility * 0.55
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

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const NOW = new Date(2026, 6, 28, 16, 45)
const MINUTE = 60_000
const DAY = 24 * 60

const clockLabel = (at: Date) => {
  const hour = at.getHours()
  const shown = hour % 12 === 0 ? 12 : hour % 12
  const minute = String(at.getMinutes()).padStart(2, '0')
  return `${shown}:${minute} ${hour < 12 ? 'AM' : 'PM'}`
}

const dateLabel = (at: Date) => `${months[at.getMonth()]} ${at.getDate()}, ${at.getFullYear()}`
const labels = (minutes: number, format: (at: Date) => string) =>
  Array.from({length: SLOTS}, (_, index) =>
    format(new Date(NOW.getTime() - (SLOTS - 1 - index) * (minutes / (SLOTS - 1)) * MINUTE))
  )

const intradayLabels = () =>
  labels(DAY, at => (at.getDate() === NOW.getDate() ? clockLabel(at) : `Yesterday ${clockLabel(at)}`))

const ranges: KrakenRange[] = [
  {
    id: '24h',
    label: '24H',
    open: 57288.25,
    periodLabel: 'last 24 hours',
    pointLabels: intradayLabels(),
    values: walk({
      seed: 20260728,
      volatility: 0.0026,
      waypoints: [
        [0, 57288.25],
        [0.05, 56720],
        [0.1, 57110],
        [0.24, 57180],
        [0.3, 57120],
        [0.34, 56180],
        [0.4, 55780],
        [0.46, 55480],
        [0.55, 55620],
        [0.62, 55980],
        [0.74, 55810],
        [0.88, 55930],
        [0.94, 55360],
        [0.97, 55332.5],
        [1, 55568.2],
      ],
    }),
  },
  {
    id: '1w',
    label: '1W',
    open: 58940.6,
    periodLabel: 'last week',
    pointLabels: labels(7 * DAY, dateLabel),
    values: walk({
      seed: 8814,
      volatility: 0.007,
      waypoints: [
        [0, 58940.6],
        [0.3, 59860],
        [0.55, 57420],
        [0.78, 58010],
        [1, 55568.2],
      ],
    }),
  },
  {
    id: '1m',
    label: '1M',
    open: 63120.4,
    periodLabel: 'last month',
    pointLabels: labels(30 * DAY, dateLabel),
    values: walk({
      seed: 3271,
      volatility: 0.012,
      waypoints: [
        [0, 63120.4],
        [0.22, 65240],
        [0.48, 60180],
        [0.7, 61340],
        [0.88, 56900],
        [1, 55568.2],
      ],
    }),
  },
  {
    id: '6m',
    label: '6M',
    open: 74363.43,
    periodLabel: 'last 6 months',
    pointLabels: labels(182 * DAY, dateLabel),
    values: walk({
      seed: 5106,
      volatility: 0.021,
      waypoints: [
        [0, 74363.43],
        [0.06, 60420],
        [0.2, 63180],
        [0.34, 68740],
        [0.44, 74418.6],
        [0.56, 70120],
        [0.62, 57300],
        [0.74, 54100],
        [0.86, 51298],
        [0.94, 56900],
        [1, 55568.2],
      ],
    }),
  },
  {
    id: '1y',
    label: '1Y',
    open: 101800,
    periodLabel: 'last year',
    pointLabels: labels(365 * DAY, dateLabel),
    values: walk({
      seed: 1990,
      volatility: 0.024,
      waypoints: [
        [0, 101800],
        [0.12, 106275.9],
        [0.28, 92400],
        [0.36, 94100],
        [0.46, 74200],
        [0.6, 62800],
        [0.74, 66900],
        [0.86, 51298],
        [0.95, 57400],
        [1, 55568.2],
      ],
    }),
  },
  {
    id: '5y',
    label: '5Y',
    open: 33052.74,
    periodLabel: 'last 5 years',
    pointLabels: labels(5 * 365 * DAY, dateLabel),
    values: walk({
      seed: 2021,
      volatility: 0.038,
      waypoints: [
        [0, 33052.74],
        [0.1, 21400],
        [0.24, 15549],
        [0.42, 26800],
        [0.54, 44100],
        [0.66, 92600],
        [0.78, 106029.7],
        [0.9, 74300],
        [1, 55568.2],
      ],
    }),
  },
  {
    id: 'max',
    label: 'ALL',
    open: 0.06,
    periodLabel: 'all time',
    pointLabels: labels(16 * 365 * DAY, dateLabel),
    values: walk({
      seed: 2013,
      volatility: 0.105,
      waypoints: [
        [0, 0.06],
        [0.2, 240],
        [0.38, 830],
        [0.52, 6100],
        [0.64, 9800],
        [0.76, 42600],
        [0.88, 106029.7],
        [1, 55568.2],
      ],
    }),
  },
]

export const krakenRanges = ranges
export const krakenRange = (id: KrakenRangeId) => ranges.find(range => range.id === id) ?? (ranges[0] as KrakenRange)

export const krakenReading = (range: KrakenRange): KrakenReading => ({
  high: Math.max(...range.values),
  last: range.values[range.values.length - 1] as number,
  low: Math.min(...range.values),
})

export type KrakenCoin = {
  mark: string
  markColor: string
  name: string
  precision: number
  symbol: string
}

export const krakenCoin: KrakenCoin = {
  mark: '₿',
  markColor: '#f7931a',
  name: 'Bitcoin',
  precision: 2,
  symbol: 'BTC',
}

export const CURRENCY = '€'

export const formatAmount = (value: number, decimals = 2) => {
  const fixed = Math.abs(value).toFixed(decimals)
  const [whole = '0', fraction] = fixed.split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return fraction ? `${grouped}.${fraction}` : grouped
}

export const formatPrice = (value: number, decimals = 2) => `${CURRENCY}${formatAmount(value, decimals)}`
export const formatSigned = (value: number, decimals = 2) =>
  `${value < 0 ? '-' : '+'}${CURRENCY}${formatAmount(value, decimals)}`

export const formatPercent = (value: number) => `${formatAmount(Math.abs(value), 2)}%`

export const splitPrice = (value: number, decimals = 2) => {
  const [whole = '0', fraction = ''] = formatAmount(value, decimals).split('.')
  return {fraction, whole: `${CURRENCY}${whole}`}
}
