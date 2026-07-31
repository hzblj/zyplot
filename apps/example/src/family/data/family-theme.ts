import {type FamilyTheme, familyThemes} from '@zyplot/feature-charts/family'
import {useColorScheme} from '../../theme/color-scheme'

export type {FamilyColors} from '@zyplot/feature-charts/family'
export {familyLayout} from '@zyplot/feature-charts/family'

export const useFamilyTheme = (): FamilyTheme => familyThemes[useColorScheme()]
