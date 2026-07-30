---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Two knobs for reading a candlestick chart. `interaction.highlightBlend` says how far the
read mark is lifted towards `interaction.highlightColor`, so at 0.5 a red candle lights up
red instead of turning white — a flat replacement threw the series colour away, which is the
one thing a candle's colour is for. `style.candleRadius` rounds the candle body, and rounds
the wick's caps with it so the wick does not read as a cut-off stub against a rounded body.
