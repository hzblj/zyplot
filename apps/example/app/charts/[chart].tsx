import {Chart} from '@hzblj/zyplot'
import {Stack, useLocalSearchParams} from 'expo-router'
import {ScrollView, StyleSheet, Text, View} from 'react-native'
import {chartTitle} from '../../src/charts/chart-catalog'
import {ChartExample} from '../../src/charts/chart-example'
import {borderWidth, radius, space, text} from '../../src/theme/tokens'
import {useTheme} from '../../src/theme/use-theme'

export default function ChartDetail() {
  const {chart} = useLocalSearchParams<{chart: string}>()
  const theme = useTheme()
  const id = chart ?? 'line'

  return (
    <>
      <Stack.Screen options={{title: chartTitle(id)}} />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: theme.color.surface.base}}
      >
        <Text style={[styles.description, {color: theme.color.content.secondary}]}>
          Rendered by the platform-native layer from the shared serializable API.
        </Text>
        <View
          style={[
            styles.card,
            {backgroundColor: theme.color.surface.primary, borderColor: theme.color.border.secondary},
          ]}
        >
          <Chart.Provider theme={theme.chart}>
            <ChartExample id={id} />
          </Chart.Provider>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: borderWidth.thin,
    marginTop: space.xl,
    overflow: 'hidden',
    padding: space.lg,
  },
  content: {padding: space.xl, paddingBottom: space['4xl']},
  description: text.body,
})
