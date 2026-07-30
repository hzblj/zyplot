---
'@hzblj/zyplot': patch
---

Keep a web scrub's dim, its lit stretch and its stepped-back marks for the whole gesture.

The pointer layer says how the plot reads while one mark is being read — the trace steps back
to `dimOpacity`, the marker relights the stretch that has been got to, and any annotation that
asked to comes back with it — and it said it once, at the start of the gesture, by patching
the chart's option. A chart builds that option for a plot at rest, so the next one to land
merged every one of those away again.

Which sounds rare and is not. An app is told which reading is being read, and anything it does
with that comes back to the chart as a prop: the screen this was found on dims its end dot
once the finger leaves the last reading, so the very first scrub event rebuilt the option and
undid the dim that same frame. What was left was a crosshair over a plot that had not otherwise
reacted — and a lit trail the same colour as a trace that was never dimmed, which is a trail
nobody can see. The gesture's state is now restored whenever a new option lands under it.

`scrubOpacity` also reaches the marks the chart draws itself rather than handing to the
renderer — a point with a halo, a glow or a pulse, and the badge that caps a rule. iOS and
Android fade every annotation that asks; on the web the reference lines faded and those did
not, so a dot marking the live reading stayed lit while the answer was being read somewhere
else. Two marks, one question.
