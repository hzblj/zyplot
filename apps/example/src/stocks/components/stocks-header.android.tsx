import {Column, Row, Spacer} from '@expo/ui/jetpack-compose'
import {background, fillMaxWidth, height, size} from '@expo/ui/jetpack-compose/modifiers'
import {formatPrice, formatSigned, type StocksRange, stocksAfterHours, stocksQuote} from '@zyplot/feature-charts/stocks'
import {useStocksTheme} from '../data/stocks-theme'
import type {StocksReadout} from '../hooks/use-stocks-readout'
import {StocksText} from './stocks-text.android'

const Quote = ({change, isDown, label, price}: {change: string; isDown: boolean; label: string; price: string}) => {
  const {color} = useStocksTheme()

  return (
    <Column>
      <Row verticalAlignment="bottom">
        <StocksText size={19} weight="600">
          {price}
        </StocksText>
        <Spacer modifiers={[size(10, 1)]} />
        <StocksText color={isDown ? color.down : color.up} size={19} weight="600">
          {change}
        </StocksText>
      </Row>
      <StocksText color={color.textMuted} size={17}>
        {label}
      </StocksText>
    </Column>
  )
}

/**
 * The block the sheet opens on. Its numbers are the period's, and they stay the period's
 * while a finger reads the plot — what the finger finds is written above the plot instead.
 */
export const StocksHeader = ({range, readout}: {range: StocksRange; readout: StocksReadout}) => {
  const {color} = useStocksTheme()

  return (
    <Column modifiers={[fillMaxWidth()]}>
      <Row verticalAlignment="bottom">
        <StocksText size={34} weight="bold">
          {stocksQuote.symbol}
        </StocksText>
        <Spacer modifiers={[size(10, 1)]} />
        <StocksText color={color.textMuted} size={17}>
          {stocksQuote.name}
        </StocksText>
      </Row>

      <Spacer modifiers={[size(1, 10)]} />
      <Spacer modifiers={[fillMaxWidth(), height(1), background(color.divider)]} />
      <Spacer modifiers={[size(1, 10)]} />

      <Row>
        <Quote change={readout.change} isDown={readout.isDown} label={range.periodLabel} price={readout.price} />
        {range.id === '1d' ? (
          <>
            <Spacer modifiers={[size(28, 1)]} />
            <Quote
              change={formatSigned(stocksAfterHours.change)}
              isDown={stocksAfterHours.change < 0}
              label="After hours"
              price={formatPrice(stocksAfterHours.price)}
            />
          </>
        ) : null}
      </Row>

      <Spacer modifiers={[size(1, 8)]} />
      <StocksText color={color.textMuted} size={15}>
        {`${stocksQuote.exchange} · ${stocksQuote.currency}`}
      </StocksText>
    </Column>
  )
}
