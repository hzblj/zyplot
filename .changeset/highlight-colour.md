---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Let the mark under the pointer light up. `interaction.highlightColor` draws the read mark in
its own colour, so a scrub reads as one candle lit rather than as every other candle merely
dimmed — dimming alone leaves the read one in its resting colour, which is hard to pick out
against a plot that has only lost a little contrast. Implemented for candlesticks on both
platforms, alongside the `dimOpacity` fix that made the rest fade at all.
