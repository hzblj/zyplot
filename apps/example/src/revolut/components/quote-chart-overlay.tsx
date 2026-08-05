import {formatNumber, type QuoteCandle} from '@zyplot/feature-charts/revolut'
import {type ReactNode, useEffect, useRef, useState} from 'react'
import {Animated, Easing, type StyleProp, StyleSheet, Text, View, type ViewStyle} from 'react-native'
import {type QuoteColors, useQuoteTheme} from '../data/quote-theme'
import {useQuoteReading} from '../hooks/quote-reading-context'

const BADGE = 18
const BADGE_LIFT = 6
const CARD_WIDTH = 150
const FADE_IN = 140
const FADE_OUT = 200

type CardRow = {id: string; label: string; tint?: string; value: string}

type CardModel = {rows: CardRow[]; title?: string}

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
 * The pill on the event rule. Named in the chart's config as the view for the `event` annotation, so
 * the chart caps the rule with it the way its own badge would — the lift is the only offset left to us.
 */
export const QuoteEventBadge = () => {
  const {color} = useQuoteTheme()
  const event = useQuoteReading()?.event

  if (!event) {
    return null
  }

  return (
    <QuoteFadeView
      style={[
        styles.badge,
        {backgroundColor: color.pill, borderColor: color.pillPressed, transform: [{translateY: -BADGE_LIFT}]},
      ]}
      visible
    >
      <Text style={[styles.badgeText, {color: color.label}]}>{event.badge}</Text>
    </QuoteFadeView>
  )
}

/**
 * What the finger is reading. Named in the chart's config as its `tooltip.view`, so where it sits is
 * the chart's answer and moves with the touch rather than with a render — and what it says is read
 * from the screen's own context, so a reading never touches the chart's props.
 *
 * The last rows it showed are kept while it fades out: the reading is already gone by then, and a
 * card that emptied itself on the way out would blink before it went.
 */
export const QuoteReadingCard = () => {
  const {color} = useQuoteTheme()
  const reading = useQuoteReading()
  const [card, setCard] = useState<CardModel | null>(null)
  const {candles, event} = reading ?? {}
  const readout = reading?.readout
  const isOnEvent = readout?.isScrubbing && readout.category === event?.category
  const candle =
    readout?.isScrubbing && !isOnEvent ? candles?.find(item => item.category === readout.category) : undefined
  const isVisible = Boolean(candle) || Boolean(isOnEvent && event)

  useEffect(() => {
    if (!isVisible) {
      return
    }
    const scrubbed = candles?.find(item => item.category === readout?.category)
    setCard({
      rows:
        candle && scrubbed ? candleRows(scrubbed, color) : (event?.rows.map(row => ({...row, id: row.label})) ?? []),
      title: candle ? undefined : event?.title,
    })
  }, [candle, candles, color, event, isVisible, readout?.category])

  if (!card) {
    return null
  }

  return (
    <QuoteFadeView style={[styles.card, {backgroundColor: color.card}]} visible={isVisible}>
      {card.title ? <Text style={[styles.cardTitle, {color: color.text}]}>{card.title}</Text> : null}
      {card.rows.map(row => (
        <View key={row.id} style={styles.cardRow}>
          <Text style={[styles.cardLabel, {color: color.textMuted}]}>{row.label}</Text>
          <Text style={[styles.cardValue, {color: row.tint ?? color.text}]}>{row.value}</Text>
        </View>
      ))}
    </QuoteFadeView>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: BADGE / 2,
    borderWidth: 1,
    height: BADGE,
    justifyContent: 'center',
    width: BADGE,
  },
  badgeText: {fontSize: 10, fontWeight: '600'},
  card: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: CARD_WIDTH,
  },
  cardLabel: {fontSize: 12},
  cardRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 3},
  cardTitle: {fontSize: 13, fontWeight: '600'},
  cardValue: {fontSize: 12, fontVariant: ['tabular-nums']},
})
