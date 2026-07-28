import Foundation

enum ZyplotCoordinate: Codable {
  case number(Double)
  case text(String)

  init(from decoder: Decoder) throws {
    let container = try decoder.singleValueContainer()
    if let number = try? container.decode(Double.self) {
      self = .number(number)
      return
    }
    self = .text(try container.decode(String.self))
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.singleValueContainer()
    switch self {
    case .number(let value):
      try container.encode(value)
    case .text(let value):
      try container.encode(value)
    }
  }
}

struct ZyplotAxisDomain: Codable {
  var max: Double?
  var min: Double?
}

struct ZyplotAxisOptions: Codable {
  var domain: ZyplotAxisDomain?
  var format: ZyplotNumberFormat?
  var grid: Bool?
  var gridDash: [Double]?
  var label: String?
  var labelRotation: Double?
  var position: String?
  var plotDimensionEndPadding: Double?
  var plotDimensionStartPadding: Double?
  var reversed: Bool?
  var scale: String?
  var scrollPosition: ZyplotCoordinate?
  var tickCount: Int?
  var tickValues: [ZyplotCoordinate]?
  var visible: Bool?
  var visibleDomain: Double?
}

struct ZyplotPlotPadding: Codable {
  var bottom: Double?
  var left: Double?
  var right: Double?
  var top: Double?
}

enum ZyplotPlotPaddingValue: Codable {
  case edges(ZyplotPlotPadding)
  case value(Double)

  init(from decoder: Decoder) throws {
    let container = try decoder.singleValueContainer()
    if let number = try? container.decode(Double.self) {
      self = .value(number)
      return
    }
    self = .edges(try container.decode(ZyplotPlotPadding.self))
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.singleValueContainer()
    switch self {
    case .edges(let value):
      try container.encode(value)
    case .value(let value):
      try container.encode(value)
    }
  }
}

struct ZyplotPlotStyle: Codable {
  var backgroundColor: String?
  var borderColor: String?
  var borderRadius: Double?
  var borderWidth: Double?
  var clip: Bool?
  var padding: ZyplotPlotPaddingValue?
}

struct ZyplotSeriesStyle: Codable {
  var color: String?
  var fillOpacity: Double?
  var opacity: Double?
  var strokeDash: [Double]?
  var strokeWidth: Double?
  var symbol: String?
  var symbolSize: Double?
}

struct ZyplotAnimationOptions: Codable {
  var delay: Double?
  var duration: Double?
  var easing: String?
  var enabled: Bool?
  var initial: Bool?
  var updates: Bool?
}

struct ZyplotInteractionOptions: Codable {
  var crosshair: String?
  var dimOpacity: Double?
  var haptics: Bool?
  var highlightScale: Double?
  var hover: String?
  var pan: Bool?
  var selection: String?
  var tooltip: Bool?
  var zoom: Bool?

  var isEnabled: Bool {
    hover != nil || crosshair != nil || selection != nil || tooltip == true
  }
}

struct ZyplotAnnotation: Codable, Identifiable {
  var axis: String?
  var color: String?
  var dash: [Double]?
  var end: ZyplotCoordinate?
  var id: String
  var label: String?
  var opacity: Double?
  var start: ZyplotCoordinate?
  var text: String?
  var type: String
  var value: ZyplotCoordinate?
  var x: ZyplotCoordinate?
  var y: Double?
}
