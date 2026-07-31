import {type StocksTheme, stocksThemes} from '@zyplot/feature-charts/stocks'
import {useColorScheme} from '../../theme/color-scheme'

export {stocksLayout} from '@zyplot/feature-charts/stocks'

export const useStocksTheme = (): StocksTheme => stocksThemes[useColorScheme()]
