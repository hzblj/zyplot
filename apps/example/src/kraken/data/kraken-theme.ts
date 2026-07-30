import {type KrakenTheme, krakenThemes} from '@zyplot/feature-charts/kraken'
import {useColorScheme} from '../../theme/color-scheme'

export {krakenLayout} from '@zyplot/feature-charts/kraken'

export const useKrakenTheme = (): KrakenTheme => krakenThemes[useColorScheme()]
