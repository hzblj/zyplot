---
'@hzblj/zyplot': patch
---

Stop the iOS crosshair label being written off the edge of the window.

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
