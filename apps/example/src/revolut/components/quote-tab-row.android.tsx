import {Row} from '@expo/ui/jetpack-compose'
import {background, clickable, clip, padding} from '@expo/ui/jetpack-compose/modifiers'
import {type QuoteTabId, quoteTabs} from '@zyplot/feature-charts/revolut'
import {useQuoteTheme} from '../data/quote-theme'
import {composeRounded} from './quote-nav-bar.android'
import {QuoteText} from './quote-text.android'

export type QuoteTabRowProps = {
  onSelect: (id: QuoteTabId) => void
  selected: QuoteTabId
}

export const QuoteTabRow = ({onSelect, selected}: QuoteTabRowProps) => {
  const {color} = useQuoteTheme()

  return (
    <Row>
      {quoteTabs.map(tab => (
        <Row
          key={tab}
          modifiers={[
            ...(tab === selected ? [clip(composeRounded), background(color.pill)] : []),
            clickable(() => onSelect(tab)),
            padding(14, 8, 14, 8),
          ]}
        >
          <QuoteText color={tab === selected ? color.text : color.textMuted} size={15} weight="500">
            {tab}
          </QuoteText>
        </Row>
      ))}
    </Row>
  )
}
