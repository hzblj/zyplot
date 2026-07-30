---
'@hzblj/zyplot': patch
---

Keep web annotations on the marks they belong to while the data changes.

Three separate reasons a rule or a point came off the trace on the web, all of them visible
on the same range switch.

A point annotation is drawn by the chart itself rather than handed to the renderer — that is
what gives it a halo, a glow and a pulse, none of which a `markPoint` has. It was built from
the plot's new scale, so it arrived at the new reading the frame the option landed, while the
trace under it was still travelling: a dot hanging in the air above the line for the length of
every data change, and a badge hanging off the rule it caps. It now travels there instead,
over the same length and along the same curve as the marks, and still snaps when the plot
itself has moved — a resize is not a data change and there is nowhere to travel from.

`easing` reached the entrance but not the data change: those are two different keys, and
without the second one every update ran on the renderer's own `cubicInOut` however the chart
had been timed.

A rule is matched across a data change by name, and a rule with no label had none to be
matched by. Two of them and the renderer cannot tell which is which — one is drawn again from
nothing instead of moving to where it now belongs, which is the rule that flickered and
re-entered rather than sliding. They carry their `id` now, which is the thing that identifies
them and is always there.
