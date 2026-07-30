import {Host, LazyColumn, ListItem, Text} from '@expo/ui/jetpack-compose'
import {clickable, fillMaxWidth, padding} from '@expo/ui/jetpack-compose/modifiers'
import {useRouter} from 'expo-router'
import {StyleSheet} from 'react-native'
import {chartSections} from '../charts/chart-catalog'
import {useTheme} from '../theme/use-theme'

export const ChartGallery = () => {
  const router = useRouter()
  const {color, scheme} = useTheme()

  return (
    // `colorScheme` is what the Compose theme inside the host reads; the style paints the
    // view the host sits in, which is the page behind the list.
    <Host colorScheme={scheme} style={[styles.host, {backgroundColor: color.surface.base}]}>
      <LazyColumn>
        {chartSections.flatMap(section => [
          // A section header is a bare child of the column, so it inherits no content colour
          // from a list item or a surface and would otherwise draw in Compose's default ink.
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
  )
}

const styles = StyleSheet.create({
  host: {flex: 1},
})
