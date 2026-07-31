import {formatSteps, HOUR_WEIGHTS, stepsHistory} from './steps-data'

/**
 * The day so far against a usual day, both counted from midnight. Cumulative, because the
 * question the card answers is whether you are behind, and a bar per hour cannot be read
 * that way — you would have to add them up by eye.
 */
export type StepsCumulative = {
  /** Cumulative steps by hour on an average day. */
  average: number[]
  averageTotal: number
  categories: string[]
  headline: string
  /** Cumulative steps by hour today. */
  today: number[]
  todayTotal: number
  /** The two hours the axis names. */
  ticks: string[]
}

/** One period against the one before it, as a pair of bars sharing a scale. */
export type StepsComparison = {
  headline: string
  id: string
  /** Both bars are drawn against this, so their lengths can be compared. */
  max: number
  previous: {label: string; steps: number}
  current: {label: string; steps: number}
}

const hourLabel = (hour: number) => `${hour}:00`

/** A usual day's shape: a smooth rise through the waking hours rather than one long walk. */
const AVERAGE_HOUR_WEIGHTS = [0, 0, 0, 0, 0, 1, 3, 6, 7, 6, 7, 8, 9, 8, 7, 8, 9, 9, 8, 6, 4, 2, 1, 0]

const runningTotal = (hours: readonly number[]): number[] => {
  let carried = 0
  return hours.map(steps => {
    carried += steps
    return carried
  })
}

const spread = (total: number, weights: readonly number[]): number[] => {
  const weight = weights.reduce((sum, value) => sum + value, 0)
  return weights.map(value => Math.round((total * value) / weight))
}

const dailyAverage = (steps: number, days: number) => (days === 0 ? 0 : Math.round(steps / days))

export const stepsCumulative = (): StepsCumulative => {
  const history = stepsHistory()
  const today = history[history.length - 1]
  const recent = history.slice(-30)
  const usual = dailyAverage(
    recent.reduce((sum, day) => sum + day.steps, 0),
    recent.length
  )
  const todayHours = runningTotal(spread(today.steps, HOUR_WEIGHTS))
  const averageHours = runningTotal(spread(usual, AVERAGE_HOUR_WEIGHTS))

  const todayTotal = todayHours[todayHours.length - 1]
  const averageTotal = averageHours[averageHours.length - 1]
  const drift = Math.abs(todayTotal - averageTotal) / Math.max(averageTotal, 1)

  return {
    average: averageHours,
    averageTotal,
    categories: AVERAGE_HOUR_WEIGHTS.map((_, hour) => hourLabel(hour)),
    headline:
      drift < 0.08
        ? 'You have walked about as much as usual.'
        : `You have walked ${todayTotal < averageTotal ? 'fewer' : 'more'} steps than usual.`,
    ticks: [hourLabel(0), hourLabel(23)],
    today: todayHours,
    todayTotal,
  }
}

/** Groups the history by calendar year and by calendar month, as daily averages. */
const averagesBy = (key: (date: Date) => string): {label: string; steps: number}[] => {
  const groups = new Map<string, {days: number; steps: number}>()
  for (const day of stepsHistory()) {
    const label = key(day.date)
    const held = groups.get(label) ?? {days: 0, steps: 0}
    groups.set(label, {days: held.days + 1, steps: held.steps + day.steps})
  }
  return [...groups.entries()].map(([label, held]) => ({label, steps: dailyAverage(held.steps, held.days)}))
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const stepsComparisons = (): StepsComparison[] => {
  const years = averagesBy(date => String(date.getUTCFullYear())).slice(-2)
  const months = averagesBy(date => `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`).slice(-2)
  const [lastYear, thisYear] = years
  const [lastMonth, thisMonth] = months
  const monthDrift = Math.abs(thisMonth.steps - lastMonth.steps) / Math.max(lastMonth.steps, 1)

  return [
    {
      current: thisYear,
      headline: `Your step count is ${thisYear.steps < lastYear.steps ? 'lower' : 'higher'} this year than last year, on average.`,
      id: 'year',
      max: Math.max(thisYear.steps, lastYear.steps),
      previous: lastYear,
    },
    {
      current: {label: thisMonth.label.split(' ')[0], steps: thisMonth.steps},
      headline: `This month you are averaging ${formatSteps(thisMonth.steps)} steps a day. That is ${
        monthDrift < 0.05 ? 'about the same as' : thisMonth.steps < lastMonth.steps ? 'less than' : 'more than'
      } last month.`,
      id: 'month',
      max: Math.max(thisMonth.steps, lastMonth.steps),
      previous: {label: lastMonth.label.split(' ')[0], steps: lastMonth.steps},
    },
  ]
}
