---
'@hzblj/zyplot': patch
---

Give every range annotation on the web its own colour again.

The band styling was set once on the series from the first annotation in the list, so a second
`annotation.range` was drawn in the first one's colour and opacity however it was declared — a
quarter shaded green next to an incident window that had asked for red came out green as well.
The styling now travels with each band, which is where iOS and Android had it all along.
