import Foundation

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
