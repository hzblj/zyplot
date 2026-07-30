import {StyleSheet, View} from 'react-native'
import {quote} from '../data/quote-data'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import type {QuoteReadout} from '../hooks/use-quote-readout'
import {QuoteCircleButton} from './quote-nav-bar'
import {QuoteText} from './quote-text'

const MarketStatus = ({isPreMarket}: {isPreMarket: boolean}) => {
  const {color} = useQuoteTheme()

  return isPreMarket ? (
    <View style={[styles.chip, {backgroundColor: color.statusChip}]}>
      {/* U+FE0E, as in the nav bar's switch: without it a colour emoji font takes the sun
          over and none of the colour above reaches it. */}
      <QuoteText color={color.statusChipText} size={11}>
        ☀︎
      </QuoteText>
      <QuoteText color={color.statusChipText} size={12} weight="600">
        Pre-market
      </QuoteText>
    </View>
  ) : (
    <View style={[styles.sun, {backgroundColor: color.pill}]}>
      <QuoteText color={color.statusChipText} size={13}>
        ☀︎
      </QuoteText>
    </View>
  )
}

export const QuotePriceReadout = ({readout}: {readout: QuoteReadout}) => {
  const {color} = useQuoteTheme()

  return (
    <View style={styles.readout}>
      <View style={styles.priceRow}>
        <View style={styles.price}>
          <QuoteText size={36} tabular weight="bold">
            {readout.price.whole}
          </QuoteText>
          <QuoteText size={24} tabular weight="600">
            {`.${readout.price.fraction} ${quote.currency}`}
          </QuoteText>
        </View>
        <MarketStatus isPreMarket={readout.isPreMarket && readout.isScrubbing} />
        <View style={styles.spacer} />
        <QuoteCircleButton diameter={36} glyph="⤢" />
      </View>

      <View style={styles.changeRow}>
        <QuoteText color={color.textMuted} size={13} tabular>
          {`${readout.amount} ${quote.currency}`}
        </QuoteText>
        <QuoteText color={readout.isDown ? color.down : color.up} size={13} tabular weight="500">
          {`${readout.isDown ? '▼' : '▲'} ${readout.percent}`}
        </QuoteText>
        <QuoteText color={color.textMuted} size={13}>
          {`· ${readout.subtitle}`}
        </QuoteText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  changeRow: {alignItems: 'center', flexDirection: 'row', gap: 6},
  chip: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  price: {alignItems: 'baseline', flexDirection: 'row'},
  priceRow: {alignItems: 'center', flexDirection: 'row', gap: 8},
  readout: {gap: 3},
  spacer: {flex: 1},
  sun: {
    alignItems: 'center',
    borderRadius: quoteLayout.statusSurface / 2,
    height: quoteLayout.statusSurface,
    justifyContent: 'center',
    width: quoteLayout.statusSurface,
  },
})
