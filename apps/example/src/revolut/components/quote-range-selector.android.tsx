import {Row, Spacer} from '@expo/ui/jetpack-compose'
import {background, clickable, clip, padding, size, weight} from '@expo/ui/jetpack-compose/modifiers'
import {type QuoteRangeId, quoteRanges} from '../data/quote-data'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'
import {composeRounded, QuoteCircleButton} from './quote-nav-bar.android'
import {QuoteText} from './quote-text.android'

export type QuoteRangeSelectorProps = {
  isCandlestick: boolean
  onSelect: (id: QuoteRangeId) => void
  onToggleCandlestick: () => void
  selected: QuoteRangeId
}

/**
 * The same pill track the iOS selector shows, drawn by hand: Material's segmented buttons
 * put a check glyph and an outline on the selected item, and the Compose wrapper gives no
 * way to turn either off.
 */
export const QuoteRangeSelector = ({
  isCandlestick,
  onSelect,
  onToggleCandlestick,
  selected,
}: QuoteRangeSelectorProps) => {
  const {color} = useQuoteTheme()

  return (
    <Row verticalAlignment="center">
      <Row
        modifiers={[weight(1), clip(composeRounded), background(color.pill), padding(3, 3, 3, 3)]}
        verticalAlignment="center"
      >
        {quoteRanges.map(range => (
          <Row
            horizontalArrangement="center"
            key={range.id}
            modifiers={[
              weight(1),
              ...(range.id === selected ? [clip(composeRounded), background(color.pillActive)] : []),
              clickable(() => onSelect(range.id)),
              padding(0, 7, 0, 7),
            ]}
            verticalAlignment="center"
          >
            <QuoteText color={range.id === selected ? color.text : color.textMuted} size={13} weight="500">
              {range.label}
            </QuoteText>
          </Row>
        ))}
      </Row>
      <Spacer modifiers={[size(8, 1)]} />
      <QuoteCircleButton
        diameter={quoteLayout.controlHeight}
        glyph={isCandlestick ? '∿' : '≡'}
        onPress={onToggleCandlestick}
      />
    </Row>
  )
}
