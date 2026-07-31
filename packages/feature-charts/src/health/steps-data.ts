export type StepsRangeId = '6M' | 'D' | 'M' | 'W' | 'Y'

/** How a headline puts several buckets together: hours add up, days are averaged over. */
export type StepsReading = 'average' | 'total'

/**
 * One bar. `days` is how much of the calendar it covers, so a span can average by day rather
 * than by bar — six months of weeks and a year of months do not hold the same amount of time.
 */
export type StepsBucket = {
  days: number
  /** Where a span starts when this bucket is its first, without the year: `9 Jul`. */
  from: string
  /** What this bar is called on its own: `9 Jul 2026`. */
  label: string
  steps: number
  /** Where a span ends when this bucket is its last: `23 Jul 2026`. */
  to: string
}

export type StepsRange = {
  buckets: StepsBucket[]
  /** Unique per bar, because a category is a mark's identity and a rolling month sees two 30ths. */
  categories: string[]
  id: StepsRangeId
  /** The whole range, for the headline with nothing held: `24–30 Jul 2026`. */
  periodLabel: string
  /** What the headline is called while a bar or a span is held. */
  readCaption: string
  /** How a held bar or span is put together. Also what one bar's height is. */
  readReading: StepsReading
  /** What the headline is called with nothing held. */
  restCaption: string
  /** How the whole range is put together for the resting headline. */
  restReading: StepsReading
  /** Which categories the axis writes. The rest are drawn as bars with no label. */
  ticks: string[]
  values: number[]
}

export type StepsReadout = {
  caption: string
  period: string
  steps: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const DAY_MS = 86_400_000
/** The day the data was taken, so every range agrees and a screenshot is the same twice. */
const TODAY = Date.UTC(2026, 6, 30)
const HISTORY_DAYS = 420

const seeded = (seed: number) => {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high)

const dayAt = (offset: number) => new Date(TODAY + offset * DAY_MS)

const dayLabel = (date: Date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
const dayFrom = (date: Date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
const monthLabel = (date: Date) => `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
const hourLabel = (hour: number) => `${String(hour).padStart(2, '0')}:00`

/** Drops a month named twice: `24 Jul` to `30 Jul 2026` reads as `24–30 Jul 2026`. */
const spanLabel = (start: StepsBucket, end: StepsBucket) => {
  const [startHead, startMonth] = start.from.split(' ')
  return end.to.split(' ')[1] === startMonth ? `${startHead}–${end.to}` : `${start.from}–${end.to}`
}

export type StepsDay = {
  date: Date
  steps: number
}

/**
 * A year and a bit of daily counts, built once so the month view and the year view are reading
 * the same walking. Weekends run longer than weekdays, winter runs shorter than summer, and
 * roughly one day in sixteen is a hike.
 */
const history: StepsDay[] = (() => {
  const random = seeded(20260730)
  const days: StepsDay[] = []
  for (let index = HISTORY_DAYS - 1; index >= 0; index -= 1) {
    const date = dayAt(-index)
    const weekday = date.getUTCDay()
    const rhythm = weekday === 0 ? 0.74 : weekday === 6 ? 1.16 : 1
    const season = 0.82 + 0.3 * Math.sin(((HISTORY_DAYS - index + 40) / 365) * Math.PI * 2)
    const noise = 0.45 + random() * 1.2
    const walk = random() > 0.94 ? 5800 + random() * 8600 : 0
    days.push({date, steps: clamp(Math.round(3900 * rhythm * season * noise + walk), 160, 21_400)})
  }
  return days
})()

const dayCount = history.length
const today = history[dayCount - 1]

/** The same daily counts every range is built from, for the cards that read across them. */
export const stepsHistory = (): readonly StepsDay[] => history

/** A light day with one long walk in it, which is the shape of the day worth scrubbing. */
export const HOUR_WEIGHTS = [0, 0, 0, 0, 0, 0, 2, 6, 4, 3, 5, 4, 6, 5, 3, 4, 6, 9, 34, 7, 4, 2, 0, 0]

const hourlySteps = (total: number): number[] => {
  const weight = HOUR_WEIGHTS.reduce((sum, value) => sum + value, 0)
  const hours = HOUR_WEIGHTS.map(value => Math.round((total * value) / weight))
  const drift = total - hours.reduce((sum, value) => sum + value, 0)
  const peak = HOUR_WEIGHTS.indexOf(Math.max(...HOUR_WEIGHTS))
  hours[peak] += drift
  return hours
}

const dayBucket = (day: StepsDay): StepsBucket => ({
  days: 1,
  from: dayFrom(day.date),
  label: dayLabel(day.date),
  steps: day.steps,
  to: dayLabel(day.date),
})

const daysRange = (id: StepsRangeId, days: StepsDay[], categories: string[], ticks: string[]): StepsRange => {
  const buckets = days.map(dayBucket)
  return {
    buckets,
    categories,
    id,
    periodLabel: spanLabel(buckets[0], buckets[buckets.length - 1]),
    readCaption: 'TOTAL',
    readReading: 'total',
    restCaption: 'AVERAGE',
    restReading: 'average',
    ticks,
    values: buckets.map(bucket => bucket.steps),
  }
}

const weekdayRange = (): StepsRange => {
  const days = history.slice(dayCount - 7)
  const categories = days.map(day => WEEKDAYS[day.date.getUTCDay()])
  return daysRange('W', days, categories, categories)
}

/**
 * The calendar month so far, labelled by day. A rolling thirty-one days is what Health shows,
 * but two of them are the same date a month apart and a category is a mark's identity — the
 * month keeps the axis reading `6 13 20 27` without a bar having to answer to two names.
 */
const monthRange = (): StepsRange => {
  const last = history[dayCount - 1].date
  const days = history.filter(
    day => day.date.getUTCMonth() === last.getUTCMonth() && day.date.getUTCFullYear() === last.getUTCFullYear()
  )
  const categories = days.map(day => String(day.date.getUTCDate()))
  return daysRange('M', days, categories, ['6', '13', '20', '27'])
}

const todayRange = (): StepsRange => {
  const hours = hourlySteps(today.steps)
  const buckets: StepsBucket[] = hours.map((steps, hour) => ({
    days: 1,
    from: hourLabel(hour),
    label: hourLabel(hour),
    steps,
    to: hourLabel(hour),
  }))
  return {
    buckets,
    categories: hours.map((_, hour) => String(hour)),
    id: 'D',
    periodLabel: 'Today',
    readCaption: 'TOTAL',
    readReading: 'total',
    restCaption: 'TOTAL',
    restReading: 'total',
    ticks: ['0', '6', '12', '18'],
    values: hours,
  }
}

const weekRange = (): StepsRange => {
  const weeks = 26
  const days = history.slice(dayCount - weeks * 7)
  const buckets: StepsBucket[] = []
  const categories: string[] = []
  for (let index = 0; index < weeks; index += 1) {
    const week = days.slice(index * 7, index * 7 + 7)
    const first = week[0].date
    const last = week[week.length - 1].date
    buckets.push({
      days: week.length,
      from: dayFrom(first),
      label: `${dayFrom(first)}–${dayLabel(last)}`,
      steps: week.reduce((sum, day) => sum + day.steps, 0),
      to: dayLabel(last),
    })
    // The week that opens a month is named for the month, because that is what the axis writes;
    // an axis label has to be a category's own name, and the rest keep their start date.
    categories.push(first.getUTCDate() <= 7 ? MONTHS[first.getUTCMonth()] : dayFrom(first))
  }
  return {
    buckets,
    categories,
    id: '6M',
    periodLabel: spanLabel(buckets[0], buckets[buckets.length - 1]),
    readCaption: 'DAILY AVERAGE',
    readReading: 'average',
    restCaption: 'DAILY AVERAGE',
    restReading: 'average',
    ticks: categories.filter(category => MONTHS.includes(category)),
    values: buckets.map(bucket => Math.round(bucket.steps / bucket.days)),
  }
}

const yearRange = (): StepsRange => {
  const months = new Map<string, StepsDay[]>()
  for (const day of history.slice(dayCount - 365)) {
    const key = `${day.date.getUTCFullYear()}-${day.date.getUTCMonth()}`
    months.set(key, [...(months.get(key) ?? []), day])
  }
  const grouped = [...months.values()].slice(-12)
  const buckets: StepsBucket[] = grouped.map(month => {
    const first = month[0].date
    const last = month[month.length - 1].date
    return {
      days: month.length,
      from: `${MONTHS[first.getUTCMonth()]} ${first.getUTCFullYear()}`,
      label: monthLabel(first),
      steps: month.reduce((sum, day) => sum + day.steps, 0),
      to: monthLabel(last),
    }
  })
  // Month numbers, which is how a year of them fits: twelve names would not.
  const categories = grouped.map(month => String(month[0].date.getUTCMonth() + 1))
  return {
    buckets,
    categories,
    id: 'Y',
    periodLabel: spanLabel(buckets[0], buckets[buckets.length - 1]),
    readCaption: 'DAILY AVERAGE',
    readReading: 'average',
    restCaption: 'DAILY AVERAGE',
    restReading: 'average',
    // All twelve: a month number is one or two digits, so they fit where names would not.
    ticks: categories,
    values: buckets.map(bucket => Math.round(bucket.steps / bucket.days)),
  }
}

const ranges: Record<StepsRangeId, StepsRange> = {
  '6M': weekRange(),
  D: todayRange(),
  M: monthRange(),
  W: weekdayRange(),
  Y: yearRange(),
}

export const stepsRangeIds: StepsRangeId[] = ['D', 'W', 'M', '6M', 'Y']

export const stepsRange = (id: StepsRangeId): StepsRange => ranges[id]

const aggregate = (buckets: StepsBucket[], reading: StepsReading): number => {
  const steps = buckets.reduce((sum, bucket) => sum + bucket.steps, 0)
  if (reading === 'total') {
    return steps
  }
  const days = buckets.reduce((sum, bucket) => sum + bucket.days, 0)
  return days === 0 ? 0 : Math.round(steps / days)
}

/**
 * What the headline shows: the whole range with nothing held, one bar while a finger is on it,
 * the span while two are. A span is put together the way one bar is, so a month of daily totals
 * adds up and a year of daily averages stays an average.
 */
export const stepsReadout = (range: StepsRange, span?: {endIndex: number; startIndex: number} | null): StepsReadout => {
  if (!span) {
    return {
      caption: range.restCaption,
      period: range.periodLabel,
      steps: aggregate(range.buckets, range.restReading),
    }
  }
  const held = range.buckets.slice(span.startIndex, span.endIndex + 1)
  if (held.length === 0) {
    return {caption: range.readCaption, period: range.periodLabel, steps: 0}
  }
  return {
    caption: range.readCaption,
    period: held.length === 1 ? held[0].label : spanLabel(held[0], held[held.length - 1]),
    steps: aggregate(held, range.readReading),
  }
}

export const formatSteps = (steps: number): string => steps.toLocaleString('en-US')
