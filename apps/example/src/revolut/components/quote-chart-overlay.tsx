import {type ReactNode, useEffect, useRef, useState} from 'react'
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native'
import {formatNumber, type QuoteCandle, type QuoteEvent} from '../data/quote-data'
import {type QuoteColors, useQuoteTheme} from '../data/quote-theme'
import type {QuoteReadout} from '../hooks/use-quote-readout'

const BADGE = 18
const CARD_WIDTH = 150
const CARD_GAP = 12
/** Lifts the badge off the plot's top edge, where the rule it caps starts. */
const BADGE_LIFT = 6
const FADE_IN = 140
const FADE_OUT = 200

export type QuoteChartOverlayProps = {
  candles?: QuoteCandle[]
  event?: QuoteEvent
  readout: QuoteReadout
}

type CardRow = {id: string; label: string; tint?: string; value: string}

type CardModel = {left: number; rows: CardRow[]; title?: string; top: number}

const candleRows = (candle: QuoteCandle, color: QuoteColors): CardRow[] => {
  const change = candle.open === 0 ? 0 : ((candle.close - candle.open) / candle.open) * 100
  return [
    {id: 'open', label: 'Open', value: `${formatNumber(candle.open)} $`},
    {id: 'close', label: 'Close', value: `${formatNumber(candle.close)} $`},
    {id: 'high', label: 'High', value: `${formatNumber(candle.high)} $`},
    {id: 'low', label: 'Low', value: `${formatNumber(candle.low)} $`},
    {
      id: 'change',
      label: 'Change',
      tint: change < 0 ? color.down : color.up,
      value: `${change < 0 ? '' : '+'}${formatNumber(change)} %`,
    },
  ]
}

const QuoteFadeView = ({
  children,
  style,
  visible,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  visible: boolean
}) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      duration: visible ? FADE_IN : FADE_OUT,
      easing: Easing.out(Easing.quad),
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start()
  }, [opacity, visible])

  return (
    <Animated.View pointerEvents="none" style={[style, {opacity}]}>
      {children}
    </Animated.View>
  )
}

/**
 * Everything the chart could have drawn itself but shouldn't: the event badge, its card and
 * the candle reading. The chart only reports where the annotation landed and which datum is
 * under the finger (`readout.geometry`, `readout.category`), so what appears there — a
 * letter, a logo, a whole panel — is this file's business.
 */
export const QuoteChartOverlay = ({candles, event, readout}: QuoteChartOverlayProps) => {
  const {color} = useQuoteTheme()
  const [cardHeight, setCardHeight] = useState(0)
  // The card outlives its reading by one fade, so the last one drawn is held here rather
  // than blinking out the moment the finger lifts.
  const [card, setCard] = useState<CardModel | null>(null)
  const geometry = readout.geometry
  const plot = geometry?.plot
  const spot = event && geometry ? geometry.annotations.find(annotation => annotation.id === 'event') : undefined
  const isOnEvent = readout.isScrubbing && readout.category === event?.category
  const candle =
    readout.isScrubbing && !isOnEvent ? candles?.find(item => item.category === readout.category) : undefined
  const isCardVisible = Boolean(candle) || Boolean(isOnEvent && event && spot)
  const anchor = readout.nativeX ?? spot?.x
  const category = readout.category

  useEffect(() => {
    if (!plot || !isCardVisible) {
      return
    }
    const room = plot.x + plot.width - CARD_WIDTH
    const trailing = (anchor ?? plot.x) + CARD_GAP
    // Whichever side of the finger still fits, flipping only when the near side would
    // overflow rather than at the halfway mark, so it does not jump about mid-plot.
    const left = trailing <= room ? trailing : (anchor ?? plot.x) - CARD_GAP - CARD_WIDTH
    const scrubbed = candles?.find(item => item.category === category)
    setCard({
      left: Math.max(plot.x, Math.min(left, room)),
      rows:
        candle && scrubbed ? candleRows(scrubbed, color) : (event?.rows.map(row => ({...row, id: row.label})) ?? []),
      title: candle ? undefined : event?.title,
      top: plot.y + Math.max(0, (plot.height - cardHeight) / 2),
    })
  }, [anchor, candle, candles, cardHeight, category, color, event, isCardVisible, plot])

  if (!geometry || !plot) {
    return null
  }

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {event && spot ? (
        <QuoteFadeView
          style={[
            styles.badge,
            {
              backgroundColor: color.pill,
              borderColor: color.pillPressed,
              left: spot.x - BADGE / 2,
              top: spot.y - BADGE / 2 - BADGE_LIFT,
            },
          ]}
          visible
        >
          <Text style={[styles.badgeText, {color: color.label}]}>{event.badge}</Text>
        </QuoteFadeView>
      ) : null}

      {card ? (
        <QuoteFadeView
          style={[styles.card, {backgroundColor: color.card, left: card.left, top: card.top}]}
          visible={isCardVisible}
        >
          <View onLayout={(layout: LayoutChangeEvent) => setCardHeight(layout.nativeEvent.layout.height)}>
            {card.title ? <Text style={[styles.cardTitle, {color: color.text}]}>{card.title}</Text> : null}
            {card.rows.map(row => (
              <View key={row.id} style={styles.cardRow}>
                <Text style={[styles.cardLabel, {color: color.textMuted}]}>{row.label}</Text>
                <Text style={[styles.cardValue, {color: row.tint ?? color.text}]}>{row.value}</Text>
              </View>
            ))}
          </View>
        </QuoteFadeView>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: BADGE / 2,
    borderWidth: 1,
    height: BADGE,
    justifyContent: 'center',
    position: 'absolute',
    width: BADGE,
  },
  badgeText: {fontSize: 10, fontWeight: '600'},
  card: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
    width: CARD_WIDTH,
  },
  cardLabel: {fontSize: 12},
  cardRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 3},
  cardTitle: {fontSize: 13, fontWeight: '600'},
  cardValue: {fontSize: 12, fontVariant: ['tabular-nums']},
  overlay: {bottom: 0, left: 0, position: 'absolute', right: 0, top: 0},
})
