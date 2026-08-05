---
'@hzblj/zyplot': patch
---

Close a web reading when the finger lifts, rather than waiting for a pointer that never leaves.

Everything a reading puts up comes down on zrender's `globalout`: the tooltip, the axis pointer, the
crosshair and marker the scrub layer draws, and the step back on the rest of the trace. Under a
mouse that event arrives the moment the pointer leaves the plot. Under a finger it never arrives at
all — zrender turns `touchend` into a `mouseup` and nothing behind it, and does not listen for
`touchcancel` in the first place. So a reading taken by touch stayed up after the touch was over,
and `onInteraction` never reported the `ended` phase that closes a readout of your own.

The leave the browser declines to send is now raised on the chart itself, which is the one event all
of them are already watching, so one line closes the lot. It goes up a frame after the touch rather
than inside it: a touch under the click delay makes zrender fire a synthetic `click` of its own, and
a leave landing before that would only be undone by it.

`Chart.TimeSeries` is drawn by uPlot and is not reached by this. uPlot binds mouse events only, so
its cursor is placed on a touch screen by the browser's compatibility `mousemove` and there is no
gesture to end — a tap leaves it where it landed, as it did before.
