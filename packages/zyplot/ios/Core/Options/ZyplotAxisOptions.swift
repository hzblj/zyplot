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
  var labelInset: Double?
  var labelRotation: Double?
  var labelSize: Double?
  var position: String?
  var plotDimensionEndPadding: Double?
  var plotDimensionStartPadding: Double?
  var reversed: Bool?
  var scale: String?
  var scrollPosition: ZyplotCoordinate?
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
}
