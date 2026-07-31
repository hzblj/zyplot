---
'@hzblj/zyplot': minor
---

Let the marker put a dot on the reading, so the dot keeps up with the finger.

`marker.segment({dot: true})` and `marker.trail({dot: true})` draw the dot of `'point'` on the
mark under the finger as well as lighting the line, sized by `size` and glowing by `glow`. The
chart draws it, which is the whole point: a dot placed from a scrub handler has to cross into
JavaScript and back before it moves, so on a fast drag it trails the finger by tens of points
while the crosshair beside it does not. Every renderer already knew where the reading was.

The web catches up on `'point'` at the same time. It drew nothing for the dot styles and only
ever lit the stroke, so a chart asking for `marker.point` got a crosshair and no mark.
