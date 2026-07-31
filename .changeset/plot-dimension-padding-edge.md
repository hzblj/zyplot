---
'@hzblj/zyplot': minor
---

Let a chart run its marks to the edge of the plot.

`plotDimensionStartPadding` and `plotDimensionEndPadding` were read as extra room on top of what
the renderer already kept for itself, so a `0` was not zero: the web grid held 4 points at the
leading edge and 8 at the trailing one, Android held 20 and 12 wherever no axis was drawn, and
iOS — which adds nothing — put the same window a full 20 points further left than Compose did.
A padding that cannot say *none* is no use to a chart that spans the width of the screen.

What the axis gives is now the whole gutter. `0` puts the first or last mark on the plot's edge on
every renderer, and leaving it out keeps the breathing room each one kept before, so nothing that
did not ask for a number moves. A chart that did ask gets what it asked for, which on the web and
on Android is a few points tighter than it got yesterday.
