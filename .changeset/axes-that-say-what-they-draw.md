---
'@hzblj/zyplot': patch
---

Say which renderer reads which axis and plot option, and stop decoding the ones nobody draws.

`scale` and `reversed` were parsed on both native platforms and read on neither; `gridDash` and
`plot.clip` were parsed on Android and read nowhere. Decoding an option you do not draw is a trap
for whoever reads the module next, so those four are gone from the Swift and Kotlin side — the
contract keeps them, because the web does draw them.

What is left is a real gap rather than dead code, and the axis docs now name each one: `scale` and
`reversed` are the web's alone, `gridDash` is the web and iOS, `position: 'end'` moves the web and
iOS axes while Android honours it on the y axis only, `plot.clip` is iOS and four web forms, and
`plot.borderRadius` rounds a native plot and does nothing on the web.
