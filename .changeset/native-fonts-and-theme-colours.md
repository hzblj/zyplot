---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Draw with the theme's font on iOS and Android, and read the last three theme
colours everywhere.

`theme.typography.fontFamily` reached only the web renderer before: the native
ones decoded `colors` and dropped `typography` on the floor, so a chart beside a
`<Text>` in the app's own font drew its axis labels in the system one. Both now
resolve the family the way their platform resolves text — iOS through the
registered-font lookup behind `UIFont(name:)`, Android through React Native's
`ReactFontManager`, which covers `assets/fonts`, `res/font` and anything
`expo-font` registered at runtime. A family the app never shipped falls back to
the platform font, exactly as a canvas does on the web. It reaches every string
either renderer draws: axis labels and titles, tick labels, annotation labels and
badges, rule labels, the tooltip and the gauge reading.

Three colours were also being decoded and then ignored:

- `axis` now colours the tick marks on both platforms. Android drew no ticks at
  all until now, so its `ticks` axis option had nothing to switch off; it draws
  them beside every label the x and y axes place, an overlaid y axis excepted —
  it reserves no gutter for one to sit in.
- `surface` now fills the tooltip card. It replaces the hardcoded near-black on
  Android and the system material on iOS, which is still what a chart with no
  `surface` in its theme gets.
- `background` now paints the plot on Android when no `plot.backgroundColor`
  overrides it, the order iOS already resolved in.
