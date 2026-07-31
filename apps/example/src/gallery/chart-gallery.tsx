import {Link} from 'expo-router'
import {useState} from 'react'
import {Pressable, SectionList, StyleSheet, Text, View} from 'react-native'
import {type ChartCatalogItem, chartSections} from '../charts/chart-catalog'
import {AppHeader} from '../components/app-header'
import {
  borderWidth,
  contentWidth,
  hoverTransition,
  iconSize,
  radius,
  space,
  text,
  tracking,
  weight,
} from '../theme/tokens'
import {useTheme} from '../theme/use-theme'

// `asChild` renders the row through a Radix slot that merges styles by spreading them, so a style
// function or array on the child flattens away to nothing. Each row tracks its own interaction
// state and hands the Pressable one flat object instead.
const GalleryRow = ({item}: {item: ChartCatalogItem}) => {
  const {color} = useTheme()
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = hovered || pressed

  return (
    <Link asChild href={item.route ?? `/charts/${item.id}`}>
      <Pressable
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={StyleSheet.flatten([
          styles.row,
          hoverTransition,
          {
            backgroundColor: pressed
              ? color.fill.secondaryPressed
              : hovered
                ? color.fill.tertiary
                : color.surface.primary,
            borderColor: focused ? color.border.focus : active ? color.border.primary : color.border.secondary,
          },
        ])}
      >
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, {color: color.content.primary}]}>{item.label}</Text>
          <Text style={[styles.rowMeta, {color: color.content.secondary}]}>{item.layer}</Text>
        </View>
        <Text
          style={[
            styles.chevron,
            hoverTransition,
            {
              color: active ? color.content.tertiary : color.content.quaternary,
              transform: [{translateX: active ? 3 : 0}],
            },
          ]}
        >
          ›
        </Text>
      </Pressable>
    </Link>
  )
}

export const ChartGallery = () => {
  const {color} = useTheme()

  return (
    <View style={[styles.screen, {backgroundColor: color.surface.base}]}>
      <AppHeader style={styles.header} title="Charts" />
      <SectionList
        contentContainerStyle={styles.content}
        keyExtractor={item => item.id}
        renderItem={({item}) => <GalleryRow item={item} />}
        renderSectionHeader={({section}) => (
          <Text style={[styles.section, {backgroundColor: color.surface.base, color: color.content.tertiary}]}>
            {section.title}
          </Text>
        )}
        sections={chartSections}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  chevron: {fontSize: iconSize.xl, fontWeight: weight.regular, lineHeight: iconSize.xl},
  content: {
    alignSelf: 'center',
    maxWidth: contentWidth,
    paddingBottom: space['4xl'],
    paddingHorizontal: space.xl,
    width: '100%',
  },
  header: {
    alignSelf: 'center',
    maxWidth: contentWidth,
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    width: '100%',
  },
  row: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    flexDirection: 'row',
    gap: space.lg,
    justifyContent: 'space-between',
    marginBottom: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
  },
  rowMeta: text.footnote,
  rowText: {flexShrink: 1, gap: space.xs},
  rowTitle: {...text.body, fontWeight: weight.semibold},
  screen: {flex: 1},
  section: {
    ...text.caption,
    fontWeight: weight.semibold,
    letterSpacing: tracking.wide,
    paddingBottom: space.sm,
    paddingTop: space['2xl'],
    textTransform: 'uppercase',
  },
})
