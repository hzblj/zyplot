import {Link} from 'expo-router'
import {Pressable, SectionList, StyleSheet, Text, View} from 'react-native'
import {chartSections} from '../charts/chart-catalog'
import {borderWidth, contentWidth, iconSize, radius, space, text, tracking, weight} from '../theme/tokens'
import {useTheme} from '../theme/use-theme'

export const ChartGallery = () => {
  const {color} = useTheme()

  return (
    <SectionList
      contentContainerStyle={styles.content}
      // The list fills the window; the rows inside it stop at a column, the way the header
      // above them does. A row stretched across a desktop window is a table, not a list.
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Link asChild href={item.route ?? `/charts/${item.id}`}>
          <Pressable
            style={({pressed}) => [
              styles.row,
              {
                backgroundColor: pressed ? color.fill.secondaryPressed : color.surface.primary,
                borderColor: color.border.secondary,
              },
            ]}
          >
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, {color: color.content.primary}]}>{item.label}</Text>
              <Text style={[styles.rowMeta, {color: color.content.secondary}]}>{item.layer}</Text>
            </View>
            <Text style={[styles.chevron, {color: color.content.quaternary}]}>›</Text>
          </Pressable>
        </Link>
      )}
      renderSectionHeader={({section}) => (
        <Text style={[styles.section, {color: color.content.tertiary}]}>{section.title}</Text>
      )}
      sections={chartSections}
      style={{backgroundColor: color.surface.base}}
    />
  )
}

const styles = StyleSheet.create({
  chevron: {fontSize: iconSize.xl, fontWeight: weight.regular},
  content: {
    alignSelf: 'center',
    maxWidth: contentWidth,
    paddingBottom: space['4xl'],
    paddingHorizontal: space.xl,
    width: '100%',
  },
  row: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
  },
  rowMeta: text.footnote,
  rowText: {gap: space.xs},
  rowTitle: {...text.body, fontWeight: weight.semibold},
  section: {
    ...text.caption,
    fontWeight: weight.semibold,
    letterSpacing: tracking.wide,
    paddingBottom: space.sm,
    paddingTop: space['2xl'],
    textTransform: 'uppercase',
  },
})
