import {HStack, Spacer, VStack} from '@expo/ui/swift-ui'
import {formatPrice, type KrakenCoin, type KrakenReading} from '@zyplot/feature-charts/kraken'
import {useKrakenTheme} from '../data/kraken-theme'
import {KrakenText} from './kraken-text.ios'

export const KrakenExtremes = ({coin, reading}: {coin: KrakenCoin; reading: KrakenReading}) => {
  const {color} = useKrakenTheme()

  return (
    <HStack>
      <VStack alignment="leading" spacing={3}>
        <KrakenText color={color.up} size={13} weight="medium">
          ↑ High
        </KrakenText>
        <KrakenText size={15} tabular weight="semibold">
          {formatPrice(reading.high, coin.precision)}
        </KrakenText>
      </VStack>
      <Spacer />
      <VStack alignment="trailing" spacing={3}>
        <KrakenText color={color.down} size={13} weight="medium">
          ↓ Low
        </KrakenText>
        <KrakenText size={15} tabular weight="semibold">
          {formatPrice(reading.low, coin.precision)}
        </KrakenText>
      </VStack>
    </HStack>
  )
}
