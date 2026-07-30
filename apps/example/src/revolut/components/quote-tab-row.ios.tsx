import {HStack, Namespace, ZStack} from '@expo/ui/swift-ui'
import {Animation, animation, hidden, onTapGesture} from '@expo/ui/swift-ui/modifiers'
import {useId} from 'react'
import {type QuoteTabId, quoteTabs} from '../data/quote-data'
import {useQuoteTheme} from '../data/quote-theme'
import {quoteTabLabel, quoteTabPill} from './quote-tab-style'
import {QuoteText} from './quote-text.ios'

export type QuoteTabRowProps = {
  onSelect: (id: QuoteTabId) => void
  selected: QuoteTabId
}

export const QuoteTabRow = ({onSelect, selected}: QuoteTabRowProps) => {
  const {color} = useQuoteTheme()
  const namespaceId = useId()

  return (
    <Namespace id={namespaceId}>
      <HStack
        modifiers={[animation(Animation.spring({bounce: 0.2, duration: 0.4}), quoteTabs.indexOf(selected))]}
        spacing={2}
      >
        {quoteTabs.map(tab => (
          <ZStack key={tab} modifiers={[onTapGesture(() => onSelect(tab))]}>
            {tab === selected ? (
              <HStack modifiers={quoteTabPill(namespaceId, color.pill)}>
                {/* Hidden copy of the label sizes the pill to the text it sits behind. */}
                <QuoteText modifiers={[hidden()]} size={15} weight="medium">
                  {tab}
                </QuoteText>
              </HStack>
            ) : null}

            <HStack modifiers={quoteTabLabel()}>
              <QuoteText color={tab === selected ? color.text : color.textMuted} size={15} weight="medium">
                {tab}
              </QuoteText>
            </HStack>
          </ZStack>
        ))}
      </HStack>
    </Namespace>
  )
}
