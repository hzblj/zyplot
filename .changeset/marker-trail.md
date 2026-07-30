---
'@hzblj/zyplot': minor
---

Add `marker.trail`, a selection marker that lights the trace up to the reading.

`marker.segment` brightens a window `span` steps either side of the mark under the finger,
which reads as light moving along the data. That is the right shape when the reader is
comparing a point against its neighbours, and the wrong one for a price chart, where the
question is what has happened *so far* — everything before the finger is history, everything
after it has not been reached yet.

There was no way to say that: the window is symmetric in all three renderers, and
`dimOpacity` fades the whole line at once. `marker.trail` lights from the first datum to the
reading instead and leaves the rest at `dimOpacity`, on Swift Charts, the Compose canvas and
the web. It takes neither `span` nor `size` — its far end is the reading and its near end is
the start of the series, so there is nothing to size.

Both stroke-lighting styles are drawn over the line rather than beside it, so both still
need a `dimOpacity` to stand out from. The iOS and Android selection-marker views now treat
a trail the way they already treated a segment, and draw no dot of their own on top of it.
