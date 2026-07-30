import Foundation

struct ZyplotSurfaceBorder: Codable {
  var color: String?
  var width: Double?
}

struct ZyplotSurface: Codable {
  var background: String?
  var border: ZyplotSurfaceBorder?
  var cornerRadius: Double?
  var padding: ZyplotSurfacePadding?
}

struct ZyplotSurfacePadding: Codable {
  var bottom: Double = 0
  var left: Double = 0
  var right: Double = 0
  var top: Double = 0

  private enum CodingKeys: String, CodingKey {
    case bottom, horizontal, left, right, top, vertical
  }

  init(from decoder: Decoder) throws {
    if let all = try? decoder.singleValueContainer().decode(Double.self) {
      bottom = all
      left = all
      right = all
      top = all
      return
    }
    let container = try decoder.container(keyedBy: CodingKeys.self)
    let horizontal = try container.decodeIfPresent(Double.self, forKey: .horizontal)
    let vertical = try container.decodeIfPresent(Double.self, forKey: .vertical)
    bottom = try container.decodeIfPresent(Double.self, forKey: .bottom) ?? vertical ?? 0
    left = try container.decodeIfPresent(Double.self, forKey: .left) ?? horizontal ?? 0
    right = try container.decodeIfPresent(Double.self, forKey: .right) ?? horizontal ?? 0
    top = try container.decodeIfPresent(Double.self, forKey: .top) ?? vertical ?? 0
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(bottom, forKey: .bottom)
    try container.encode(left, forKey: .left)
    try container.encode(right, forKey: .right)
    try container.encode(top, forKey: .top)
  }
}
