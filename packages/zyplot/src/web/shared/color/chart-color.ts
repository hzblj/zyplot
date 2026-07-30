import {color} from 'echarts/core'

const DISPLAY_P3_PATTERN = /^color\(\s*display-p3\s+([^)]+?)\s*\)$/i

const LINEAR_P3_TO_XYZ = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0.0, 0.04511338185890264, 1.043944368900976],
]

const XYZ_TO_LINEAR_SRGB = [
  [3.2409699419045226, -1.537383177570094, -0.4986107602930034],
  [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559],
  [0.05563007969699366, -0.20397695888897652, 1.0569715142428786],
]

const decodeGamma = (channel: number): number => {
  if (channel <= 0.04045) {
    return channel / 12.92
  }

  return ((channel + 0.055) / 1.055) ** 2.4
}

const encodeGamma = (channel: number): number => {
  if (channel <= 0.0031308) {
    return channel * 12.92
  }

  return 1.055 * channel ** (1 / 2.4) - 0.055
}

const applyMatrix = (matrix: number[][], vector: number[]): number[] =>
  matrix.map(row => row.reduce((sum, coefficient, index) => sum + coefficient * (vector[index] ?? 0), 0))

const parseComponent = (raw: string): number => {
  if (raw.endsWith('%')) {
    return Number.parseFloat(raw) / 100
  }

  return Number.parseFloat(raw)
}

const toByte = (channel: number): number => Math.round(Math.min(1, Math.max(0, channel)) * 255)
const toHexPair = (byte: number): string => byte.toString(16).padStart(2, '0')

export const toCanvasColor = (value: string): string => {
  const match = DISPLAY_P3_PATTERN.exec(value)
  if (!match?.[1]) {
    return value
  }

  const [channels, alphaPart] = match[1].split('/')
  const components = (channels ?? '').trim().split(/\s+/).map(parseComponent)
  if (components.length < 3 || components.some(Number.isNaN)) {
    return value
  }

  const linearP3 = components.slice(0, 3).map(decodeGamma)
  const linearSrgb = applyMatrix(XYZ_TO_LINEAR_SRGB, applyMatrix(LINEAR_P3_TO_XYZ, linearP3))
  const [red, green, blue] = linearSrgb.map(channel => toByte(encodeGamma(channel)))

  if (alphaPart === undefined) {
    return `#${toHexPair(red ?? 0)}${toHexPair(green ?? 0)}${toHexPair(blue ?? 0)}`
  }

  const alpha = parseComponent(alphaPart.trim())
  if (Number.isNaN(alpha)) {
    return value
  }

  return `rgba(${red ?? 0}, ${green ?? 0}, ${blue ?? 0}, ${Math.min(1, Math.max(0, alpha))})`
}

const clamp = (value: number): number => Math.min(1, Math.max(0, value))
export const blendChartColor = (value: string, towards: string, amount: number): string =>
  color.lerp(clamp(amount), [toCanvasColor(value), toCanvasColor(towards)]) ?? toCanvasColor(value)

export const fadeChartColor = (value: string, opacity: number): string =>
  color.modifyAlpha(toCanvasColor(value), clamp(opacity)) ?? toCanvasColor(value)
