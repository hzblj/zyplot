import Foundation

struct ZyplotPulse: Codable {
  var color: String?
  var duration: Double?
  var interval: Double?
  var opacity: Double?
  var scale: Double?

  private(set) var isEnabled = true

  var bloomSeconds: Double { (duration ?? 450) / 1_000 }
  var restSeconds: Double { (interval ?? 1_550) / 1_000 }
  var resolvedOpacity: Double { opacity ?? 0.9 }
  var resolvedScale: Double { scale ?? 2.2 }

  private enum CodingKeys: String, CodingKey {
    case color, duration, interval, opacity, scale
  }

  init(from decoder: Decoder) throws {
    if let flag = try? decoder.singleValueContainer().decode(Bool.self) {
      isEnabled = flag
      return
    }
    let container = try decoder.container(keyedBy: CodingKeys.self)
    color = try container.decodeIfPresent(String.self, forKey: .color)
    duration = try container.decodeIfPresent(Double.self, forKey: .duration)
    interval = try container.decodeIfPresent(Double.self, forKey: .interval)
    opacity = try container.decodeIfPresent(Double.self, forKey: .opacity)
    scale = try container.decodeIfPresent(Double.self, forKey: .scale)
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encodeIfPresent(color, forKey: .color)
    try container.encodeIfPresent(duration, forKey: .duration)
    try container.encodeIfPresent(interval, forKey: .interval)
    try container.encodeIfPresent(opacity, forKey: .opacity)
    try container.encodeIfPresent(scale, forKey: .scale)
  }
}
