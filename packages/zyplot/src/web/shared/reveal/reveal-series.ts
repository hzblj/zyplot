import type {ChartRevealEasing, ChartRevealStyle, NativeChartAnimation} from '../types'

/** The stroke drawn under a trace, so the shape reads from the first frame. */
export const REVEAL_TRACK_ID = 'zyplot-reveal-track'

/** The brightening that lands with the trace and then leaves. */
export const REVEAL_FLASH_ID = 'zyplot-reveal-flash'

const REVEAL_IDS = new Set<string>([REVEAL_TRACK_ID, REVEAL_FLASH_ID])

/** Whether a series is one the reveal added, rather than one of the reader's. */
export const isRevealSeriesId = (id: unknown): boolean => typeof id === 'string' && REVEAL_IDS.has(id)

const DEFAULTS = {
  duration: 520,
  flashDuration: 420,
  flashGlow: 2.6,
  flashHold: 0,
  flashOpacity: 0.9,
  restGlow: 6,
  trackOpacity: 0.35,
}

/** How the stroke's own style moves once the marks have landed. */
export type ChartRevealPlan = {
  delay: number
  duration: number
  easing?: ChartRevealEasing
  flash?: {
    decay: number
    easing?: ChartRevealEasing
    hold: number
    opacity: number
    /** Glow radius at the peak of the flash, and the radius it decays back to. */
    peak: number
    rest: number
  }
  mainId: string
  /** How dim the stroke is held while it is being traced. */
  startOpacity?: number
  style: ChartRevealStyle
}

export type ChartRevealInput = {
  animation?: NativeChartAnimation
  /** Clipped to the plot, the way the stroke it rides with is. */
  clip?: boolean
  /** The series' own colour, for a flash that names none. */
  color: string
  /** The resting radius of the series' glow, which is what `flashGlow` multiplies. */
  glowRadius?: number
  /**
   * True once the entrance has been and gone. The flash is then left out rather than built
   * at full strength again — new data does not re-trace, so nothing would put it out.
   */
  hasPlayed?: boolean
  isSmooth?: boolean
  seriesId: string
  strokeWidth: number
  values: readonly (number | null)[]
}

export type ChartRevealBuild = {
  /** Extra series the reveal draws with, in the order they are painted. */
  extraSeries: Record<string, unknown>[]
  /** What the entrance does to the main series. */
  main: {animationDelay: number; animationDuration: number; animationEasing: string; opacity?: number}
  plan: ChartRevealPlan | null
}

const ECHARTS_EASING: Record<ChartRevealEasing, string> = {
  'ease-in': 'cubicIn',
  'ease-in-out': 'cubicInOut',
  'ease-out': 'cubicOut',
  linear: 'linear',
}

const strokeSeries = (id: string, input: ChartRevealInput, style: Record<string, unknown>, z: number) => ({
  animationDelay: 0,
  animationDuration: 0,
  animationDurationUpdate: 0,
  clip: input.clip ?? true,
  connectNulls: false,
  data: input.values,
  id,
  lineStyle: {width: input.strokeWidth, ...style},
  showSymbol: false,
  silent: true,
  smooth: input.isSmooth ?? false,
  type: 'line' as const,
  z,
})

/**
 * A traced entrance, as the series it takes to draw one.
 *
 * ECharts already reveals a line by clipping it open from the left, which is the trace
 * itself. What it has no option for is what rides along: the pale track underneath, and
 * the brightening that lands with the frontier and then leaves. Both are strokes of their
 * own, animated in step with the real one, and `plan` is how they are put out afterwards.
 */
export const buildChartReveal = (input: ChartRevealInput): ChartRevealBuild => {
  const reveal = input.animation?.reveal
  const style: ChartRevealStyle = reveal?.style ?? 'fade'
  const delay = input.animation?.delay ?? 0
  const duration = reveal?.duration ?? input.animation?.duration ?? DEFAULTS.duration
  const easing = reveal?.easing ?? (style === 'draw' ? 'linear' : 'ease-out')

  if (!reveal || style === 'none') {
    return {
      extraSeries: [],
      main: {
        animationDelay: delay,
        animationDuration: style === 'none' ? 0 : duration,
        animationEasing: ECHARTS_EASING[easing],
      },
      plan: null,
    }
  }

  if (style === 'fade') {
    return {
      extraSeries: [],
      main: {animationDelay: delay, animationDuration: 0, animationEasing: ECHARTS_EASING[easing], opacity: 0},
      plan: {delay, duration, easing, mainId: input.seriesId, style},
    }
  }

  const extraSeries: Record<string, unknown>[] = []
  if (reveal.trackColor) {
    extraSeries.push(
      strokeSeries(
        REVEAL_TRACK_ID,
        input,
        {color: reveal.trackColor, opacity: reveal.trackOpacity ?? DEFAULTS.trackOpacity},
        1
      )
    )
  }

  const rest = input.glowRadius ?? DEFAULTS.restGlow
  const peak = rest * (reveal.flashGlow ?? DEFAULTS.flashGlow)
  const flashOpacity = reveal.flashOpacity ?? DEFAULTS.flashOpacity

  if (reveal.flashColor && !input.hasPlayed) {
    extraSeries.push({
      ...strokeSeries(
        REVEAL_FLASH_ID,
        input,
        {
          color: reveal.flashColor,
          opacity: flashOpacity,
          shadowBlur: peak,
          shadowColor: reveal.flashColor,
        },
        3
      ),
      animationDelay: delay,
      animationDuration: duration,
      animationEasing: ECHARTS_EASING[easing],
    })
  }

  return {
    extraSeries,
    main: {
      animationDelay: delay,
      animationDuration: duration,
      animationEasing: ECHARTS_EASING[easing],
      opacity: input.hasPlayed ? undefined : reveal.startOpacity,
    },
    plan: {
      delay,
      duration,
      easing,
      flash: reveal.flashColor
        ? {
            decay: reveal.flashDuration ?? DEFAULTS.flashDuration,
            easing: reveal.flashEasing,
            hold: reveal.flashHold ?? DEFAULTS.flashHold,
            opacity: flashOpacity,
            peak,
            rest,
          }
        : undefined,
      mainId: input.seriesId,
      startOpacity: reveal.startOpacity,
      style,
    },
  }
}
