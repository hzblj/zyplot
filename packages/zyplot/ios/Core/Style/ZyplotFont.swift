import SwiftUI

enum ZyplotFont {
  static func resolve(_ family: String?) -> String? {
    guard let family, !family.isEmpty, UIFont(name: family, size: 12) != nil else {
      return nil
    }
    return family
  }

  static func font(
    _ family: String?,
    size: CGFloat,
    weight: Font.Weight = .regular,
    design: Font.Design = .default
  ) -> Font {
    guard let resolved = resolve(family) else {
      return .system(size: size, weight: weight, design: design)
    }
    return .custom(resolved, fixedSize: size).weight(weight)
  }

  static func font(
    _ family: String?,
    style: Font.TextStyle,
    size: CGFloat,
    weight: Font.Weight = .regular
  ) -> Font {
    guard let resolved = resolve(family) else {
      return .system(style, design: .default, weight: weight)
    }
    return .custom(resolved, size: size, relativeTo: style).weight(weight)
  }
}
