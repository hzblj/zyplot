import {HStack, Spacer, VStack} from '@expo/ui/swift-ui'
import {background, frame} from '@expo/ui/swift-ui/modifiers'
import {formatPrice, formatSigned, type StocksRange, stocksAfterHours, stocksQuote} from '@zyplot/feature-charts/stocks'
import {useStocksTheme} from '../data/stocks-theme'
import type {StocksReadout} from '../hooks/use-stocks-readout'
import {StocksText} from './stocks-text.ios'

const Quote = ({change, isDown, label, price}: {change: string; isDown: boolean; label: string; price: string}) => {
  const {color} = useStocksTheme()

  return (
    <VStack alignment="leading" spacing={1}>
      <HStack alignment="lastTextBaseline" spacing={10}>
        <StocksText size={19} tabular weight="semibold">
          {price}
        </StocksText>
        <StocksText color={isDown ? color.down : color.up} size={19} tabular weight="semibold">
          {change}
        </StocksText>
      </HStack>
      <StocksText color={color.textMuted} size={17}>
        {label}
      </StocksText>
    </VStack>
  )
}

/**
 * The block the sheet opens on. Its numbers are the period's, and they stay the period's
 * while a finger reads the plot — what the finger finds is written above the plot instead.
 */
export const StocksHeader = ({range, readout}: {range: StocksRange; readout: StocksReadout}) => {
  const {color} = useStocksTheme()

  return (
    <VStack alignment="leading" spacing={8}>
      <HStack alignment="lastTextBaseline" spacing={10}>
        <StocksText size={34} weight="bold">
          {stocksQuote.symbol}
        </StocksText>
        <StocksText color={color.textMuted} size={17}>
          {stocksQuote.name}
        </StocksText>
        <Spacer />
      </HStack>

      <Spacer modifiers={[frame({height: 1}), background(color.divider)]} />

      <HStack alignment="top" spacing={28}>
        <Quote change={readout.change} isDown={readout.isDown} label={range.periodLabel} price={readout.price} />
        {range.id === '1d' ? (
          <Quote
            change={formatSigned(stocksAfterHours.change)}
            isDown={stocksAfterHours.change < 0}
            label="After hours"
            price={formatPrice(stocksAfterHours.price)}
          />
        ) : null}
        <Spacer />
      </HStack>

      <StocksText color={color.textMuted} size={15}>
        {`${stocksQuote.exchange} · ${stocksQuote.currency}`}
      </StocksText>
    </VStack>
  )
}
