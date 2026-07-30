import {HStack, VStack} from '@expo/ui/swift-ui'
import {background, clipShape, frame} from '@expo/ui/swift-ui/modifiers'
import type {KrakenCoin} from '@zyplot/feature-charts/kraken'
import {useKrakenTheme} from '../data/kraken-theme'
import type {KrakenReadout} from '../hooks/use-kraken-readout'
import {KrakenText} from './kraken-text.ios'

const MARK = 44

const KrakenCoinMark = ({coin, size = MARK}: {coin: KrakenCoin; size?: number}) => (
  <HStack modifiers={[frame({height: size, width: size}), background(coin.markColor), clipShape('circle')]}>
    <KrakenText color="#ffffff" size={size * 0.5} weight="bold">
      {coin.mark}
    </KrakenText>
  </HStack>
)

export const KrakenPriceReadout = ({coin, readout}: {coin: KrakenCoin; readout: KrakenReadout}) => {
  const {color} = useKrakenTheme()
  const tint = readout.isDown ? color.down : color.up

  return (
    <VStack alignment="leading" spacing={6}>
      <KrakenCoinMark coin={coin} />
      <KrakenText size={19} weight="semibold">
        {coin.name}
      </KrakenText>

      <HStack alignment="lastTextBaseline" spacing={0}>
        <KrakenText rolls={readout.value} size={40} tabular weight="semibold">
          {readout.price.whole}
        </KrakenText>
        {readout.price.fraction ? (
          <KrakenText color={color.textFaint} rolls={readout.value} size={40} tabular weight="semibold">
            {`.${readout.price.fraction}`}
          </KrakenText>
        ) : null}
      </HStack>

      <HStack spacing={5}>
        <KrakenText color={tint} rolls={readout.value} size={14} tabular weight="medium">
          {`${readout.amount} · ${readout.isDown ? '↘' : '↗'} ${readout.percent}`}
        </KrakenText>
        {readout.subtitle ? (
          <KrakenText color={color.textMuted} size={14}>
            {readout.subtitle}
          </KrakenText>
        ) : null}
      </HStack>
    </VStack>
  )
}
