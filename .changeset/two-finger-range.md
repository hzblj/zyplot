---
'@hzblj/zyplot': minor
---

Read a span with two fingers, not just a mark with one.

`interaction({range: true})` and a chart reports what is under both fingers and everything
between: `range` on the interaction event, with `startIndex` and `endIndex` in data order
however the fingers are placed. `useChartScrub` returns it beside `selection`, and only ever
one of the two is set — so a headline shows a value or a total without having to work out
which report arrived last, and a finger lifted from a pair goes back to a single reading with
no gesture ending in between.

The span carries where each end's mark landed as well as which one it is. A total belongs over
the bars it covers, and an app cannot work that position out from the plot's width alone
without also knowing the axis padding and the bar inset — the chart is the one that knows, so
it says.

iOS and Android only, because a pointer has no second finger; on the web `range` stays `null`.
SwiftUI's `DragGesture` reports one location however many fingers are down, and the gesture
that would report more is iOS 18, so iOS drops to UIKit's own touch delivery for the charts
that ask for a span and keeps the existing drag for every chart that does not. Android reads
its pointers in one `awaitEachGesture` loop instead of the tap and drag detectors, on the same
condition. Both draw a rule at each end of the span rather than a crosshair through it, placed
where the span ends rather than through its last mark, so the outermost bars read as inside it.
