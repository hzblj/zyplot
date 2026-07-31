---
'@hzblj/zyplot': minor
---

Square the first and last axis labels up with the ends of the row they bracket.

A label is centred on the mark it names, which is right in a row of them and wrong for a pair of
bookends. Two hours naming a day — `0:00` and `23:00` — are read as the ends of the axis rather
than as two readings on it, and centred they hang half a label outside it at each end: on a plot
that runs to the edges of the screen the first one starts before the data does and the last one
finishes after it, which reads as the labels being out of line with everything above them.

`xAxis.labelEdgeAlign` hangs a corner on the mark instead of the middle: the first label's leading
edge on the first mark, the last one's trailing edge on the last, and everything between stays
centred where it was. All three renderers read it on the x axis — ECharts through `alignMinLabel`
and `alignMaxLabel`, Compose by shifting the two labels by their own measured width, and Swift
Charts by anchoring the label to its mark, which it can only do for the labels a `tickValues`
named.
