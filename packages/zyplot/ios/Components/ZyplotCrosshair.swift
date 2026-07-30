import SwiftUI

struct ZyplotCrosshair: View {
  let style: ZyplotCrosshairStyle?
  let height: Double

  private var width: Double { style?.width ?? 1 }

  var body: some View {
    Rectangle()
      .fill(style?.color.map(Color.init(hex:)) ?? Color.secondary.opacity(0.32))
      .frame(width: width, height: height)
      .mask {
        if let dash = style?.dash, !dash.isEmpty {
          ZyplotDashedRule()
            .stroke(
              style: StrokeStyle(lineWidth: width, dash: dash.map { CGFloat($0) })
            )
        } else {
          Rectangle()
        }
      }
  }
}
