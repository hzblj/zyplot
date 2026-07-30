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
