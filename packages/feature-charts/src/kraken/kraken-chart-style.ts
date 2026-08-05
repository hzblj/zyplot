import {isAndroid} from '../platform'
import type {KrakenReading} from './kraken-data'
import type {KrakenScheme} from './kraken-theme'

/** The trace runs off the trailing edge, so the plot keeps room there and none at the start. */
export const plotInsets = {plotDimensionEndPadding: 24, plotDimensionStartPadding: 0} as const

export type PriceDomain = {max: number; min: number}

const DOMAIN_INSET = 0.12

export const priceDomain = (reading: KrakenReading): PriceDomain => {
  const room = (reading.high - reading.low || 1) * DOMAIN_INSET
  return {max: reading.high + room, min: reading.low - room}
}

/** Compose draws a hairline lighter than SwiftUI does, so its rules are given a touch more. */
export const rule = isAndroid ? {dash: [7, 5], width: 1.4} : {dash: [6, 4], width: 1.2}

export const GRID_SPACING = 3.4

/** A dot grid wants more opacity than a wash — most of what it covers stays bare. */
export const grid: Record<KrakenScheme, {dotSize: number; opacity: number}> = {
  dark: {dotSize: 1.1, opacity: 0.5},
  light: {dotSize: 1, opacity: 0.32},
}
