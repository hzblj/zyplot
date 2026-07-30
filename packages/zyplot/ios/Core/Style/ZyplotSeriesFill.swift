import Foundation

struct ZyplotSeriesFill: Codable {
  var baseline: Double?
  var dotSize: Double?
  var fadeTo: Double?
  var pattern: String?
  var spacing: Double?
  var isDotted: Bool { pattern == "dots" }
  var resolvedDotSize: Double { Swift.max(0.5, dotSize ?? 1) }
  var resolvedFadeTo: Double { (fadeTo ?? 1).clamped() }
  var resolvedSpacing: Double { Swift.max(1, spacing ?? 4) }
}

extension Double {
  func clamped() -> Double { Swift.min(1, Swift.max(0, self)) }
}
