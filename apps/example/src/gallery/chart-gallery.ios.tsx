import {Button, Host, HStack, Image, List, Section, Spacer, Text, VStack} from '@expo/ui/swift-ui'
import {buttonStyle, contentShape, font, foregroundStyle, listStyle, shapes} from '@expo/ui/swift-ui/modifiers'
import {useRouter} from 'expo-router'
import {StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {chartSections} from '../charts/chart-catalog'
import {AppHeader} from '../components/app-header'
import {space} from '../theme/tokens'

export const ChartGallery = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={[styles.screen, {paddingTop: Math.max(insets.top, space.lg)}]}>
      <AppHeader style={styles.header} title="Charts" />
      <Host style={styles.host}>
        <List modifiers={[listStyle('insetGrouped')]}>
          {chartSections.map(section => (
            <Section key={section.title} title={section.title}>
              {section.data.map(item => (
                <Button
                  key={item.id}
                  modifiers={[buttonStyle('plain')]}
                  onPress={() => router.push(item.route ?? `/charts/${item.id}`)}
                >
                  <HStack modifiers={[contentShape(shapes.rectangle())]} spacing={12}>
                    <VStack alignment="leading" spacing={2}>
                      <Text>{item.label}</Text>
                      <Text
                        modifiers={[
                          font({size: 13}),
                          foregroundStyle({
                            style: 'secondary',
                            type: 'hierarchical',
                          }),
                        ]}
                      >
                        {item.layer}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Image
                      modifiers={[
                        font({size: 13, weight: 'semibold'}),
                        foregroundStyle({
                          style: 'tertiary',
                          type: 'hierarchical',
                        }),
                      ]}
                      systemName="chevron.right"
                    />
                  </HStack>
                </Button>
              ))}
            </Section>
          ))}
        </List>
      </Host>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {paddingBottom: space.sm, paddingHorizontal: space.xl},
  host: {flex: 1},
  screen: {flex: 1},
})
