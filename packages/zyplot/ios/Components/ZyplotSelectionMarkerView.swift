import SwiftUI

struct ZyplotSelectionMarkerView: View {
  let marker: ZyplotSelectionMarker
  let base: Color

  private var glowColor: Color {
    marker.glow?.color(inheriting: base) ?? .clear
  }

  @ViewBuilder
  var body: some View {
    if marker.isSegment {
      let radius = marker.glow?.resolvedRadius ?? 12
      Circle()
        .fill(
          RadialGradient(
            colors: [glowColor, glowColor.opacity(0)],
            center: .center,
            startRadius: 0,
            endRadius: radius
          )
        )
        .frame(width: radius * 2, height: radius * 2)
    } else {
      let size = marker.size ?? 9
      let radius = marker.glow?.resolvedRadius ?? 0
      Circle()
        .fill(base)
        .frame(width: size, height: size)
        .shadow(color: glowColor, radius: radius)
        .shadow(color: glowColor, radius: radius * 0.45)
    }
  }
}
