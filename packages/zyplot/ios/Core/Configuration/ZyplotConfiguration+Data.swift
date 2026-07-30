import Foundation

extension ZyplotConfiguration {
  var histogramBins: [ZyplotHistogramBin] {
    let observations = values ?? []
    guard let minimum = observations.min(), let maximum = observations.max() else {
      return []
    }
    guard maximum > minimum else {
      return [
        ZyplotHistogramBin(lower: minimum, upper: minimum + 1, count: observations.count),
      ]
    }
    let count = Swift.max(1, binCount ?? 8)
    let width = (maximum - minimum) / Double(count)
    var counts = Array(repeating: 0, count: count)
    for value in observations {
      counts[Swift.min(count - 1, Int((value - minimum) / width))] += 1
    }
    return counts.enumerated().map { offset, binned in
      let lower = minimum + Double(offset) * width
      return ZyplotHistogramBin(lower: lower, upper: lower + width, count: binned)
    }
  }

  var resolvedSeries: [ZyplotSeries] { series ?? [] }
  var resolvedCategories: [String] {
    categories ?? candlesticks?.map(\.category) ?? []
  }
  var resolvedData: [ZyplotDatum] { data ?? [] }

  var lastReadableIndex: Int? {
    if let candles = candlesticks, !candles.isEmpty {
      return candles.count - 1
    }
    guard let values = resolvedSeries.first?.values else { return nil }
    return values.lastIndex { $0 != nil }
  }

  var categorySpan: (first: String, last: String)? {
    let categories = resolvedCategories
    guard let first = categories.first,
          let last = categories.last,
          first != last,
          Set(categories).count == categories.count
    else {
      return nil
    }
    return (first, last)
  }

  func dimming(for id: String) -> Double {
    guard let emphasisId, !emphasisId.isEmpty, emphasisId != id else { return 1 }
    return interaction?.dimOpacity ?? 0.25
  }

  func seriesStyle(for id: String) -> ZyplotSeriesStyle? {
    seriesStyles?[id]
  }
}
