---
'@hzblj/zyplot': minor
---

Put a rule on a category's edge instead of through its middle.

A category is a band — a width, not a line — so a rule placed on one has to pick somewhere
inside it, and every renderer picked the middle. That is right for a rule that names its mark
and wrong for the commoner case: a rule that means *up to here*. A cumulative chart's "now"
belongs at the end of the last hour, not halfway through it, and drawn through the middle it
reads as cutting the last reading in half.

`annotation.line({align: 'end'})` moves it to the band's trailing edge, `'start'` to its
leading one, and the default stays `'center'`, so nothing already drawn moves. It means nothing
on a numeric axis, where a value is already a position.

Android computes it where it computes every other category position, so the reported geometry
agrees with the pixels. iOS offsets the `RuleMark` by half a band, which it now measures off the
laid-out plot — a mark cannot ask how wide its own band is. The web renderer still centres:
`align` is read on iOS and Android only for now.
