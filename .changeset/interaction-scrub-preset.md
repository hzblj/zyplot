---
'@hzblj/zyplot-core': minor
'@hzblj/zyplot': minor
---

Give the reading under a finger a preset, and the handler a name to be held in.

`interaction.scrub()` returns the shape a scrub almost always takes — an x crosshair, haptics,
the nearest mark rather than the axis slice, and no built-in tooltip — with anything you pass
winning over it. Every chart in the examples had been writing those four out by hand, which is
four chances to leave one off and no signal when you do.

`ChartInteractionHandler` names what `onInteraction` takes, so an app declaring its own handler
no longer reaches for `Parameters<typeof Chart.Line>[0]['onInteraction']` to spell it.
