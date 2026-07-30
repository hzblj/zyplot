---
'@hzblj/zyplot': minor
---

Add `fadeTo` to the series fill, so the paint can thin towards the plot's floor.

An even fill has two edges: the trace along its top, and a hard stop along the bottom of
the plot that no data put there. On a chart with no axis to speak of the second one reads
as a second line, and the eye keeps going back to it. `fill({fadeTo: 0.12})` takes the fill
down to a tenth of its strength by the floor, so it gathers under the trace and lets go.

The three renderers get there differently. The SwiftUI and Compose canvases paint the dot
grid a row at a time, which is the largest unit that can share an alpha — one path per dot
would be thousands of draw calls a frame, and one path for the grid can only carry one.
ECharts is given a tile as tall as the plot and repeated only across, because a tile that
repeated vertically would restart the ramp every few pixels; that needs the plot height
before the chart is measured, so it is computed from the same gutters the grid reserves and
a chart given no `height` keeps an even fill rather than guessing at one.
