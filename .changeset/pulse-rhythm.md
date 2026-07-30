---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Give the pulse on a live point a rhythm, and hand it over. `pulse` on a point annotation
now takes a `ChartPulse` — `color`, `duration`, `interval`, `opacity`, `scale` — as well as
the `true` it took before, and `true` now means one bloom of 450 ms followed by a rest of
1550 ms, at 2.2× the point's resting ring.

That replaces a single 1.8 s expansion that faded to nothing with no rest between cycles:
the ring spent almost the whole cycle nearly transparent, which read as no animation at
all. The ring's colour is settable too, and falls back to the glow's colour and then to the
point's own — on iOS a pulse with no glow used to inherit the glow's `.clear` and draw
nothing at all.

Android had no pulse to speak of — the parameter was threaded through the drawing code
but nothing ever animated it — and now draws the same bloom off the same clock.
