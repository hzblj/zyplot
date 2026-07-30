import SwiftUI

extension ZyplotConfiguration {
  func clamped(_ category: String) -> String {
    let categories = resolvedCategories
    guard let last = lastReadableIndex,
          let touched = categories.firstIndex(of: category),
          touched > last,
          categories.indices.contains(last)
    else {
      return category
    }
    return categories[last]
  }

  func clampedIndex(of category: String, in categories: [String]) -> Int? {
    guard let touched = categories.firstIndex(of: category) else { return nil }
    guard let last = lastReadableIndex,
          touched > last,
          categories.indices.contains(last)
    else {
      return touched
    }
    return last
  }

  func value(at category: String) -> Double? {
    guard let index = resolvedCategories.firstIndex(of: category) else { return nil }
    return value(atIndex: index)
  }

  func value(atIndex index: Int) -> Double? {
    seriesValue(in: resolvedSeries.first, at: index) ?? candleClose(at: index)
  }

  func seriesValue(in series: ZyplotSeries?, at index: Int) -> Double? {
    series?.values?[safe: index] ?? nil
  }

  func candleClose(at index: Int) -> Double? {
    candlesticks?[safe: index]?.close
  }

  func reading(at category: String) -> String? {
    if type == "boxplot" {
      guard let group = groups?.first(where: { $0.label == category }) else {
        return nil
      }
      return """
      \(category)
      \(labels?.max ?? "Max") \(formatted(group.max))
      \(labels?.q3 ?? "Q3") \(formatted(group.q3))
      \(labels?.median ?? "Median") \(formatted(group.median))
      \(labels?.q1 ?? "Q1") \(formatted(group.q1))
      \(labels?.min ?? "Min") \(formatted(group.min))
      """
    }
    guard let value = value(at: category) else { return nil }
    return "\(category)  \(formatted(value))"
  }

  func candlestickRows(at category: String) -> [ZyplotCandlestickRow]? {
    guard let labels,
          let candle = candlesticks?.first(where: { $0.category == category })
    else {
      return nil
    }
    let change = candle.open == 0
      ? 0
      : (candle.close - candle.open) / candle.open * 100
    let readings: [(String, String?, Double)] = [
      ("open", labels.open, candle.open),
      ("close", labels.close, candle.close),
      ("high", labels.high, candle.high),
      ("low", labels.low, candle.low),
    ]
    var rows: [ZyplotCandlestickRow] = readings.compactMap { id, label, value in
      label.map {
        ZyplotCandlestickRow(id: id, label: $0, value: formatted(value), trend: nil)
      }
    }
    if let label = labels.change {
      let percent = ZyplotNumberFormat(
        decimals: 2,
        locale: format?.locale,
        suffix: " %"
      )
      rows.append(
        ZyplotCandlestickRow(
          id: "change",
          label: label,
          value: percent.string(from: change),
          trend: change
        )
      )
    }
    return rows.isEmpty ? nil : rows
  }

  func trendColor(_ trend: Double?) -> Color {
    guard let trend else { return .primary }
    return Color(
      hex: trend < 0
        ? style?.downColor ?? theme?.colors?.negative ?? "#dc2626"
        : style?.upColor ?? theme?.colors?.positive ?? "#16a34a"
    )
  }

  func formatted(_ value: Double) -> String {
    (format ?? ZyplotNumberFormat()).string(from: value)
  }
}
