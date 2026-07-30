---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Give each theme shape a name of its own. `@hzblj/zyplot/web` exported two
incompatible types called `ChartTheme` — the wide palette `Chart.Provider` takes,
and the narrower one a chart's own `theme` prop takes — and the explicit export
won, so a value annotated `ChartTheme` was not assignable to the prop of the same
name.

There are now three, and the two wider ones are supersets of the portable one, so
a single object can be passed to any of the three props:

- `ChartTheme` is the portable subset: `axis`, `categorical`, `grid`, `label`,
  `negative`, `positive`, `surface`, `track`, and `typography`. Every key on it is
  one all four renderers draw with. Its colours are `ChartThemeColors`, exported
  for building a theme up in parts.
- `NativeChartTheme` adds `colors.background`, the chart's own fill, which only a
  native surface paints. `background` has moved here off `ChartTheme`: the web
  renderer never drew it, and the box a web chart sits on is `surface.background`.
- `ChartProviderTheme` adds `border`, `diverging`, `muted` and `sequential` — the
  palettes and greys that only a CSS variable can carry — and is what the web
  `Chart.Provider` takes.

`Chart.Provider` also reads the flat `negative` and `positive` now, as the
shorthand for `diverging.negative` and `diverging.positive`. Passing the
five-key `diverging` object still wins over them, so setting both is not
ambiguous.
