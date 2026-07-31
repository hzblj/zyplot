import {usePathname, useRouter} from 'expo-router'
import {Linking, Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle} from 'react-native'
import {setColorScheme} from '../theme/color-scheme'
import {hoverTransition, space, weight} from '../theme/tokens'
import {useTheme} from '../theme/use-theme'

const ZYPLOT_HOME = 'https://www.zyplot.janblazej.dev'

const BUTTON = 40
const glyph = {back: '‹', dark: '☾', light: '☀︎', share: '↗'} as const

/** The pill colours of whichever product a screen imitates, so one header fits all of them. */
export type HeaderPalette = {pill: string; pillPressed: string; text: string}

const HeaderButton = ({
  label,
  onPress,
  palette,
  symbol,
}: {
  label: string
  onPress: () => void
  palette: HeaderPalette
  symbol: string
}) => (
  <Pressable
    accessibilityLabel={label}
    accessibilityRole="button"
    onPress={onPress}
    style={({hovered, pressed}) => [
      styles.button,
      hoverTransition,
      {backgroundColor: hovered || pressed ? palette.pillPressed : palette.pill},
    ]}
  >
    <Text style={[styles.glyph, {color: palette.text}]}>{symbol}</Text>
  </Pressable>
)

/**
 * The one header every example screen wears: back on the left, a link to the zyplot home page and
 * the colour-scheme switch on the right. Screens pass a palette when they imitate a product.
 */
export const AppHeader = ({
  palette,
  style,
  title,
}: {
  palette?: HeaderPalette
  style?: StyleProp<ViewStyle>
  title?: string
}) => {
  const {color, scheme} = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const next = scheme === 'dark' ? 'light' : 'dark'
  const tone = palette ?? {
    pill: color.fill.tertiary,
    pillPressed: color.fill.secondaryPressed,
    text: color.content.primary,
  }

  return (
    <View style={[styles.bar, style]}>
      <View style={styles.side}>
        {pathname === '/' ? null : (
          <HeaderButton
            label="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            palette={tone}
            symbol={glyph.back}
          />
        )}
        {title ? <Text style={[styles.title, {color: tone.text}]}>{title}</Text> : null}
      </View>

      <View style={styles.side}>
        <HeaderButton
          label="Open the zyplot home page"
          onPress={() => Linking.openURL(ZYPLOT_HOME)}
          palette={tone}
          symbol={glyph.share}
        />
        <HeaderButton
          label={`Switch to the ${next} theme`}
          onPress={() => setColorScheme(next)}
          palette={tone}
          symbol={glyph[next]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // No fixed height: the buttons set it, so a screen can pad the bar without squashing them.
  bar: {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: BUTTON},
  button: {
    alignItems: 'center',
    borderRadius: BUTTON / 2,
    cursor: 'pointer',
    height: BUTTON,
    justifyContent: 'center',
    width: BUTTON,
  },
  glyph: {fontSize: 18, lineHeight: 22},
  side: {alignItems: 'center', flexDirection: 'row', gap: space.sm},
  title: {fontSize: 17, fontWeight: weight.semibold, paddingHorizontal: space.xs},
})
