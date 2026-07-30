import {Chart} from '@hzblj/zyplot/ios'
import {chartHeight} from '../../theme/tokens'

export const PlatformExample = ({id}: {id: string}) => {
  switch (id) {
    case 'ios-rule':
      return (
        <Chart.Rule
          data={[
            {id: 'target', label: 'Target', value: 72},
            {id: 'forecast', label: 'Forecast', value: 84},
          ]}
          height={chartHeight.md}
        />
      )
    case 'ios-range':
      return (
        <Chart.Range
          data={[
            {category: 'Jan', high: 58, id: 'jan', low: 34},
            {category: 'Feb', high: 72, id: 'feb', low: 46},
            {category: 'Mar', high: 81, id: 'mar', low: 52},
            {category: 'Apr', high: 92, id: 'apr', low: 64},
          ]}
          height={chartHeight.md}
        />
      )
    default:
      return null
  }
}
