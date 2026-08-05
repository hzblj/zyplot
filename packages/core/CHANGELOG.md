# @hzblj/zyplot-core

## 0.5.0

### Minor Changes

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - Give measuring a mark its own name, instead of a point annotation dressed down to nothing.

  Lining a view of your own up with the data — a grid, a row of labels, a box around a stretch —
  already worked: an annotation with `hidden` lands where its data lands and reports back through
  `geometry`, on all three renderers. But asking for one meant writing `annotation.point({color,
hidden: true, id, size: 0, x, y})` and hoping the reader saw the intent through the colour and the
  zero.

  `annotation.measure({id, x, y})` is that, spelled as what it is. Nothing else about it is
  adjustable, because a measurement has no appearance to set.

  The docs now also say why you would reach for it over `geometry.plot`: the plot rect is the box
  around the marks, and each renderer puts the axis padding on its own side of that box, so a grid
  placed off `plot` alone is a few points out on one of the three. A measured mark is exact
  everywhere.

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - An interaction says what is being read, and never where the finger is.

  `ChartScrubSelection` loses `nativeX` and `nativeY`, `ChartInteractionRange` loses `startX` and
  `endX`, and the interaction event loses the pair with them. Nothing reports where a reading is any
  more.

  The reason is the thing they were used for. A reading moves many times a mark, and a position that
  crossed out to be laid out again could only ever land a render after the crosshair it belongs beside —
  so a card following a finger trailed it, and trailed it further the more the screen had to re-render
  to move it. Every one of them is a `tooltip` or a `rangeView` instead: the chart mounts the node and
  moves it in the same pass it draws the reading in, which is what those slots were added for.

  `geometry` stays, and stays the way down for a view that is laid against the plot rather than against
  a finger — a grid behind the marks, a row of labels under them, a button on a rule. It is a layout
  report: it arrives when the chart measures itself and moves when the chart does.

  Two things follow from taking the position out:

  - A scrub within one mark now changes nothing. `useChartScrub` compared the position as well as the
    index, so a finger travelling across a single mark produced a new selection on every touch the
    platform reported, and every screen reading it re-rendered for a reading that had not changed.
  - On the web, a form with no scrub layer reports no position on a hover or a click either. It never
    reported a mark for one to belong to, so a view placed from it had somewhere to sit and nothing to
    say.

  To migrate, name the view instead of positioning it: `tooltip.above({view})` for a chip over the
  rule, `tooltip.beside({view})` for a card at the reading, `rangeView` for one over a two-finger span.
  What each shows is read from your own context rather than passed in, so a reading changes what a view
  says without changing a prop on the chart — which is the other half of why this is faster.

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - Let a slot be a component, and put it where the thing it stands in for is.

  `ChartSlotView` is `ReactNode | ComponentType`: every slot — the reading's view, the span's, an
  annotation's — takes a component as well as an element, and a component is rendered with no props of
  its own. That is what puts the app's own views in a `zyplot` config. An element is a new value on
  every render, so a config holding one is rebuilt on every render with it; a component reference is the
  same value for the life of the module, so the config is too. What the view shows comes from its own
  hooks rather than from a prop threaded through the chart, which means a reading changes the chip and
  nothing else: the chart's props are untouched, `memo` holds, and on iOS and Android the dataset is not
  serialised again for a finger that moved.

  Both slots now sit with what they belong to rather than beside it. `tooltipAnchor` and `tooltipView`
  are one `tooltip` prop, built with `tooltip.above({lift, view})` or `tooltip.beside({gap, view})` —
  one thing to pass, and the placement still decides which fields exist. An annotation's view is written
  as `view` on the annotation itself, and `zyplot` lifts it into `annotationViews` keyed by that
  annotation's `id`, the way it already lifts a series' `style` into `seriesStyles`: a record whose keys
  repeat an id declared elsewhere is now built rather than written.

  The example app is the reference for both. Its reading chips and its quote card are components named
  in a config, each subscribing to a context the screen provides, and the Revolut event badge rides on
  the annotation it marks.

  One name for the reading, and one place to set it. `interaction.tooltip` is gone: `tooltip` is the
  whole answer — left out or `true` the chart writes its own card, `false` draws nothing, and a
  `tooltip.above({view})` hands over yours. So there is no longer a boolean two levels down that a
  view has to agree with, and `interaction.scrub()` no longer reaches out of its own group to switch a
  card off — a chart that wants none says `tooltip: false` where it says everything else. The bridge is
  untouched: what crosses it is still `interaction.tooltip` and `tooltipAnchor`, resolved from the one
  prop on the way out.

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - Say where a view of yours sits in the box the chart lays it in, instead of taking the one place the
  chart picked.

  `ChartViewAlign` is `'top' | 'center' | 'bottom'`, and two places read it.

  An `annotationViews` entry can now be `{align, view}` as well as the view itself. What the three mean
  follows from how the mark runs: a rule down the plot is a mark with a height of its own, so they are
  its head, its middle and its foot — and its head is still what a view gets unasked, because that is
  where the chart's own badge goes. A point and a rule across the plot are spots rather than runs, so
  they read as on the mark, above it and below it, and `'center'` is what those get unasked.

  ```tsx
  annotationViews={{
    earnings: {align: 'center', view: EarningsChip},
    live: {align: 'top', view: LiveBadge},
  }}
  ```

  `tooltip.beside` takes the same word for the card it places. That card sat against the plot's top edge
  whatever it was, which is right for one read as belonging to the reading and wrong for one big enough
  to want the middle of the plot:

  ```tsx
  tooltip.beside({ align: "center", view: ReadingCard });
  ```

  `tooltip.above` does not take it: a chip placed above is already lifted clear of the plot, so it has no
  room to be placed down, and the builder rejects the field rather than ignoring it.

  Nothing moves that did not ask to — every default is what the place did before. One exception, and it
  is a fix: a view on a rule down the plot straddled the plot's top edge on the web, with half of it
  above the chart, where iOS and Android sat it below the edge. All three now do what the two did.

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - Put your own views inside the chart, and let the chart place them.

  `tooltip` takes your own view and mounts it in the plot, moving it with the reading itself.
  `tooltip.beside({view})` sets it next to the finger and flips it at the plot's edge, which is what a
  card of rows wants; `tooltip.above({view})` centres it on the reading and lifts it clear of the plot,
  which is where the rule's own chip goes. An annotation's `view` mounts the same way, so a badge on an
  annotation is placed by the chart rather than by a render.

  A rule's view is laid along the rule rather than centred on a point: a `line` annotation's spot is
  where it starts, so a view for one runs from the plot's edge and is centred only across the rule.
  Centring it would hang half of it outside the plot, which is what a `point`'s view wants and a
  rule's never does. Size it from `geometry.plot`, which arrives on layout rather than on every step
  of the finger.

  What the chart gives up for a view depends on what the view can stand in for. A point _is_ its mark,
  so one with a view is not drawn at all. A rule is not: the view caps it the way the chart's own badge
  would, so the rule stays and the badge and label it would have worn come off — hiding the rule as
  well would take the line out from under the head the app just put on it.

  The point is what it costs, which is nothing. A view placed from a scrub handler crosses into
  JavaScript and back before it moves, so on a fast drag it lands well behind the crosshair it belongs
  to. These are moved where the crosshair is moved — in the chart's own layout pass, on iOS and
  Android — so JavaScript never sees the position at all. What is inside the view is still yours to
  render from `useChartScrub`, and that part arrives when React gets to it.

  `rangeView` does the same for the span under two fingers, centred on it and lifted clear of the
  plot. The chart writes nothing for a span of its own, so that one adds rather than replaces.

  The chart drops whatever the view stands in for: one placed `'above'` replaces the rule's label, one
  beside the reading replaces the card. Nothing else the app asked for changes.

  `crosshairStyle` loses `labelBackground`, `labelColor`, `labelLift`, `labelPadding`, `labelRadius`
  and `labelSize`. The label is the theme's own label colour at the size the axes use, and anything
  past that is a view now — describing a pill twice was the thing worth removing.

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - Discriminate the interaction event by its phase, so the field a phase is about stops being optional.

  `ChartInteractionEvent` was thirteen optional fields, `phase` included, which left every reader
  checking for something the chart had always sent: a `'layout'` event has a `geometry`, a reading
  has an `index`, a two-finger one has a `range`. Now testing the phase narrows to the variant that
  carries it, and the rest of the fields stay readable without narrowing, since a form fills in what
  it can. The one path with no phase — a click or a hover on a form with no scrub layer — is a
  variant of its own rather than a gap in the middle of the others.

  Nothing changes at runtime; the events are the ones the renderers were already sending.

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - Give the reading under a finger a preset, and the handler a name to be held in.

  `interaction.scrub()` returns the shape a scrub almost always takes — an x crosshair, haptics,
  the nearest mark rather than the axis slice, and no built-in tooltip — with anything you pass
  winning over it. Every chart in the examples had been writing those four out by hand, which is
  four chances to leave one off and no signal when you do.

  `ChartInteractionHandler` names what `onInteraction` takes, so an app declaring its own handler
  no longer reaches for `Parameters<typeof Chart.Line>[0]['onInteraction']` to spell it.

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - Describe a whole chart as one object.

  `zyplot(z => ({…}))` calls the builder with every factory the package exports as `z` and returns the
  props a chart takes, so its data, its axes, its arrival and the styling of each series are one
  expression behind one import rather than a page of props assembled from six of them. That is what
  makes a sample liftable: the object is the chart, so it copies into an app whole. It is on all four
  entry points, and `ZyplotFactories` and `ZyplotChartProps` name what goes in and what comes out.

  The `style` declared on a series is split into `seriesStyles` on the way out, so `zyplot` is
  `seriesProps` as well — the id is written once, and an explicit `seriesStyles` entry still wins over
  the `style` on the series it names. Nothing has to be in the object: one that leaves the data out is
  a preset, and the props it is spread under fill in the rest.

  Naming the form checks the config where it is written rather than where it is spread:
  `zyplot<LineChartProps>(…)` for a whole chart, `zyplot<Partial<LineChartProps>>(…)` for a preset that
  expects its data at the call site.

  Every chart in the example app is built this way now, the five design studies included, so each one
  is a config to read and the JSX beside it is a spread. Only the app's own nodes — the tooltip view,
  the annotation views — are still passed as props, since a React element is new on every render and
  folding one into the config would rebuild the dataset with it.

- [`10d8276`](https://github.com/hzblj/zyplot/commit/10d8276e288fd6d3e5057d426eaf1144d3bc3aef) - Take out the options no renderer ever drew, rather than keep promising them.

  `interaction.pan` was decoded on both native platforms and read by neither, and the docs said so
  in as many words. `ChartPointAnnotation.symbol` typechecked everywhere and changed nothing
  anywhere — the web draws a fixed dot and neither native side has the field at all.
  `xAxis.scrollPosition` was advertised as an iOS extra, and the scrollable-axis modifier only ever
  read `visibleDomain` beside it. An option that compiles and does nothing is worse than one that
  is missing: it reads as a setting that did not take.

  Gone with them are the names nothing referenced — `NATIVE_CHART_KINDS`, `NativeChartKind`,
  `NativeChartPropsByKind`, `NativeChartConfiguration`, `ChartExtensionKindIos` and
  `ChartExtensionKindAndroid`. `ChartSeriesStyle.symbol` stays; that one is drawn.

## 0.4.0

## 0.3.0

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

## 0.1.1

### Patch Changes

- [`ab6e55e`](https://github.com/hzblj/zyplot/commit/ab6e55e15bcd9bb54e12fedd4981444b13d9e524) - Add `repository` metadata and a bundled LICENSE file to both published
  packages. npm verifies a provenance-signed publish against `repository.url`,
  so the missing field left `@hzblj/zyplot-core` unpublishable.

## 0.1.0

### Minor Changes

- [`51e9ae3`](https://github.com/hzblj/zyplot/commit/51e9ae386cffc75c5d33ab8674905fa5c77c5044) - First public release.

  Cross-platform React charting behind one package and one shared TypeScript
  contract: ECharts and uPlot on web, Swift Charts on iOS, and Jetpack Compose on
  Android, with both native renderers reached through a single Expo Module named
  `Zyplot`.
