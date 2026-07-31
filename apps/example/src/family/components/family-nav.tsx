import {familyToken} from '@zyplot/feature-charts/family'
import {StyleSheet, View} from 'react-native'
import {familyLayout, useFamilyTheme} from '../data/family-theme'
import {FamilyText} from './family-text'

export const FamilyTokenIdentity = () => {
  const {color} = useFamilyTheme()

  return (
    <View style={styles.identity}>
      <View style={[styles.avatar, {backgroundColor: color.mark}]}>
        <FamilyText size={22} weight="600">
          {familyToken.mark}
        </FamilyText>
      </View>

      <View style={styles.names}>
        <View style={styles.nameRow}>
          <FamilyText size={22} weight="bold">
            {familyToken.name}
          </FamilyText>
          <View style={[styles.badge, {backgroundColor: color.badge}]}>
            <FamilyText color="#ffffff" size={10} weight="bold">
              ✓
            </FamilyText>
          </View>
        </View>
        <FamilyText color={color.textMuted} size={13}>
          {`${familyToken.symbol} · ${familyToken.chain}`}
        </FamilyText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: familyLayout.avatar / 2,
    height: familyLayout.avatar,
    justifyContent: 'center',
    width: familyLayout.avatar,
  },
  badge: {
    alignItems: 'center',
    borderRadius: familyLayout.badge / 2,
    height: familyLayout.badge,
    justifyContent: 'center',
    width: familyLayout.badge,
  },
  identity: {gap: 14},
  nameRow: {alignItems: 'center', flexDirection: 'row', gap: 6},
  names: {gap: 3},
})
