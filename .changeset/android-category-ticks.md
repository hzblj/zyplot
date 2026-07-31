---
'@hzblj/zyplot': patch
---

Let an Android category axis name only the ticks it was given.

`xAxis.tickValues` takes numbers or category names, and Android read the array as numbers only —
so every name in it was dropped on the floor and the axis went on drawing all of them. On a
month of days that is thirty-one labels in the room for four, each one ellipsised to `...`,
which reads as a rendering fault rather than as an axis that was asked for something.

The values are now kept as written, and a category axis draws the labels and ticks it was told
to. The bars are untouched: a category with no label still has its bar, and the label that is
drawn is measured against the room the named ones actually have rather than against one band of
thirty-one, which is what was cutting them short.

The y axis has always honoured its own `tickValues` for labels. Its gridlines still do not — a
chart that asks for two rules gets the renderer's own count — so that is still worth knowing
before matching a design that leans on them.
