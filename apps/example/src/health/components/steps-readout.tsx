import {formatSteps, type StepsReadout} from '@zyplot/feature-charts/health'
import {StyleSheet, View} from 'react-native'
import {useStepsTheme} from '../data/steps-theme'
import {StepsText} from './steps-text'

/** Wide enough for six digits and a two-date span, so the card never has to be measured. */
export const CARD_WIDTH = 210

const StepsReadoutBlock = ({readout}: {readout: StepsReadout}) => {
  const {color} = useStepsTheme()

  return (
    <View style={styles.block}>
      <StepsText color={color.textMuted} size={13} tracking={0.4} weight="600">
        {readout.caption}
      </StepsText>
      <View style={styles.amount}>
        <StepsText size={34} tabular weight="600">
          {formatSteps(readout.steps)}
        </StepsText>
        <StepsText color={color.textMuted} size={17} style={styles.unit}>
          steps
        </StepsText>
      </View>
      <StepsText color={color.textMuted} size={13} tabular>
        {readout.period}
      </StepsText>
    </View>
  )
}

export const StepsHeadline = ({readout}: {readout: StepsReadout}) => <StepsReadoutBlock readout={readout} />

/**
 * The same headline, promoted to a card that sits over what is being read. Apple's Health moves
 * the reading to the span rather than leaving it in the corner, which is what makes a
 * two-finger span feel like it belongs to the bars under the fingers.
 */
export const StepsSpanCard = ({left, readout}: {left: number; readout: StepsReadout}) => {
  const {color} = useStepsTheme()

  return (
    <View pointerEvents="none" style={[styles.card, {backgroundColor: color.card, left}]}>
      <StepsReadoutBlock readout={readout} />
    </View>
  )
}

const styles = StyleSheet.create({
  amount: {alignItems: 'baseline', flexDirection: 'row', gap: 5},
  block: {gap: 1},
  card: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: {height: 6, width: 0},
    shadowOpacity: 0.28,
    shadowRadius: 12,
    top: 0,
    width: CARD_WIDTH,
  },
  unit: {marginBottom: 2},
})
