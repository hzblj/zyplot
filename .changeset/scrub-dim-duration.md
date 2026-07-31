---
'@hzblj/zyplot': minor
---

Give the step back a duration, so a finger landing reads as the lights coming down.

`interaction({dimDuration: 420})` and the marks the reader is not on ramp to `dimOpacity` over
that many milliseconds instead of cutting to it, in both directions. Default 0, which is the
cut every chart has always had — worth a beat where the dimming is the whole feedback for the
gesture, and worth leaving alone where a tooltip is doing the talking.

The lighting on the reading is put up and taken down with the step back rather than with the
finger. A trail or a segment dropped the moment a touch lifts leaves the length of trace it was
lighting to come back up with everything else, so the part that was never dimmed flashes along
with the part that was — the one thing a ramp is supposed to avoid. It stays on the reading the
touch left behind until the step back is all the way up, and walks from the marker's colour to
the trace's own as it goes, so there is nothing to see when it is finally let go of.

Android also stops dimming charts that never asked. `dimOpacity` has a default there for the
series emphasis to fall back to, and reading it for a scrub meant a chart that only wanted a
crosshair stepped its trace back under a finger. Absent now means what it means on the web and
on iOS: a reading dims nothing.

Nothing transitions a value that a renderer only reads while it draws, so each of the three
drives its own frames. The web ramps `lineStyle.opacity` with `requestAnimationFrame`, because
ECharts does not animate a style merged into a live series. Android collects the reading through
a snapshot flow and reads the ramp inside the `Canvas` draw, so neither the finger moving nor the
ramp running costs a recomposition; a finger lifting mid-ramp turns it around from where it is
rather than queueing behind it. iOS walks the strength on a `TimelineView` the way the reveal and
the morph walk theirs, above the chart rather than in the background beside the canvas it feeds,
because the state a ramp walks has to outlive every layout of the plot.
