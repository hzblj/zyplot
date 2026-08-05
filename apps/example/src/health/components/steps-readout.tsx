import {formatSteps, type StepsReadout} from '@zyplot/feature-charts/health'
import {StyleSheet, View} from 'react-native'
import {useStepsTheme} from '../data/steps-theme'
import {useStepsReading} from '../hooks/steps-reading-context'
import {StepsText} from './steps-text'

/** Wide enough for six digits and a two-date span, so the card never has to be measured. */
const CARD_WIDTH = 210

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
 *
 * Named in the chart's config as a view rather than placed here, so the chart moves it with the
 * fingers in its own layout pass and what it says is read from the screen's own context.
 */
const ReadingCard = ({readout}: {readout: StepsReadout}) => {
  const {color} = useStepsTheme()

  return (
    <View pointerEvents="none" style={[styles.card, {backgroundColor: color.card}]}>
      <StepsReadoutBlock readout={readout} />
    </View>
  )
}

/** The card for one bar, which is the chart's `tooltip` view. */
export const StepsReadingCard = () => {
  const view = useStepsReading()

  return !view || !view.isReading || view.isSpan ? null : <ReadingCard readout={view.readout} />
}

/** The card for the span between two fingers, which is the chart's `rangeView`. */
export const StepsSpanCard = () => {
  const view = useStepsReading()

  return view?.isSpan ? <ReadingCard readout={view.readout} /> : null
}

const styles = StyleSheet.create({
  amount: {alignItems: 'baseline', flexDirection: 'row', gap: 5},
  block: {gap: 1},
  card: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: '#000000',
    shadowOffset: {height: 6, width: 0},
    shadowOpacity: 0.28,
    shadowRadius: 12,
    width: CARD_WIDTH,
  },
  unit: {marginBottom: 2},
})
