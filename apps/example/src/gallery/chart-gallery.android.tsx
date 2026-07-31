import {Host, LazyColumn, ListItem, Text} from '@expo/ui/jetpack-compose'
import {clickable, fillMaxWidth, padding} from '@expo/ui/jetpack-compose/modifiers'
import {useRouter} from 'expo-router'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {chartSections} from '../charts/chart-catalog'
import {AppHeader} from '../components/app-header'
import {space} from '../theme/tokens'
import {useTheme} from '../theme/use-theme'

export const ChartGallery = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {color, scheme} = useTheme()

  return (
    <View style={[styles.screen, {backgroundColor: color.surface.base, paddingTop: Math.max(insets.top, space.lg)}]}>
      <AppHeader style={styles.header} title="Charts" />
      <Host colorScheme={scheme} style={[styles.host, {backgroundColor: color.surface.base}]}>
        <LazyColumn>
          {chartSections.flatMap(section => [
            <Text
              color={color.content.tertiary}
              key={`${section.title}-header`}
              modifiers={[padding(16, 24, 16, 8)]}
              style={{typography: 'labelLarge'}}
            >
              {section.title}
            </Text>,
            ...section.data.map(item => (
              <ListItem
                colors={{
                  containerColor: color.surface.base,
                  contentColor: color.content.primary,
                  supportingContentColor: color.content.secondary,
                }}
                key={item.id}
                modifiers={[fillMaxWidth(), clickable(() => router.push(item.route ?? `/charts/${item.id}`))]}
              >
                <ListItem.HeadlineContent>
                  <Text>{item.label}</Text>
                </ListItem.HeadlineContent>
                <ListItem.SupportingContent>
                  <Text>{item.layer}</Text>
                </ListItem.SupportingContent>
              </ListItem>
            )),
          ])}
        </LazyColumn>
      </Host>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {paddingBottom: space.sm, paddingHorizontal: space.lg},
  host: {flex: 1},
  screen: {flex: 1},
})
