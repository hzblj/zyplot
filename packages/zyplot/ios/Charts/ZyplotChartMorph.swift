import SwiftUI

struct ZyplotChartMorph<Content: View>: View {
  let configuration: ZyplotConfiguration
  @ViewBuilder let content: (ZyplotConfiguration) -> Content

  @State private var from: ZyplotConfiguration?
  @State private var shown: ZyplotConfiguration?
  @State private var startedAt: Date?
  @State private var runs = 0

  private var morphs: Bool {
    configuration.animation?.transition == "morph" && configuration.animation?.enabled != false
  }

  private var duration: Double {
    configuration.animation?.transitionSeconds ?? 0.32
  }

  var body: some View {
    let arriving = held
    TimelineView(.animation(paused: startedAt == nil)) { timeline in
      content(arriving ?? dataset(at: timeline.date))
        .transaction { transaction in
          if startedAt != nil || arriving != nil {
            transaction.animation = nil
          }
        }
    }
    .onChange(of: configuration.datasetKey) { _, _ in morph() }
    .onAppear { shown = configuration }
  }

  private var held: ZyplotConfiguration? {
    guard morphs, startedAt == nil, let shown,
          shown.datasetKey != configuration.datasetKey
    else {
      return nil
    }
    return shown.blended(towards: configuration, by: 0)?.stepped
  }

  private func dataset(at now: Date) -> ZyplotConfiguration {
    guard let from, let startedAt else { return configuration }
    let elapsed = now.timeIntervalSince(startedAt) / duration
    guard elapsed < 1 else { return configuration.stepped }
    let easing = configuration.animation?.transitionEasing ?? .easeInOut
    guard let moved = from.blended(towards: configuration, by: easing.progress(elapsed)) else {
      return configuration
    }
    return moved.stepped
  }

  private func onScreen(_ previous: ZyplotConfiguration) -> ZyplotConfiguration {
    guard let from, let startedAt else { return previous }
    let seconds = previous.animation?.transitionSeconds ?? 0.32
    let elapsed = Date().timeIntervalSince(startedAt) / seconds
    guard elapsed < 1 else { return previous }
    let easing = previous.animation?.transitionEasing ?? .easeInOut
    return from.blended(towards: previous, by: easing.progress(elapsed)) ?? previous
  }

  private func morph() {
    guard morphs, let previous = shown, previous.datasetKey != configuration.datasetKey else {
      shown = configuration
      return
    }
    from = onScreen(previous)
    shown = configuration
    startedAt = Date()
    runs += 1
    let run = runs
    Task {
      try? await Task.sleep(nanoseconds: UInt64(duration * 1_000_000_000))
      guard run == runs else { return }
      startedAt = nil
      from = nil
    }
  }
}

private func blend(_ from: Double, _ to: Double, _ progress: Double) -> Double {
  from + (to - from) * progress
}

extension ZyplotConfiguration {
  var stepped: ZyplotConfiguration {
    var copy = self
    copy.animation?.updates = false
    return copy
  }

  func blended(towards other: ZyplotConfiguration, by progress: Double) -> ZyplotConfiguration? {
    let before = resolvedSeries
    let after = other.resolvedSeries
    guard !before.isEmpty, before.count == after.count else { return nil }

    var copy = other
    var series: [ZyplotSeries] = []
    for (start, end) in zip(before, after) {
      guard let startValues = start.values, let endValues = end.values,
            startValues.count == endValues.count
      else {
        return nil
      }
      var moved = end
      moved.values = zip(startValues, endValues).map { first, second in
        guard let first, let second else { return second }
        return blend(first, second, progress)
      }
      series.append(moved)
    }
    copy.series = series
    copy.yAxis = Self.blended(axis: yAxis, towards: other.yAxis, by: progress)
    copy.annotations = Self.blended(
      annotations: annotations,
      towards: other.annotations,
      by: progress
    )
    return copy
  }

  private static func blended(
    axis from: ZyplotAxisOptions?,
    towards to: ZyplotAxisOptions?,
    by progress: Double
  ) -> ZyplotAxisOptions? {
    guard var moved = to, let start = from?.domain, let end = to?.domain else { return to }
    var domain = end
    if let low = start.min, let high = end.min {
      domain.min = blend(low, high, progress)
    }
    if let low = start.max, let high = end.max {
      domain.max = blend(low, high, progress)
    }
    moved.domain = domain
    return moved
  }

  private static func blended(
    annotations from: [ZyplotAnnotation]?,
    towards to: [ZyplotAnnotation]?,
    by progress: Double
  ) -> [ZyplotAnnotation]? {
    guard let to else { return nil }
    guard let from else { return to }
    let starting = Dictionary(from.map { ($0.id, $0) }, uniquingKeysWith: { first, _ in first })

    return to.map { annotation in
      guard let start = starting[annotation.id] else { return annotation }
      var moved = annotation
      if case .number(let low)? = start.value, case .number(let high)? = annotation.value {
        moved.value = .number(blend(low, high, progress))
      }
      if let low = start.y, let high = annotation.y {
        moved.y = blend(low, high, progress)
      }
      return moved
    }
  }
}
