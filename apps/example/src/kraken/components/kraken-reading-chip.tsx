import {StyleSheet, Text} from 'react-native'
import {useKrakenTheme} from '../data/kraken-theme'
import {useKrakenReading} from '../hooks/kraken-reading-context'

/**
 * The label over the trail, as the app's own view rather than the chart's `crosshairStyle.labels`.
 * Bare text, the way the preset drew it — it never asked for a pill.
 *
 * Named in the chart's config as a component, so the stamp is read here rather than passed in.
 */
export const KrakenReadingChip = () => {
  const {color} = useKrakenTheme()
  const stamp = useKrakenReading()?.stamp ?? null

  if (stamp === null) {
    return null
  }

  return <Text style={[styles.label, {color: color.textMuted}]}>{stamp}</Text>
}

const styles = StyleSheet.create({
  label: {fontSize: 13, fontVariant: ['tabular-nums'], fontWeight: '500'},
})
