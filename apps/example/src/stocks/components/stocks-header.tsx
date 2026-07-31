import {formatPrice, formatSigned, type StocksRange, stocksAfterHours, stocksQuote} from '@zyplot/feature-charts/stocks'
import {StyleSheet, View} from 'react-native'
import {useStocksTheme} from '../data/stocks-theme'
import type {StocksReadout} from '../hooks/use-stocks-readout'
import {StocksText} from './stocks-text'

const Quote = ({change, isDown, label, price}: {change: string; isDown: boolean; label: string; price: string}) => {
  const {color} = useStocksTheme()

  return (
    <View style={styles.quote}>
      <View style={styles.quoteRow}>
        <StocksText size={19} tabular weight="600">
          {price}
        </StocksText>
        <StocksText color={isDown ? color.down : color.up} size={19} tabular weight="600">
          {change}
        </StocksText>
      </View>
      <StocksText color={color.textMuted} size={17}>
        {label}
      </StocksText>
    </View>
  )
}

/**
 * The block the sheet opens on. Its numbers are the period's, and they stay the period's
 * while a finger reads the plot — what the finger finds is written above the plot instead.
 */
export const StocksHeader = ({range, readout}: {range: StocksRange; readout: StocksReadout}) => {
  const {color} = useStocksTheme()

  return (
    <View style={styles.column}>
      <View style={styles.symbol}>
        <StocksText size={34} weight="bold">
          {stocksQuote.symbol}
        </StocksText>
        <StocksText color={color.textMuted} size={17}>
          {stocksQuote.name}
        </StocksText>
      </View>

      <View style={[styles.rule, {backgroundColor: color.divider}]} />

      <View style={styles.quotes}>
        <Quote change={readout.change} isDown={readout.isDown} label={range.periodLabel} price={readout.price} />
        {range.id === '1d' ? (
          <Quote
            change={formatSigned(stocksAfterHours.change)}
            isDown={stocksAfterHours.change < 0}
            label="After hours"
            price={formatPrice(stocksAfterHours.price)}
          />
        ) : null}
      </View>

      <StocksText color={color.textMuted} size={15}>
        {`${stocksQuote.exchange} · ${stocksQuote.currency}`}
      </StocksText>
    </View>
  )
}

const styles = StyleSheet.create({
  column: {gap: 8},
  quote: {gap: 1},
  quoteRow: {alignItems: 'baseline', flexDirection: 'row', gap: 10},
  quotes: {flexDirection: 'row', gap: 28},
  rule: {height: StyleSheet.hairlineWidth, marginVertical: 4},
  symbol: {alignItems: 'baseline', flexDirection: 'row', gap: 10},
})
