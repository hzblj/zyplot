---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Give measuring a mark its own name, instead of a point annotation dressed down to nothing.

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
