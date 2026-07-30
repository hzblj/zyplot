import SwiftUI

/// Resolves `theme.typography.fontFamily` into a font, for the views that are handed a
/// family rather than the whole configuration.
enum ZyplotFont {
  /// The family, but only once the app has actually registered it.
  ///
  /// `Font.custom` falls back to the system font in silence, so a misspelled family
  /// would render exactly like no family at all with nothing to tell them apart.
  /// `UIFont(name:size:)` is the one lookup that answers honestly, and it is the same
  /// one a React Native `<Text>` resolves a `fontFamily` through — a font that works
  /// there works here.
  static func resolve(_ family: String?) -> String? {
    guard let family, !family.isEmpty, UIFont(name: family, size: 12) != nil else {
      return nil
    }
    return family
  }

  /// A font at a fixed point size.
  ///
  /// `design` is dropped by a custom family, which has one design of its own — that is
  /// the trade a caller makes by naming a font.
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

  /// A font that still scales with a text style, for the labels that were semantic fonts
  /// before a family could be named. Dynamic Type keeps working either way.
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
