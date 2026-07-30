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
  )
}

const styles = StyleSheet.create({
  host: {flex: 1},
})
