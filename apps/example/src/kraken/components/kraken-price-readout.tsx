import type {KrakenCoin} from '@zyplot/feature-charts/kraken'
import {StyleSheet, View} from 'react-native'
import {useKrakenTheme} from '../data/kraken-theme'
import type {KrakenReadout} from '../hooks/use-kraken-readout'
import {KrakenText} from './kraken-text'

const MARK = 44

const KrakenCoinMark = ({coin, size = MARK}: {coin: KrakenCoin; size?: number}) => (
  <View style={[styles.mark, {backgroundColor: coin.markColor, borderRadius: size / 2, height: size, width: size}]}>
    <KrakenText color="#ffffff" size={size * 0.5} weight="bold">
      {coin.mark}
    </KrakenText>
  </View>
)

export const KrakenPriceReadout = ({coin, readout}: {coin: KrakenCoin; readout: KrakenReadout}) => {
  const {color} = useKrakenTheme()
  const tint = readout.isDown ? color.down : color.up

  return (
    <View style={styles.readout}>
      <KrakenCoinMark coin={coin} />
      <KrakenText size={19} weight="600">
        {coin.name}
      </KrakenText>

      <View style={styles.price}>
        <KrakenText size={40} tabular weight="600">
          {readout.price.whole}
        </KrakenText>
        {readout.price.fraction ? (
          <KrakenText color={color.textFaint} size={40} tabular weight="600">
            {`.${readout.price.fraction}`}
          </KrakenText>
        ) : null}
      </View>

      <View style={styles.change}>
        <KrakenText color={tint} size={14} tabular weight="500">
          {readout.amount}
        </KrakenText>
        <KrakenText color={tint} size={14}>
          ·
        </KrakenText>
        <KrakenText color={tint} size={14} tabular weight="500">
          {`${readout.isDown ? '↘' : '↗'} ${readout.percent}`}
        </KrakenText>
        {readout.subtitle ? (
          <KrakenText color={color.textMuted} size={14}>
            {readout.subtitle}
          </KrakenText>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  change: {alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 2},
  mark: {alignItems: 'center', justifyContent: 'center'},
  price: {alignItems: 'baseline', flexDirection: 'row', marginTop: 6},
  readout: {alignItems: 'flex-start', gap: 6},
})
