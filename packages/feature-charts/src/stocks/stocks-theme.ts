export type StocksScheme = 'dark' | 'light'

export type StocksColors = {
  background: string
  chartGrid: string
  divider: string
  down: string
  pill: string
  pillActive: string
  scrub: string
  sheet: string
  text: string
  textMuted: string
  up: string
  volume: string
}

const light: StocksColors = {
  background: '#f2f2f7',
  chartGrid: '#e5e5ea',
  divider: '#d8d8dd',
  down: '#ff3b30',
  pill: '#00000000',
  pillActive: '#e3e3e8',
  scrub: '#007aff',
  sheet: '#ffffff',
  text: '#000000',
  textMuted: '#8e8e93',
  up: '#34c759',
  volume: '#aeaeb2',
}

const dark: StocksColors = {
  background: '#000000',
  chartGrid: '#2a2a2c',
  divider: '#3a3a3c',
  down: '#ff453a',
  pill: '#00000000',
  pillActive: '#2c2c2e',
  scrub: '#5ac8fa',
  sheet: '#1c1c1e',
  text: '#ffffff',
  textMuted: '#8e8e93',
  up: '#30d158',
  volume: '#636366',
}

export const stocksLayout = {
  chartHeight: 193,
  circleButton: 40,
  gutter: 16,
  sheetRadius: 14,
  slotHeight: 44,
  sparkline: {height: 30, width: 74},
  stat: {column: 112, gap: 11, row: 23, rule: {height: 61, width: 1}},
  ticker: {height: 62, speed: 20},
  volumeHeight: 24,
} as const

export const stocksColors: Record<StocksScheme, StocksColors> = {dark, light}

export type StocksTheme = {
  color: StocksColors
  scheme: StocksScheme
}

export const stocksThemes: Record<StocksScheme, StocksTheme> = {
  dark: {color: dark, scheme: 'dark'},
  light: {color: light, scheme: 'light'},
}

/**
 * Blends a colour towards the surface it sits on. The chart dims the stretch outside a
 * two-finger span this way rather than with opacity, so the result is the same colour on
 * every renderer instead of whatever each one composites.
 */
export const fade = (color: string, towards: string, amount: number) => {
  const parse = (hex: string) => {
    const value = hex.replace('#', '')
    const full =
      value.length === 3
        ? value
            .split('')
            .map(character => character + character)
            .join('')
        : value.slice(0, 6)
    return [0, 2, 4].map(offset => Number.parseInt(full.slice(offset, offset + 2), 16))
  }
  const from = parse(color)
  const to = parse(towards)
  const mixed = from.map((channel, index) =>
    Math.round(channel + ((to[index] as number) - channel) * Math.min(Math.max(amount, 0), 1))
  )
  return `#${mixed.map(channel => channel.toString(16).padStart(2, '0')).join('')}`
}
