import SwiftUI

struct ZyplotChartReveal<Content: View>: View {
  let configuration: ZyplotConfiguration
  @ViewBuilder let content: (ZyplotConfiguration, ZyplotRevealState) -> Content

  @State private var startedAt: Date?
  @State private var hasSettled = false

  var body: some View {
    if let reveal = configuration.resolvedReveal, !hasSettled {
      let pinned = configuration.domainPinned()
      TimelineView(.animation) { timeline in
        let state = state(for: reveal, at: timeline.date)
        content(pinned.traced(to: state), state)
          .opacity(state.opacity)
      }
      .task { await settle(reveal) }
    } else {
      content(configuration.domainPinned(), .settled)
    }
  }

  private func state(
    for reveal: ZyplotRevealAnimation,
    at now: Date
  ) -> ZyplotRevealState {
    let delay = (configuration.animation?.delay ?? 0) / 1_000
    let elapsed = (startedAt.map { now.timeIntervalSince($0) } ?? 0) - delay
    guard elapsed > 0 else {
      return reveal.isDrawn
        ? ZyplotRevealState(
          fraction: 0,
          flash: 1,
          isTracing: true,
          startOpacity: reveal.resolvedStartOpacity
        )
        : ZyplotRevealState(opacity: 0)
    }
    if reveal.isFaded {
      return ZyplotRevealState(opacity: reveal.resolvedEasing.progress(elapsed / reveal.seconds))
    }
    if elapsed < reveal.seconds {
      return ZyplotRevealState(
        fraction: reveal.resolvedEasing.progress(elapsed / reveal.seconds),
        flash: 1,
        isTracing: true,
        startOpacity: reveal.resolvedStartOpacity
      )
    }
    let landed = elapsed - reveal.seconds
    guard landed >= reveal.holdSeconds else { return ZyplotRevealState(flash: 1) }
    let settling = (landed - reveal.holdSeconds) / max(reveal.flashSeconds, 0.001)
    return ZyplotRevealState(flash: 1 - reveal.resolvedFlashEasing.progress(settling))
  }

  private func settle(_ reveal: ZyplotRevealAnimation) async {
    startedAt = Date()
    let total = (configuration.animation?.delay ?? 0) / 1_000
      + reveal.seconds
      + (reveal.isDrawn ? reveal.holdSeconds + reveal.flashSeconds : 0)
    try? await Task.sleep(nanoseconds: UInt64(total * 1_000_000_000))
    hasSettled = true
  }
}
