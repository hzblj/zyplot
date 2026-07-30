import {Button, Host, HStack, Image, List, Section, Spacer, Text, VStack} from '@expo/ui/swift-ui'
import {buttonStyle, contentShape, font, foregroundStyle, listStyle, shapes} from '@expo/ui/swift-ui/modifiers'
import {useRouter} from 'expo-router'
import {StyleSheet} from 'react-native'
import {chartSections} from '../charts/chart-catalog'

export const ChartGallery = () => {
  const router = useRouter()

  return (
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
  )
}

const styles = StyleSheet.create({
  host: {flex: 1},
})
