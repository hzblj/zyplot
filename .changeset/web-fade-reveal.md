---
'@hzblj/zyplot': patch
---

Stop `reveal.fade` from painting the stroke out again on the web.

A fade entrance starts the line at `lineStyle.opacity: 0` and runs a tween that lifts it back
to full. The tween runs once, by design — the entrance belongs to the first render — but the
zero was written into the option on *every* rebuild, so the first change of range, theme or
data after it had finished set the stroke back to nothing with nothing left to bring it up.
The line vanished while its fill, annotations and axes stayed, which reads as the chart having
lost its data rather than as an animation bug.

`'draw'` already guarded its own `startOpacity` behind `hasPlayed`; `'fade'` now does the same.
This only ever affected charts that asked for `reveal.fade` explicitly — a chart with no
`animation.reveal` never took the branch.
