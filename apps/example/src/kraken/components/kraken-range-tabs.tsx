import {type KrakenRangeId, krakenRanges} from '@zyplot/feature-charts/kraken'
import {Pressable, StyleSheet, View} from 'react-native'
import {krakenLayout, useKrakenTheme} from '../data/kraken-theme'
import {KrakenText} from './kraken-text'

export type KrakenRangeTabsProps = {
  onSelect: (id: KrakenRangeId) => void
  selected: KrakenRangeId
}

export const KrakenRangeTabs = ({onSelect, selected}: KrakenRangeTabsProps) => {
  const {color} = useKrakenTheme()

  return (
    <View style={[styles.row, {borderBottomColor: color.divider, borderTopColor: color.divider}]}>
      {krakenRanges.map(range => (
        <Pressable key={range.id} onPress={() => onSelect(range.id)} style={styles.tab}>
          <KrakenText
            color={range.id === selected ? color.text : color.textMuted}
            size={14}
            weight={range.id === selected ? '600' : '500'}
          >
            {range.label}
          </KrakenText>
          <View style={[styles.underline, {backgroundColor: range.id === selected ? color.text : 'transparent'}]} />
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: krakenLayout.rule,
    borderTopWidth: krakenLayout.rule,
    flexDirection: 'row',
    paddingHorizontal: krakenLayout.gutter,
  },
  tab: {
    alignItems: 'center',
    cursor: 'pointer',
    flex: 1,
    height: krakenLayout.tabs.height,
    justifyContent: 'center',
    paddingBottom: krakenLayout.tabs.underline.height,
  },
  underline: {bottom: 0, position: 'absolute', ...krakenLayout.tabs.underline},
})
