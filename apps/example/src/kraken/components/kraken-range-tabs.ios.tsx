import {HStack, Spacer, VStack} from '@expo/ui/swift-ui'
import {background, contentShape, frame, onTapGesture, shapes} from '@expo/ui/swift-ui/modifiers'
import {type KrakenRangeId, krakenRanges} from '@zyplot/feature-charts/kraken'
import {useWindowDimensions} from 'react-native'
import {krakenLayout, useKrakenTheme} from '../data/kraken-theme'
import {KrakenText} from './kraken-text.ios'

export type KrakenRangeTabsProps = {
  onSelect: (id: KrakenRangeId) => void
  selected: KrakenRangeId
}

const KrakenRule = ({color, width}: {color: string; width: number}) => (
  <Spacer modifiers={[frame({height: krakenLayout.rule, width}), background(color)]} />
)

export const KrakenRangeTabs = ({onSelect, selected}: KrakenRangeTabsProps) => {
  const {color} = useKrakenTheme()
  const {width} = useWindowDimensions()
  const column = (width - krakenLayout.gutter * 2) / krakenRanges.length

  return (
    <VStack spacing={0}>
      <KrakenRule color={color.divider} width={width} />
      <HStack spacing={0}>
        {krakenRanges.map(range => (
          <VStack
            key={range.id}
            modifiers={[
              frame({height: krakenLayout.tabs.height, width: column}),
              contentShape(shapes.rectangle()),
              onTapGesture(() => onSelect(range.id)),
            ]}
            spacing={0}
          >
            {}
            <Spacer />
            <KrakenText
              color={range.id === selected ? color.text : color.textMuted}
              size={14}
              weight={range.id === selected ? 'semibold' : 'medium'}
            >
              {range.label}
            </KrakenText>
            <Spacer />
            <Spacer
              modifiers={[
                frame(krakenLayout.tabs.underline),
                background(range.id === selected ? color.text : 'transparent'),
              ]}
            />
          </VStack>
        ))}
      </HStack>
      <KrakenRule color={color.divider} width={width} />
    </VStack>
  )
}
