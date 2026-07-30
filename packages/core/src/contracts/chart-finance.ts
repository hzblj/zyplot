/** One candle: open, high, low, close, and an optional traded volume. */
export type ChartCandlestickDatum = {
  category: string
  close: number
  high: number
  id: string
  low: number
  open: number
  /** Unix seconds. */
  timestamp?: number
  volume?: number
}

/**
 * Your words for a candle's five readings, already translated. Pass them and the
 * tooltip lists every reading instead of just the close.
 */
export type ChartCandlestickLabels = {
  change: string
  close: string
  high: string
  low: string
  open: string
}

/** Colours and sizing for a candlestick chart. */
export type ChartCandlestickStyle = {
  /** Corner radius on the candle body. Rounds the wick's caps with it. */
  candleRadius?: number
  /** Body width as a share of the slot a candle sits in, so 0.3 leaves most of it as air. */
  candleWidth?: number
  downColor?: string
  /** Draws rising candles as outlines instead of filled bodies. */
  hollowUp?: boolean
  neutralColor?: string
  upColor?: string
  volumeDownColor?: string
  /** Share of the plot height the volume histogram takes. */
  volumeHeightRatio?: number
  volumeUpColor?: string
  wickWidth?: number
}
