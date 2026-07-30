---
'@hzblj/zyplot': patch
---

Stop the iOS area fill from dimming while a point is being read.

`dimOpacity` is how far the data the reader is *not* on steps back, and on the web and on
Android it has always applied to the stroke alone. iOS applied it to the whole line canvas,
so the area under the trace faded with it — which greys the page rather than pointing at
anything, because the fill is the ground the trace is drawn on and not one of the marks being
compared. The three renderers now agree.
