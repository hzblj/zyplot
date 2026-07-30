---
'@hzblj/zyplot': patch
---

Honour `interaction.dimOpacity` on a candlestick chart. It faded the marks on every other
form but did nothing here, so reading a candle left the rest of the series at full strength
and the read one hard to pick out. Candles either side of the selection now fade back the
same way series marks do.
