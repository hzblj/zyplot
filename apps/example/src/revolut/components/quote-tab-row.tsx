import {useEffect, useRef, useState} from 'react'
import {Animated, type LayoutRectangle, Pressable, StyleSheet, View} from 'react-native'
import {type QuoteTabId, quoteTabs} from '../data/quote-data'
import {useQuoteTheme} from '../data/quote-theme'
import {QuoteText} from './quote-text'

export type QuoteTabRowProps = {
  onSelect: (id: QuoteTabId) => void
  selected: QuoteTabId
}

const SPRING = {damping: 17, mass: 1, stiffness: 210, useNativeDriver: false} as const

/**
 * The pill glides and stretches between the tabs, which is what `matchedGeometryEffect`
 * gives the iOS screen for free. Here the tabs are measured and one pill is moved and
 * resized behind them — a second pill fading in and out would read as a blink, not a move.
 */
export const QuoteTabRow = ({onSelect, selected}: QuoteTabRowProps) => {
  const {color} = useQuoteTheme()
  const [boxes, setBoxes] = useState<Partial<Record<QuoteTabId, LayoutRectangle>>>({})
  const left = useRef(new Animated.Value(0)).current
  const width = useRef(new Animated.Value(0)).current
  const box = boxes[selected]
  const isMeasured = useRef(false)

  useEffect(() => {
    if (!box) {
      return
    }
    if (isMeasured.current) {
      Animated.parallel([
        Animated.spring(left, {...SPRING, toValue: box.x}),
        Animated.spring(width, {...SPRING, toValue: box.width}),
      ]).start()
      return
    }
    // The first pill is placed, not animated: it has nowhere to have come from.
    isMeasured.current = true
    left.setValue(box.x)
    width.setValue(box.width)
  }, [box, left, width])

  return (
    <View style={styles.row}>
      {box ? (
        <Animated.View style={[styles.pill, {backgroundColor: color.pill, height: box.height, left, width}]} />
      ) : null}

      {quoteTabs.map(tab => (
        <Pressable
          key={tab}
          onLayout={event => {
            const {layout} = event.nativeEvent
            setBoxes(current => ({...current, [tab]: layout}))
          }}
          onPress={() => onSelect(tab)}
          style={styles.tab}
        >
          <QuoteText color={tab === selected ? color.text : color.textMuted} size={15} weight="500">
            {tab}
          </QuoteText>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {borderRadius: 999, position: 'absolute', top: 0},
  row: {alignItems: 'center', flexDirection: 'row', gap: 2},
  tab: {alignItems: 'center', cursor: 'pointer', paddingHorizontal: 14, paddingVertical: 8},
})
