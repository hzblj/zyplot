---
'@hzblj/zyplot': patch
---

Draw the Android crosshair and selection marker wherever the scrub reaches, not only where
the finger happens to land inside the plot.

Both asked whether the plot *contained* the pointer and drew nothing when it did not, while
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
