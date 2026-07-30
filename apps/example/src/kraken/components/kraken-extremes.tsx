import {formatPrice, type KrakenCoin, type KrakenReading} from '@zyplot/feature-charts/kraken'
import {StyleSheet, View} from 'react-native'
import {useKrakenTheme} from '../data/kraken-theme'
import {KrakenText} from './kraken-text'

export const KrakenExtremes = ({coin, reading}: {coin: KrakenCoin; reading: KrakenReading}) => {
  const {color} = useKrakenTheme()

  return (
    <View style={styles.row}>
      <View style={styles.cell}>
        <KrakenText color={color.up} size={13} weight="500">
          ↑ High
        </KrakenText>
        <KrakenText size={15} tabular weight="600">
          {formatPrice(reading.high, coin.precision)}
        </KrakenText>
      </View>
      <View style={[styles.cell, styles.cellEnd]}>
        <KrakenText color={color.down} size={13} weight="500">
          ↓ Low
        </KrakenText>
        <KrakenText size={15} tabular weight="600">
          {formatPrice(reading.low, coin.precision)}
        </KrakenText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cell: {gap: 3},
  cellEnd: {alignItems: 'flex-end'},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
})
