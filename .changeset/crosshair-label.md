---
'@hzblj/zyplot': minor
---

Let the crosshair carry a label, so the text above it keeps up with the finger.

`crosshairStyle.labels` takes one string per slot in data order — a time, a date, whatever
the reading is called — and every renderer draws the one for the read slot above the plot,
in the same pass that draws the line. `labelColor` and `labelSize` style it. The app still
writes the words; the chart only places them.

This is the one piece of scrub chrome worth taking back off the app. Everything else an
overlay draws over a plot sits still long enough for `onInteraction` to place it — a card
against a rule, a badge on an annotation — but a label pinned to the crosshair has to move
with it, and a position that reaches JavaScript through a bridge and comes back as a
re-render is a frame or two behind the line it belongs to. Reading the two together, the
label visibly drags. Nothing about the overlay contract changes; this is one thing added to
the side of it that was always going to lose that race.
