import Foundation

struct ZyplotAxes: Codable {
  var x: Bool?
  var y: Bool?
}

struct ZyplotAxisDomain: Codable {
  var max: Double?
  var min: Double?
  var padding: Double?
}

struct ZyplotAxisOptions: Codable {
  var domain: ZyplotAxisDomain?
  var format: ZyplotNumberFormat?
  var grid: Bool?
  var gridDash: [Double]?
  var label: String?
  var labelEdgeAlign: Bool?
  var labelInset: Double?
  var labelRotation: Double?
  var labelSize: Double?
  var position: String?
  var plotDimensionEndPadding: Double?
  var plotDimensionStartPadding: Double?
  var minorTicks: Bool?
  var tickCount: Int?
  var ticks: Bool?
  var tickValues: [ZyplotCoordinate]?
  var visible: Bool?
  var visibleDomain: Double?

  var numericTickValues: [Double]? {
    guard let tickValues else { return nil }
    let numbers = tickValues.compactMap { value -> Double? in
      if case .number(let number) = value { return number }
      return nil
    }
    return numbers.isEmpty ? nil : numbers
  }

  /// The ticks a category axis was given. Without these it falls back to a desired count, which
  /// on a band scale is every category — thirty-one labels in the room for four.
  var categoryTickValues: [String]? {
    guard let tickValues else { return nil }
    let labels = tickValues.compactMap { value -> String? in
      if case .text(let label) = value { return label }
      return nil
    }
    return labels.isEmpty ? nil : labels
  }
}
