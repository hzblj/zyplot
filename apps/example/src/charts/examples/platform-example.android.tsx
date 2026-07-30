import {Chart} from '@hzblj/zyplot/android'
import {chartHeight} from '../../theme/tokens'

export const PlatformExample = ({id}: {id: string}) => {
  switch (id) {
    case 'android-waterfall':
      return (
        <Chart.Waterfall
          data={[
            {id: 'start', label: 'Start', value: 48},
            {id: 'growth', label: 'Growth', value: 22},
            {id: 'cost', label: 'Cost', value: -14},
            {id: 'end', label: 'End', value: 31},
          ]}
          height={chartHeight.md}
        />
      )
    case 'android-lollipop':
      return (
        <Chart.Lollipop
          data={[
            {id: 'web', label: 'Web', value: 72},
            {id: 'ios', label: 'iOS', value: 58},
            {id: 'android', label: 'Android', value: 64},
          ]}
          height={chartHeight.md}
        />
      )
    default:
      return null
  }
}
