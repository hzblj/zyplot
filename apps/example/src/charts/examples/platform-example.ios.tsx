import {Chart, zyplot} from '@hzblj/zyplot/ios'
import {chartHeight} from '../../theme/tokens'

const ruleChart = zyplot(() => ({
  data: [
    {id: 'target', label: 'Target', value: 72},
    {id: 'forecast', label: 'Forecast', value: 84},
  ],
  height: chartHeight.md,
}))

const rangeChart = zyplot(() => ({
  data: [
    {category: 'Jan', high: 58, id: 'jan', low: 34},
    {category: 'Feb', high: 72, id: 'feb', low: 46},
    {category: 'Mar', high: 81, id: 'mar', low: 52},
    {category: 'Apr', high: 92, id: 'apr', low: 64},
  ],
  height: chartHeight.md,
}))

export const PlatformExample = ({id}: {id: string}) => {
  switch (id) {
    case 'ios-rule':
      return <Chart.Rule {...ruleChart} />
    case 'ios-range':
      return <Chart.Range {...rangeChart} />
    default:
      return null
  }
}
