import {Column, Row} from '@expo/ui/jetpack-compose'
import {background, clip, size} from '@expo/ui/jetpack-compose/modifiers'
import type {KrakenCoin} from '@zyplot/feature-charts/kraken'
import {useKrakenTheme} from '../data/kraken-theme'
import type {KrakenReadout} from '../hooks/use-kraken-readout'
import {composeCircle} from './kraken-nav.android'
import {KrakenText} from './kraken-text.android'

const MARK = 44

const KrakenCoinMark = ({coin, size: diameter = MARK}: {coin: KrakenCoin; size?: number}) => (
  <Row
    horizontalArrangement="center"
    modifiers={[size(diameter, diameter), clip(composeCircle), background(coin.markColor)]}
    verticalAlignment="center"
  >
    <KrakenText color="#ffffff" size={diameter * 0.5} weight="bold">
      {coin.mark}
    </KrakenText>
  </Row>
)

export const KrakenPriceReadout = ({coin, readout}: {coin: KrakenCoin; readout: KrakenReadout}) => {
  const {color} = useKrakenTheme()
  const tint = readout.isDown ? color.down : color.up

  return (
    <Column verticalArrangement={{spacedBy: 6}}>
      <KrakenCoinMark coin={coin} />
      <KrakenText size={19} weight="600">
        {coin.name}
      </KrakenText>

      <Row verticalAlignment="bottom">
        <KrakenText size={40} weight="600">
          {readout.price.whole}
        </KrakenText>
        {readout.price.fraction ? (
          <KrakenText color={color.textFaint} size={40} weight="600">
            {`.${readout.price.fraction}`}
          </KrakenText>
        ) : null}
      </Row>

      <Row horizontalArrangement={{spacedBy: 5}} verticalAlignment="center">
        <KrakenText color={tint} size={14} weight="500">
          {`${readout.amount} · ${readout.isDown ? '↘' : '↗'} ${readout.percent}`}
        </KrakenText>
        {readout.subtitle ? (
          <KrakenText color={color.textMuted} size={14}>
            {readout.subtitle}
          </KrakenText>
        ) : null}
      </Row>
    </Column>
  )
}
