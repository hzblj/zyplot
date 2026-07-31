import {familyToken} from '@zyplot/feature-charts/family'
import {StyleSheet, View} from 'react-native'
import {useFamilyTheme} from '../data/family-theme'
import type {FamilyReadout} from '../hooks/use-family-readout'
import {FamilyText} from './family-text'

export const FamilyPriceReadout = ({readout}: {readout: FamilyReadout}) => {
  const {color} = useFamilyTheme()

  return (
    <View style={styles.readout}>
      <View style={styles.row}>
        <FamilyText size={34} tabular weight="bold">
          {`${familyToken.currency}${readout.price}`}
        </FamilyText>
        <View style={styles.spacer} />
        <FamilyText color={readout.isDown ? color.down : color.up} size={22} tabular weight="600">
          {`${readout.isDown ? '↓' : '↑'} ${readout.percent}`}
        </FamilyText>
      </View>

      <FamilyText color={color.textMuted} size={13} tabular>
        {`${readout.amount} · ${readout.subtitle}`}
      </FamilyText>
    </View>
  )
}

const styles = StyleSheet.create({
  readout: {gap: 4},
  row: {alignItems: 'baseline', flexDirection: 'row'},
  spacer: {flex: 1},
})
