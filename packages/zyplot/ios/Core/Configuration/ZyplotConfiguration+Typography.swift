import SwiftUI

extension ZyplotConfiguration {
  /// The family the theme names, if the app registered it. See `ZyplotFont.resolve`.
  var fontFamily: String? {
    ZyplotFont.resolve(theme?.typography?.fontFamily)
  }

  /// A font at a fixed point size, in the theme's family when there is one.
  func font(size: CGFloat, weight: Font.Weight = .regular, design: Font.Design = .default) -> Font {
    ZyplotFont.font(fontFamily, size: size, weight: weight, design: design)
  }

  /// A font that still scales with a text style, for the labels that were semantic fonts
  /// before a family could be named.
  func font(_ style: Font.TextStyle, size: CGFloat, weight: Font.Weight = .regular) -> Font {
    ZyplotFont.font(fontFamily, style: style, size: size, weight: weight)
  }
}
