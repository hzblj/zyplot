import SwiftUI

struct ZyplotGlow: Codable {
  var color: String?
  var opacity: Double?
  var radius: Double?

  func color(inheriting base: Color) -> Color {
    (color.map(Color.init(hex:)) ?? base).opacity(opacity ?? 0.55)
  }

  var resolvedRadius: Double { radius ?? 6 }
  var resolvedOpacity: Double { opacity ?? 0.55 }
}

struct ZyplotHalo: Codable {
  var color: String?
  var opacity: Double?
  var size: Double?

  func color(inheriting base: Color) -> Color {
    (color.map(Color.init(hex:)) ?? base).opacity(opacity ?? 1)
  }

  var resolvedSize: Double { size ?? 12 }
}
