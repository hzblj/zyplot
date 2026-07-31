import SwiftUI

/**
 Walks the step-back strength towards a target over time and hands each step to its content.

 The trace is drawn in a `Canvas`, and a plain `Double` inside a canvas closure is not animatable —
 `withAnimation` around one changes nothing but the value it jumps to. So the frames are driven the
 same way the reveal and the morph drive theirs: a timeline, running only while there is a ramp left
 to run. Belongs above the chart with those two rather than in a `chartBackground` beside the canvas
 it feeds, because the state it walks has to outlive every layout of the plot.
 */
struct ZyplotDimRamp<Content: View>: View {
  let target: Double
  let seconds: Double
  @ViewBuilder let content: (Double) -> Content

  @State private var from: Double = 1
  @State private var startedAt: Date?
  @State private var runs = 0

  var body: some View {
    TimelineView(.animation(paused: startedAt == nil)) { timeline in
      content(strength(towards: target, at: timeline.date))
    }
    .onChange(of: target) { previous, _ in ramp(leaving: previous) }
  }

  /**
   How far a ramp towards a goal has got. The goal is passed in rather than read off `target`,
   because a turn is started from a view that already holds the new one: what is on screen when the
   finger lifts belongs to the ramp that was running, and its goal is the one being left behind.
   */
  private func strength(towards goal: Double, at now: Date) -> Double {
    guard seconds > 0, let startedAt else { return goal }
    let elapsed = now.timeIntervalSince(startedAt) / seconds
    guard elapsed < 1 else { return goal }
    let progress = elapsed < 0.5
      ? 4 * pow(elapsed, 3)
      : 1 - pow(-2 * elapsed + 2, 3) / 2
    return from + (goal - from) * progress
  }

  private func ramp(leaving previous: Double) {
    guard seconds > 0 else { return }
    from = strength(towards: previous, at: Date())
    startedAt = Date()
    runs += 1
    let run = runs
    Task {
      try? await Task.sleep(nanoseconds: UInt64(seconds * 1_000_000_000))
      guard run == runs else { return }
      startedAt = nil
    }
  }
}
