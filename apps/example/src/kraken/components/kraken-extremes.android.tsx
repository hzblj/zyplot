import {Column, Row} from '@expo/ui/jetpack-compose'
import {weight} from '@expo/ui/jetpack-compose/modifiers'
import {formatPrice, type KrakenCoin, type KrakenReading} from '@zyplot/feature-charts/kraken'
import {useKrakenTheme} from '../data/kraken-theme'
import {KrakenText} from './kraken-text.android'

export const KrakenExtremes = ({coin, reading}: {coin: KrakenCoin; reading: KrakenReading}) => {
  const {color} = useKrakenTheme()

  return (
    <Row>
      <Column modifiers={[weight(1)]} verticalArrangement={{spacedBy: 3}}>
        <KrakenText color={color.up} size={13} weight="500">
          ↑ High
        </KrakenText>
        <KrakenText size={15} weight="600">
          {formatPrice(reading.high, coin.precision)}
        </KrakenText>
      </Column>
      <Column horizontalAlignment="end" verticalArrangement={{spacedBy: 3}}>
        <KrakenText color={color.down} size={13} weight="500">
          ↓ Low
        </KrakenText>
        <KrakenText size={15} weight="600">
          {formatPrice(reading.low, coin.precision)}
        </KrakenText>
      </Column>
    </Row>
  )
}
