import SwiftUI

extension View {
  /// Applies the `surface` contract — the container around the plot.
  ///
  /// Padding goes on first so the background and the border enclose it rather
  /// than sitting inside it, which is what makes the inset read as part of the
  /// card instead of as empty plot area.
  @ViewBuilder
  func zyplotSurface(_ surface: ZyplotSurface?) -> some View {
    if let surface {
      let radius = surface.cornerRadius ?? 0
      self
        .padding(.leading, surface.padding?.left ?? 0)
        .padding(.trailing, surface.padding?.right ?? 0)
        .padding(.top, surface.padding?.top ?? 0)
        .padding(.bottom, surface.padding?.bottom ?? 0)
        .background(
          RoundedRectangle(cornerRadius: radius)
            .fill(surface.background.map { Color(hex: $0) } ?? .clear)
        )
        .overlay(
          RoundedRectangle(cornerRadius: radius)
            .strokeBorder(
              surface.border?.color.map { Color(hex: $0) } ?? .clear,
              lineWidth: surface.border?.width ?? 0
            )
        )
        .clipShape(RoundedRectangle(cornerRadius: radius))
    } else {
      self
    }
  }
}
