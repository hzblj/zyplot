import {StocksTickerSpark, stocksTicker} from '@zyplot/feature-charts/stocks'
import {useEffect, useRef, useState} from 'react'
import {Animated, Easing, StyleSheet, View} from 'react-native'
import {stocksLayout, useStocksTheme} from '../data/stocks-theme'
import {StocksTickerCell} from './stocks-ticker-cell'

/**
 * The tape above the sheet. The quotes are laid out twice and the pair is slid left by exactly
 * one run's width before it snaps back, so the seam falls on an identical frame and the tape
 * reads as one that never ends.
 */
export const StocksTicker = () => {
  const {color, scheme} = useStocksTheme()
  const shift = useRef(new Animated.Value(0)).current
  const [span, setSpan] = useState(0)

  useEffect(() => {
    if (span === 0) {
      return
    }
    shift.setValue(0)
    const loop = Animated.loop(
      Animated.timing(shift, {
        duration: (span / stocksLayout.ticker.speed) * 1000,
        easing: Easing.linear,
        toValue: -span,
        useNativeDriver: true,
      })
    )
    loop.start()
    return () => loop.stop()
  }, [shift, span])

  const run = (key: string, onMeasure?: (width: number) => void) => (
    <View key={key} onLayout={onMeasure && (event => onMeasure(event.nativeEvent.layout.width))} style={styles.run}>
      {stocksTicker.map(quote => (
        <View key={quote.id} style={styles.item}>
          <StocksTickerCell quote={quote} />
          <View style={styles.spark}>
            <StocksTickerSpark quote={quote} scheme={scheme} />
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <View pointerEvents="none" style={[styles.tape, {backgroundColor: color.background}]}>
      <Animated.View style={[styles.track, {transform: [{translateX: shift}]}]}>
        {run('lead', setSpan)}
        {run('trail')}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {alignItems: 'center', flexDirection: 'row', gap: 12, paddingRight: 22},
  run: {alignItems: 'center', flexDirection: 'row'},
  spark: {width: stocksLayout.sparkline.width},
  tape: {height: stocksLayout.ticker.height, justifyContent: 'center', overflow: 'hidden'},
  track: {flexDirection: 'row'},
})
