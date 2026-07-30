import {HStack, Image, Picker, Text} from '@expo/ui/swift-ui'
import {
  background,
  clipShape,
  environment,
  font,
  frame,
  onTapGesture,
  pickerStyle,
  tag,
} from '@expo/ui/swift-ui/modifiers'
import {type QuoteRangeId, quoteRanges} from '@zyplot/feature-charts/revolut'
import {quoteLayout, useQuoteTheme} from '../data/quote-theme'

export type QuoteRangeSelectorProps = {
  isCandlestick: boolean
  onSelect: (id: QuoteRangeId) => void
  onToggleCandlestick: () => void
  selected: QuoteRangeId
}

export const QuoteRangeSelector = ({
  isCandlestick,
  onSelect,
  onToggleCandlestick,
  selected,
}: QuoteRangeSelectorProps) => {
  const {color, scheme} = useQuoteTheme()

  return (
    <HStack spacing={8}>
      <Picker
        modifiers={[
          pickerStyle('segmented'),
          environment({key: 'colorScheme', value: scheme}),
          frame({height: quoteLayout.controlHeight}),
        ]}
        onSelectionChange={value => onSelect(value as QuoteRangeId)}
        selection={selected}
      >
        {quoteRanges.map(range => (
          <Text key={range.id} modifiers={[font({size: 13, weight: 'medium'}), tag(range.id)]}>
            {range.label}
          </Text>
        ))}
      </Picker>

      <HStack
        modifiers={[
          frame({height: quoteLayout.controlHeight, width: quoteLayout.controlHeight}),
          background(color.pill),
          clipShape('circle'),
          onTapGesture(onToggleCandlestick),
        ]}
      >
        {}
        <Image color={color.text} size={16} systemName={isCandlestick ? 'chart.xyaxis.line' : 'slider.vertical.3'} />
      </HStack>
    </HStack>
  )
}
