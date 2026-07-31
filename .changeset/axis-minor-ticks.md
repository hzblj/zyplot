---
'@hzblj/zyplot': minor
---

Give an axis a mark at every category, not only at the ones it names.

`xAxis.tickValues` says which categories are labelled, and the tick came with the label — so an
axis naming two hours out of twenty-four had two marks on it and read as nothing. What the eye
takes for the axis in that case is the row of small marks between the labels, and there was no
way to ask for one.

`minorTicks: true` draws a shorter mark at every category and leaves the named ones their full
tick and their label. It needs `ticks`, being the same row made denser.

Both native renderers place them where the marks are, so they line up with the bars or with the
readings above them. Android draws them at a fixed short length; iOS gives Swift Charts an
explicit `AxisTick` length, because the automatic one is as long as the label and a row of those
is a comb through the words rather than an axis under them.
