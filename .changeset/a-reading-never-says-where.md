---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

An interaction says what is being read, and never where the finger is.

`ChartScrubSelection` loses `nativeX` and `nativeY`, `ChartInteractionRange` loses `startX` and
`endX`, and the interaction event loses the pair with them. Nothing reports where a reading is any
more.

The reason is the thing they were used for. A reading moves many times a mark, and a position that
crossed out to be laid out again could only ever land a render after the crosshair it belongs beside —
so a card following a finger trailed it, and trailed it further the more the screen had to re-render
to move it. Every one of them is a `tooltip` or a `rangeView` instead: the chart mounts the node and
moves it in the same pass it draws the reading in, which is what those slots were added for.

`geometry` stays, and stays the way down for a view that is laid against the plot rather than against
a finger — a grid behind the marks, a row of labels under them, a button on a rule. It is a layout
report: it arrives when the chart measures itself and moves when the chart does.

Two things follow from taking the position out:

- A scrub within one mark now changes nothing. `useChartScrub` compared the position as well as the
  index, so a finger travelling across a single mark produced a new selection on every touch the
  platform reported, and every screen reading it re-rendered for a reading that had not changed.
- On the web, a form with no scrub layer reports no position on a hover or a click either. It never
  reported a mark for one to belong to, so a view placed from it had somewhere to sit and nothing to
  say.

To migrate, name the view instead of positioning it: `tooltip.above({view})` for a chip over the
rule, `tooltip.beside({view})` for a card at the reading, `rangeView` for one over a two-finger span.
What each shows is read from your own context rather than passed in, so a reading changes what a view
says without changing a prop on the chart — which is the other half of why this is faster.
