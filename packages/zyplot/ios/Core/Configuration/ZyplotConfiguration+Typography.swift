import SwiftUI

extension ZyplotConfiguration {
  var fontFamily: String? {
    ZyplotFont.resolve(theme?.typography?.fontFamily)
  }

  func font(size: CGFloat, weight: Font.Weight = .regular, design: Font.Design = .default) -> Font {
    ZyplotFont.font(fontFamily, size: size, weight: weight, design: design)
  }

  func font(_ style: Font.TextStyle, size: CGFloat, weight: Font.Weight = .regular) -> Font {
    ZyplotFont.font(fontFamily, style: style, size: size, weight: weight)
  }
}
