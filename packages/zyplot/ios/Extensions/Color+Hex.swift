import SwiftUI

extension Color {
  init(hex: String) {
    let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    var value: UInt64 = 0
    Scanner(string: cleaned).scanHexInt64(&value)

    let red: Double
    let green: Double
    let blue: Double
    let alpha: Double

    switch cleaned.count {
    case 8:
      red = Double((value >> 24) & 0xff) / 255
      green = Double((value >> 16) & 0xff) / 255
      blue = Double((value >> 8) & 0xff) / 255
      alpha = Double(value & 0xff) / 255
    default:
      red = Double((value >> 16) & 0xff) / 255
      green = Double((value >> 8) & 0xff) / 255
      blue = Double(value & 0xff) / 255
      alpha = 1
    }

    self.init(.sRGB, red: red, green: green, blue: blue, opacity: alpha)
  }

  func blended(with other: Color, amount: Double) -> Color {
    let ratio = min(max(amount, 0), 1)
    guard ratio > 0 else { return self }
    guard ratio < 1 else { return other }
    let from = UIColor(self).components
    let to = UIColor(other).components
    return Color(
      .sRGB,
      red: from.red + (to.red - from.red) * ratio,
      green: from.green + (to.green - from.green) * ratio,
      blue: from.blue + (to.blue - from.blue) * ratio,
      opacity: from.alpha + (to.alpha - from.alpha) * ratio
    )
  }
}

private extension UIColor {
  var components: (red: Double, green: Double, blue: Double, alpha: Double) {
    var red: CGFloat = 0
    var green: CGFloat = 0
    var blue: CGFloat = 0
    var alpha: CGFloat = 0
    getRed(&red, green: &green, blue: &blue, alpha: &alpha)
    return (Double(red), Double(green), Double(blue), Double(alpha))
  }
}
