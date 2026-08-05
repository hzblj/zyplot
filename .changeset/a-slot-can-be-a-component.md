---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Let a slot be a component, and put it where the thing it stands in for is.

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
