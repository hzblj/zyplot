import {StyleSheet, type TextStyle} from 'react-native'

export type ColorScheme = 'dark' | 'light'

const ramp = {
  blue: {
    6: '#006fac',
    8: '#0080c5',
    9: '#0092de',
    11: '#00b3ff',
    15: '#59c4fd',
  },
  gray: {
    0: '#ffffff',
    1: '#fcfcfc',
    2: '#fafafa',
    3: '#f5f5f5',
    4: '#ebebeb',
    5: '#d9d9d9',
    6: '#cccccc',
    7: '#bfbfbf',
    9: '#a6a6a6',
    11: '#8c8c8c',
    12: '#808080',
    14: '#666666',
    15: '#595959',
    17: '#404040',
    18: '#333333',
    20: '#212121',
    21: '#171717',
    22: '#0a0a0a',
    23: '#000000',
  },
  green: {8: '#00a546'},
  orange: {
    7: '#d23100',
    9: '#f33b00',
    10: '#ff4500',
    11: '#ff5700',
    12: '#ff641b',
    14: '#ff7d4f',
  },
  purple: {
    6: '#2f00ae',
    9: '#3c00e1',
    10: '#4400fc',
    12: '#7135ff',
    13: '#814eff',
    15: '#9c74ff',
    16: '#a580ff',
    17: '#b89bff',
    18: '#d1beff',
  },
  red: {12: '#ff133c', 13: '#ff354e'},
} as const

type ChartColorTokens = {
  axis: string
  categorical: string[]
  diverging: {
    negative: string
    negativeSoft: string
    neutral: string
    positive: string
    positiveSoft: string
  }
  grid: string
  label: string
  muted: string
  negative: string
  positive: string
  sequential: string[]
  surface: string
  track: string
}

export type ColorTokens = {
  background: {inverse: string; primary: string; secondary: string}
  border: {
    focus: string
    primary: string
    secondary: string
    tertiary: string
  }
  chart: ChartColorTokens
  content: {
    accent: string
    destructive: string
    onAccent: string
    onInverse: string
    primary: string
    quaternary: string
    secondary: string
    success: string
    tertiary: string
  }
  fill: {
    accent: string
    accentPressed: string
    disabled: string
    primary: string
    secondary: string
    secondaryPressed: string
    tertiary: string
  }
  surface: {
    base: string
    elevated: string
    primary: string
    secondary: string
    tertiary: string
  }
}

const light: ColorTokens = {
  background: {
    inverse: ramp.gray[22],
    primary: ramp.gray[2],
    secondary: ramp.gray[4],
  },
  border: {
    focus: ramp.purple[10],
    primary: ramp.gray[6],
    secondary: ramp.gray[4],
    tertiary: ramp.gray[3],
  },
  chart: {
    axis: ramp.gray[9],
    categorical: [
      ramp.purple[10],
      ramp.blue[9],
      ramp.orange[11],
      ramp.purple[15],
      ramp.green[8],
      ramp.blue[6],
      ramp.red[12],
    ],
    diverging: {
      negative: ramp.orange[7],
      negativeSoft: ramp.orange[14],
      neutral: ramp.gray[5],
      positive: ramp.blue[6],
      positiveSoft: ramp.blue[15],
    },
    grid: ramp.gray[3],
    label: ramp.gray[14],
    muted: ramp.gray[12],
    negative: ramp.red[12],
    positive: ramp.green[8],
    sequential: [ramp.purple[17], ramp.purple[15], ramp.purple[12], ramp.purple[10], ramp.purple[6]],
    surface: ramp.gray[1],
    track: ramp.gray[4],
  },
  content: {
    accent: ramp.purple[10],
    destructive: ramp.red[12],
    onAccent: ramp.gray[0],
    onInverse: ramp.gray[0],
    primary: ramp.gray[23],
    quaternary: ramp.gray[9],
    secondary: ramp.gray[14],
    success: ramp.green[8],
    tertiary: ramp.gray[12],
  },
  fill: {
    accent: ramp.purple[10],
    accentPressed: ramp.purple[6],
    disabled: ramp.gray[4],
    primary: ramp.gray[23],
    secondary: ramp.gray[1],
    secondaryPressed: ramp.gray[4],
    tertiary: ramp.gray[3],
  },
  surface: {
    base: ramp.gray[2],
    elevated: ramp.gray[0],
    primary: ramp.gray[0],
    secondary: ramp.gray[1],
    tertiary: ramp.gray[3],
  },
}

const dark: ColorTokens = {
  background: {
    inverse: ramp.gray[2],
    primary: ramp.gray[22],
    secondary: ramp.gray[20],
  },
  border: {
    focus: ramp.purple[16],
    primary: ramp.gray[17],
    secondary: ramp.gray[18],
    tertiary: ramp.gray[20],
  },
  chart: {
    axis: ramp.gray[15],
    categorical: [
      ramp.purple[12],
      ramp.blue[9],
      ramp.orange[10],
      ramp.purple[15],
      ramp.green[8],
      ramp.blue[6],
      ramp.red[13],
    ],
    diverging: {
      negative: ramp.orange[12],
      negativeSoft: ramp.orange[9],
      neutral: ramp.gray[17],
      positive: ramp.blue[11],
      positiveSoft: ramp.blue[8],
    },
    grid: ramp.gray[20],
    label: ramp.gray[11],
    muted: ramp.gray[14],
    negative: ramp.red[13],
    positive: ramp.green[8],
    sequential: [ramp.purple[18], ramp.purple[17], ramp.purple[15], ramp.purple[13], ramp.purple[12]],
    surface: ramp.gray[21],
    track: ramp.gray[18],
  },
  content: {
    accent: ramp.purple[16],
    destructive: ramp.red[13],
    onAccent: ramp.gray[0],
    onInverse: ramp.gray[23],
    primary: ramp.gray[0],
    quaternary: ramp.gray[15],
    secondary: ramp.gray[11],
    success: ramp.green[8],
    tertiary: ramp.gray[14],
  },
  fill: {
    accent: ramp.purple[10],
    accentPressed: ramp.purple[6],
    disabled: ramp.gray[18],
    primary: ramp.gray[0],
    secondary: ramp.gray[20],
    secondaryPressed: ramp.gray[17],
    tertiary: ramp.gray[18],
  },
  surface: {
    base: ramp.gray[22],
    elevated: ramp.gray[20],
    primary: ramp.gray[21],
    secondary: ramp.gray[21],
    tertiary: ramp.gray[20],
  },
}

export const colors: Record<ColorScheme, ColorTokens> = {dark, light}

export const chartThemes: Record<ColorScheme, {colors: ChartColorTokens}> = {
  dark: {colors: dark.chart},
  light: {colors: light.chart},
}

export const text = {
  body: {fontSize: 16, fontWeight: '400', lineHeight: 24},
  bodyMedium: {fontSize: 16, fontWeight: '500', lineHeight: 24},
  caption: {fontSize: 11, fontWeight: '400', lineHeight: 16},
  captionMedium: {fontSize: 11, fontWeight: '500', lineHeight: 16},
  display: {fontSize: 48, fontWeight: '600', lineHeight: 52},
  footnote: {fontSize: 13, fontWeight: '400', lineHeight: 18},
  footnoteMedium: {fontSize: 13, fontWeight: '500', lineHeight: 18},
  heading: {fontSize: 32, fontWeight: '600', lineHeight: 38},
  title: {fontSize: 20, fontWeight: '600', lineHeight: 28},
} as const satisfies Record<string, TextStyle>

export const weight = {
  bold: '700',
  medium: '500',
  regular: '400',
  semibold: '600',
} as const satisfies Record<string, TextStyle['fontWeight']>

export const tracking = {normal: 0, tight: -0.4, wide: 0.8} as const

export const radius = {
  full: 999,
  lg: 16,
  md: 12,
  none: 0,
  sm: 8,
  xl: 20,
} as const

export const space = {
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
  lg: 16,
  md: 12,
  none: 0,
  sm: 8,
  xl: 20,
  xs: 4,
} as const

export const borderWidth = {
  hairline: StyleSheet.hairlineWidth,
  thin: 1,
} as const

export const iconSize = {lg: 20, md: 16, sm: 13, xl: 28, xs: 11} as const

export const chartHeight = {lg: 320, md: 280, sm: 160} as const

/**
 * How wide a column of content gets before it stops growing, matching the docs site's own
 * reading column. A phone is narrower than this and never sees it; a desktop window is much
 * wider, and a list or a chart stretched across all of it reads as a table, not a screen.
 */
export const contentWidth = 720

/** The screen-edge inset that centres `contentWidth` in a window wider than it. */
export const contentInset = (width: number) => Math.max(0, (width - contentWidth) / 2)

export const alpha = (color: string, opacity: number) => {
  const clamped = Math.min(Math.max(opacity, 0), 1)
  const channel = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0')
  return `${color}${channel}`
}
