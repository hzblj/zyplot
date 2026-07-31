import {type StepsTheme, stepsThemes} from '@zyplot/feature-charts/health'
import {useColorScheme} from '../../theme/color-scheme'

export type {StepsColors} from '@zyplot/feature-charts/health'
export {stepsLayout} from '@zyplot/feature-charts/health'

export const useStepsTheme = (): StepsTheme => stepsThemes[useColorScheme()]
