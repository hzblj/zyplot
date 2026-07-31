---
'@hzblj/zyplot': minor
---

Let the chart draw the span under two fingers, so both ends keep up with them.

`interaction({range: true, rangeStyle: {...}})` and the held stretch is painted by whoever is
drawing the line: `color` and `downColor` take the direction the span itself went — a fortnight
down inside a year up reads as the fortnight — `dimOpacity` steps the rest of the trace back behind
it, and `dot` puts the reading marker on each end. Leave `rangeStyle` off and a span is the rules at
its ends, exactly as before.

It is the same reason `marker.dot` exists, twice over. The way to paint a split before this was to
feed the two indices back through a scrub handler as a second series masked to the span — which
crosses into JavaScript and back, and comes back as a whole new chart rather than as a moved dot.
So the ends trailed the fingers by more the longer the series was, and two fingers cost what one
never did: one finger changes nothing in the props and the chart never rebuilds under it. Now
nothing about a held span reaches the props at all.

The step back a span asks for is its own number rather than `interaction.dimOpacity`, so one finger
can read a whole trace and two can still spotlight a stretch of it — and unlike `dimOpacity` it
reaches the area fill, because a span picks out a stretch of the period rather than one mark out of
many. iOS and Android only, like the span it draws.
