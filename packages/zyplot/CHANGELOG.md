# @hzblj/zyplot

## 0.2.0

### Minor Changes

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Give an annotation label a chip and a side that keeps it readable. `labelBackground` paints
  a rounded fill behind the label, so a rule's value stays legible where the marks run
  through it, and `labelPosition: 'auto'` picks the side from where the rule sits: above it
  in the lower half of the plot, below it higher up. Fixed sides still win when named, so
  nothing changes for annotations that already pass `'top'` or `'bottom'`.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Let a rule annotation set its own thickness. `width` joins `dash` and `color` on
  `ChartLineAnnotation`, honoured on iOS, Android and the web — the line width was pinned at 1
  in the native drawing code, so a reference line could be dashed and coloured but never made
  heavier or lighter than the hairline it started as.

  Android drew both the width and the dash lengths in pixels while they are given in dp, which
  on a 3× screen made a dashed rule a third of its asked-for thickness with a third of its
  asked-for dash; both are scaled now.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Put your own component where an annotation lands, with `annotationViews`.

  The chart already reported where every annotation ended up, and an app that wanted a logo
  at the live reading or its own head on a rule had to take it from there: hold the geometry
  in state, absolutely position a view over the plot, keep the two in step. That work was the
  same every time, so it lives in the chart now. Key a node by the annotation's `id` and it is
  centred on the spot, moves with the data, and the mark the chart would have drawn there is
  left out — one prop instead of an overlay of your own.

  ```tsx
  <Chart.Line
    annotations={[
      annotation.point({ id: "live", x: live.category, y: live.value }),
    ]}
    annotationViews={{ live: <LivePrice value={live.value} /> }}
    categories={categories}
    series={series}
  />
  ```

  The annotations you leave out keep the dot, glow and pulse the renderers draw, on all three
  platforms, and nothing about the built-in marks has changed. An annotation can also be an
  anchor and nothing else: `hidden: true` keeps it measured and reported in `geometry` while
  drawing none of it, which is what a view of your own placed by hand — a card following the
  finger, say — wants underneath it.

  Charts that draw annotations but had no pointer layer to measure them (`Chart.Area`,
  `Chart.Bar`, `Chart.StackedBar` on the web) now report `geometry` on the `'layout'` phase
  like the rest, so the views land there too.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Report where the plot and its annotations ended up, so an app can draw its own overlays
  instead of the ones the chart bakes in. Native charts now emit a `'layout'` phase carrying
  `geometry` — the plot's box and every annotation's position, in the chart view's own
  coordinate space — and `useChartScrub` returns it as `geometry` alongside the selection,
  which also carries the pointer's `nativeX`/`nativeY` now.

  That is enough to place any React component over the chart: your own badge on an event
  annotation instead of the built-in glyph-in-a-circle, your own card at the reading under
  the finger, a logo, a button, whatever the design asks for. Leave `badge` off the
  annotation and the chart draws only the rule, leaving the head to you.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Let every entry point hand over the whole contract, not most of it.

  `@hzblj/zyplot/ios` and `@hzblj/zyplot/android` re-exported the shared types and `Chart`, and
  then stopped: the builders and `useLastReading` are values, and `export type *` does not carry a
  value. So the import the documentation shows for a platform file — `import {annotation, Chart}
from '@hzblj/zyplot/ios'` — resolved at the type level and came back `undefined` at runtime. Both
  entries now export the fifteen builders and `useLastReading` alongside `useChartScrub`, so a
  `*.ios.tsx` file needs one import rather than two.

  `@hzblj/zyplot/web` re-exported a hand-kept subset of the shared types, and several a web chart
  actually needs were missing from it: `ChartCandlestickDatum` and `ChartCandlestickStyle`, which
  `Chart.Candlestick` takes; `ChartRangeAnnotation` and `ChartTextAnnotation`, two of the four
  members of the union `annotations` is; `StyledChartSeries`, what the `series` builder returns;
  and the small unions the documented shapes are written in terms of — `ChartSymbol`,
  `ChartAxisScale`, `ChartCoordinate`, `ChartSurfacePadding` and the rest. Typing a candle array
  or a helper that returns a range annotation meant importing from `@hzblj/zyplot-core` directly.
  They are all re-exported now.

  `Chart.TimeSeries` was also the one web form whose list prop stayed mutable: its `series` is
  `readonly Omit<ChartSeries, 'values'>[]` now, like every other list the web charts take.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Two knobs for reading a candlestick chart. `interaction.highlightBlend` says how far the
  read mark is lifted towards `interaction.highlightColor`, so at 0.5 a red candle lights up
  red instead of turning white — a flat replacement threw the series colour away, which is the
  one thing a candle's colour is for. `style.candleRadius` rounds the candle body, and rounds
  the wick's caps with it so the wick does not read as a cut-off stub against a rounded body.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Let the mark under the pointer light up. `interaction.highlightColor` draws the read mark in
  its own colour, so a scrub reads as one candle lit rather than as every other candle merely
  dimmed — dimming alone leaves the read one in its resting colour, which is hard to pick out
  against a plot that has only lost a little contrast. Implemented for candlesticks on both
  platforms, alongside the `dimOpacity` fix that made the rest fade at all.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Draw with the theme's font on iOS and Android, and read the last three theme
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

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Give each theme shape a name of its own. `@hzblj/zyplot/web` exported two
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

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Give the pulse on a live point a rhythm, and hand it over. `pulse` on a point annotation
  now takes a `ChartPulse` — `color`, `duration`, `interval`, `opacity`, `scale` — as well as
  the `true` it took before, and `true` now means one bloom of 450 ms followed by a rest of
  1550 ms, at 2.2× the point's resting ring.

  That replaces a single 1.8 s expansion that faded to nothing with no rest between cycles:
  the ring spent almost the whole cycle nearly transparent, which read as no animation at
  all. The ring's colour is settable too, and falls back to the glow's colour and then to the
  point's own — on iOS a pulse with no glow used to inherit the glow's `.clear` and draw
  nothing at all.

  Android had no pulse to speak of — the parameter was threaded through the drawing code
  but nothing ever animated it — and now draws the same bloom off the same clock.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Make the data shapes one contract across web and native. The web entry point had
  its own copies of `ChartSeries`, `ChartDatum`, `ChartTimePoints` and the other
  per-form inputs, identical to the ones in `@hzblj/zyplot-core` except that their
  arrays were mutable. It now re-exports the core types, so a value typed once can be
  handed to a web chart and a native one.

  Every web chart prop that takes a list — `series`, `categories`, `data`, `nodes`,
  `cells`, `groups`, `rows`, `values` — now accepts a `readonly` array, as the native
  props and web's own `Chart.Candlestick` already did. Passing an `as const` array or
  the result of a `readonly`-returning selector no longer needs a cast.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Let the entrance name its own curve. `reveal.draw` and `reveal.fade` take an `easing` —
  `'ease-in' | 'ease-in-out' | 'ease-out' | 'linear'` — and `reveal.draw` also takes a
  `flashEasing` for the glow's decay. Both were hard-coded before: a trace always ran at a
  steady speed, a fade always eased out, and the flash always shed most of its bloom in the
  first frames after landing, which reads as the glow leaving while the trace is still
  arriving. `flashEasing: 'ease-in-out'` keeps the bloom up a moment longer so it leaves in
  one piece.

  A spring is deliberately absent from `ChartRevealEasing`: an entrance that overshoots
  would trace past the last data point and come back.

  Defaults are unchanged — `'linear'` for a trace, `'ease-out'` for a fade and for the
  flash — so existing charts animate exactly as before.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Make the web renderer read a pointer the way the native ones read a finger, so a screen
  built on a scrub is one screen on all three platforms rather than two.

  `useChartScrub` is now exported from the web entry point as well. The scrub lifetime is no
  longer native's alone: `ChartInteractionEvent` carries `phase`, `index` and `geometry` on
  every platform, and `Chart.Line` and `Chart.Candlestick` report them from the pointer —
  `'began'` when it enters the plot, `'changed'` as it moves, `'ended'` when it leaves, and
  `'layout'` with the plot's box and every annotation's position once the chart has measured
  itself. `NativeChartInteractionEvent` stays as a name for the same shape.

  The web props also take the fuller presentation vocabulary they were previously typed out
  of, and the renderer honours it:

  - `interaction.marker` lights the mark being read — a stretch of the line for
    `marker.segment`, a bloom behind the candle for a mark that has its own body — with
    `crosshairStyle`, `dimOpacity`, `highlightColor` and `highlightBlend` around it.
  - `animation.reveal` traces a line open: `trackColor` lays the shape down first, and
    `flashColor` with its glow, hold and decay lands with the frontier and then leaves.
  - `annotations` draw their `glow`, `halo`, `pulse`, `badge`, `label`, `labelBackground`,
    `labelPosition` and `scrubOpacity`.
  - `axis.overlay` puts the tick labels inside the plot at `labelInset`, `tickValues` pins
    them to exact readings, and `plotDimensionStartPadding`/`plotDimensionEndPadding` keep the
    marks clear of them.
  - `seriesStyles[id].glow` blooms behind a stroke, and `style.candleWidth`/`style.wickWidth`
    size a candle. `style.candleRadius` is the one prop the web cannot honour: ECharts draws a
    candle as a single path with no corner radius to give.
  - Every chart takes a `theme` of its own, merged over `Chart.Provider`'s, so a preset that
    carries colours can be handed to a web chart and a native one alike.

### Patch Changes

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Give Android candlesticks the entrance they already had on iOS. A traced reveal pins the
  growth factor at 1 — the trace is meant to come from the reveal's own fraction — but the
  candlestick drawing never received it, so `reveal.draw` drew every candle at once while iOS
  brought them in left to right. Candles now land one slot at a time off the same fraction,
  with the slot width keyed to the full count so nothing re-spaces as they arrive.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Draw Android charts at the size they were asked for. Every absolute number a chart takes —
  plot padding, axis gutters, stroke and wick widths, annotation dot and halo sizes, glow radii,
  badge and label geometry, marker sizes — is authored in dp, but the Compose canvas measures
  in pixels and the drawing code used the two interchangeably. On a 3× phone that made all of
  it a third of its intended size: a 6 dp live dot drew at 2 dp, a 42 dp glow barely left the
  stroke, and the axis gutter was too narrow to keep labels off the trace. Pointer hit-testing
  had the same mismatch, since the plot box was measured in dp and compared against a pixel
  pointer.

  The geometry an app lays its own views out with is now reported in dp, matching iOS's points,
  so an overlay positioned from `useChartScrub`'s `geometry` and `nativeX` lands where the
  chart drew rather than a screen away.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Let an annotation badge cap its rule instead of sitting on it. The badge was placed a
  default annotation gap below the plot edge, so a stub of the rule stuck out above it and
  the dashes ran straight through the circle — the glyph read as floating in the plot rather
  than as the rule's head. It now sits flush with the plot edge, and the rule starts below
  it: on Android the rule is drawn from under the badge, and on iOS the badge paints the
  chart's plot (or theme) background behind itself to mask the part it covers. Charts with a
  transparent plot background keep the previous translucent badge, since there is nothing to
  mask with.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Honour `interaction.dimOpacity` on a candlestick chart. It faded the marks on every other
  form but did nothing here, so reading a candle left the rest of the series at full strength
  and the read one hard to pick out. Candles either side of the selection now fade back the
  same way series marks do.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Stop painting canvas text in the browser's serif when the page declares no font.

  A web chart reads the font in effect where it sits and hands it to the canvas,
  which is what makes it match the type around it. When nothing up the tree declares
  a font, though, that read answers with the user agent's default — a serif — and the
  chart drew its axis labels in Times beside text that was not.

  React Native Web is where this shows: its reset puts no `font-family` on `html` or
  `body` and gives each `<Text>` the system stack through a class of its own, so an
  Expo web app has nothing for a chart to inherit however deeply it looks. Every
  chart in one rendered its numbers in Times.

  The inherited font is now compared against what the browser resolves with no author
  styles in play, and falls back to `system-ui` and the platform stack behind it when
  the two match. A page that does set a font is untouched: inheritance still wins, and
  `--zyplot-font-family` and `theme.typography.fontFamily` still override both.

- [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba) - Things the renderers drew that they were never asked to.

  The web entry point imported a stylesheet that only gathers two others with `@import`, and
  not every bundler follows those in development — Metro leaves them out, so a chart came up
  with no styles at all. That loses the layer its placeholder and its plot share: the two
  stack up instead, and everything an app positions over the plot is measured from a canvas
  that starts a placeholder's height too low. It now imports the built stylesheets themselves.

  `Chart.Line` put a symbol on every reading. Its own documentation said symbols appear on
  hover, and the native renderers draw none — a dot per datum is a mark the reader did not ask
  for. Set `seriesStyles[id].symbol` and they come back.

  A `range` or `text` annotation drew nothing at all, because the components that render them
  were never registered with ECharts. They are now. A reference line's label showed the value
  it sits on rather than the `label` given to it, which dropped a trailing zero from a price;
  and with an `'overlay'` axis it printed that number a second time, on top of the axis' own —
  `labelPosition: 'auto'` now keeps it at the rule's leading end, away from them.

  Scrubbing a candlestick chart left every candle the pointer had passed still lit, because
  ECharts' `highlight` adds to a set rather than replacing it. The bloom behind the read mark
  was a flat fill with a shadow around it, which reads as a box sitting behind the candle
  however soft its edges are; it is a radial gradient now, which has no edge to read.

  A traced entrance ran behind the placeholder, so the plot cross-faded in with the trace
  already part-drawn — or already finished, depending on which won the race. The marks now
  wait for the placeholder to go. Its flash was also rebuilt at full strength whenever the
  data changed, and nothing was left to put it out: a chart that had already made its
  entrance kept the glow for good.

  On Android an overlaid axis reserved a gutter for its labels _and_ kept
  `plotDimensionEndPadding` clear of them, so the marks stopped a label's width further from
  the edge than on iOS. An overlaid axis reserves no gutter — that is what overlaying means.

- Updated dependencies [[`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba), [`54b15f6`](https://github.com/hzblj/zyplot/commit/54b15f6eba0dd38b7539fc5be1fdf3fcc90f31ba)]:
  - @hzblj/zyplot-core@0.2.0

## 0.1.1

### Patch Changes

- [`ab6e55e`](https://github.com/hzblj/zyplot/commit/ab6e55e15bcd9bb54e12fedd4981444b13d9e524) - Add `repository` metadata and a bundled LICENSE file to both published
  packages. npm verifies a provenance-signed publish against `repository.url`,
  so the missing field left `@hzblj/zyplot-core` unpublishable.
- Updated dependencies [[`ab6e55e`](https://github.com/hzblj/zyplot/commit/ab6e55e15bcd9bb54e12fedd4981444b13d9e524)]:
  - @hzblj/zyplot-core@0.1.1

## 0.1.0

### Minor Changes

- [`51e9ae3`](https://github.com/hzblj/zyplot/commit/51e9ae386cffc75c5d33ab8674905fa5c77c5044) - First public release.

  Cross-platform React charting behind one package and one shared TypeScript
  contract: ECharts and uPlot on web, Swift Charts on iOS, and Jetpack Compose on
  Android, with both native renderers reached through a single Expo Module named
  `Zyplot`.

### Patch Changes

- Updated dependencies [[`51e9ae3`](https://github.com/hzblj/zyplot/commit/51e9ae386cffc75c5d33ab8674905fa5c77c5044)]:
  - @hzblj/zyplot-core@0.1.0
