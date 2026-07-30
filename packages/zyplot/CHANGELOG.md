# @hzblj/zyplot

## 0.3.0

### Minor Changes

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Let the crosshair carry a label, so the text above it keeps up with the finger.

  `crosshairStyle.labels` takes one string per slot in data order — a time, a date, whatever
  the reading is called — and every renderer draws the one for the read slot above the plot,
  in the same pass that draws the line. `labelColor` and `labelSize` style it. The app still
  writes the words; the chart only places them.

  This is the one piece of scrub chrome worth taking back off the app. Everything else an
  overlay draws over a plot sits still long enough for `onInteraction` to place it — a card
  against a rule, a badge on an annotation — but a label pinned to the crosshair has to move
  with it, and a position that reaches JavaScript through a bridge and comes back as a
  re-render is a frame or two behind the line it belongs to. Reading the two together, the
  label visibly drags. Nothing about the overlay contract changes; this is one thing added to
  the side of it that was always going to lose that race.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Add `fadeTo` to the series fill, so the paint can thin towards the plot's floor.

  An even fill has two edges: the trace along its top, and a hard stop along the bottom of
  the plot that no data put there. On a chart with no axis to speak of the second one reads
  as a second line, and the eye keeps going back to it. `fill({fadeTo: 0.12})` takes the fill
  down to a tenth of its strength by the floor, so it gathers under the trace and lets go.

  The three renderers get there differently. The SwiftUI and Compose canvases paint the dot
  grid a row at a time, which is the largest unit that can share an alpha — one path per dot
  would be thousands of draw calls a frame, and one path for the grid can only carry one.
  ECharts is given a tile as tall as the plot and repeated only across, because a tile that
  repeated vertically would restart the ramp every few pixels; that needs the plot height
  before the chart is measured, so it is computed from the same gutters the grid reserves and
  a chart given no `height` keeps an even fill rather than guessing at one.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Add `marker.trail`, a selection marker that lights the trace up to the reading.

  `marker.segment` brightens a window `span` steps either side of the mark under the finger,
  which reads as light moving along the data. That is the right shape when the reader is
  comparing a point against its neighbours, and the wrong one for a price chart, where the
  question is what has happened _so far_ — everything before the finger is history, everything
  after it has not been reached yet.

  There was no way to say that: the window is symmetric in all three renderers, and
  `dimOpacity` fades the whole line at once. `marker.trail` lights from the first datum to the
  reading instead and leaves the rest at `dimOpacity`, on Swift Charts, the Compose canvas and
  the web. It takes neither `span` nor `size` — its far end is the reading and its near end is
  the start of the series, so there is nothing to size.

  Both stroke-lighting styles are drawn over the line rather than beside it, so both still
  need a `dimOpacity` to stand out from. The iOS and Android selection-marker views now treat
  a trail the way they already treated a segment, and draw no dot of their own on top of it.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Make `transition: 'morph'` do something on iOS and Android.

  `ChartTransition` has offered `'crossfade' | 'morph'` since the contract was written, but
  only crossfade was ever implemented. Asking for a morph did not fall back to a crossfade —
  it fell through to no animation at all, and the plot cut from one dataset to the next.

  Both platforms now blend the two: the readings, the pinned axis domain, and the value a rule
  or a point sits at, so nothing on the plot jumps while the trace is on its way. Annotations
  are matched by `id` — one that exists on both sides slides, one that does not simply
  arrives. A morph needs the two sides to correspond, so where the series count or the
  reading count differs the new dataset is shown as it is: half a morph reads worse than none.

  `animation({duration, easing})` times it, the same two that time the entrance and every
  other data change — so a morph is tuned from the props rather than from a curve baked into
  the renderer. `'spring'` resolves to the eased curve: there is no closed form to sample at a
  fraction, and a transition that overshoots would carry the marks past their new values and
  back.

  The frames are produced rather than animated towards. SwiftUI and Compose both interpolate
  _modifiers_; a fraction fed to a _data_ computation is set straight to its final value and
  the body runs once, which is an animation that never draws a frame. iOS runs the clock off a
  `TimelineView`, the way the traced reveal does, and parks the schedule whenever nothing is
  moving. Android reads the clock inside the canvas, so a morph costs a draw a frame rather
  than a recomposition of the chart around it.

  Implicit animation is switched off underneath the iOS morph — the chart's own update
  animation with it, which is the one that mattered. An animation keyed on the data is handed a
  new target on every frame of a morph and spends the whole morph chasing it: the trace is drawn
  from the frame directly and lands on time, while every mark Swift Charts owns arrives a beat
  late and keeps moving after the line has settled. The rule at the latest reading showed it
  worst — it hung at its old price and then slid down once the morph was already over. Compose
  draws straight from the frame it is given, so it never had the second animation to switch off.

  A morph cut short sets off from what is on screen rather than from the dataset the last one
  was heading for. A row of range buttons gets pressed in sequence, and snapping back to the
  window before to set off again is a jump nobody asked for.

  Two datasets only correspond if they agree on how many readings they have. A screen that
  switches between windows of different lengths — a day against a year — has to sample them
  into the same number of slots to be morphed between; otherwise this stays a crossfade.

  `transition` stays a native choice, and is now documented as one. The web renderer
  transitions a data change itself, mark by mark: the ones on both sides move, the ones on one
  side fade. That is a better answer to a changed axis than dissolving the whole plot, so a web
  chart does it whichever name it is given — including for the same `animation` object an app
  shares with its native screens.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Add `fill` to the series style: a dot-grid pattern, and a baseline other than the plot floor.

  `fillOpacity` was the whole vocabulary for the area under a line, and it only did anything on
  `Chart.Area`, where the fill runs to the bottom of the plot because there the fill is the
  quantity. Two things a price chart wants were unsayable.

  A fill can now close against a value — `fill({baseline: latest})` — so the shape between the
  trace and that number is filled above the line and below it, and reads as distance from where
  the asset stands rather than as volume. And it can be laid down as a grid of dots rather than
  a flat wash — `fill({pattern: 'dots', spacing: 3.4})` — which carries a fill across a pale
  background without the second, fainter chart a wash leaves behind it.

  `fill` lives on `NativeChartSeriesStyle` next to `glow`, so every entry point takes it, the
  web one included: a clipped dot path on the SwiftUI and Compose canvases, a repeating canvas
  pattern on ECharts. Opacity is still `fillOpacity` — one spelling — though a dot grid usually
  wants more of it than a wash, since most of what it covers stays bare.

  Giving a series a `fill` also paints an area under `Chart.Line`, where it is decoration rather
  than the quantity. `Chart.Area` is unchanged: it still fills by default, and a `fill` only
  overrides the pattern and the baseline.

### Patch Changes

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Stop Android drawing grid rules for an axis that asked not to be drawn.

  `yAxis={{visible: false}}` took the labels off the Compose canvas and left the rules behind:
  `drawGrid` only ever consulted `yAxis.grid`, which defaults on, so a chart meant to be read
  off its marks alone came out with five grey lines across it — and only on Android, since
  Swift Charts and ECharts both drop a hidden axis' grid with the rest of it. A plot styled to
  bleed off the window showed the divergence at its clearest: the rules stopped short of the
  right edge, where the axis' end padding is.

  The grid now follows the axis. `grid` still turns the rules off on their own for an axis that
  is drawn, which is what a chart wanting labels without rules already passes.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Draw the Android crosshair and selection marker wherever the scrub reaches, not only where
  the finger happens to land inside the plot.

  Both asked whether the plot _contained_ the pointer and drew nothing when it did not, while
  the reading itself is picked off the pointer's x alone and clamped into the plot on the way.
  So a finger in any of the four bands the plot is inset by — 20dp at the leading edge, 16dp
  at the top, 24dp under the marks — moved the trace, lit the trail and reported a reading,
  and put neither a line nor a mark nor a label on the chart to say which one. On a plot the
  height of a headline that is a quarter of the chart's own height, and it includes the two
  edges a finger is most often taken to.

  `Rect.contains` is half-open besides, and a scrub is clamped to exactly `plotRight` — so the
  last reading, the one the end dot marks, was one of the dead bands.

  The pointer is now brought onto the plot rather than tested against it: the line stands at
  the edge and stays there while the finger goes on past, which is what the reading does too.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Stop an Android scrub dying on the redraw its own first report causes.

  The Compose gesture detectors, the scrub state and the entrance animation were all keyed on
  the configuration string — the whole serialised payload. That holds while a chart is only
  read from, and breaks the moment an app answers `onInteraction` by changing the chart: a
  dimmed end dot, an annotation moved to the reading, anything at all. The first touch reports
  `began`, the app re-renders, a new string arrives, and Compose tears down the `pointerInput`
  under the finger. A detector restarted mid-gesture is waiting on `awaitFirstDown` for a
  finger that is already down, so every move for the rest of that drag goes nowhere. Lift and
  touch again and it works, because by then the payload has stopped changing — which is why
  this read as a scrub that took two goes rather than one that was broken.

  The scrub and the entrance now key on the dataset, the way the morph and crossfade already
  did — the entrance on the end of the loading skeleton as well, which is the other moment a
  chart is first seen — and the detectors are started once and read the current handlers rather
  than the ones composed alongside them. A change of data still clears the reading and still
  plays the entrance; a change of styling or annotations no longer touches either. The entrance
  also stops being restarted mid-scrub, which on a chart with `animation.delay` set was holding
  the trace at nothing for the length of that delay on every touch report.

  iOS was never affected: SwiftUI holds the selection in `@State` on a view whose identity does
  not depend on the payload.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Put the axis labels back on every web chart drawn through ECharts.

  A gutter axis — the default on both dimensions — asked for no label inset, and asked for it
  by handing ECharts `axisLabel.margin: undefined`. An option given explicitly wins over the
  engine's own default even when it holds nothing, so the 8px gap the labels are laid out from
  went missing, and every label on the axis was placed at the canvas' corner rather than beside
  its tick: a pile of overlapping text clipped by the plot's leading edge, no scale to read
  anywhere, and a plot pushed down the canvas by the room the same measurement asked for.

  The inset is now set only where a chart means to move a label — an `'overlay'` axis, against
  the plot's trailing edge — and left off entirely everywhere else. `Chart.Candlestick` built
  its category axis by hand and carried the same bug, including for an overlaid axis that named
  no `labelInset`; it now takes the shared inset with the rest.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Give `Chart.Candlestick` a placeholder shaped like a candlestick chart.

  `Chart.Candlestick.Skeleton` was `BarChartSkeleton`, and so was the placeholder the chart itself
  drew while loading: a row of bars grown from the baseline. A candle does not sit on the baseline —
  it floats on its wick — so the shape that landed was never the shape that had been promised, and
  the swap moved every mark on the plot.

  The candlestick now has its own: bodies of varying height, each centred on a wick, each offset up
  or down the plot the way a real series wanders. Nothing to configure — like the other
  placeholders it is derived from the props the chart already has.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Stop the iOS crosshair label being written off the edge of the window.

  The label is centred on the line, and a line read near the start of a series puts half of a
  date off the left of the screen — `Feb 6, 2026` arriving as `b 6, 2026`. Android has always
  pinned it inside the chart's own bounds; iOS laid it out as a `fixedSize` overlay on a
  hairline, which is a box with no width to be constrained by, so nothing ever stopped it.

  It now stops when its own edge reaches the view's, on both platforms and at both ends: the
  label follows the line until it would hang off, then anchors against the edge and stays
  whole while the line goes on without it.

  Where it stops is worked out as arithmetic and applied as a shift off the line, rather than
  written back as an alignment guide: an overlay places its content by the alignment it was
  given, and a guide the content returns does not reach it. The width that arithmetic needs is
  measured off the font the label is drawn in, so it is the width the label actually takes.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Stop the iOS area fill from dimming while a point is being read.

  `dimOpacity` is how far the data the reader is _not_ on steps back, and on the web and on
  Android it has always applied to the stroke alone. iOS applied it to the whole line canvas,
  so the area under the trace faded with it — which greys the page rather than pointing at
  anything, because the fill is the ground the trace is drawn on and not one of the marks being
  compared. The three renderers now agree.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Stop a hover from dimming a web line chart's fill, and from dimming its stroke twice.

  `dimOpacity` says how far the data being read steps back, and the pointer layer applies it
  where it belongs: the stroke, on the series' resting style. `Chart.Line` was also handing
  ECharts `emphasis.focus`, which puts the series into its own blur state on hover — and that
  state takes the whole series down, `areaStyle` included. A line with a fill under it lost
  both at once, and the stroke was dimmed twice over, once by each mechanism.

  A chart that names `dimOpacity` is saying it will do the dimming itself, so ECharts' focus
  is now switched off when it does. Charts that name no `dimOpacity` are unaffected and keep
  the focus behaviour they had.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Let `isLoading={false}` keep the first-frame placeholder off the page.

  A web chart cannot paint until it has read its colours off the document, which happens in an
  effect, so the built-in placeholder covered that first frame for every chart — including one
  mounted with its data already in hand. On a page that swaps charts as you click through them the
  cost is visible: a grey shape fades in and out again for a chart that was never loading.

  An explicit `isLoading={false}` on the first render now opts out of the placeholder for good, and
  the plot fades in on its own. A chart that says nothing about loading keeps the old behaviour,
  which is what a server-rendered page wants: markup to paint before hydration. One that starts true
  and later flips to false still cross-fades — the placeholder it was showing stays mounted to fade
  out.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Export `fill` from `@hzblj/zyplot/ios` and `@hzblj/zyplot/android` too.

  The builder landed on the shared entry point and the web one and was left off the two platform
  subpaths, which are the entries a file already committed to a platform imports from — so the
  screens most likely to want a dotted fill under a trace were the ones that could not name it
  without reaching back to `@hzblj/zyplot`. Every other builder is on all four, and the docs say
  so; this one is now as well.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Give `Chart.TimeSeries` the same axis spacing as every other form. Its value band was a fixed 48px
  — uPlot takes a width, not a measurement — so a two-digit scale sat a long way off its plot while
  the ECharts forms beside it kept their labels 8px away. The band is now measured from the widest
  reading in it, in the font the chart paints, and both axes take the same 8px gap the rest of the
  library uses.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Honour `animation` on every web chart, not five of them.

  `ChartBaseProps` has always declared it, and `Chart.Line`, `Chart.Area`, `Chart.Bar`,
  `Chart.StackedBar` and `Chart.Candlestick` have always read it. The other thirteen forms —
  pie, scatter, heatmap, histogram, boxplot, diverging bar, dumbbell, funnel, gauge, radar,
  sankey, sunburst, treemap — built their options without it, so `duration`, `delay` and
  `easing` went nowhere and `enabled: false` turned nothing off. They animated on the
  renderer's own defaults: a full second of `cubicOut`, whatever the chart had been told.

  A page that sets one animation for every chart on it now gets one animation for every chart
  on it.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Give a web annotation badge the room it needs, and the rule beneath it.

  The badge was centred on the plot edge the rule starts from, which put half the circle outside
  the canvas: on the web that edge is where the drawing stops, so the glyph read as sliced off the
  top. It now sits a radius inside the edge, the same place iOS and Android hold it, and the whole
  circle is on the plot.

  It also draws over the crosshair and the marks rather than under them. A rule capped by a badge
  is a pin, and a pin reads that way only while nothing crosses its head — the crosshair, which is
  drawn full height, went straight through the glyph whenever the pointer stopped on the annotated
  slot.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Keep web annotations on the marks they belong to while the data changes.

  Three separate reasons a rule or a point came off the trace on the web, all of them visible
  on the same range switch.

  A point annotation is drawn by the chart itself rather than handed to the renderer — that is
  what gives it a halo, a glow and a pulse, none of which a `markPoint` has. It was built from
  the plot's new scale, so it arrived at the new reading the frame the option landed, while the
  trace under it was still travelling: a dot hanging in the air above the line for the length of
  every data change, and a badge hanging off the rule it caps. It now travels there instead,
  over the same length and along the same curve as the marks, and still snaps when the plot
  itself has moved — a resize is not a data change and there is nowhere to travel from.

  `easing` reached the entrance but not the data change: those are two different keys, and
  without the second one every update ran on the renderer's own `cubicInOut` however the chart
  had been timed.

  A rule is matched across a data change by name, and a rule with no label had none to be
  matched by. Two of them and the renderer cannot tell which is which — one is drawn again from
  nothing instead of moving to where it now belongs, which is the rule that flickered and
  re-entered rather than sliding. They carry their `id` now, which is the thing that identifies
  them and is always there.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Give the crosshair's label somewhere to be drawn on the web.

  `crosshairStyle.labels` places the words above the plot's ceiling, which is where they belong
  and where iOS and Android put them: those draw over the chart's own view, and a view carries on
  past the plot in every direction. A canvas does not. The label was hung upwards off a line eight
  pixels below the top of the chart, so all of it was painted off the top and none of it was ever
  seen — the crosshair arrived on the web with no words on it at all.

  The plot now gives up the room the label needs, measured from the same two numbers the label is
  drawn with, so the space and the text cannot drift apart. Only a chart that was given labels
  gives anything up, and it gives it up whether or not a pointer is over the plot — marks that
  changed height the moment one arrived would be worse than either.

  The label is also kept whole against both edges, the way iOS pins it. A crosshair reaches the
  ends of the plot and a date is wider than the hairline it names, so the first and last readings
  of a series were worth half a label each.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Stop `reveal.fade` from painting the stroke out again on the web.

  A fade entrance starts the line at `lineStyle.opacity: 0` and runs a tween that lifts it back
  to full. The tween runs once, by design — the entrance belongs to the first render — but the
  zero was written into the option on _every_ rebuild, so the first change of range, theme or
  data after it had finished set the stroke back to nothing with nothing left to bring it up.
  The line vanished while its fill, annotations and axes stayed, which reads as the chart having
  lost its data rather than as an animation bug.

  `'draw'` already guarded its own `startOpacity` behind `hasPlayed`; `'fade'` now does the same.
  This only ever affected charts that asked for `reveal.fade` explicitly — a chart with no
  `animation.reveal` never took the branch.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Let a web line chart's marks travel to a new dataset again once its entrance has run.

  A data change was supposed to move the marks reading by reading. It cut instead — the whole
  trace at the new dataset the frame the option landed — while the rules and the points drawn over
  it travelled the full length of the change on their own. So a range switch read as the plot
  jumping and its annotations then sliding into place after it, which is the opposite of what
  `transition: 'morph'` promises anywhere else.

  The cause was the entrance, of all things. A fade is the stroke's own opacity changing after the
  marks have landed, which no option covers, so it is driven frame by frame and written back
  through `setOption` — and each of those writes has to turn the renderer's update tween off, or
  every frame of the fade is chased by one. That key is merged into the read series and stays
  there. Once an entrance had run, the series had no update animation at all, for the life of the
  chart. Everything drawn over it kept the chart's own timing and travelled, which is why the two
  came apart rather than both cutting.

  How a data change is timed is now restated on the series as well as on the chart, so the option
  after an entrance puts back what the entrance took away.

  Also fixed: the first frame of a fade painted the trace at full strength. A frame's timestamp is
  when that frame began, which can be before the fade was asked for, and an unclamped `ease-out`
  of a negative elapsed is a negative opacity — not dim but invalid, which a canvas answers by
  keeping whatever alpha it had.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Keep a web scrub's dim, its lit stretch and its stepped-back marks for the whole gesture.

  The pointer layer says how the plot reads while one mark is being read — the trace steps back
  to `dimOpacity`, the marker relights the stretch that has been got to, and any annotation that
  asked to comes back with it — and it said it once, at the start of the gesture, by patching
  the chart's option. A chart builds that option for a plot at rest, so the next one to land
  merged every one of those away again.

  Which sounds rare and is not. An app is told which reading is being read, and anything it does
  with that comes back to the chart as a prop: the screen this was found on dims its end dot
  once the finger leaves the last reading, so the very first scrub event rebuilt the option and
  undid the dim that same frame. What was left was a crosshair over a plot that had not otherwise
  reacted — and a lit trail the same colour as a trace that was never dimmed, which is a trail
  nobody can see. The gesture's state is now restored whenever a new option lands under it.

  `scrubOpacity` also reaches the marks the chart draws itself rather than handing to the
  renderer — a point with a halo, a glow or a pulse, and the badge that caps a rule. iOS and
  Android fade every annotation that asks; on the web the reference lines faded and those did
  not, so a dot marking the live reading stayed lit while the answer was being read somewhere
  else. Two marks, one question.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Draw a web reference line solid when it was not asked to be dashed.

  `annotation.line()` with no `dash` is a solid rule, and is one on iOS and Android. On the web it
  came out dashed, because a reference line is the one thing ECharts has an opinion about: its
  `markLine` defaults to `'dashed'`, and the key was handed over holding nothing — which leaves a
  renderer's own default standing rather than overriding it, the same trap the axis label margin
  was in. The rule standing in for an axis on a plot that has none was a row of faint dashes
  instead of the hairline it was written as.

- [`66541ab`](https://github.com/hzblj/zyplot/commit/66541ab9ef4d67cc3fa7c6300daec52c43ffad44) - Make sure a web chart's stylesheets actually reach the page, which is what `Chart.TimeSeries`
  was missing to draw at all.

  The two stylesheets a chart needs were imported by the web entry point, which does nothing but
  re-export. A bundler is free to read a re-export, resolve the symbol to the module that declares
  it and never run the file in between — Turbopack does exactly that — so an app got the charts and
  none of the CSS. uPlot's is structural: without it the plot is not positioned, the canvas is not
  scaled to its box, and `Chart.TimeSeries` painted a stretched grid and giant axis labels sliding
  out of the card with no line in sight. They now sit with `Chart` itself, reached by the same
  import that reaches a chart, which no tree shake can drop.

  That stylesheet now arrives in the `base` cascade layer, because an app with Tailwind of its own
  ends up holding two builds of the same utilities under the same names, and this one — pulled in by
  a chart — comes second. A plain `.flex` or `.hidden` from here beat the app's own `dark:block` and
  `min-[821px]:hidden` on the app's own markup, since a variant carries no more weight than the
  utility it varies: dark-mode pages showed their light-mode element, and elements meant to be hidden
  at a width stayed on screen. In `base` these lose to everything an app writes, while a page whose
  only stylesheet is this one renders exactly as before.

- Updated dependencies []:
  - @hzblj/zyplot-core@0.3.0

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
