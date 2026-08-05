import {StyleSheet, Text, View} from 'react-native'
import {useFamilyTheme} from '../data/family-theme'
import {useFamilyReading} from '../hooks/family-reading-context'

/**
 * The stamp over the rule, as the app's own view rather than the chart's `crosshairStyle.labels`.
 * Same pill, same measurements — the point is that they are ours to change now, without a style
 * field for each of them.
 *
 * Named in the chart's config as a component, so the stamp is read here rather than passed in.
 */
export const FamilyReadingChip = () => {
  const {color} = useFamilyTheme()
  const stamp = useFamilyReading()?.stamp ?? null

  if (stamp === null) {
    return null
  }

  return (
    <View style={[styles.chip, {backgroundColor: color.pillActive}]}>
      <Text style={[styles.label, {color: color.textMuted}]}>{stamp}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5},
  label: {fontSize: 13, fontVariant: ['tabular-nums'], fontWeight: '500'},
})
