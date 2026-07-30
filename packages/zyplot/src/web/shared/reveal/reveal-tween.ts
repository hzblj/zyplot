import type {ChartRevealEasing} from '../types'

type EasingFunction = (progress: number) => number

const EASINGS: Record<ChartRevealEasing, EasingFunction> = {
  'ease-in': progress => progress * progress,
  'ease-in-out': progress => (progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2),
  'ease-out': progress => 1 - (1 - progress) ** 2,
  linear: progress => progress,
}

export const chartEase = (easing: ChartRevealEasing = 'ease-out'): EasingFunction => EASINGS[easing] ?? EASINGS.linear

export const runChartTween = (
  duration: number,
  easing: ChartRevealEasing | undefined,
  onFrame: (progress: number) => void
): (() => void) => {
  if (duration <= 0) {
    onFrame(1)
    return () => undefined
  }

  const ease = chartEase(easing)
  const started = performance.now()
  let frame: number | null = null

  const step = (now: number) => {
    const elapsed = Math.min(1, Math.max(0, (now - started) / duration))
    onFrame(ease(elapsed))
    frame = elapsed < 1 ? window.requestAnimationFrame(step) : null
  }

  frame = window.requestAnimationFrame(step)

  return () => {
    if (frame !== null) {
      window.cancelAnimationFrame(frame)
      frame = null
    }
  }
}
