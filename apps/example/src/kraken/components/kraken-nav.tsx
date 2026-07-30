import {Pressable, StyleSheet, View} from 'react-native'
import {setColorScheme} from '../../theme/color-scheme'
import {krakenLayout, useKrakenTheme} from '../data/kraken-theme'
import {KrakenText} from './kraken-text'

const schemeGlyph = {dark: '☾', light: '☀︎'} as const

export const KrakenCircleButton = ({
  diameter = krakenLayout.circleButton,
  glyph,
  onPress,
  tint,
}: {
  diameter?: number
  glyph: string
  onPress?: () => void
  tint?: string
}) => {
  const {color} = useKrakenTheme()

  return (
    <Pressable
      onPress={onPress}
      style={({hovered, pressed}) => [
        styles.circle,
        {
          backgroundColor: pressed || hovered ? color.pillPressed : color.pill,
          borderRadius: diameter / 2,
          height: diameter,
          width: diameter,
        },
      ]}
    >
      <KrakenText color={tint} size={diameter * 0.42}>
        {glyph}
      </KrakenText>
    </Pressable>
  )
}

export const KrakenNavBar = ({onBack}: {onBack: () => void}) => {
  const {color, scheme} = useKrakenTheme()
  const next = scheme === 'dark' ? 'light' : 'dark'

  return (
    <View style={styles.bar}>
      <KrakenCircleButton glyph="‹" onPress={onBack} />
      <View style={styles.barEnd}>
        <View style={[styles.group, {backgroundColor: color.pill, borderRadius: krakenLayout.circleButton / 2}]}>
          <KrakenCircleButton glyph="♥" tint={color.down} />
          <View style={[styles.groupRule, {backgroundColor: color.divider}]} />
          <KrakenCircleButton glyph="⋮" />
        </View>
        <KrakenCircleButton glyph={schemeGlyph[next]} onPress={() => setColorScheme(next)} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    height: krakenLayout.navHeight,
    justifyContent: 'space-between',
  },
  barEnd: {alignItems: 'center', flexDirection: 'row', gap: 10},
  circle: {alignItems: 'center', cursor: 'pointer', justifyContent: 'center'},
  group: {alignItems: 'center', flexDirection: 'row'},
  groupRule: {height: 20, width: 1},
})
