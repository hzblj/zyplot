---
'@hzblj/zyplot': patch
---

Give a web annotation badge the room it needs, and the rule beneath it.

The badge was centred on the plot edge the rule starts from, which put half the circle outside
the canvas: on the web that edge is where the drawing stops, so the glyph read as sliced off the
top. It now sits a radius inside the edge, the same place iOS and Android hold it, and the whole
circle is on the plot.

It also draws over the crosshair and the marks rather than under them. A rule capped by a badge
is a pin, and a pin reads that way only while nothing crosses its head — the crosshair, which is
drawn full height, went straight through the glyph whenever the pointer stopped on the annotated
slot.
