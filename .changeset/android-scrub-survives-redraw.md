---
'@hzblj/zyplot': patch
---

Stop an Android scrub dying on the redraw its own first report causes.

The Compose gesture detectors, the scrub state and the entrance animation were all keyed on
the configuration string — the whole serialised payload. That holds while a chart is only
read from, and breaks the moment an app answers `onInteraction` by changing the chart: a
dimmed end dot, an annotation moved to the reading, anything at all. The first touch reports
`began`, the app re-renders, a new string arrives, and Compose tears down the `pointerInput`
under the finger. A detector restarted mid-gesture is waiting on `awaitFirstDown` for a
finger that is already down, so every move for the rest of that drag goes nowhere. Lift and
touch again and it works, because by then the payload has stopped changing — which is why
this read as a scrub that took two goes rather than one that was broken.

The scrub and the entrance now key on the dataset, the way the morph and crossfade already
did — the entrance on the end of the loading skeleton as well, which is the other moment a
chart is first seen — and the detectors are started once and read the current handlers rather
than the ones composed alongside them. A change of data still clears the reading and still
plays the entrance; a change of styling or annotations no longer touches either. The entrance
also stops being restarted mid-scrub, which on a chart with `animation.delay` set was holding
the trace at nothing for the length of that delay on every touch report.

iOS was never affected: SwiftUI holds the selection in `@State` on a view whose identity does
not depend on the payload.
