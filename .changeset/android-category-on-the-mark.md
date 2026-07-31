---
'@hzblj/zyplot': patch
---

Put an Android category where its mark is, not where its band is.

A trace on Android runs corner to corner — its first mark is the plot's leading edge and its last
is the trailing one — but everything placed by category went to the middle of a band, half a step
short of the mark at the end of the data. A dot annotating the last reading landed off the end of
the line it belonged to, and on a steep close it read as sitting above the trace as well.

Category positions now follow the marks they are placed against: on the plot's edges for a line,
an area, a time series or a sparkline, in the middle of the band for a bar or a candle, where they
always were. The reported geometry, `annotation.line({align})` and the rules at the ends of a
two-finger span all move with them, so an overlay calibrated off an annotation still lands on the
pixels. Axis labels keep naming their band.
