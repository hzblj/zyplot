---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Put your own views inside the chart, and let the chart place them.

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

What the chart gives up for a view depends on what the view can stand in for. A point *is* its mark,
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
