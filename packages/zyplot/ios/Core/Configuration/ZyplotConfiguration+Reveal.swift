import Foundation

extension ZyplotConfiguration {
  var resolvedReveal: ZyplotRevealAnimation? {
    guard animation?.enabled != false,
          animation?.initial != false,
          let reveal = animation?.reveal,
          reveal.isEnabled
    else {
      return nil
    }
    guard reveal.isDrawn, !Self.tracedKinds.contains(type) else { return reveal }
    var fallback = reveal
    fallback.style = "fade"
    return fallback
  }

  private static let tracedKinds: Set<String> = [
    "area", "candlestick", "line", "sparkline", "time-series",
  ]

  func domainPinned() -> ZyplotConfiguration {
    guard let reveal = resolvedReveal, reveal.isDrawn else { return self }
    guard yAxis?.domain?.min == nil || yAxis?.domain?.max == nil,
          let domain = resolvedValueDomain
    else {
      return self
    }
    var copy = self
    var axis = copy.yAxis ?? ZyplotAxisOptions()
    axis.domain = ZyplotAxisDomain(max: domain.upperBound, min: domain.lowerBound)
    copy.yAxis = axis
    return copy
  }

  var resolvedValueDomain: ClosedRange<Double>? {
    guard let extent = valueDomain else { return nil }
    let domain = yAxis?.domain
    let inset = (extent.upperBound - extent.lowerBound) * (domain?.padding ?? 0)
    let lower = domain?.min ?? extent.lowerBound - inset
    let upper = domain?.max ?? extent.upperBound + inset
    return upper > lower ? lower...upper : nil
  }

  func traced(to state: ZyplotRevealState) -> ZyplotConfiguration {
    guard let reveal = resolvedReveal, reveal.isDrawn, state.isTracing else {
      return self
    }
    var copy = self
    copy.isTracing = true
    copy.revealTrack = reveal.trackColor == nil ? nil : series
    copy.series = series?.map { series in
      var traced = series
      traced.values = series.values.map { Self.traced(known: $0, to: state.fraction) }
      return traced
    }
    copy.candlesticks = candlesticks.map { Self.traced($0, to: state.fraction) }
    if type == "sparkline" {
      copy.values = values.map { Self.traced($0, to: state.fraction) }
    }
    copy.points = points.map { points in
      ZyplotTimePoints(
        timestamps: Self.traced(points.timestamps, to: state.fraction),
        values: points.values.map { Self.traced($0, to: state.fraction) }
      )
    }
    return copy
  }

  var valueDomain: ClosedRange<Double>? {
    var numbers = resolvedSeries.flatMap { ($0.values ?? []).compactMap { $0 } }
    numbers += (candlesticks ?? []).flatMap { [$0.low, $0.high] }
    numbers += (points?.values ?? []).flatMap { $0.compactMap { $0 } }
    if type == "sparkline" {
      numbers += values ?? []
    }
    guard let low = numbers.min(), let high = numbers.max(), high > low else {
      return nil
    }
    return low...high
  }

  private static func traced(
    known values: [Double?],
    to fraction: Double
  ) -> [Double?] {
    guard let last = values.lastIndex(where: { $0 != nil }) else { return values }
    return traced(Array(values.prefix(last + 1)), to: fraction)
  }

  private static func traced<Element>(
    _ elements: [Element],
    to fraction: Double
  ) -> [Element] {
    let count = Int((Double(elements.count) * fraction).rounded(.down))
    return Array(elements.prefix(Swift.max(1, count)))
  }
}
