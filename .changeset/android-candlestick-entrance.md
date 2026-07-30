---
'@hzblj/zyplot': patch
---

Give Android candlesticks the entrance they already had on iOS. A traced reveal pins the
growth factor at 1 — the trace is meant to come from the reveal's own fraction — but the
candlestick drawing never received it, so `reveal.draw` drew every candle at once while iOS
brought them in left to right. Candles now land one slot at a time off the same fraction,
with the slot width keyed to the full count so nothing re-spaces as they arrive.
