import {Column, Row, Spacer} from '@expo/ui/jetpack-compose'
import {
  background,
  clickable,
  fillMaxHeight,
  fillMaxWidth,
  height,
  padding,
  size,
  weight,
} from '@expo/ui/jetpack-compose/modifiers'
import {type KrakenRangeId, krakenRanges} from '@zyplot/feature-charts/kraken'
import {krakenLayout, useKrakenTheme} from '../data/kraken-theme'
import {KrakenText} from './kraken-text.android'

export type KrakenRangeTabsProps = {
  onSelect: (id: KrakenRangeId) => void
  selected: KrakenRangeId
}

const {gutter, rule, tabs} = krakenLayout

export const KrakenRangeTabs = ({onSelect, selected}: KrakenRangeTabsProps) => {
  const {color} = useKrakenTheme()

  return (
    <Column modifiers={[fillMaxWidth()]}>
      <Spacer modifiers={[fillMaxWidth(), height(rule), background(color.divider)]} />
      <Row modifiers={[fillMaxWidth(), height(tabs.height), padding(gutter, 0, gutter, 0)]}>
        {krakenRanges.map(range => (
          <Column
            horizontalAlignment="center"
            key={range.id}
            modifiers={[weight(1), fillMaxHeight(), clickable(() => onSelect(range.id))]}
          >
            {}
            <Spacer modifiers={[weight(1)]} />
            <KrakenText
              color={range.id === selected ? color.text : color.textMuted}
              size={14}
              weight={range.id === selected ? '600' : '500'}
            >
              {range.label}
            </KrakenText>
            <Spacer modifiers={[weight(1)]} />
            <Spacer
              modifiers={[
                size(tabs.underline.width, tabs.underline.height),
                background(range.id === selected ? color.text : 'transparent'),
              ]}
            />
          </Column>
        ))}
      </Row>
      <Spacer modifiers={[fillMaxWidth(), height(rule), background(color.divider)]} />
    </Column>
  )
}
