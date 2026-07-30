---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Let the entrance name its own curve. `reveal.draw` and `reveal.fade` take an `easing` —
`'ease-in' | 'ease-in-out' | 'ease-out' | 'linear'` — and `reveal.draw` also takes a
`flashEasing` for the glow's decay. Both were hard-coded before: a trace always ran at a
steady speed, a fade always eased out, and the flash always shed most of its bloom in the
first frames after landing, which reads as the glow leaving while the trace is still
arriving. `flashEasing: 'ease-in-out'` keeps the bloom up a moment longer so it leaves in
one piece.

A spring is deliberately absent from `ChartRevealEasing`: an entrance that overshoots
would trace past the last data point and come back.

Defaults are unchanged — `'linear'` for a trace, `'ease-out'` for a fade and for the
flash — so existing charts animate exactly as before.
