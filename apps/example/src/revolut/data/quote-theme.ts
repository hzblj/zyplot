import {type QuoteTheme, quoteThemes} from '@zyplot/feature-charts/revolut'
import {useColorScheme} from '../../theme/color-scheme'

export type {QuoteColors} from '@zyplot/feature-charts/revolut'
export {quoteLayout} from '@zyplot/feature-charts/revolut'

export const useQuoteTheme = (): QuoteTheme => quoteThemes[useColorScheme()]
