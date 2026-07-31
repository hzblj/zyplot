export type FamilyRangeId = '1h' | '1d' | '1w' | '1m' | '1y'

export type FamilyRange = {
  /** The reading the change is measured from: the first price in the window. */
  baseline: number
  /**
   * The axis the window is laid on: one slot per sample, and then the empty ones the domain keeps for
   * the rest of the period. Slots are named by position and never by moment, since the web renderer
   * pairs the old marks with the new ones by category — the moments belong on the crosshair chip.
   */
  categories: string[]
  id: FamilyRangeId
  label: string
  periodLabel: string
  /** What each slot reads as above the crosshair. The window's own moments, not the axis. */
  stamps: string[]
  values: number[]
}

const POINTS = 64
const PRICE = 319.07

const seeded = (seed: number) => {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

const round = (value: number) => Math.round(value * 100) / 100

const interpolate = (levels: readonly number[]) => {
  const segments = levels.length - 1
  return Array.from({length: POINTS}, (_value, index) => {
    const position = (index / (POINTS - 1)) * segments
    const step = Math.min(Math.floor(position), segments - 1)
    return levels[step] + (levels[step + 1] - levels[step]) * (position - step)
  })
}

/**
 * A shape, walked. `levels` are the prices the window passes through as multiples of where it
 * opened — every window closes on the price the header shows, so the last one is not given —
 * and the wander laid over them is tilted back to nothing so both ends stay where they were put.
 */
const walk = ({
  levels,
  seed,
  start,
  volatility,
}: {
  levels: readonly number[]
  seed: number
  start: number
  volatility: number
}) => {
  const random = seeded(seed)
  const path = interpolate([1, ...levels, PRICE / start])
  const wander: number[] = []
  let drift = 0
  for (let index = 0; index < POINTS; index += 1) {
    wander.push(drift)
    drift += (random() - 0.5) * 2 * volatility
  }
  const tilt = wander[POINTS - 1]

  return path.map((level, index) => round(level * start * (1 + wander[index] - (tilt * index) / (POINTS - 1))))
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const NOW = new Date(2026, 6, 30, 15, 48)

type StampFormat = 'date' | 'time' | 'year'

const clock = (date: Date) => {
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours % 12 || 12}:${minutes}${hours < 12 ? 'AM' : 'PM'}`
}

const stamp = (date: Date, format: StampFormat) => {
  if (format === 'time') {
    return clock(date)
  }
  if (format === 'date') {
    return `${months[date.getMonth()]} ${date.getDate()} ${clock(date)}`
  }
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const stamps = (step: number, format: StampFormat) =>
  Array.from({length: POINTS}, (_value, index) => {
    const date = new Date(NOW)
    date.setMinutes(date.getMinutes() - (POINTS - 1 - index) * step)
    return stamp(date, format)
  })

type FamilySpec = {
  format: StampFormat
  id: FamilyRangeId
  label: string
  levels: readonly number[]
  periodLabel: string
  seed: number
  start: number
  step: number
  /**
   * Hours of empty axis kept after the last sample: the part of the period still ahead. A window that
   * ends at now runs out mid-plot rather than at the trailing edge, the way an intraday chart does.
   */
  tailHours: number
  volatility: number
}

const specs: FamilySpec[] = [
  {
    format: 'time',
    id: '1h',
    label: '1H',
    levels: [0.9995, 0.9985, 0.977, 0.9715, 0.9615],
    periodLabel: 'Past hour',
    seed: 1873,
    start: 336.11,
    step: 1,
    tailHours: 1,
    volatility: 0.0012,
  },
  {
    format: 'time',
    id: '1d',
    label: '1D',
    levels: [0.988, 0.978, 0.9695, 0.9645, 0.962, 0.9605, 0.96],
    periodLabel: 'Today',
    seed: 4402,
    start: 339.71,
    step: 6,
    tailHours: 2,
    volatility: 0.0018,
  },
  {
    format: 'date',
    id: '1w',
    label: '1W',
    levels: [1.035, 1.045, 1.052, 1.048, 1.038],
    periodLabel: 'Past week',
    seed: 731,
    start: 322.03,
    step: 160,
    tailHours: 0,
    volatility: 0.0035,
  },
  {
    format: 'date',
    id: '1m',
    label: '1M',
    levels: [1.03, 1.055, 1.075, 1.12, 1.135],
    periodLabel: 'Past month',
    seed: 66,
    start: 274.09,
    step: 686,
    tailHours: 0,
    volatility: 0.005,
  },
  {
    format: 'year',
    id: '1y',
    label: '1Y',
    levels: [1.12, 1.28, 1.22, 1.42, 1.55],
    periodLabel: 'Past year',
    seed: 1988,
    start: 192.14,
    step: 8343,
    tailHours: 0,
    volatility: 0.009,
  },
]

const build = ({
  format,
  id,
  label,
  levels,
  periodLabel,
  seed,
  start,
  step,
  tailHours,
  volatility,
}: FamilySpec): FamilyRange => {
  const values = walk({levels, seed, start, volatility})
  const tail = Math.round((tailHours * 60) / step)
  return {
    baseline: values[0],
    categories: Array.from({length: POINTS + tail}, (_value, index) => String(index)),
    id,
    label,
    periodLabel,
    stamps: stamps(step, format),
    values,
  }
}

const ranges = specs.map(build)

export const familyRanges = ranges
export const familyRange = (id: FamilyRangeId) => ranges.find(range => range.id === id) ?? ranges[0]

export const familyToken = {
  chain: 'Solana',
  currency: '$',
  mark: 'A',
  name: 'Apple xStock',
  symbol: 'AAPLX',
} as const

/**
 * The resting curve the placeholder draws, as levels between -1 and 1: two sines, so it reads as a
 * price and not as a wave. One sample per slot in a range, so the chart can morph the one into the
 * other without changing anything but the values.
 */
export const familyWave = Array.from({length: POINTS}, (_value, index) => {
  const progress = index / (POINTS - 1)
  return round(Math.sin(progress * Math.PI * 2.2) * 0.62 + Math.sin(progress * Math.PI * 4.6) * 0.24)
})

export const formatAmount = (value: number, decimals = 2) => {
  const fixed = Math.abs(value).toFixed(decimals)
  const [whole, fraction] = fixed.split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const sign = value < 0 ? '-' : ''
  return fraction ? `${sign}${grouped}.${fraction}` : `${sign}${grouped}`
}
